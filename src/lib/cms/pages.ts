import { ABOUT_SECTIONS, ABOUT_SEO } from "./content/about";
import { AI_SECTIONS, AI_SEO } from "./content/ai";
import { BRAND_SECTIONS, BRAND_SEO } from "./content/brand";
import { BLOG_SECTIONS, BLOG_SEO, CONTACT_SECTIONS, CONTACT_SEO, CAREERS_SECTIONS, CAREERS_SEO, PORTFOLIO_SECTIONS, PORTFOLIO_SEO } from "./content/company";
import { HOME_SECTIONS, HOME_SEO } from "./content/home";
import { TEAM_SECTIONS, TEAM_SEO } from "./content/team";
import { HEADLESS_SECTIONS, HEADLESS_SEO, WORDPRESS_SECTIONS, WORDPRESS_SEO, SHOPIFY_SECTIONS, SHOPIFY_SEO, WOOCOMMERCE_SECTIONS, WOOCOMMERCE_SEO, SHOPIFYAPP_SECTIONS, SHOPIFYAPP_SEO, PLUGIN_SECTIONS, PLUGIN_SEO } from "./content/tech";
import {
  ANIMATION_SECTIONS,
  ANIMATION_SEO,
  CRM_SECTIONS,
  CRM_SEO,
  GRAPHICS_SECTIONS,
  GRAPHICS_SEO,
  METAVERSE_SECTIONS,
  METAVERSE_SEO,
  MOBILE_SECTIONS,
  MOBILE_SEO,
  MODELING_SECTIONS,
  MODELING_SEO,
  SEO_SECTIONS,
  SEO_SEO,
  UIUX_SECTIONS,
  UIUX_SEO,
  WEBDEV_SECTIONS,
  WEBDEV_SEO,
} from "./content/services";
import { SHOPIFYPLUGIN_SECTIONS, SHOPIFYPLUGIN_SEO, SOFTWARE_SECTIONS, SOFTWARE_SEO, BRANDDEV_SECTIONS, BRANDDEV_SEO, BRANDKIT_SECTIONS, BRANDKIT_SEO, BRANDVIDEO_SECTIONS, BRANDVIDEO_SEO, ZERO_SECTIONS, ZERO_SEO, META_SECTIONS, META_SEO, PHYSICAL_SECTIONS, PHYSICAL_SEO } from "./content/new-services";
import { PRODUCTS_SECTIONS, PRODUCTS_SEO, WEBUGMATE_SECTIONS, WEBUGMATE_SEO, WEJOBS_SECTIONS, WEJOBS_SEO, WETHINK_SECTIONS, WETHINK_SEO, WEPRESENT_SECTIONS, WEPRESENT_SEO } from "./content/products";
import { normalize } from "./fields";
import { SECTIONS, isSectionType } from "./sections";

import type { PageContent, PageSection } from "./page-types";
export { newSection } from "./page-types";
export type { PageContent, PageSection } from "./page-types";

