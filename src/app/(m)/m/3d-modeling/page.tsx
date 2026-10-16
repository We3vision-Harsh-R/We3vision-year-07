import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { ArAdvantages, ArFaq, ArHero, ArIndustries, ArProcess, ArServices, ArStory, ArTags } from "@/components/site/mobile/pages/custom/3d-modeling/sections";
import "./page.css";

// /3d-modeling as an AR Quick Look screen: the same CMS page as the laptop route; a camera view, model cards, a measuring tape and callouts.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("3d-modeling");

export default function Page() {
  return renderMobilePage("3d-modeling", {
    overrides: {
      pageHero: ArHero,
      story: ArStory,
      services: ArServices,
      process: ArProcess,
      tags: ArTags,
      industries: ArIndustries,
      advantages: ArAdvantages,
      faq: ArFaq,
    },
  });
}
