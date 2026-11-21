import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { StoreAbout, StoreFaq, StoreHeader } from "@/components/site/mobile/pages/custom/products/store";
import type { MobileSectionProps } from "@/components/site/mobile/pages/types";

// /products/webugmate in the theme of the home page (product header, description, FAQ). Same CMS page as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("webugmate");

const Head = (p: MobileSectionProps<"pageHero">) => <StoreHeader {...p} hue={0} />;
const About = (p: MobileSectionProps<"story">) => <StoreAbout {...p} />;

export default function Page() {
  return renderMobilePage("webugmate", { home: true, overrides: { pageHero: Head, story: About, faq: StoreFaq } });
}
