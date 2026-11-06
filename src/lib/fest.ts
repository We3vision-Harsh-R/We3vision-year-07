// FESTIVAL THEMES (Admin > Fest): a festival can dress the whole website (laptop and desktop with every effect, phone and tablet with a shorter list of their own) or only some pages, on top of the normal theme (which stays
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
  { id: "places", title: "Places", blurb: "The big menu, the ground next to the company name, and the three offices." },
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
  fx({ key: "menu-people", group: "places", label: "People with crackers in the big menu", hint: "In the empty spaces under the short lists of the big menu a boy, a girl and a couple burst sparklers and an anar and enjoy, on a small floor", on: true }),
  fx({ key: "footer", group: "places", label: "Family at home in the footer", hint: "A little home between the footer columns and the big name: a mandir with the family at the puja, the grandparents, children with crackers and a cat. It only takes the room there is: fewer people on narrower windows, none on a small one", on: true }),
  fx({ key: "brand", group: "places", label: "Ground next to the company name", hint: "A small festive ground beside the logo where people enjoy crackers", on: true }),
  fx({ key: "about", group: "places", label: "About page office", hint: "String lights, diyas, fireworks and rangolis on the floor that colleagues draw, at the office of the About page", on: true }),
  fx({ key: "team", group: "places", label: "Team page office", hint: "Lights, lanterns, fireworks and rangolis on the floor that colleagues draw, in the office of the Team page", on: true }),
  fx({ key: "homecele", group: "places", label: "Home celebration (Happy Dhanteras)", hint: "A glowing button on the hero of the home page. One click blurs the hero, locks the page and opens a full-window night screen with today's date, Happy Dhanteras and the same family as in the footer celebrating on a flat floor (Esc to exit). Nothing else of the website is drawn or loaded while it is open", on: false }),
  fx({ key: "metaverse", group: "places", label: "Metaverse page office", hint: "Lights, lanterns, rangolis and fireworks in the office of the Metaverse page", on: true }),
] as const;
export type FestEffect = (typeof FEST_EFFECTS)[number]["key"];
export const FEST_EFFECT_KEYS = FEST_EFFECTS.map((e) => e.key) as FestEffect[];

// PHONES AND TABLETS (under 1024px) HAVE THEIR OWN LIST (owner, 2026-11-01): one setting for phone + tablet, while the list above is for laptop + desktop.
// Only what a touch screen can show is in it: the layer above the page, and what a tap does. Each key is one of the keys above, so every piece of the
// site (which reads html[data-fest-fx]) works unchanged: on a phone that attribute simply holds the phone list.
type Mx = { key: Extract<FestEffect, "skylanterns" | "fireworks" | "embers" | "petals" | "kandils" | "toran" | "diyaline" | "rangoli" | "glow" | "anar" | "rocket" | "bloom">; label: string; hint: string; on: boolean };
const mx = <const T extends Mx>(e: T) => e;
export const MOBILE_EFFECTS = [
  mx({ key: "skylanterns", label: "Sky lanterns", hint: "Paper lanterns rise slowly", on: true }),
  mx({ key: "fireworks", label: "Fireworks", hint: "Bursts of fireworks in the sky", on: true }),
  mx({ key: "embers", label: "Golden embers", hint: "Warm sparks drift up from the bottom", on: false }),
  mx({ key: "petals", label: "Marigold petals", hint: "Petals tumble down the page", on: false }),
  mx({ key: "kandils", label: "Akash kandils", hint: "Star-shaped lanterns swing from the top", on: true }),
  mx({ key: "toran", label: "Toran and fairy lights", hint: "A garland of marigolds and twinkling bulbs along the top edge", on: true }),
  mx({ key: "diyaline", label: "Diya line", hint: "A row of flickering diyas along the bottom edge", on: false }),
  mx({ key: "rangoli", label: "Rangoli corners", hint: "Slowly turning rangoli patterns in two corners", on: false }),
  mx({ key: "glow", label: "Golden glow and light rays", hint: "A warm light from the corners", on: true }),
  mx({ key: "anar", label: "Anar fountains", hint: "Fountains of sparks rise from the bottom corners now and then", on: false }),
  mx({ key: "rocket", label: "Crackers on tap", hint: "A tap on an empty part (not on a link or button) launches rockets that burst", on: true }),
  mx({ key: "bloom", label: "Rangoli bloom on tap", hint: "A tap draws a small rangoli that opens and fades", on: false }),
] as const;
export type MobileEffect = (typeof MOBILE_EFFECTS)[number]["key"];
export const MOBILE_KEYS = MOBILE_EFFECTS.map((e) => e.key) as MobileEffect[];
/** the width under which the phone list is used (the same as the 1023.98px of the mobile CSS) */
export const MOBILE_QUERY = "(max-width: 1023.98px)";

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
  /** laptop + desktop (1024px and wider): every effect */
  effects: Record<FestEffect, boolean>;
  /** phone + tablet (under 1024px): the shorter list */
  mobile: Record<MobileEffect, boolean>;
  density: FestDensity;
};
export type FestConfig = Record<FestId, FestRule>;

