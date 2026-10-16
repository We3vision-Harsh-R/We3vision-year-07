// The repeated sections of the service pages (process, FAQ, why we3vision, more from we3vision, tools, what we build, the story) must not look
// the same on two pages. Every one of them has eight designs (the variants, see modern/*-variants.tsx) and this table says which page gets which:
// the pages are in the order of PAGES_ORDER, the numbers are the variants (0 = the design that was there before). The pages that are not in the
// table keep the design they have. The look is in globals.css (.vp-*, .vf-*, .vw-*, .vl-*, .vt-*, .vz-*, .vy-*).

export const PAGES_ORDER = ["webdev", "mobile", "crm", "animation", "ui-ux-design", "graphics", "seo", "brand-identity"] as const;

export type VariantType = "process" | "faq" | "why" | "related" | "tools" | "services" | "story";

const TABLE: Record<VariantType, number[]> = {
  process: [0, 1, 2, 3, 4, 5, 6, 7],
  faq: [2, 0, 1, 3, 4, 5, 6, 0],
  why: [1, 0, 2, 3, 4, 5, 6, 7],
  related: [1, 0, 2, 3, 4, 5, 6, 0],
  tools: [1, 2, 0, 3, 4, 5, 6, 7],
  services: [0, 2, 3, 4, 1, 5, 6, 7],
  story: [0, 1, 4, 5, 2, 3, 6, 0],
};

/** which design the page gets for that section (null: the page is not in the table) */
export function variantOf(page: string | undefined, type: VariantType): number | null {
  const i = PAGES_ORDER.indexOf((page ?? "") as (typeof PAGES_ORDER)[number]);
  return i < 0 ? null : TABLE[type][i];
}
