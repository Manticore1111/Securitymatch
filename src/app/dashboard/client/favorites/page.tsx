import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export default async function ClientFavoritesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect("/dashboard");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id, targetUserId: { not: null } },
    select: { targetUserId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const professionalIds = favorites.flatMap((favorite) => favorite.targetUserId ?? []);
  const profiles = await prisma.securityProfile.findMany({
    where: { userId: { in: professionalIds }, user: { role: "SECURITY_PROFESSIONAL", status: "ACTIVE" } },
    select: { userId: true, city: true, workArea: true, yearsExperience: true, specializations: true, hourlyRateCents: true, verificationStatus: true, ratingAverage: true, ratingCount: true, user: { select: { firstName: true, lastName: true } } },
  });
  const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));

  return <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8"><div className="mx-auto max-w-6xl"><Link href="/dashboard/client" className="text-sm font-bold text-slate-600 hover:text-orange-600">← Ondernemersdashboard</Link><header className="mt-10 border-b border-slate-200 pb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Opgeslagen profielen</p><h1 className="mt-3 text-3xl font-bold text-slate-950">Favoriete beveiligers</h1><p className="mt-3 text-sm text-slate-600">Een overzicht van professionals die je later opnieuw wilt bekijken.</p></header><section className="mt-8 grid gap-4 md:grid-cols-2">{favorites.length === 0 && <div className="border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600 md:col-span-2">Je hebt nog geen beveiligers opgeslagen. <Link href="/dashboard/client/candidates" className="font-bold text-orange-600">Zoek een professional</Link></div>}{favorites.map((favorite) => { const profile = favorite.targetUserId ? profileByUserId.get(favorite.targetUserId) : null; if (!profile) return null; return <article key={favorite.targetUserId} className="border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-950">{profile.user.firstName} {profile.user.lastName.charAt(0)}.</h2><p className="mt-1 text-sm text-slate-500">{profile.city || "Locatie onbekend"}{profile.workArea ? ` · ${profile.workArea}` : ""}</p></div><span className="text-lg text-orange-500" aria-label="Favoriet">★</span></div><div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-700"><p><strong>{profile.yearsExperience ?? 0}</strong> jaar ervaring</p><p>{profile.ratingAverage ? `★ ${Number(profile.ratingAverage).toFixed(1)} (${profile.ratingCount})` : "Nog geen rating"}</p><p>{profile.hourlyRateCents ? `€ ${(profile.hourlyRateCents / 100).toFixed(2)} per uur` : "Tarief op aanvraag"}</p><p className="font-semibold text-emerald-700">{profile.verificationStatus === "VERIFIED" ? "Geverifieerd" : "In behandeling"}</p></div><p className="mt-4 text-xs font-semibold text-slate-500">{profile.specializations.length ? profile.specializations.join(", ") : "Geen specialisaties opgegeven"}</p><Link href={`/dashboard/client/candidates/${profile.userId}`} className="mt-5 inline-block text-sm font-bold text-orange-600">Profiel bekijken</Link></article>; })}</section></div></main>;
}
