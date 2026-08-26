import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ recipientId: z.string().uuid(), jobId: z.string().uuid(), body: z.string().trim().min(1).max(3000) });

const conversationInclude = {
  job: { select: { id: true, title: true } },
  members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } },
  messages: { orderBy: { createdAt: "asc" as const }, select: { id: true, body: true, senderId: true, readAt: true, createdAt: true } },
};

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 });
  const conversations = await prisma.conversation.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: conversationInclude,
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(conversations);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Bericht ontbreekt." }, { status: 400 });
  const message = await prisma.message.findFirst({
    where: { id, senderId: { not: session.user.id }, conversation: { members: { some: { userId: session.user.id } } } },
    select: { id: true },
  });
  if (!message) return NextResponse.json({ error: "Bericht niet gevonden." }, { status: 404 });
  const updated = await prisma.message.update({ where: { id }, data: { readAt: new Date() } });
  return NextResponse.json(updated);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Vul een geldig bericht in." }, { status: 400 });
  const { recipientId, jobId, body } = parsed.data;
  if (recipientId === session.user.id) return NextResponse.json({ error: "Je kunt jezelf geen bericht sturen." }, { status: 400 });
  const job = await prisma.job.findFirst({ where: { id: jobId, OR: [{ clientId: session.user.id }, { applications: { some: { applicantId: session.user.id } } }] }, select: { id: true, clientId: true } });
  if (!job) return NextResponse.json({ error: "Je hebt geen toegang tot deze opdracht." }, { status: 403 });
  const recipientIsInJob = await prisma.job.findFirst({ where: { id: jobId, OR: [{ clientId: recipientId }, { applications: { some: { applicantId: recipientId } } }] }, select: { id: true } });
  if (!recipientIsInJob) return NextResponse.json({ error: "Deze ontvanger hoort niet bij de opdracht." }, { status: 403 });
  const existing = await prisma.conversation.findFirst({ where: { jobId, AND: [{ members: { some: { userId: session.user.id } } }, { members: { some: { userId: recipientId } } }] }, select: { id: true } });
  const conversation = existing ?? await prisma.conversation.create({ data: { jobId, members: { create: [{ userId: session.user.id }, { userId: recipientId }] } }, select: { id: true } });
  const message = await prisma.message.create({ data: { conversationId: conversation.id, senderId: session.user.id, body } });
  return NextResponse.json(message, { status: 201 });
}