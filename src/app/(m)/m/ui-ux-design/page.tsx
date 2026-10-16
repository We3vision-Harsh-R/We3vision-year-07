import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { UxAdvantages, UxFaq, UxGuide, UxHero, UxIndustries, UxProcess, UxServices, UxStory, UxTags } from "@/components/site/mobile/pages/custom/ui-ux-design/sections";
import "./page.css";

// /ui-ux-design as a Freeform board: the same CMS page as the laptop route; a dotted canvas, sticky notes, frames, a flow chart and comment pins.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("ui-ux-design");

export default function Page() {
  return renderMobilePage("ui-ux-design", {
    overrides: {
      pageHero: UxHero,
      story: UxStory,
      guide: UxGuide,
      services: UxServices,
      process: UxProcess,
      tags: UxTags,
      industries: UxIndustries,
      advantages: UxAdvantages,
      faq: UxFaq,
    },
  });
}
