// The Services page (/services): every service page of the site, in the five groups of the big menu (lib/site-menu.ts SERVICE_GROUPS), each with one plain sentence
// and the services it goes well with. Only the words and the links are here; the look is in styles/services-map.css (svx-). The sentences repeat what the service
// pages already say (no numbers, no clients).

export type Svc = { href: string; name: string; line: string; pairs: string[] };
export type SvcGroup = { key: string; label: string; em: string; text: string; items: Svc[] };
export type Journey = { key: string; title: string; text: string; steps: string[] };

export const GROUPS: SvcGroup[] = [
  {
    key: "development",
    label: "Development",
    em: "Software that works",
    text: "Websites, apps, AI and the systems behind them, planned and built by one team.",
    items: [
      { href: "/webdev", name: "Web Development", line: "Fast, responsive websites, from landing pages to large portals.", pairs: ["/seo", "/ui-ux-design", "/headless-CMS-devlopment-services"] },
      { href: "/mobile", name: "App Development", line: "Mobile apps for Android and iOS, native or cross-platform.", pairs: ["/ui-ux-design", "/crm", "/ai"] },
      { href: "/software-development-services", name: "Software Development", line: "Custom software and internal tools built around how your business runs.", pairs: ["/crm", "/ai", "/mobile"] },
      { href: "/crm", name: "CRM Development", line: "A CRM that keeps leads, customers and follow-ups in one place.", pairs: ["/software-development-services", "/ai", "/meta-marketing-services"] },
      { href: "/ai", name: "AI / ML Development", line: "Assistants and models trained on your data, built into your tools.", pairs: ["/crm", "/software-development-services", "/webdev"] },
      { href: "/headless-CMS-devlopment-services", name: "Headless CMS Development", line: "Content that you edit once and publish to the web, apps and more.", pairs: ["/webdev", "/mobile", "/seo"] },
      { href: "/metaverse", name: "Metaverse Development", line: "Virtual worlds, VR and AR experiences and virtual events.", pairs: ["/3d-modeling", "/animation", "/ui-ux-design"] },
    ],
  },
  {
    key: "creatives",
    label: "Creatives",
    em: "Design people enjoy",
    text: "Interfaces, graphics, 3D and motion that make the product clear and good to look at.",
    items: [
      { href: "/ui-ux-design", name: "UI/UX Design", line: "Clear, easy interfaces for websites, apps and software.", pairs: ["/webdev", "/mobile", "/brand-identity"] },
      { href: "/graphics", name: "Graphic Design", line: "Social posts, print and campaign visuals that match your brand.", pairs: ["/brand-kit-design", "/meta-marketing-services", "/physical-marketing-services"] },
      { href: "/3d-modeling", name: "2D/3D Modeling", line: "Characters, props, products and environments made in 3D.", pairs: ["/animation", "/metaverse", "/brand-video-production"] },
      { href: "/animation", name: "Animation & Video Editing", line: "Animation, motion graphics and video that explain ideas.", pairs: ["/3d-modeling", "/brand-video-production", "/meta-marketing-services"] },
    ],
  },
  {
    key: "branding",
    label: "Branding",
    em: "A brand people remember",
    text: "From a first logo to a full brand, in the steps that suit where your company is today.",
    items: [
      { href: "/brand-identity", name: "Brand Design", line: "Logo, colour and type that make your company look like itself.", pairs: ["/brand-kit-design", "/ui-ux-design", "/graphics"] },
      { href: "/brand-development-services", name: "Brand Development", line: "Positioning, voice and a plan for how your brand grows.", pairs: ["/brand-identity", "/seo", "/meta-marketing-services"] },
      { href: "/brand-kit-design", name: "Brand Kit Design", line: "Guidelines and templates so everyone uses the brand the same way.", pairs: ["/brand-identity", "/graphics", "/ui-ux-design"] },
      { href: "/brand-video-production", name: "Brand Video", line: "A film that shows who you are in a minute or two.", pairs: ["/animation", "/3d-modeling", "/meta-marketing-services"] },
      { href: "/zero-to-n-brand-development", name: "End-to-End Brand Development", line: "From the idea to the launch, brand, website and marketing, with one team.", pairs: ["/brand-identity", "/webdev", "/meta-marketing-services"] },
    ],
  },
  {
    key: "ecommerce",
    label: "E-commerce",
    em: "Sell online with ease",
    text: "Stores and plugins on Shopify, WordPress and WooCommerce, built to sell and easy to manage.",
    items: [
      { href: "/shopify-development-services", name: "Shopify Development", line: "Shopify stores that look like your brand and are simple to run.", pairs: ["/shopify-plugin-development-services", "/seo", "/meta-marketing-services"] },
      { href: "/shopify-plugin-development-services", name: "Shopify Plugin Development", line: "Extra features for a Shopify store, made to fit how you sell.", pairs: ["/shopify-development-services", "/shopify-app-development-services"] },
      { href: "/shopify-app-development-services", name: "Shopify App Development", line: "Custom Shopify apps for stores or for the Shopify App Store.", pairs: ["/shopify-plugin-development-services", "/shopify-development-services"] },
      { href: "/custom-wordpress-devlopment-services", name: "WordPress Development", line: "Custom WordPress sites that your team can update on its own.", pairs: ["/wordpress-plugin-development-company", "/seo", "/ui-ux-design"] },
      { href: "/custom-woocommerce-devlopment", name: "Custom WooCommerce Development", line: "WooCommerce stores with the checkout and features you need.", pairs: ["/custom-wordpress-devlopment-services", "/wordpress-plugin-development-company", "/seo"] },
      { href: "/wordpress-plugin-development-company", name: "WordPress Plugin Development", line: "Plugins that add exactly one missing feature to WordPress.", pairs: ["/custom-wordpress-devlopment-services", "/custom-woocommerce-devlopment"] },
    ],
  },
  {
    key: "marketing",
    label: "Marketing",
    em: "Be found, be chosen",
    text: "Search, social and real-world marketing that bring the right people to what you built.",
    items: [
      { href: "/seo", name: "SEO / AEO", line: "Search and answer-engine work that brings people to your site.", pairs: ["/webdev", "/headless-CMS-devlopment-services", "/meta-marketing-services"] },
      { href: "/meta-marketing-services", name: "Meta Marketing", line: "Facebook and Instagram campaigns built around your customers.", pairs: ["/graphics", "/animation", "/seo"] },
      { href: "/physical-marketing-services", name: "Physical Marketing", line: "Print, signs and event material that carry the brand offline.", pairs: ["/graphics", "/brand-kit-design", "/brand-identity"] },
    ],
  },
];

/** how the services work together: the usual combinations, in order */
export const JOURNEYS: Journey[] = [
  { key: "launch", title: "Launch a new business", text: "Start with the brand, put it on a website and make sure people find it.", steps: ["/brand-identity", "/webdev", "/seo", "/meta-marketing-services"] },
  { key: "sell", title: "Sell online", text: "A store, the features it needs, and visitors who turn into buyers.", steps: ["/shopify-development-services", "/shopify-plugin-development-services", "/seo", "/meta-marketing-services"] },
  { key: "product", title: "Build a digital product", text: "Design it first, build the app, then connect the systems behind it.", steps: ["/ui-ux-design", "/mobile", "/crm", "/ai"] },
  { key: "story", title: "Tell your story", text: "Visuals, motion and film that make the brand easy to understand.", steps: ["/graphics", "/3d-modeling", "/animation", "/brand-video-production"] },
];

export const ALL: Svc[] = GROUPS.flatMap((g) => g.items);
export const nameOf = (href: string) => ALL.find((s) => s.href === href)?.name ?? href;
