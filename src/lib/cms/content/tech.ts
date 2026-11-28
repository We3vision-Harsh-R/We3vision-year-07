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
  description: "Headless CMS development company in Surat, India. Strapi, Contentful and Sanity with React or Vue front ends for clients in USA, UK, Canada, Australia.",
};
export const HEADLESS_SECTIONS = build({
  seo: HEADLESS_SEO,
  hero: {
    chip: "Headless CMS",
    heading: "Headless CMS\nDevelopment Services",
    text: "We3vision is a headless CMS development company in Surat, Gujarat, India, serving clients in India, the USA, UK, Canada and Australia. Manage content once and deliver it to websites and apps through fast APIs.",
  },
  story:
    "A *headless CMS development company* builds your content system, your API and your website as separate parts, so each can change without breaking the others. Content lives in one place and travels through *REST or GraphQL APIs*, so the same text, images and videos feed a *website, a mobile app and any other channel* without being written twice.\n\nFrom Surat, Gujarat, India, We3vision works with *Contentful, Strapi and Sanity*, builds *React or Vue front ends*, and moves you over from WordPress or Drupal with as little downtime as possible. Clients in the USA, UK, Canada and Australia work with us remotely, with a clear plan agreed up front.",
  services: {
    heading: "Headless CMS\nServices We Provide",
    intro: "From the first plan to the support after launch, everything you need to run content on a headless platform, in India or abroad.",
    cards: [
      { title: "Custom headless CMS\ndevelopment", description: "A headless content system built on Contentful, Strapi or Sanity, with content types and editing screens shaped around your business." },
      { title: "Headless CMS\nmigration", description: "We move your content from WordPress, Drupal or another traditional CMS to a headless one, with a backup first, less downtime and a safe, smooth move." },
      { title: "API integration\n& development", description: "REST or GraphQL APIs that connect your headless CMS with your CRM, store, analytics and other tools, for more control and flexibility." },
      { title: "Open-source\nheadless CMS", description: "Trusted open-source platforms such as Strapi: flexible, easy to update and without a locked-in vendor." },
      { title: "Front-end development\nfor headless CMS", description: "Fast, modern websites built with React or Vue that work well with headless CMS platforms and are kept search-friendly." },
      { title: "Digital strategy", description: "We help plan your digital journey, choosing the CMS tools, content structure and channels that support your business goals." },
      { title: "Testing\nand QA", description: "We test content, APIs and pages on many devices, so your CMS works smoothly, stays free of bugs and gives your users a good experience." },
      { title: "Omnichannel content\ndistribution", description: "Your CMS set up to send the same content to websites, apps and other platforms quickly, without copying it by hand." },
      { title: "Support\n& maintenance", description: "Regular updates, security checks, bug fixes and help after your CMS is live, so it keeps running well and stays ready for the future." },
    ],
  },
  process: {
    heading: "Our Headless CMS\nDevelopment Life Cycle",
    intro: "A clear, simple process for a professional headless CMS, with the plan agreed up front.",
    items: [
      { title: "Scope identification", text: "We first understand your needs, content and channels.", points: "Business goals and users\nHow the CMS will be used" },
      { title: "Strategic planning", text: "We plan every step based on your business goals and share a written plan.", points: "Choice of CMS and structure\nPlan and timeline" },
      { title: "UI/UX design", text: "Our design team turns your ideas into simple, clear layouts, and into editing screens your team finds easy to use.", points: "Clear editing screens\nLayouts for every device" },
      { title: "Development", text: "We build strong and secure features, the content API and the front end, that improve how your website works and help grow your business.", points: "Clean code, modern tools\nSecure and scalable" },
      { title: "Rigorous testing", text: "We test everything carefully, including APIs and page speed, to make sure there are no bugs.", points: "Many devices and browsers" },
      { title: "Smooth deployment", text: "We launch the final product smoothly, with less downtime, and stay available so your users get a good experience from day one.", points: "Live launch\nSupport afterwards" },
    ],
  },
  tools: { heading: "Our CMS\nTech Stack", items: "HTML5\nCSS3\nReact.js\nVue.js\nBootstrap\nContentful\nStrapi\nSanity\nREST APIs\nGraphQL" },
  why: {
    heading: "Benefits Of A\nHeadless CMS",
    items: [
      { title: "Omnichannel content delivery", description: "Share the same content on websites, apps, social media and more, all from one place, saving time and repeated effort." },
      { title: "Faster performance", description: "Because the front and back ends are separate, we can use fast tools like React or Vue to build quicker, smoother, search-friendly websites." },
      { title: "Developer flexibility", description: "Developers can use the tools and languages they like, such as React or Vue, for more freedom and cleaner code." },
      { title: "Future-proof architecture", description: "You can update your front end or move to a new platform without starting from scratch or moving your content again." },
      { title: "Faster time-to-market", description: "Content and design work separately, so your team can publish images, blogs or videos quickly without waiting for a developer." },
      { title: "Easy integration", description: "Connect your CMS with CRMs, e-commerce tools, analytics or any software through APIs, so data flows both ways." },
    ],
  },
  industries: {
    heading: "Headless CMS\nFor Every Industry",
    intro: "Content-rich businesses of every kind can benefit. Here is what a headless CMS can look like in some of them, in India and abroad.",
    items: [
      { name: "E-commerce websites", description: "A headless CMS can power more than a website: it can drive your whole online store, product pages and campaigns." },
      { name: "Healthcare", description: "Headless CMS solutions that meet strict privacy and security standards, with clear patient information." },
      { name: "Education and e-learning", description: "Managing course content, student data and interactive learning material for web and app." },
      { name: "Hospitality and travel", description: "Headless CMS platforms for hotels, tours and travel services, with one source for listings." },
      { name: "Software as a service (SaaS)", description: "Fast, scalable and user-friendly content systems for SaaS products, docs and marketing pages." },
      { name: "Finance", description: "Security comes first: content platforms built with strong protection of data and careful access rules." },
      { name: "Media and entertainment", description: "Fast, content-rich platforms that keep your audience engaged and publish to every channel." },
      { name: "Non-profits", description: "Managing donations, volunteers and events in one place." },
      { name: "Real estate", description: "Platforms where users find properties easily with search filters, maps and listings kept up to date." },
    ],
  },
  faq: [
    { question: "What is a headless CMS and how does it work?", answer: "A headless CMS is a content system that stores your text, images and videos but does not decide how they look. It sends that content through REST or GraphQL APIs to your website, app or any other channel, so you write it once and reuse it everywhere." },
    { question: "What is the difference between a headless and a traditional CMS?", answer: "A traditional CMS such as WordPress ties content and design together, while a headless CMS keeps them apart and connects them through an API. This gives you a faster, more flexible front end and one content source for many channels, though the setup needs more developer work at the start." },
    { question: "Which headless CMS should I choose?", answer: "It depends on your content, your team and your budget. Strapi is open-source and flexible, while Contentful and Sanity are hosted platforms, and we compare them with you before we recommend one." },
    { question: "Can I move my existing WordPress or Drupal site to a headless CMS?", answer: "Yes, we migrate content from WordPress, Drupal and other traditional systems to a headless CMS. We take a backup first, move your content and links, and check every page so the change is smooth and downtime stays low." },
    { question: "Is a headless website good for SEO and speed?", answer: "Yes, it can be, because a React or Vue front end loads quickly and gives us full control over titles, headings, links and page structure. We build with search in mind, but good rankings still depend on your content and your competition." },
    { question: "Is a headless CMS secure for my business?", answer: "Yes, when it is set up properly, and it can reduce risk because the public website is separate from the admin system. We use safe API access, role-based editing, backups and regular updates to protect your data." },
    { question: "Can my team still edit content easily without a developer?", answer: "Yes. A headless CMS gives editors a simple admin panel to create, schedule and update content without coding. We design the editing screens around how your team works, so they are not left waiting for a developer." },
    { question: "How much does headless CMS development cost and how long does it take?", answer: "Cost and time depend on your content types, channels, integrations and the CMS you choose, so we give a written quote and a clear timeline only after we understand your scope. A simple setup is quicker, and a larger platform with migration and many integrations takes longer." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, and we have also worked with clients from Germany, the UAE and Singapore. We agree the plan, scope and communication up front, so a remote project stays clear and easy to follow." },
    { question: "Can I hire headless CMS developers from India through We3vision?", answer: "Yes. We3vision Private Limited, founded in 2019 in Surat, Gujarat, India, builds the CMS, the API and the front end for headless projects. We also have a second office in Marburg, Germany, and you can contact us about your project." },
  ],
  related: related("web", "wordpress", "plugin"),
  cta: { heading: "Ready To Go\nHeadless?", text: "Share your content and channels. From Surat, India we plan the right headless CMS and agree the plan with you up front, for clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
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
  description: "Shopify development company in Surat, India: custom themes, migration and store setup. Hire Shopify developers for USA, UK, Canada, Australia.",
};
export const SHOPIFY_SECTIONS = build({
  seo: SHOPIFY_SEO,
  hero: {
    chip: "Shopify",
    heading: "Shopify\nDevelopment Services",
    text: "Shopify development company in Surat, India: custom Shopify stores and themes, built on a clear plan so projects do not stall, for brands in India, the USA, UK, Canada and Australia.",
  },
  story:
    "As a Shopify development company in Surat, India, we build *custom Shopify stores* that fit your brand and goals, from colours to layouts, for clients in India, the USA, UK, Canada and Australia.\n\nFrom *custom Shopify theme development and app integration* to *custom apps, Shopify migration and ongoing support*, we handle the technical work, so you can focus on *selling and growing*.\n\nYou can hire Shopify developers from India per project or as a team, with a plan agreed up front and clear updates for clients working with us remotely.",
  services: {
    heading: "Shopify\nDevelopment Services",
    intro: "Shopify development services for every stage, from first design to support after launch.",
    cards: [
      { title: "Custom store design\nand development", description: "Unique Shopify stores that fit your brand and goals, designed in every detail to look great and work well, from first page to checkout." },
      { title: "Theme\ncustomisation", description: "We take a theme and tweak it to fit your style, simple to use on phones, tablets and computers, or build a custom Shopify theme." },
      { title: "App\nintegration", description: "Payment tools, marketing helpers or analytics trackers added to your store and made to work smoothly, including shipping and tax tools." },
      { title: "Custom app\ndevelopment", description: "Special Shopify apps built just for your business, for what regular apps cannot do, such as links to your own systems." },
      { title: "Platform\nmigration", description: "Switching to Shopify from another platform: your products, customers and data move over safely, with links and key pages checked." },
      { title: "Ongoing support\nand maintenance", description: "Updates and fixes whenever you need them, new features and a store that stays up to date after launch." },
      { title: "Performance\noptimisation", description: "A Shopify store that loads faster and feels smoother, by tuning images, apps and code, which also helps search visibility." },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "Shopify\nLiquid\nHTML5\nCSS3\nJavaScript\nReact.js\nNode.js" },
  why: {
    heading: "Why Partner With\nWe3vision For Shopify",
    items: [
      { title: "Experienced team", description: "A team that builds Shopify stores for businesses of all sizes, from startups to larger companies, with scalability in mind, since 2019." },
      { title: "Steady project momentum", description: "Steady progress so your project does not stall, with timely updates, bug fixes and improvements, and a plan agreed up front." },
      { title: "Cost-effective", description: "As an India-based agency we offer high-quality Shopify design and development at fair costs for clients worldwide." },
      { title: "Clear remote communication", description: "Clear updates and a plan agreed up front, so clients in the USA, UK, Canada and Australia know where the project stands." },
      { title: "Focus on your core business", description: "Let us handle design, development and updates, so you can spend your time on sales and customers." },
      { title: "Scalable teams", description: "We adjust our team size to the project: one developer or a full team, big or small." },
      { title: "Faster time-to-market", description: "Quick workflows and efficient development, so your store goes live sooner and you start selling faster." },
      { title: "Quality assurance and IP protection", description: "We test continuously, and we protect your ideas with strict confidentiality rules." },
    ],
  },
  industries: {
    heading: "Shopify For\nEvery Industry",
    intro: "Shopify store development for many industries, each with its own needs and customers.",
    items: [
      { name: "Diamond and jewellery", description: "Tools to track inventory and sales on Shopify, in a secure and simple store for valuable items, ready for buyers abroad." },
      { name: "Retail and e-commerce", description: "Shopify stores that make shopping fun and easy, with carts and payments that work without fuss for buyers in India and abroad." },
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
    { question: "What Shopify development services does We3vision offer?", answer: "We3vision offers custom store design and development, theme customisation, app integration, custom app development, migration to Shopify, ongoing support and performance optimisation. You can take one service or the full set, depending on where your store is today." },
    { question: "Can you migrate my store to Shopify from another platform?", answer: "Yes, Shopify migration is one of our services. We move your products, customers and data from your current platform, then check links, key pages and checkout so nothing important is lost." },
    { question: "Should I choose a custom Shopify theme or a ready theme?", answer: "A ready theme suits a simple store, and a custom Shopify theme suits a brand that needs its own look or features. We can customise a ready theme or build a custom one, and we help you pick the one that fits your goals." },
    { question: "Shopify or WooCommerce: which is better for my store?", answer: "Shopify is simpler to run, while WooCommerce on WordPress gives more control over code and hosting. We3vision builds both, so we can suggest the one that fits your products, team and plans for growth." },
    { question: "Do you build custom Shopify apps and integrations?", answer: "Yes. We build custom Shopify apps for what regular apps cannot do, and we connect payment tools, marketing helpers, analytics and your own systems so they work smoothly together." },
    { question: "Can you set up payments and shipping for customers in different countries?", answer: "Yes. We set up payment options, shipping and tax settings for the countries you sell to, such as India, the USA, UK, Canada and Australia. The exact options depend on Shopify and your business setup, and we confirm them before building." },
    { question: "Will my Shopify store be fast and good for SEO?", answer: "Yes, we build for both from the start. We use clean Liquid code, light themes, tuned images and apps, and clear titles and page structure so search engines can read the store. Rankings depend on many things, so we do not promise a position." },
    { question: "How much does Shopify development cost and how long does it take?", answer: "Cost and time depend on the design, features, apps and number of products, so we agree both in a plan before work starts. Tell us what you want to sell and we will give a clear quote." },
    { question: "Do you work with Shopify clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with Shopify clients in the USA, UK, Canada and Australia, with clear communication and a plan agreed up front. We have also worked with clients from Germany, the UAE and Singapore." },
    { question: "Why choose a Shopify development company in Surat, India?", answer: "We3vision Private Limited, founded in 2019, is a Shopify development company in Surat, Gujarat, India, and you can hire Shopify developers from India per project or as a team. You get design, theme and app work, migration and support from one team, with fair costs." },
  ],
  cta: { heading: "Ready To Launch\nYour Shopify Store?", text: "Tell us what you want to sell and who buys it. From Surat, India we build Shopify stores for clients in India, the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom WooCommerce (/custom-woocommerce-development)
// ---------------------------------------------------------------------------------------------------------------------
export const WOOCOMMERCE_SEO = {
  title: "Custom WooCommerce Development Company, Surat | We3vision",
  description: "Custom WooCommerce development company in Surat, India. Store development, payment gateways and migration for USA, UK, Canada and Australia clients.",
};
export const WOOCOMMERCE_SECTIONS = build({
  seo: WOOCOMMERCE_SEO,
  hero: {
    chip: "WooCommerce",
    heading: "Custom WooCommerce\nDevelopment Services",
    text: "Hire WooCommerce developers from India: custom stores for India, the USA, UK, Canada and Australia, built from Surat, Gujarat to be fast, secure and SEO-friendly.",
  },
  story:
    "As a custom WooCommerce development company in Surat, India, we build *flexible stores on WordPress*, an open-source platform with a wide choice of *extensions for payments, shipping and more*.\n\nWe build, migrate, integrate and look after WooCommerce stores, from payment gateway integration to plugin customisation, and make them *fast, secure and easy for you to manage*.\n\nOur WooCommerce developers work from Surat with clients across India, the USA, UK, Canada and Australia, with a plan agreed up front.",
  services: {
    heading: "Our Complete Range Of\nWooCommerce Services",
    intro: "From a new WooCommerce store to keeping it fast, secure and up to date.",
    cards: [
      { title: "WooCommerce store\ndevelopment", description: "A high-performance WooCommerce store, aligned with your business goals and ready to grow." },
      { title: "Store design\n& development", description: "Visually captivating, responsive WooCommerce stores that attract visitors and turn them into loyal customers, on desktop and mobile." },
      { title: "Theme development\n& customisation", description: "Custom theme design and development so your store mirrors your brand, with clean, light code." },
      { title: "Plugin\ndevelopment", description: "Custom plugins and WooCommerce plugin customisation that add features and automate tasks." },
      { title: "WooCommerce\nintegration", description: "We help you choose and integrate the right plugins, including WooCommerce payment gateway integration for your market." },
      { title: "WooCommerce API\ndevelopment", description: "Third-party services such as CRM, ERP or shipping connected, and workflows automated with custom API development." },
      { title: "WooCommerce\nmigration", description: "A well-planned WooCommerce migration from your existing platform, with smooth data transfer so products, customers and orders move across safely." },
      { title: "PSD to\nWooCommerce", description: "Your PSD, Figma or XD design files converted into a working WooCommerce store." },
      { title: "WordPress speed\noptimisation", description: "Strategies to speed up your store and improve the experience of your visitors, from images to caching." },
      { title: "WordPress SEO\noptimisation", description: "SEO best practices to improve your store's visibility, from product pages to site structure, and bring organic traffic." },
      { title: "Buyer journey\nmapping", description: "We work with you to understand your audience and develop buyer journeys and checkout paths that guide them to purchase." },
      { title: "Maintenance &\nsupport", description: "A dedicated support team keeps your store updated, secure and running smoothly, with ongoing WooCommerce maintenance." },
    ],
  },
  process: {
    heading: "The Process That\nSets Us Apart",
    intro: "A clear path from your first idea to a store that keeps improving, agreed up front.",
    items: [
      { title: "Initial consultation and requirements", text: "We start with a consultation to understand your business goals, products, payment and shipping needs, and the markets you sell to.", points: "Business goals\nSpecific requirements" },
      { title: "Design and wireframing", text: "Based on what we learn, our team drafts a detailed wireframe of your store, aligned with your goals, for you to approve.", points: "Wireframes\nLooks and layouts" },
      { title: "Development and execution", text: "Once the wireframe is approved, we build: the design turns into a working store with its plugins and integrations.", points: "Store and theme\nPlugins and integrations" },
      { title: "Quality assurance and performance testing", text: "Your store is tested for quality, checkout, payments and performance before it goes live.", points: "Testing\nSpeed checks" },
      { title: "Launch", text: "We make sure the move to launch is smooth, with everything ready for production use and handed over to you.", points: "Go-live\nHand-over" },
      { title: "Ongoing support and optimisation", text: "We keep track of the performance of your store and make improvements, updates and optimisations proactively.", points: "Monitoring\nImprovements" },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "WordPress\nWooCommerce\nHTML5\nCSS3\nReact.js\nBootstrap\nVue.js" },
  why: {
    heading: "Why Choose\nWooCommerce",
    items: [
      { title: "Open-source platform", description: "WooCommerce is open source on WordPress, which gives you a lot of room to customise your store." },
      { title: "Easy to set up", description: "It is easy to set up and manage, a fit for both experienced developers and beginners." },
      { title: "Payments & shipping options", description: "Many payment methods and shipping services, tailored to your business and to buyers in the USA, UK, Canada, Australia and India." },
      { title: "Order management on the go", description: "Simple order management for store administrators, on any device." },
      { title: "Sell anything", description: "Sell products, subscriptions, memberships, appointments and more from one store." },
      { title: "SEO optimised", description: "Built with strong SEO features, so product pages can attract more organic traffic." },
      { title: "Secure transactions", description: "Secure payment options and regular updates that help protect sensitive customer information." },
      { title: "Mobile optimisation", description: "A smooth shopping experience across all devices and screen sizes." },
    ],
  },
  related: related("wordpress", "plugin", "shopify"),
  faq: [
    { question: "What do WooCommerce development services include?", answer: "They cover store development and design, theme and plugin development, integrations and API work, migration, PSD to WooCommerce, speed and SEO optimisation, buyer journey mapping, and maintenance. You can hire us for the whole store or for one part of it." },
    { question: "Is We3vision a custom WooCommerce development company in India?", answer: "Yes. We3vision Private Limited, founded in 2019 and based in Surat, Gujarat, India, is a custom WooCommerce development company that builds and supports online stores on WordPress. Our team also has a second office in Marburg, Germany." },
    { question: "How much does a custom WooCommerce store cost?", answer: "The cost depends on the scope: design, number of products, integrations and custom features. We share a quote after we understand your requirements, so you know what you are paying for before work starts." },
    { question: "How long does WooCommerce store development take?", answer: "It depends on the size of the store and how many custom features it needs. After the consultation we agree a project plan with clear steps, so you know what happens and when." },
    { question: "Should I choose WooCommerce or Shopify?", answer: "WooCommerce suits you if you want full control and flexibility on WordPress, with open-source code you can customise. Shopify suits you if you prefer a hosted platform with less setup. We build on both and can help you decide from your products and plans." },
    { question: "Can you do WooCommerce payment gateway integration and shipping setup?", answer: "Yes. We connect payment gateways and shipping services that fit your market, whether you sell in India, the USA, UK, Canada or Australia. We test checkout and payments before launch." },
    { question: "Can you build custom WooCommerce plugins or customise existing ones?", answer: "Yes. We build custom plugins and customise existing ones for features like special pricing, product options, bookings or CRM and ERP connections. Everything is written to WordPress standards so it stays easy to update." },
    { question: "Can you handle WooCommerce migration from another platform?", answer: "Yes. We migrate stores from other platforms to WooCommerce, moving products, customers and orders with a plan made in advance. We check the data after the move before the store goes live." },
    { question: "How do you keep a WooCommerce store fast, secure and good for SEO?", answer: "We optimise images, caching and code for speed, keep WordPress, WooCommerce and plugins updated, and use secure payment options. We also set up clean product pages and site structure so search engines can read your store." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front. We have also worked with clients from Germany, UAE and Singapore." },
  ],
  cta: { heading: "Ready To Open\nYour Online Store?", text: "Tell us about your products and customers. From Surat, India we plan WooCommerce stores for clients in India, the USA, UK, Canada and Australia, with a plan agreed up front.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Shopify apps (/shopify-app-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFYAPP_SEO = {
  title: "Shopify App Development Company in Surat | We3vision",
  description: "Shopify app development company in Surat, India. Custom private and public Shopify apps, API integration and support for USA, UK, Canada, Australia.",
};
export const SHOPIFYAPP_SECTIONS = build({
  seo: SHOPIFYAPP_SEO,
  hero: {
    chip: "Shopify Apps",
    heading: "Shopify App\nDevelopment Services",
    text: "We3vision is a Shopify app development company in Surat, Gujarat, India. We build custom Shopify apps for merchants in India, the USA, UK, Canada and Australia.",
  },
  story:
    "As a *Shopify app development company* in Surat, India, we build *custom Shopify apps tailored to your business*, for your own store or for the *Shopify App Store*, and connect them through the Shopify API to the tools you already use. The right app adds exactly the feature your store is missing.\n\nWe work from Surat with clients in the USA, UK, Canada and Australia as well: clear communication, a plan agreed up front and support after launch.",
  services: {
    heading: "Shopify App\nDevelopment Services",
    intro: "Custom, private and public Shopify apps, Shopify API integration, and the maintenance that keeps them running.",
    cards: [
      { title: "Custom app\ndevelopment", description: "Custom Shopify app development for merchants, built around your business to solve your exact problem." },
      { title: "Feature\nenhancements", description: "New features added to the Shopify apps and the store you already have, without a rebuild." },
      { title: "Third-party\nintegration", description: "Shopify API integration with the business tools you rely on, so operations run smoothly." },
      { title: "Private app\ndevelopment", description: "Private Shopify apps for the admin, for businesses that need an exclusive solution of their own." },
      { title: "Public app\ndevelopment", description: "Public Shopify apps for the Shopify App Store, to expand your business reach to more merchants." },
      { title: "Maintenance\nand updates", description: "Shopify app maintenance: continuous support and updates keep your apps running smoothly." },
      { title: "Optimisation", description: "Tuning your apps and plugins to improve their functionality and the shopping experience for customers." },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "Shopify\nLiquid\nHTML5\nCSS3\nJavaScript\nReact.js\nNode.js" },
  why: {
    heading: "Why Choose We3vision\nFor Shopify Apps",
    items: [
      { title: "Clear remote working", description: "Clear communication and a plan agreed up front, so clients in the USA, UK, Canada and Australia always know the next step." },
      { title: "Focus on your business", description: "Hire Shopify app developers from India for the build, and keep your own time for sales and marketing." },
      { title: "Scalable teams", description: "Whether you need minor tweaks or full-scale development, our team structure fits your needs and grows with them." },
      { title: "Plan scoped to budget", description: "Streamlined processes and a scope agreed with you, so you get a quality app without surprises." },
      { title: "Creative features", description: "A diverse team that brings unique and creative features into your Shopify apps and the merchant experience." },
      { title: "Clear launch plan", description: "Efficient workflows so custom apps go live without unnecessary delays, with support once they are live." },
      { title: "Tested before launch", description: "Rigorous testing so your Shopify apps are error-free and high-performing when merchants start using them." },
      { title: "Secure IP protection", description: "Strict confidentiality agreements keep your intellectual property and your store data protected." },
    ],
  },
  industries: {
    heading: "Shopify Apps For\nEvery Industry",
    intro: "Here is what a custom Shopify app can do for merchants in some industries.",
    items: [
      { name: "Retail and e-commerce", description: "Tools for order management, payment processing and inventory control inside your store." },
      { name: "Logistics and transportation", description: "Route optimisation, shipment tracking and fleet management linked to your orders." },
      { name: "Healthcare", description: "Patient scheduling, telemedicine integrations and billing management for care providers." },
      { name: "Education", description: "E-learning platforms, student portals and virtual classroom apps for course sellers." },
      { name: "Manufacturing", description: "ERP integrations, production monitoring and supply chain management apps via the Shopify API." },
      { name: "Real estate", description: "Property listing apps, virtual tour tools and CRM systems for agents and developers." },
      { name: "Finance and banking", description: "Secure transaction apps, fraud detection tools and digital banking solutions with care for data." },
      { name: "Energy and utilities", description: "Resource monitoring, billing automation and maintenance scheduling apps for service firms." },
      { name: "Agriculture", description: "Farm management, crop monitoring and supply chain apps for growers selling online." },
    ],
  },
  related: related("shopify", "web", "plugin"),
  faq: [
    { question: "What is a Shopify app?", answer: "A Shopify app is software that adds a feature to a Shopify store that the platform does not offer by default. It can work inside the Shopify admin or in the storefront, and it connects to your store through the Shopify API. We3vision builds these apps around your business." },
    { question: "What kinds of Shopify apps does We3vision build?", answer: "We3vision builds custom apps around your business, private apps for the Shopify admin when you need an exclusive solution, and public apps for the Shopify App Store to expand your reach. It also adds third-party integrations and new features to apps you already have." },
    { question: "Custom Shopify app or an App Store app: which should I choose?", answer: "An App Store app suits a common need, and a custom Shopify app suits a feature that is specific to your business. If a ready-made app almost fits, tell us the gap and we can advise whether to extend it or build your own." },
    { question: "What is the difference between a private and a public Shopify app?", answer: "A private app is built for your own store or business, while a public app is built for the Shopify App Store so many merchants can use it. We3vision develops both, and we help you choose based on who the app is for." },
    { question: "Can you connect my Shopify store to other tools through the Shopify API?", answer: "Yes. Third-party integration connects the business tools you rely on to your store through the Shopify API, so operations run smoothly. Tell us which tools you use and we will plan the connection with you." },
    { question: "Is my store data and idea kept secure?", answer: "Yes, we sign strict confidentiality agreements so your intellectual property stays protected. We also test every app thoroughly before it goes live, so it works properly with your store." },
    { question: "How much does Shopify app development cost, and how long does it take?", answer: "Cost and time depend on what the app must do, how many integrations it needs and whether it is private or public. Describe your idea and we will give you a free quote, with a plan agreed up front so you know the steps." },
    { question: "Does We3vision maintain Shopify apps after launch?", answer: "Yes. Maintenance and updates give your apps continuous support so they keep running smoothly, and optimisation improves their functionality and the shopping experience. We can also add new features to apps and stores you already have." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Why hire Shopify app developers from India, and from We3vision?", answer: "We3vision Private Limited, founded in 2019 in Surat, Gujarat, India, is a Shopify app development company building private and public apps. You get a team sized to your job, from minor tweaks to full-scale development, clear communication and support after launch." },
  ],
  cta: { heading: "Ready To Build\nYour Shopify App?", text: "Tell us what your store needs. From Surat, India we build custom Shopify apps for clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// WordPress plugins (/wordpress-plugin-development-company)
// ---------------------------------------------------------------------------------------------------------------------
export const PLUGIN_SEO = {
  title: "WordPress Plugin Development Company in Surat | We3vision",
  description: "Custom WordPress plugin development services in Surat, India, for clients in the USA, UK, Canada and Australia. Plan agreed up front. Get a free quote.",
};
export const PLUGIN_SECTIONS = build({
  seo: PLUGIN_SEO,
  hero: {
    chip: "WordPress Plugins",
    heading: "WordPress Plugin\nDevelopment Services",
    text: "We3vision is a WordPress plugin development company in Surat, Gujarat, India. We build custom plugins for businesses in India, the USA, UK, Canada and Australia, to extend what your site can do.",
  },
  story:
    "As a WordPress plugin development company in Surat, India, we build custom WordPress plugins that *extend what your site can do*, from e-commerce and SEO features to integrations. Each plugin is written *from the ground up around your requirements*, for clients in India, the USA, UK, Canada and Australia.\n\nOur plugins are *tested, built to perform under heavy traffic and written to WordPress coding standards*, and we keep looking after them once they are live.\n\nWe also customise and upgrade plugins you already use, and connect WooCommerce and third-party tools.",
  services: {
    heading: "Our WordPress Plugin\nDevelopment Services",
    intro: "From a new custom plugin to the care of the plugins you already run.",
    cards: [
      { title: "Custom plugin\ndevelopment", description: "Custom WordPress plugins built from the ground up around your requirements, for a feature no ready-made plugin covers." },
      { title: "Plugin\ncustomisation", description: "WordPress plugin customisation: existing plugins adapted so they fit how your business works, including WooCommerce plugins." },
      { title: "Plugin\nintegration", description: "WordPress API integration that connects third-party services, such as payment gateways and CRM, to your site." },
      { title: "Plugin\nupgradation", description: "Plugin upgrades that keep your plugins current with WordPress, so they stay ahead of the curve." },
      { title: "Plugin\nmaintenance", description: "Plugin maintenance that keeps your plugins running smoothly over time, with support after hand-over." },
      { title: "Extensions\n& add-ons", description: "Tailored extensions and add-ons that expand the plugins you already have, without a full rebuild." },
    ],
  },
  process: {
    heading: "How We Build\nYour Plugin",
    intro: "Four clear steps from the first conversation to the hand-over, with the plan agreed up front.",
    items: [
      { title: "Define", text: "We begin by getting to know your business, your goals and your requirements, and agree the plan with you.", points: "Goals\nRequirements" },
      { title: "Design", text: "Once the plan is defined, our design team shapes how the plugin looks and behaves in the WordPress admin.", points: "Screens and settings\nUser flow" },
      { title: "Develop", text: "The plugin is built with clean code that follows WordPress standards, so it is easier to maintain later.", points: "Clean code\nWordPress standards" },
      { title: "Deliver", text: "Before hand-over we test the plugin thoroughly, then support it after it goes live.", points: "Testing\nHand-over and support" },
    ],
  },
  tools: { heading: "Our CMS Tech Stack", items: "WordPress\nHTML5\nCSS3\nReact.js\nBootstrap\nVue.js" },
  why: {
    heading: "Why Choose We3vision For\nWordPress Plugins",
    items: [
      { title: "Developers who know WordPress", description: "Experience matters when you build or customise plugins. Every plugin is built around your needs, for clients in India and abroad." },
      { title: "Plugins you can rely on", description: "Tested, built to perform under heavy traffic and written to WordPress coding standards." },
      { title: "Integration with third-party tools", description: "Payment gateways, CRM systems or analytics platforms connected properly to your site and WooCommerce." },
      { title: "Timely delivery", description: "A plan agreed up front and clear communication, so your project does not stall." },
      { title: "Ongoing support and maintenance", description: "Our relationship with you does not end once the plugin is delivered; we keep it updated and running." },
      { title: "Fit for small budgets too", description: "We understand that small businesses and startups often have limited budgets, and we plan the scope with that in mind." },
    ],
    intro: "Examples of what we can build: WooCommerce plugin development such as advanced filters, shipping calculators or custom payment options, and SEO plugins to optimise metadata and analyse keywords.",
  },
  related: related("wordpress", "woo", "headless"),
  faq: [
    { question: "What is a custom WordPress plugin?", answer: "A custom WordPress plugin is code written for your site that adds a feature WordPress does not have out of the box. We3vision builds bespoke plugins from the ground up around your requirements, such as e-commerce enhancements and SEO plugins." },
    { question: "Custom plugin or ready-made plugin: which should I choose?", answer: "A ready-made plugin suits a common need, and a custom plugin suits a feature that is specific to your business. If a ready-made plugin almost fits, we can customise it instead of building from scratch." },
    { question: "Can you customise or upgrade a WordPress plugin I already use?", answer: "Yes. We adapt existing plugins to the way your business works, provide plugin upgrade services, and build extensions and add-ons for the plugins you already have." },
    { question: "Do you build WooCommerce plugins and connect third-party tools?", answer: "Yes. We build WooCommerce plugins such as advanced filters, shipping calculators and custom payment options. We also connect payment gateways, CRM systems and analytics platforms through WordPress API integration." },
    { question: "How do you keep a WordPress plugin secure and well written?", answer: "We write clean code that follows WordPress coding standards and test the plugin before hand-over. That makes it easier to review, update and maintain later." },
    { question: "How much does WordPress plugin development cost?", answer: "The cost depends on what the plugin must do, how many integrations it needs and how much testing it requires. Describe the feature you are missing and we will give you a free quote." },
    { question: "How long does it take to build a WordPress plugin?", answer: "It depends on the scope of the plugin and its integrations. We agree the plan with you up front, so you know the steps from define and design to develop and deliver." },
    { question: "Will the plugin keep working when WordPress updates?", answer: "That is what plugin upgrade and maintenance are for. We keep plugins running smoothly over time and support them after delivery." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We3vision works remotely from Surat, Gujarat, India with clients in the USA, UK, Canada and Australia, with clear communication and a project plan agreed up front." },
    { question: "Why hire WordPress plugin developers from India?", answer: "We3vision Private Limited, founded in 2019 in Surat, Gujarat, India, builds custom plugins to WordPress standards for clients at home and abroad. You get clear communication, a plan agreed up front and support after delivery." },
  ],
  cta: { heading: "Ready For A\nCustom Plugin?", text: "Describe the feature you are missing. From Surat, India we build plugins for clients in India, the USA, UK, Canada and Australia.", button: "Get a free quote" },
});