const DEFAULT_EFFECTS = Object.fromEntries(FEST_EFFECTS.map((e) => [e.key, e.on])) as Record<FestEffect, boolean>;
const DEFAULT_MOBILE = Object.fromEntries(MOBILE_EFFECTS.map((e) => [e.key, e.on])) as Record<MobileEffect, boolean>;
export const DEFAULT_FEST: FestConfig = Object.fromEntries(FEST_IDS.map((id) => [id, { site: false, pages: [], effects: { ...DEFAULT_EFFECTS }, mobile: { ...DEFAULT_MOBILE }, density: "normal" }])) as unknown as FestConfig;

/** the config with every effect on (a test switch of the development server: add ?festtest to an address) */
export const FEST_TEST: FestConfig = Object.fromEntries(
  FEST_IDS.map((id) => [id, { site: true, pages: [], effects: Object.fromEntries(FEST_EFFECT_KEYS.map((k) => [k, true])), mobile: Object.fromEntries(MOBILE_KEYS.map((k) => [k, true])), density: "normal" }]),
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
    // a saved value from before the phone list existed: the phone starts from what the laptop had
    const storedM = (r.mobile && typeof r.mobile === "object" ? r.mobile : {}) as Record<string, unknown>;
    const mobile = {} as Record<MobileEffect, boolean>;
    for (const k of MOBILE_KEYS) mobile[k] = typeof storedM[k] === "boolean" ? (storedM[k] as boolean) : r.mobile ? DEFAULT_MOBILE[k] : effects[k];
    out[id] = {
      site: r.site === true,
      pages: Array.isArray(r.pages) ? [...new Set(r.pages.filter((p): p is string => typeof p === "string" && p.length <= 120 && PATH.test(p)))].slice(0, 200) : [],
      effects,
      mobile,
      density: DENSITIES.some((d) => d.id === r.density) ? (r.density as FestDensity) : "normal",
    };
  }
  return out;
}

const matches = (page: string, path: string) => (page.endsWith("/*") ? path.startsWith(page.slice(0, -1)) : path === page || path === `${page}/`);

/** the effects that count on this kind of screen: the whole list on a laptop, the phone list (everything else off) on a phone or tablet */
export function effectsFor(r: FestRule, mobile: boolean): Record<FestEffect, boolean> {
  if (!mobile) return r.effects;
  const out = Object.fromEntries(FEST_EFFECT_KEYS.map((k) => [k, false])) as Record<FestEffect, boolean>;
  for (const k of MOBILE_KEYS) out[k] = r.mobile[k];
  return out;
}

/** the festival of a page (the first one that is on for it), or null = the normal theme; mobile = a phone or tablet */
export function festFor(cfg: FestConfig, path: string, mobile = false): { id: FestId; effects: Record<FestEffect, boolean>; density: FestDensity } | null {
  for (const id of FEST_IDS) {
    const r = cfg[id];
    if (r && (r.site || r.pages.some((p) => matches(p, path)))) return { id, effects: effectsFor(r, mobile), density: r.density };
  }
  return null;
}

/** the script that puts the festival on <html> before the first paint (no flash of the normal theme), the same rule as festFor */
export function festBootScript(cfg: FestConfig) {
  const data = JSON.stringify(cfg).replace(/</g, "\\u003c");
  return `(function(){try{var c=${data},p=location.pathname,h=document.documentElement;for(var id in c){var r=c[id],on=r.site;for(var i=0;!on&&i<r.pages.length;i++){var g=r.pages[i];on=g.slice(-2)==="/*"?p.indexOf(g.slice(0,-1))===0:(p===g||p===g+"/");}if(on){h.setAttribute("data-fest",id);var f=[],e=window.matchMedia("${MOBILE_QUERY}").matches?r.mobile:r.effects;for(var k in e){if(e[k])f.push(k);}h.setAttribute("data-fest-fx",f.join(" "));h.setAttribute("data-fest-density",r.density||"normal");return;}}}catch(e){}})();`;
}

/** any festival on at all (the site layout skips everything when none is) */
export const anyFest = (cfg: FestConfig) => FEST_IDS.some((id) => cfg[id].site || cfg[id].pages.length > 0);
