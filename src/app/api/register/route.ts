import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth-validation";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { legalTermsVersion } from "@/lib/legal";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige gegevens." }, { status: 400 });
  }
  if (parsed.data.role === "ADMIN") {
    return NextResponse.json({ error: "Adminaccounts worden alleen door de beheerder aangemaakt." }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "Dit e-mailadres is al geregistreerd." }, { status: 409 });

  const user = await prisma.$transaction(async (transaction) => {
    const created = await transaction.user.create({
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        role: parsed.data.role,
        status: process.env.EMAIL_VERIFICATION_REQUIRED === "false" ? "ACTIVE" : "PENDING",
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
    return created;
  });

  if (process.env.EMAIL_VERIFICATION_REQUIRED === "false") {
    return NextResponse.json({ message: "Account aangemaakt. Je kunt nu direct inloggen." }, { status: 201 });
  }

  const rawToken = randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: createHash("sha256").update(rawToken).digest("hex"),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const verificationUrl = `${process.env.APP_URL ?? process.env.AUTH_URL ?? "http://localhost:3000"}/api/verify-email?token=${rawToken}`;
  try {
    await sendEmail({
      to: user.email,
      subject: "Bevestig je SecurityMatch-account",
      html: `<p>Hallo ${user.firstName},</p><p>Bevestig je e-mailadres om je SecurityMatch-account te activeren.</p><p><a href="${verificationUrl}">E-mailadres bevestigen</a></p><p>Deze link is 24 uur geldig.</p>`,
    });
  } catch (error) {
    console.error("Verification email failed", error);
    return NextResponse.json({ error: "Je account is aangemaakt, maar de verificatiemail kon niet worden verzonden. Controleer de e-mailinstellingen en probeer het opnieuw." }, { status: 503 });
  }
  return NextResponse.json({ message: "Account aangemaakt. Controleer je e-mail om je account te activeren." }, { status: 201 });
}
