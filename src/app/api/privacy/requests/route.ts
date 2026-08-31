import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { sendEmail } from "@/lib/email";
import { legalDetails } from "@/lib/legal";
import { prisma } from "@/lib/prisma";

const requestTypes = new Set(["ACCESS", "CORRECTION", "DELETION", "PORTABILITY", "RESTRICTION", "OBJECTION"]);

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Log in om een AVG-verzoek in te dienen." }, { status: 401 });
  if (!legalDetails.privacyEmail || legalDetails.privacyEmail === "Nog in te vullen") {
    return NextResponse.json({ error: "Het privacycontact is nog niet geconfigureerd." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { type?: unknown; details?: unknown } | null;
  const type = typeof body?.type === "string" ? body.type : "";
  const details = typeof body?.details === "string" ? body.details.trim() : "";
  if (!requestTypes.has(type) || details.length < 10 || details.length > 4000) {
    return NextResponse.json({ error: "Kies een geldig verzoektype en geef minimaal 10 tekens toelichting." }, { status: 400 });
  }
  const accountEmail = session.user.email ?? "onbekend account";

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "PRIVACY_REQUEST_SUBMITTED",
      entityType: "User",
      entityId: session.user.id,
      metadata: { type },
    },
  });

  try {
    await sendEmail({
      to: legalDetails.privacyEmail,
      subject: `AVG-verzoek van ${accountEmail}`,
      html: `<p>Er is een AVG-verzoek ingediend via SecurityMatch.</p><p><strong>Type:</strong> ${escapeHtml(type)}</p><p><strong>Account:</strong> ${escapeHtml(accountEmail)}</p><p><strong>Toelichting:</strong></p><p>${escapeHtml(details).replace(/\n/g, "<br>")}</p>`,
    });
  } catch (error) {
    console.error("Privacy request email failed", error);
    return NextResponse.json({ error: "Het verzoek is geregistreerd, maar kon niet naar het privacycontact worden verzonden." }, { status: 503 });
  }

  return NextResponse.json({ message: "Je AVG-verzoek is ontvangen. We nemen contact met je op." }, { status: 201 });
}
