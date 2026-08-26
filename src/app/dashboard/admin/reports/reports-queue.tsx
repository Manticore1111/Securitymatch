"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

type Report = {
  id: string;
  reason: string;
  details: string | null;
  createdAt: string;
  resolvedAt: string | null;
  reporter: { firstName: string; lastName: string; email: string };
  reportedUser: { firstName: string; lastName: string; email: string } | null;
  job: { title: string } | null;
};

const reasonLabels: Record<string, string> = {
  VEILIGHEID: "Veiligheid of acuut risico",
  FRAUDE_OF_IDENTITEIT: "Fraude of identiteitsmisbruik",
  DISCRIMINATIE_OF_INTIMIDATIE: "Discriminatie, intimidatie of bedreiging",
  ONJUISTE_OF_ILLEGALE_INHOUD: "Onjuiste of mogelijk illegale inhoud",
  PRIVACY: "Privacy of persoonsgegevens",
  ANDERS: "Ander probleem",
};

export function ReportsQueue({ initialReports }: { initialReports: Report[] }) {
  const [reports, setReports] = useState(initialReports);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  async function setResolved(id: string, resolved: boolean) {
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/reports?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolved }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "De melding kon niet worden bijgewerkt.");
        return;
      }
      setReports((items) => items.map((report) => report.id === id ? { ...report, resolvedAt: result.resolvedAt } : report));
    } catch {
      setError("De melding kon niet worden bijgewerkt.");
    } finally {
      setUpdatingId("");
    }
  }

  return <section className="mt-8">{error && <p role="alert" className="mb-4 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<div className="overflow-hidden border border-slate-200 bg-white">{reports.map((report) => <article key={report.id} className="border-b border-slate-100 p-5 last:border-b-0"><div className="flex flex-col justify-between gap-4 lg:flex-row"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-md px-2.5 py-1 text-xs font-bold ${report.resolvedAt ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{report.resolvedAt ? "Afgerond" : "Open"}</span><span className="text-xs font-bold text-slate-500">{reasonLabels[report.reason] ?? report.reason}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">{report.details || "Geen toelichting toegevoegd."}</p><div className="mt-4 grid gap-1 text-xs text-slate-500 sm:grid-cols-2"><p>Gemeld door: {report.reporter.firstName} {report.reporter.lastName} · {report.reporter.email}</p><p>{report.job ? `Opdracht: ${report.job.title}` : report.reportedUser ? `Betrokken gebruiker: ${report.reportedUser.firstName} ${report.reportedUser.lastName}` : "Algemene platformmelding"}</p><p>Ingediend: {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(report.createdAt))}</p>{report.resolvedAt && <p>Afgerond: {new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(new Date(report.resolvedAt))}</p>}</div></div><button type="button" onClick={() => setResolved(report.id, !report.resolvedAt)} disabled={Boolean(updatingId)} className={`inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60 ${report.resolvedAt ? "border border-slate-300 text-slate-700 hover:bg-slate-50" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>{report.resolvedAt ? <><RotateCcw aria-hidden="true" size={16} />Heropenen</> : <><CheckCircle2 aria-hidden="true" size={16} />Als afgehandeld markeren</>}</button></div></article>)}{reports.length === 0 && <div className="p-10 text-center"><p className="font-bold text-slate-950">Geen openstaande meldingen</p><p className="mt-2 text-sm text-slate-600">Nieuwe meldingen via het platform verschijnen hier.</p></div>}</div></section>;
}
