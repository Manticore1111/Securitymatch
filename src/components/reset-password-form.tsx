"use client";

import Link from "next/link";
import { useState } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError(""); setMessage("");
    const response = await fetch("/api/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: formData.get("password") }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Wachtwoord wijzigen is niet gelukt."); else setMessage(result.message);
  }
  return <main className="min-h-screen bg-slate-950 px-5 py-10 sm:px-8"><div className="mx-auto max-w-md"><Link href="/" className="text-xl font-bold tracking-[-0.05em] text-white">Security<span className="text-orange-500">Match</span></Link><div className="mt-10 rounded-2xl bg-white p-6 shadow-2xl sm:p-8"><h1 className="text-2xl font-bold text-slate-950">Nieuw wachtwoord</h1><form action={submit} className="mt-7 space-y-5"><label className="block text-sm font-semibold text-slate-700">Nieuw wachtwoord<input required minLength={12} name="password" type="password" autoComplete="new-password" className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-3 text-slate-950 outline-none focus:border-orange-500" /></label>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{message && <p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message} <Link className="font-bold" href="/login">Inloggen</Link></p>}<button disabled={!token || Boolean(message)} className="h-12 w-full rounded-lg bg-orange-500 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60" type="submit">Wachtwoord wijzigen</button></form></div></div></main>;
}
