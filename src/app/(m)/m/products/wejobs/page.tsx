import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { StoreAbout, StoreHeader } from "@/components/site/mobile/pages/custom/products/store";
import type { MobileSectionProps } from "@/components/site/mobile/pages/types";
import "./page.css";

// /products/wejobs as an App Store "coming soon" page: a centred icon with a glow, then the description. Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("wejobs");

const Head = (p: MobileSectionProps<"pageHero">) => <StoreHeader {...p} look="center" hue={70} />;
const About = (p: MobileSectionProps<"story">) => <StoreAbout {...p} look="center" />;

export default function Page() {
  return renderMobilePage("wejobs", { overrides: { pageHero: Head, story: About } });
}
