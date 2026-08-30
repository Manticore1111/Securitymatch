"use client";

import { useState } from "react";

type Document = {
  id: string;
  fileName: string;
  type: string;
  status: string;
  rejectionReason: string | null;
  user: { firstName: string; lastName: string; email: string };
};

type AdminWorkspaceProps = {
  initialDocuments: Document[];
  counts: Record<string, number>;
};

function statusClass(status: string) {
  if (status === "APPROVED" || status === "VERIFIED")
    return "bg-emerald-50 text-emerald-700";
  if (status === "REJECTED") return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-800";
}

export function AdminWorkspace({
  initialDocuments,
  counts,
}: AdminWorkspaceProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [reason, setReason] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  async function updateDocument(id: string, status: "APPROVED" | "REJECTED") {
    setUpdatingId(id);
    setError("");
    try {
      const response = await fetch(`/api/admin/documents?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          rejectionReason: status === "REJECTED" ? reason : "",
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(
          result.error ?? "De documentstatus kon niet worden bijgewerkt.",
        );
        return;
      }
      setDocuments((items) =>
        items.map((document) =>
          document.id === id
            ? {
                ...document,
                status,
                rejectionReason: status === "REJECTED" ? reason || null : null,
              }
            : document,
        ),
      );
    } catch {
      setError("De documentstatus kon niet worden bijgewerkt.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
            Platformbeheer
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            SecurityMatch beheer
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Volg marktactiviteit, controleer documenten en bewaak de
            operationele basis van het platform.
          </p>
        </header>
        <section
          aria-label="Kerncijfers"
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          {Object.entries(counts).map(([label, value]) => (
            <article
              key={label}
              className="border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {label}
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-950">{value}</p>
            </article>
          ))}
        </section>
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                Verificatie
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Documenten beoordelen
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Beslissingen worden geregistreerd in de auditlog.
              </p>
            </div>
            <label className="w-full max-w-sm text-sm font-semibold text-slate-700">
              Afwijsreden voor een besluit
              <input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Bijvoorbeeld: document is niet leesbaar"
                className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-normal text-slate-950 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>
          {error && (
            <p
              role="alert"
              className="mt-4 border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"
            >
              {error}
            </p>
          )}
          <div className="mt-5 overflow-hidden border border-slate-200 bg-white">
            <div className="hidden grid-cols-[minmax(0,1fr)_10rem_10rem] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 md:grid">
              <span>Document en eigenaar</span>
              <span>Status</span>
              <span>Besluit</span>
            </div>
            {documents.map((document) => (
              <article
                key={document.id}
                className="grid gap-4 border-b border-slate-100 p-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_10rem_10rem] md:items-center"
              >
                <div>
                  <p className="font-bold text-slate-950">
                    {document.fileName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {document.user.firstName} {document.user.lastName} ·{" "}
                    {document.user.email}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {document.type}
                    {document.rejectionReason
                      ? ` · ${document.rejectionReason}`
                      : ""}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusClass(document.status)}`}
                  >
                    {document.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/api/documents/${document.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Document bekijken
                  </a>
                  <button
                    type="button"
                    onClick={() => updateDocument(document.id, "APPROVED")}
                    disabled={Boolean(updatingId)}
                    className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {updatingId === document.id ? "Bijwerken..." : "Goedkeuren"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateDocument(document.id, "REJECTED")}
                    disabled={Boolean(updatingId)}
                    className="rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                  >
                    Afwijzen
                  </button>
                </div>
              </article>
            ))}
            {documents.length === 0 && (
              <div className="p-10 text-center">
                <p className="font-bold text-slate-900">
                  Geen documenten wachten op beoordeling
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Nieuwe uploads verschijnen hier automatisch.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
