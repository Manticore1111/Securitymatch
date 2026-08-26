"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

type AccountRole = "CLIENT" | "SECURITY_PROFESSIONAL";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  className?: string;
};

const accountTypes: Array<{
  value: AccountRole;
  title: string;
  description: string;
  icon: typeof BriefcaseBusiness;
}> = [
  {
    value: "CLIENT",
    title: "Ik ben ondernemer",
    description: "Ik zoek beveiligers voor mijn organisatie of opdracht.",
    icon: BriefcaseBusiness,
  },
  {
    value: "SECURITY_PROFESSIONAL",
    title: "Ik ben ZZP-beveiliger",
    description: "Ik wil passende beveiligingsopdrachten vinden.",
    icon: ShieldCheck,
  },
];

function AuthShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f7f8f5] px-0 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden bg-white lg:min-h-[720px] lg:grid-cols-[0.88fr_1.12fr] lg:border lg:border-[#dce4e1]">
        <aside
          className="relative hidden overflow-hidden bg-[#172629] p-10 text-white lg:flex lg:flex-col lg:justify-between"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[#122124]/82" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#f7baaa]"
            >
              <ChevronLeft aria-hidden="true" size={17} />
              Terug naar SecurityMatch
            </Link>
            <div className="mt-24 max-w-sm">
              <p className="text-xs font-bold uppercase text-[#f7baaa]">
                Eenvoudig samenwerken
              </p>
              <h2 className="mt-5 text-4xl font-bold leading-tight">
                De beveiligingsmarketplace voor professionals.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-200">
                Van eerste match tot betaling: houd werk, communicatie en administratie op dezelfde plek.
              </p>
            </div>
          </div>
          <div className="relative border-t border-white/20 pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 aria-hidden="true" className="text-[#f7baaa]" size={21} />
              <p className="text-sm font-semibold">
                Voor ondernemers en zelfstandige beveiligers
              </p>
            </div>
          </div>
        </aside>
        <section className="flex min-h-full items-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-xl">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#526064] hover:text-[#08705f] lg:hidden"
            >
              <ChevronLeft aria-hidden="true" size={17} />
              Terug naar home
            </Link>
            <p className="mt-8 text-xs font-bold uppercase text-[#08705f] lg:mt-0">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#172629] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#59666a]">
              {intro}
            </p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  className = "",
}: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-bold text-[#344145]">{label}</span>
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="mt-2 block h-12 w-full rounded-lg border border-[#cfd9d5] bg-white px-3 text-sm text-[#172629] outline-none transition placeholder:text-[#899690] focus:border-[#08705f] focus:ring-2 focus:ring-[#d8eee7]"
      />
    </label>
  );
}

function PasswordField({
  autoComplete,
}: {
  autoComplete: "current-password" | "new-password";
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="text-sm font-bold text-[#344145]">Wachtwoord</span>
      <div className="relative mt-2">
        <LockKeyhole
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3.5 text-[#6e7b76]"
          size={17}
        />
        <input
          required
          name="password"
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          className="block h-12 w-full rounded-lg border border-[#cfd9d5] bg-white py-0 pl-10 pr-12 text-sm text-[#172629] outline-none transition focus:border-[#08705f] focus:ring-2 focus:ring-[#d8eee7]"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-[#566267] hover:bg-[#edf3ef] hover:text-[#172629]"
          aria-label={visible ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
          title={visible ? "Wachtwoord verbergen" : "Wachtwoord tonen"}
        >
          {visible ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
        </button>
      </div>
      {autoComplete === "new-password" && (
        <span className="mt-2 block text-xs leading-5 text-[#6e7b76]">
          Minimaal 12 tekens, met een hoofdletter, kleine letter en cijfer.
        </span>
      )}
    </label>
  );
}

function AccountTypePicker({
  value,
  onChange,
}: {
  value: AccountRole;
  onChange: (value: AccountRole) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-bold text-[#344145]">
        Voor wie maak je een account?
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {accountTypes.map((accountType) => {
          const Icon = accountType.icon;
          const selected = value === accountType.value;

          return (
            <label
              key={accountType.value}
              className={`relative cursor-pointer border p-4 transition ${
                selected
                  ? "border-[#08705f] bg-[#eff7f3]"
                  : "border-[#d8e1dd] bg-white hover:border-[#87afa2]"
              }`}
            >
              <input
                className="sr-only"
                type="radio"
                name="role"
                value={accountType.value}
                checked={selected}
                onChange={() => onChange(accountType.value)}
              />
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-[#08705f] text-white"
                      : "bg-[#edf3ef] text-[#526064]"
                  }`}
                >
                  <Icon aria-hidden="true" size={18} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#172629]">
                    {accountType.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#5e6c67]">
                    {accountType.description}
                  </span>
                </span>
              </div>
              {selected && (
                <CheckCircle2
                  aria-hidden="true"
                  className="absolute right-3 top-3 text-[#08705f]"
                  size={17}
                />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      setError("Controleer je e-mailadres of gebruikersnaam en wachtwoord.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Welkom terug"
      title="Log in en ga verder waar je bleef."
      intro="Beheer je opdrachten, berichten, planning en betalingen vanuit jouw persoonlijke overzicht."
    >
      <form action={submit} className="mt-8 space-y-5">
        <Field
          label="E-mailadres of gebruikersnaam"
          name="email"
          autoComplete="username"
        />
        <PasswordField autoComplete="current-password" />
        {error && (
          <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#08705f] px-5 text-sm font-bold text-white transition hover:bg-[#065b4d] disabled:cursor-wait disabled:opacity-60"
          type="submit"
        >
          {loading ? "Inloggen..." : "Inloggen"}
          <ArrowRight aria-hidden="true" size={17} />
        </button>
      </form>
      <div className="mt-6 flex flex-col gap-3 border-t border-[#e2e8e4] pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <Link className="font-bold text-[#08705f] hover:text-[#065b4d]" href="/forgot-password">
          Wachtwoord vergeten?
        </Link>
        <p className="text-[#59666a]">
          Nog geen account?{" "}
          <Link
            className="font-bold text-[#172629] underline decoration-[#e76f51] decoration-2 underline-offset-4"
            href="/register"
          >
            Account maken
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export function RegisterForm() {
  const searchParams = useSearchParams();
  const requestedRole =
    searchParams.get("role") === "CLIENT" ? "CLIENT" : "SECURITY_PROFESSIONAL";
  const [role, setRole] = useState<AccountRole>(requestedRole);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          termsAccepted: formData.get("termsAccepted") === "true",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Registreren is niet gelukt.");
        return;
      }

      setSuccess(result.message);
    } catch {
      setError("Er ging iets mis met de verbinding. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Nieuw account"
      title="Maak jouw SecurityMatch-account."
      intro="Kies eerst hoe je SecurityMatch gaat gebruiken. Je kunt daarna direct je profiel en werkruimte inrichten."
    >
      <form action={submit} className="mt-8 space-y-6">
        <AccountTypePicker value={role} onChange={setRole} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Voornaam" name="firstName" autoComplete="given-name" />
          <Field label="Achternaam" name="lastName" autoComplete="family-name" />
        </div>
        <Field label="Zakelijk e-mailadres" name="email" type="email" autoComplete="email" />
        <PasswordField autoComplete="new-password" />
        <div className="flex items-start gap-3 border-t border-[#e2e8e4] pt-5">
          <input id="termsAccepted" required name="termsAccepted" value="true" type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[#08705f]" />
          <label htmlFor="termsAccepted" className="text-sm leading-6 text-[#526064]">Ik ga akkoord met de <Link href="/voorwaarden" target="_blank" className="font-bold text-[#172629] underline decoration-[#e76f51] decoration-2 underline-offset-3">platformvoorwaarden</Link> en heb de <Link href="/privacy" target="_blank" className="font-bold text-[#172629] underline decoration-[#e76f51] decoration-2 underline-offset-3">privacyverklaring</Link> gelezen.</label>
        </div>
        {error && (
          <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        {success && (
          <div className="border border-[#b9dfd2] bg-[#eff7f3] p-4 text-sm text-[#075c4e]">
            <div className="flex gap-2">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
              <p className="font-semibold">{success}</p>
            </div>
            <Link className="mt-3 inline-flex items-center gap-2 font-bold underline underline-offset-4" href="/login">
              Ga naar inloggen
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        )}
        <button
          disabled={loading || Boolean(success)}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#e76f51] px-5 text-sm font-bold text-white transition hover:bg-[#cf5f45] disabled:cursor-wait disabled:opacity-60"
          type="submit"
        >
          {loading ? "Account maken..." : "Account maken"}
          <ArrowRight aria-hidden="true" size={17} />
        </button>
      </form>
      <p className="mt-6 border-t border-[#e2e8e4] pt-6 text-sm text-[#59666a]">
        Heb je al een account?{" "}
        <Link
          className="font-bold text-[#172629] underline decoration-[#e76f51] decoration-2 underline-offset-4"
          href="/login"
        >
          Inloggen
        </Link>
      </p>
    </AuthShell>
  );
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData)),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <AuthShell
      eyebrow="Wachtwoord herstellen"
      title="Krijg weer toegang tot je account."
      intro="Vul je zakelijke e-mailadres in. Je ontvangt alleen instructies als het account bekend is."
    >
      {sent ? (
        <div className="mt-8 border border-[#b9dfd2] bg-[#eff7f3] p-4 text-sm text-[#075c4e]">
          <div className="flex gap-2">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
            <p className="font-semibold">Controleer je inbox op verdere instructies.</p>
          </div>
        </div>
      ) : (
        <form action={submit} className="mt-8 space-y-5">
          <Field
            label="Zakelijk e-mailadres"
            name="email"
            type="email"
            autoComplete="email"
          />
          <button
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#08705f] px-5 text-sm font-bold text-white transition hover:bg-[#065b4d] disabled:cursor-wait disabled:opacity-60"
            type="submit"
          >
            {loading ? "Versturen..." : "Verstuur instructies"}
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        </form>
      )}
      <Link className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#526064] hover:text-[#08705f]" href="/login">
        <ChevronLeft aria-hidden="true" size={16} />
        Terug naar inloggen
      </Link>
    </AuthShell>
  );
}
