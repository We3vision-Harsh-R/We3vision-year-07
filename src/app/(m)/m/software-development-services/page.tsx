import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { SwAdvantages, SwFaq, SwHero, SwIndustries, SwProcess, SwServices, SwStory, SwTags } from "@/components/site/mobile/pages/custom/software/sections";
import "./page.css";

// /software-development-services: a quiet, open page (a file name and a large title, a service picker, a process thread, an open FAQ). Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("software");

export default function Page() {
  return renderMobilePage("software", {
    keepOpen: ["services", "process", "industries"],
    overrides: {
      pageHero: SwHero,
      story: SwStory,
      services: SwServices,
      process: SwProcess,
      tags: SwTags,
      industries: SwIndustries,
      advantages: SwAdvantages,
      faq: SwFaq,
    },
  });
}
