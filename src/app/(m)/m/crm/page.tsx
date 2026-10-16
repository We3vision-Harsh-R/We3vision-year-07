import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { CrmAdvantages, CrmFaq, CrmHero, CrmIndustries, CrmProcess, CrmServices, CrmStory, CrmTags } from "@/components/site/mobile/pages/custom/crm/sections";
import "./page.css";

// /crm as a Reminders and Numbers screen: the same CMS page as the laptop route; lists with open and ticked circles, progress rings, #tags.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("crm");

export default function Page() {
  return renderMobilePage("crm", {
    overrides: {
      pageHero: CrmHero,
      story: CrmStory,
      services: CrmServices,
      process: CrmProcess,
      tags: CrmTags,
      industries: CrmIndustries,
      advantages: CrmAdvantages,
      faq: CrmFaq,
    },
  });
}
