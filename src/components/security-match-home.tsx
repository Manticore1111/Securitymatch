import type { ReactNode } from "react";

const howItWorks = [
  {
    number: "01",
    title: "Maak je profiel",
    text: "Laat zien wie je bent, waar je ervaring ligt en wanneer je beschikbaar bent.",
  },
  {
    number: "02",
    title: "Vind de juiste match",
    text: "Bekijk opdrachten of professionals die passen bij jouw beveiligingsvraag.",
  },
  {
    number: "03",
    title: "Werk met vertrouwen",
    text: "Maak afspraken rechtstreeks en bouw samen aan langdurige samenwerkingen.",
  },
];

const securityBenefits = [
  "Vind opdrachten die passen bij jouw certificaten en ervaring",
  "Houd zelf de regie over je beschikbaarheid en tarief",
  "Bouw aan een professioneel profiel binnen de branche",
];

const clientBenefits = [
  "Vind snel beschikbare beveiligers voor jouw locatie",
  "Vergelijk ervaring, specialisaties en beoordelingen",
  "Werk met professionals die zichtbaar en verifieerbaar zijn",
];

const reviews = [
  {
    quote:
      "Eindelijk een plek die begrijpt dat beveiliging draait om vertrouwen en de juiste match, niet om zoveel mogelijk reacties.",
    name: "Martijn de Vries",
    role: "Security manager, Rotterdam",
  },
  {
    quote:
      "Als zelfstandige wil ik vooral duidelijkheid. Ik zie meteen welke opdrachten passen bij mijn ervaring en planning.",
    name: "Sanne Jansen",
    role: "ZZP-beveiliger, Utrecht",
  },
  {
    quote:
      "De persoonlijke aanpak spreekt me aan. Goede beveiliging begint met weten met wie je samenwerkt.",
    name: "Erik van Dijk",
    role: "Eventorganisator, Amsterdam",
  },
];

