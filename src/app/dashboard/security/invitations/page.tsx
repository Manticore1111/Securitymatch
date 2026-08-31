import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { InvitationsManager } from "./invitations-manager";

export default async function SecurityInvitationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SECURITY_PROFESSIONAL") redirect(`/dashboard/${session.user.role === "ADMIN" ? "admin" : "client"}`);
  const invitations = await prisma.invitation.findMany({ where: { professionalId: session.user.id }, select: { id: true, message: true, status: true, expiresAt: true, createdAt: true, job: { select: { id: true, title: true, city: true, startAt: true, endAt: true, hourlyRateCents: true, description: true } }, client: { select: { firstName: true, lastName: true, clientProfile: { select: { organizationName: true, city: true } } } } }, orderBy: { createdAt: "desc" }, take: 30 });
  return <InvitationsManager initialInvitations={invitations.map((invitation) => ({ ...invitation, expiresAt: invitation.expiresAt.toISOString(), createdAt: invitation.createdAt.toISOString(), job: { ...invitation.job, startAt: invitation.job.startAt.toISOString(), endAt: invitation.job.endAt.toISOString() } }))} />;
}
