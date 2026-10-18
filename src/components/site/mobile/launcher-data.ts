// The launcher (phone and tablet home): every page of the website is an "app". One icon design for all; every app has its own colour.
// Three screens: 1) Home (widgets + the company pages), 2) Services (one folder card per group), 3) the App Library (every page, grouped, searchable).
// What the visitor puts on screens 1-2 is kept in the browser (see launcher-state.ts); the Library always lists every page.

export type App = { id: string; label: string; href: string; glyph: string; off: number; solid?: boolean };

const A = (id: string, label: string, href: string, glyph: string): App => ({ id, label, href, glyph, off: 0 });

export const APPS: Record<string, App> = {
  ai: A("ai", "AI / ML", "/ai", "ai"),
  metaverse: A("metaverse", "Metaverse", "/metaverse", "vr"),
  software: A("software", "Software", "/software-development-services", "code"),
  web: A("web", "Web Dev", "/webdev", "globe"),
  app: A("app", "App Dev", "/mobile", "phone"),
  crm: A("crm", "CRM", "/crm", "chart"),
  headless: A("headless", "Headless", "/headless-CMS-devlopment-services", "layers"),
  branddesign: A("branddesign", "Identity", "/brand-identity", "pen"),
  uiux: A("uiux", "UI / UX", "/ui-ux-design", "layout"),
  graphics: A("graphics", "Graphics", "/graphics", "image"),
  model: A("model", "2D / 3D", "/3d-modeling", "cube"),
  animation: A("animation", "Animation", "/animation", "play"),
  shopify: A("shopify", "Shopify", "/shopify-development-services", "bag"),
  shopplugin: A("shopplugin", "Shop Plugin", "/shopify-plugin-development-services", "puzzle"),
  shopapp: A("shopapp", "Shop App", "/shopify-app-development-services", "grid"),
  wordpress: A("wordpress", "WordPress", "/custom-wordpress-devlopment-services", "wp"),
  woo: A("woo", "Woo", "/custom-woocommerce-devlopment", "cart"),
  wpplugin: A("wpplugin", "WP Plugin", "/wordpress-plugin-development-company", "plug"),
  branddev: A("branddev", "Brand Dev", "/brand-development-services", "flag"),
  brandkit: A("brandkit", "Brand Kit", "/brand-kit-design", "droplet"),
  brandvideo: A("brandvideo", "Brand Video", "/brand-video-production", "video"),
  e2e: A("e2e", "End-to-End", "/zero-to-n-brand-development", "route"),
  seo: A("seo", "SEO", "/seo", "search"),
  meta: A("meta", "Meta Ads", "/meta-marketing-services", "mega"),
  physical: A("physical", "Physical", "/physical-marketing-services", "sign"),
  webugmate: A("webugmate", "WeBugMate", "/products/webugmate", "bug"),
  wejobs: A("wejobs", "WeJobs", "/products/wejobs", "badge"),
  wethink: A("wethink", "WeThink", "/products/wethink", "bulb"),
  wepresent: A("wepresent", "WePresent", "/products/wepresent", "slides"),
  home: A("home", "Home", "/", "home"),
  about: A("about", "About", "/about", "about"),
  portfolio: A("portfolio", "Portfolio", "/portfolio", "folder"),
  products: A("products", "Products", "/products", "rocket"),
  blog: A("blog", "Blogs", "/blog", "doc"),
  team: A("team", "Team", "/team", "team"),
  contact: A("contact", "Contact", "/contact", "mail"),
  careers: A("careers", "Careers", "/careers", "briefcase"),
  sitemap: A("sitemap", "Sitemap", "/sitemap", "sitemap"),
};

// one colour per app: the hue steps by the golden angle, so neighbours never look alike; the tile style (full colour / light glass) alternates
Object.values(APPS).forEach((a, i) => { a.off = ((i * 53) % 141) - 70; a.solid = true; });

/** a group of pages: its own picture and colour (used on the Services folder cards, the folder and the Library) */
export type Group = { id: string; label: string; apps: string[]; glyph: string; off: number };

