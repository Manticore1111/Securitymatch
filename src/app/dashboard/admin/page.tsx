import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { AdminWorkspace } from "./admin-workspace";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/dashboard/${session.user.role === "CLIENT" ? "client" : "security"}`);
  const [documents, users, professionals, clients, jobs, reviews, reports, disputes, payments, auditLogs] = await Promise.all([
    prisma.document.findMany({ include: { user: { select: { firstName: true, lastName: true, email: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "SECURITY_PROFESSIONAL" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.job.count(),
    prisma.review.count(),
    prisma.report.count(),
    prisma.dispute.count(),
    prisma.payment.count(),
    prisma.auditLog.count(),
  ]);
  return <AdminWorkspace initialDocuments={documents} counts={{ Gebruikers: users, Beveiligers: professionals, Opdrachtgevers: clients, Opdrachten: jobs, Documenten: documents.length, Reviews: reviews, Reports: reports, Geschillen: disputes, Betalingen: payments, "Audit logs": auditLogs }} />;
}
