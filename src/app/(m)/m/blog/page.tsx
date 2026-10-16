import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { BlogFeed, BlogMasthead } from "@/components/site/mobile/pages/custom/blog/sections";
import "./page.css";

// /blog as a News-like app screen: the same CMS page and articles as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("blog");

export default function Page() {
  return renderMobilePage("blog", { overrides: { pageHero: BlogMasthead, blogs: BlogFeed } });
}
