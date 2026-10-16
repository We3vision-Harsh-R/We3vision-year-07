import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { CareersDestination, CareersPass, CareersTeams, CareersValues } from "@/components/site/mobile/pages/custom/careers/sections";
import "./page.css";

// /careers as a Wallet-like app screen: the same CMS page and open jobs as the laptop route; boarding pass, platforms and a departures board.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("careers");

export default function Page() {
  return renderMobilePage("careers", {
    overrides: { careerJourney: CareersPass, careerValues: CareersValues, careerTeams: CareersTeams, careerDestination: CareersDestination },
  });
}
