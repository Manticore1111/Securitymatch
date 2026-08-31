import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { ApplyForm } from "./apply-form";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/register?role=SECURITY_PROFESSIONAL");
  if (!["CLIENT", "SECURITY_PROFESSIONAL", "ADMIN"].includes(session.user.role)) {
    redirect("/login");
  }
  const { id } = await params;
  const job = await prisma.job.findFirst({ where: { id, status: "PUBLISHED" }, select: { id: true, title: true, category: true, location: true, street: true, postalCode: true, city: true, description: true, startAt: true, endAt: true, securityCount: true, hourlyRateCents: true, budgetCents: true, negotiable: true, experience: true, certificates: true, driverLicense: true, ownTransport: true, languages: true, specializations: true } });
  if (!job) notFound();
  return <main className="min-h-screen bg-slate-100 px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl"><Link href="/jobs" className="text-sm font-bold text-slate-600 hover:text-orange-600">← Alle opdrachten</Link><article className="mt-8 rounded-xl bg-white p-6 shadow-sm sm:p-9"><span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">{job.category}</span><h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-950">{job.title}</h1><p className="mt-3 text-slate-600">{job.location}</p><div className="mt-8 grid gap-4 border-y border-slate-100 py-5 text-sm sm:grid-cols-3"><p><strong>Wanneer</strong><br />{job.startAt.toLocaleDateString("nl-NL")} · {job.startAt.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} - {job.endAt.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</p><p><strong>Beveiligers</strong><br />{job.securityCount}</p><p><strong>Tarief</strong><br />{job.hourlyRateCents ? `€ ${(job.hourlyRateCents / 100).toFixed(2)} per uur` : job.negotiable ? "Bespreekbaar" : "In overleg"}</p></div><h2 className="mt-8 text-xl font-bold text-slate-950">Beschrijving</h2><p className="mt-3 whitespace-pre-wrap text-slate-700">{job.description}</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div><h2 className="font-bold text-slate-950">Eisen</h2><p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{job.experience || "Geen specifieke ervaring opgegeven."}</p><p className="mt-2 text-sm text-slate-600">Certificaten: {job.certificates || "Niet opgegeven"}</p></div><div><h2 className="font-bold text-slate-950">Praktisch</h2><p className="mt-2 text-sm text-slate-600">Rijbewijs: {job.driverLicense ? "vereist" : "niet vereist"}<br />Eigen vervoer: {job.ownTransport ? "vereist" : "niet vereist"}<br />Talen: {job.languages.join(", ") || "Niet opgegeven"}<br />Specialisaties: {job.specializations.join(", ") || "Niet opgegeven"}</p></div></div><ApplyForm jobId={job.id} /></article></div></main>;
}