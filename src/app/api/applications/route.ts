import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema, applicationStatusSchema } from "@/lib/application-validation";

async function sessionOrError() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 }) };
  return { session };
}

export async function POST(request: Request) {
  const current = await sessionOrError();
  if (current.error) return current.error;
  if (current.session.user.role !== "SECURITY_PROFESSIONAL") return NextResponse.json({ error: "Alleen beveiligers kunnen reageren." }, { status: 403 });
  const jobId = new URL(request.url).searchParams.get("jobId");
  if (!jobId) return NextResponse.json({ error: "Opdracht-ID ontbreekt." }, { status: 400 });
  const parsed = applicationSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige reactie." }, { status: 400 });
  const job = await prisma.job.findFirst({ where: { id: jobId, status: "PUBLISHED" } });
  if (!job) return NextResponse.json({ error: "Deze opdracht is niet beschikbaar." }, { status: 404 });
  const application = await prisma.jobApplication.create({ data: { jobId, applicantId: current.session.user.id, availability: parsed.data.availability, proposedRateCents: parsed.data.proposedRateCents, coverNote: parsed.data.message, relevantExperience: parsed.data.relevantExperience } });
  return NextResponse.json(application, { status: 201 });
}

export async function GET(request: Request) {
  const current = await sessionOrError();
  if (current.error) return current.error;
  const jobId = new URL(request.url).searchParams.get("jobId");
  const where = current.session.user.role === "CLIENT" ? { job: { clientId: current.session.user.id }, ...(jobId ? { jobId } : {}) } : { applicantId: current.session.user.id, ...(jobId ? { jobId } : {}) };
  const applications = await prisma.jobApplication.findMany({ where, include: { job: { select: { id: true, title: true, startAt: true, endAt: true, location: true, clientId: true } }, applicant: { select: { id: true, firstName: true, lastName: true, email: true, securityProfile: true } } }, orderBy: { appliedAt: "desc" } });
  return NextResponse.json(applications);
}

export async function PATCH(request: Request) {
  const current = await sessionOrError();
  if (current.error) return current.error;
  if (current.session.user.role !== "CLIENT") return NextResponse.json({ error: "Alleen opdrachtgevers kunnen reacties beoordelen." }, { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  const parsed = applicationStatusSchema.safeParse(await request.json());
  if (!id || !parsed.success) return NextResponse.json({ error: "Ongeldige reactie of status." }, { status: 400 });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.jobApplication.findFirst({ where: { id, job: { clientId: current.session.user.id } }, include: { job: true } });
      if (!application) throw new Error("NOT_FOUND");
      if (parsed.data.status !== "ACCEPTED") return tx.jobApplication.update({ where: { id }, data: { status: parsed.data.status } });
      if (application.status !== "PENDING" || application.job.status === "ASSIGNED") throw new Error("JOB_ASSIGNED");
      const overlap = await tx.jobApplication.findFirst({ where: { applicantId: application.applicantId, status: "ACCEPTED", job: { startAt: { lt: application.job.endAt }, endAt: { gt: application.job.startAt } } } });
      if (overlap) throw new Error("OVERLAP");
      const accepted = await tx.jobApplication.update({ where: { id }, data: { status: "ACCEPTED" } });
      await tx.job.update({ where: { id: application.jobId }, data: { status: "ASSIGNED", assignedProfessionalId: (await tx.securityProfile.findUniqueOrThrow({ where: { userId: application.applicantId }, select: { id: true } })).id } });
      return accepted;
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message === "OVERLAP") return NextResponse.json({ error: "Deze beveiliger heeft al een overlappende geaccepteerde opdracht." }, { status: 409 });
    if (message === "JOB_ASSIGNED") return NextResponse.json({ error: "Deze opdracht is al aan iemand toegewezen." }, { status: 409 });
    if (message === "NOT_FOUND") return NextResponse.json({ error: "Reactie niet gevonden." }, { status: 404 });
    return NextResponse.json({ error: "Reactie kon niet worden verwerkt." }, { status: 500 });
  }
}