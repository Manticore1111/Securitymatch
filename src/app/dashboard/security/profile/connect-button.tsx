"use client";

import { useState } from "react";

export function ConnectButton({ connected }: { connected: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startOnboarding() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/connect", { method: "POST" });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") {
        setError(result.error ?? "Stripe Connect instellen is niet gelukt.");
        return;
      }
      window.location.assign(result.url);
    } catch {
      setError("Stripe Connect instellen is niet gelukt.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="mt-8 border-t border-slate-100 pt-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h3 className="font-bold text-slate-950">Uitbetalingen</h3><p className="mt-1 text-sm text-slate-600">Koppel Stripe om betalingen voor afgeronde opdrachten te ontvangen.</p></div><button type="button" onClick={startOnboarding} disabled={loading} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">{loading ? "Stripe openen..." : connected ? "Stripe Connect beheren" : "Stripe Connect instellen"}</button></div>{connected && <p className="mt-3 text-sm font-semibold text-emerald-700">Stripe Connect is gekoppeld.</p>}{error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}</div>;
}