export const GROUPS: Group[] = [
  { id: "sug", label: "Suggestions", glyph: "compass", off: 20, apps: ["contact", "portfolio", "web", "about"] },
  { id: "new", label: "Recently Added", glyph: "clock", off: 240, apps: ["e2e", "seo", "meta", "physical"] },
  { id: "dev", label: "Development", glyph: "chip", off: 0, apps: ["ai", "metaverse", "software", "web", "app", "crm", "headless"] },
  { id: "cre", label: "Creatives", glyph: "palette", off: 60, apps: ["uiux", "graphics", "model", "animation"] },
  { id: "eco", label: "E-commerce", glyph: "store", off: 140, apps: ["shopify", "shopplugin", "shopapp", "wordpress", "woo", "wpplugin"] },
  { id: "bra", label: "Branding", glyph: "star", off: 200, apps: ["branddesign", "branddev", "brandkit", "brandvideo", "e2e"] },
  { id: "mar", label: "Marketing", glyph: "trend", off: 280, apps: ["seo", "meta", "physical"] },
  { id: "pro", label: "Our Products", glyph: "trophy", off: 330, apps: ["webugmate", "wejobs", "wethink", "wepresent"] },
  { id: "com", label: "Company", glyph: "building", off: 100, apps: ["home", "about", "portfolio", "products", "blog", "team", "contact", "careers", "sitemap"] },
];
export const GROUP: Record<string, Group> = Object.fromEntries(GROUPS.map((g) => [g.id, g]));

/** the sections of the "All Apps" screen: every page of the website, group by group (a page that is in no group goes to "More") */
export const SECTIONS: { id: string; label: string; apps: string[] }[] = (() => {
  const order = ["dev", "cre", "eco", "bra", "mar", "pro", "com"];
  const out = order.map((id) => ({ id, label: GROUP[id].label, apps: GROUP[id].apps }));
  const used = new Set(out.flatMap((o) => o.apps));
  const rest = Object.keys(APPS).filter((id) => !used.has(id));
  return rest.length ? [...out, { id: "more", label: "More", apps: rest }] : out;
})();
/** the dock, like the four apps of an iPhone dock: Phone (call us), Messages (write to us), a folder with every service, and the App Library */
export type DockId = "phone" | "msg" | "svc" | "lib";
export const DOCK: readonly DockId[] = ["phone", "msg", "svc", "lib"];
/** the folder of the dock: every service page (development, creatives, e-commerce, branding, marketing) in one place */
export const SERVICES: Group = (() => {
  const ids = ["dev", "cre", "eco", "bra", "mar"].flatMap((g) => GROUP[g].apps);
  return { id: "svc", label: "Services", glyph: "services", off: 210, apps: [...new Set(ids)] };
})();
/** every other page is installed on the home screens, like the apps of a new iPhone: screen 1 (with two widgets), screen 2 (a wide widget), screen 3 */
export const SCREEN_APPS: string[][] = [
  ["web", "app", "ai", "seo", "uiux", "shopify", "branddev", "metaverse"],
  ["software", "crm", "headless", "graphics", "branddesign", "model", "animation", "wordpress", "woo", "shopapp", "shopplugin", "wpplugin", "brandkit", "brandvideo", "e2e", "meta"],
  ["physical", "webugmate", "wejobs", "wethink", "wepresent", "products", "team", "careers", "portfolio", "about", "contact", "blog", "home", "sitemap"],
];

// ---- widgets (all of them help a visitor to reach We3vision: call, WhatsApp, write, visit, follow) ----
export type WidgetKind = "clock" | "pitch" | "date" | "contact" | "years" | "whatsapp" | "visit" | "social" | "quick" | "message";
export const WIDGETS: { id: WidgetKind; label: string; hint: string; wide?: boolean }[] = [
  { id: "message", label: "Send a message", hint: "Write to us right here: it reaches our team", wide: true },
  { id: "pitch", label: "Start a project", hint: "A shortcut to the contact page" },
  { id: "contact", label: "Talk to us", hint: "Call or mail We3vision" },
  { id: "whatsapp", label: "WhatsApp", hint: "Chat with us on WhatsApp" },
  { id: "visit", label: "Visit us", hint: "Our office on the map" },
  { id: "social", label: "Follow us", hint: "LinkedIn and Instagram" },
  { id: "quick", label: "Our services", hint: "Four popular services" },
  { id: "years", label: "7 years", hint: "Our story" },
  { id: "clock", label: "Clock", hint: "Analog clock with the date" },
  { id: "date", label: "Calendar", hint: "Today and the week" },
];

