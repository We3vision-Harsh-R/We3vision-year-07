import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { VrAdvantages, VrDevices, VrFaq, VrFloor, VrHero, VrIndustries, VrProcess, VrQuiz, VrServices } from "@/components/site/mobile/pages/custom/metaverse/sections";
import "./page.css";

// /metaverse as a visionOS-style screen (no 3D): the same CMS page as the laptop route; glass windows, a cabin picker, a device filter and the quiz.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("metaverse");

export default function Page() {
  return renderMobilePage("metaverse", {
    overrides: {
      vrEntry: VrHero,
      vrFloor: VrFloor,
      services: VrServices,
      vrProcess: VrProcess,
      vrDevices: VrDevices,
      industries: VrIndustries,
      advantages: VrAdvantages,
      faq: VrFaq,
      vrQuiz: VrQuiz,
    },
  });
}
