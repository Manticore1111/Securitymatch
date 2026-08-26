import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { legalDetails, legalDetailsAreComplete } from "@/lib/legal";

const legalLinks = [
  { href: "/voorwaarden", label: "Voorwaarden" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/klachten", label: "Klachten" },
  { href: "/annuleren", label: "Annuleren" },
  { href: "/verificatie", label: "Verificatie" },
  { href: "/veiligheid", label: "Veiligheid" },
  { href: "/toegankelijkheid", label: "Toegankelijkheid" },
];

export function LegalFooter() {
  return <footer className="border-t border-[#2c3c3f] bg-[#0f1c1e] px-5 py-10 text-slate-300 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl"><div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]"><div><Link href="/" className="text-xl font-bold text-white">Security<span className="text-[#f7baaa]">Match</span></Link><p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">De marketplace voor ondernemers en zelfstandige beveiligingsprofessionals in Nederland.</p><Link href="/melden" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#f7baaa] hover:text-white"><ShieldCheck aria-hidden="true" size={17} />Meld een probleem of inhoud</Link></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Platform</p><div className="mt-4 grid gap-2 text-sm"><Link href="/jobs" className="hover:text-white">Open opdrachten</Link><Link href="/register?role=CLIENT" className="hover:text-white">Voor ondernemers</Link><Link href="/register?role=SECURITY_PROFESSIONAL" className="hover:text-white">Voor ZZP-beveiligers</Link><Link href="/login" className="hover:text-white">Inloggen</Link></div></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Juridisch</p><div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">{legalLinks.map((link) => <Link key={link.href} href={link.href} className="hover:text-white">{link.label}</Link>)}</div></div></div><div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>{legalDetails.brandName} · {legalDetails.entityName}{legalDetailsAreComplete ? ` · KvK ${legalDetails.chamberOfCommerceNumber}` : " · Bedrijfsgegevens vóór lancering invullen"}</p><p className="flex items-center gap-2"><Mail aria-hidden="true" size={14} />{legalDetails.email}</p></div></div></footer>;
}
