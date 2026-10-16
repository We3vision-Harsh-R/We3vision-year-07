import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { StoreAbout, StoreHeader } from "@/components/site/mobile/pages/custom/products/store";
import type { MobileSectionProps } from "@/components/site/mobile/pages/types";
import "./page.css";

// /products/wethink as an App Store "coming soon" page with a Notes feel: a tilted icon and the description on lined paper. Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("wethink");

const Head = (p: MobileSectionProps<"pageHero">) => <StoreHeader {...p} look="note" hue={150} />;
const About = (p: MobileSectionProps<"story">) => <StoreAbout {...p} look="note" />;

export default function Page() {
  return renderMobilePage("wethink", { overrides: { pageHero: Head, story: About } });
}
