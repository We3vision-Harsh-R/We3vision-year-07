import type { ComponentType } from "react";
import type { PageSection } from "@/lib/cms/pages";
import type { SiteSettings } from "@/lib/cms/settings";
import { FaqJsonLd } from "../json-ld";
import { Contact } from "../sections/contact";
import { techData, type TechData } from "./data";
import { BrandDevPage } from "../lazy";
import { E2EPage } from "../lazy";
import { SeoAeoPage } from "../lazy";
import { SoftwarePage } from "../lazy";
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
  software: SoftwarePage,
  "meta-marketing": MetaPage,
  "physical-marketing": PhysicalPage,
  "custom-wordpress": WordpressPage,
  shopify: ShopifyPage,
  "wordpress-plugin": PluginPage,
  "shopify-app": ShopappPage,
  "custom-woocommerce": WoocommercePage,
};

export const isTechPage = (slug: string) => slug in PAGES;

// The pages whose own design shows the questions of `d.faq` (some behind a tab or a click): their FAQPage data is made here. The marketing pages
// (SEO, Meta, Physical) make theirs in marketing/kit.tsx from the list they show, and Graphics makes its own.
const FAQ_FROM_DATA = new Set(["headless-cms", "brand-development", "zero-to-n", "software", "custom-wordpress", "shopify", "wordpress-plugin", "shopify-app", "custom-woocommerce"]);

export function TechPage({ slug, sections, site }: { slug: string; sections: PageSection[]; site: SiteSettings }) {
  const Page = PAGES[slug];
  const contact = sections.find((s) => s.type === "contact");
  const d = techData(sections);
  return (
    <>
      {FAQ_FROM_DATA.has(slug) && <FaqJsonLd items={d.faq} />}
      <Page d={d} />
      <TechScrollAreas />
      {contact && <Contact data={contact.data as never} site={site} sectionId="contact" skin="classic" page={slug} />}
    </>
  );
}
