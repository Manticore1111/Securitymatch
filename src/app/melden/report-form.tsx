"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const reasons = [
  ["VEILIGHEID", "Veiligheid of acuut risico"],
  ["FRAUDE_OF_IDENTITEIT", "Fraude of identiteitsmisbruik"],
  ["DISCRIMINATIE_OF_INTIMIDATIE", "Discriminatie, intimidatie of bedreiging"],
  ["ONJUISTE_OF_ILLEGALE_INHOUD", "Onjuiste of mogelijk illegale inhoud"],
  ["PRIVACY", "Privacy of persoonsgegevens"],
  ["ANDERS", "Ander probleem"],
] as const;

export function ReportForm() {
  const [reason, setReason] = useState<(typeof reasons)[number][0]>("VEILIGHEID");
  const [context, setContext] = useState("");
  const [details, setDetails] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, context, details }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "De melding kon niet worden verstuurd.");
        return;
      }
      setDetails("");
      setContext("");
      setMessage(result.message ?? "Je melding is ontvangen.");
    } catch {
      setError("De melding kon niet worden verstuurd.");
    } finally {
      setSaving(false);
    }
  }

  return <form onSubmit={submit} className="mt-8 border border-[#dce4e1] bg-white p-6 shadow-sm"><div className="grid gap-5"><label className="block text-sm font-bold text-[#344145]">Onderwerp<select value={reason} onChange={(event) => setReason(event.target.value as (typeof reasons)[number][0])} className="mt-2 block h-12 w-full rounded-lg border border-[#cfd9d5] bg-white px-3 text-sm text-[#172629] outline-none focus:border-[#08705f] focus:ring-2 focus:ring-[#d8eee7]">{reasons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="block text-sm font-bold text-[#344145]">Pagina, opdracht of profiel (optioneel)<input value={context} onChange={(event) => setContext(event.target.value)} placeholder="Bijvoorbeeld: /jobs/123 of naam van de gebruiker" maxLength={500} className="mt-2 block h-12 w-full rounded-lg border border-[#cfd9d5] px-3 text-sm text-[#172629] outline-none focus:border-[#08705f] focus:ring-2 focus:ring-[#d8eee7]" /></label><label className="block text-sm font-bold text-[#344145]">Wat is er gebeurd?<textarea required minLength={10} maxLength={2000} rows={7} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Beschrijf wat je hebt gezien, wanneer dit gebeurde en waarom je denkt dat beoordeling nodig is." className="mt-2 block w-full rounded-lg border border-[#cfd9d5] p-3 text-sm text-[#172629] outline-none focus:border-[#08705f] focus:ring-2 focus:ring-[#d8eee7]" /></label></div>{error && <p role="alert" className="mt-5 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}{message && <p role="status" className="mt-5 border border-[#b9dfd2] bg-[#eff7f3] p-3 text-sm font-semibold text-[#075c4e]">{message}</p>}<button disabled={saving} type="submit" className="mt-5 inline-flex h-12 items-center gap-2 rounded-lg bg-[#08705f] px-5 text-sm font-bold text-white transition hover:bg-[#065b4d] disabled:cursor-wait disabled:opacity-60">{saving ? "Melding versturen..." : "Melding versturen"}<Send aria-hidden="true" size={17} /></button></form>;
}
