import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { WebAdvantages, WebContact, WebFaq, WebGuide, WebHero, WebIndustries, WebProcess, WebServices, WebStory, WebTags } from "@/components/site/mobile/pages/custom/webdev/sections";
import "../webdev/page.css";

// /mobile (app development) is built like /webdev: the same screens, the same type scale, the same quiet design (see brain/11). The CMS words are the laptop's.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("mobile");

export default function Page() {
  return renderMobilePage("mobile", {
    keepOpen: ["services", "process", "industries"],
    overrides: {
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
