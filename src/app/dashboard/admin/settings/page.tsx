import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../../../auth";
import { defaultPlatformCommissionPercent, getPlatformCommissionPercent } from "@/lib/platform-settings";
import { CommissionSettingsForm } from "./commission-settings-form";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect(`/dashboard/${session.user.role === "CLIENT" ? "client" : "security"}`);

  let commissionPercent = defaultPlatformCommissionPercent;
  try {
    commissionPercent = await getPlatformCommissionPercent();
  } catch {
    // The form retains a valid default and shows a server-side validation error on save if needed.
  }

  return <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8"><div className="mx-auto max-w-4xl"><Link href="/dashboard/admin" className="text-sm font-bold text-slate-600 hover:text-slate-950">← Beheeroverzicht</Link><header className="mt-10 border-b border-slate-200 pb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Platforminstellingen</p><h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Commissie en betalingen</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Beheer de platformcommissie voor Stripe Connect-betalingen. Deze lokale omgeving accepteert uitsluitend Stripe test mode.</p></header><CommissionSettingsForm initialPercent={commissionPercent} /></div></main>;
}
