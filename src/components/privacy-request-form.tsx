"use client";

import { FormEvent, useState } from "react";

const requestOptions = [
  ["ACCESS", "Inzage"],
  ["CORRECTION", "Correctie"],
  ["DELETION", "Verwijdering"],
  ["PORTABILITY", "Dataportabiliteit"],
  ["RESTRICTION", "Beperking van verwerking"],
  ["OBJECTION", "Bezwaar"],
];

export function PrivacyRequestForm() {
  const [type, setType] = useState("ACCESS");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/privacy/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, details }),
    });
    const result = await response.json().catch(() => ({}));
    setBusy(false);
    setMessage(result.message ?? result.error ?? "Er ging iets mis.");
    if (response.ok) setDetails("");
  }

  return <form onSubmit={submit} className="mt-5 grid gap-4 border border-[#dce4e1] bg-white p-5">
    <label className="grid gap-2 text-sm font-bold text-[#344145]">Type verzoek
      <select value={type} onChange={(event) => setType(event.target.value)}>
        {requestOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
    <label className="grid gap-2 text-sm font-bold text-[#344145]">Toelichting
      <textarea required minLength={10} maxLength={4000} rows={6} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Beschrijf je verzoek en de gegevens waarop het betrekking heeft." />
    </label>
    <button type="submit" disabled={busy} className="w-fit rounded-lg bg-[#08705f] px-5 py-3 text-sm font-bold text-white hover:bg-[#065b4d] disabled:opacity-60">{busy ? "Verzenden..." : "Verzoek indienen"}</button>
    {message && <p role="status" className="text-sm font-semibold text-[#344145]">{message}</p>}
  </form>;
}
