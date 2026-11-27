import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// TECHNOLOGY PAGES: Headless CMS, Custom WordPress, Shopify, WooCommerce, Shopify Apps and WordPress Plugins. They are linked from the
// "Technology" column of the footer and keep the URLs of the old site (including its spelling, "devlopment"), so Google rankings carry over.
// Source: the same pages of the old site (https://we3vision.com): the same services, process steps, industries and FAQ answers. The wording is
// new and plain; the claims of the old pages that cannot be checked (years of experience, project counts, success rates, review scores,
// prices) are NOT copied. Nothing is invented. This is what visitors see until someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({ id, type, data: data as Record<string, unknown> });

type Card = { title: string; description: string };
export type Tech = {
  seo: { title: string; description: string };
  hero: { chip: string; heading: string; text: string };
  story: string;
  services: { heading: string; intro: string; cards: Card[] };
  process?: { heading: string; intro: string; items: { title: string; text: string; points?: string }[] };
  tools: { heading: string; items: string };
  why: { heading: string; intro?: string; items: { title: string; description: string }[] };
  industries?: { heading: string; intro: string; items: { name: string; description: string }[] };
  faq?: { question: string; answer: string }[];
  related: Card[] & { href?: string }[];
  cta: { heading: string; text: string; button: string };
};

export const RELATED: Record<string, { title: string; description: string; href: string }> = {
  headless: { title: "Headless CMS\nDevelopment", description: "Content managed in one place and delivered to your website, apps and more through APIs.", href: "/headless-cms-development-services" },
  wordpress: { title: "Custom WordPress\nDevelopment", description: "Themes, plugins, migrations and support for WordPress websites built around your brand.", href: "/custom-wordpress-development-services" },
  shopify: { title: "Shopify\nDevelopment", description: "Custom Shopify stores, themes, integrations and support to sell your products online.", href: "/shopify-development-services" },
  woo: { title: "Custom WooCommerce\nDevelopment", description: "Online stores on WordPress with the features, payments and shipping your business needs.", href: "/custom-woocommerce-development" },
  shopapp: { title: "Shopify App\nDevelopment", description: "Private and public Shopify apps that add the features your store is missing.", href: "/shopify-app-development-services" },
  plugin: { title: "WordPress Plugin\nDevelopment", description: "Custom plugins, integrations, upgrades and add-ons for WordPress websites.", href: "/wordpress-plugin-development-company" },
  shopplugin: { title: "Shopify Plugin\nDevelopment", description: "Theme extensions, sections and add-ons that give your Shopify store the exact feature it needs.", href: "/shopify-plugin-development-services" },
  software: { title: "Custom Software\nDevelopment", description: "Business software built around the way your team works: portals, dashboards, automation and integrations.", href: "/software-development-services" },
  branddev: { title: "Brand\nDevelopment", description: "Strategy, name, story and voice: the thinking that makes a brand worth remembering.", href: "/brand-development-services" },
  brandkit: { title: "Brand Kit\nDesign", description: "Logo, colours, type and templates in one kit, so every touch point looks like one brand.", href: "/brand-kit-design" },
  brandvideo: { title: "Brand Video\nProduction", description: "Planning, shooting and editing of brand films and influencer-based videos, start to finish.", href: "/brand-video-production" },
  zero: { title: "End-to-End Brand\nDevelopment", description: "A complete brand built for you from the very first idea to identity, launch and rollout.", href: "/zero-to-n-brand-development" },
  meta: { title: "Meta\nMarketing", description: "Facebook and Instagram campaigns planned, designed, run and reported by one team.", href: "/meta-marketing-services" },
  physical: { title: "Physical\nMarketing", description: "Print, outdoor and on-ground marketing that puts your brand in front of people in the real world.", href: "/physical-marketing-services" },
  seo: { title: "SEO / AEO\nOptimization", description: "Be found on Google and in AI answers with technical, content and local SEO.", href: "/seo" },
  brand: { title: "Brand\nDesign", description: "Logos and visual identities that make a business easy to recognise and trust.", href: "/brand-identity" },
  ai: { title: "AI\nDevelopment", description: "AI and machine learning solutions that automate work and help your team decide faster.", href: "/ai" },
  mobile: { title: "Mobile App\nDevelopment", description: "Android and iOS apps designed for your customers and built to grow with your business.", href: "/mobile" },
  ui: { title: "UI/UX\nDesign", description: "Clear, usable interfaces that make your product easy and pleasant to use.", href: "/ui-ux-design" },
  graphics: { title: "Graphic\nDesign", description: "Posts, brochures, packaging and layouts with a clear, consistent look.", href: "/graphics" },
  animation: { title: "2D/3D Animation\n& Video", description: "Animation, motion graphics and video editing that explain ideas and bring brands to life.", href: "/animation" },
  web: { title: "Web\nDevelopment", description: "Responsive, fast and SEO-friendly websites from landing pages to complex web portals.", href: "/webdev" },
  metaverse: { title: "Metaverse\nDevelopment", description: "Virtual worlds, VR and AR experiences and virtual events for your business.", href: "/metaverse" },
  modeling: { title: "3D\nModeling", description: "Characters, props, vehicles and environments made for games and immersive experiences.", href: "/3d-modeling" },
};
export const related = (...keys: (keyof typeof RELATED)[]) => keys.map((k) => RELATED[k]);

