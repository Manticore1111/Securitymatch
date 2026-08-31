import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { CandidatesExplorer } from "./candidates-explorer";

export default async function CandidatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect(`/dashboard/${session.user.role === "ADMIN" ? "admin" : "security"}`);
  const [profiles, jobs, favorites] = await Promise.all([
    prisma.securityProfile.findMany({ where: { user: { role: "SECURITY_PROFESSIONAL", status: "ACTIVE" } }, select: { id: true, userId: true, bio: true, city: true, workArea: true, hourlyRateCents: true, yearsExperience: true, specializations: true, languages: true, verificationStatus: true, ratingAverage: true, ratingCount: true, user: { select: { firstName: true, lastName: true, avatarUrl: true } }, availabilities: { where: { startsAt: { gte: new Date() }, status: "AVAILABLE" }, select: { startsAt: true, endsAt: true }, orderBy: { startsAt: "asc" }, take: 1 } }, orderBy: [{ verificationStatus: "asc" }, { ratingAverage: "desc" }], take: 50 }),
    prisma.job.findMany({ where: { clientId: session.user.id, status: { in: ["DRAFT", "PUBLISHED", "RESPONSES_RECEIVED"] } }, select: { id: true, title: true, city: true, startAt: true, endAt: true, hourlyRateCents: true }, orderBy: { startAt: "asc" } }),
    prisma.favorite.findMany({ where: { userId: session.user.id, targetUserId: { not: null } }, select: { targetUserId: true } }),
  ]);
  const favoriteIds = new Set(favorites.map((favorite) => favorite.targetUserId));
  return <CandidatesExplorer jobs={jobs.map((job) => ({ ...job, startAt: job.startAt.toISOString(), endAt: job.endAt.toISOString() }))} initialCandidates={profiles.map((profile) => ({ ...profile, ratingAverage: profile.ratingAverage ? Number(profile.ratingAverage) : null, matchScore: Math.min(99, 68 + (profile.verificationStatus === "VERIFIED" ? 15 : 0) + Math.min(profile.yearsExperience ?? 0, 5) * 2 + (profile.ratingAverage ? Math.round(Number(profile.ratingAverage) * 2) : 0)), isFavorite: favoriteIds.has(profile.userId), availabilities: profile.availabilities.map((availability) => ({ startsAt: availability.startsAt.toISOString(), endsAt: availability.endsAt.toISOString() })) }))} />;
}
