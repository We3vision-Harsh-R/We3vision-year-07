import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { AiAdvantages, AiAutomate, AiFaq, AiFlow, AiGuide, AiHero, AiIndustries, AiProcess, AiServices, AiStory, AiTags } from "@/components/site/mobile/pages/custom/ai/sections";
import "./page.css";

// /ai as an assistant-app screen: the same CMS page as the laptop route; every section is a conversation (chat bubbles, agent cards, a run log).
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("ai");

export default function Page() {
  return renderMobilePage("ai", {
    overrides: {
      pageHero: AiHero,
      flow: AiFlow,
      story: AiStory,
      guide: AiGuide,
      automate: AiAutomate,
      services: AiServices,
      process: AiProcess,
      tags: AiTags,
      industries: AiIndustries,
      advantages: AiAdvantages,
      faq: AiFaq,
    },
  });
}
