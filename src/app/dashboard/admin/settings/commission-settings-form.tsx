"use client";

import { useState } from "react";

export function CommissionSettingsForm({ initialPercent }: { initialPercent: number }) {
  const [percent, setPercent] = useState(initialPercent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/settings/commission", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percent }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "De commissie kon niet worden opgeslagen.");
        return;
      }
      setMessage("Platformcommissie opgeslagen.");
    } catch {
      setError("De commissie kon niet worden opgeslagen.");
    } finally {
      setSaving(false);
    }
  }

  return <form onSubmit={save} className="mt-8 max-w-xl border border-slate-200 bg-white p-6 shadow-sm"><label className="block text-sm font-bold text-slate-800">Platformcommissie<input required type="number" min="0" max="100" step="0.1" value={percent} onChange={(event) => setPercent(Number(event.target.value))} className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-3 text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label><p className="mt-2 text-sm leading-6 text-slate-600">Dit percentage wordt bij nieuwe Stripe Checkout-betalingen als platformcommissie ingehouden.</p>{error && <p role="alert" className="mt-4 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}{message && <p role="status" className="mt-4 border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{message}</p>}<button type="submit" disabled={saving} className="mt-5 rounded-md bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">{saving ? "Opslaan..." : "Commissie opslaan"}</button></form>;
}
