import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { StoreAbout, StoreHeader } from "@/components/site/mobile/pages/custom/products/store";
import type { MobileSectionProps } from "@/components/site/mobile/pages/types";
import "./page.css";

// /products/webugmate as an App Store product page (icon, name, GET-style "Visit" button, description, FAQ). Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("webugmate");

const Head = (p: MobileSectionProps<"pageHero">) => <StoreHeader {...p} look="row" hue={0} />;
const About = (p: MobileSectionProps<"story">) => <StoreAbout {...p} look="row" />;

export default function Page() {
  return renderMobilePage("webugmate", { overrides: { pageHero: Head, story: About } });
}
