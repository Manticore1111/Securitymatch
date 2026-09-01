import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { AdminWorkspace } from "./admin-workspace";
import { RegisteredUsers } from "./registered-users";
import { LoginAttempts } from "./login-attempts";
import { RegistrationAttempts } from "./registration-attempts";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/dashboard/${session.user.role === "CLIENT" ? "client" : "security"}`);
  const [documents, users, professionals, clients, jobs, reviews, reports, disputes, payments, auditLogs, registeredUsers, loginAttempts, registrationAttempts] = await Promise.all([
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
    prisma.user.findMany({
      where: { role: { in: ["CLIENT", "SECURITY_PROFESSIONAL"] } },
      select: { id: true, firstName: true, lastName: true, email: true, role: true, status: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.loginAttempt.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.registrationAttempt.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);
  const serializedUsers = registeredUsers.map((user) => ({ ...user, role: user.role as "CLIENT" | "SECURITY_PROFESSIONAL", createdAt: user.createdAt.toISOString() }));
  const serializedLoginAttempts = loginAttempts.map((attempt) => ({ ...attempt, createdAt: attempt.createdAt.toISOString() }));
  const serializedRegistrationAttempts = registrationAttempts.map((attempt) => ({ ...attempt, createdAt: attempt.createdAt.toISOString() }));
  return <><RegisteredUsers users={serializedUsers} /><AdminWorkspace initialDocuments={documents} counts={{ Gebruikers: users, Beveiligers: professionals, Opdrachtgevers: clients, Opdrachten: jobs, Documenten: documents.length, Reviews: reviews, Reports: reports, Geschillen: disputes, Betalingen: payments, "Audit logs": auditLogs }} /><LoginAttempts attempts={serializedLoginAttempts} /><RegistrationAttempts attempts={serializedRegistrationAttempts} /></>;
}
