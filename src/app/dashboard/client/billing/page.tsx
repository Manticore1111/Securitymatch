import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { BillingPanel } from "./billing-panel";

const payableStatuses = ["ASSIGNED", "CONFIRMED", "IN_PROGRESS", "COMPLETED"] as const;

export default async function ClientBillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "CLIENT") redirect(`/dashboard/${session.user.role === "ADMIN" ? "admin" : "security"}`);

  const jobs = await prisma.job.findMany({
    where: { clientId: session.user.id, assignedProfessionalId: { not: null }, status: { in: [...payableStatuses] } },
    select: {
      id: true,
      title: true,
      city: true,
      startAt: true,
      endAt: true,
      status: true,
      hourlyRateCents: true,
      assignedProfessional: { select: { stripeAccountId: true, user: { select: { firstName: true, lastName: true } } } },
      payments: { where: { payerId: session.user.id, type: "CLIENT_PAYMENT" }, orderBy: { createdAt: "desc" }, take: 1, select: { id: true, status: true, amountCents: true, paidAt: true } },
      invoices: { where: { clientId: session.user.id }, orderBy: { createdAt: "desc" }, take: 1, select: { id: true, number: true, status: true, amountCents: true, issuedAt: true } },
    },
    orderBy: { startAt: "desc" },
  });

  return <BillingPanel jobs={jobs.map((job) => ({
    id: job.id,
    title: job.title,
    city: job.city,
    startAt: job.startAt.toISOString(),
    endAt: job.endAt.toISOString(),
    status: job.status,
    professionalName: job.assignedProfessional ? `${job.assignedProfessional.user.firstName} ${job.assignedProfessional.user.lastName}` : "Nog niet toegewezen",
    stripeReady: Boolean(job.assignedProfessional?.stripeAccountId),
    amountCents: Math.round(Math.max(0, job.endAt.getTime() - job.startAt.getTime()) / 3_600_000 * job.hourlyRateCents),
    payment: job.payments[0] ? { ...job.payments[0], paidAt: job.payments[0].paidAt?.toISOString() ?? null } : null,
    invoice: job.invoices[0] ? { ...job.invoices[0], issuedAt: job.invoices[0].issuedAt?.toISOString() ?? null } : null,
  }))} />;
}
