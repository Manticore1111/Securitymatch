"use client";

import { useEffect, useRef, useState } from "react";
import { specializationOptions } from "@/lib/security-profile-validation";

type ProfileData = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  bio: string;
  city: string;
  workArea: string;
  hourlyRateCents: number;
  yearsExperience: number;
  specializations: string[];
  languages: string[];
  driverLicense: string;
  ownTransport: boolean;
  availability: string;
};
const emptyProfile: ProfileData = {
  firstName: "",
  lastName: "",
  avatarUrl: "",
  bio: "",
  city: "",
  workArea: "",
  hourlyRateCents: 0,
  yearsExperience: 0,
  specializations: [],
  languages: [],
  driverLicense: "",
  ownTransport: false,
  availability: "",
};

type UserDocument = {
  id: string;
  type: string;
  fileName: string;
  status: string;
  createdAt: string;
};

export function DocumentUpload() {
  const [type, setType] = useState("CERTIFICATE");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/documents")
      .then((response) => response.json())
      .then((result) => setDocuments(result.documents ?? []))
      .catch(() => setError("Documenten konden niet worden geladen."));
  }, []);

  async function upload() {
    if (!file) {
      setError("Kies eerst een bestand.");
      return;
    }
    setUploading(true);
    setError("");
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) setError(result.error ?? "Uploaden is niet gelukt.");
      else {
        setMessage("Document geüpload en wacht op controle.");
        if (result.document) setDocuments((current) => [result.document, ...current]);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch {
      setError("Uploaden is niet gelukt.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="border-t border-slate-200 pt-8">
      <h2 className="text-lg font-bold text-slate-950">Documenten</h2>
      <p className="mt-2 text-sm text-slate-600">
        Upload documenten die je bevoegdheid en ervaring aantonen.
      </p>
      <div
        className="mt-5 grid gap-4 sm:grid-cols-[1fr_1.5fr_auto] sm:items-end"
      >
        <label className="field">
          Type document
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="CERTIFICATE">Certificaat</option>
            <option value="SECURITY_PASS">Beveiligingspas</option>
            <option value="IDENTITY">Identiteitsbewijs</option>
            <option value="CONTRACT">Contract</option>
            <option value="OTHER">Anders</option>
          </select>
        </label>
        <label className="field">
          Bestand
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          {file && (
            <span className="mt-2 block text-xs font-semibold text-slate-600">
              Geselecteerd: {file.name}
            </span>
          )}
        </label>
        <button
          disabled={uploading || !file}
          type="button"
          onClick={upload}
          className="min-h-12 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {uploading ? "Uploaden..." : "Document uploaden"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="mt-3 text-sm font-semibold text-emerald-700"
        >
          {message}
        </p>
      )}
      <p className="mt-3 text-xs text-slate-500">
        PDF, JPG of PNG. Maximaal 10 MB.
      </p>
      {documents.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-bold text-slate-950">Geüploade documenten</h3>
          {documents.map((document) => (
            <div key={document.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-sm">
              <span className="font-semibold text-slate-700">{document.fileName}</span>
              <span className="text-slate-500">{document.status === "PENDING" ? "Wacht op controle" : document.status}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const [data, setData] = useState<ProfileData>({
    ...emptyProfile,
    ...initialData,
  });
  const [languageInput, setLanguageInput] = useState(data.languages.join(", "));
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  function update(field: keyof ProfileData, value: string | number | boolean) {
    setData((current) => ({ ...current, [field]: value }));
  }
  function toggleSpecialization(value: string) {
    setData((current) => ({
      ...current,
      specializations: current.specializations.includes(value)
        ? current.specializations.filter((item) => item !== value)
        : [...current.specializations, value],
    }));
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/security-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        languages: languageInput
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) setError(result.error ?? "Opslaan is niet gelukt.");
    else setStatus("Profiel opgeslagen.");
  }
  return (
    <form onSubmit={submit} className="space-y-8">
      <section>
        <h2 className="text-lg font-bold text-slate-950">
          Persoonlijke gegevens
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="field">
            Voornaam
            <input
              required
              value={data.firstName}
              onChange={(event) => update("firstName", event.target.value)}
            />
          </label>
          <label className="field">
            Achternaam
            <input
              required
              value={data.lastName}
              onChange={(event) => update("lastName", event.target.value)}
            />
          </label>
          <label className="field sm:col-span-2">
            Profielfoto URL
            <input
              type="url"
              placeholder="https://..."
              value={data.avatarUrl}
              onChange={(event) => update("avatarUrl", event.target.value)}
            />
          </label>
          <label className="field sm:col-span-2">
            Korte introductie
            <textarea
              required
              rows={4}
              value={data.bio}
              onChange={(event) => update("bio", event.target.value)}
            />
          </label>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-950">Werkprofiel</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="field">
            Woonplaats
            <input
              required
              value={data.city}
              onChange={(event) => update("city", event.target.value)}
            />
          </label>
          <label className="field">
            Werkgebied
            <input
              required
              value={data.workArea}
              onChange={(event) => update("workArea", event.target.value)}
            />
          </label>
          <label className="field">
            Uurtarief in euro
            <input
              required
              type="number"
              min="0"
              step="0.50"
              value={data.hourlyRateCents / 100}
              onChange={(event) =>
                update(
                  "hourlyRateCents",
                  Math.round(Number(event.target.value) * 100),
                )
              }
            />
          </label>
          <label className="field">
            Jaren ervaring
            <input
              required
              type="number"
              min="0"
              max="80"
              value={data.yearsExperience}
              onChange={(event) =>
                update("yearsExperience", Number(event.target.value))
              }
            />
          </label>
          <label className="field">
            Rijbewijs
            <input
              placeholder="Bijv. B, BE"
              value={data.driverLicense}
              onChange={(event) => update("driverLicense", event.target.value)}
            />
          </label>
          <label className="field">
            Talen
            <input
              placeholder="Nederlands, Engels"
              value={languageInput}
              onChange={(event) => setLanguageInput(event.target.value)}
            />
          </label>
          <label className="field sm:col-span-2">
            Beschikbaarheid
            <textarea
              rows={3}
              placeholder="Bijv. doordeweeks vanaf 18:00 en in het weekend"
              value={data.availability}
              onChange={(event) => update("availability", event.target.value)}
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={data.ownTransport}
              onChange={(event) => update("ownTransport", event.target.checked)}
            />{" "}
            Eigen vervoer beschikbaar
          </label>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold text-slate-950">Specialisaties</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {specializationOptions.map((specialization) => (
            <label
              key={specialization}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700"
            >
              <input
                type="checkbox"
                checked={data.specializations.includes(specialization)}
                onChange={() => toggleSpecialization(specialization)}
              />
              {specialization}
            </label>
          ))}
        </div>
      </section>
      <DocumentUpload />
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}
      {status && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700"
        >
          {status}
        </p>
      )}
      <button
        disabled={saving}
        type="submit"
        className="min-h-12 rounded-lg bg-orange-500 px-6 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {saving ? "Opslaan..." : "Profiel opslaan"}
      </button>
    </form>
  );
}
