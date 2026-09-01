import { createHash, randomBytes, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!email || !email.includes("@")) return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });

  if (!code) {
    if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) return NextResponse.json({ error: "Dit e-mailadres is al geregistreerd. Log in of gebruik een ander e-mailadres." }, { status: 409 });
    const verificationCode = randomInt(100000, 1000000).toString();
    await prisma.registrationEmailVerification.upsert({ where: { email }, create: { email, codeHash: hash(verificationCode), expiresAt: new Date(Date.now() + 15 * 60 * 1000) }, update: { codeHash: hash(verificationCode), attempts: 0, verifiedAt: null, consumedAt: null, verificationTokenHash: null, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
    try {
      await sendEmail({ to: email, subject: "Je SecurityMatch-verificatiecode", html: `<p>Gebruik deze code om je e-mailadres te bevestigen:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 4px">${verificationCode}</p><p>De code is 15 minuten geldig.</p>` });
    } catch (error) {
      console.error("Registration verification email failed", error);
      return NextResponse.json({ error: "De verificatiecode kon niet worden verzonden. Probeer het opnieuw." }, { status: 503 });
    }
    return NextResponse.json({ message: "De verificatiecode is naar je e-mailadres verzonden." });
  }

  if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: "Vul de 6-cijferige code in." }, { status: 400 });
  const record = await prisma.registrationEmailVerification.findUnique({ where: { email } });
  if (!record || record.expiresAt < new Date() || record.attempts >= 5) return NextResponse.json({ error: "Deze code is ongeldig of verlopen. Vraag een nieuwe code aan." }, { status: 400 });
  if (record.codeHash !== hash(code)) {
    await prisma.registrationEmailVerification.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "De verificatiecode klopt niet." }, { status: 400 });
  }
  const verificationToken = randomBytes(32).toString("hex");
  await prisma.registrationEmailVerification.update({ where: { id: record.id }, data: { verifiedAt: new Date(), verificationTokenHash: hash(verificationToken) } });
  return NextResponse.json({ message: "E-mailadres bevestigd.", verificationToken });
}