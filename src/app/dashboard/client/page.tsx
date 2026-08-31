import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Link from "next/link";
import type { JobStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const activeStatuses: JobStatus[] = ["PUBLISHED", "RESPONSES_RECEIVED", "ASSIGNED", "CONFIRMED", "IN_PROGRESS"];
const statusLabels: Record<string, string> = { PUBLISHED: "Open", RESPONSES_RECEIVED: "Reacties ontvangen", ASSIGNED: "Toegewezen", CONFIRMED: "Bevestigd", IN_PROGRESS: "In uitvoering" };

export default async function ClientDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect(`/dashboard/${session.user.role === "ADMIN" ? "admin" : "security"}`);
  const now = new Date();
    const [totalJobs, activeJobs, pendingApplications, invoiceCount, upcomingJobs, newCandidates, favoriteCount, invitationCount, unreadMessages] = await Promise.all([
    prisma.job.count({ where: { clientId: session.user.id } }),
    prisma.job.count({ where: { clientId: session.user.id, status: { in: activeStatuses } } }),
    prisma.jobApplication.count({ where: { job: { clientId: session.user.id }, status: { in: ["PENDING", "SHORTLISTED"] } } }),
    prisma.invoice.count({ where: { clientId: session.user.id } }),
    prisma.job.findMany({ where: { clientId: session.user.id, status: { in: activeStatuses }, startAt: { gte: new Date() } }, select: { id: true, title: true, city: true, startAt: true, status: true, _count: { select: { applications: true } } }, orderBy: { startAt: "asc" }, take: 4 }),
      prisma.securityProfile.count({ where: { user: { role: "SECURITY_PROFESSIONAL", status: "ACTIVE" }, createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } } }),
      prisma.favorite.count({ where: { userId: session.user.id, targetUserId: { not: null } } }),
      prisma.invitation.count({ where: { clientId: session.user.id, status: { in: ["SENT", "VIEWED"] } } }),
      prisma.notification.count({ where: { userId: session.user.id, type: "MESSAGE", readAt: null } }),
  ]);
  const metrics = [
    { label: "Open opdrachten", value: activeJobs, detail: `${totalJobs} totaal geplaatst` },
    { label: "Te beoordelen reacties", value: pendingApplications, detail: "van beveiligingsprofessionals" },
      { label: "Nieuwe kandidaten", value: newCandidates, detail: "beschikbaar op het platform" },
      { label: "Geplande opdrachten", value: upcomingJobs.length, detail: "met een toekomstige datum" },
      { label: "Favoriete beveiligers", value: favoriteCount, detail: "opgeslagen profielen" },
      { label: "Openstaande uitnodigingen", value: invitationCount, detail: "wachten op reactie" },
      { label: "Berichten", value: unreadMessages, detail: "ongelezen berichten" },
      { label: "Facturen", value: invoiceCount, detail: "voor je opdrachten" },
  ];
  const firstName = session.user.name?.split(" ")[0] ?? "daar";
  return <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8"><div className="mx-auto max-w-7xl"><header className="border-b border-slate-200 pb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Ondernemersdashboard</p><div className="mt-3 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Regel je beveiliging, {firstName}.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Plaats opdrachten, vergelijk reacties en houd je samenwerking met beveiligingsprofessionals overzichtelijk.</p></div><div className="flex flex-wrap gap-3"><Link href="/dashboard/client/candidates" className="inline-flex w-fit rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:border-slate-950">Beveiliger zoeken</Link><Link href="/dashboard/client/jobs" className="inline-flex w-fit rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600">Nieuwe opdracht plaatsen</Link></div></div></header><section aria-label="Overzicht" className="mt-8 grid gap-4 sm:grid-cols-3">{metrics.map((metric) => <article key={metric.label} className="border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-600">{metric.label}</p><p className="mt-4 text-3xl font-bold text-slate-950">{metric.value}</p><p className="mt-2 text-xs font-medium text-slate-500">{metric.detail}</p></article>)}</section><section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]"><div><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Jouw opdrachten</p><h2 className="mt-2 text-2xl font-bold text-slate-950">Opdrachten en bezetting</h2></div><Link href="/dashboard/client/jobs" className="text-sm font-bold text-slate-700 hover:text-orange-600">Alles beheren</Link></div><div className="mt-5 space-y-3">{upcomingJobs.map((job) => <Link key={job.id} href="/dashboard/client/jobs" className="block border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-sm"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h3 className="font-bold text-slate-950">{job.title}</h3><p className="mt-1 text-sm text-slate-600">{job.city} · {job.startAt.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p></div><span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{statusLabels[job.status] ?? job.status}</span></div><p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-600">{job._count.applications} reactie{job._count.applications === 1 ? "" : "s"} van professionals</p></Link>)}{upcomingJobs.length === 0 && <div className="border border-dashed border-slate-300 bg-white p-8 text-center"><p className="font-bold text-slate-900">Je hebt nog geen komende opdracht</p><p className="mt-2 text-sm text-slate-600">Plaats een opdracht en ontvang reacties van beschikbare professionals.</p><Link href="/dashboard/client/jobs" className="mt-5 inline-block text-sm font-bold text-orange-600 hover:text-orange-700">Opdracht plaatsen</Link></div>}</div></div><aside className="border-l border-slate-200 pl-0 lg:pl-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Voor je organisatie</p><div className="mt-4 grid gap-2"><Link href="/dashboard/client/candidates" className="border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 transition hover:border-orange-300">ZZP-beveiligers zoeken</Link><Link href="/dashboard/client/applications" className="border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 transition hover:border-orange-300">Reacties beoordelen</Link><Link href="/messages" className="border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 transition hover:border-orange-300">Berichten met professionals</Link><Link href="/dashboard/client/billing" className="border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 transition hover:border-orange-300">Facturen bekijken</Link><Link href="/dashboard/client/profile" className="border border-slate-200 bg-white p-4 text-sm font-bold text-slate-800 transition hover:border-orange-300">Bedrijfsprofiel aanpassen</Link></div></aside></section></div></main>;
}
