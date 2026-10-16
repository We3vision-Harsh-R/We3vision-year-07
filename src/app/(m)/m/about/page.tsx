import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { AboutAdvantages, AboutChapters, AboutLeaders, AboutServices, AboutTimeline } from "@/components/site/mobile/pages/custom/about/sections";
import "./page.css";

// /about as its own app screen: the same CMS page as the laptop route; the story, services, roadmap, facts and leaders have their own look.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("about");

export default function Page() {
  return renderMobilePage("about", {
    overrides: { aboutChapters: AboutChapters, services: AboutServices, timeline: AboutTimeline, advantages: AboutAdvantages, team: AboutLeaders },
  });
}
