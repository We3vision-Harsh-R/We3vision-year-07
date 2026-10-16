import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { PortfolioGrid, PortfolioHead } from "@/components/site/mobile/pages/custom/portfolio/sections";
import "./page.css";

// /portfolio as a Photos-like app screen: the same CMS page and projects as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("portfolio");

export default function Page() {
  return renderMobilePage("portfolio", { overrides: { pageHero: PortfolioHead, projects: PortfolioGrid } });
}