export const build = (t: Tech): PageSection[] => [
  section("pageHero", {
    chip: t.hero.chip,
    heading: t.hero.heading,
    text: t.hero.text,
    primaryLabel: "Get a free quote",
    primaryHref: "#contact",
    secondaryLabel: "What we build",
    secondaryHref: "#services",
  }),
  section("story", { body: t.story }),
  section("services", {
    chip: "What we build",
    heading: t.services.heading,
    intro: t.services.intro,
    buttonLabel: "",
    buttonHref: "",
    cards: t.services.cards.map((c) => ({ title: c.title, description: c.description, href: "", fit: "", problems: "", outcomes: "" })),
  }),
  ...(t.process ? [section("process", { chip: "Our process", heading: t.process.heading, intro: t.process.intro, items: t.process.items.map((i) => ({ title: i.title, text: i.text, points: i.points ?? "" })) })] : []),
  section("tags", { chip: "Tools & Technologies", heading: t.tools.heading, intro: "", items: t.tools.items }),
  ...(t.industries ? [section("industries", { chip: "Industries We Serve", heading: t.industries.heading, intro: t.industries.intro, items: t.industries.items })] : []),
  section("advantages", { chip: "Why We3vision", heading: t.why.heading, intro: t.why.intro ?? "", items: t.why.items }, "why-we3vision"),
  ...(t.faq ? [section("faq", { chip: "FAQ", heading: "Questions\nWe Often Hear", intro: "", items: t.faq })] : []),
  section(
    "services",
    {
      chip: "Related services",
      heading: "More From\nWe3vision",
      intro: "Services that work well together with this one.",
      buttonLabel: "",
      buttonHref: "",
      cards: (t.related as { title: string; description: string; href: string }[]).map((c) => ({ title: c.title, description: c.description, href: c.href, fit: "", problems: "", outcomes: "" })),
    },
    "related-services",
  ),
  section("contact", { chip: "Let's talk", heading: t.cta.heading, text: t.cta.text, buttonLabel: t.cta.button }),
];

