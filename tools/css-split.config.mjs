// Which class families (the part of a class name before the first dash) are loaded only where they are needed.
//   routes: [...]  the page.tsx files of these folders under src/app/(site)/ import the bundle (whole-page designs)
//   files:  [...]  the component files that use the families import the bundle themselves: it loads wherever (and only where) they render
// Rule of thumb for adding one: the family must be in the HTML of those pages ONLY (node tools/css-usage.mjs <url> shows it).
// ORDER MATTERS: it is the order of the original globals.css. Files import their bundles in this order, so a later bundle wins ties like before.
// Everything not listed here stays in src/app/globals.css. Output: src/styles/<name>.css.
export const BUNDLES = [
  { name: "home-hero", families: ["hub","st"], files: ["src/components/site/hero-scene.tsx","src/components/site/home-street.tsx"] },
  { name: "ai", families: ["fa","bud","at"], files: ["src/components/site/sections/flow.tsx","src/components/site/ai-buddy.tsx","src/components/site/sections/automate.tsx"] },
  { name: "brand-identity", families: ["bb","sk","arch","kit"], files: ["src/components/site/sections/brand-board.tsx","src/components/site/sections/sketch-canvas.tsx","src/components/site/sketch-canvas.tsx","src/components/site/sections/arch-gallery.tsx"] },
  { name: "theme-picker", families: ["tp"], files: ["src/components/site/theme-picker.tsx"] },
  { name: "office", families: ["ob","ws","gs"], files: ["src/components/site/office-art.tsx","src/components/site/office-builder.tsx","src/components/site/office-site.tsx","src/components/site/guide-kit.tsx","src/components/site/guide-scene.tsx","src/components/site/guide-scenes.tsx"] },
  { name: "process-floor", families: ["pf"], files: ["src/components/site/process-floor.tsx"] },
  { name: "reasons-stack", families: ["rs"], files: ["src/components/site/reasons-stack.tsx"] },
  { name: "metaverse", families: ["vfo","mp","vd","vda","vq","ga","vs"], files: ["src/components/site/metaverse/vr-floor.tsx","src/components/site/metaverse/vr-gov.tsx","src/components/site/metaverse/vr-process.tsx","src/components/site/metaverse/vr-devices.tsx","src/components/site/metaverse/vr-quiz.tsx","src/components/site/metaverse/space-art.tsx","src/components/site/metaverse/vr-space.tsx"] },
  { name: "about", families: ["ac","aw"], files: ["src/components/site/about/about-chapters.tsx","src/components/site/about/about-world.tsx"] },
  { name: "panda-chat", families: ["pd"], files: ["src/components/site/about/about-chapters.tsx","src/components/site/hero-scene.tsx","src/components/site/mega-menu.tsx","src/components/site/tech/ask-ai.tsx","src/components/site/sections/guide.tsx"] },
  { name: "modern-base", families: ["md"], files: ["src/components/site/about/about-chapters.tsx","src/components/site/modern/faq-split.tsx","src/components/site/modern/faq-variants.tsx","src/components/site/modern/process-rail.tsx","src/components/site/modern/process-variants.tsx","src/components/site/modern/related-links.tsx","src/components/site/modern/related-variants.tsx","src/components/site/modern/service-bodies.tsx","src/components/site/modern/service-stage.tsx","src/components/site/modern/tools-variants.tsx","src/components/site/modern/variant-kit.tsx","src/components/site/modern/why-bento.tsx","src/components/site/modern/why-variants.tsx"] },
  { name: "modern-service", families: ["vz","sx","cv"], files: ["src/components/site/modern/service-bodies.tsx","src/components/site/modern/service-stage.tsx"] },
  { name: "team", families: ["to2","gm"], files: ["src/components/site/modern/team-office.tsx","src/components/site/glance-min.tsx"] },
  { name: "mega-menu", families: ["mm"], files: ["src/components/site/mega-menu.tsx"] },
  { name: "admin", families: ["al","adb"], files: ["src/components/admin/login-screen.tsx","src/components/admin/blog-form.tsx","src/components/admin/blog-preview.tsx"] },
  { name: "blog", families: ["bm"], files: ["src/components/site/modern/blog-masonry.tsx"] },
  { name: "contact", families: ["rc","ra"], files: ["src/components/site/contact-reception.tsx","src/components/site/reception-avatar.tsx"] },
  { name: "careers", families: ["cj","rl","ro","rv","rt","rh","jb"], files: ["src/components/site/career/destination.tsx","src/components/site/career/form-controls.tsx","src/components/site/career/job-apply.tsx","src/components/site/career/journey.tsx","src/components/site/career/location-picker.tsx","src/components/site/career/railway.tsx","src/components/site/figma-studio.tsx","src/components/site/sections/career.tsx","src/components/site/career/job-page.tsx"] },
  { name: "animation", families: ["ae"], files: ["src/components/site/after-effects.tsx"] },
  { name: "ui-ux", families: ["fg"], files: ["src/components/site/figma-studio.tsx"] },
  { name: "seo-lab", families: ["sl"], files: ["src/components/site/seo-lab.tsx"] },
  { name: "modern-process", families: ["vp"], files: ["src/components/site/modern/process-variants.tsx"] },
  { name: "modern-faq", families: ["vf"], files: ["src/components/site/modern/faq-variants.tsx"] },
  { name: "modern-why", families: ["vw"], files: ["src/components/site/modern/why-variants.tsx"] },
  { name: "modern-related", families: ["vl"], files: ["src/components/site/modern/related-variants.tsx"] },
  { name: "modern-tools", families: ["vt"], files: ["src/components/site/modern/tools-variants.tsx"] },
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
