import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { AnAdvantages, AnFaq, AnGuide, AnHero, AnIndustries, AnProcess, AnServices, AnStory, AnTags } from "@/components/site/mobile/pages/custom/animation/sections";
import "./page.css";

// /animation as a Clips and Apple TV screen: the same CMS page as the laptop route; a letterboxed poster, a bouncing-ball timeline, episodes and a film strip.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("animation");

export default function Page() {
  return renderMobilePage("animation", {
    overrides: {
      pageHero: AnHero,
      story: AnStory,
      guide: AnGuide,
      services: AnServices,
      process: AnProcess,
      tags: AnTags,
      industries: AnIndustries,
      advantages: AnAdvantages,
      faq: AnFaq,
    },
  });
}