// ---------------------------------------------------------------------------------------------------------------------
// Headless CMS (/headless-cms-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const HEADLESS_SEO = {
  title: "Headless CMS Development Company in Surat, India | We3vision",
  description: "Headless CMS development services from We3vision in Surat, Gujarat, India, for clients in the USA, UK, Canada and Australia. Get a free quote today.",
};
export const HEADLESS_SECTIONS = build({
  seo: HEADLESS_SEO,
  hero: {
    chip: "Headless CMS",
    heading: "Headless CMS\nDevelopment Services",
    text: "Headless CMS development from Surat, Gujarat, India for businesses in India, the USA, UK, Canada and Australia. Manage content once and deliver it to websites and apps through fast APIs.",
  },
  story:
    "A *headless CMS* stores and manages your content separately from the way it is shown. Content travels through *REST or GraphQL APIs*, so the same text, images and videos can feed a *website, a mobile app and any other channel* without being written twice.\n\nAs a headless CMS development company, we work with *Contentful, Strapi and Sanity*, build modern *React or Vue front ends*, and move you over from a traditional CMS such as WordPress or Drupal with as little downtime as possible.",
  services: {
    heading: "Headless CMS\nServices We Provide",
    intro: "From the first plan to the support after launch, everything you need to run content on a headless platform.",
    cards: [
      { title: "Custom headless CMS\ndevelopment", description: "A headless content system built on tools like Contentful, Strapi or Sanity and shaped around your business." },
      { title: "Headless CMS\nmigration", description: "We move your content from a traditional CMS such as WordPress or Drupal to a headless one, with less downtime and a safe, smooth move." },
      { title: "API integration\n& development", description: "REST or GraphQL APIs that connect your headless CMS with other tools and services, giving you more control and flexibility." },
      { title: "Open-source\nheadless CMS", description: "Trusted open-source platforms that are flexible, cost-effective and easy to update." },
      { title: "Front-end development\nfor headless CMS", description: "Fast, modern websites built with React or Vue that work well with headless CMS platforms." },
      { title: "Digital strategy", description: "We help plan your digital journey, choosing the CMS tools and structure that support your business goals." },
      { title: "Testing\nand QA", description: "We test everything so your CMS works smoothly, is safe from bugs and gives the best experience to your users." },
      { title: "Omnichannel content\ndistribution", description: "Your CMS set up to send content to websites, apps and other platforms, quickly and easily." },
      { title: "Support\n& maintenance", description: "Regular updates, bug fixes and help after your CMS is live, so it keeps running well and stays ready for the future." },
    ],
  },
  process: {
    heading: "Our Headless CMS\nDevelopment Life Cycle",
    intro: "A clear and simple process for building a professional headless CMS.",
    items: [
      { title: "Scope identification", text: "We first understand your needs and services.", points: "Business goals and users\nHow the CMS will be used" },
      { title: "Strategic planning", text: "We plan every step carefully, based on your business goals.", points: "Choice of CMS and structure\nPlan and timeline" },
      { title: "UI/UX design", text: "Our design team turns your ideas into simple, clear and easy-to-use layouts that look great and are user-friendly.", points: "Clear editing screens\nLayouts for every device" },
      { title: "Development", text: "We build strong and secure features for your CMS that improve how your website works and help grow your business.", points: "Clean code, modern tools\nSecure and scalable" },
      { title: "Rigorous testing", text: "We test everything carefully to make sure there are no bugs or issues.", points: "Many devices and browsers" },
      { title: "Smooth deployment", text: "We launch the final product smoothly, with less downtime, so your users get the best experience from day one.", points: "Live launch\nSupport afterwards" },
    ],
  },
  tools: { heading: "Our CMS\nTech Stack", items: "HTML5\nCSS3\nReact.js\nVue.js\nBootstrap\nContentful\nStrapi\nSanity\nREST APIs\nGraphQL" },
  why: {
    heading: "Benefits Of A\nHeadless CMS",
    items: [
      { title: "Omnichannel content delivery", description: "Share the same content on websites, apps, social media and more, all from one place, saving time and effort." },
      { title: "Faster performance", description: "Because the front and back ends are separate, we can use fast tools like React or Vue to build quicker, smoother websites." },
      { title: "Developer flexibility", description: "Developers can use the tools and languages they like, such as React, Angular or Vue, for more freedom." },
      { title: "Future-proof architecture", description: "You can update your front end or move to a new platform without starting from scratch." },
      { title: "Faster time-to-market", description: "Content and design work separately, so your team can update images, blogs or videos quickly." },
      { title: "Easy integration", description: "Connect your CMS with CRMs, e-commerce tools, analytics or any software through APIs." },
    ],
  },
  industries: {
    heading: "Headless CMS\nFor Every Industry",
    intro: "Content-rich businesses of every kind can benefit. Here is what a headless CMS can look like in some of them.",
    items: [
      { name: "E-commerce websites", description: "A headless CMS can power more than a website: it can drive your whole online store." },
      { name: "Healthcare", description: "Headless CMS solutions that meet strict privacy and security standards." },
      { name: "Education and e-learning", description: "Managing course content, student data and interactive learning material." },
      { name: "Hospitality and travel", description: "Headless CMS platforms for hotels, tours and travel services." },
      { name: "Software as a service (SaaS)", description: "Fast, scalable and user-friendly content systems for SaaS products." },
      { name: "Finance", description: "Security comes first: content platforms built with strong protection of data." },
      { name: "Media and entertainment", description: "Fast, content-rich platforms that keep your audience engaged." },
      { name: "Non-profits", description: "Managing donations, volunteers and events." },
      { name: "Real estate", description: "Platforms where users find properties easily with search filters, maps and listings." },
    ],
  },
  faq: [
    { question: "What is a headless CMS and how does it work?", answer: "A headless CMS stores and manages content separately from the website or app design. It uses APIs to send content to websites, apps or other digital channels, making content flexible and reusable." },
    { question: "Can I manage my content without technical skills?", answer: "Yes. A headless CMS usually has a simple admin panel where you can create and update content without coding. Developers handle how the content is shown on different platforms." },
    { question: "Which headless CMS platform should I choose?", answer: "It depends on your needs. Popular options include Strapi, Contentful and Sanity. We guide you to choose the right one based on your goals and budget." },
    { question: "Is a headless CMS secure for my business?", answer: "Yes, when it is set up properly. We follow strong security steps like safe API access, backups and regular updates to protect your data." },
    { question: "Can I connect other tools with my headless CMS?", answer: "Yes. A headless CMS works well with payment gateways, CRMs, marketing software and analytics through API integrations." },
    { question: "How long does it take to build a headless CMS?", answer: "The time varies with the size of the project. Simple setups take about 3 to 5 weeks, while complex projects may take longer. We give you a clear timeline before starting." },
    { question: "Will my headless CMS work on mobile devices?", answer: "Yes. A headless CMS delivers content through APIs that work on all devices: phones, tablets and desktops." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Is We3vision a headless CMS development company in India?", answer: "Yes. We3vision Private Limited is a headless CMS development company in Surat, Gujarat, India, founded in 2019, building the CMS, the API and the front end." },
  ],
  related: related("web", "wordpress", "plugin"),
  cta: { heading: "Ready To Go\nHeadless?", text: "Share your content and channels. From Surat, India we plan the right headless CMS for clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom WordPress (/custom-wordpress-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const WORDPRESS_SEO = {
  title: "Custom WordPress Development Services in Surat | We3vision",
  description: "Custom WordPress development services from a Surat, India company: themes, plugins, WooCommerce and migration for USA, UK, Canada and Australia clients.",
};
export const WORDPRESS_SECTIONS = build({
  seo: WORDPRESS_SEO,
  hero: {
    chip: "WordPress",
    heading: "Custom WordPress\nDevelopment Services",
    text: "We3vision is a WordPress development company in Surat, India. We build custom WordPress websites, themes and plugins for clients in India, the USA, UK, Canada and Australia: fast, secure and easy to manage.",
  },
  story:
    "We3vision provides *custom WordPress development services* from Surat, Gujarat, India. No two brands are the same, so we build *WordPress website development* around *your goals and your audience* instead of a generic theme: *custom WordPress theme development, plugins, WooCommerce stores and migration*, from a simple blog to a large business platform.\n\nYou can *hire WordPress developers from India* per project, by the hour, or as a dedicated developer or full team. We have worked with clients from the USA, Canada, the UK, Germany, the UAE, Singapore and Australia, so remote work with a clear plan agreed up front is normal for us.\n\nWe3vision Private Limited was founded in 2019 and also has a second office in Marburg, Germany. We hand over a site you own and your own team can manage, with *support and maintenance* after launch if you want it.",
  services: {
    heading: "Our WordPress\nDevelopment Services",
    intro: "Everything a WordPress website needs, from the first design to the support after launch. These are the custom WordPress development services we offer to clients in Surat, across India and abroad.",
    cards: [
      { title: "WordPress design\nservices", description: "A website that does more than look good: a clear, on-brand design that guides visitors to call you, book or buy, and works well on every screen." },
      { title: "WordPress theme\ndevelopment", description: "Custom WordPress theme development built around your brand and content, not a ready-made theme that looks like everyone else's and carries features you never use." },
      { title: "WordPress plugin\ndevelopment", description: "Custom plugins for the feature your site needs, such as booking, calculators, forms, dashboards or links to your CRM, so you do not stack up many extra plugins." },
      { title: "WooCommerce\ndevelopment", description: "Running an online store? We build WooCommerce stores with the product pages, checkout, payments and shipping options your customers expect, ready to sell." },
      { title: "WordPress migration\nservices", description: "WordPress migration should not feel risky. We move your site from another platform or host with a backup first and a check of your content, links and pages after." },
      { title: "Enterprise WordPress\ndevelopment", description: "Bigger businesses need WordPress platforms with many editors, many pages, strong security and integrations, built so the site stays easy to run as it grows." },
      { title: "Support &\nmaintenance", description: "A website needs care after launch: core, theme and plugin updates, backups, security checks and fixes, so your WordPress site keeps running well." },
      { title: "WordPress retainer\nservices", description: "Need ongoing help? A WordPress retainer gives you a developer on call to fix, improve and speed up your site, and to add new pages and features when you need them." },
      { title: "Headless WordPress\ndevelopment", description: "Headless WordPress keeps the familiar editor for your team and uses a modern front end for speed and flexibility, useful for apps, multiple channels or custom designs." },
    ],
  },
  process: {
    heading: "How We Build\nYour WordPress Site",
    intro: "A simple, clear process from the first conversation to the launch, with the plan agreed up front. It works the same for a client next door in Surat or one in the USA, UK, Canada or Australia.",
    items: [
      { title: "Understanding your needs", text: "We begin by learning your goals, your audience and what the website must do, such as sell products, bring leads, show a portfolio or run a business site. After that we share a written plan and a quote.", points: "Goals and audience\nType of website" },
      { title: "Design", text: "Design is where creativity meets strategy: layouts and visuals that fit your brand, are easy to use and are planned for search from the start.", points: "Look and feel\nLayouts for every device" },
      { title: "Development", text: "This is where the plan becomes a website: we build the custom theme, the features, the plugins and the integrations, with speed and security in mind.", points: "Custom theme\nFeatures and plugins" },
      { title: "Delivery", text: "Before launch we test the site on different browsers and devices, check forms, speed and SEO basics, then launch and stay available for support.", points: "Testing\nLaunch and support" },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "HTML5\nCSS3\nReact.js\nBootstrap\nVue.js\nWordPress\nWooCommerce" },
  why: {
    heading: "Benefits Of Custom\nWordPress Development",
    items: [
      { title: "Built just for you", description: "Every business has its own goals, and a one-size-fits-all theme rarely fits them. Custom WordPress development starts from your needs." },
      { title: "A design that stands out", description: "Ready-made templates can make your site look like many others. A custom design shows what makes your brand different." },
      { title: "Ready to grow with you", description: "Businesses change, and so should your website. We build clean, organised code so you can add pages, features and products later." },
      { title: "Speed you can count on", description: "A slow website frustrates visitors and can hurt your search rankings. We keep themes light and load only what each page needs." },
      { title: "Stronger security", description: "We keep WordPress core, themes and plugins updated, use trusted code and add sensible protections, which lowers the risk of attacks." },
      { title: "Built for SEO", description: "A custom WordPress site is built with clean structure, fast pages and proper titles and headings, so search engines can understand it." },
      { title: "Ownership and flexibility", description: "With custom development you own the code, the design and the features, and you are not locked in to one theme seller or agency." },
      { title: "Reliable support and maintenance", description: "Websites need care to keep running smoothly. We offer updates, backups and fixes after launch, so small problems do not become big ones." },
      { title: "Better on mobile devices", description: "Most people browse on phones, so we design for mobile first and test pages on real screen sizes before launch." },
    ],
  },
  industries: {
    heading: "WordPress For\nEvery Industry",
    intro: "From simple blogs to complex platforms, here is what custom WordPress development can look like in some industries, for businesses in Surat, India and abroad.",
    items: [
      { name: "E-commerce", description: "Your online store is the face of your brand: WooCommerce stores with clear products, easy checkout and payment options." },
      { name: "Healthcare", description: "In healthcare, trust is everything: clear, secure websites for clinics and care providers, with easy appointment forms." },
      { name: "Education", description: "Learning is not limited to classrooms anymore: sites for schools, institutes and course providers with course pages and enquiry forms." },
      { name: "Real estate", description: "Connecting buyers to properties and agents to clients, with listing pages, filters and enquiry forms that are easy to manage." },
      { name: "Travel and hospitality", description: "Travel should feel inspiring, even while planning: sites for hotels, tours and restaurants with galleries and booking enquiries." },
      { name: "Media and entertainment", description: "Dynamic websites for the fast-paced world of media, built for many articles, many editors and fast page loads." },
      { name: "Finance and banking", description: "In finance, security and credibility are non-negotiable: careful, well-protected sites that explain services clearly." },
      { name: "Non-profit organisations", description: "A platform that works as hard as your mission does, with story pages, donation options and easy updates by your team." },
      { name: "Technology and SaaS", description: "Functionality and simplicity are key for SaaS businesses: marketing sites, blogs and docs that are quick to load and easy to update." },
    ],
  },
  related: related("woo", "plugin", "headless"),
  faq: [
    { question: "How much do custom WordPress development services cost?", answer: "The cost depends on the scope of your project, such as the number of pages, custom features, plugins, integrations and whether you need an online store. We give a clear quote after we understand your requirements, so you know what you are paying for before we start." },
    { question: "How long does it take to build a custom WordPress website?", answer: "The time depends on the size and features of the site. A small business site takes less time than a store or a large platform with custom plugins. We share a clear timeline in the plan before the work begins." },
    { question: "Should I choose a custom WordPress theme or a ready-made theme?", answer: "A custom WordPress theme is the better choice when you want a unique design, faster pages and exactly the features you need. A ready-made theme can work for a simple site on a small budget, but it often carries extra code and looks like other sites. We build custom WordPress theme development around your brand." },
    { question: "Can you build custom WordPress plugins?", answer: "Yes. We3vision builds custom WordPress plugins for features that ready-made plugins do not cover, such as booking, calculators, member areas or links to your CRM or other tools. We also help choose and set up trusted existing plugins when they are enough." },
    { question: "Can you migrate my existing website to WordPress?", answer: "Yes. WordPress migration is one of our services. We take a backup, move your content, pages and media from your old platform or host, then check links, forms and key pages so nothing important is lost." },
    { question: "How do you keep a WordPress website secure and up to date?", answer: "We keep WordPress core, themes and plugins updated, use trusted code, set safe user roles and take regular backups. Support and maintenance covers these updates and fixes after launch, so security is not left to chance." },
    { question: "Do you offer WordPress maintenance after launch?", answer: "Yes. Support and maintenance covers updates, backups, security checks and fixes after launch. A retainer gives you ongoing help to improve and optimise your site whenever you need." },
    { question: "Will my WordPress website be fast and good for SEO?", answer: "Yes, we build for both from the start. We use clean code, light themes, optimised images and proper titles, headings and page structure, so the site loads quickly and search engines can read it. Rankings depend on many things, so we do not promise a position." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front. We have also worked with clients from Germany, the UAE and Singapore." },
    { question: "Why choose a WordPress development company in Surat, India?", answer: "We3vision Private Limited, founded in 2019, is a custom WordPress development company in Surat, Gujarat, India, and you can hire WordPress developers from India per project, by the hour or as a dedicated team. You get the full service, from design and theme and plugin development to WooCommerce, migration and maintenance, with a plan agreed before work starts." },
  ],
  cta: { heading: "Ready For Your\nWordPress Website?", text: "Tell us what you want to build and who it is for. From Surat, India we plan and build custom WordPress websites for clients in India, the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Shopify (/shopify-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFY_SEO = {
  title: "Shopify Development Company in Surat, India | We3vision",
  description: "Shopify development services from We3vision in Surat, Gujarat, India, for clients in the USA, UK, Canada and Australia. Get a free quote today.",
};
export const SHOPIFY_SECTIONS = build({
  seo: SHOPIFY_SEO,
  hero: {
    chip: "Shopify",
    heading: "Shopify\nDevelopment Services",
    text: "A Shopify development company in Surat, Gujarat, India. We build fast, tailored Shopify stores for brands in India, the USA, UK, Canada and Australia.",
  },
  story:
    "As a Shopify development company, we build *unique Shopify stores* that fit your brand and goals: every detail, from colours to layouts, is designed to match what your business is about.\n\nFrom *theme customisation and app integration* to *custom apps, platform migration and ongoing support*, we take care of the technical work, so you can focus on *selling and growing*.",
  services: {
    heading: "Shopify\nDevelopment Services",
    intro: "Everything your Shopify store needs, from the first design to the support after launch.",
    cards: [
      { title: "Custom store design\nand development", description: "Unique Shopify stores that fit your brand and goals, designed in every detail to look great and work well." },
      { title: "Theme\ncustomisation", description: "We take a theme and tweak it to look amazing and fit your style, keeping it simple to navigate on phones, tablets and computers." },
      { title: "App\nintegration", description: "Payment tools, marketing helpers or analytics trackers added to your store and made to work smoothly." },
      { title: "Custom app\ndevelopment", description: "Special Shopify apps built just for your business, for what regular apps cannot do." },
      { title: "Platform\nmigration", description: "Switching to Shopify from another platform: your products, customers and data move over safely." },
      { title: "Ongoing support\nand maintenance", description: "Updates and fixes whenever you need them, new features and a store that stays up to date." },
      { title: "Performance\noptimisation", description: "A Shopify store that loads faster and feels smoother, by tuning things like images and code." },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "Shopify\nLiquid\nHTML5\nCSS3\nJavaScript\nReact.js\nNode.js" },
  why: {
    heading: "Why Partner With\nWe3vision For Shopify",
    items: [
      { title: "Experienced team", description: "A team that builds Shopify stores for businesses of all sizes, from startups to larger companies, with scalability in mind." },
      { title: "Steady project momentum", description: "Steady progress so your project never stalls, with timely updates, bug fixes and improvements." },
      { title: "Cost-effective", description: "As an India-based agency we offer high-quality Shopify design and development at fair costs." },
      { title: "Progress around the clock", description: "A team across time zones means your project can keep moving forward while you rest." },
      { title: "Focus on your core business", description: "Let us handle design, development and updates, so you can spend your time on sales and customers." },
      { title: "Scalable teams", description: "We adjust our team size to the project: one developer or a full team, big or small." },
      { title: "Faster time-to-market", description: "Quick workflows and efficient development, so your store goes live sooner and you start selling faster." },
      { title: "Quality assurance and IP protection", description: "We test continuously, and we protect your ideas with strict confidentiality rules." },
    ],
  },
  industries: {
    heading: "Shopify For\nEvery Industry",
    intro: "Shopify Development Services extend across many industries, each with its own needs.",
    items: [
      { name: "Diamond and jewellery", description: "Tools to track inventory and sales on Shopify, in a secure and simple store for valuable items." },
      { name: "Retail and e-commerce", description: "Shopify stores that make shopping fun and easy, with carts and payments that work without fuss." },
      { name: "Logistics and transportation", description: "Shopify software to track deliveries and make your team more efficient." },
      { name: "Insurance", description: "Shopify systems to handle policies and claims smoothly and safely." },
      { name: "Healthcare", description: "Shopify platforms for patient care and billing that are easy and helpful." },
      { name: "Education", description: "E-learning tools and student systems on Shopify for schools and teachers." },
      { name: "Manufacturing", description: "ERP and supply chain solutions on Shopify to keep operations running well." },
      { name: "Real estate", description: "Shopify property and CRM software to manage listings and clients easily." },
      { name: "Hospitality", description: "Booking and guest management systems for hotels and restaurants." },
      { name: "Finance and banking", description: "Secure tools for banking and transactions that you can trust." },
      { name: "Non-profit", description: "Platforms for fundraising and showing your impact to the world." },
    ],
  },
  related: related("shopapp", "web", "woo"),
  faq: [
    { question: "What Shopify services does We3vision offer?", answer: "We3vision offers custom store design and development, theme customisation, app integration, custom app development, platform migration, ongoing support and maintenance, and performance optimisation." },
    { question: "Can We3vision move my store to Shopify from another platform?", answer: "Yes. Platform migration moves your products, customers and data to Shopify safely." },
    { question: "Does We3vision build custom Shopify apps?", answer: "Yes. We3vision builds special Shopify apps for what regular apps cannot do, and also adds payment tools, marketing helpers and analytics trackers to your store and makes them work smoothly." },
    { question: "Why work with We3vision for Shopify?", answer: "We3vision is an India-based agency that builds Shopify stores for businesses of all sizes, from startups to larger companies, at fair costs. The team works across time zones, so your project can keep moving forward." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Is We3vision a Shopify development company in India?", answer: "Yes. We3vision Private Limited, founded in 2019, is a Shopify development company in Surat, Gujarat, India, offering store design, theme customisation, apps and migration." },
  ],
  cta: { heading: "Ready To Launch\nYour Shopify Store?", text: "Tell us what you want to sell. We work from Surat, India with Shopify clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom WooCommerce (/custom-woocommerce-development)
// ---------------------------------------------------------------------------------------------------------------------
export const WOOCOMMERCE_SEO = {
  title: "WooCommerce Development Company in Surat, India | We3vision",
  description: "Custom WooCommerce development services from We3vision in Surat, Gujarat, India, for clients in the USA, UK, Canada and Australia. Get a free quote.",
};
export const WOOCOMMERCE_SECTIONS = build({
  seo: WOOCOMMERCE_SEO,
  hero: {
    chip: "WooCommerce",
    heading: "Custom WooCommerce\nDevelopment Services",
    text: "WooCommerce development from Surat, Gujarat, India for stores in India, the USA, UK, Canada and Australia: flexible, SEO-friendly and secure.",
  },
  story:
    "*WooCommerce* is an open-source e-commerce platform for WordPress, which gives you *flexibility to customise your store* exactly the way you want, and a wide choice of *extensions for payments, shipping and more*.\n\nAs a custom WooCommerce development company, we build, migrate, integrate and look after WooCommerce stores, and we make them *fast, secure and easy for you to manage*.",
  services: {
    heading: "Our Complete Range Of\nWooCommerce Services",
    intro: "From building a new store to keeping it fast and up to date.",
    cards: [
      { title: "WooCommerce store\ndevelopment", description: "A high-performance WooCommerce store, aligned with your business goals." },
      { title: "Store design\n& development", description: "Visually captivating, responsive WooCommerce stores that attract visitors and turn them into loyal customers." },
      { title: "Theme development\n& customisation", description: "Custom theme design and development so your store mirrors your brand identity." },
      { title: "Plugin\ndevelopment", description: "Custom plugins that enhance your store's functionality and automate tasks." },
      { title: "WooCommerce\nintegration", description: "We help you select and integrate the right plugins to extend what your store can do." },
      { title: "WooCommerce API\ndevelopment", description: "Third-party services connected and workflows automated with custom API development." },
      { title: "WooCommerce\nmigration", description: "A well-planned migration from your existing platform with smooth data transfer and platform compatibility." },
      { title: "PSD to\nWooCommerce", description: "Your design files converted into a working WooCommerce store." },
      { title: "WordPress speed\noptimisation", description: "Strategies to speed up your website and improve the experience of your visitors." },
      { title: "WordPress SEO\noptimisation", description: "SEO best practices to improve your site's visibility and bring organic traffic to your store." },
      { title: "Buyer journey\nmapping", description: "We work with you to understand your audience and develop buyer journeys that guide them to purchase." },
      { title: "Maintenance &\nsupport", description: "A dedicated support team keeps your store up to date, secure and running smoothly." },
    ],
  },
  process: {
    heading: "The Process That\nSets Us Apart",
    intro: "A clear path from your first idea to a store that keeps improving.",
    items: [
      { title: "Initial consultation and requirements", text: "We start with a comprehensive consultation to understand your business objectives and specific needs.", points: "Business goals\nSpecific requirements" },
      { title: "Design and wireframing", text: "Based on what we learn, our team drafts a detailed wireframe of your online store, aligned with your goals.", points: "Wireframes\nLooks and layouts" },
      { title: "Development and execution", text: "Once the wireframe is approved, we build: the design turns into a working store.", points: "Store and theme\nPlugins and integrations" },
      { title: "Quality assurance and performance testing", text: "Your store is tested for quality and for performance before it goes live.", points: "Testing\nSpeed checks" },
      { title: "Launch", text: "We make sure the move to launch is smooth and everything is ready for production use.", points: "Go-live\nHand-over" },
      { title: "Ongoing support and optimisation", text: "We keep track of the performance of your store and make improvements and optimisations proactively.", points: "Monitoring\nImprovements" },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "WordPress\nWooCommerce\nHTML5\nCSS3\nReact.js\nBootstrap\nVue.js" },
  why: {
    heading: "Why Choose\nWooCommerce",
    items: [
      { title: "Open-source platform", description: "WooCommerce is open source, which gives you a lot of room to customise your store." },
      { title: "Easy to set up", description: "It is easy to set up, a fit for both experienced developers and beginners." },
      { title: "Payments & shipping options", description: "Offer a wide variety of payment methods and shipping services tailored to your business." },
      { title: "Order management on the go", description: "Order management is simple for store administrators." },
      { title: "Sell anything", description: "Sell products, subscriptions, memberships, appointments and more." },
      { title: "SEO optimised", description: "Built with strong SEO features to attract more organic traffic." },
      { title: "Secure transactions", description: "Secure payment options that protect sensitive customer information." },
      { title: "Mobile optimisation", description: "A smooth shopping experience across all devices." },
    ],
  },
  related: related("wordpress", "plugin", "shopify"),
  faq: [
    { question: "What does WooCommerce development at We3vision include?", answer: "It includes store development and design, theme development and customisation, plugin development, plugin integration, WooCommerce API development, migration, PSD to WooCommerce, WordPress speed and SEO optimisation, buyer journey mapping, and maintenance and support." },
    { question: "Can We3vision migrate my online store to WooCommerce?", answer: "Yes. We plan the migration from your existing platform carefully, with smooth data transfer and platform compatibility." },
    { question: "Why choose WooCommerce for an online store?", answer: "WooCommerce is open source and easy to set up. It supports many payment methods and shipping services, lets you sell products, subscriptions, memberships and appointments, and has strong SEO features and secure payment options." },
    { question: "How does We3vision build a WooCommerce store?", answer: "We start with a consultation on your business goals and requirements, then design wireframes, develop the store, test its quality and performance, launch it, and keep improving it with ongoing support and optimisation." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Is We3vision a WooCommerce development company in India?", answer: "Yes. We3vision Private Limited, founded in 2019, is a custom WooCommerce development company in Surat, Gujarat, India, building and supporting online stores on WordPress." },
  ],
  cta: { heading: "Ready To Open\nYour Online Store?", text: "Tell us about your products and customers. From Surat, India we plan WooCommerce stores for clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Shopify apps (/shopify-app-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFYAPP_SEO = {
  title: "Shopify App Development Company in Surat, India | We3vision",
  description: "Shopify app development services from We3vision in Surat, Gujarat, India, for clients in the USA, UK, Canada and Australia. Get a free quote today.",
};
export const SHOPIFYAPP_SECTIONS = build({
  seo: SHOPIFYAPP_SEO,
  hero: {
    chip: "Shopify Apps",
    heading: "Shopify App\nDevelopment Services",
    text: "Shopify app development from Surat, Gujarat, India for stores in India, the USA, UK, Canada and Australia. We build custom apps around your business.",
  },
  story:
    "*Shopify* is a powerful and flexible platform, and the right app can add exactly the feature your store is missing. As a Shopify app development company, we specialise in *custom apps tailored to your business needs*: for your own store, or for the *Shopify App Store*.\n\nWe work from Surat, India with a team that keeps your project moving, fits its size to your needs and builds at *cost-effective rates*.",
  services: {
    heading: "Shopify App\nDevelopment Services",
    intro: "Apps for your own store, apps for the Shopify App Store, and everything that keeps them running.",
    cards: [
      { title: "Custom app\ndevelopment", description: "Custom apps tailored to your business needs, built to solve your exact problem." },
      { title: "Feature\nenhancements", description: "New features added to the apps and the store you already have." },
      { title: "Third-party\nintegration", description: "Easy integration with the business tools you rely on, so operations run smoothly." },
      { title: "Private app\ndevelopment", description: "For businesses that need an exclusive solution: private apps for the Shopify admin." },
      { title: "Public app\ndevelopment", description: "Public apps for the Shopify App Store, to expand your business reach." },
      { title: "Maintenance\nand updates", description: "Keeping apps running smoothly takes continuous support and updates." },
      { title: "Optimisation", description: "Customising your plugins and apps to improve their functionality and the shopping experience." },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "Shopify\nLiquid\nHTML5\nCSS3\nJavaScript\nReact.js\nNode.js" },
  why: {
    heading: "Why Choose We3vision\nFor Shopify Apps",
    items: [
      { title: "Round-the-clock productivity", description: "Time-zone advantages enable continuous development, keeping your project on schedule." },
      { title: "Focus on your business", description: "Outsource the app development and focus on core activities like sales and marketing." },
      { title: "Scalable teams", description: "Whether you need minor tweaks or full-scale development, our team structure fits your needs." },
      { title: "Budget-friendly solutions", description: "Streamlined processes to create high-quality apps at cost-effective rates." },
      { title: "Creative features", description: "A diverse team that brings unique and creative features into your Shopify apps." },
      { title: "Rapid deployment", description: "Efficient workflows so custom apps launch quickly, without unnecessary delays." },
      { title: "Quality guaranteed", description: "Rigorous testing so your Shopify apps are error-free and high-performing." },
      { title: "Secure IP protection", description: "Strict confidentiality agreements keep your intellectual property protected." },
    ],
  },
  industries: {
    heading: "Shopify Apps For\nEvery Industry",
    intro: "Here is what a custom Shopify app can do in some industries.",
    items: [
      { name: "Retail and e-commerce", description: "Tools for order management, payment processing and inventory control." },
      { name: "Logistics and transportation", description: "Route optimisation, shipment tracking and fleet management." },
      { name: "Healthcare", description: "Patient scheduling, telemedicine integrations and billing management." },
      { name: "Education", description: "E-learning platforms, student portals and virtual classroom apps." },
      { name: "Manufacturing", description: "ERP integrations, production monitoring and supply chain management apps." },
      { name: "Real estate", description: "Property listing apps, virtual tour tools and CRM systems." },
      { name: "Finance and banking", description: "Secure transaction apps, fraud detection tools and digital banking solutions." },
      { name: "Energy and utilities", description: "Resource monitoring, billing automation and maintenance scheduling apps." },
      { name: "Agriculture", description: "Farm management, crop monitoring and supply chain apps." },
    ],
  },
  related: related("shopify", "web", "plugin"),
  faq: [
    { question: "What kinds of Shopify apps does We3vision build?", answer: "We3vision builds custom apps around your business, private apps for the Shopify admin when you need an exclusive solution, and public apps for the Shopify App Store to expand your reach. It also adds third-party integrations and new features to apps you already have." },
    { question: "Can We3vision add features to my existing Shopify store or app?", answer: "Yes. Feature enhancements add new features to the apps and the store you already have." },
    { question: "Does We3vision maintain Shopify apps after launch?", answer: "Yes. Maintenance and updates give your apps continuous support so they keep running smoothly, and optimisation improves their functionality and the shopping experience." },
    { question: "Why choose We3vision for Shopify app development?", answer: "The team's time-zone advantage allows continuous development, the team size fits the job from minor tweaks to full-scale development, rates are budget-friendly, apps are tested rigorously, and confidentiality agreements protect your intellectual property." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Is We3vision a Shopify app development company in India?", answer: "Yes. We3vision Private Limited, founded in 2019, is a Shopify app development company in Surat, Gujarat, India, building private and public Shopify apps." },
  ],
  cta: { heading: "Ready To Build\nYour Shopify App?", text: "Tell us what your store needs. From Surat, India we build apps for clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// WordPress plugins (/wordpress-plugin-development-company)
// ---------------------------------------------------------------------------------------------------------------------
export const PLUGIN_SEO = {
  title: "WordPress Plugin Development Company, Surat | We3vision",
  description: "WordPress plugin development services from We3vision in Surat, Gujarat, India, for clients in the USA, UK, Canada and Australia. Get a free quote.",
};
export const PLUGIN_SECTIONS = build({
  seo: PLUGIN_SEO,
  hero: {
    chip: "WordPress Plugins",
    heading: "WordPress Plugin\nDevelopment Services",
    text: "Custom WordPress plugin development from Surat, Gujarat, India for businesses in India, the USA, UK, Canada and Australia. Plugins that extend what your site can do.",
  },
  story:
    "As a WordPress plugin development company, our plugins *extend the capabilities of your WordPress site*, with features like e-commerce, SEO and integrations. Every business is unique, and so are our plugins: we build them *from the ground up around your requirements*.\n\nWe write plugins that are *free of bugs, perform well under heavy traffic and follow WordPress coding standards*, and we keep looking after them when they are live.",
  services: {
    heading: "Our WordPress Plugin\nDevelopment Services",
    intro: "From a new plugin to the care of the ones you already use.",
    cards: [
      { title: "Custom plugin\ndevelopment", description: "Bespoke WordPress plugins built from the ground up and aligned with your unique requirements." },
      { title: "Plugin\ncustomisation", description: "Existing plugins adapted so they fit the way your business works." },
      { title: "Plugin\nintegration", description: "Third-party services made to work flawlessly with your WordPress site." },
      { title: "Plugin\nupgradation", description: "Stay ahead of the curve with plugin upgrade services." },
      { title: "Plugin\nmaintenance", description: "Comprehensive maintenance to keep your plugins running smoothly over time." },
      { title: "Extensions\n& add-ons", description: "Tailored extensions and add-ons to expand the capabilities of the plugins you already have." },
    ],
  },
  process: {
    heading: "How We Build\nYour Plugin",
    intro: "Four clear steps from the first conversation to the hand-over.",
    items: [
      { title: "Define", text: "We begin by getting to know your business, your goals and your unique requirements.", points: "Goals\nRequirements" },
      { title: "Design", text: "Once the plan is defined, our design team gets to work on how the plugin looks and behaves.", points: "Screens and settings\nUser flow" },
      { title: "Develop", text: "This is where the magic happens: the plugin is built, with clean code that follows WordPress standards.", points: "Clean code\nWordPress standards" },
      { title: "Deliver", text: "Before we hand over the final product, we rigorously test it to make sure everything works perfectly.", points: "Testing\nHand-over and support" },
    ],
  },
  tools: { heading: "Our CMS Tech Stack", items: "WordPress\nHTML5\nCSS3\nReact.js\nBootstrap\nVue.js" },
  why: {
    heading: "Why Choose We3vision For\nWordPress Plugins",
    items: [
      { title: "Developers who know WordPress", description: "When it comes to building or customising plugins, experience matters. Every plugin is built around your needs." },
      { title: "Plugins you can rely on", description: "Free of bugs, performing well under heavy traffic and meeting WordPress coding standards." },
      { title: "Integration with third-party tools", description: "Payment gateways, CRM systems or analytics platforms connected properly to your site." },
      { title: "Timely delivery", description: "Work delivered on time, so your project does not stall." },
      { title: "Ongoing support and maintenance", description: "Our relationship with you does not end once the plugin is delivered." },
      { title: "Fit for small budgets too", description: "We understand that small businesses and startups often have limited budgets." },
    ],
    intro: "Examples of what we can build: e-commerce enhancements such as advanced filters, shipping calculators or custom payment options, and SEO plugins to optimise metadata and analyse keywords.",
  },
  related: related("wordpress", "woo", "headless"),
  faq: [
    { question: "Does We3vision build custom WordPress plugins?", answer: "Yes. We3vision builds bespoke plugins from the ground up around your requirements, such as e-commerce enhancements and SEO plugins, and connects payment gateways, CRM systems or analytics platforms to your site." },
    { question: "Can We3vision customise or upgrade a plugin I already use?", answer: "Yes. We adapt existing plugins to the way your business works, provide plugin upgrade services, and build extensions and add-ons for the plugins you already have." },
    { question: "Does We3vision maintain plugins after delivery?", answer: "Yes. Maintenance keeps your plugins running smoothly over time, and our support continues after the plugin is delivered." },
    { question: "How does We3vision build a WordPress plugin?", answer: "In four steps: define your business, goals and requirements, design how the plugin looks and behaves, develop it with clean code that follows WordPress standards, and deliver it after rigorous testing, with hand-over and support." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Is We3vision a WordPress plugin development company in India?", answer: "Yes. We3vision Private Limited, founded in 2019, is a WordPress plugin development company in Surat, Gujarat, India, building custom plugins to WordPress standards." },
  ],
  cta: { heading: "Ready For A\nCustom Plugin?", text: "Describe the feature you are missing. From Surat, India we build plugins for clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});
