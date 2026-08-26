import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({ resolved: z.boolean() });

async function getAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN" ? session.user : null;
}

export async function GET() {
  if (!(await getAdmin())) return NextResponse.json({ error: "Geen toegang." }, { status: 403 });

  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { firstName: true, lastName: true, email: true } },
      reportedUser: { select: { firstName: true, lastName: true, email: true } },
      job: { select: { title: true } },
    },
    orderBy: [{ resolvedAt: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(reports);
}

export async function PATCH(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Geen toegang." }, { status: 403 });

  const id = new URL(request.url).searchParams.get("id");
  const parsed = updateSchema.safeParse(await request.json());
  if (!id || !parsed.success) return NextResponse.json({ error: "Ongeldige meldingsgegevens." }, { status: 400 });

  const report = await prisma.$transaction(async (transaction) => {
    const updated = await transaction.report.update({
      where: { id },
      data: { resolvedAt: parsed.data.resolved ? new Date() : null },
      include: {
        reporter: { select: { firstName: true, lastName: true, email: true } },
        reportedUser: { select: { firstName: true, lastName: true, email: true } },
        job: { select: { title: true } },
      },
    });
    await transaction.auditLog.create({
      data: {
        actorId: admin.id,
        action: parsed.data.resolved ? "REPORT_RESOLVED" : "REPORT_REOPENED",
        entityType: "Report",
        entityId: id,
      },
    });
    return updated;
  });

  return NextResponse.json(report);
}
