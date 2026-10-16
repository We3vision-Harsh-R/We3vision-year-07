import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { TeamJourney, TeamManifesto, TeamOffice } from "@/components/site/mobile/pages/custom/team/sections";
import type { MobileSectionProps } from "@/components/site/mobile/pages/types";
import { getTeam } from "@/lib/team";
import "./page.css";

// /team as a Contacts-like app screen: the same CMS page as the laptop route; the office (Admin > Team) becomes an address book.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("team");

export default async function Page() {
  const people = await getTeam();
  const Office = (p: MobileSectionProps<"teamOffice">) => <TeamOffice {...p} people={people} />;
  return renderMobilePage("team", { overrides: { teamOffice: Office, teamManifesto: TeamManifesto, teamJourney: TeamJourney } });
}
