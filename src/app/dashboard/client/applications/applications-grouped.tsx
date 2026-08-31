"use client";

import Link from "next/link";
import { useState } from "react";

type Application = {
  id: string;
  availability: boolean;
  proposedRateCents: number | null;
  coverNote: string | null;
  relevantExperience: string | null;
  status: string;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    startAt: string;
    endAt: string;
    location: string;
  };
  applicant: {
    id: string;
    firstName: string;
    lastName: string;
    securityProfile: {
      bio: string | null;
      city: string | null;
      workArea: string | null;
      yearsExperience: number | null;
      specializations: string[];
      languages: string[];
      driverLicense: string | null;
      ownTransport: boolean;
      verificationStatus: string;
      ratingAverage: number | null;
      ratingCount: number;
      hourlyRateCents: number | null;
    } | null;
  };
};

const sections = [
  {
    status: "PENDING",
    title: "Openstaande reacties",
    description: "Deze reacties moeten nog beoordeeld worden.",
    className: "border-slate-200",
  },
  {
    status: "ACCEPTED",
    title: "Goedgekeurde reacties",
    description: "Deze beveiligers zijn geselecteerd voor een opdracht.",
    className: "border-emerald-200",
  },
  {
    status: "REJECTED",
    title: "Afgewezen reacties",
    description: "Deze reacties zijn niet geselecteerd.",
    className: "border-red-200",
  },
];

function statusLabel(status: string) {
  if (status === "ACCEPTED") return "Goedgekeurd";
  if (status === "REJECTED") return "Afgewezen";
  return "Openstaand";
}

export function ApplicationsManager({
  initialApplications,
}: {
  currentUserId: string;
  initialApplications: Application[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function decide(id: string, status: "ACCEPTED" | "REJECTED") {
    setError("");
    const application = applications.find((item) => item.id === id);
    if (
      status === "ACCEPTED" &&
      application &&
      !window.confirm(
        `Selecteer ${application.applicant.firstName} ${application.applicant.lastName.charAt(0)}. voor opdracht '${application.job.title}'?`,
      )
    ) {
      return;
    }
    const response = await fetch(`/api/applications?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (response.ok) {
      setApplications((items) =>
        items.map((item) => (item.id === id ? { ...item, status } : item)),
      );
    } else {
      setError(result.error ?? "De reactie kon niet worden verwerkt.");
    }
  }

  async function send(application: Application) {
    if (!message.trim()) return;
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientId: application.applicant.id,
        jobId: application.job.id,
        body: message,
      }),
    });
    const result = await response.json();
    setMessage(
      response.ok
        ? ""
        : result.error ?? "Bericht versturen is niet gelukt.",
    );
  }

  function renderApplication(application: Application) {
    const profile = application.applicant.securityProfile;
    return (
      <article key={application.id} className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold text-slate-950">
              {application.applicant.firstName} {application.applicant.lastName.charAt(0)}.
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {application.job.title} · {application.job.location}
            </p>
            <p className="mt-3 text-sm text-slate-700">
              Beschikbaar: {application.availability ? "Ja" : "Nee"} · gewenst tarief: € {((application.proposedRateCents ?? 0) / 100).toFixed(2)}
            </p>
          </div>
          <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {statusLabel(application.status)}
          </span>
        </div>
        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2">
          <div>
            <h4 className="font-bold text-slate-950">Reactie</h4>
            <p className="mt-2 whitespace-pre-wrap text-slate-600">
              {application.coverNote}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-950">Profiel en ervaring</h4>
            <p className="mt-2 text-slate-600">
              {profile?.bio || application.relevantExperience}
              <br />
              {profile?.yearsExperience ?? 0} jaar ervaring · {profile?.city || "Plaats onbekend"}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {profile?.specializations.join(", ")}
            </p>
            <p className="mt-2 text-xs font-bold text-emerald-700">
              {profile?.verificationStatus === "VERIFIED"
                ? "Geverifieerde beveiliger"
                : "Verificatie in behandeling"}
            </p>
            <Link
              href={`/dashboard/client/candidates/${application.applicant.id}`}
              className="mt-3 inline-block text-sm font-bold text-orange-600"
            >
              Profiel bekijken
            </Link>
          </div>
        </div>
        {application.status === "PENDING" && (
          <div className="mt-5 flex gap-3">
            <button
              onClick={() => decide(application.id, "ACCEPTED")}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
            >
              Goedkeuren
            </button>
            <button
              onClick={() => decide(application.id, "REJECTED")}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700"
            >
              Afwijzen
            </button>
          </div>
        )}
        <div className="mt-5 flex gap-3">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Bericht aan deze beveiliger"
          />
          <button
            onClick={() => send(application)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
          >
            Bericht sturen
          </button>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/dashboard/client" className="text-sm font-bold text-slate-600">
          ← Dashboard
        </Link>
        <h1 className="mt-10 text-3xl font-bold text-slate-950">
          Reacties ontvangen
        </h1>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {applications.length === 0 && (
          <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
            Nog geen reacties ontvangen.
          </p>
        )}
        <div className="mt-6 space-y-10">
          {sections.map((section) => {
            const items = applications.filter((item) => item.status === section.status);
            return (
              <section key={section.status}>
                <div className={`border-b pb-4 ${section.className}`}>
                  <h2 className="text-2xl font-bold text-slate-950">
                    {section.title} ({items.length})
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {section.description}
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                  {items.length === 0 ? (
                    <p className="border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                      Geen reacties in deze categorie.
                    </p>
                  ) : (
                    items.map(renderApplication)
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
