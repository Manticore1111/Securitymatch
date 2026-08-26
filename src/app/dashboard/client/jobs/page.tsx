import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { JobsManager } from "./jobs-manager";

export default async function ClientJobsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect(`/dashboard/${session.user.role === "ADMIN" ? "admin" : "security"}`);
  const jobs = await prisma.job.findMany({ where: { clientId: session.user.id }, select: { id: true, title: true, description: true, category: true, location: true, street: true, postalCode: true, city: true, startAt: true, endAt: true, securityCount: true, hourlyRateCents: true, budgetCents: true, negotiable: true, experience: true, certificates: true, driverLicense: true, ownTransport: true, languages: true, specializations: true, status: true, _count: { select: { applications: true } } }, orderBy: { createdAt: "desc" } });
  return <main className="min-h-screen bg-slate-100 px-5 py-8 sm:px-8"><div className="mx-auto max-w-5xl"><div className="flex items-center justify-between"><a href="/dashboard/client" className="text-sm font-bold text-slate-600 hover:text-slate-950">← Dashboard</a><span className="text-xl font-bold tracking-[-0.05em] text-slate-950">Security<span className="text-orange-600">Match</span></span></div><section className="mt-10 rounded-2xl bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Opdrachtenbeheer</p><h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">Beheer je beveiligingsopdrachten.</h1><p className="mt-3 text-sm text-slate-600">Alleen opdrachten van jouw opdrachtgeveraccount worden hier geladen.</p><div className="mt-8"><JobsManager initialJobs={jobs.map((job) => ({ ...job, startAt: job.startAt.toISOString(), endAt: job.endAt.toISOString() }))} /></div></section></div></main>;
}
