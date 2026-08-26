"use client";

import { useState } from "react";
import { dutchLocations } from "@/lib/dutch-locations";

const categories = [
  "Objectbeveiliging",
  "Evenementenbeveiliging",
  "Horecabeveiliging",
  "Winkelsurveillance",
  "Bouwplaatsbeveiliging",
  "Receptiebeveiliging",
  "Toegangscontrole",
  "Nachtbeveiliging",
  "Mobiele surveillance",
  "Overig",
];
const statuses = [
  ["DRAFT", "Concept"],
  ["PUBLISHED", "Gepubliceerd"],
  ["RESPONSES_RECEIVED", "Reacties ontvangen"],
  ["FILLED", "Toegewezen"],
  ["CONFIRMED", "Bevestigd"],
  ["IN_PROGRESS", "In uitvoering"],
  ["COMPLETED", "Voltooid"],
  ["CANCELLED", "Geannuleerd"],
] as const;
const steps = [
  "Type beveiliging",
  "Locatie",
  "Planning",
  "Eisen",
  "Tarief",
  "Beschrijving",
  "Preview",
  "Publiceren",
];
type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  street: string;
  postalCode: string;
  city: string;
  startAt: string;
  endAt: string;
  securityCount: number;
  hourlyRateCents: number;
  budgetCents: number | null;
  negotiable: boolean;
  experience: string | null;
  certificates: string | null;
  driverLicense: boolean;
  ownTransport: boolean;
  languages: string[];
  specializations: string[];
  status: string;
  _count: { applications: number };
};
type Draft = {
  title: string;
  category: string;
  street: string;
  postalCode: string;
  city: string;
  startAt: string;
  endAt: string;
  securityCount: number;
  experience: string;
  certificates: string;
  driverLicense: boolean;
  ownTransport: boolean;
  languages: string;
  specializations: string;
  hourlyRateCents: number;
  budgetCents: number | null;
  negotiable: boolean;
  description: string;
  status: "DRAFT" | "PUBLISHED";
};
const emptyDraft: Draft = {
  title: "",
  category: categories[0],
  street: "",
  postalCode: "",
  city: "",
  startAt: "",
  endAt: "",
  securityCount: 1,
  experience: "",
  certificates: "",
  driverLicense: false,
  ownTransport: false,
  languages: "",
  specializations: "",
  hourlyRateCents: 0,
  budgetCents: null,
  negotiable: false,
  description: "",
  status: "DRAFT",
};

function euros(cents: number | null) {
  return cents === null ? "Bespreekbaar" : `€ ${(cents / 100).toFixed(2)}`;
}

