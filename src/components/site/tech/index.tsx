import type { ComponentType } from "react";
import type { PageSection } from "@/lib/cms/pages";
import type { SiteSettings } from "@/lib/cms/settings";
import { Contact } from "../sections/contact";
import { techData, type TechData } from "./data";
import { BrandDevPage } from "../brand/brand-dev";
import { E2EPage } from "../brand/end-to-end";
import { SeoAeoPage } from "../marketing/seo-aeo";
import { MetaPage } from "../marketing/meta";
import { PhysicalPage } from "../marketing/physical";
import { GraphicsPage } from "../graphics/graphics";
import { HeadlessPage } from "./headless";
import { TechScrollAreas } from "./scroll-areas";
import { PluginPage } from "./plugin";
import { ShopappPage } from "./shopapp";
import { ShopifyPage } from "./shopify";
import { WoocommercePage } from "./woocommerce";
import { WordpressPage } from "./wordpress";

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
