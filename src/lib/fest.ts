// FESTIVAL THEMES (Admin > Fest): a festival can dress the whole laptop website or only some pages, on top of the normal theme (which stays
// exactly as it is when no festival is on). Shared by the admin panel, the boot script of the site layout and the decorations (no server imports).
// To add a festival later: add it to FESTIVALS, give it its decorations (components/site/fest) and its CSS under html[data-fest="<id>"].
//
// The effects are single switches, in four groups:
//   site      pieces drawn on a layer ABOVE the whole page (lanterns, fireworks, embers, petals, kandils, toran lights, diyas, rangoli, glow, anar)
//   industry  the decoration of the road of the Industries section (lights, lamps, toran gates, rangoli, people with crackers, rockets ...)
//   pointer   what the mouse does (sparkler trail, a rocket on a click, a diya, petals, a rangoli bloom, a chakri)
//   places    the mega menu, the ground next to the company name, the office of the About page and the office of the Team page
// The saved value is cleaned here; a saved value from before this list existed (sky / lanterns / cursor) is carried over.

export const FESTIVALS = [
  {
    id: "diwali",
    name: "Diwali",
    blurb: "Diyas, rangoli, string lights, paper lanterns, sparklers, rockets and fireworks in warm gold and saffron.",
  },
] as const;
export type FestId = (typeof FESTIVALS)[number]["id"];
export const FEST_IDS = FESTIVALS.map((f) => f.id) as FestId[];

export const FEST_GROUPS = [
  { id: "site", title: "Whole-website effects", blurb: "Drawn on a layer above every page. The far pieces are small and softly blurred, the near ones big and sharp, like a real 3D space." },
  { id: "industry", title: "Industries road", blurb: "The decoration of the road in the Industries section (the road with the districts and the car)." },
  { id: "pointer", title: "Pointer effects", blurb: "What the mouse does. A click on an empty part of a page (no text, no button) can launch a rocket." },
  { id: "places", title: "Places", blurb: "The big menu, the ground next to the company name, and the two offices." },
] as const;
export type FestGroupId = (typeof FEST_GROUPS)[number]["id"];

type Fx = { key: string; group: FestGroupId; label: string; hint: string; on: boolean };
const fx = <const T extends Fx>(e: T) => e;

