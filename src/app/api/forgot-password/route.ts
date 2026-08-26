import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const parsed = forgotPasswordSchema.safeParse(await request.json());
  const generic = { message: "Als dit e-mailadres bekend is, ontvang je instructies om je wachtwoord te herstellen." };
  if (!parsed.success) return NextResponse.json(generic);

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const rawToken = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash: createHash("sha256").update(rawToken).digest("hex"), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
    const resetUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/reset-password?token=${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Nieuw SecurityMatch-wachtwoord instellen",
      html: `<p>Je hebt gevraagd om je wachtwoord opnieuw in te stellen.</p><p><a href="${resetUrl}">Nieuw wachtwoord instellen</a></p><p>Deze link is 1 uur geldig.</p>`,
    });
  }
  return NextResponse.json(generic);
}
