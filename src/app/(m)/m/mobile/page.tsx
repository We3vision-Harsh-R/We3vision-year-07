import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { AppAdvantages, AppFaq, AppHero, AppIndustries, AppProcess, AppServices, AppStory, AppTags } from "@/components/site/mobile/pages/custom/mobile/sections";
import "./page.css";

// /mobile as an App Store screen: the same CMS page as the laptop route; a product page, Today cards, version history, app icons and categories.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("mobile");

export default function Page() {
  return renderMobilePage("mobile", {
    overrides: {
      pageHero: AppHero,
      story: AppStory,
      services: AppServices,
      process: AppProcess,
      tags: AppTags,
      industries: AppIndustries,
      advantages: AppAdvantages,
      faq: AppFaq,
    },
  });
}
