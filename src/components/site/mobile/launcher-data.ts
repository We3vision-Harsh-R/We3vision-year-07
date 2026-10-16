// The launcher (mobile and tablet home): every page of the website is an "app". One icon design for all; the colour only changes with the group.
// Home screen: a widget, eight main apps and a dock of four. Swipe left: the App Library, with the pages in groups.

export type App = { id: string; label: string; href: string; glyph: string; off: number; solid?: boolean };

const A = (id: string, label: string, href: string, glyph: string, off: number): App => ({ id, label, href, glyph, off });

// colour offsets (degrees on the theme hue) per group
const DEV = 0, CRE = 22, ECO = -22, BRA = 44, MAR = -44, PRO = 66, COM = -66;

export const APPS: Record<string, App> = {
  ai: A("ai", "AI / ML", "/ai", "ai", DEV),
  metaverse: A("metaverse", "Metaverse", "/metaverse", "vr", DEV),
  software: A("software", "Software", "/software-development-services", "code", DEV),
  web: A("web", "Web Dev", "/webdev", "globe", DEV),
  app: A("app", "App Dev", "/mobile", "phone", DEV),
  crm: A("crm", "CRM", "/crm", "chart", DEV),
  headless: A("headless", "Headless CMS", "/headless-CMS-devlopment-services", "layers", DEV),
  branddesign: A("branddesign", "Brand Design", "/brand-identity", "pen", CRE),
  uiux: A("uiux", "UI / UX", "/ui-ux-design", "layout", CRE),
  graphics: A("graphics", "Graphic Design", "/graphics", "image", CRE),
  model: A("model", "2D / 3D", "/3d-modeling", "cube", CRE),
  animation: A("animation", "Animation", "/animation", "play", CRE),
  shopify: A("shopify", "Shopify", "/shopify-development-services", "bag", ECO),
  shopplugin: A("shopplugin", "Shopify Plugin", "/shopify-plugin-development-services", "puzzle", ECO),
  shopapp: A("shopapp", "Shopify App", "/shopify-app-development-services", "grid", ECO),
  wordpress: A("wordpress", "WordPress", "/custom-wordpress-devlopment-services", "wp", ECO),
  woo: A("woo", "WooCommerce", "/custom-woocommerce-devlopment", "cart", ECO),
  wpplugin: A("wpplugin", "WP Plugin", "/wordpress-plugin-development-company", "plug", ECO),
  branddev: A("branddev", "Brand Dev", "/brand-development-services", "flag", BRA),
  brandkit: A("brandkit", "Brand Kit", "/brand-kit-design", "toolbox", BRA),
  brandvideo: A("brandvideo", "Brand Video", "/brand-video-production", "video", BRA),
  e2e: A("e2e", "End-to-End", "/zero-to-n-brand-development", "route", BRA),
  seo: A("seo", "SEO", "/seo", "search", MAR),
  meta: A("meta", "Meta Ads", "/meta-marketing-services", "mega", MAR),
  physical: A("physical", "Physical", "/physical-marketing-services", "sign", MAR),
  webugmate: A("webugmate", "WeBugMate", "/products/webugmate", "bug", PRO),
  wejobs: A("wejobs", "WeJobs", "/products/wejobs", "badge", PRO),
  wethink: A("wethink", "WeThink", "/products/wethink", "bulb", PRO),
  wepresent: A("wepresent", "WePresent", "/products/wepresent", "slides", PRO),
  home: A("home", "Home", "/", "home", COM),
  about: A("about", "About", "/about", "about", COM),
  portfolio: A("portfolio", "Portfolio", "/portfolio", "folder", COM),
  products: A("products", "Products", "/products", "box", COM),
  blog: A("blog", "Blogs", "/blog", "doc", COM),
  team: A("team", "Team", "/team", "team", COM),
  contact: A("contact", "Contact", "/contact", "mail", COM),
  careers: A("careers", "Careers", "/careers", "briefcase", COM),
  sitemap: A("sitemap", "Sitemap", "/sitemap", "sitemap", COM),
};

// one colour per app: the hue steps by the golden angle, so neighbours never look alike
Object.values(APPS).forEach((a, i) => { a.off = Math.round((i * 137.508) % 360); a.solid = i % 2 === 0; });

export type Group = { id: string; label: string; apps: string[]; off: number };

// the App Library
export const GROUPS: Group[] = [
  { id: "sug", label: "Suggestions", off: 0, apps: ["contact", "portfolio", "web", "about"] },
  { id: "new", label: "Recently Added", off: 0, apps: ["e2e", "seo", "meta", "physical"] },
  { id: "dev", label: "Development", off: DEV, apps: ["ai", "metaverse", "software", "web", "app", "crm", "headless"] },
  { id: "cre", label: "Creatives", off: CRE, apps: ["branddesign", "uiux", "graphics", "model", "animation"] },
  { id: "eco", label: "E-commerce", off: ECO, apps: ["shopify", "shopplugin", "shopapp", "wordpress", "woo", "wpplugin"] },
  { id: "bra", label: "Branding", off: BRA, apps: ["branddesign", "branddev", "brandkit", "brandvideo", "e2e"] },
  { id: "mar", label: "Marketing", off: MAR, apps: ["seo", "meta", "physical"] },
  { id: "pro", label: "Our Products", off: PRO, apps: ["webugmate", "wejobs", "wethink", "wepresent"] },
  { id: "com", label: "Company", off: COM, apps: ["home", "about", "portfolio", "products", "blog", "team", "contact", "careers", "sitemap"] },
];

// the home screen: eight main apps and the dock of four
export const HOME_APPS = ["products", "blog", "team", "careers", "seo", "web", "app", "ai", "uiux", "shopify", "branddev", "metaverse"];
export const DOCK = ["portfolio", "about", "contact", "services"] as const;
