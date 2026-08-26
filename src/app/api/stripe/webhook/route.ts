import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Stripe-signature ontbreekt." }, { status: 400 });
  let event: Stripe.Event;
  try { const payload = await request.text(); event = getStripe().webhooks.constructEvent(payload, signature, getStripeWebhookSecret()); } catch { return NextResponse.json({ error: "Ongeldige Stripe-webhook." }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object as Stripe.Checkout.Session;
    const paymentId = checkout.metadata?.paymentId;
    if (paymentId && checkout.payment_status === "paid") {
      const existingPayment = await prisma.payment.findUnique({ where: { id: paymentId }, select: { status: true } });
      if (existingPayment?.status === "PAID") return NextResponse.json({ received: true });
      const payment = await prisma.payment.update({ where: { id: paymentId }, data: { status: "PAID", providerId: typeof checkout.payment_intent === "string" ? checkout.payment_intent : null, paidAt: new Date() }, include: { job: { include: { client: true, assignedProfessional: { include: { user: true } } } } } });
      if (payment.job?.assignedProfessional) {
        const hours = Number(((payment.job.endAt.getTime() - payment.job.startAt.getTime()) / 3_600_000).toFixed(2));
        const existingPayout = await prisma.payout.findFirst({ where: { paymentId: payment.id }, select: { id: true } });
        if (existingPayout) {
          await prisma.payout.update({ where: { id: existingPayout.id }, data: { amountCents: payment.professionalAmountCents, status: "PENDING" } });
        } else {
          await prisma.payout.create({ data: { paymentId: payment.id, professionalId: payment.job.assignedProfessional.userId, amountCents: payment.professionalAmountCents, currency: payment.currency, status: "PENDING" } });
        }
        const invoiceExists = await prisma.invoice.findFirst({ where: { paymentId: payment.id }, select: { id: true } });
        if (!invoiceExists) await prisma.invoice.create({ data: { recipientId: payment.payerId, clientId: payment.payerId, professionalId: payment.job.assignedProfessional.userId, jobId: payment.job.id, paymentId: payment.id, number: `SM-${new Date().getFullYear()}-${payment.id.slice(0, 8).toUpperCase()}`, amountCents: payment.amountCents, hours, hourlyRateCents: payment.job.hourlyRateCents, vatCents: 0, commissionCents: payment.platformFeeCents, status: "PAID", issuedAt: new Date(), paidAt: new Date() } });
      }
    }
  }
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    if (typeof intent.id === "string") await prisma.payment.updateMany({ where: { providerId: intent.id }, data: { status: "FAILED" } });
  }
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    if (typeof charge.payment_intent === "string") await prisma.payment.updateMany({ where: { providerId: charge.payment_intent }, data: { status: "REFUNDED" } });
  }
  return NextResponse.json({ received: true });
}