const faqs = [
  {
    question: "Voor wie is SecurityMatch bedoeld?",
    answer:
      "SecurityMatch is er voor zelfstandige beveiligers en opdrachtgevers die beveiligingspersoneel zoeken. Beide groepen vinden elkaar op één professioneel platform.",
  },
  {
    question: "Is SecurityMatch een uitzendbureau?",
    answer:
      "Nee. SecurityMatch is een marketplace. Beveiligers en opdrachtgevers bepalen zelf met wie ze samenwerken en maken rechtstreeks afspraken.",
  },
  {
    question: "Welke beveiligers kunnen zich aansluiten?",
    answer:
      "Iedere zelfstandige professional in de beveiligingsbranche kan straks een profiel aanmaken. Relevante certificaten en ervaring helpen bij een sterke match.",
  },
  {
    question: "Wanneer kan ik SecurityMatch gebruiken?",
    answer:
      "Het platform wordt stap voor stap ontwikkeld. Schrijf je in voor updates zodra registratie beschikbaar is.",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export function Button({
  children,
  variant = "dark",
  href = "#start",
}: {
  children: ReactNode;
  variant?: "dark" | "orange" | "light";
  href?: string;
}) {
  const styles = {
    dark: "bg-slate-950 text-white hover:bg-orange-600",
    orange: "bg-orange-500 text-white hover:bg-orange-600",
    light: "border border-slate-300 bg-white text-slate-900 hover:border-slate-950",
  };

  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-5 text-sm font-bold transition-colors ${styles[variant]}`}
    >
      {children}
      <ArrowIcon />
    </a>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl">
        {title}
      </h2>
      {text && <p className="mt-5 text-base leading-7 text-slate-600">{text}</p>}
    </div>
  );
}

function BenefitList({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function AudienceCard({
  label,
  title,
  text,
  items,
  action,
  accent,
  href,
}: {
  label: string;
  title: string;
  text: string;
  items: string[];
  action: string;
  accent: "orange" | "blue";
  href: string;
}) {
  return (
    <article
      className={`rounded-2xl p-7 sm:p-10 ${accent === "orange" ? "bg-orange-50" : "bg-slate-100"}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <h3 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
        {title}
      </h3>
      <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">{text}</p>
      <BenefitList items={items} />
      <Button variant={accent === "orange" ? "orange" : "dark"} href={href}>{action}</Button>
    </article>
  );
}

export function SecurityMatchHome() {
  return (
    <main className="overflow-hidden">
      <section id="top" className="relative bg-[#f7f9fc]">
        <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
          <div className="relative z-10">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              <span className="h-px w-8 bg-orange-500" /> De marketplace voor beveiliging
            </p>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.06em] text-slate-950 sm:text-7xl lg:text-[76px]">
              Sterke matches. <span className="text-orange-600">Veilige</span> samenwerking.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              SecurityMatch brengt ervaren ZZP-beveiligers en opdrachtgevers samen. Vind de juiste professional voor elke opdracht, of de opdracht die bij jou past.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button variant="orange" href="/register">Opdracht plaatsen</Button>
              <Button variant="light" href="/jobs">Opdrachten zoeken</Button>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex -space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f9fc] bg-slate-300 text-[10px] text-slate-700">MV</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f9fc] bg-orange-200 text-[10px] text-orange-800">SJ</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f7f9fc] bg-slate-800 text-[10px] text-white">+ </span>
              </span>
              Gebouwd voor professionals in heel Nederland
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-8 rounded-full bg-orange-200/50 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 shadow-2xl shadow-slate-900/20 sm:p-8">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-orange-500/20 blur-2xl" />
              <div className="relative flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">SecurityMatch</p>
                  <p className="mt-2 text-xl font-bold text-white">De juiste match begint hier.</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">↗</span>
              </div>
              <div className="relative mt-8 space-y-3">
                <div className="rounded-xl bg-white p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-orange-600">Beschikbaar</span><span className="h-2 w-2 rounded-full bg-emerald-500" /></div>
                  <p className="mt-3 font-bold text-slate-950">Beveiliger voor evenement</p>
                  <p className="mt-1 text-xs text-slate-500">Amsterdam · 12 professionals beschikbaar</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Jouw netwerk</p>
                  <div className="mt-3 flex items-end justify-between"><span className="text-3xl font-bold text-white">100%</span><span className="text-xs text-orange-300">vertrouwen</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hoe-werkt-het" className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Eenvoudig geregeld" title="Van vraag naar sterke samenwerking." text="Geen ruis, geen eindeloze tussenstappen. SecurityMatch maakt het vinden van de juiste match overzichtelijk." />
          <div className="mt-14 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-3 md:gap-6">
            {howItWorks.map((step) => <div key={step.number} className="relative"><span className="text-5xl font-bold tracking-[-0.06em] text-orange-200">{step.number}</span><h3 className="mt-6 text-lg font-bold text-slate-950">{step.title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">{step.text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto max-w-7xl"><SectionIntro eyebrow="Twee kanten, één platform" title="Gemaakt voor hoe beveiliging echt werkt." text="Een goed resultaat ontstaat wanneer de juiste mensen elkaar vinden. Daarom geven we beide kanten de tools en duidelijkheid om professioneel samen te werken." /><div className="mt-14 grid gap-5 lg:grid-cols-2"><div id="beveiligers"><AudienceCard label="Voor zelfstandige professionals" title="Jouw vak. Jouw opdrachten. Jouw regie." text="Profileer jezelf als professional en kies opdrachten die aansluiten op jouw expertise, voorkeuren en beschikbaarheid." items={securityBenefits} action="Ik ben beveiliger" accent="orange" href="/register" /></div><div id="opdrachtgevers"><AudienceCard label="Voor organisaties en bedrijven" title="De juiste beveiliging voor jouw opdracht." text="Vind betrouwbare beveiligers die passen bij jouw locatie, type evenement en specifieke beveiligingsvraag." items={clientBenefits} action="Ik zoek beveiligers" accent="blue" href="/register" /></div></div></div>
      </section>

      <section className="bg-orange-50 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><SectionIntro eyebrow="Vertrouwen staat voorop" title="Zichtbaar professioneel. Persoonlijk geverifieerd." text="In beveiliging wil je weten met wie je samenwerkt. SecurityMatch maakt relevante ervaring, certificaten en beoordelingen inzichtelijk." /><div className="grid grid-cols-2 gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 sm:p-6"><span className="text-2xl">✓</span><p className="mt-8 text-sm font-bold leading-5 text-slate-950">Profielen met relevante ervaring</p></div><div className="rounded-2xl bg-white p-5 sm:p-6"><span className="text-2xl">◇</span><p className="mt-8 text-sm font-bold leading-5 text-slate-950">Certificaten zichtbaar</p></div><div className="col-span-2 rounded-2xl bg-slate-950 p-5 text-white sm:col-span-1 sm:p-6"><span className="text-2xl text-orange-400">★</span><p className="mt-8 text-sm font-bold leading-5">Echte beoordelingen na samenwerking</p></div></div></div></section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto max-w-7xl"><SectionIntro eyebrow="Ervaringen" title="Vertrouwen werkt twee kanten op." /><div className="mt-14 grid gap-5 lg:grid-cols-3">{reviews.map((review) => <figure key={review.name} className="flex min-h-64 flex-col justify-between rounded-2xl border border-slate-200 p-6"><blockquote className="text-base font-semibold leading-7 text-slate-800">“{review.quote}”</blockquote><figcaption className="mt-8 border-t border-slate-200 pt-4"><p className="text-sm font-bold text-slate-950">{review.name}</p><p className="mt-1 text-xs text-slate-500">{review.role}</p></figcaption></figure>)}</div></div></section>

      <section className="bg-[#f7f9fc] px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr]"><SectionIntro eyebrow="Veelgestelde vragen" title="Duidelijkheid hoort bij goed samenwerken." /> <div className="divide-y divide-slate-200 border-t border-slate-200">{faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold text-slate-950 [&::-webkit-details-marker]:hidden">{faq.question}<span className="text-2xl font-normal text-orange-600 transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pr-10 pt-4 text-sm leading-7 text-slate-600">{faq.answer}</p></details>)}</div></div></section>

      <section id="start" className="bg-orange-500 px-5 py-20 sm:px-8 lg:px-10 lg:py-24"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">Word onderdeel van SecurityMatch</p><h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-[-0.05em] text-white sm:text-5xl">De volgende sterke samenwerking begint bij jou.</h2></div><Button variant="dark" href="/register">Account maken</Button></div></section>

      <footer className="bg-slate-950 px-5 py-10 text-white sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><div><a href="#top" className="text-xl font-bold tracking-[-0.05em]">Security<span className="text-orange-500">Match</span></a><p className="mt-3 text-sm text-slate-400">Beveiliging, beter verbonden.</p></div><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400"><a href="#hoe-werkt-het" className="hover:text-white">Hoe werkt het?</a><a href="#beveiligers" className="hover:text-white">Beveiligers</a><a href="#opdrachtgevers" className="hover:text-white">Opdrachtgevers</a><a href="#start" className="hover:text-white">Contact</a></div><p className="text-xs text-slate-500">© 2026 SecurityMatch</p></div></footer>
    </main>
  );
}
