import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { ClientProfileForm } from "./profile-form";

export default async function ClientProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect(`/dashboard/${session.user.role === "ADMIN" ? "admin" : "security"}`);
  const profile = await prisma.clientProfile.findUnique({ where: { userId: session.user.id }, include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } });
  return <main className="min-h-screen bg-slate-100 px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl"><div className="flex items-center justify-between"><a href="/dashboard/client" className="text-sm font-bold text-slate-600 hover:text-slate-950">← Dashboard</a><span className="text-xl font-bold tracking-[-0.05em] text-slate-950">Security<span className="text-orange-600">Match</span></span></div><section className="mt-10 rounded-2xl bg-white p-6 shadow-sm sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Opdrachtgeversprofiel</p><h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">Vertel beveiligers over je organisatie.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Deze gegevens worden gebruikt om je opdrachten professioneel te presenteren.</p><div className="mt-8"><ClientProfileForm initialData={{ firstName: profile?.user.firstName ?? "", lastName: profile?.user.lastName ?? "", email: profile?.user.email ?? "", phone: profile?.user.phone ?? "", organizationName: profile?.organizationName ?? "", kvkNumber: profile?.kvkNumber ?? "", website: profile?.website ?? "", description: profile?.description ?? "", address: profile?.address ?? "", city: profile?.city ?? "" }} /></div></section></div></main>;
}
