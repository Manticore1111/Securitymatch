"use client";

import { useState } from "react";

export function ReviewForm({ jobId, recipientId, recipientName, dimensions }: { jobId: string; recipientId: string; recipientName: string; dimensions: string[] }) {
  const [rating, setRating] = useState("5");
  const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(dimensions.map((item) => [item, "5"])));
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage("");
    const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, recipientId, rating: Number(rating), dimensions: Object.fromEntries(dimensions.map((item) => [item, Number(values[item])])), body: body || undefined }) });
    const result = await response.json(); setSaving(false);
    setMessage(response.ok ? "Beoordeling geplaatst." : result.error ?? "Beoordeling plaatsen is niet gelukt.");
  }
  return <form onSubmit={submit} className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4"><p className="text-sm font-bold text-slate-900">Beoordeel {recipientName}</p><label className="block text-sm font-semibold text-slate-700">Totaalwaardering<select value={rating} onChange={(event) => setRating(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2">{[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item} ster{item === 1 ? "" : "ren"}</option>)}</select></label><div className="grid gap-3 sm:grid-cols-2">{dimensions.map((dimension) => <label key={dimension} className="text-sm font-semibold capitalize text-slate-700">{dimension}<select value={values[dimension]} onChange={(event) => setValues((current) => ({ ...current, [dimension]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2">{[1, 2, 3, 4, 5].map((item) => <option key={item} value={item}>{item}</option>)}</select></label>)}</div><textarea value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} placeholder="Toelichting (optioneel)" className="min-h-20 w-full rounded-lg border border-slate-300 p-3" /><button disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60" type="submit">{saving ? "Opslaan..." : "Review plaatsen"}</button>{message && <p className="text-sm font-semibold text-slate-700">{message}</p>}</form>;
}
