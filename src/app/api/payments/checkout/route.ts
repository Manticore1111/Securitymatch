import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { getPlatformCommissionPercent, introductoryPlatformCommissionPercent } from "@/lib/platform-settings";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") return NextResponse.json({ error: "Alleen opdrachtgevers kunnen betalen." }, { status: 403 });
  const { jobId, agreementAccepted, agreementVersion } = await request.json();
  if (typeof jobId !== "string") return NextResponse.json({ error: "Opdracht-ID ontbreekt." }, { status: 400 });
  if (agreementAccepted !== true || agreementVersion !== "payment-agreement-v1") return NextResponse.json({ error: "Je moet eerst akkoord gaan met de overeenkomst." }, { status: 400 });
  const job = await prisma.job.findFirst({ where: { id: jobId, clientId: session.user.id, status: { in: ["ASSIGNED", "CONFIRMED", "COMPLETED"] }, assignedProfessionalId: { not: null } }, include: { assignedProfessional: { select: { userId: true, stripeAccountId: true } } } });
  if (!job?.assignedProfessional) return NextResponse.json({ error: "Deze opdracht kan nog niet worden betaald." }, { status: 400 });
  if (!job.assignedProfessional.stripeAccountId) return NextResponse.json({ error: "De beveiliger heeft Stripe-uitbetalingen nog niet ingesteld." }, { status: 400 });
  const [paidPayment, paidPaymentCount] = await Promise.all([
    prisma.payment.findFirst({ where: { payerId: session.user.id, jobId: job.id, type: "CLIENT_PAYMENT", status: "PAID" }, select: { id: true } }),
    prisma.payment.count({ where: { payerId: session.user.id, type: "CLIENT_PAYMENT", status: "PAID" } }),
  ]);
  if (paidPayment) return NextResponse.json({ error: "Deze opdracht is al betaald." }, { status: 409 });
  let commissionPercent: number;
  try { commissionPercent = await getPlatformCommissionPercent(); } catch { return NextResponse.json({ error: "Ongeldige platformcommissie." }, { status: 500 }); }
  if (paidPaymentCount === 0) commissionPercent = introductoryPlatformCommissionPercent;
  const hours = Math.max(0, (job.endAt.getTime() - job.startAt.getTime()) / 3_600_000);
  const amountCents = Math.round(hours * job.hourlyRateCents);
  const platformFeeCents = Math.round(amountCents * commissionPercent / 100);
  const professionalAmountCents = amountCents - platformFeeCents;
  if (amountCents < 50) return NextResponse.json({ error: "Het betaalbedrag is te laag." }, { status: 400 });
  let stripe;
  try { stripe = getStripe(); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Stripe test mode is niet geconfigureerd." }, { status: 503 }); }
  const pendingPayment = await prisma.payment.findFirst({ where: { payerId: session.user.id, jobId: job.id, type: "CLIENT_PAYMENT", status: "PENDING" }, orderBy: { createdAt: "desc" }, select: { id: true, checkoutSessionId: true } });
  if (pendingPayment?.checkoutSessionId) {
    try {
      const checkout = await stripe.checkout.sessions.retrieve(pendingPayment.checkoutSessionId);
      if (checkout.status === "open" && checkout.url) return NextResponse.json({ url: checkout.url });
    } catch {
      // A stale session is cancelled below and replaced with a fresh checkout.
    }
  }
  if (pendingPayment) await prisma.payment.update({ where: { id: pendingPayment.id }, data: { status: "CANCELLED", agreementAcceptedAt: new Date(), agreementVersion } });
  const payment = await prisma.payment.create({ data: { payerId: session.user.id, jobId: job.id, amountCents, platformFeeCents, professionalAmountCents, currency: "EUR", type: "CLIENT_PAYMENT", provider: "stripe", status: "PENDING", agreementAcceptedAt: new Date(), agreementVersion } });
  try {
    const checkout = await stripe.checkout.sessions.create({ mode: "payment", line_items: [{ price_data: { currency: "eur", product_data: { name: job.title }, unit_amount: amountCents }, quantity: 1 }], success_url: `${process.env.AUTH_URL ?? "http://localhost:3000"}/dashboard/client?payment=success`, cancel_url: `${process.env.AUTH_URL ?? "http://localhost:3000"}/dashboard/client?payment=cancelled`, metadata: { paymentId: payment.id, jobId: job.id }, payment_intent_data: { application_fee_amount: platformFeeCents, transfer_data: { destination: job.assignedProfessional.stripeAccountId } } });
    await prisma.payment.update({ where: { id: payment.id }, data: { checkoutSessionId: checkout.id } });
    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Stripe checkout kon niet worden gestart." }, { status: 502 });
  }
}
