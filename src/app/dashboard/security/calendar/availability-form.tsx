"use client";

import { useState } from "react";

type Availability = { id: string; startsAt: string; endsAt: string; status: string; note: string | null };

export function AvailabilityForm({ initialItems }: { initialItems: Availability[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [note, setNote] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/availability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ startsAt, endsAt, status, note }) });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "Beschikbaarheid opslaan is niet gelukt."); return; }
    setItems((current) => [...current, result].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
    setStartsAt(""); setEndsAt(""); setNote("");
  }

  return <section className="mt-8 rounded-xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-950">Beschikbaarheid</h2><form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Van<input required type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-semibold text-slate-700">Tot<input required type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label><label className="text-sm font-semibold text-slate-700">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3"><option value="AVAILABLE">Beschikbaar</option><option value="TENTATIVE">Onder voorbehoud</option><option value="UNAVAILABLE">Niet beschikbaar</option></select></label><label className="text-sm font-semibold text-slate-700">Notitie<input value={note} onChange={(event) => setNote(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 p-3" /></label><button className="rounded-lg bg-orange-500 px-4 py-3 text-sm font-bold text-white sm:col-span-2" type="submit">Beschikbaarheid toevoegen</button></form>{error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}<div className="mt-6 space-y-2">{items.map((item) => <p key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{new Date(item.startsAt).toLocaleString("nl-NL")} tot {new Date(item.endsAt).toLocaleString("nl-NL")} · {item.status === "AVAILABLE" ? "Beschikbaar" : item.status === "TENTATIVE" ? "Onder voorbehoud" : "Niet beschikbaar"}{item.note ? ` · ${item.note}` : ""}</p>)}{items.length === 0 && <p className="text-sm text-slate-500">Nog geen beschikbaarheid opgegeven.</p>}</div></section>;
}
