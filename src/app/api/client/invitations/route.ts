import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 });
  if (session.user.role !== "CLIENT") return NextResponse.json({ error: "Alleen ondernemers kunnen uitnodigen." }, { status: 403 });
  const body = await request.json();
  const job = await prisma.job.findFirst({ where: { id: body.jobId, clientId: session.user.id, status: { in: ["DRAFT", "PUBLISHED", "RESPONSES_RECEIVED"] } }, select: { id: true, title: true, startAt: true, endAt: true } });
  const professional = await prisma.user.findFirst({ where: { id: body.professionalId, role: "SECURITY_PROFESSIONAL", status: "ACTIVE" }, select: { id: true } });
  if (!job || !professional) return NextResponse.json({ error: "Opdracht of beveiliger niet gevonden." }, { status: 404 });
  const invitation = await prisma.invitation.upsert({ where: { jobId_professionalId: { jobId: job.id, professionalId: professional.id } }, create: { jobId: job.id, clientId: session.user.id, professionalId: professional.id, message: typeof body.message === "string" ? body.message.trim().slice(0, 2000) : null, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, update: { message: typeof body.message === "string" ? body.message.trim().slice(0, 2000) : null, status: "SENT", expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), viewedAt: null } });
  await prisma.notification.create({ data: { userId: professional.id, type: "APPLICATION", title: "Nieuwe opdrachtuitnodiging", body: `Je bent uitgenodigd voor ${job.title}.` } });
  return NextResponse.json(invitation, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  const invitations = await prisma.invitation.findMany({ where: { clientId: session.user.id }, include: { job: { select: { id: true, title: true, startAt: true, endAt: true, city: true } }, professional: { select: { firstName: true, lastName: true, securityProfile: { select: { city: true, yearsExperience: true, verificationStatus: true, ratingAverage: true } } } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(invitations);
}
