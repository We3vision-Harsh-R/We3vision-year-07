import { ABOUT_SECTIONS, ABOUT_SEO } from "./content/about";
import { AI_SECTIONS, AI_SEO } from "./content/ai";
import {
  BRAND_SECTIONS,
  BRAND_SEO,
  BRAND_STRATEGY_SECTIONS,
  BRAND_STRATEGY_SEO,
  LOGO_DESIGN_SECTIONS,
  LOGO_DESIGN_SEO,
  MARKETING_COLLATERAL_SECTIONS,
  MARKETING_COLLATERAL_SEO,
  VISUAL_IDENTITY_SECTIONS,
  VISUAL_IDENTITY_SEO,
} from "./content/brand";
import { HOME_SECTIONS, HOME_SEO } from "./content/home";
import { emptyValue, normalize } from "./fields";
import { SECTIONS, isSectionType, type SectionType } from "./sections";

export type PageSection = { id: string; type: SectionType; data: Record<string, unknown> };
export type PageContent = { sections: PageSection[] };

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
  ai: {
    title: "AI Development",
    path: "/ai",
    defaultSeo: AI_SEO,
    defaultContent: { sections: AI_SECTIONS } satisfies PageContent,
  },
  // Brand Design: the main page and one page per sub-service (all under /brand-identity)
  "brand-identity": {
    title: "Brand Design",
    path: "/brand-identity",
    defaultSeo: BRAND_SEO,
    defaultContent: { sections: BRAND_SECTIONS } satisfies PageContent,
  },
  "brand-strategy": {
    title: "Brand Design: Brand Strategy",
    path: "/brand-identity/brand-strategy",
    defaultSeo: BRAND_STRATEGY_SEO,
    defaultContent: { sections: BRAND_STRATEGY_SECTIONS } satisfies PageContent,
  },
  "logo-design": {
    title: "Brand Design: Logo Design",
    path: "/brand-identity/logo-design",
    defaultSeo: LOGO_DESIGN_SEO,
    defaultContent: { sections: LOGO_DESIGN_SECTIONS } satisfies PageContent,
  },
  "visual-identity": {
    title: "Brand Design: Visual Identity & Guidelines",
    path: "/brand-identity/visual-identity-guidelines",
    defaultSeo: VISUAL_IDENTITY_SEO,
    defaultContent: { sections: VISUAL_IDENTITY_SECTIONS } satisfies PageContent,
  },
  "marketing-collateral": {
    title: "Brand Design: Marketing Collateral",
    path: "/brand-identity/marketing-collateral",
    defaultSeo: MARKETING_COLLATERAL_SEO,
    defaultContent: { sections: MARKETING_COLLATERAL_SECTIONS } satisfies PageContent,
  },
} as const;

export type PageSlug = keyof typeof PAGES;
export const isPageSlug = (v: unknown): v is PageSlug => typeof v === "string" && Object.hasOwn(PAGES, v);

export function newSection(type: SectionType): PageSection {
  return { id: crypto.randomUUID(), type, data: emptyValue(SECTIONS[type].fields) };
}

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
