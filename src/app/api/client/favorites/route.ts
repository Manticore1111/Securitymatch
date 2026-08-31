import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

async function clientId() {
  const session = await auth();
  return session?.user?.role === "CLIENT" ? session.user.id : null;
}

export async function POST(request: Request) {
  const userId = await clientId();
  if (!userId) return NextResponse.json({ error: "Alleen ondernemers kunnen favorieten beheren." }, { status: 403 });
  const { targetUserId } = await request.json();
  const professional = await prisma.user.findFirst({ where: { id: targetUserId, role: "SECURITY_PROFESSIONAL", status: "ACTIVE" }, select: { id: true } });
  if (!professional) return NextResponse.json({ error: "Beveiliger niet gevonden." }, { status: 404 });
  await prisma.favorite.create({ data: { userId, targetUserId } }).catch(() => undefined);
  return NextResponse.json({ isFavorite: true });
}

export async function DELETE(request: Request) {
  const userId = await clientId();
  if (!userId) return NextResponse.json({ error: "Alleen ondernemers kunnen favorieten beheren." }, { status: 403 });
  const targetUserId = new URL(request.url).searchParams.get("targetUserId");
  if (!targetUserId) return NextResponse.json({ error: "Beveiliger ontbreekt." }, { status: 400 });
  await prisma.favorite.deleteMany({ where: { userId, targetUserId } });
  return NextResponse.json({ isFavorite: false });
}
