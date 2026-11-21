import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { AboutAdvantages, AboutChapters, AboutLeaders, AboutServices, AboutTimeline } from "@/components/site/mobile/pages/custom/about/sections";
import "./page.css";

// /about in the theme of the home page: the same CMS page as the laptop route; the story, services, journey, reasons and leaders have their own cards.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("about");

export default function Page() {
  return renderMobilePage("about", {
    home: true,
    overrides: { aboutChapters: AboutChapters, services: AboutServices, timeline: AboutTimeline, advantages: AboutAdvantages, team: AboutLeaders },
  });
}
