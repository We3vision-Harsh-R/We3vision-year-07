import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// TECHNOLOGY PAGES: Headless CMS, Custom WordPress, Shopify, WooCommerce, Shopify Apps and WordPress Plugins. They are linked from the
// "Technology" column of the footer and keep the URLs of the old site (including its spelling, "devlopment"), so Google rankings carry over.
// Source: the same pages of the old site (https://we3vision.com): the same services, process steps, industries and FAQ answers. The wording is
// new and plain; the claims of the old pages that cannot be checked (years of experience, project counts, success rates, review scores,
// prices) are NOT copied. Nothing is invented. This is what visitors see until someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({ id, type, data: data as Record<string, unknown> });

type Card = { title: string; description: string };
type Tech = {
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

const RELATED: Record<string, { title: string; description: string; href: string }> = {
  headless: { title: "Headless CMS\nDevelopment", description: "Content managed in one place and delivered to your website, apps and more through APIs.", href: "/headless-CMS-devlopment-services" },
  wordpress: { title: "Custom WordPress\nDevelopment", description: "Themes, plugins, migrations and support for WordPress websites built around your brand.", href: "/custom-wordpress-devlopment-services" },
  shopify: { title: "Shopify\nDevelopment", description: "Custom Shopify stores, themes, integrations and support to sell your products online.", href: "/shopify-development-services" },
  woo: { title: "Custom WooCommerce\nDevelopment", description: "Online stores on WordPress with the features, payments and shipping your business needs.", href: "/custom-woocommerce-devlopment" },
  shopapp: { title: "Shopify App\nDevelopment", description: "Private and public Shopify apps that add the features your store is missing.", href: "/shopify-app-development-services" },
  plugin: { title: "WordPress Plugin\nDevelopment", description: "Custom plugins, integrations, upgrades and add-ons for WordPress websites.", href: "/wordpress-plugin-development-company" },
  web: { title: "Web\nDevelopment", description: "Responsive, fast and SEO-friendly websites from landing pages to complex web portals.", href: "/webdev" },
};
const related = (...keys: (keyof typeof RELATED)[]) => keys.map((k) => RELATED[k]);

const build = (t: Tech): PageSection[] => [
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
// Headless CMS (/headless-CMS-devlopment-services)
// ---------------------------------------------------------------------------------------------------------------------
export const HEADLESS_SEO = {
  title: "Headless CMS Development Services | Strapi, Contentful, Sanity | We3vision",
  description: "Custom headless CMS development, migration, API integration and React or Vue front ends. We3vision, Surat, India builds content platforms that serve your website, apps and more.",
};
export const HEADLESS_SECTIONS = build({
  seo: HEADLESS_SEO,
  hero: {
    chip: "Headless CMS",
    heading: "Headless CMS\nDevelopment Services",
    text: "Manage your content in one place and deliver it to your website, mobile apps and other channels through fast APIs. We build the CMS, the API and the front end.",
  },
  story:
    "A *headless CMS* stores and manages your content separately from the way it is shown. Content travels through *REST or GraphQL APIs*, so the same text, images and videos can feed a *website, a mobile app and any other channel* without being written twice.\n\nWe work with tools like *Contentful, Strapi and Sanity*, build modern *React or Vue front ends*, and move you over from a traditional CMS such as WordPress or Drupal with as little downtime as possible.",
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
      { title: "Seamless deployment", text: "We launch the final product smoothly, with less downtime, so your users get the best experience from day one.", points: "Live launch\nSupport afterwards" },
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
    { question: "Which headless CMS platform is best for my business?", answer: "It depends on your needs. Popular options include Strapi, Contentful and Sanity. We guide you to choose the best one based on your goals and budget." },
    { question: "Is a headless CMS secure for my business?", answer: "Yes, when it is set up properly. We follow strong security steps like safe API access, backups and regular updates to protect your data." },
    { question: "Can I connect other tools with my headless CMS?", answer: "Yes. A headless CMS works well with payment gateways, CRMs, marketing software and analytics through API integrations." },
    { question: "How long does it take to build a headless CMS?", answer: "The time varies with the size of the project. Simple setups take about 3 to 5 weeks, while complex projects may take longer. We give you a clear timeline before starting." },
    { question: "Will my headless CMS work on mobile devices?", answer: "Yes. A headless CMS delivers content through APIs that work on all devices: phones, tablets and desktops." },
  ],
  related: related("web", "wordpress", "plugin"),
  cta: { heading: "Ready To Go\nHeadless?", text: "Tell us about your content and your channels, and we will suggest the right headless CMS and a plan to get there.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom WordPress (/custom-wordpress-devlopment-services)
// ---------------------------------------------------------------------------------------------------------------------
export const WORDPRESS_SEO = {
  title: "Custom WordPress Development Services | Themes, Plugins, Migration | We3vision",
  description: "Custom WordPress websites, themes, plugins, WooCommerce stores, migration and support from We3vision, Surat, India. Work per project, per hour or with a dedicated team.",
};
export const WORDPRESS_SECTIONS = build({
  seo: WORDPRESS_SEO,
  hero: {
    chip: "WordPress",
    heading: "Custom WordPress\nDevelopment Services",
    text: "Transform your online presence with custom WordPress websites: designed around your brand, fast, secure and easy for you to manage.",
  },
  story:
    "No two brands are the same, so why settle for a generic theme? We start from *your goals and your audience* and build *custom WordPress themes, plugins and stores* that fit your brand, from a simple blog to a large business platform.\n\nYou can work with us *per project, by the hour, or hire a dedicated WordPress developer or a full team*, whichever suits the way your project grows.",
  services: {
    heading: "Our WordPress\nDevelopment Services",
    intro: "Everything a WordPress website needs, from the first design to the support after launch.",
    cards: [
      { title: "WordPress design\nservices", description: "A website that does more than look good: a design that makes an impact and guides your visitors." },
      { title: "WordPress theme\ndevelopment", description: "Custom WordPress themes tailored to your brand, instead of a generic theme that looks like everyone else's." },
      { title: "WordPress plugin\ndevelopment", description: "Custom plugins that give your website the extra feature it needs to reach its full potential." },
      { title: "WooCommerce\ndevelopment", description: "Running an online store? We build WooCommerce stores that are ready to sell." },
      { title: "WordPress migration\nservices", description: "Moving to WordPress should not feel overwhelming. We move your site safely, without losing data." },
      { title: "Enterprise WordPress\ndevelopment", description: "Big businesses need big solutions: WordPress platforms built for large-scale needs." },
      { title: "Support &\nmaintenance", description: "A great website does not stop at launch: updates, fixes and care to keep it running well." },
      { title: "WordPress retainer\nservices", description: "Need ongoing support? A retainer gives you the flexibility to improve and optimise your site whenever you need." },
      { title: "Headless WordPress\ndevelopment", description: "For those who want to push boundaries: headless WordPress offers more flexibility and performance." },
    ],
  },
  process: {
    heading: "How We Build\nYour WordPress Site",
    intro: "A simple process from the first conversation to the launch.",
    items: [
      { title: "Understanding your needs", text: "We begin by learning your goals, your target audience and the purpose of the website, such as e-commerce, a portfolio or a business site.", points: "Goals and audience\nType of website" },
      { title: "Design", text: "Design is where creativity meets strategy: layouts and visuals that fit your brand and are easy to use.", points: "Look and feel\nLayouts for every device" },
      { title: "Development", text: "This is where ideas become reality: we build the theme, the features and the integrations.", points: "Custom theme\nFeatures and plugins" },
      { title: "Delivery", text: "Before launching your website, we run it through rigorous testing and then deliver it.", points: "Testing\nLaunch and support" },
    ],
  },
  tools: { heading: "Our Tech Stack", items: "HTML5\nCSS3\nReact.js\nBootstrap\nVue.js\nWordPress\nWooCommerce" },
  why: {
    heading: "Benefits Of Custom\nWordPress Development",
    items: [
      { title: "Built just for you", description: "Every business has unique goals, and a one-size-fits-all solution rarely delivers." },
      { title: "A design that stands out", description: "Generic templates can make your site look like everyone else's." },
      { title: "Ready to grow with you", description: "Businesses evolve, and so should your website." },
      { title: "Speed you can count on", description: "A slow website frustrates users and hurts your rankings on search engines." },
      { title: "Stronger security", description: "Cybersecurity is a top priority, especially with online threats on the rise." },
      { title: "Built for SEO", description: "A custom site does not just look good: it performs well on search engines." },
      { title: "Ownership and flexibility", description: "With custom development you own the code, the design and the features." },
      { title: "Reliable support and maintenance", description: "Websites need care to keep running smoothly." },
      { title: "Better on mobile devices", description: "More users browse on mobile devices than ever before, so mobile comes first." },
    ],
  },
  industries: {
    heading: "WordPress For\nEvery Industry",
    intro: "From minimalist blogs to complex platforms, here is what WordPress can look like in some industries.",
    items: [
      { name: "E-commerce", description: "Your online store is the face of your brand." },
      { name: "Healthcare", description: "In healthcare, trust is everything: clear, secure websites." },
      { name: "Education", description: "Learning is not limited to classrooms anymore." },
      { name: "Real estate", description: "Connecting buyers to properties and agents to clients." },
      { name: "Travel and hospitality", description: "Travel should feel inspiring, even in the planning stage." },
      { name: "Media and entertainment", description: "Dynamic websites for the fast-paced world of media." },
      { name: "Finance and banking", description: "In finance, security and credibility are non-negotiable." },
      { name: "Non-profit organisations", description: "A platform that works as hard as your mission does." },
      { name: "Technology and SaaS", description: "Functionality and simplicity are key for SaaS businesses." },
    ],
  },
  related: related("woo", "plugin", "headless"),
  cta: { heading: "Ready For Your\nWordPress Website?", text: "Tell us what you want to build and we will get back to you with the right approach.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Shopify (/shopify-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFY_SEO = {
  title: "Shopify Development Services | Custom Stores, Themes & Apps | We3vision",
  description: "Shopify store design, theme customisation, app integration, custom apps, migration and support from We3vision, Surat, India. Fast, tailored Shopify websites.",
};
export const SHOPIFY_SECTIONS = build({
  seo: SHOPIFY_SEO,
  hero: {
    chip: "Shopify",
    heading: "Shopify\nDevelopment Services",
    text: "Delayed projects and rising costs holding your store back? We design and build fast, affordable and tailored Shopify stores that fit your brand.",
  },
  story:
    "We build *unique Shopify stores* that fit your brand and goals: every detail, from colours to layouts, is designed to match what your business is about.\n\nFrom *theme customisation and app integration* to *custom apps, platform migration and ongoing support*, we take care of the technical work, so you can focus on *selling and growing*.",
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
      { name: "Retail and e-commerce", description: "Shopify stores that make shopping fun and seamless, with carts and payments that work without fuss." },
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
  cta: { heading: "Ready To Launch\nYour Shopify Store?", text: "Partner with We3vision to turn your ideas into reality. Tell us what you want to sell and we will get back to you.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom WooCommerce (/custom-woocommerce-devlopment)
// ---------------------------------------------------------------------------------------------------------------------
export const WOOCOMMERCE_SEO = {
  title: "Custom WooCommerce Development Services | Online Stores | We3vision",
  description: "WooCommerce store development, theme customisation, plugins, API integration, migration, speed and SEO optimisation, and support from We3vision, Surat, India.",
};
export const WOOCOMMERCE_SECTIONS = build({
  seo: WOOCOMMERCE_SEO,
  hero: {
    chip: "WooCommerce",
    heading: "Custom WooCommerce\nDevelopment Services",
    text: "Create an online store that shows your products and services in the best possible way: flexible, scalable, SEO-friendly and secure.",
  },
  story:
    "*WooCommerce* is an open-source e-commerce platform for WordPress, which gives you *flexibility to customise your store* exactly the way you want, and a wide choice of *extensions for payments, shipping and more*.\n\nWe build, migrate, integrate and look after WooCommerce stores, and we make them *fast, secure and easy for you to manage*.",
  services: {
    heading: "Our Complete Range Of\nWooCommerce Services",
    intro: "From building a new store to keeping it fast and up to date.",
    cards: [
      { title: "WooCommerce store\ndevelopment", description: "A high-performance WooCommerce store, aligned with your business goals." },
      { title: "Store design\n& development", description: "Visually captivating, responsive WooCommerce stores that attract visitors and turn them into loyal customers." },
      { title: "Theme development\n& customisation", description: "Custom theme design and development so your store mirrors your brand identity." },
      { title: "Plugin\ndevelopment", description: "Custom plugins that enhance your store's functionality and automate tasks." },
      { title: "WooCommerce\nintegration", description: "We help you select and integrate the best plugins to extend what your store can do." },
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
  cta: { heading: "Ready To Open\nYour Online Store?", text: "Tell us about your products and your customers and we will plan your WooCommerce store with you.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Shopify apps (/shopify-app-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFYAPP_SEO = {
  title: "Shopify App Development Services | Custom & Public Apps | We3vision",
  description: "Custom Shopify apps, private and public apps for the Shopify App Store, third-party integrations, maintenance and optimisation from We3vision, Surat, India.",
};
export const SHOPIFYAPP_SECTIONS = build({
  seo: SHOPIFYAPP_SEO,
  hero: {
    chip: "Shopify Apps",
    heading: "Shopify App\nDevelopment Services",
    text: "Stuck with limited Shopify features? Generic apps can slow your growth and frustrate customers. We build custom apps around your business.",
  },
  story:
    "*Shopify* is a powerful and flexible platform, and the right app can add exactly the feature your store is missing. We specialise in *custom apps tailored to your business needs*: for your own store, or for the *Shopify App Store*.\n\nWe work from India with a team that keeps your project moving, fits its size to your needs and builds at *cost-effective rates*.",
  services: {
    heading: "Shopify App\nDevelopment Services",
    intro: "Apps for your own store, apps for the Shopify App Store, and everything that keeps them running.",
    cards: [
      { title: "Custom app\ndevelopment", description: "Custom apps tailored to your business needs, built to solve your exact problem." },
      { title: "Feature\nenhancements", description: "New features added to the apps and the store you already have." },
      { title: "Third-party\nintegration", description: "Seamless integration with the business tools you rely on, so operations run smoothly." },
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
  cta: { heading: "Ready To Build\nYour Shopify App?", text: "Tell us what your store needs and we will suggest how an app can do it.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// WordPress plugins (/wordpress-plugin-development-company)
// ---------------------------------------------------------------------------------------------------------------------
export const PLUGIN_SEO = {
  title: "WordPress Plugin Development Company | Custom Plugins | We3vision",
  description: "Custom WordPress plugin development, customisation, integration, upgrades, maintenance and add-ons from We3vision, Surat, India. Reliable plugins built to WordPress standards.",
};
export const PLUGIN_SECTIONS = build({
  seo: PLUGIN_SEO,
  hero: {
    chip: "WordPress Plugins",
    heading: "WordPress Plugin\nDevelopment Services",
    text: "Need a custom solution to elevate your WordPress website? We build plugins that extend what your site can do.",
  },
  story:
    "Our plugins *extend the capabilities of your WordPress site*, with features like e-commerce, SEO and integrations. Every business is unique, and so are our plugins: we build them *from the ground up around your requirements*.\n\nWe write plugins that are *free of bugs, perform well under heavy traffic and follow WordPress coding standards*, and we keep looking after them when they are live.",
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
      { title: "Integration with third-party tools", description: "Payment gateways, CRM systems or analytics platforms connected seamlessly to your site." },
      { title: "Timely delivery", description: "Work delivered on time, so your project does not stall." },
      { title: "Ongoing support and maintenance", description: "Our relationship with you does not end once the plugin is delivered." },
      { title: "Fit for small budgets too", description: "We understand that small businesses and startups often have limited budgets." },
    ],
    intro: "Examples of what we can build: e-commerce enhancements such as advanced filters, shipping calculators or custom payment options, and SEO plugins to optimise metadata and analyse keywords.",
  },
  related: related("wordpress", "woo", "headless"),
  cta: { heading: "Ready For A\nCustom Plugin?", text: "Describe the feature you are missing and we will tell you how we would build it.", button: "Get a free quote" },
});
