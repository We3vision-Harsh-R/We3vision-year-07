// Which languages each privacy page offers besides English. UK and Australia are English only. To add a language: write a file like de.ts,
// add it here for the countries that use it, and the language tag appears above the contents by itself.
import { AR } from "./ar";
import { DE } from "./de";
import { ES } from "./es";
import { FR } from "./fr";
import { HI } from "./hi";
import type { LangPack, Ui } from "./types";
import { ZH } from "./zh";

export const EN_UI: Ui = {
  legal: "Legal",
  meta: "We3vision Private Limited · Version {v} · Last updated {d}",
  placeholder: "Search this policy: data, cookies, GDPR, breach, delete…",
  clear: "Clear",
  count: "{t} sections",
  match: "{n} of {t} sections match “{q}”",
  none: "Nothing found for “{q}”. Try another word.",
  contents: "Contents",
  laws: "Laws this page follows",
  end: "This policy explains how we work. It is not legal advice. For a project with special legal needs, we sign the contract and data processing agreement that your lawyer asks for.",
  tagsAria: "Privacy policy by country",
  langAria: "Language",
  searchAria: "Search this privacy policy",
  binding: "",
};

export const LANGS_BY_REGION: Record<string, LangPack[]> = {
  general: [HI],
  usa: [ES],
  germany: [DE],
  eu: [FR],
  canada: [FR],
  uae: [AR],
  singapore: [ZH],
};
