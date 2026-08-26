import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SECURITY_PROFESSIONAL") return NextResponse.json({ error: "Alleen beveiligers kunnen uitbetalingen instellen." }, { status: 403 });
  const profile = await prisma.securityProfile.findUnique({ where: { userId: session.user.id } });
  if (!profile) return NextResponse.json({ error: "Beveiligersprofiel ontbreekt." }, { status: 400 });
  try {
    const stripe = getStripe();
    const account = profile.stripeAccountId ? { id: profile.stripeAccountId } : await stripe.accounts.create({ type: "express", country: "NL", capabilities: { transfers: { requested: true } }, email: session.user.email ?? undefined });
    if (!profile.stripeAccountId) await prisma.securityProfile.update({ where: { id: profile.id }, data: { stripeAccountId: account.id } });
    const link = await stripe.accountLinks.create({ account: account.id, refresh_url: `${process.env.AUTH_URL ?? "http://localhost:3000"}/dashboard/security/profile?connect=retry`, return_url: `${process.env.AUTH_URL ?? "http://localhost:3000"}/dashboard/security/profile?connect=success`, type: "account_onboarding" });
    return NextResponse.json({ url: link.url });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Stripe Connect instellen is niet gelukt." }, { status: 503 }); }
}
