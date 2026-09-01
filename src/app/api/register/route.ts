import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth-validation";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { legalTermsVersion } from "@/lib/legal";
import { recordRegistrationFailure } from "@/lib/registration-audit";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    await recordRegistrationFailure({ request, reason: "Het registratieformulier bevatte geen geldige JSON." });
    return NextResponse.json({ error: "Het registratieformulier kon niet worden gelezen. Vul alle velden opnieuw in." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    await recordRegistrationFailure({ request, data: body as Record<string, unknown>, reason: parsed.error.issues[0]?.message ?? "Ongeldige gegevens." });
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige gegevens." }, { status: 400 });
  }
  if (parsed.data.role === "ADMIN") {
    await recordRegistrationFailure({ request, data: parsed.data, reason: "Adminaccounts worden alleen door de beheerder aangemaakt." });
    return NextResponse.json({ error: "Adminaccounts worden alleen door de beheerder aangemaakt." }, { status: 403 });
  }

  const emailVerification = await prisma.registrationEmailVerification.findFirst({ where: { email: parsed.data.email, verificationTokenHash: createHash("sha256").update(parsed.data.emailVerificationToken).digest("hex"), verifiedAt: { not: null }, consumedAt: null, expiresAt: { gt: new Date() } } });
  if (!emailVerification) {
    await recordRegistrationFailure({ request, data: parsed.data, reason: "Het e-mailadres is niet bevestigd." });
    return NextResponse.json({ error: "Bevestig eerst je e-mailadres met de code die je hebt ontvangen." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    await recordRegistrationFailure({ request, data: parsed.data, reason: "Dit e-mailadres is al geregistreerd.", userId: existing.id });
    return NextResponse.json({ error: "Registreren mislukt: dit e-mailadres is al geregistreerd. Gebruik een ander e-mailadres of log in." }, { status: 409 });
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const created = await transaction.user.create({
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          email: parsed.data.email,
          passwordHash: await hashPassword(parsed.data.password),
          role: parsed.data.role,
          status: "ACTIVE",
          emailVerifiedAt: emailVerification.verifiedAt,
          termsAcceptedAt: new Date(),
          termsVersion: legalTermsVersion,
        },
      });
      await transaction.auditLog.create({
        data: {
          actorId: created.id,
          action: "TERMS_ACCEPTED",
          entityType: "User",
          entityId: created.id,
          metadata: { version: legalTermsVersion },
        },
      });
      await transaction.registrationEmailVerification.update({ where: { id: emailVerification.id }, data: { consumedAt: new Date() } });
    });
  } catch (error) {
    console.error("Registration failed", error);
    await recordRegistrationFailure({ request, data: parsed.data, reason: "Technische fout tijdens het aanmaken van het account." });
    return NextResponse.json({ error: "Registreren mislukt door een technische fout. Controleer je gegevens en probeer het opnieuw." }, { status: 500 });
  }

  return NextResponse.json({ message: "Account aangemaakt. Je kunt nu inloggen." }, { status: 201 });
}
