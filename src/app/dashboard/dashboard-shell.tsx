import { signOut } from "@/../auth";
import Link from "next/link";

export function DashboardShell({ title, role }: { title: string; role: string }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="text-xl font-bold tracking-[-0.05em]">Security<span className="text-orange-500">Match</span></Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="text-sm font-semibold text-slate-300 hover:text-white" type="submit">Uitloggen</button></form>
        </div>
        <section className="py-16"><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{role}</p><h1 className="mt-4 text-4xl font-bold tracking-[-0.04em]">{title}</h1><p className="mt-4 max-w-lg text-slate-400">Dit dashboard is beveiligd met server-side sessie- en rolcontrole. De volgende marketplacefuncties worden hier later toegevoegd.</p></section>
      </div>
    </main>
  );
}
