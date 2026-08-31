import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { LegalPage, LegalSection } from "@/components/legal-page";
import { PrivacyRequestForm } from "@/components/privacy-request-form";

export default async function PrivacyRequestPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/privacy-verzoek");

  return <LegalPage eyebrow="AVG-verzoek" title="Gebruik je privacyrechten." introduction="Dien als ingelogde gebruiker een verzoek in over je persoonsgegevens. We kunnen aanvullende informatie vragen om je identiteit te controleren.">
    <LegalSection title="Een verzoek indienen"><p>Kies hieronder het soort verzoek en geef voldoende context. We behandelen het verzoek binnen de wettelijke termijn en nemen contact op als verduidelijking nodig is.</p><PrivacyRequestForm /></LegalSection>
  </LegalPage>;
}
