import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { CareersDestination, CareersHelpDesk, CareersPass, CareersTeams, CareersValues } from "@/components/site/mobile/pages/custom/careers/sections";
import "./page.css";

// /careers in iOS 27 style: the same CMS page and open jobs as the laptop route; open lists, a team filter for the jobs, a grouped help desk form.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("careers");

export default function Page() {
  return renderMobilePage("careers", {
    overrides: { careerJourney: CareersPass, careerValues: CareersValues, careerTeams: CareersTeams, careerDestination: CareersDestination, careerHelpDesk: CareersHelpDesk },
  });
}
