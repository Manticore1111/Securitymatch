import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { ReportsQueue } from "./reports-queue";

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/dashboard/${session.user.role === "CLIENT" ? "client" : "security"}`);

  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { firstName: true, lastName: true, email: true } },
      reportedUser: { select: { firstName: true, lastName: true, email: true } },
      job: { select: { title: true } },
    },
    orderBy: [{ resolvedAt: "asc" }, { createdAt: "desc" }],
  });
  const openCount = reports.filter((report) => !report.resolvedAt).length;

  return <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8"><div className="mx-auto max-w-6xl"><Link href="/dashboard/admin" className="text-sm font-bold text-slate-600 hover:text-slate-950">← Beheeroverzicht</Link><header className="mt-10 flex flex-col justify-between gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08705f]">Moderatie</p><h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Meldingen beoordelen</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Behandel veiligheids-, privacy- en inhoudsmeldingen. Elke statuswijziging wordt geregistreerd in de auditlog.</p></div><span className="w-fit rounded-md bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">{openCount} open</span></header><ReportsQueue initialReports={reports.map((report) => ({ ...report, createdAt: report.createdAt.toISOString(), resolvedAt: report.resolvedAt?.toISOString() ?? null }))} /></div></main>;
}
