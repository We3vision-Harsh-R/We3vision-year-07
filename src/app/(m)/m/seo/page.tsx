import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { SeoAdvantages, SeoFaq, SeoGuide, SeoHero, SeoIndustriesSection, SeoProcess, SeoServices, SeoStory, SeoTags } from "@/components/site/mobile/pages/custom/seo/sections";
import "./page.css";

// /seo for phones and tablets: written for Google first (one h1, an h2 per section, h3 items, every word in the HTML, FAQPage data) and shown as a search results page.
// Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("seo");

export default function Page() {
  return renderMobilePage("seo", {
    keepOpen: ["guide", "services", "process", "industries", "faq"],
    overrides: {
      pageHero: SeoHero,
      story: SeoStory,
      guide: SeoGuide,
      services: SeoServices,
      process: SeoProcess,
      tags: SeoTags,
      industries: SeoIndustriesSection,
      advantages: SeoAdvantages,
      faq: SeoFaq,
    },
  });
}
