import { redirect } from "next/navigation";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { auth } from "../../../auth";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { ReportForm } from "./report-form";

export default async function ReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <LegalPage eyebrow="Meldpunt" title="Meld onveilige, onjuiste of onrechtmatige inhoud." introduction="Gebruik dit formulier om SecurityMatch te informeren over een profiel, opdracht, bericht, review, documentprobleem of gedrag dat volgens jou beoordeling nodig heeft."><section className="border border-[#f3c8ba] bg-[#fff4ef] p-5"><div className="flex gap-3"><AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-[#bd513c]" size={21} /><div><p className="font-bold text-[#7d3022]">Geen noodnummer</p><p className="mt-1 text-sm leading-6 text-[#7d3022]">Bij direct gevaar, geweld of een medische noodsituatie bel je 112. SecurityMatch beoordeelt online meldingen, maar biedt geen directe hulpverlening.</p></div></div></section><LegalSection title="Wat gebeurt er met je melding?"><p>Je melding wordt vastgelegd en zichtbaar gemaakt voor bevoegde beheerders. Zij beoordelen de inhoud en kunnen aanvullende informatie vragen, inhoud beperken of verwijderen, een account onderzoeken of de melding afsluiten. Waar passend wordt een betrokken gebruiker over een beperkend besluit geïnformeerd.</p><p>Zie ook het <a className="font-bold text-[#08705f] underline" href="/veiligheid">veiligheids- en moderatiebeleid</a> en de <a className="font-bold text-[#08705f] underline" href="/klachten">klachtenprocedure</a>.</p></LegalSection><ReportForm /><div className="mt-8 flex items-center gap-3 border-t border-[#dce4e1] pt-6 text-sm text-[#59666a]"><ShieldCheck aria-hidden="true" className="text-[#08705f]" size={19} />Meldingen worden geregistreerd voor beoordeling en auditdoeleinden.</div></LegalPage>;
}
