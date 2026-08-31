"use client";

import { useState } from "react";

type DirectoryUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CLIENT" | "SECURITY_PROFESSIONAL";
  status: string;
  createdAt: string;
  securityProfile: { city: string | null; verificationStatus: string; isVerified: boolean } | null;
  clientProfile: { organizationName: string | null; city: string | null; verificationStatus: string } | null;
};

type DirectoryCompany = {
  id: string;
  name: string;
  kvkNumber: string;
  city: string | null;
  website: string | null;
  createdAt: string;
  owner: { firstName: string; lastName: string; email: string };
};

function statusClass(status: string) {
  if (status === "ACTIVE" || status === "VERIFIED" || status === "APPROVED") return "bg-emerald-50 text-emerald-700";
  if (status === "SUSPENDED" || status === "REJECTED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-800";
}

export function RelationsDirectory({ users, companies }: { users: DirectoryUser[]; companies: DirectoryCompany[] }) {
  const [tab, setTab] = useState<"all" | "companies" | "professionals">("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const matches = (value: string) => value.toLowerCase().includes(normalizedQuery);
  const filteredUsers = users.filter((user) => {
    if (tab === "companies") return false;
    if (tab === "professionals" && user.role !== "SECURITY_PROFESSIONAL") return false;
    return !normalizedQuery || [user.firstName, user.lastName, user.email, user.securityProfile?.city ?? "", user.clientProfile?.organizationName ?? ""].some(matches);
  });
  const filteredCompanies = companies.filter((company) => {
    if (tab === "professionals") return false;
    return !normalizedQuery || [company.name, company.kvkNumber, company.city ?? "", company.owner.email].some(matches);
  });

  return <section className="mt-8">
    <div className="flex flex-col gap-4 border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {[["all", "Iedereen"], ["companies", "Bedrijven"], ["professionals", "ZZP-beveiligers"]].map(([value, label]) => <button key={value} type="button" onClick={() => setTab(value as typeof tab)} className={`rounded-md px-3 py-2 text-sm font-bold ${tab === value ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{label}</button>)}
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Zoek op naam, e-mail, stad of bedrijf" aria-label="Zoek in relaties" className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:max-w-sm" />
    </div>
    {(tab === "all" || tab === "professionals") && <section className="mt-6"><h2 className="text-xl font-bold text-slate-950">{tab === "professionals" ? "ZZP-beveiligers" : "Personen"} ({filteredUsers.length})</h2><div className="mt-3 grid gap-3 lg:grid-cols-2">{filteredUsers.map((user) => <article key={user.id} className="border border-slate-200 bg-white p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="font-bold text-slate-950">{user.firstName} {user.lastName}</p><p className="mt-1 text-sm text-slate-600">{user.email}</p><p className="mt-2 text-xs text-slate-500">{user.role === "SECURITY_PROFESSIONAL" ? `ZZP-beveiliger${user.securityProfile?.city ? ` · ${user.securityProfile.city}` : ""}` : `Ondernemer${user.clientProfile?.organizationName ? ` · ${user.clientProfile.organizationName}` : ""}`}</p></div><span className={`h-fit rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(user.status)}`}>{user.status}</span></div></article>)}</div>{filteredUsers.length === 0 && <p className="mt-3 border border-dashed border-slate-300 p-6 text-sm text-slate-600">Geen personen gevonden.</p>}</section>}
    {(tab === "all" || tab === "companies") && <section className="mt-8"><h2 className="text-xl font-bold text-slate-950">Bedrijven ({filteredCompanies.length})</h2><div className="mt-3 grid gap-3 lg:grid-cols-2">{filteredCompanies.map((company) => <article key={company.id} className="border border-slate-200 bg-white p-5"><p className="font-bold text-slate-950">{company.name}</p><p className="mt-1 text-sm text-slate-600">KvK {company.kvkNumber}{company.city ? ` · ${company.city}` : ""}</p><p className="mt-2 text-xs text-slate-500">Eigenaar: {company.owner.firstName} {company.owner.lastName} · {company.owner.email}</p>{company.website && <a href={company.website} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-orange-700 hover:underline">Website openen</a>}</article>)}</div>{filteredCompanies.length === 0 && <p className="mt-3 border border-dashed border-slate-300 p-6 text-sm text-slate-600">Geen bedrijven gevonden.</p>}</section>}
  </section>;
}