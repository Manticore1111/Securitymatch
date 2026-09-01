"use client";

import { useState } from "react";

type Invitation = { id: string; message: string | null; status: string; expiresAt: string; createdAt: string; job: { id: string; title: string; city: string; startAt: string; endAt: string; hourlyRateCents: number; description: string }; client: { firstName: string; lastName: string; clientProfile: { organizationName: string | null; city: string | null } | null } };

export function InvitationsManager({ initialInvitations }: { initialInvitations: Invitation[] }) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [error, setError] = useState("");
  async function decide(id: string, status: "ACCEPTED" | "REJECTED") {
    setError("");
    try {
      const response = await fetch(`/api/security/invitations?id=${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const result = await response.json();
      if (response.ok) {
        setInvitations((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      } else setError(result.error ?? "Uitnodiging beantwoorden is niet gelukt.");
    } catch {
      setError("Er ging iets mis met de verbinding. Probeer het opnieuw.");
  }
  }
  return <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8"><div className="mx-auto max-w-5xl"><a href="/dashboard/security" className="text-sm font-bold text-slate-600 hover:text-orange-600">← Dashboard</a><header className="mt-10 border-b border-slate-200 pb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Uitnodigingen</p><h1 className="mt-3 text-3xl font-bold text-slate-950">Uitnodigingen van opdrachtgevers</h1><p className="mt-3 text-sm text-slate-600">Bekijk de opdracht, het tarief en de organisatie voordat je reageert.</p></header>{error && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}<section className="mt-8 space-y-4">{invitations.length === 0 && <p className="border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">Je hebt nog geen uitnodigingen ontvangen.</p>}{invitations.map((invitation) => <article key={invitation.id} className="border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><h2 className="text-xl font-bold text-slate-950">{invitation.job.title}</h2><p className="mt-1 text-sm text-slate-600">{invitation.job.city} · opdrachtgever {invitation.client.clientProfile?.organizationName || `${invitation.client.firstName} ${invitation.client.lastName.charAt(0)}.`}</p><p className="mt-3 text-sm font-semibold text-slate-700">{new Date(invitation.job.startAt).toLocaleDateString("nl-NL")} · {new Date(invitation.job.startAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} - {new Date(invitation.job.endAt).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })} · € {(invitation.job.hourlyRateCents / 100).toFixed(2)}/uur</p></div><span className="h-fit rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{invitation.status === "SENT" || invitation.status === "VIEWED" ? `Reageer voor ${new Date(invitation.expiresAt).toLocaleDateString("nl-NL")}` : invitation.status}</span></div>{invitation.message && <p className="mt-5 border-l-2 border-orange-400 pl-4 text-sm italic text-slate-600">{invitation.message}</p>}<p className="mt-5 text-sm leading-6 text-slate-600">{invitation.job.description}</p>{(invitation.status === "SENT" || invitation.status === "VIEWED") && <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => decide(invitation.id, "ACCEPTED")} className="rounded-md bg-[#08705f] px-4 py-2 text-sm font-bold text-white">Uitnodiging accepteren</button><button type="button" onClick={() => decide(invitation.id, "REJECTED")} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800">Afwijzen</button></div>}</article>)}</section></div></main>;
}
