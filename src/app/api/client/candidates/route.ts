import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

function accessError() {
  return NextResponse.json({ error: "Alleen ondernemers kunnen beveiligers zoeken." }, { status: 403 });
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 });
  if (session.user.role !== "CLIENT") return accessError();
  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.trim();
  const city = params.get("city")?.trim();
  const specialization = params.get("specialization")?.trim();
  const minExperience = Number(params.get("minExperience") || 0);
  const maxRate = Number(params.get("maxRate") || 0);
  const verified = params.get("verified") === "true";
  const profiles = await prisma.securityProfile.findMany({
    where: {
      user: { status: "ACTIVE", role: "SECURITY_PROFESSIONAL", ...(query ? { OR: [{ firstName: { contains: query, mode: "insensitive" } }, { lastName: { contains: query, mode: "insensitive" } }] } : {}) },
      ...(city ? { OR: [{ city: { contains: city, mode: "insensitive" } }, { workArea: { contains: city, mode: "insensitive" } }] } : {}),
      ...(specialization ? { specializations: { has: specialization } } : {}),
      ...(minExperience > 0 ? { yearsExperience: { gte: minExperience } } : {}),
      ...(maxRate > 0 ? { hourlyRateCents: { lte: maxRate * 100 } } : {}),
      ...(verified ? { verificationStatus: "VERIFIED" } : {}),
    },
    select: {
      id: true, userId: true, bio: true, city: true, workArea: true, hourlyRateCents: true,
      yearsExperience: true, specializations: true, languages: true, verificationStatus: true,
      ratingAverage: true, ratingCount: true, user: { select: { firstName: true, lastName: true, avatarUrl: true } },
      availabilities: { where: { startsAt: { gte: new Date() }, status: "AVAILABLE" }, select: { startsAt: true, endsAt: true }, orderBy: { startsAt: "asc" }, take: 1 },
    },
    orderBy: [{ verificationStatus: "asc" }, { ratingAverage: "desc" }],
    take: 50,
  });
  const favorites = await prisma.favorite.findMany({ where: { userId: session.user.id, targetUserId: { in: profiles.map((profile) => profile.userId) } }, select: { targetUserId: true } });
  const favoriteIds = new Set(favorites.map((favorite) => favorite.targetUserId));
  return NextResponse.json(profiles.map((profile) => ({ ...profile, ratingAverage: profile.ratingAverage ? Number(profile.ratingAverage) : null, matchScore: Math.min(99, 68 + (profile.verificationStatus === "VERIFIED" ? 15 : 0) + Math.min(profile.yearsExperience ?? 0, 5) * 2 + (profile.ratingAverage ? Math.round(Number(profile.ratingAverage) * 2) : 0)), isFavorite: favoriteIds.has(profile.userId) })));
}