export function JobsManager({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [draft, setDraft] = useState(emptyDraft);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }
  function validateCurrentStep() {
    if (step === 1 && !draft.title.trim()) return "Vul een titel in.";
    if (step === 2 && (!draft.street || !draft.postalCode || !draft.city))
      return "Vul straat, postcode en plaats in.";
    if (step === 3 && (!draft.startAt || !draft.endAt))
      return "Vul datum en tijden in.";
    if (step === 6 && draft.description.trim().length < 10)
      return "Geef minimaal 10 tekens beschrijving.";
    return "";
  }
  function next() {
    const message = validateCurrentStep();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((current) => Math.min(8, current + 1));
  }
  function previous() {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  }
  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 8) {
      next();
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: draft.title,
      category: draft.category,
      street: draft.street,
      postalCode: draft.postalCode,
      city: draft.city,
      location: `${draft.street}, ${draft.postalCode} ${draft.city}`,
      startAt: draft.startAt,
      endAt: draft.endAt,
      securityCount: draft.securityCount,
      hourlyRateCents: draft.hourlyRateCents,
      budgetCents: draft.budgetCents,
      negotiable: draft.negotiable,
      experience: draft.experience,
      certificates: draft.certificates,
      driverLicense: draft.driverLicense,
      ownTransport: draft.ownTransport,
      languages: draft.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      specializations: draft.specializations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: draft.description,
      status: draft.status,
    };
    const response = await fetch("/api/client/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(result.error ?? "Opdracht maken is niet gelukt.");
      return;
    }
    setJobs((current) => [result, ...current]);
    setDraft(emptyDraft);
    setStep(1);
  }
  async function changeStatus(id: string, status: string) {
    const response = await fetch(`/api/client/jobs?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (response.ok)
      setJobs((current) =>
        current.map((item) => (item.id === id ? result : item)),
      );
    else setError(result.error ?? "Status wijzigen is niet gelukt.");
  }
  async function remove(id: string) {
    const response = await fetch(`/api/client/jobs?id=${id}`, {
      method: "DELETE",
    });
    if (response.ok)
      setJobs((current) => current.filter((item) => item.id !== id));
    else {
      const result = await response.json();
      setError(result.error ?? "Verwijderen is niet gelukt.");
    }
  }
  const input = (
    label: string,
    name: keyof Draft,
    type = "text",
    list?: string,
  ) => (
    <label className="field">
      {label}
      <input
        required={
          step < 7 &&
          [
            "title",
            "street",
            "postalCode",
            "city",
            "startAt",
            "endAt",
          ].includes(name)
        }
        type={type}
        list={list}
        value={draft[name] as string | number}
        onChange={(event) =>
          update(
            name,
            type === "number" ? Number(event.target.value) : event.target.value,
          )
        }
      />
    </label>
  );
  return (
    <div className="space-y-8">
      <form
        onSubmit={create}
        className="rounded-xl border border-slate-200 p-5"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">
              Nieuwe opdracht
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              Stap {step} van 8: {steps[step - 1]}
            </h2>
          </div>
          <span className="text-sm font-semibold text-slate-500">
            {Math.round((step / 8) * 100)}%
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-orange-500 transition-all"
            style={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {step === 1 && (
            <>
              {input("Titel van de opdracht", "title")}
              <label className="field">
                Type beveiliging
                <select
                  value={draft.category}
                  onChange={(event) => update("category", event.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </>
          )}
          {step === 2 && (
            <>
              {input("Straat en huisnummer", "street")}
              {input("Postcode", "postalCode")}
              <div>
                {input("Plaats", "city", "text", "client-dutch-locations")}
                <datalist id="client-dutch-locations">
                  {dutchLocations.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              {input("Startdatum en -tijd", "startAt", "datetime-local")}
              {input("Einddatum en -tijd", "endAt", "datetime-local")}
              {input("Aantal beveiligers", "securityCount", "number")}
            </>
          )}
          {step === 4 && (
            <>
              <label className="field sm:col-span-2">
                Ervaring
                <textarea
                  rows={3}
                  value={draft.experience}
                  onChange={(event) => update("experience", event.target.value)}
                />
              </label>
              <label className="field sm:col-span-2">
                Certificaten
                <textarea
                  rows={3}
                  placeholder="Bijvoorbeeld: beveiligingsdiploma, BHV"
                  value={draft.certificates}
                  onChange={(event) =>
                    update("certificates", event.target.value)
                  }
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={draft.driverLicense}
                  onChange={(event) =>
                    update("driverLicense", event.target.checked)
                  }
                />{" "}
                Rijbewijs vereist
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={draft.ownTransport}
                  onChange={(event) =>
                    update("ownTransport", event.target.checked)
                  }
                />{" "}
                Eigen vervoer vereist
              </label>
              {input("Talen, gescheiden door komma's", "languages")}
              {input(
                "Specialisaties, gescheiden door komma's",
                "specializations",
              )}
            </>
          )}
          {step === 5 && (
            <>
              <label className="field">
                Uurtarief in euro
                <input
                  type="number"
                  min="0"
                  step="0.50"
                  value={draft.hourlyRateCents / 100}
                  onChange={(event) =>
                    update(
                      "hourlyRateCents",
                      Math.round(Number(event.target.value) * 100),
                    )
                  }
                />
              </label>
              <label className="field">
                Totaalbudget in euro
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={
                    draft.budgetCents === null ? "" : draft.budgetCents / 100
                  }
                  onChange={(event) =>
                    update(
                      "budgetCents",
                      event.target.value
                        ? Math.round(Number(event.target.value) * 100)
                        : null,
                    )
                  }
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold sm:col-span-2">
                <input
                  type="checkbox"
                  checked={draft.negotiable}
                  onChange={(event) =>
                    update("negotiable", event.target.checked)
                  }
                />{" "}
                Tarief is bespreekbaar
              </label>
            </>
          )}
          {step === 6 && (
            <label className="field sm:col-span-2">
              Beschrijving
              <textarea
                required
                rows={8}
                value={draft.description}
                onChange={(event) => update("description", event.target.value)}
              />
            </label>
          )}
          {step === 7 && (
            <div className="space-y-3 text-sm text-slate-700 sm:col-span-2">
              <p>
                <strong>{draft.title}</strong> · {draft.category}
              </p>
              <p>
                {draft.street}, {draft.postalCode} {draft.city}
              </p>
              <p>
                {draft.startAt} tot {draft.endAt} · {draft.securityCount}{" "}
                beveiliger(s)
              </p>
              <p>
                {euros(draft.hourlyRateCents)} per uur · budget{" "}
                {euros(draft.budgetCents)}
                {draft.negotiable ? " · bespreekbaar" : ""}
              </p>
              <p className="whitespace-pre-wrap">{draft.description}</p>
            </div>
          )}
          {step === 8 && (
            <label className="field sm:col-span-2">
              Publicatiestatus
              <select
                value={draft.status}
                onChange={(event) =>
                  update("status", event.target.value as Draft["status"])
                }
              >
                <option value="DRAFT">Als concept opslaan</option>
                <option value="PUBLISHED">Direct publiceren</option>
              </select>
            </label>
          )}
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={previous}
            disabled={step === 1 || saving}
            className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700 disabled:opacity-40"
          >
            Vorige
          </button>
          <button
            disabled={saving}
            type="submit"
            className="min-h-11 rounded-lg bg-orange-500 px-5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? "Opslaan..." : step === 8 ? "Opslaan" : "Volgende"}
          </button>
        </div>
      </form>
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950">Mijn opdrachten</h2>
          <span className="text-sm text-slate-500">{jobs.length} totaal</span>
        </div>
        <div className="mt-4 space-y-3">
          {jobs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              Nog geen opdrachten.
            </p>
          ) : (
            jobs.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.location} · {item.category} ·{" "}
                      {item._count.applications} reacties
                    </p>
                    <p className="mt-3 text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <select
                    aria-label={`Status van ${item.title}`}
                    value={item.status}
                    onChange={(event) =>
                      changeStatus(item.id, event.target.value)
                    }
                    className="rounded-lg border border-slate-300 p-2 text-sm font-semibold text-slate-700"
                  >
                    {statuses.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {item.status === "DRAFT" && (
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="mt-4 text-sm font-semibold text-red-600 hover:text-red-800"
                  >
                    Concept verwijderen
                  </button>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
