import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { securityProfileSchema } from "@/lib/security-profile-validation";
import { prisma } from "@/lib/prisma";

async function getProfessional() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 }) };
  if (session.user.role !== "SECURITY_PROFESSIONAL") return { error: NextResponse.json({ error: "Je hebt geen toegang tot dit profiel." }, { status: 403 }) };
  return { userId: session.user.id };
}

export async function GET() {
  const professional = await getProfessional();
  if (professional.error) return professional.error;
  const profile = await prisma.securityProfile.findUnique({ where: { userId: professional.userId }, include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } } });
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const professional = await getProfessional();
  if (professional.error) return professional.error;
  const parsed = securityProfileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige profielgegevens." }, { status: 400 });
  const data = parsed.data;
  const profile = await prisma.$transaction(async (transaction) => {
    await transaction.user.update({ where: { id: professional.userId }, data: { firstName: data.firstName, lastName: data.lastName, avatarUrl: data.avatarUrl || null } });
    return transaction.securityProfile.upsert({ where: { userId: professional.userId }, create: { userId: professional.userId, bio: data.bio, city: data.city, workArea: data.workArea, hourlyRateCents: data.hourlyRateCents, yearsExperience: data.yearsExperience, specializations: data.specializations, languages: data.languages, driverLicense: data.driverLicense, ownTransport: data.ownTransport, availability: data.availability }, update: { bio: data.bio, city: data.city, workArea: data.workArea, hourlyRateCents: data.hourlyRateCents, yearsExperience: data.yearsExperience, specializations: data.specializations, languages: data.languages, driverLicense: data.driverLicense, ownTransport: data.ownTransport, availability: data.availability } });
  });
  return NextResponse.json(profile);
}
