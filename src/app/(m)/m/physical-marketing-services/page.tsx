import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { SeoAdvantages, SeoFaq, SeoHero, PlainIndustriesSection, SeoProcess, PhysicalServices, SeoStory, SeoTags } from "@/components/site/mobile/pages/custom/seo/sections";
import "../seo/page.css";

// /physical-marketing-services: same design and the same Google-first structure as /seo (one h1, an h2 per section, h3 items, every word in the HTML, FAQPage data). The toy builds a shop front.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("physical-marketing");

export default function Page() {
  return renderMobilePage("physical-marketing", {
    keepOpen: ["services", "process", "industries", "faq"],
    overrides: {
      pageHero: SeoHero,
      story: SeoStory,
      services: PhysicalServices,
      process: SeoProcess,
      tags: SeoTags,
      industries: PlainIndustriesSection,
      advantages: SeoAdvantages,
      faq: SeoFaq,
    },
  });
}
