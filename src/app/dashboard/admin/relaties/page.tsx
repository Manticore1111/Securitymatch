import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";
import { RelationsDirectory } from "./relations-directory";

export default async function AdminRelationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/dashboard/${session.user.role === "CLIENT" ? "client" : "security"}`);

  const [users, companies] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["CLIENT", "SECURITY_PROFESSIONAL"] } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        securityProfile: { select: { city: true, verificationStatus: true, isVerified: true } },
        clientProfile: { select: { organizationName: true, city: true, verificationStatus: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.findMany({
      select: {
        id: true,
        name: true,
        kvkNumber: true,
        city: true,
        website: true,
        owner: { select: { firstName: true, lastName: true, email: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard/admin" className="text-sm font-bold text-slate-600 hover:text-slate-950">
          Terug naar beheeroverzicht
        </Link>
        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Relaties</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Namen, bedrijven en ZZP&apos;ers</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Een centraal overzicht van de mensen en organisaties die op SecurityMatch actief zijn.</p>
        </header>
        <RelationsDirectory
          users={users.map((user) => ({
            ...user,
            role: user.role as "CLIENT" | "SECURITY_PROFESSIONAL",
            createdAt: user.createdAt.toISOString(),
          }))}
          companies={companies.map((company) => ({ ...company, createdAt: company.createdAt.toISOString() }))}
        />
      </div>
    </main>
  );
}