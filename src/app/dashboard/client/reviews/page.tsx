import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "@/components/review-form";

export default async function ClientReviewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect("/dashboard");
  const jobs = await prisma.job.findMany({ where: { clientId: session.user.id, status: "COMPLETED", assignedProfessionalId: { not: null } }, include: { assignedProfessional: { include: { user: { select: { id: true, firstName: true, lastName: true } } } } }, orderBy: { endAt: "desc" } });
  return <main className="min-h-screen bg-slate-100 px-5 py-8 sm:px-8"><div className="mx-auto max-w-3xl"><a href="/dashboard/client" className="text-sm font-bold text-slate-600">← Dashboard</a><h1 className="mt-10 text-3xl font-bold text-slate-950">Reviews plaatsen</h1><p className="mt-2 text-sm text-slate-600">Beoordeel beveiligers na een voltooide opdracht.</p><section className="mt-6 space-y-4">{jobs.map((job) => job.assignedProfessional && <article key={job.id} className="rounded-xl bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-950">{job.title}</h2><p className="mt-1 text-sm text-slate-500">{job.endAt.toLocaleDateString("nl-NL")} · {job.assignedProfessional.user.firstName} {job.assignedProfessional.user.lastName}</p><ReviewForm jobId={job.id} recipientId={job.assignedProfessional.user.id} recipientName={`${job.assignedProfessional.user.firstName} ${job.assignedProfessional.user.lastName}`} dimensions={["communicatie", "professionaliteit", "betaling", "duidelijkheid"]} /></article>)}{jobs.length === 0 && <p className="rounded-xl bg-white p-8 text-center text-sm text-slate-600">Je hebt nog geen voltooide opdrachten.</p>}</section></div></main>;
}
