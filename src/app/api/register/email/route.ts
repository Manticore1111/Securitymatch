import { createHash, randomBytes, randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });

  if (!code) {
    if (await prisma.user.findUnique({ where: { email }, select: { id: true } })) return NextResponse.json({ error: "Dit e-mailadres is al geregistreerd. Log in of gebruik een ander e-mailadres." }, { status: 409 });
    const previous = await prisma.registrationEmailVerification.findUnique({ where: { email } });
    if (previous && previous.expiresAt > new Date(Date.now() + 14 * 60 * 1000)) {
      return NextResponse.json({ error: "Wacht een minuut voordat je een nieuwe code aanvraagt." }, { status: 429 });
    }
    const verificationCode = randomInt(100000, 1000000).toString();
    const codeHash = hash(verificationCode);
    await prisma.registrationEmailVerification.upsert({ where: { email }, create: { email, codeHash, expiresAt: new Date(Date.now() + 15 * 60 * 1000) }, update: { codeHash, attempts: 0, verifiedAt: null, consumedAt: null, verificationTokenHash: null, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
    try {
      await sendEmail({ to: email, subject: "Je SecurityMatch-verificatiecode", html: `<p>Gebruik deze code om je e-mailadres te bevestigen:</p><p style="font-size: 24px; font-weight: bold; letter-spacing: 4px">${verificationCode}</p><p>De code is 15 minuten geldig.</p>` });
    } catch (error) {
      console.error("Registration verification email failed", error);
      await prisma.registrationEmailVerification.deleteMany({ where: { email, codeHash } });
      return NextResponse.json({ error: "De verificatiecode kon niet worden verzonden. Probeer het opnieuw." }, { status: 503 });
    }
    return NextResponse.json({ message: "De verificatiecode is naar je e-mailadres verzonden." });
  }

  if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: "Vul de 6-cijferige code in." }, { status: 400 });
  const record = await prisma.registrationEmailVerification.findUnique({ where: { email } });
  if (!record || record.expiresAt < new Date() || record.attempts >= 5 || record.verifiedAt || record.consumedAt) return NextResponse.json({ error: "Deze code is ongeldig of verlopen. Vraag een nieuwe code aan." }, { status: 400 });
  if (record.codeHash !== hash(code)) {
    await prisma.registrationEmailVerification.updateMany({ where: { id: record.id, attempts: { lt: 5 }, verifiedAt: null, consumedAt: null }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "De verificatiecode klopt niet." }, { status: 400 });
  }
  const verificationToken = randomBytes(32).toString("hex");
  const updated = await prisma.registrationEmailVerification.updateMany({
    where: { id: record.id, codeHash: hash(code), attempts: { lt: 5 }, verifiedAt: null, consumedAt: null, expiresAt: { gt: new Date() } },
    data: { verifiedAt: new Date(), verificationTokenHash: hash(verificationToken) },
  });
  if (!updated.count) return NextResponse.json({ error: "Deze code is ongeldig of verlopen. Vraag een nieuwe code aan." }, { status: 400 });
  return NextResponse.json({ message: "E-mailadres bevestigd.", verificationToken });
}