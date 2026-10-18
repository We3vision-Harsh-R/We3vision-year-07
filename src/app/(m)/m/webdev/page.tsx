import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { WebAdvantages, WebContact, WebFaq, WebGuide, WebHero, WebIndustries, WebProcess, WebServices, WebStory, WebTags } from "@/components/site/mobile/pages/custom/webdev/sections";
import "./page.css";

// /webdev as a Safari-like app screen: the same CMS page as the laptop route; a browser window, Reader page, open tabs, Favourites and Top Hits.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("webdev");

export default function Page() {
  return renderMobilePage("webdev", {
    keepOpen: ["services", "process", "industries"], overrides: {
      pageHero: WebHero,
      story: WebStory,
      guide: WebGuide,
      services: WebServices,
      process: WebProcess,
      tags: WebTags,
      industries: WebIndustries,
      advantages: WebAdvantages,
      faq: WebFaq,
      contact: WebContact,
    },
  });
}
