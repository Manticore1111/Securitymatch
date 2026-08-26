"use client";

import { useState } from "react";

type BillingJob = {
  id: string;
  title: string;
  city: string;
  startAt: string;
  endAt: string;
  status: string;
  professionalName: string;
  stripeReady: boolean;
  amountCents: number;
  payment: { id: string; status: string; amountCents: number; paidAt: string | null } | null;
  invoice: { id: string; number: string; status: string; amountCents: number; issuedAt: string | null } | null;
};

const paymentLabels: Record<string, string> = {
  PENDING: "Betaling in afwachting",
  PROCESSING: "Betaling wordt verwerkt",
  PAID: "Betaald",
  FAILED: "Betaling mislukt",
  REFUNDED: "Terugbetaald",
  CANCELLED: "Betaling geannuleerd",
};

function money(amountCents: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amountCents / 100);
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function BillingPanel({ jobs }: { jobs: BillingJob[] }) {
  const [activeJobId, setActiveJobId] = useState("");
  const [error, setError] = useState("");

  async function startCheckout(jobId: string) {
    setActiveJobId(jobId);
    setError("");
    try {
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        setError(result.error ?? "De betaling kon niet worden gestart.");
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError("De betaling kon niet worden gestart.");
    } finally {
      setActiveJobId("");
    }
  }

  return <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8"><div className="mx-auto max-w-6xl"><header className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Betalingen en facturen</p><h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Alles rond je opdracht op een plek.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Betaal geselecteerde beveiligers veilig via Stripe. Zodra Stripe de betaling bevestigt, verschijnt je factuur hier.</p></div><a href="/dashboard/client" className="w-fit text-sm font-bold text-slate-700 transition hover:text-orange-600">Terug naar overzicht</a></header>{error && <p role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}<section className="mt-8 space-y-4" aria-label="Opdrachten met betalingsstatus">{jobs.map((job) => { const paymentStatus = job.payment?.status; const isPaid = paymentStatus === "PAID"; const isRefunded = paymentStatus === "REFUNDED"; const canStartPayment = !isPaid && !isRefunded && job.stripeReady; return <article key={job.id} className="border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_13rem_14rem]"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">{job.status === "COMPLETED" ? "Afgeronde opdracht" : "Geselecteerde beveiliger"}</p><h2 className="mt-2 text-xl font-bold text-slate-950">{job.title}</h2><p className="mt-2 text-sm text-slate-600">{job.professionalName} · {job.city}</p><p className="mt-1 text-sm text-slate-600">{dateTime(job.startAt)} - {dateTime(job.endAt)}</p></div><div className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className="text-sm font-semibold text-slate-600">Totaalbedrag</p><p className="mt-2 text-2xl font-bold text-slate-950">{money(job.amountCents)}</p><p className="mt-2 text-xs text-slate-500">Op basis van uren en afgesproken uurtarief.</p></div><div className="border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><p className="text-sm font-semibold text-slate-600">Betaalstatus</p><p className={`mt-2 text-sm font-bold ${isPaid ? "text-emerald-700" : isRefunded || paymentStatus === "FAILED" ? "text-red-700" : "text-amber-700"}`}>{paymentStatus ? paymentLabels[paymentStatus] ?? paymentStatus : "Nog niet betaald"}</p>{job.payment?.paidAt && <p className="mt-1 text-xs text-slate-500">Betaald op {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(new Date(job.payment.paidAt))}</p>}{!job.stripeReady && !isPaid && <p className="mt-2 text-xs font-semibold text-amber-700">De beveiliger rondt Stripe Connect nog af.</p>}{canStartPayment && <button type="button" onClick={() => startCheckout(job.id)} disabled={Boolean(activeJobId)} className="mt-4 w-full rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">{activeJobId === job.id ? "Checkout openen..." : paymentStatus === "PENDING" ? "Verder met betalen" : "Veilig betalen"}</button>}{job.invoice && <a href={`/api/invoices/${job.invoice.id}`} className="mt-4 block rounded-md border border-slate-300 px-4 py-3 text-center text-sm font-bold text-slate-800 transition hover:border-slate-950">Download factuur</a>}</div></div></article>; })}{jobs.length === 0 && <div className="border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-bold text-slate-950">Nog geen betalingen nodig</p><p className="mt-2 text-sm text-slate-600">Zodra je een beveiliger selecteert voor een opdracht, verschijnt die hier.</p><a href="/dashboard/client/applications" className="mt-5 inline-block text-sm font-bold text-orange-600 hover:text-orange-700">Bekijk reacties</a></div>}</section></div></main>;
}
