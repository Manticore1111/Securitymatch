import { MarketplaceHome } from "@/components/marketplace-home";
import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();
  return <MarketplaceHome isAuthenticated={Boolean(session?.user)} />;
}
