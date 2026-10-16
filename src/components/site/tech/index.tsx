import type { ComponentType } from "react";
import type { PageSection } from "@/lib/cms/pages";
import type { SiteSettings } from "@/lib/cms/settings";
import { Contact } from "../sections/contact";
import { techData, type TechData } from "./data";
import { BrandDevPage } from "../lazy";
import { E2EPage } from "../lazy";
import { SeoAeoPage } from "../lazy";
import { MetaPage } from "../lazy";
import { PhysicalPage } from "../lazy";
import { GraphicsPage } from "../lazy";
import { HeadlessPage } from "../lazy";
import { TechScrollAreas } from "./scroll-areas";
import { PluginPage } from "../lazy";
import { ShopappPage } from "../lazy";
import { ShopifyPage } from "../lazy";
import { WoocommercePage } from "../lazy";
import { WordpressPage } from "../lazy";

// The six technology pages. Each one has its own design and its own interactive showpiece; they share only the text (data.ts) and the contact form.
const PAGES: Record<string, ComponentType<{ d: TechData }>> = {
  "headless-cms": HeadlessPage,
  graphics: GraphicsPage,
  "brand-development": BrandDevPage,
  "zero-to-n": E2EPage,
  seo: SeoAeoPage,
  "meta-marketing": MetaPage,
  "physical-marketing": PhysicalPage,
  "custom-wordpress": WordpressPage,
  shopify: ShopifyPage,
  "wordpress-plugin": PluginPage,
  "shopify-app": ShopappPage,
  "custom-woocommerce": WoocommercePage,
};

export const isTechPage = (slug: string) => slug in PAGES;

export function TechPage({ slug, sections, site }: { slug: string; sections: PageSection[]; site: SiteSettings }) {
  const Page = PAGES[slug];
  const contact = sections.find((s) => s.type === "contact");
  return (
    <>
      <Page d={techData(sections)} />
      <TechScrollAreas />
      {contact && <Contact data={contact.data as never} site={site} sectionId="contact" skin="classic" page={slug} />}
    </>
  );
}
