import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 });
  const { id } = await context.params;
  const invoice = await prisma.invoice.findFirst({ where: { id, OR: [{ clientId: session.user.id }, { professionalId: session.user.id }] }, include: { client: true, professional: true, job: true, payment: true } });
  if (!invoice) return NextResponse.json({ error: "Factuur niet gevonden." }, { status: 404 });
  const document = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];
  document.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
  const finished = new Promise<Buffer>((resolve) => document.on("end", () => resolve(Buffer.concat(chunks))));
  document.fontSize(22).text("SecurityMatch", { align: "right" });
  document.moveDown(2).fontSize(20).text("Factuur");
  document.fontSize(11).text(`Factuurnummer: ${invoice.number}`).text(`Datum: ${(invoice.issuedAt ?? invoice.createdAt).toLocaleDateString("nl-NL")}`).text(`Betaalstatus: ${invoice.status}`);
  document.moveDown().text(`Opdrachtgever: ${invoice.client.firstName} ${invoice.client.lastName} (${invoice.client.email})`).text(`Beveiliger: ${invoice.professional.firstName} ${invoice.professional.lastName} (${invoice.professional.email})`);
  if (invoice.job) document.moveDown().text(`Opdracht: ${invoice.job.title}`).text(`Locatie: ${invoice.job.location}`);
  document.moveDown().text(`Uren: ${Number(invoice.hours).toFixed(2)}`).text(`Uurtarief: EUR ${(invoice.hourlyRateCents / 100).toFixed(2)}`).text(`BTW: EUR ${(invoice.vatCents / 100).toFixed(2)}`).text(`Commissie: EUR ${(invoice.commissionCents / 100).toFixed(2)}`).text(`Totaal: EUR ${(invoice.amountCents / 100).toFixed(2)}`);
  document.end();
  const pdf = await finished;
  return new NextResponse(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${invoice.number}.pdf"`, "Cache-Control": "private, no-store" } });
}
