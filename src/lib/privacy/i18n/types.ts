// Translations of the privacy policy. English (regions.ts + common.ts) is the original and the binding text; a translation only helps people read it.
// A language file has: the words of the page (ui), the 14 shared sections (common, keyed by section id) and, for the countries that use the language,
// the heading, intro, laws and own sections of that country (regions, keyed by the region slug, then by section id). A missing item falls back to English.
import type { Section } from "../regions";

export type Body = Omit<Section, "id">;
export type Ui = {
  legal: string;
  meta: string; // {v} version, {d} date
  placeholder: string;
  clear: string;
  count: string; // {t} total
  match: string; // {n} {t} {q}
  none: string; // {q}
  contents: string;
  laws: string;
  end: string;
  tagsAria: string;
  langAria: string;
  searchAria: string;
  binding: string; // note shown under a translation
};
export type RegionTr = { title: string; intro: string; laws: string[]; sections: Record<string, Body> };
export type LangPack = {
  code: string; // the tag code: "de"
  label: string; // the name of the language in itself: "Deutsch"
  dir?: "rtl";
  ui: Ui;
  common: Record<string, Body>;
  regions: Record<string, RegionTr>;
};
