import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { SwAdvantages, SwFaq, SwHero, SwIndustries, SwProcess, SwServices, SwStory, SwTags } from "@/components/site/mobile/pages/custom/software/sections";
import "./page.css";

// /software-development-services as an Xcode and Files screen: the same CMS page as the laptop route; an editor, folders, a project tree and a console.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("software");

export default function Page() {
  return renderMobilePage("software", {
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
