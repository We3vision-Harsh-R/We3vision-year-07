// FESTIVAL THEMES (Admin > Fest): a festival can dress the whole laptop website or only some pages, on top of the normal theme (which stays
// exactly as it is when no festival is on). Shared by the admin panel, the boot script of the site layout and the decorations (no server imports).
// To add a festival later: add it to FESTIVALS, give it its decorations (components/site/fest) and its CSS under html[data-fest="<id>"].

export const FESTIVALS = [
  {
    id: "diwali",
    name: "Diwali",
    blurb: "Diyas, rangoli, string lights, paper lanterns, sparklers and fireworks in warm gold and saffron.",
  },
] as const;
export type FestId = (typeof FESTIVALS)[number]["id"];
export const FEST_IDS = FESTIVALS.map((f) => f.id) as FestId[];

/** the extra pieces a visitor sees (the street of the home page, the city and the footer diyas always come with the festival) */
export const FEST_EFFECTS = [
  { key: "sky", label: "Sky lanterns and fireworks", hint: "Paper lanterns rising slowly and fireworks, behind the content of every page" },
  { key: "lanterns", label: "Hanging lanterns", hint: "Two akash kandils swaying at the top corners of the page" },
  { key: "cursor", label: "Sparkler cursor", hint: "Small sparks follow the mouse" },
] as const;
export type FestEffect = (typeof FEST_EFFECTS)[number]["key"];

export type FestRule = {
  /** on for every page of the website */
  site: boolean;
  /** on for these pages only: an exact path ("/about") or a group ("/blog/*") */
  pages: string[];
  effects: Record<FestEffect, boolean>;
};
export type FestConfig = Record<FestId, FestRule>;

const ALL_EFFECTS = Object.fromEntries(FEST_EFFECTS.map((e) => [e.key, true])) as Record<FestEffect, boolean>;
export const DEFAULT_FEST: FestConfig = Object.fromEntries(FEST_IDS.map((id) => [id, { site: false, pages: [], effects: { ...ALL_EFFECTS } }])) as unknown as FestConfig;

const PATH = /^\/[a-zA-Z0-9\-_/]*(\/\*)?$/;

/** a stored value made safe (unknown festivals, bad paths and missing keys are dropped or filled in) */
export function cleanFest(v: unknown): FestConfig {
  const src = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const out = {} as FestConfig;
  for (const id of FEST_IDS) {
    const r = (src[id] && typeof src[id] === "object" ? src[id] : {}) as Partial<Record<keyof FestRule, unknown>>;
    const fx = (r.effects && typeof r.effects === "object" ? r.effects : {}) as Record<string, unknown>;
    out[id] = {
      site: r.site === true,
      pages: Array.isArray(r.pages) ? [...new Set(r.pages.filter((p): p is string => typeof p === "string" && p.length <= 120 && PATH.test(p)))].slice(0, 200) : [],
      effects: Object.fromEntries(FEST_EFFECTS.map((e) => [e.key, fx[e.key] !== false])) as Record<FestEffect, boolean>,
    };
  }
  return out;
}

const matches = (page: string, path: string) => (page.endsWith("/*") ? path.startsWith(page.slice(0, -1)) : path === page || path === `${page}/`);

/** the festival of a page (the first one that is on for it), or null = the normal theme */
export function festFor(cfg: FestConfig, path: string): { id: FestId; effects: Record<FestEffect, boolean> } | null {
  for (const id of FEST_IDS) {
    const r = cfg[id];
    if (r && (r.site || r.pages.some((p) => matches(p, path)))) return { id, effects: r.effects };
  }
  return null;
}

/** the script that puts the festival on <html> before the first paint (no flash of the normal theme), the same rule as festFor */
export function festBootScript(cfg: FestConfig) {
  const data = JSON.stringify(cfg).replace(/</g, "\\u003c");
  return `(function(){try{var c=${data},p=location.pathname,h=document.documentElement;for(var id in c){var r=c[id],on=r.site;for(var i=0;!on&&i<r.pages.length;i++){var g=r.pages[i];on=g.slice(-2)==="/*"?p.indexOf(g.slice(0,-1))===0:(p===g||p===g+"/");}if(on){h.setAttribute("data-fest",id);var f=[];for(var k in r.effects){if(r.effects[k])f.push(k);}h.setAttribute("data-fest-fx",f.join(" "));return;}}}catch(e){}})();`;
}

/** any festival on at all (the site layout skips everything when none is) */
export const anyFest = (cfg: FestConfig) => FEST_IDS.some((id) => cfg[id].site || cfg[id].pages.length > 0);
