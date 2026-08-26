import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

const reportSchema = z.object({
  reason: z.enum([
    "VEILIGHEID",
    "FRAUDE_OF_IDENTITEIT",
    "DISCRIMINATIE_OF_INTIMIDATIE",
    "ONJUISTE_OF_ILLEGALE_INHOUD",
    "PRIVACY",
    "ANDERS",
  ]),
  details: z.string().trim().min(10, "Beschrijf de melding met minimaal 10 tekens.").max(2000),
  context: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn om een melding te doen." }, { status: 401 });

  const parsed = reportSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige melding." }, { status: 400 });

  const details = parsed.data.context
    ? `Context: ${parsed.data.context}\n\n${parsed.data.details}`
    : parsed.data.details;

  const report = await prisma.$transaction(async (transaction) => {
    const created = await transaction.report.create({
      data: {
        reporterId: session.user.id,
        reason: parsed.data.reason,
        details,
      },
    });
    await transaction.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "REPORT_SUBMITTED",
        entityType: "Report",
        entityId: created.id,
        metadata: { reason: parsed.data.reason, context: parsed.data.context ?? null },
      },
    });
    return created;
  });

  return NextResponse.json({ id: report.id, message: "Je melding is ontvangen en wordt beoordeeld." }, { status: 201 });
}
