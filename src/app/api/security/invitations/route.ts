import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

async function professionalId() {
  const session = await auth();
  return session?.user?.role === "SECURITY_PROFESSIONAL" ? session.user.id : null;
}

export async function GET() {
  const userId = await professionalId();
  if (!userId) return NextResponse.json({ error: "Alleen beveiligers kunnen uitnodigingen bekijken." }, { status: 403 });
  await prisma.invitation.updateMany({ where: { professionalId: userId, status: { in: ["SENT", "VIEWED"] }, expiresAt: { lt: new Date() } }, data: { status: "EXPIRED" } });
  const invitations = await prisma.invitation.findMany({ where: { professionalId: userId }, select: { id: true, message: true, status: true, expiresAt: true, viewedAt: true, createdAt: true, job: { select: { id: true, title: true, city: true, startAt: true, endAt: true, hourlyRateCents: true, description: true } }, client: { select: { firstName: true, lastName: true, clientProfile: { select: { organizationName: true, city: true } } } } }, orderBy: { createdAt: "desc" }, take: 30 });
  await prisma.invitation.updateMany({ where: { professionalId: userId, status: "SENT", viewedAt: null }, data: { status: "VIEWED", viewedAt: new Date() } });
  return NextResponse.json(invitations);
}

export async function PATCH(request: Request) {
  const userId = await professionalId();
  if (!userId) return NextResponse.json({ error: "Alleen beveiligers kunnen uitnodigingen beantwoorden." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  const body = await request.json().catch(() => ({}));
  const status = body.status === "ACCEPTED" || body.status === "REJECTED" ? body.status : null;
  if (!id || !status) return NextResponse.json({ error: "Ongeldige uitnodiging of status." }, { status: 400 });
  const invitation = await prisma.invitation.findFirst({ where: { id, professionalId: userId }, include: { job: true } });
  if (!invitation) return NextResponse.json({ error: "Uitnodiging niet gevonden." }, { status: 404 });
  if (!["SENT", "VIEWED"].includes(invitation.status) || invitation.expiresAt < new Date()) return NextResponse.json({ error: "Deze uitnodiging is niet meer beschikbaar." }, { status: 409 });
  try {
    const updated = await prisma.$transaction(async (tx) => {
      if (status === "ACCEPTED") {
        if (invitation.job.status === "ASSIGNED") throw new Error("JOB_ASSIGNED");
        const overlap = await tx.jobApplication.findFirst({ where: { applicantId: userId, status: "ACCEPTED", job: { startAt: { lt: invitation.job.endAt }, endAt: { gt: invitation.job.startAt } } } });
        if (overlap) throw new Error("OVERLAP");
      }
      const result = await tx.invitation.update({ where: { id }, data: { status, viewedAt: invitation.viewedAt ?? new Date() } });
      await tx.notification.create({ data: { userId: invitation.clientId, type: "APPLICATION_UPDATE", title: status === "ACCEPTED" ? "Uitnodiging geaccepteerd" : "Uitnodiging afgewezen", body: `Je uitnodiging voor '${invitation.job.title}' is ${status === "ACCEPTED" ? "geaccepteerd" : "afgewezen"}.` } });
      if (status === "ACCEPTED") {
        await tx.jobApplication.upsert({ where: { jobId_applicantId: { jobId: invitation.jobId, applicantId: userId } }, create: { jobId: invitation.jobId, applicantId: userId, availability: true, coverNote: invitation.message, status: "ACCEPTED" }, update: { availability: true, coverNote: invitation.message, status: "ACCEPTED" } });
        const profile = await tx.securityProfile.findUniqueOrThrow({ where: { userId }, select: { id: true } });
        await tx.job.update({ where: { id: invitation.jobId }, data: { status: "ASSIGNED", assignedProfessionalId: profile.id } });
        await tx.jobApplication.updateMany({ where: { jobId: invitation.jobId, applicantId: { not: userId }, status: { in: ["PENDING", "SHORTLISTED"] } }, data: { status: "REJECTED" } });
        await tx.invitation.updateMany({ where: { jobId: invitation.jobId, id: { not: invitation.id }, status: { in: ["SENT", "VIEWED"] } }, data: { status: "REJECTED" } });
      }
      return result;
    });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "OVERLAP") return NextResponse.json({ error: "Je hebt al een andere geaccepteerde opdracht op dit moment." }, { status: 409 });
    if (message === "JOB_ASSIGNED") return NextResponse.json({ error: "Deze opdracht is inmiddels aan iemand anders toegewezen." }, { status: 409 });
    return NextResponse.json({ error: "Je antwoord kon niet worden verwerkt. Probeer het opnieuw." }, { status: 500 });
  }
}
