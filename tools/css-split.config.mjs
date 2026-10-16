// Which class families (the part of a class name before the first dash) are loaded only where they are needed.
//   routes: [...]  the page.tsx files of these folders under src/app/(site)/ import the bundle (whole-page designs)
//   files:  [...]  the component files that use the families import the bundle themselves: it loads wherever (and only where) they render
// Rule of thumb for adding one: the family must be in the HTML of those pages ONLY (node tools/css-usage.mjs <url> shows it).
// ORDER MATTERS: it is the order of the original globals.css. Files import their bundles in this order, so a later bundle wins ties like before.
// Everything not listed here stays in src/app/globals.css. Output: src/styles/<name>.css.
export const BUNDLES = [
  { name: "home-hero", families: ["hub","st"], files: ["src/components/site/hero-scene.tsx","src/components/site/home-street.tsx"] },
  { name: "brand-identity", families: ["bb","sk","arch"], files: ["src/components/site/sections/brand-board.tsx","src/components/site/sections/sketch-canvas.tsx","src/components/site/sketch-canvas.tsx","src/components/site/sections/arch-gallery.tsx"] },
  { name: "ai", families: ["fa","bud","at"], files: ["src/components/site/sections/flow.tsx","src/components/site/ai-buddy.tsx","src/components/site/sections/automate.tsx"] },
  { name: "careers", families: ["cj","rl","ro","rv","rt","rh"], files: ["src/components/site/career/destination.tsx","src/components/site/career/form-controls.tsx","src/components/site/career/job-apply.tsx","src/components/site/career/journey.tsx","src/components/site/career/location-picker.tsx","src/components/site/career/railway.tsx","src/components/site/figma-studio.tsx","src/components/site/sections/career.tsx"] },
  { name: "office", families: ["ob","ws","gs"], files: ["src/components/site/office-art.tsx","src/components/site/office-builder.tsx","src/components/site/office-site.tsx","src/components/site/guide-kit.tsx","src/components/site/guide-scene.tsx","src/components/site/guide-scenes.tsx"] },
  { name: "metaverse", families: ["vfo","mp","vd","vda","vq","ga"], files: ["src/components/site/metaverse/vr-floor.tsx","src/components/site/metaverse/vr-gov.tsx","src/components/site/metaverse/vr-process.tsx","src/components/site/metaverse/vr-devices.tsx","src/components/site/metaverse/vr-quiz.tsx"] },
  { name: "about", families: ["ac"], files: ["src/components/site/about/about-chapters.tsx"] },
  { name: "team", families: ["to2","gm"], files: ["src/components/site/modern/team-office.tsx","src/components/site/glance-min.tsx"] },
  { name: "contact", families: ["rc","ra"], files: ["src/components/site/contact-reception.tsx","src/components/site/reception-avatar.tsx"] },
  { name: "blog", families: ["bm"], files: ["src/components/site/modern/blog-masonry.tsx"] },
  { name: "animation", families: ["ae"], files: ["src/components/site/after-effects.tsx"] },
  { name: "ui-ux", families: ["fg"], files: ["src/components/site/figma-studio.tsx"] },
  { name: "headless-cms", families: ["hl"], routes: ["headless-CMS-devlopment-services"] },
  { name: "wordpress", families: ["wpa"], routes: ["custom-wordpress-devlopment-services"] },
  { name: "shopify", families: ["shp"], routes: ["shopify-development-services"] },
  { name: "woocommerce", families: ["woo"], routes: ["custom-woocommerce-devlopment"] },
  { name: "shopify-app", families: ["sha"], routes: ["shopify-app-development-services"] },
  { name: "wp-plugin", families: ["wpp"], routes: ["wordpress-plugin-development-company"] },
  { name: "graphics", families: ["gfx"], routes: ["graphics"] },
  { name: "brand-dev", families: ["bdv","bdvw"], routes: ["brand-development-services"] },
  { name: "end-to-end", families: ["e2e"], routes: ["zero-to-n-brand-development"] },
  { name: "seo-marketing", families: ["sxo","kwf","mkt","mta"], routes: ["seo","meta-marketing-services","physical-marketing-services"] },
  { name: "physical-marketing", families: ["phy"], routes: ["physical-marketing-services"] },
  { name: "meta-marketing", families: ["mtb"], routes: ["meta-marketing-services"] },
];

/** The draft preview shows ANY page, so it loads every bundle. */
export const PREVIEW_PAGE = "src/app/(site)/preview/[slug]/page.tsx";
