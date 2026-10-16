import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { StoreAbout, StoreHeader } from "@/components/site/mobile/pages/custom/products/store";
import type { MobileSectionProps } from "@/components/site/mobile/pages/types";
import "./page.css";

// /products/wepresent as an App Store "coming soon" page with a Keynote feel: the name on a 16:9 slide, then the description. Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("wepresent");

const Head = (p: MobileSectionProps<"pageHero">) => <StoreHeader {...p} look="slide" hue={250} />;
const About = (p: MobileSectionProps<"story">) => <StoreAbout {...p} look="slide" />;

export default function Page() {
  return renderMobilePage("wepresent", { overrides: { pageHero: Head, story: About } });
}