// Every editable page of the website. The admin "Pages" list is built from this.
// `defaultContent` is what visitors see until the first publish (real content, taken from the old site).
// To add a page: add an entry here (content in ./content/<page>.ts), then create
// src/app/(site)/<path>/page.tsx that renders <PageSections />.
export const PAGES = {
  home: {
    title: "Home",
    path: "/",
    defaultSeo: HOME_SEO,
    defaultContent: { sections: HOME_SECTIONS } satisfies PageContent,
  },
  about: {
    title: "About Us",
    path: "/about",
    defaultSeo: ABOUT_SEO,
    defaultContent: { sections: ABOUT_SECTIONS } satisfies PageContent,
  },
  "portfolio": {
    title: "Portfolio",
    path: "/portfolio",
    defaultSeo: PORTFOLIO_SEO,
    defaultContent: { sections: PORTFOLIO_SECTIONS } satisfies PageContent,
  },
  "blog": {
    title: "Blog",
    path: "/blog",
    defaultSeo: BLOG_SEO,
    defaultContent: { sections: BLOG_SECTIONS } satisfies PageContent,
  },
  "contact": {
    title: "Contact Us",
    path: "/contact",
    defaultSeo: CONTACT_SEO,
    defaultContent: { sections: CONTACT_SECTIONS } satisfies PageContent,
  },
  "careers": {
    title: "Careers",
    path: "/careers",
    defaultSeo: CAREERS_SEO,
    defaultContent: { sections: CAREERS_SECTIONS } satisfies PageContent,
  },
  "headless-cms": {
    title: "Headless CMS Development",
    path: "/headless-CMS-devlopment-services",
    defaultSeo: HEADLESS_SEO,
    defaultContent: { sections: HEADLESS_SECTIONS } satisfies PageContent,
  },
  "custom-wordpress": {
    title: "Custom WordPress Development",
    path: "/custom-wordpress-devlopment-services",
    defaultSeo: WORDPRESS_SEO,
    defaultContent: { sections: WORDPRESS_SECTIONS } satisfies PageContent,
  },
  "shopify": {
    title: "Shopify Development",
    path: "/shopify-development-services",
    defaultSeo: SHOPIFY_SEO,
    defaultContent: { sections: SHOPIFY_SECTIONS } satisfies PageContent,
  },
  "custom-woocommerce": {
    title: "Custom WooCommerce Development",
    path: "/custom-woocommerce-devlopment",
    defaultSeo: WOOCOMMERCE_SEO,
    defaultContent: { sections: WOOCOMMERCE_SECTIONS } satisfies PageContent,
  },
  "shopify-app": {
    title: "Shopify App Development",
    path: "/shopify-app-development-services",
    defaultSeo: SHOPIFYAPP_SEO,
    defaultContent: { sections: SHOPIFYAPP_SECTIONS } satisfies PageContent,
  },
  "wordpress-plugin": {
    title: "WordPress Plugin Development",
    path: "/wordpress-plugin-development-company",
    defaultSeo: PLUGIN_SEO,
    defaultContent: { sections: PLUGIN_SECTIONS } satisfies PageContent,
  },
  "shopify-plugin": {
    title: "Shopify Plugin Development",
    path: "/shopify-plugin-development-services",
    defaultSeo: SHOPIFYPLUGIN_SEO,
    defaultContent: { sections: SHOPIFYPLUGIN_SECTIONS } satisfies PageContent,
  },
  "software": {
    title: "Custom Software Development",
    path: "/software-development-services",
    defaultSeo: SOFTWARE_SEO,
    defaultContent: { sections: SOFTWARE_SECTIONS } satisfies PageContent,
  },
  "brand-development": {
    title: "Brand Development",
    path: "/brand-development-services",
    defaultSeo: BRANDDEV_SEO,
    defaultContent: { sections: BRANDDEV_SECTIONS } satisfies PageContent,
  },
  "brand-kit": {
    title: "Brand Kit Design",
    path: "/brand-kit-design",
    defaultSeo: BRANDKIT_SEO,
    defaultContent: { sections: BRANDKIT_SECTIONS } satisfies PageContent,
  },
  "brand-video": {
    title: "Brand Video Production",
    path: "/brand-video-production",
    defaultSeo: BRANDVIDEO_SEO,
    defaultContent: { sections: BRANDVIDEO_SECTIONS } satisfies PageContent,
  },
  "zero-to-n": {
    title: "End-to-End Brand Development",
    path: "/zero-to-n-brand-development",
    defaultSeo: ZERO_SEO,
    defaultContent: { sections: ZERO_SECTIONS } satisfies PageContent,
  },
  "meta-marketing": {
    title: "Meta Marketing",
    path: "/meta-marketing-services",
    defaultSeo: META_SEO,
    defaultContent: { sections: META_SECTIONS } satisfies PageContent,
  },
  "physical-marketing": {
    title: "Physical Marketing",
    path: "/physical-marketing-services",
    defaultSeo: PHYSICAL_SEO,
    defaultContent: { sections: PHYSICAL_SECTIONS } satisfies PageContent,
  },
  "products": {
    title: "Our Products",
    path: "/products",
    defaultSeo: PRODUCTS_SEO,
    defaultContent: { sections: PRODUCTS_SECTIONS } satisfies PageContent,
  },
  "webugmate": {
    title: "WeBugMate",
    path: "/products/webugmate",
    defaultSeo: WEBUGMATE_SEO,
    defaultContent: { sections: WEBUGMATE_SECTIONS } satisfies PageContent,
  },
  "wejobs": {
    title: "WeJobs",
    path: "/products/wejobs",
    defaultSeo: WEJOBS_SEO,
    defaultContent: { sections: WEJOBS_SECTIONS } satisfies PageContent,
  },
  "wethink": {
    title: "WeThink",
    path: "/products/wethink",
    defaultSeo: WETHINK_SEO,
    defaultContent: { sections: WETHINK_SECTIONS } satisfies PageContent,
  },
  "wepresent": {
    title: "WePresent",
    path: "/products/wepresent",
    defaultSeo: WEPRESENT_SEO,
    defaultContent: { sections: WEPRESENT_SECTIONS } satisfies PageContent,
  },
  team: {
    title: "Our Team",
    path: "/team",
    defaultSeo: TEAM_SEO,
    defaultContent: { sections: TEAM_SECTIONS } satisfies PageContent,
  },
  ai: {
    title: "AI Development",
    path: "/ai",
    defaultSeo: AI_SEO,
    defaultContent: { sections: AI_SECTIONS } satisfies PageContent,
  },
  // The other main services (content from the old site, see content/services.ts)
  "webdev": {
    title: "Web Development",
    path: "/webdev",
    defaultSeo: WEBDEV_SEO,
    defaultContent: { sections: WEBDEV_SECTIONS } satisfies PageContent,
  },
  "mobile": {
    title: "Mobile App Development",
    path: "/mobile",
    defaultSeo: MOBILE_SEO,
    defaultContent: { sections: MOBILE_SECTIONS } satisfies PageContent,
  },
  "metaverse": {
    title: "Metaverse Solutions",
    path: "/metaverse",
    defaultSeo: METAVERSE_SEO,
    defaultContent: { sections: METAVERSE_SECTIONS } satisfies PageContent,
  },
  "ui-ux-design": {
    title: "UI/UX Design",
    path: "/ui-ux-design",
    defaultSeo: UIUX_SEO,
    defaultContent: { sections: UIUX_SECTIONS } satisfies PageContent,
  },
  "crm": {
    title: "CRM Development",
    path: "/crm",
    defaultSeo: CRM_SEO,
    defaultContent: { sections: CRM_SECTIONS } satisfies PageContent,
  },
  "animation": {
    title: "2D/3D Animation",
    path: "/animation",
    defaultSeo: ANIMATION_SEO,
    defaultContent: { sections: ANIMATION_SECTIONS } satisfies PageContent,
  },
  "3d-modeling": {
    title: "3D Modeling",
    path: "/3d-modeling",
    defaultSeo: MODELING_SEO,
    defaultContent: { sections: MODELING_SECTIONS } satisfies PageContent,
  },
  "graphics": {
    title: "Graphics & UI/UX Design",
    path: "/graphics",
    defaultSeo: GRAPHICS_SEO,
    defaultContent: { sections: GRAPHICS_SECTIONS } satisfies PageContent,
  },
  "seo": {
    title: "SEO Optimization",
    path: "/seo",
    defaultSeo: SEO_SEO,
    defaultContent: { sections: SEO_SECTIONS } satisfies PageContent,
  },
  // Brand Design: the main page and one page per sub-service (all under /brand-identity)
  "brand-identity": {
    title: "Brand Design",
    path: "/brand-identity",
    defaultSeo: BRAND_SEO,
    defaultContent: { sections: BRAND_SECTIONS } satisfies PageContent,
  },
} as const;

export type PageSlug = keyof typeof PAGES;
export const isPageSlug = (v: unknown): v is PageSlug => typeof v === "string" && Object.hasOwn(PAGES, v);

/** Sanitises untrusted/stored JSON into valid page content. Missing keys fall back to the section defaults. */
export function normalizeContent(input: unknown): PageContent {
  const raw = (input as { sections?: unknown } | null)?.sections;
  const seen = new Set<string>();
  const sections: PageSection[] = [];
  for (const item of (Array.isArray(raw) ? raw : []).slice(0, 40)) {
    const { id, type, data } = (item ?? {}) as { id?: unknown; type?: unknown; data?: unknown };
    if (!isSectionType(type)) continue;
    let sectionId = typeof id === "string" && id.length > 0 && id.length <= 64 ? id : crypto.randomUUID();
    if (seen.has(sectionId)) sectionId = crypto.randomUUID();
    seen.add(sectionId);
    const merged = { ...SECTIONS[type].defaults, ...(typeof data === "object" && data !== null ? data : {}) };
    sections.push({ id: sectionId, type, data: normalize(SECTIONS[type].fields, merged) });
  }
  return { sections };
}