export const FEST_EFFECTS = [
  // ---- the whole website (10) ----
  fx({ key: "skylanterns", group: "site", label: "Sky lanterns", hint: "Paper lanterns rise slowly, at three distances (the far ones are small and blurred)", on: true }),
  fx({ key: "fireworks", group: "site", label: "Fireworks", hint: "Bursts of every kind in the sky: peony, willow, ring, with trails and a soft crackle of light", on: true }),
  fx({ key: "embers", group: "site", label: "Golden embers", hint: "Warm sparks drift up from the bottom, like from a fire of diyas", on: false }),
  fx({ key: "petals", group: "site", label: "Marigold petals", hint: "Orange and pink petals tumble down the page", on: false }),
  fx({ key: "kandils", group: "site", label: "Akash kandils", hint: "Star-shaped lanterns swing from the top, near ones big, far ones small and soft", on: true }),
  fx({ key: "toran", group: "site", label: "Toran and fairy lights", hint: "A garland of marigolds and twinkling bulbs along the top edge", on: true }),
  fx({ key: "diyaline", group: "site", label: "Diya line", hint: "A row of flickering diyas along the bottom edge of the window", on: true }),
  fx({ key: "rangoli", group: "site", label: "Rangoli corners", hint: "Slowly turning rangoli patterns in two corners", on: false }),
  fx({ key: "glow", group: "site", label: "Golden glow and light rays", hint: "A warm light from the corners with soft rays that breathe", on: true }),
  fx({ key: "anar", group: "site", label: "Anar fountains", hint: "Fountains of sparks rise from the bottom corners now and then", on: false }),
  // ---- the road of the Industries section (10) ----
  fx({ key: "ind-lights", group: "industry", label: "Road string lights", hint: "Strings of bulbs along both sides of the road, chasing one after the other", on: true }),
  fx({ key: "ind-lamps", group: "industry", label: "Diya lamp posts", hint: "Every lamp post gets a flame and a warm pool of light on the road", on: true }),
  fx({ key: "ind-toran", group: "industry", label: "Toran gates", hint: "Marigold gates with bunting across the road", on: true }),
  fx({ key: "ind-rangoli", group: "industry", label: "Rangoli on the road", hint: "Rangoli patterns painted on the road, glowing softly", on: true }),
  fx({ key: "ind-sparklers", group: "industry", label: "People with sparklers", hint: "A boy and a couple wave sparklers beside the road", on: true }),
  fx({ key: "ind-anar", group: "industry", label: "Anar and chakri crowd", hint: "A child and a woman with diyas around an anar fountain and a spinning chakri", on: true }),
  fx({ key: "ind-rockets", group: "industry", label: "Rockets over the city", hint: "Rockets climb above the districts and burst", on: true }),
  fx({ key: "ind-roofs", group: "industry", label: "Roof diyas and warm windows", hint: "Small diyas on the roofs and windows that glow and flicker", on: true }),
  fx({ key: "ind-car", group: "industry", label: "Festive car", hint: "The car wears fairy lights and a toran and leaves sparks behind", on: true }),
  fx({ key: "ind-lanterns", group: "industry", label: "Lanterns above the city", hint: "Sky lanterns drift up between the districts", on: true }),
  // ---- the pointer (6) ----
  fx({ key: "sparkler", group: "pointer", label: "Sparkler trail", hint: "Small sparks follow the mouse", on: true }),
  fx({ key: "rocket", group: "pointer", label: "Rocket on click", hint: "A click on an empty part (no text, no button) launches a rocket that bursts higher up on the screen", on: true }),
  fx({ key: "diya", group: "pointer", label: "Diya flame", hint: "A small flame with a warm glow follows the mouse a little behind", on: false }),
  fx({ key: "petaltrail", group: "pointer", label: "Petal trail", hint: "Marigold petals fall from the mouse as it moves", on: false }),
  fx({ key: "bloom", group: "pointer", label: "Rangoli bloom", hint: "A click draws a small rangoli that opens and fades", on: false }),
  fx({ key: "chakri", group: "pointer", label: "Chakri spinner", hint: "A spinning fire wheel follows the mouse and throws sparks", on: false }),
  // ---- places (4) ----
  fx({ key: "menu", group: "places", label: "Big menu theme", hint: "The pop-up menu wears a toran, hanging lamps and a rangoli, with sparks on its links", on: true }),
  fx({ key: "brand", group: "places", label: "Ground next to the company name", hint: "A small festive ground beside the logo where people enjoy crackers", on: true }),
  fx({ key: "about", group: "places", label: "About page office", hint: "String lights, diyas, a rangoli and fireworks at the office of the About page", on: true }),
  fx({ key: "team", group: "places", label: "Team page office", hint: "Lights, lanterns, a rangoli and fireworks in the office of the Team page", on: true }),
] as const;
export type FestEffect = (typeof FEST_EFFECTS)[number]["key"];
export const FEST_EFFECT_KEYS = FEST_EFFECTS.map((e) => e.key) as FestEffect[];

export const DENSITIES = [
  { id: "low", label: "Light", hint: "Fewer pieces: good for slow computers" },
  { id: "normal", label: "Normal", hint: "The usual amount" },
  { id: "rich", label: "Rich", hint: "More of everything" },
] as const;
export type FestDensity = (typeof DENSITIES)[number]["id"];

export type FestRule = {
  /** on for every page of the website */
  site: boolean;
  /** on for these pages only: an exact path ("/about") or a group ("/blog/*") */
  pages: string[];
  effects: Record<FestEffect, boolean>;
  density: FestDensity;
};
export type FestConfig = Record<FestId, FestRule>;

