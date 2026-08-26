import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ percent: z.number().min(0).max(100) });

export async function PATCH(request: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Commissie moet tussen 0 en 100 procent liggen." }, { status: 400 });
  const setting = await prisma.platformSetting.upsert({ where: { key: "platform_commission_percent" }, update: { value: parsed.data.percent }, create: { key: "platform_commission_percent", value: parsed.data.percent, description: "Platformcommissie voor Stripe Connect-betalingen" } });
  return NextResponse.json(setting);
}