// ---- fonts: one font for the whole launcher (like the font picker of Instagram). Only the one that is chosen is downloaded. ----
export type FontId = "poppins" | "soft" | "serif" | "poster" | "mono" | "script" | "hand";
export const FONTS: { id: FontId; label: string; css: string }[] = [
  { id: "poppins", label: "Modern", css: "var(--font-poppins)" },
  { id: "soft", label: "Soft", css: "var(--f-soft)" },
  { id: "serif", label: "Classic", css: "var(--f-serif)" },
  { id: "poster", label: "Poster", css: "var(--f-poster)" },
  { id: "mono", label: "Typewriter", css: "var(--f-mono)" },
  { id: "script", label: "Script", css: "var(--f-script)" },
  { id: "hand", label: "Handwriting", css: "var(--f-hand)" },
];

// ---- wallpapers: smooth iOS-style gradients (a mesh of soft colour fields on a deep base), all built from the THEME colour, so every wallpaper follows the theme picker ----
export type Preset = { id: string; label: string; o: [number, number, number]; s: number; plain?: boolean; base?: string; bg?: string };

/** four colour fields (hue steps from the theme colour) on a base that fades from the first colour to the last; `deep` = how dark the bottom is */
const mesh = (a: number, b: number, c: number, d: number, deep = 12, sat = 1): string => {
  const h = (n: number, l: number, al = 1) => `hsl(calc(var(--lh) + ${n}) calc(${Math.round(92 * sat)}% * var(--ts)) ${l}% / ${al})`;
  return [
    `radial-gradient(95% 52% at 10% 4%, ${h(a, 62, 0.95)}, transparent 64%)`,
    `radial-gradient(85% 48% at 100% 26%, ${h(b, 56, 0.9)}, transparent 66%)`,
    `radial-gradient(120% 58% at 0% 84%, ${h(c, 46, 0.92)}, transparent 68%)`,
    `radial-gradient(80% 40% at 86% 100%, ${h(d, 40, 0.85)}, transparent 72%)`,
    `linear-gradient(176deg, ${h(a, 33)}, ${h(c, deep)})`,
  ].join(", ");
};
/** a wallpaper is only smooth gradients now: the colour mesh, plus one wide soft light that crosses the screen (no lines, no edges) */
const iosWall = (a: number, b: number, c: number, d: number, deep = 12, sat = 1): string => {
  const light = `linear-gradient(118deg, transparent 18%, hsl(calc(var(--lh) + ${a + 30}) calc(${Math.round(100 * sat)}% * var(--ts)) 82% / 0.2) 44%, transparent 72%)`;
  return [light, mesh(a, b, c, d, deep, sat)].join(", ");
};
export const PRESETS: Preset[] = [
  { id: "aurora", label: "Aurora", o: [0, 50, -44], s: 1, plain: true, bg: iosWall(18, 64, -34, -62) },
  { id: "sunrise", label: "Sunrise", o: [0, 0, 0], s: 1, plain: true, bg: iosWall(92, 128, 54, 16, 14) },
  { id: "ocean", label: "Ocean", o: [0, 0, 0], s: 1, plain: true, bg: iosWall(-96, -138, -64, -178, 12) },
  { id: "bloom", label: "Bloom", o: [0, 0, 0], s: 1, plain: true, bg: iosWall(40, -28, 96, -72, 16) },
  { id: "dusk", label: "Dusk", o: [0, 0, 0], s: 1, plain: true, bg: iosWall(112, 52, 8, -40, 10) },
  { id: "mint", label: "Mint", o: [0, 0, 0], s: 1, plain: true, bg: iosWall(-150, -118, -176, -92, 12) },
  { id: "graphite", label: "Graphite", o: [0, 0, 0], s: 0.06, plain: true, bg: iosWall(0, 0, 0, 0, 5, 0.06) },
  { id: "midnight", label: "Midnight", o: [0, 0, 0], s: 1, plain: true, bg: `radial-gradient(90% 40% at 50% 0%, hsl(calc(var(--lh) + 10) calc(80% * var(--ts)) 30% / 0.9), transparent 70%), linear-gradient(180deg, hsl(calc(var(--lh) - 10) calc(70% * var(--ts)) 12%), hsl(calc(var(--lh) - 20) calc(70% * var(--ts)) 4%))` },
];