const DEFAULT_EFFECTS = Object.fromEntries(FEST_EFFECTS.map((e) => [e.key, e.on])) as Record<FestEffect, boolean>;
export const DEFAULT_FEST: FestConfig = Object.fromEntries(FEST_IDS.map((id) => [id, { site: false, pages: [], effects: { ...DEFAULT_EFFECTS }, density: "normal" }])) as unknown as FestConfig;

/** the config with every effect on (a test switch of the development server: add ?festtest to an address) */
export const FEST_TEST: FestConfig = Object.fromEntries(
  FEST_IDS.map((id) => [id, { site: true, pages: [], effects: Object.fromEntries(FEST_EFFECT_KEYS.map((k) => [k, true])), density: "normal" }]),
) as unknown as FestConfig;

const PATH = /^\/[a-zA-Z0-9\-_/]*(\/\*)?$/;

/** a stored value made safe (unknown festivals, bad paths and missing keys are dropped or filled in; the three effects of the first version are carried over) */
export function cleanFest(v: unknown): FestConfig {
  const src = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const out = {} as FestConfig;
  for (const id of FEST_IDS) {
    const r = (src[id] && typeof src[id] === "object" ? src[id] : {}) as Partial<Record<keyof FestRule, unknown>>;
    const stored = (r.effects && typeof r.effects === "object" ? r.effects : {}) as Record<string, unknown>;
    // first version: sky (lanterns + fireworks), lanterns (the two kandils), cursor (the sparkler)
    const legacy: Partial<Record<FestEffect, unknown>> = { skylanterns: stored.sky, fireworks: stored.sky, kandils: stored.lanterns, sparkler: stored.cursor };
    const effects = {} as Record<FestEffect, boolean>;
    for (const e of FEST_EFFECTS) {
      const own = stored[e.key];
      const old = legacy[e.key];
      effects[e.key] = typeof own === "boolean" ? own : typeof old === "boolean" ? old : e.on;
    }
    out[id] = {
      site: r.site === true,
      pages: Array.isArray(r.pages) ? [...new Set(r.pages.filter((p): p is string => typeof p === "string" && p.length <= 120 && PATH.test(p)))].slice(0, 200) : [],
      effects,
      density: DENSITIES.some((d) => d.id === r.density) ? (r.density as FestDensity) : "normal",
    };
  }
  return out;
}

const matches = (page: string, path: string) => (page.endsWith("/*") ? path.startsWith(page.slice(0, -1)) : path === page || path === `${page}/`);

/** the festival of a page (the first one that is on for it), or null = the normal theme */
export function festFor(cfg: FestConfig, path: string): { id: FestId; effects: Record<FestEffect, boolean>; density: FestDensity } | null {
  for (const id of FEST_IDS) {
    const r = cfg[id];
    if (r && (r.site || r.pages.some((p) => matches(p, path)))) return { id, effects: r.effects, density: r.density };
  }
  return null;
}

/** the script that puts the festival on <html> before the first paint (no flash of the normal theme), the same rule as festFor */
export function festBootScript(cfg: FestConfig) {
  const data = JSON.stringify(cfg).replace(/</g, "\\u003c");
  return `(function(){try{var c=${data},p=location.pathname,h=document.documentElement;for(var id in c){var r=c[id],on=r.site;for(var i=0;!on&&i<r.pages.length;i++){var g=r.pages[i];on=g.slice(-2)==="/*"?p.indexOf(g.slice(0,-1))===0:(p===g||p===g+"/");}if(on){h.setAttribute("data-fest",id);var f=[];for(var k in r.effects){if(r.effects[k])f.push(k);}h.setAttribute("data-fest-fx",f.join(" "));h.setAttribute("data-fest-density",r.density||"normal");return;}}}catch(e){}})();`;
}

/** any festival on at all (the site layout skips everything when none is) */
export const anyFest = (cfg: FestConfig) => FEST_IDS.some((id) => cfg[id].site || cfg[id].pages.length > 0);
