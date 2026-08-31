import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { ApplicationsManager } from "./applications-grouped";

export default async function ClientApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect("/dashboard");
  const applications = await prisma.jobApplication.findMany({ where: { job: { clientId: session.user.id } }, include: { job: { select: { id: true, title: true, startAt: true, endAt: true, location: true } }, applicant: { select: { id: true, firstName: true, lastName: true, securityProfile: { select: { bio: true, city: true, workArea: true, yearsExperience: true, specializations: true, languages: true, driverLicense: true, ownTransport: true, verificationStatus: true, ratingAverage: true, ratingCount: true, hourlyRateCents: true } } } } }, orderBy: { appliedAt: "desc" } });
  return <ApplicationsManager currentUserId={session.user.id} initialApplications={applications.map((item) => ({ ...item, appliedAt: item.appliedAt.toISOString(), job: { ...item.job, startAt: item.job.startAt.toISOString(), endAt: item.job.endAt.toISOString() }, applicant: { ...item.applicant, securityProfile: item.applicant.securityProfile ? { ...item.applicant.securityProfile, ratingAverage: item.applicant.securityProfile.ratingAverage ? Number(item.applicant.securityProfile.ratingAverage) : null } : null } }))} />;
}