import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  CalendarCheck2,
  Check,
  ClipboardCheck,
  MessageSquareText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

const steps = [
  {
    icon: ClipboardCheck,
    number: "01",
    title: "Plaats of vind werk",
    text: "Ondernemers plaatsen een opdracht. Zelfstandige beveiligers kiezen werk dat past bij hun ervaring en planning.",
  },
  {
    icon: UserRoundCheck,
    number: "02",
    title: "Kies de juiste match",
    text: "Vergelijk reacties, profielgegevens en beschikbaarheid voordat je samenwerkt.",
  },
  {
    icon: CalendarCheck2,
    number: "03",
    title: "Werk met overzicht",
    text: "Berichten, planning, betaling en facturen blijven samen bij de opdracht.",
  },
];

const clientBenefits = [
  "Publiceer een opdracht in een paar stappen",
  "Beoordeel reacties van beschikbare professionals",
  "Bewaar afspraken, betalingen en facturen centraal",
];

const professionalBenefits = [
  "Ontdek opdrachten die bij jouw expertise passen",
  "Beheer profiel, agenda en beschikbaarheid zelf",
  "Ontvang betalingen via Stripe Connect",
];

function PrimaryLink({
  href,
  children,
  tone = "signal",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "signal" | "light" | "dark";
}) {
  const className = {
    signal: "bg-[#e76f51] text-white hover:bg-[#cf5f45]",
    light: "border border-white/45 bg-white/10 text-white hover:bg-white/20",
    dark: "bg-[#172629] text-white hover:bg-[#0e1719]",
  }[tone];

  return <Link href={href} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-bold transition-colors ${className}`}>{children}<ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} /></Link>;
}

function BenefitList({ items }: { items: string[] }) {
  return <ul className="mt-7 space-y-3">{items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#435054]"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d8eee7] text-[#08705f]"><Check aria-hidden="true" size={13} strokeWidth={3} /></span><span>{item}</span></li>)}</ul>;
}

export function MarketplaceHome({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return <main className="overflow-x-hidden bg-[#f7f8f5] text-[#172629]">
    <section className="relative isolate min-h-[620px] overflow-hidden bg-[#172629] text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2200&q=85')" }} />
      <div className="absolute inset-0 bg-[#132326]/75" />
      <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-5 pb-28 pt-16 sm:px-8 lg:px-10">
        <div className="max-w-3xl animate-home-reveal">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f7baaa]"><span className="h-px w-9 bg-[#e76f51]" />Nederlandse beveiligingsmarketplace</p>
          <h1 className="mt-6 text-5xl font-bold leading-[1.03] sm:text-6xl lg:text-7xl">Beveiliging voor iedere opdracht.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">Van evenement tot objectbeveiliging: SecurityMatch brengt ondernemers en zelfstandige beveiligers samen in een heldere, professionele werkflow.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><PrimaryLink href="/register?role=CLIENT"><BriefcaseBusiness aria-hidden="true" size={18} />Ik zoek beveiligers</PrimaryLink><PrimaryLink href="/register?role=SECURITY_PROFESSIONAL" tone="light"><ShieldCheck aria-hidden="true" size={18} />Ik ben ZZP-beveiliger</PrimaryLink></div>
          {isAuthenticated && <Link href="/jobs" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-[#e76f51] decoration-2 underline-offset-4 hover:text-[#f7baaa]">Bekijk open opdrachten <ArrowRight aria-hidden="true" size={16} /></Link>}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-[#0f1c1e]/90"><div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/15 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10"><div className="flex items-center gap-3 py-4 text-sm font-semibold"><BadgeCheck aria-hidden="true" className="text-[#f7baaa]" size={20} />Geverifieerde profielbasis</div><div className="flex items-center gap-3 py-4 text-sm font-semibold sm:pl-6"><MessageSquareText aria-hidden="true" className="text-[#f7baaa]" size={20} />Direct en beveiligd contact</div><div className="flex items-center gap-3 py-4 text-sm font-semibold sm:pl-6"><Banknote aria-hidden="true" className="text-[#f7baaa]" size={20} />Betaling en facturen centraal</div></div></div>
    </section>

    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08705f]">Kies jouw route</p><h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Eén platform, twee professionele werkstromen.</h2><p className="mt-4 text-base leading-7 text-[#566267]">Start met een account dat past bij je werk. Je houdt daarna zelf de regie over opdrachten, planning en communicatie.</p></div><div className="mt-10 grid gap-5 lg:grid-cols-2"><article id="opdrachtgevers" className="border border-[#dce4e1] bg-[#eff5f2] p-7 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#d8eee7] text-[#08705f]"><BriefcaseBusiness aria-hidden="true" size={22} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#08705f]">Voor ondernemers</p><h3 className="mt-3 text-2xl font-bold">Regel betrouwbare beveiliging zonder ruis.</h3><p className="mt-4 max-w-lg text-sm leading-7 text-[#526064]">Plaats een opdracht, beoordeel beschikbare beveiligers en behoud overzicht van de samenwerking van begin tot eind.</p><BenefitList items={clientBenefits} /><div className="mt-8"><PrimaryLink href="/register?role=CLIENT" tone="dark">Account voor ondernemer</PrimaryLink></div></article><article id="beveiligers" className="border border-[#e6ded8] bg-[#fff6f2] p-7 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fde2d8] text-[#bd513c]"><ShieldCheck aria-hidden="true" size={22} /></div><p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-[#bd513c]">Voor ZZP-beveiligers</p><h3 className="mt-3 text-2xl font-bold">Werk op jouw voorwaarden, met een sterk profiel.</h3><p className="mt-4 max-w-lg text-sm leading-7 text-[#526064]">Ontdek relevante opdrachten, laat zien wat je meebrengt en regel je planning en uitbetalingen op één plek.</p><BenefitList items={professionalBenefits} /><div className="mt-8"><PrimaryLink href="/register?role=SECURITY_PROFESSIONAL" tone="dark">Account voor ZZP-beveiliger</PrimaryLink></div></article></div></div></section>

    <section id="hoe-werkt-het" className="border-y border-[#dce4e1] bg-[#f7f8f5] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 border-b border-[#d5dfdb] pb-8 md:flex-row md:items-end"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08705f]">Werkwijze</p><h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Van eerste contact naar een goede inzet.</h2></div>{isAuthenticated && <Link href="/jobs" className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#172629] hover:text-[#08705f]">Open opdrachten bekijken <ArrowRight aria-hidden="true" size={17} /></Link>}</div><div className="grid gap-8 pt-9 md:grid-cols-3">{steps.map((step) => { const Icon = step.icon; return <article key={step.number} className="max-w-sm"><div className="flex items-center justify-between"><span className="text-sm font-bold text-[#08705f]">{step.number}</span><Icon aria-hidden="true" className="text-[#b8c8c1]" size={28} /></div><h3 className="mt-7 text-xl font-bold">{step.title}</h3><p className="mt-3 text-sm leading-7 text-[#59666a]">{step.text}</p></article>; })}</div></div></section>

    <section className="bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div role="img" aria-label="Professionals in overleg over een beveiligingsopdracht" className="h-[300px] rounded-lg bg-cover bg-center sm:h-[420px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=85')" }} /><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08705f]">Gebouwd voor de praktijk</p><h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Minder schakelen. Meer zekerheid.</h2><p className="mt-5 max-w-xl text-base leading-7 text-[#566267]">Een goede samenwerking vraagt om duidelijke afspraken. Daarom bundelt SecurityMatch het hele proces rondom de opdracht: van reactie en bericht tot agenda, betaling en factuur.</p><dl className="mt-8 grid gap-5 border-t border-[#dce4e1] pt-6 sm:grid-cols-2"><div><dt className="text-sm font-bold text-[#172629]">Voor opdrachtgevers</dt><dd className="mt-2 text-sm leading-6 text-[#59666a]">Snel overzicht van reacties, planning en administratie.</dd></div><div><dt className="text-sm font-bold text-[#172629]">Voor professionals</dt><dd className="mt-2 text-sm leading-6 text-[#59666a]">Een profiel en werkstroom die met je meebewegen.</dd></div></dl></div></div></section>

    <section className="bg-[#172629] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 lg:flex-row lg:items-end"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f7baaa]">Start vandaag</p><h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Kies de route die past bij jouw werk.</h2><p className="mt-4 text-base leading-7 text-slate-300">Maak een account als ondernemer of zelfstandige beveiligingsprofessional.</p></div><div className="flex flex-col gap-3 sm:flex-row"><PrimaryLink href="/register?role=CLIENT">Ik zoek beveiligers</PrimaryLink><PrimaryLink href="/register?role=SECURITY_PROFESSIONAL" tone="light">Ik ben ZZP-beveiliger</PrimaryLink></div></div></section>

  </main>;
}
