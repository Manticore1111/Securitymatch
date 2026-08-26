import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/client-validation";

async function getClient() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 }) };
  if (session.user.role !== "CLIENT") return { error: NextResponse.json({ error: "Je hebt geen toegang tot deze opdrachten." }, { status: 403 }) };
  return { userId: session.user.id };
}

const jobSelect = { id: true, title: true, description: true, category: true, location: true, street: true, postalCode: true, city: true, startAt: true, endAt: true, securityCount: true, hourlyRateCents: true, budgetCents: true, negotiable: true, experience: true, certificates: true, driverLicense: true, ownTransport: true, languages: true, specializations: true, status: true, createdAt: true, updatedAt: true, _count: { select: { applications: true } } } as const;

export async function GET() {
  const client = await getClient();
  if (client.error) return client.error;
  const jobs = await prisma.job.findMany({ where: { clientId: client.userId }, select: jobSelect, orderBy: { createdAt: "desc" } });
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const client = await getClient();
  if (client.error) return client.error;
  const parsed = jobSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige opdrachtgegevens." }, { status: 400 });
  const data = parsed.data;
  const job = await prisma.job.create({ data: { ...data, clientId: client.userId, publishedAt: data.status === "PUBLISHED" ? new Date() : null }, select: jobSelect });
  return NextResponse.json(job, { status: 201 });
}

export async function PATCH(request: Request) {
  const client = await getClient();
  if (client.error) return client.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Opdracht-ID ontbreekt." }, { status: 400 });
  const parsed = jobSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige opdrachtgegevens." }, { status: 400 });
  const data = parsed.data;
  const existing = await prisma.job.findFirst({ where: { id, clientId: client.userId } });
  if (!existing) return NextResponse.json({ error: "Opdracht niet gevonden." }, { status: 404 });
  const job = await prisma.job.update({ where: { id }, data: { ...data, publishedAt: data.status === "PUBLISHED" ? existing.publishedAt ?? new Date() : existing.publishedAt }, select: jobSelect });
  return NextResponse.json(job);
}

export async function DELETE(request: Request) {
  const client = await getClient();
  if (client.error) return client.error;
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Opdracht-ID ontbreekt." }, { status: 400 });
  const deleted = await prisma.job.deleteMany({ where: { id, clientId: client.userId, status: "DRAFT" } });
  if (deleted.count === 0) return NextResponse.json({ error: "Alleen eigen conceptopdrachten kunnen worden verwijderd." }, { status: 404 });
  return NextResponse.json({ message: "Opdracht verwijderd." });
}
