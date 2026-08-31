import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Building2, Mail, ShieldCheck } from "lucide-react";
import { legalDetails, legalDetailsAreComplete, legalLastUpdated } from "@/lib/legal";

const legalLinks = [
  { href: "/voorwaarden", label: "Platformvoorwaarden" },
  { href: "/privacy", label: "Privacyverklaring" },
  { href: "/privacy-verzoek", label: "AVG-verzoek indienen" },
  { href: "/cookies", label: "Cookiebeleid" },
  { href: "/klachten", label: "Klachten en geschillen" },
  { href: "/annuleren", label: "Annuleren en terugbetalen" },
  { href: "/verificatie", label: "Verificatiebeleid" },
  { href: "/veiligheid", label: "Veiligheid en moderatie" },
  { href: "/toegankelijkheid", label: "Toegankelijkheid" },
];

export function LegalDataNotice() {
  if (legalDetailsAreComplete) return null;

  return <aside role="status" className="mt-8 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><div className="flex gap-3"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" size={19} /><div><p className="font-bold">Bedrijfsgegevens zijn nog niet volledig ingesteld.</p><p className="mt-1 leading-6">Vul vóór een publieke lancering de juridische naam, het adres, KvK-nummer en contactgegevens in via de omgevingsvariabelen uit `.env.example`.</p></div></div></aside>;
}

export function LegalContactCard() {
  return <section className="mt-10 border border-[#dce4e1] bg-[#f7f8f5] p-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d8eee7] text-[#08705f]"><Building2 aria-hidden="true" size={18} /></span><div><p className="text-sm font-bold text-[#172629]">Contactgegevens verantwoordelijke</p><p className="text-xs text-[#687670]">Voor juridische, privacy- en platformvragen</p></div></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="font-semibold text-[#687670]">Handelsnaam</dt><dd className="mt-1 font-bold text-[#172629]">{legalDetails.brandName}</dd></div><div><dt className="font-semibold text-[#687670]">Juridische entiteit</dt><dd className="mt-1 font-bold text-[#172629]">{legalDetails.entityName}</dd></div><div><dt className="font-semibold text-[#687670]">Vestigingsadres</dt><dd className="mt-1 text-[#344145]">{legalDetails.address}<br />{legalDetails.postalCode} {legalDetails.city}</dd></div><div><dt className="font-semibold text-[#687670]">KvK-nummer</dt><dd className="mt-1 text-[#344145]">{legalDetails.chamberOfCommerceNumber}</dd></div><div><dt className="font-semibold text-[#687670]">Btw-nummer</dt><dd className="mt-1 text-[#344145]">{legalDetails.vatNumber}</dd></div><div><dt className="font-semibold text-[#687670]">Contact</dt><dd className="mt-1 text-[#344145]"><span className="flex items-center gap-2"><Mail aria-hidden="true" size={15} />{legalDetails.email}</span><span className="mt-1 block">{legalDetails.phone}</span></dd></div></dl></section>;
}

export function LegalPage({ eyebrow, title, introduction, children }: { eyebrow: string; title: string; introduction: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#f7f8f5] px-5 py-10 sm:px-8 lg:px-10"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]"><aside className="lg:sticky lg:top-24 lg:h-fit"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#526064] hover:text-[#08705f]"><ArrowLeft aria-hidden="true" size={16} />Terug naar home</Link><div className="mt-8 hidden border-l border-[#d8e1dd] lg:block"><p className="px-4 text-xs font-bold uppercase tracking-[0.14em] text-[#08705f]">Juridisch</p><nav aria-label="Juridische pagina's" className="mt-3 grid gap-1">{legalLinks.map((link) => <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-semibold text-[#526064] hover:bg-white hover:text-[#172629]">{link.label}</Link>)}</nav></div></aside><article className="max-w-3xl"><div className="border-b border-[#d8e1dd] pb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#08705f]">{eyebrow}</p><h1 className="mt-4 text-3xl font-bold leading-tight text-[#172629] sm:text-4xl">{title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[#566267]">{introduction}</p><p className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#687670]"><ShieldCheck aria-hidden="true" size={15} />Laatst bijgewerkt: {legalLastUpdated}</p></div><LegalDataNotice /><div className="legal-content mt-10 space-y-10">{children}</div><LegalContactCard /></article></div></main>;
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="text-xl font-bold text-[#172629]">{title}</h2><div className="mt-3 space-y-4 text-sm leading-7 text-[#435054]">{children}</div></section>;
}
