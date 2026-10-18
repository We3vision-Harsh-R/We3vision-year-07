import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { SeoAdvantages, SeoFaq, SeoHero, PlainIndustriesSection, SeoProcess, MetaServices, SeoStory, SeoTags } from "@/components/site/mobile/pages/custom/seo/sections";
import "../seo/page.css";

// /meta-marketing-services: same design and the same Google-first structure as /seo (one h1, an h2 per section, h3 items, every word in the HTML, FAQPage data). The toy builds an ad card.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("meta-marketing");

export default function Page() {
  return renderMobilePage("meta-marketing", {
    keepOpen: ["services", "process", "industries", "faq"],
    overrides: {
      pageHero: SeoHero,
      story: SeoStory,
      services: MetaServices,
      process: SeoProcess,
      tags: SeoTags,
      industries: PlainIndustriesSection,
      advantages: SeoAdvantages,
      faq: SeoFaq,
    },
  });
}
