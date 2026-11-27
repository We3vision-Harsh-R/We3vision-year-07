import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";
import { GOV_PROJECTS, GOV_TITLE } from "./gov-projects";
import { DEVICES, QUIZ } from "./metaverse-extra";
import { detailFor } from "./service-details";

// SERVICE PAGES: Web Development, Mobile App Development, Metaverse Solutions, UI/UX Design, CRM Development, 2D/3D Animation,
// 3D Modeling, Graphics & UI/UX Design and SEO. Source: the matching pages of the old site (https://we3vision.com/#/webdev, #/mobile,
// #/metaverse, #/ui-ux-design, #/crm, #/animation, #/3d-modeling, #/graphics, #/seo): the same services, process steps, tools,
// industries, reasons to choose us and FAQ answers (every answer was read from the old pages). The wording is tidied and enriched
// with search keywords (company, Surat, India). Each page also lists the sub-services of the service (cards under "What we build"),
// so visitors see what the service covers. Nothing is invented: no prices, client names or numbers beyond what the old pages state.
// Words in *stars* are highlighted. This is what visitors see until someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({
  id,
  type,
  data: data as Record<string, unknown>,
});

type Card = { title: string; description: string; href?: string; fit?: string; problems?: string[]; outcomes?: string[] };
type Svc = {
  seo: { title: string; description: string };
  hero: { chip: string; heading: string; text: string; primaryLabel: string; secondaryLabel: string };
  story: string;
  subs: { chip: string; heading: string; intro: string; cards: Card[] };
  process: { heading: string; intro: string; items: { title: string; text: string; points?: string }[] };
  tools: { heading: string; items: string };
  industries: { heading: string; intro: string; items: { name: string; description: string }[] };
  why: { heading: string; items: { title: string; description: string }[] };
  faq: { question: string; answer: string }[];
  guide?: { scene: string; chip: string; heading: string; text: string; tips: string[] };
  related: Card[];
  cta: { heading: string; text: string; button: string };
};

const build = (s: Svc): PageSection[] => [
  section("pageHero", {
    chip: s.hero.chip,
    heading: s.hero.heading,
    text: s.hero.text,
    primaryLabel: s.hero.primaryLabel,
    primaryHref: "#contact",
    secondaryLabel: s.hero.secondaryLabel,
    secondaryHref: "#services",
  }),
  section("story", { body: s.story }),
  ...(s.guide ? [section("guide", { chip: s.guide.chip, heading: s.guide.heading, text: s.guide.text, scene: s.guide.scene, tips: s.guide.tips.join("\n"), buttonLabel: "", buttonHref: "" })] : []),
  section("services", {
    chip: s.subs.chip,
    heading: s.subs.heading,
    intro: s.subs.intro,
    buttonLabel: "",
    buttonHref: "",
    cards: s.subs.cards.map((c) => {
      const x = detailFor(c.title);
      return { title: c.title, description: c.description, href: c.href ?? "", fit: c.fit ?? x?.fit ?? "", problems: c.problems ? c.problems.join("\n") : (x?.problems ?? ""), outcomes: c.outcomes ? c.outcomes.join("\n") : (x?.outcomes ?? "") };
    }),
  }),
  section("process", { chip: "Our process", heading: s.process.heading, intro: s.process.intro, items: s.process.items.map((i) => ({ title: i.title, text: i.text, points: i.points ?? "" })) }),
  section("tags", { chip: "Tools & Technologies", heading: s.tools.heading, intro: "", items: s.tools.items }),
  section("industries", { chip: "Industries We Serve", heading: s.industries.heading, intro: s.industries.intro, items: s.industries.items }),
  section("advantages", { chip: "Why We3vision", heading: s.why.heading, intro: "", items: s.why.items }, "why-we3vision"),
  section("faq", { chip: "FAQ", heading: "Questions\nWe Often Hear", intro: "", items: s.faq }),
  section(
    "services",
    {
      chip: "Related services",
      heading: "More From\nWe3vision",
      intro: "Services that work well together with this one.",
      buttonLabel: "",
      buttonHref: "",
      cards: s.related.map((c) => ({ title: c.title, description: c.description, href: c.href ?? "", fit: "", problems: "", outcomes: "" })),
    },
    "related-services",
  ),
  section("contact", { chip: "Let's talk", heading: s.cta.heading, text: s.cta.text, buttonLabel: s.cta.button }),
];

// ---------------------------------------------------------------------------------------------------------------------
// Web Development (/webdev)
// ---------------------------------------------------------------------------------------------------------------------
export const WEBDEV_SEO = {
  title: "Web Development Company in Surat, India | We3vision",
  description:
    "Web development company in Surat, India: custom websites, WordPress, Shopify and e-commerce for clients in the USA, UK, Canada and Australia. Get a quote.",
};
export const WEBDEV_SECTIONS = build({
  seo: WEBDEV_SEO,
  hero: {
    chip: "Web Development",
    heading: "Web Development Company\nIn Surat, India",
    text: "We3vision is a web development company in Surat, Gujarat, India, working since 2019. We build custom, fast, secure and SEO-friendly websites and online stores for businesses in India and for clients in the USA, UK, Canada and Australia, and we keep them easy for your team to manage.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we build",
  },
  story:
    "As a *web development company in Surat, India*, we design and build *custom websites, WordPress and WooCommerce sites, Shopify stores, e-commerce websites and web portals* that bring in visitors, guide them to act and turn them into enquiries and sales. Everything is written with *clean code and a focus on speed, security and search visibility*.\n\nEvery project is built around your brand, not a generic template, using *WordPress, WooCommerce, Shopify, headless CMS front ends* and custom *Node.js, Laravel or PHP* back ends, with help on *domain, hosting and SSL*. You can *hire web developers from India* for clients in the *USA, UK, Canada and Australia*: we work remotely, agree the plan up front and discuss working-hour overlap per project.",
  subs: {
    chip: "What we build",
    heading: "Websites For\nEvery Need",
    intro: "Six kinds of web development work, from a CMS website you manage yourself to a custom e-commerce store.",
    cards: [
      { title: "WordPress &\nWooCommerce", description: "Custom WordPress developers for business websites and WooCommerce stores that your team can edit itself, with a simple CMS and hands-on training." },
      { title: "Shopify\nStores", description: "Shopify developers who set up conversion-focused stores, themes and apps, so you can sell your products online in your own market." },
      { title: "Headless\nCMS", description: "Fast React, Vue or Angular front ends on a headless CMS, built for speed, flexibility and good search performance." },
      { title: "E-commerce\nWebsites", description: "E-commerce website development with secure Node.js, Laravel or PHP back ends, payments, inventory and order management." },
      { title: "Custom Web\nPortals", description: "Custom website development from landing pages to web portals: booking systems, listings, course portals and dashboards." },
      { title: "Domain, Hosting\n& SSL", description: "We help you buy and set up your domain, hosting and SSL, and deploy your website on secure servers." },
    ],
  },
  process: {
    heading: "How We Build\nYour Website",
    intro: "A clear, step-by-step web development process, from first idea to launch and long-term support. Scope, plan and timeline are agreed with you before building starts, whether you are in Surat or abroad.",
    items: [
      { title: "Discovery & requirement analysis", text: "We learn your goals, audience and the features you need, then write a clear roadmap and quote so the plan is agreed up front.", points: "Goals, audience and KPIs\nFunctional requirements\nSitemap and navigation model\nLow-fidelity wireframes" },
      { title: "Information architecture", text: "We plan the navigation, page structure and user flow. Wireframes show the layout, content order and the path a visitor takes to enquire or buy." },
      { title: "UI design & prototyping", text: "We design brand-aligned, responsive interfaces that are easy to use, pleasant to look at and accessible, and you approve them before development.", points: "High-fidelity UI and design system\nInteractive prototypes" },
      { title: "Front-end development", text: "Using React, Angular or Vue, we build fast, pixel-perfect pages that work on desktop, tablet and mobile, with search engines in mind.", points: "Component-based implementation\nPerformance and responsiveness" },
      { title: "Back-end development", text: "We build secure, scalable back ends with Node.js, Laravel or PHP, including payments, forms and third-party integrations.", points: "API design and integrations\nSecurity and scalability" },
      { title: "Content integration & CMS setup", text: "We add your content with SEO basics in place and set up WordPress or a custom admin, so your team can edit pages without a developer.", points: "Content loading and SEO basics\nCMS configuration and training" },
      { title: "Testing & quality assurance", text: "We test speed, SEO basics, accessibility, cross-browser behaviour and security before anything goes live.", points: "Functional and UX testing\nPerformance, SEO and security checks" },
      { title: "Launch & ongoing support", text: "We deploy on secure servers, then offer monitoring, updates and improvements, including remote support for clients in the USA, UK, Canada and Australia.", points: "Production deployment\nMonitoring and continuous improvements" },
    ],
  },
  tools: { heading: "The Technology\nBehind Our Websites", items: "HTML5\nCSS3\nJavaScript\nReact.js\nVue.js\nAngular\nNode.js\nLaravel\nDjango\nMySQL\nPostgreSQL\nMongoDB" },
  industries: {
    heading: "Websites For\nEvery Industry",
    intro: "We do not work with only one kind of business. Here is what website development can look like in some industries, for clients in Surat, India and abroad.",
    items: [
      { name: "E-commerce", description: "Fast, conversion-focused online stores on WooCommerce, Shopify or custom code, with payments and inventory." },
      { name: "Healthcare", description: "Secure, easy-to-use websites and patient portals for clinics, hospitals and health startups." },
      { name: "Real estate", description: "Property listing websites with filters, maps, enquiry forms and booking options." },
      { name: "Education", description: "Online learning websites, course portals and student management systems for schools and training firms." },
      { name: "Finance", description: "Secure web apps for fintech, accounting and transaction platforms." },
      { name: "Travel & hospitality", description: "Booking systems, tour websites and itinerary planners for hotels, agencies and operators." },
    ],
  },
  why: {
    heading: "Websites Built\nTo Last",
    items: [
      { title: "Experienced team of developers", description: "Our website developers in Surat have built sites across many industries since 2019, so your platform is technically sound and planned around your business." },
      { title: "Tailored solutions for every business", description: "We do not use generic templates. Every custom website is built to reflect your brand and your business goals." },
      { title: "Optimised for all devices & search engines", description: "Our websites are mobile-first, responsive and built with clean, SEO-friendly code, so Google and AI search tools can read and understand them." },
      { title: "Scalable & future-ready architecture", description: "Whether you launch small or scale up later, the site is built so it can grow with your business." },
      { title: "Transparent communication & support", description: "You always know where your project stands: a plan agreed up front, open communication and post-launch support, also remotely for clients in the USA, UK, Canada and Australia." },
    ],
  },
  faq: [
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver web projects remotely from Surat, Gujarat, India for clients in the USA, UK, Canada and Australia. We agree the scope, plan and timeline up front, keep communication clear through calls, chat and email, and discuss working-hour overlap for each project." },
    { question: "How much does a website cost?", answer: "The cost depends on the number of pages, the features and the integrations you need. We share a clear quote after we understand your requirements, so there are no surprises. Tell us about your project and we will send a quote." },
    { question: "How long does it take to build a website?", answer: "It depends on the scope: pages, features, content and integrations. After discovery we agree a plan with milestones up front, so you know what is delivered and when, and we keep you updated at each step." },
    { question: "Which technologies do you use?", answer: "We use WordPress and WooCommerce, Shopify, React, Vue, Angular, Node.js, Laravel, PHP and Django, with MySQL, PostgreSQL or MongoDB. We pick the stack that fits your goals, budget and the way your team will manage the site." },
    { question: "Do you build e-commerce websites?", answer: "Yes, we build e-commerce websites on WooCommerce, Shopify or custom Node.js, Laravel and PHP back ends. This includes product catalogues, payments, inventory and order management, planned for the market you sell in." },
    { question: "Will my website be SEO-friendly?", answer: "Yes, we build websites with clean code, fast loading, a clear page structure and SEO basics in place, so search engines can understand your pages. For ongoing ranking work we also offer SEO as a separate service." },
    { question: "Will my website work on all devices?", answer: "Yes, we create fully responsive websites that look and work well on desktop, tablet and mobile, and we test them across common browsers before launch." },
    { question: "Do you offer maintenance and support after launch?", answer: "Yes, we offer post-launch support including monitoring, updates, fixes and improvements. We also build with an easy CMS like WordPress, so your team can manage content without a developer for every small change." },
    { question: "Do you provide hosting and domain help?", answer: "Yes, we can help you buy and set up a domain, hosting and SSL, and deploy your website on secure servers." },
    { question: "Why hire a web development company in Surat, India?", answer: "Hiring a web development company in Surat gives you an experienced team, clear communication and a plan agreed up front. We3vision has worked since 2019 with clients from the USA, Canada, UK, Germany, UAE, Singapore and Australia, and we work with businesses of every size and industry." },
  ],
  related: [
    { title: "UI/UX\nDesign", description: "Interfaces that look great and guide visitors towards action.", href: "/ui-ux-design" },
    { title: "SEO\nOptimization", description: "Get found on Google and grow organically.", href: "/seo" },
    { title: "CRM\nDevelopment", description: "Connect your website to a custom CRM.", href: "/crm" },
    { title: "Brand\nDesign", description: "A clear, consistent brand identity for your website and beyond.", href: "/brand-identity" },
  ],
  guide: { scene: "office", chip: "Meet the builder", heading: "Type a name,\nwatch it get built", text: "Our guide builds websites all day. Type your business name below and watch it appear on the screen, then imagine a whole site built around it.", tips: ["Hi! I build websites. Type your brand name below.","Fast, responsive and easy to manage: that is how we build.","Every site is custom made, with no generic templates.","We agree the plan and timeline with you up front.","Need an online store? Ask me about WooCommerce and Shopify."] },
  cta: { heading: "Ready To Build\nYour Next Website?", text: "Tell us your idea, from Surat or from abroad, and we will suggest the right approach, plan and a clear quote for your website.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Mobile App Development (/mobile)
// ---------------------------------------------------------------------------------------------------------------------
export const MOBILE_SEO = {
  title: "Mobile App Development Company in Surat | Android, iOS",
  description:
    "Mobile app development company in Surat, India. Android, iOS, Flutter and React Native apps for clients in India, the USA, UK, Canada and Australia.",
};
/** puts the app showcase (tablet + phones) right after the hero */
const withShowcase = (list: PageSection[]): PageSection[] => {
  const at = list.findIndex((s) => s.type === "pageHero");
  const showcase = section("appShowcase", {
    logo: "App",
    tagline: "Built by We3vision",
    heading: "An app that meets\nyour users' needs",
    nav: "What we build\nHow we work\nTechnology\nFAQ\nContact",
    navButton: "Get a quote",
    primaryLabel: "Get a free quote",
    primaryHref: "#contact",
    secondaryLabel: "What we build",
    secondaryHref: "#services",
    sideLabel: "Android, iOS and cross-platform",
  });
  return [...list.slice(0, at + 1), showcase, ...list.slice(at + 1)];
};
export const MOBILE_SECTIONS = withShowcase(build({
  seo: MOBILE_SEO,
  hero: {
    chip: "Mobile App Development",
    heading: "Mobile App Company\nIn Surat, India",
    text: "We3vision is a mobile app development company in Surat, Gujarat, India. We build custom Android, iOS, Flutter and React Native apps, fast, user-friendly and built to scale, for businesses in India, the USA, UK, Canada and Australia.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we build",
  },
  story:
    "Looking for a *mobile app development company in Surat*? We3vision builds *custom mobile apps*, from *food delivery apps to fitness trackers and enterprise tools*, shaped around your goals, your users and your industry. Expect *high performance, beautiful design and reliable functionality* on every device.\n\nOur *Android app development* and *iOS app development* use *Kotlin and Swift*, while *Flutter and React Native* give you one codebase for both. We connect apps to your back end through *APIs and databases*, help with *Google Play and App Store submission*, and support updates after launch. Clients in the *USA, UK, Canada and Australia* work with us remotely from Surat, with the plan agreed up front.",
  subs: {
    chip: "What we build",
    heading: "Apps For\nEvery Platform",
    intro: "Six kinds of mobile app development work, from a first version to a full-scale product.",
    cards: [
      { title: "Android\nApps", description: "Android app development in native Kotlin or cross-platform, tuned for performance on every device." },
      { title: "iOS\nApps", description: "iOS app development in native Swift, with clean, brand-aligned interfaces and App Store submission support." },
      { title: "Cross-platform\n& Hybrid Apps", description: "Flutter or React Native app development: one codebase for Android and iOS, chosen to fit your goals and budget." },
      { title: "MVP\nDevelopment", description: "A focused first version with the core features, so you can launch, learn from real users and grow." },
      { title: "Full-scale\nProducts", description: "Custom apps with APIs, real-time sync, storage, authentication and updates as your product grows." },
      { title: "Store Launch\n& Maintenance", description: "Play Store and App Store submission with listing optimization, then monitoring, fixes and new features." },
    ],
  },
  process: {
    heading: "How We Build\nYour App",
    intro: "A simple, collaborative process, from the first conversation to long-term support, with updates along the way.",
    items: [
      { title: "Discovery & strategy", text: "We discuss business goals, target users and objectives to define the right features, platforms and technologies, and agree the plan up front.", points: "Goals, users and KPIs\nPlatforms and tech stack" },
      { title: "UX research & wireframing", text: "We map app flow, navigation and interactions. Wireframes act as the blueprint for structure and user journeys.", points: "User flows and navigation\nLow-fidelity wireframes" },
      { title: "UI design & prototyping", text: "We design clean, brand-aligned interfaces focused on usability, engagement and responsiveness, and share prototypes for your feedback.", points: "High-fidelity UI screens\nInteractive prototypes" },
      { title: "App development", text: "We build native (iOS/Android) or cross-platform apps with Flutter, React Native or Swift, focusing on performance and scalability, with regular test builds.", points: "Native or cross-platform builds\nPerformance and scalability" },
      { title: "API & database integration", text: "We connect the app to back-end systems and databases for auth, data sync and real-time updates.", points: "API integration and auth\nReal-time sync and storage" },
      { title: "Testing & quality assurance", text: "We test across devices for performance, security and a smooth experience, and fix issues before going live.", points: "Functional, performance, security\nMulti-device QA" },
      { title: "Deployment & launch", text: "We handle Google Play and App Store submissions with metadata optimization, and guide you through store requirements.", points: "Play Store and App Store submission\nStore listing optimization" },
      { title: "Maintenance & updates", text: "Post-launch monitoring, issue fixes and feature updates to match user needs and platform changes.", points: "Ongoing maintenance and updates\nPerformance monitoring" },
    ],
  },
  tools: { heading: "The Technology\nBehind Our Apps", items: "Flutter\nReact Native\nKotlin\nSwift\nFirebase\nMongoDB\nMySQL\nNode.js\nExpress.js\nLaravel\nAWS\nGoogle Cloud\nAzure\nRESTful APIs\nGraphQL\nFigma\nAdobe XD\nZeplin" },
  industries: {
    heading: "Apps For\nEvery Industry",
    intro: "The same app idea works differently in every business. Here is what mobile apps look like in some of them.",
    items: [
      { name: "Healthcare", description: "Appointment booking, health tracking and doctor-patient communication apps, built with data privacy in mind." },
      { name: "E-commerce", description: "Shopping apps with secure payments, inventory sync, push notifications and easy checkout." },
      { name: "Finance", description: "Secure banking, investment tracking and wallet-based mobile apps with protected data and sign-in." },
      { name: "Education", description: "Learning apps with video content, quizzes, progress tracking and student dashboards." },
      { name: "Logistics", description: "Real-time tracking, route optimization and fleet management apps for drivers and managers." },
      { name: "On-demand services", description: "From food delivery to salon services, user-friendly on-demand apps for customers and providers." },
    ],
  },
  why: {
    heading: "Apps People\nKeep Using",
    items: [
      { title: "Experienced mobile developers", description: "Our Surat team has hands-on experience building apps for startups, SMEs and enterprise clients across various domains." },
      { title: "Custom solutions, not templates", description: "We create fully tailored custom mobile apps that solve real user problems and reflect your brand identity." },
      { title: "Cross-platform & native expertise", description: "Whether you want native iOS, Android or hybrid apps, we pick the right tech for your goals and budget, and explain why." },
      { title: "Performance-focused development", description: "Speed, stability and scalability are at the core of every app we develop, from the first screen to the last." },
      { title: "Ongoing support & optimization", description: "We do not stop at launch. We offer updates, new features and improvements as your app scales, from Surat to clients abroad." },
    ],
  },
  faq: [
    { question: "Which is the right mobile app development company in Surat for my project?", answer: "The right company is one that fits your goals, shows a clear plan and communicates openly. We3vision is a mobile app development company in Surat, Gujarat, India, founded in 2019, that builds custom Android, iOS and cross-platform apps. We agree the scope and plan with you before development starts." },
    { question: "How do you build a mobile app, step by step?", answer: "We build a mobile app in clear steps: discovery, UX wireframes, UI design, development, API and database integration, testing, store launch and maintenance. You see prototypes and test builds along the way. This keeps the plan clear and your feedback built in." },
    { question: "Should I choose native or cross-platform app development?", answer: "Choose native for the deepest device features and cross-platform for one codebase across both stores. We build native apps with Kotlin and Swift and cross-platform apps with Flutter or React Native. We explain the trade-offs for your goals and budget before we start." },
    { question: "Should I build the Android or the iOS app first?", answer: "Start with the platform where most of your users are, or build both together with Flutter or React Native. We look at your audience and market, such as India, the USA, UK, Canada or Australia, and suggest the best order. An MVP can launch on one platform first." },
    { question: "Do you work with mobile app clients in the USA, UK, Canada and Australia?", answer: "Yes, we build mobile apps remotely from Surat, Gujarat, India for clients in the USA, UK, Canada and Australia. We agree the plan, scope and timeline up front and share regular updates and test builds. We have worked with clients from the USA, Canada, UK, Germany, UAE, Singapore and Australia." },
    { question: "Can I hire mobile app developers from India through We3vision?", answer: "Yes, you can work with our mobile app developers in Surat, India on a project you define with us. We agree the scope, plan and updates up front, and you can follow progress through test builds. Ask for a quote to discuss your app idea." },
    { question: "Will my app need a backend and APIs?", answer: "Most apps that store data, sign users in or sync between devices need a backend and APIs. We connect your app to back ends and databases using RESTful APIs or GraphQL, with Node.js, Firebase, MongoDB, MySQL or Laravel. We pick what fits your product." },
    { question: "Do you help with publishing on app stores?", answer: "Yes, we assist with Google Play and App Store submissions, compliance and metadata. We guide you through the store requirements and prepare the listing. Store decisions rest with Google and Apple." },
    { question: "How secure will my app be?", answer: "We build security in from the start: encryption, secure APIs and best practices for data protection. We also test for security before launch. The right measures depend on your app and the data it handles, and we discuss them with you." },
    { question: "Can you maintain and update my app after launch?", answer: "Yes, we offer app maintenance, bug fixes and feature enhancements after launch. We monitor performance and update the app as your users and platforms change. We can agree the support plan with you before go-live." },
  ],
  related: [
    { title: "UI/UX\nDesign", description: "Clean, brand-aligned app interfaces and prototypes.", href: "/ui-ux-design" },
    { title: "Web\nDevelopment", description: "A website or web app to go with your mobile app.", href: "/webdev" },
    { title: "AI\nDevelopment", description: "Add chatbots, recommendations and predictions to your app.", href: "/ai" },
    { title: "CRM\nDevelopment", description: "Connect your app with a custom CRM.", href: "/crm" },
  ],
  cta: { heading: "Have An App Idea?\nLet's Bring It To Life.", text: "Share your concept from Surat or abroad and we will guide you on the right tech, plan and a clear quote.", button: "Get a free quote" },
}));

// ---------------------------------------------------------------------------------------------------------------------
// Metaverse Solutions (/metaverse)
// ---------------------------------------------------------------------------------------------------------------------
export const METAVERSE_SEO = {
  title: "Metaverse Development Company in Surat, India | We3vision",
  description:
    "Metaverse development company in Surat, Gujarat, India for clients in the USA, UK, Canada and Australia. AR, VR, XR, virtual worlds. Share your idea.",
};
// the earlier Metaverse page (all sections), kept for when the page is built up again
export const METAVERSE_FULL_SECTIONS = build({
  seo: METAVERSE_SEO,
  hero: {
    chip: "Metaverse Solutions",
    heading: "Metaverse Development\nCompany In Surat",
    text: "We3vision is a metaverse development company in Surat, Gujarat, India. We build metaverse applications, virtual worlds and virtual events around your business goals and audience, for businesses in India, the USA, UK, Canada and Australia.",
    primaryLabel: "Discuss your metaverse project",
    secondaryLabel: "What we build",
  },
  story:
    "*Metaverse development* creates interactive digital experiences that can include *virtual worlds, metaverse applications, virtual events and immersive environments*. We plan every project around your *business goals and your audience*, and we use *3D development, 3D modeling and interactive 3D experiences* to make them real.\n\nWe build with *Unity, Unreal Engine, WebGL, Three.js and WebXR*, and we follow a clear process from *project discovery to deployment*. Project features and implementation requirements are discussed together during the planning stage.",
  subs: {
    chip: "What we build",
    heading: "The Metaverse\nTech We Build",
    intro: "Four ways into the metaverse: augmented, virtual, extended and mixed reality.",
    cards: [
      {
        title: "Augmented Reality\n(AR)",
        description: "Digital layers on top of the real world: product previews, interactive guides and try-ons on a phone or tablet.",
        fit: "You want people to see and try something in their own space, from a phone, without a headset.",
        problems: ["Customers cannot picture a product in their own space", "A flat catalogue that does not show the product", "Guides and manuals that are hard to follow"],
        outcomes: ["Products shown in the real world through a phone camera", "Interactive guides and visual explanations", "An easy first step into immersive technology"],
      },
      {
        title: "Virtual Reality\n(VR)",
        description: "Fully immersive virtual worlds, showrooms and training that people step into with a headset.",
        fit: "The experience needs people to feel inside a place: a showroom, a site, a training room or an event.",
        problems: ["Places that are far away, unbuilt or costly to visit", "Training that is hard or risky to practise for real", "A presentation that does not leave an impression"],
        outcomes: ["A virtual space people can walk through", "Safe, repeatable training and walkthroughs", "A memorable experience for customers and teams"],
      },
      {
        title: "Extended Reality\n(XR)",
        description: "The umbrella for AR, VR and MR: immersive experiences planned across devices and platforms.",
        fit: "You are not sure which immersive technology suits you, or you want one experience that works on several devices.",
        problems: ["Unclear which technology fits the goal", "Separate builds for every device", "No plan from idea to launch"],
        outcomes: ["A clear choice between AR, VR and MR for your goal", "One plan across devices and platforms", "A roadmap from concept to launch"],
      },
      {
        title: "Mixed Reality\n(MR)",
        description: "Virtual objects that sit in the real space around you and respond to it: demos, visualisation and teamwork.",
        fit: "Digital content has to live in the real room and react to it: product demos, design reviews or shared work.",
        problems: ["Virtual and real worlds that do not connect", "Design reviews on flat screens", "Remote teams that cannot look at the same thing"],
        outcomes: ["Virtual objects placed in real space", "Better reviews and demos of products and spaces", "Teams who look at the same model together"],
      },
    ],
  },
  process: {
    heading: "How We Build\nYour Metaverse",
    intro: "A structured, collaborative process to design, build and deploy immersive metaverse experiences.",
    items: [
      { title: "Understand business goals", text: "We discuss your business objectives, target audience, project vision and the type of virtual experience you would like to create.", points: "Business objectives\nTarget audience\nProject vision\nVirtual experience type" },
      { title: "Define the virtual experience", text: "We identify the key features, user journey, environment requirements and interaction possibilities for your project.", points: "Key features\nUser journey mapping\nInteraction possibilities" },
      { title: "Plan the digital environment", text: "We identify the virtual world structure, visual direction, 3D asset requirements and experience flow.", points: "Virtual world structure\nVisual direction & style\n3D asset requirements" },
      { title: "Develop the metaverse experience", text: "We work on the metaverse applications, virtual environments and interactive experiences based on the approved project scope.", points: "Metaverse applications\nVirtual environments\nPlatform & feature integration" },
      { title: "Test and improve", text: "We review usability, interactions, navigation and the overall experience to find areas of improvement.", points: "Usability & navigation testing\nPerformance optimization" },
      { title: "Deployment and support", text: "We prepare the project for the agreed deployment environment and discuss ongoing updates or support requirements.", points: "Launch preparation\nOngoing updates" },
    ],
  },
  tools: { heading: "The Technology\nBehind The Metaverse", items: "Unity\nUnreal Engine\nWebGL\nThree.js\nWebXR\nA-Frame\nBlender\nCinema 4D\nEthereum\nPolygon Blockchain\nIPFS\nNFT.Storage\nSpatial.io\nMozilla Hubs\nDecentraland SDK" },
  industries: {
    heading: "Virtual Worlds For\nEvery Industry",
    intro: "Metaverse experiences can be explored for many use cases. Here are some of them.",
    items: [
      { name: "Education & training", description: "Virtual learning environments, interactive educational experiences and digital training spaces." },
      { name: "Retail & e-commerce", description: "Virtual product experiences, immersive brand environments and interactive shopping concepts." },
      { name: "Gaming & entertainment", description: "Virtual worlds, interactive digital environments and immersive entertainment experiences." },
      { name: "Real estate & construction", description: "Virtual property environments, interactive spaces and digital walkthrough concepts." },
      { name: "Marketing & corporate", description: "Virtual brand experiences, digital product launches and virtual events." },
      { name: "Events & communities", description: "Virtual gatherings, interactive social environments and online community experiences." },
    ],
  },
  why: {
    heading: "Why Build Your\nMetaverse With Us",
    items: [
      { title: "Business-focused experience planning", description: "We align virtual experiences with your business goals." },
      { title: "Metaverse development services", description: "Our portfolio includes metaverse development, metaverse applications and virtual world development." },
      { title: "Interactive 3D capabilities", description: "We offer 3D development, 3D modeling and interactive 3D experience services." },
      { title: "Virtual event concepts", description: "We can also discuss virtual events and digital experiences based on your project requirements." },
      { title: "Structured development approach", description: "We follow a clear process from project discovery to deployment." },
      { title: "Custom project discussions", description: "We evaluate your requirements to identify a suitable development approach." },
    ],
  },
  faq: [
    { question: "What are metaverse solutions?", answer: "Metaverse solutions are interactive digital experiences that may include virtual worlds, metaverse applications, virtual events and immersive environments." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver metaverse projects remotely from Surat, Gujarat, India for clients in the USA, UK, Canada and Australia. We agree the scope and plan up front and keep communication clear through calls and written updates." },
    { question: "Is We3vision a metaverse development company in Surat?", answer: "Yes, We3vision Private Limited is based in Surat, Gujarat, India and offers metaverse development. Our listed services include metaverse development, metaverse applications, virtual world development and virtual events and experiences." },
    { question: "Can We3vision develop a custom virtual world?", answer: "We3vision offers virtual world development as part of its metaverse service portfolio. Project features and implementation requirements can be discussed during the planning stage." },
    { question: "Can metaverse solutions support virtual events?", answer: "Yes. Our listed services include virtual events and experiences for businesses exploring interactive digital gatherings." },
    { question: "Can metaverse experiences include 3D environments?", answer: "Yes. Metaverse projects can be planned alongside our 3D development, 3D modeling and interactive 3D experience services." },
    { question: "Which industries can use metaverse solutions?", answer: "Metaverse experiences can be explored for education, retail, gaming, real estate, marketing, corporate events and other suitable use cases." },
    { question: "How long does metaverse development take?", answer: "The timeline depends on the project scope, virtual environment complexity, features, 3D assets and required integrations." },
    { question: "How much does metaverse development cost?", answer: "The cost depends on the type of experience, design requirements, functionality, 3D development needs and deployment environment." },
    { question: "Can you help us plan a metaverse project?", answer: "Yes. We can discuss your business goals, target users, virtual experience concept and project requirements to plan the next steps." },
    { question: "How can I start a metaverse project with We3vision?", answer: "Contact We3vision with your project idea, business objectives and preferred virtual experience. Our team can review your requirements and discuss a suitable development approach." },
  ],
  related: [
    { title: "3D\nModeling", description: "3D assets and environments for virtual worlds.", href: "/3d-modeling" },
    { title: "2D/3D\nAnimation", description: "Animation, CGI and 3D visualization.", href: "/animation" },
    { title: "UI/UX\nDesign", description: "Interfaces for AR/VR, XR and metaverse environments.", href: "/ui-ux-design" },
  ],
  guide: { scene: "metaverse", chip: "Step inside", heading: "Put on the headset,\nenter the metaverse", text: "Our guide explores virtual worlds with a headset on. Click the portal to teleport to another world and move your mouse to look around.", tips: ["Welcome to the metaverse! Click the portal to teleport.","Virtual worlds, applications and events, built with Unity and Unreal.","Move your mouse: the whole world tilts with you.","Virtual showrooms, campuses and arenas are all possible."] },
  cta: { heading: "Ready To Build Your\nVirtual Experience?", text: "Discuss your metaverse idea with We3vision in Surat, India: virtual worlds, applications and immersive experiences for clients in the USA, UK, Canada and Australia.", button: "Discuss your metaverse project" },
});

// The Metaverse page: the 3D office walk (the visitor puts on a headset), the floor with Rutvi and the four cabins, the glass windows,
// a soft fade out of the black and then the sections of a normal service page (without its hero, story and guide, which the scenes replace).
export const METAVERSE_SECTIONS: PageSection[] = [
  // the normal service hero (same words as before)
  ...METAVERSE_FULL_SECTIONS.slice(0, 1),
  // after the black screen: the office seen from above: Rutvi sits down and the four teams (AR, VR, XR, MR) work in the corners
  section("vrFloor", {
    heading: "Tech services\nwe offer in\nthe metaverse",
    hint: "Scroll to follow Rutvi",
    name: "Rutvi",
    tipTitle: "Which team is for you?",
    tipText: "Point at one of the four teams to see what it builds and which industries it can help. On a phone, tap a team.",
    industriesTitle: "If you work in one of these industries, this tech service is possible for you",
    ctaLabel: "Talk to us",
    govTitle: GOV_TITLE,
    projects: GOV_PROJECTS,
    cabins: [{"code":"AR","name":"Augmented Reality","text":"Digital layers on top of the real world: product previews, interactive guides and try-ons on a phone or tablet.","industries":"Retail & e-commerce\nReal estate\nFurniture & interiors\nEducation\nHealthcare\nTourism & hospitality"},{"code":"VR","name":"Virtual Reality","text":"Fully immersive virtual worlds, showrooms and training that people step into with a headset.","industries":"Real estate\nEducation & training\nGaming & entertainment\nManufacturing\nHealthcare\nEvents & exhibitions"},{"code":"XR","name":"Extended Reality","text":"The umbrella for AR, VR and MR: immersive experiences planned across devices and platforms.","industries":"Retail & fashion\nAutomotive\nEducation\nHealthcare\nCorporate & HR\nMedia & events"},{"code":"MR","name":"Mixed Reality","text":"Virtual objects that sit in the real space around you and respond to it: demos, visualisation and teamwork.","industries":"Architecture & construction\nManufacturing\nHealthcare\nEngineering & design\nAutomotive\nCorporate teams"}],
  }),
  // (the glass windows scene "vrSpace" was taken off the page on request; the section type is still available in the admin panel)
  // Rutvi walks back into the office as the stage scrolls away: the sections of a normal service page follow at once (what we build, process, devices ...)
  // the page of a normal service, with the device wall in place of the tools cloud and the quiz before the contact form
  ...METAVERSE_FULL_SECTIONS.slice(3).flatMap((sec) => (sec.type === "process" ? [section("vrProcess", sec.data as SectionData<"vrProcess">, "process")] : sec.type === "tags" ? [section("vrDevices", DEVICES, "devices")] : sec.type === "contact" ? [section("vrQuiz", QUIZ, "quiz"), sec] : [sec])),
];

// ---------------------------------------------------------------------------------------------------------------------
// UI/UX Design (/ui-ux-design)
// ---------------------------------------------------------------------------------------------------------------------
export const UIUX_SEO = {
  title: "UI/UX Design Company in Surat, India | We3vision",
  description:
    "UI/UX design company in Surat, India: UX research, Figma prototypes, design systems and redesign for clients in the USA, UK, Canada and Australia.",
};
export const UIUX_SECTIONS = build({
  seo: UIUX_SEO,
  hero: {
    chip: "UI/UX Design",
    heading: "UI/UX Design\nCompany",
    text: "We3vision Private Limited is a UI/UX design company in Surat, Gujarat, India. Our UI/UX design services cover website UI/UX design, mobile app UI/UX design and UI/UX redesign that attract users and guide them to action, for businesses in India, the USA, UK, Canada and Australia.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we design",
  },
  story:
    "Our *UI/UX design services in Surat* help businesses create digital products that are *visually clear, easy to use and built to guide users to action*. From *UX research and wireframes to pixel-perfect prototypes*, we make sure every click, swipe and scroll feels effortless.\n\nWe work in *Figma, Adobe XD, Sketch and InVision*, hand over *editable design files and design systems*, and because We3vision also has a full development team, your designs can become *working websites and apps*.\n\nWorking from Surat, Gujarat, India, we also design for *clients in the USA, UK, Canada and Australia*, remotely, with the plan agreed up front. *UI/UX redesign* of an existing website or app is part of the work too.",
  subs: {
    chip: "What we design",
    heading: "Our UI/UX\nDesign Services",
    intro: "From first UX research to wireframes, prototypes, a design system and the redesign of an existing product.",
    cards: [
      { title: "UX Research\n& Strategy", description: "User interviews, competitor analysis and behavioral mapping to define a clear design direction before any screen is drawn." },
      { title: "Information\nArchitecture", description: "Navigation hierarchy, content grouping and overall site or app flow, so users find what they need without searching." },
      { title: "Wireframes &\nPrototypes", description: "Low and high fidelity wireframes and interactive prototypes in Figma to test functionality before development." },
      { title: "UI Design &\nVisual Branding", description: "Modern website and mobile app interfaces using colour, typography, iconography and layout balance that carry your brand's tone." },
      { title: "Interaction &\nMotion Design", description: "Subtle animations and transitions, from hover effects to loading states, that make every interaction feel natural and clear." },
      { title: "Responsive &\nAdaptive Design", description: "Designs for web, mobile, tablet or even AR/VR environments so your website and app feel consistent everywhere." },
      { title: "Usability Testing\n& Optimization", description: "Usability tests with real users to find friction points, then refinements based on what they tell us." },
      { title: "Design Systems\n& Style Guides", description: "Reusable UI kits, colour libraries and style guidelines, so every digital touchpoint stays consistent." },
      { title: "UI/UX Audit\n& Redesign", description: "A detailed audit of an existing website or app, then a UI/UX redesign that improves performance, accessibility and engagement." },
    ],
  },
  process: {
    heading: "How We Design\nYour Product",
    intro: "From UX research to a tested prototype, in a process you can follow every step of the way.",
    items: [
      { title: "Research & discovery", text: "We learn about your business goals, target audience and competitors through user research, stakeholder interviews and market analysis, so design decisions rest on facts.", points: "User research\nStakeholder interviews\nMarket analysis" },
      { title: "User personas & journey mapping", text: "We create detailed user personas and map the journeys, finding what motivates users and where they may face friction, on desktop and on mobile." },
      { title: "Information architecture & wireframing", text: "We structure the content and features logically, then outline the layout and navigation flow in simple wireframes that you can review early.", points: "Information architecture\nWireframes" },
      { title: "UI design & visual direction", text: "Our designers craft pixel-perfect layouts using consistent colour palettes, typography, icons and components that match your brand identity, for web and mobile." },
      { title: "Interactive prototyping", text: "We build clickable prototypes in Figma, Adobe XD or InVision so you can test how the product works before development begins, and share them with you for review.", points: "Figma\nAdobe XD\nInVision" },
      { title: "Usability testing & optimization", text: "We test with real users to see how they interact with the prototype, and use the feedback to refine the design before hand-off to developers.", points: "Usability tests\nFeedback and iteration" },
    ],
  },
  tools: { heading: "Our Design\nTool Stack", items: "UI Design\nPrototyping\nUX Research\nAnimation & Interaction\nFigma\nAdobe XD\nSketch\nInVision" },
  industries: {
    heading: "Design For\nEvery Industry",
    intro: "We adapt our approach to your industry, audience and brand identity, whether you are in Surat or abroad.",
    items: [
      { name: "Health & beauty", description: "Interfaces for hospitals, clinics, telemedicine apps and diagnostic portals with clean, easy-to-use layouts and accessible navigation for patients." },
      { name: "Real estate & architecture", description: "Immersive property browsing, project showcase websites and interior visualization apps that turn interest into enquiries." },
      { name: "Startups & emerging businesses", description: "From MVP wireframes and prototypes to full-scale product UI/UX that communicates innovation and clarity." },
      { name: "Retail & e-commerce", description: "Visually appealing, conversion-focused shopping experiences, from product filtering to a simple checkout flow." },
      { name: "Manufacturing & engineering", description: "Interfaces for factory dashboards, process monitoring systems and training tools that teams can read at a glance." },
      { name: "Entertainment & media", description: "UI/UX for OTT platforms, gaming apps, event management sites and streaming portals, built around easy discovery." },
      { name: "Education & training", description: "Engaging learning platforms, learning management systems (LMS) and apps for schools, colleges and edtech startups, with clear lesson flows." },
      { name: "Tourism & hospitality", description: "Travel portals, booking systems and hospitality apps that simplify exploring destinations and booking trips, on any screen." },
    ],
  },
  why: {
    heading: "Design That\nPerforms",
    items: [
      { title: "User-first design philosophy", description: "Everything we design starts with empathy: user needs, pain points and emotions, so the interface fits real people." },
      { title: "Data-driven creativity", description: "Our designs are backed by analytics, usability testing and behavioral insights, not just taste." },
      { title: "Industry-specific expertise", description: "We adapt our approach to your industry, audience segment and brand identity, in India and abroad." },
      { title: "Collaborative & transparent process", description: "We act as part of your team with regular feedback and a plan agreed up front, remotely for clients in the USA, UK, Canada and Australia." },
      { title: "Design systems that scale", description: "Reusable UI kits and design systems keep your product consistent and make future updates and developer hand-off faster." },
      { title: "End-to-end delivery & support", description: "We collaborate with developers, perform handoff checks and keep suggesting improvements after launch, from one team in Surat." },
    ],
  },
  faq: [
    { question: "What is UI/UX design?", answer: "UI/UX design is the work of planning how a website or app works (UX) and how it looks (UI), so people can use it easily. It includes UX research, wireframes, prototypes, interface design and usability testing. We3vision offers these UI/UX design services from Surat, Gujarat, India." },
    { question: "What is the difference between UI and UX design?", answer: "UX design is how the product works and feels to use, while UI design is how it looks: colour, typography, icons and layout. UX decides the flow and structure, and UI gives it a clear, branded face. A good product needs both, and we handle both in one process." },
    { question: "What do you deliver in a UI/UX design project?", answer: "For website and mobile app UI/UX design you receive wireframes, interactive prototypes, final interface designs and a design system or style guide, depending on your scope. We hand over editable Figma or XD files along with assets. The exact list is agreed with you before work starts." },
    { question: "What is your UI/UX design process?", answer: "Our process has six steps: research and discovery, user personas and journey mapping, information architecture and wireframing, UI design, interactive prototyping, and usability testing. You can review the work at each step. Feedback is collected along the way, not only at the end." },
    { question: "How much does UI/UX design cost, and how long does it take?", answer: "Cost and timeline depend on the number of screens, the research needed and the complexity of the product, so we plan them after understanding your requirements. You receive a project-specific quote and plan before design starts. We do not quote a fixed price without knowing the scope." },
    { question: "Can you redesign my existing website or app?", answer: "Yes, UI/UX redesign is part of our work. We start with a detailed audit of what works and what does not, then redesign to improve performance, accessibility and engagement. Your existing content and brand can be kept where they still serve you." },
    { question: "How do you test the design before launch?", answer: "We test clickable prototypes with real users to find friction points before development begins. We then refine the design from their feedback. This catches problems early, when they are easier to fix." },
    { question: "Do you share editable design files and hand off to developers?", answer: "Yes, we provide all Figma or XD files with assets and design systems, and we run handoff checks with your developers. Because We3vision also has a full development team, we can build the design into a working website or app. Your own developers can use the files as well." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver UI/UX design remotely from Surat, Gujarat, India for clients in the USA, UK, Canada and Australia. We agree the plan and scope up front, share design previews and collect your feedback regularly. We3vision has worked with clients from the USA, Canada, UK, Germany, UAE, Singapore and Australia." },
    { question: "Why hire a UI/UX design company in Surat, India?", answer: "A UI/UX design company in Surat gives you designers and developers in one team, working with you remotely on a plan agreed up front. We3vision Private Limited has been building digital products since 2019. You can hire UI/UX designers from India without managing separate vendors for design and build." },
  ],
  related: [
    { title: "Web\nDevelopment", description: "Turn your designs into a fast, responsive website.", href: "/webdev" },
    { title: "Mobile App\nDevelopment", description: "Build your app designs for Android and iOS.", href: "/mobile" },
    { title: "Brand\nDesign", description: "Brand identity, logo and guidelines.", href: "/brand-identity" },
    { title: "Graphics &\nUI/UX Design", description: "Website interfaces, brand visuals and marketing graphics.", href: "/graphics" },
  ],
  guide: { scene: "figma", chip: "Inside the design file", heading: "From wireframe\nto final design", text: "A small Figma, made to be played with: pick a layer, drag it, change its colour and switch from the grey wireframe to the finished design.", tips: ["Switch from the wireframe to the final design."] },
  cta: { heading: "Ready To Design\nSomething Great?", text: "Tell us about your product and we will suggest the right design approach, timeline and cost, from Surat to your market.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// CRM Development (/crm)
// ---------------------------------------------------------------------------------------------------------------------
export const CRM_SEO = {
  title: "Custom CRM Development Company in Surat | We3vision",
  description:
    "Custom CRM development company in Surat, India. Sales, support and automation CRMs for clients in India, the USA, UK, Canada and Australia. Get a quote.",
};
export const CRM_SECTIONS = build({
  seo: CRM_SEO,
  hero: {
    chip: "CRM Development",
    heading: "CRM Development\nCompany In Surat",
    text: "We3vision Private Limited is a CRM development company in Surat, Gujarat, India. We provide custom CRM development services: sales CRM, support CRM, CRM integration and CRM automation that centralize your data, for businesses in India, the USA, UK, Canada and Australia.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we build",
  },
  story:
    "As a *CRM development company in Surat*, we provide *custom CRM software development* for every size, from a *lightweight CRM for a growing startup* to a *full-scale enterprise system with API integrations*, aligned with your operations, goals and customer journey.\n\nYour CRM is built *from the ground up around your workflows, teams and business model*, with *modules, dashboards, roles and permissions*, *CRM automation* and connections to the tools you already use: *ERP and CMS systems, HubSpot, Salesforce, email, SMS and the WhatsApp Business API*.\n\nWorking from Surat, Gujarat, India, we also build *custom CRMs for clients in the USA, UK, Canada and Australia*, remotely, with the plan agreed up front.",
  subs: {
    chip: "What we build",
    heading: "CRM Systems For\nEvery Team",
    intro: "Six kinds of CRM, plus the ERP, lead tracking and inventory tools that go with them, all custom-built.",
    cards: [
      { title: "Sales\nCRM", description: "Manage leads, track pipelines and forecast deals in a sales CRM built around how your team sells." },
      { title: "Marketing\nCRM", description: "Automate campaigns, track engagement, segment users and improve conversions with CRM automation." },
      { title: "Customer Support\nCRM", description: "Centralize tickets, manage SLAs, chat integrations and feedback loops in one support CRM." },
      { title: "ERP Software\n& Connectors", description: "ERP and CMS connectors so all your systems share one source of data, through CRM integration." },
      { title: "Lead Tracking\n& Automation", description: "Pipelines and automation with email, analytics and the WhatsApp Business API." },
      { title: "Inventory\n& Support", description: "Track stock and customer requests, with team onboarding, training and ongoing support after go-live." },
    ],
  },
  process: {
    heading: "How We Build\nYour CRM",
    intro: "A simple, collaborative process, from the CRM structure to training and long-term support, planned with you up front.",
    items: [
      { title: "Planning & architecture design", text: "We define the CRM structure, modules and integrations with you, ensuring flexibility and scalability for growth.", points: "CRM structure and modules\nIntegration points and scalability\nDashboards and data hierarchies" },
      { title: "UI/UX design", text: "We design a clean, intuitive interface to enhance usability for sales, marketing and support teams." },
      { title: "Development & customization", text: "We build and customize your CRM, integrating tools like email automation, analytics and contact management.", points: "Core CRM engine and automation\nFields, roles and permissions\nERP/CMS connectors" },
      { title: "Integration with existing systems", text: "We integrate ERP, CMS or third-party apps such as HubSpot, Salesforce or the WhatsApp Business API, so your CRM fits your existing tools.", points: "3rd-party API integrations" },
      { title: "Testing & quality assurance", text: "We test modules for data accuracy, performance and smooth workflows to ensure reliability.", points: "Functional and performance QA\nData validation and security" },
      { title: "Deployment & user training", text: "We deploy the CRM and train teams to ensure everyone understands features and workflows.", points: "Go-live and configuration\nTeam onboarding and training" },
      { title: "Post-launch support & optimization", text: "We monitor performance, ship updates and optimize to improve efficiency and ROI.", points: "Monitoring and updates\nWorkflow and ROI optimization" },
    ],
  },
  tools: { heading: "The Technology\nBehind Our CRMs", items: "Laravel\nNode.js\nDjango\nReact\nAngular\nVue.js\nMySQL\nMongoDB\nPostgreSQL\nFirebase\nAWS\nREST & GraphQL APIs\nZapier\nHubSpot APIs\nDocker\nGit\nCI/CD Pipelines" },
  industries: {
    heading: "CRM For Every\nKind Of Business",
    intro: "The kind of CRM depends on the work your team does. Here are some CRM types we build.",
    items: [
      { name: "Sales CRM", description: "Leads, pipelines and deal forecasts in one view, so sales teams follow up and close more efficiently." },
      { name: "Marketing CRM", description: "Campaigns, engagement tracking and user segments that help improve conversions." },
      { name: "Customer support CRM", description: "One place for tickets, SLAs, chat integrations and customer feedback loops." },
      { name: "Project-based CRM", description: "Tasks, time tracking, file sharing and client communication connected in one project CRM." },
      { name: "Healthcare / clinic CRM", description: "Patient management, scheduling, reports and secure data handling for clinics (HIPAA-ready)." },
      { name: "Real estate CRM", description: "Property listings, lead scoring, appointment management and CRM-to-website sync for real estate teams." },
    ],
  },
  why: {
    heading: "A CRM That Works\nThe Way You Do",
    items: [
      { title: "Built from the ground up", description: "A custom CRM tailored to your workflows and business model, built in Surat, India for teams in India, the USA, UK, Canada and Australia." },
      { title: "User-centric design", description: "We design clean, modern dashboards that reduce learning curves and increase user adoption across your sales, marketing and support teams." },
      { title: "Modular & scalable", description: "Add modules, integrations and automations as you grow, so your custom CRM evolves with your business." },
      { title: "Automation-first approach", description: "CRM automation that helps you eliminate repetitive tasks, reduce human error and scale faster with smart workflows and triggers." },
      { title: "Security & compliance ready", description: "Your data is protected with enterprise-grade encryption, access control and audit logs, GDPR and HIPAA ready." },
    ],
  },
  faq: [
    { question: "What is a custom CRM?", answer: "A custom CRM is customer relationship management software built around your own workflows, teams and data instead of a fixed template. It can cover leads and pipelines, support tickets, automation, dashboards, roles and permissions. We3vision builds custom CRM software from Surat, Gujarat, India." },
    { question: "Custom CRM or a ready-made CRM: which is better?", answer: "A custom CRM is usually the better fit when a ready-made tool is overkill, expensive or hard to adapt to how your team works. Ready-made CRMs such as HubSpot or Salesforce suit standard processes, and we can integrate with them too. We build the CRM tailored to your business needs, workflows and goals." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we build custom CRMs remotely from Surat, Gujarat, India for clients in the USA, UK, Canada and Australia. We agree the modules, integrations and plan up front and keep communication clear throughout." },
    { question: "Why choose a CRM development company in Surat, India?", answer: "A CRM development company in Surat gives you a team that builds custom CRMs around your workflows and works with you remotely. We3vision Private Limited has been building software since 2019 and has worked with clients from the USA, UK, Canada, Australia, Germany, UAE and Singapore. You get one clear plan before work starts." },
    { question: "What features can a custom CRM include?", answer: "A custom CRM can include lead and pipeline tracking, deal forecasting, campaign automation, support tickets with SLAs, dashboards, and roles and permissions. We choose the modules with you, then build, test and extend them as your needs grow." },
    { question: "Can I integrate email, SMS or WhatsApp into the CRM?", answer: "Yes, we integrate email, SMS and the WhatsApp Business API, along with ERP and CMS systems and third-party apps such as HubSpot and Salesforce. We then automate messages, follow-ups and workflows on top of them." },
    { question: "How secure is the data in a custom CRM?", answer: "Your CRM data is protected with encryption, access control and audit logs, and the system is built to be GDPR and HIPAA ready. We also validate data and test security before go-live. Roles and permissions decide who on your team sees what." },
    { question: "Can you migrate data from our old system?", answer: "Yes, we handle data migration from spreadsheets, legacy CRMs and third-party apps with minimal downtime. We check the migrated data for accuracy before your team starts using the new CRM." },
    { question: "How much does CRM development cost, and how long does it take?", answer: "Cost and timeline depend on your features, integrations and scale, so we plan them after understanding your requirements. We offer transparent pricing for startups, SMBs and enterprises. You receive a project-specific quote before development starts." },
    { question: "Do you train our team and support the CRM after launch?", answer: "Yes, we deploy the CRM, train your team and continue with post-launch support. This includes monitoring, updates and workflow optimization, and sessions can run remotely for teams in the USA, UK, Canada and Australia." },
  ],
  related: [
    { title: "Web\nDevelopment", description: "Connect your website and forms to the CRM.", href: "/webdev" },
    { title: "AI\nDevelopment", description: "Lead qualification bots and predictive models for your CRM.", href: "/ai" },
    { title: "Mobile App\nDevelopment", description: "A mobile app for your sales and support teams.", href: "/mobile" },
    { title: "UI/UX\nDesign", description: "Dashboards your team enjoys using.", href: "/ui-ux-design" },
  ],
  cta: { heading: "Let's Build A CRM That\nWorks The Way You Do", text: "Tell us how your team sells, supports and follows up, and we will build a custom CRM that fits your workflow, from Surat to your market.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// 2D & 3D Animation (/animation)
// ---------------------------------------------------------------------------------------------------------------------
export const ANIMATION_SEO = {
  title: "2D & 3D Animation Company in Surat, India | We3vision",
  description:
    "2D and 3D animation company in Surat, Gujarat, India. CGI and product visualization for clients in the USA, UK, Canada and Australia. Ask for a quote.",
};
export const ANIMATION_SECTIONS = build({
  seo: ANIMATION_SEO,
  hero: {
    chip: "2D/3D Animation",
    heading: "Bring Your Ideas To Life\nWith 2D & 3D Animation",
    text: "We3vision is a 2D and 3D animation company in Surat, Gujarat, India. We create 2D animation, 3D animation, CGI and product visualization for businesses in India, the USA, UK, Canada and Australia, matched to your project requirements.",
    primaryLabel: "Discuss your animation project",
    secondaryLabel: "Our animation services",
  },
  story:
    "*2D and 3D animation* is one of the clearest ways to explain a product, tell a brand story or present an idea. We create *explainer animation, 3D animation, CGI and 3D visualization* in a style that fits your *audience and your goals*.\n\nOur animation and 3D capabilities connect with broader digital work too, including *AR/VR, metaverse solutions and creative design services*. Every project starts with understanding your objectives and ends with the animation delivered in the format you need.",
  subs: {
    chip: "Tailored visual experiences",
    heading: "Our Animation\nServices",
    intro: "Three kinds of animation work, each tailored to your creative goals and project requirements.",
    cards: [
      { title: "2D\nAnimation", description: "2D animation for explainer videos, promotional campaigns, educational content and brand storytelling." },
      { title: "3D\nAnimation", description: "Bring products, concepts and digital experiences to life with 3D modeling, 3D product visualization and animation.", href: "/3d-modeling" },
      { title: "CGI & 3D\nVisualization", description: "Present concepts and products through visual content that communicates product ideas and supports promotions." },
    ],
  },
  process: {
    heading: "How We Create\nYour Animation",
    intro: "A structured step-by-step workflow with clear creative planning, production excellence and timely delivery.",
    items: [
      { title: "Understand your requirements", text: "We start by understanding your project objectives, target audience, creative direction and expected outcomes.", points: "Project objectives\nAudience & creative direction\nAnimation style & storytelling" },
      { title: "Develop the creative concept", text: "We define the visual concept, animation style, storytelling approach and key elements required for your project.", points: "Key visual concept" },
      { title: "Plan the visuals", text: "We organize the storyboard, design elements, scenes and animation flow in accordance with the project scope.", points: "Scene-by-scene storyboard\nAsset & scene flow" },
      { title: "Animation & 3D production", text: "The animation and 3D elements are developed in line with the approved creative direction and technical requirements.", points: "Motion design & 3D modeling\nVisual effects, lighting & rendering" },
      { title: "Review & refinement", text: "We review the developed visuals and make the necessary refinements based on your feedback and project requirements.", points: "Client review & feedback\nTiming and asset refinements" },
      { title: "Final delivery", text: "The completed animation is prepared in the required format and delivered as per the agreed project scope.", points: "High-resolution rendering\nDelivery-ready package" },
    ],
  },
  tools: { heading: "The Tools\nBehind Our Animation", items: "Adobe After Effects\nAdobe Illustrator\nBlender\nAutodesk Maya\nCinema 4D" },
  industries: {
    heading: "Animation For\nEvery Industry",
    intro: "Animated content can help many kinds of businesses. Here are some of them.",
    items: [
      { name: "E-commerce & retail", description: "Product visualization and animation to showcase products, highlight features and support marketing campaigns." },
      { name: "Real estate & construction", description: "3D visualization and animation of architectural concepts, spaces and property ideas." },
      { name: "Education & e-learning", description: "Animated content for explanations, training materials and learning experiences." },
      { name: "Technology & software", description: "Visual storytelling that explains products, software concepts and technical workflows." },
      { name: "Marketing & creative", description: "Animated promotional content, campaign visuals and creative brand experiences." },
      { name: "Gaming & immersive experiences", description: "3D animation and interactive visual experiences for gaming and immersive digital projects." },
    ],
  },
  why: {
    heading: "Why Animate\nWith We3vision",
    items: [
      { title: "Project-focused solutions", description: "From Surat, Gujarat, India we serve clients in the USA, UK, Canada and Australia, and shape each animation around your goals." },
      { title: "Creative & 3D capabilities", description: "Our portfolio covers 3D modeling, 3D product visualization, 3D animation and interactive 3D experiences." },
      { title: "Structured development process", description: "A well-defined process organizes creative planning, production, feedback and final delivery." },
      { title: "Connected digital services", description: "Animation and 3D work can be used for broader digital experiences, including AR/VR, metaverse solutions and creative design." },
    ],
  },
  faq: [
    { question: "Which 2D and 3D animation services do you offer?", answer: "We3vision offers 2D animation, 3D animation, CGI and 3D product visualization from Surat, India. Our service portfolio covers 3D animation, 3D modeling, 3D product visualization and interactive 3D experiences. The availability of specific 2D animation and CGI deliverables depends on your project requirements." },
    { question: "Can you create custom 3D animation for my business?", answer: "Yes, custom 3D animation requirements can be discussed as per your project objectives, creative concept, visual requirements and expected deliverables." },
    { question: "What is the difference between 2D and 3D animation?", answer: "2D animation follows two-dimensional artwork and motion, while 3D animation creates depth in the visual. The right approach depends on your content, audience and project goals." },
    { question: "Can you create 3D product visualization?", answer: "3D product visualization falls under We3vision's 3D service portfolio. The final output and level of detail depend on the product, reference materials and project requirements." },
    { question: "How long does an animation project take?", answer: "The timeline depends on the type of animation, complexity of the project, number of scenes, revisions and deliverables. A timeline can be discussed after reviewing your project scope." },
    { question: "How much do 2D and 3D animation services cost?", answer: "The cost depends on the project complexity, time, visual quality, design requirements and production scope. Contact our team to discuss your requirements and receive a project-specific quotation." },
    { question: "Can animation be used for marketing and promotional content?", answer: "Yes, animation can be used to explain products, communicate concepts, present services and create promotional visuals. The suitable format depends on your campaign goals and target audience." },
    { question: "How do I start an animation project with We3vision?", answer: "Share your project idea, animation type, reference materials, expected deliverables and timeline. Our team can review your requirements and discuss the next steps." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver animation projects remotely for clients in the USA, UK, Canada and Australia, as well as India. We keep communication clear and agree the plan, scope and deliverables up front." },
  ],
  related: [
    { title: "3D\nModeling", description: "3D assets, product visuals and digital environments.", href: "/3d-modeling" },
    { title: "Metaverse\nSolutions", description: "Virtual worlds and immersive experiences.", href: "/metaverse" },
    { title: "Graphics &\nUI/UX Design", description: "Brand visuals and marketing graphics.", href: "/graphics" },
    { title: "UI/UX\nDesign", description: "Interfaces for websites and apps.", href: "/ui-ux-design" },
  ],
  guide: { scene: "aftereffects", chip: "Inside the timeline", heading: "Press play,\nscrub the frames", text: "This is how an animator works in After Effects: a composition, layers and keyframes on a timeline. Press play, or drag the playhead to move through the frames of a bouncing ball.", tips: ["Drag the timeline to scrub the animation frame by frame."] },
  cta: { heading: "Have An Animation\nProject In Mind?", text: "Turn your concept into engaging visual content with animation and 3D solutions tailored to your goals. Share your requirements with our team and discuss the right approach.", button: "Discuss your animation project" },
});

// ---------------------------------------------------------------------------------------------------------------------
// 3D Modeling (/3d-modeling)
// ---------------------------------------------------------------------------------------------------------------------
export const MODELING_SEO = {
  title: "3D Modeling Services in Surat, India | We3vision",
  description:
    "3D modeling services from Surat, Gujarat, India: product models, assets and 3D visualization for clients in the USA, UK, Canada and Australia. Get a quote.",
};
export const MODELING_SECTIONS = build({
  seo: MODELING_SEO,
  hero: {
    chip: "3D Modeling",
    heading: "Bring Your Concepts To Life\nWith Custom 3D Modeling",
    text: "We3vision provides 3D modeling services from Surat, Gujarat, India for businesses in India, the USA, UK, Canada and Australia: detailed 3D product models, assets and digital environments built for your project requirements.",
    primaryLabel: "Discuss your 3D project",
    secondaryLabel: "What we model",
  },
  story:
    "*3D modeling* is the process of creating digital three-dimensional objects or environments. They can be used for *product visualization, animation, games, immersive experiences* and other digital applications.\n\nWe develop 3D models from your *concepts, reference images or product specifications*, with *PBR materials, realistic textures and lighting*, and we optimize them for the *platform* they are meant for, whether that is a product page, an animation or an *AR, VR or metaverse* experience.",
  subs: {
    chip: "What we model",
    heading: "Our 3D\nServices",
    intro: "From a single asset to a complete visualization project.",
    cards: [
      { title: "3D Product\nModels", description: "Custom 3D product modeling and product visualization for presentations, catalogs and interactive shopping." },
      { title: "3D Assets &\nEnvironments", description: "Characters, props and digital environments for games, walkthroughs and immersive experiences." },
      { title: "Texturing &\nLighting", description: "PBR materials, realistic textures, lighting setups and look development so models look as intended." },
      { title: "Optimization\nfor Platforms", description: "High and low-poly structures and polygon optimization for interactive, AR, VR and metaverse use." },
      { title: "3D\nAnimation", description: "Animate your 3D assets for explainers, promotions and brand storytelling.", href: "/animation" },
      { title: "Interactive 3D\nExperiences", description: "3D development for interactive experiences, immersive environments and virtual worlds.", href: "/metaverse" },
    ],
  },
  process: {
    heading: "How We Create\nYour 3D Models",
    intro: "A structured, end-to-end workflow that transforms concepts and specifications into high-fidelity 3D assets.",
    items: [
      { title: "Project discovery & concept planning", text: "We understand your project goals and reference materials, and decide the modeling requirements, output formats and visual style to plan the workflow.", points: "Goals & reference analysis\nFormat & visual scope\nPrecision high/low-poly structures" },
      { title: "3D modeling & asset creation", text: "Our team develops the 3D models based on your concepts, reference images or product specifications.", points: "Concept & specification modeling" },
      { title: "Texturing, materials & lighting", text: "We apply visual details to ensure the 3D models show the intended appearance.", points: "PBR materials & realistic textures\nLighting setups & look development" },
      { title: "Optimization & refinement", text: "We review the models and optimize the assets for the relevant platform or experience as needed.", points: "Target platform polygon optimization\nQuality assurance & detailed review" },
      { title: "Final delivery & integration", text: "We prepare your completed 3D assets for the intended application, such as product visualization, animation or interactive experiences.", points: "Industry-standard format export\nIntegration-ready asset delivery" },
    ],
  },
  tools: { heading: "The Tools\nBehind Our 3D Work", items: "Autodesk 3ds Max\nAutodesk Maya\nBlender\nCinema 4D\nAdobe Illustrator" },
  industries: {
    heading: "3D For\nEvery Industry",
    intro: "3D models can be used in many kinds of projects. Here are some of them.",
    items: [
      { name: "E-commerce & retail", description: "3D product visuals that support product presentation, digital catalogs and interactive shopping experiences." },
      { name: "Real estate & architecture", description: "3D environments and visual assets for property presentations, walkthrough concepts and architectural visualization." },
      { name: "Gaming & entertainment", description: "3D assets, environments and visual elements for games and interactive entertainment." },
      { name: "Marketing & advertising", description: "3D product visuals, branded assets and animations for promotional campaigns and digital marketing content." },
      { name: "Education & training", description: "3D models and visual resources for educational content, training concepts and interactive learning." },
      { name: "Manufacturing & automotive", description: "3D visualization for product concepts, equipment presentations and interactive design experiences." },
    ],
  },
  why: {
    heading: "Why Choose We3vision\nFor 3D Modeling",
    items: [
      { title: "Custom 3D solutions", description: "Our 3D modeling services in Surat, India are made to your project requirements and references, for clients in the USA, UK, Canada and Australia too." },
      { title: "Design and technology integration", description: "Our 3D development can be combined with related creative and technology projects such as product visualization, animation and interactive 3D experiences." },
      { title: "Project-focused workflow", description: "A consistent approach from concept planning to asset creation, refinement and delivery." },
      { title: "Assets for different digital experiences", description: "3D models for product presentation, immersive experiences, digital environments and other approved applications." },
      { title: "Scalable project scope", description: "From individual 3D assets to broader visualization projects, you can discuss the scope, requirements and deliverables with us." },
    ],
  },
  faq: [
    { question: "What is 3D modeling?", answer: "3D modeling is the process of creating digital three-dimensional objects or environments. These can be used for product visualization, animation, games, immersive experiences and other digital applications." },
    { question: "Which 3D modeling services does We3vision offer?", answer: "We3vision offers 3D modeling and 3D product visualization from Surat, India. Our listed 3D services include 3D development, 3D product visualization, 3D modeling, 3D animation and interactive 3D experiences. The specific deliverables depend on your project requirements." },
    { question: "Can you create custom 3D product models?", answer: "Yes, custom 3D product modeling can be discussed based on your product references, design requirements and intended use. Product complexity, formats and deliverables are confirmed before starting the project." },
    { question: "Can 3D models be used in AR, VR or metaverse projects?", answer: "Yes. 3D models can be used as assets in AR, VR and metaverse experiences. The modeling and optimization requirements are determined by the target platform and the planned interactions." },
    { question: "What information do you need to start a 3D modeling project?", answer: "Share your project concept, reference images, product specifications, preferred visual style, intended platform and expected deliverables. Our team can then discuss the scope and requirements." },
    { question: "How long does a 3D modeling project take?", answer: "The timeline depends on the complexity of the model, level of detail, number of assets, revisions and project requirements. We3vision can provide it after reviewing your project scope." },
    { question: "Can you optimize 3D models for interactive experiences?", answer: "3D asset optimization can be considered when the project needs performance for interactive or immersive platforms. The approach depends on the target device and application." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver 3D modeling projects remotely for clients in the USA, UK, Canada and Australia, as well as India. We keep communication clear and agree the plan, scope and deliverables up front." },
    { question: "How much do 3D modeling services cost?", answer: "The cost depends on the complexity of the model, design requirements, number of assets, texturing, revisions and final deliverables. Contact We3vision for a project-specific estimate." },
  ],
  related: [
    { title: "2D/3D\nAnimation", description: "Animation, CGI and 3D visualization.", href: "/animation" },
    { title: "Metaverse\nSolutions", description: "Virtual worlds that use your 3D assets.", href: "/metaverse" },
    { title: "Graphics &\nUI/UX Design", description: "Brand visuals and interfaces.", href: "/graphics" },
  ],
  cta: { heading: "Bring Your 3D\nConcept To Life", text: "Do you have a product, character, environment or creative idea that you want to see in 3D? Tell us about your project and discuss the right approach.", button: "Start your 3D project" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Graphics & UI/UX Design (/graphics)
// ---------------------------------------------------------------------------------------------------------------------
export const GRAPHICS_SEO = {
  title: "Graphic Design Company in Surat, India | We3vision",
  description:
    "Graphic design company in Surat, Gujarat, India: logos, brand identity and packaging for clients in the USA, UK, Canada and Australia. Get in touch.",
};
// Graphic design plans (owner asked for plans on 2026-11-10; the prices are a starting point and are edited in Admin > Pages > Plans & pricing)
const GRAPHICS_PLANS = section(
  "plans",
  {
    chip: "Design plans",
    heading: "Graphic Design Plans\nThat Fit Your Business",
    intro: "Monthly design plans for businesses that need fresh creatives all the time. Pick one, and change it when your business grows.",
    look: "cards",
    plans: [
      {
        name: "Starter",
        tag: "For small businesses and new pages",
        badge: "",
        priceNote: "Starting from",
        price: "₹9,999",
        period: "/ month",
        summary: "A steady flow of on-brand social media and print designs.",
        features: "8 social media posts\n1 flyer or poster\n2 revision rounds on each design\nPNG, PDF and editable source files\n- Brochure or catalogue\n- Ad creatives",
        delivery: "Each design in 2 to 3 working days",
        buttonLabel: "Choose Starter",
        buttonHref: "#contact",
      },
      {
        name: "Business",
        tag: "For brands that post and promote often",
        badge: "Most chosen",
        priceNote: "Starting from",
        price: "₹24,999",
        period: "/ month",
        summary: "Social media, ads and print materials designed together so everything looks like one brand.",
        features: "20 social media posts, stories and carousels\n4 ad creatives\n2 print designs (flyer, poster or standee)\nBrochure or catalogue design\nOn-brand templates for your team\n3 revision rounds on each design",
        delivery: "Each design in 2 to 3 working days",
        buttonLabel: "Choose Business",
        buttonHref: "#contact",
      },
      {
        name: "Studio",
        tag: "For companies that need a design team",
        badge: "",
        priceNote: "Starting from",
        price: "₹49,999",
        period: "/ month",
        summary: "A dedicated designer for all your creative work, from social media to packaging and presentations.",
        features: "40 social media designs\nAd creatives for every campaign\nPackaging or label design\nPitch deck or company presentation\nA dedicated designer and priority support\nBrand consistency review every month",
        delivery: "Priority turnaround",
        buttonLabel: "Get a quote",
        buttonHref: "#contact",
      },
    ],
    note: "Prices are a starting point in Indian rupees. After a short call we share an exact quote for your scope.",
  },
  "plans",
);
/** puts the plans section in front of the FAQ */
const withPlans = (plans: PageSection, list: PageSection[]): PageSection[] => {
  const at = list.findIndex((s) => s.type === "faq");
  return at < 0 ? [...list, plans] : [...list.slice(0, at), plans, ...list.slice(at)];
};
export const GRAPHICS_SECTIONS = withPlans(GRAPHICS_PLANS, build({
  seo: GRAPHICS_SEO,
  hero: {
    chip: "Graphic Design",
    heading: "Graphic Design Services\nThat Make Brands Unforgettable",
    text: "We3vision is a graphic design company in Surat, Gujarat, India. We create logo design, brand identity, social media graphics, packaging and brochures in Adobe Illustrator, Photoshop and InDesign for businesses in India, the USA, UK, Canada and Australia.",
    primaryLabel: "Start your design project",
    secondaryLabel: "What we design",
  },
  story:
    "*Graphic design* is the art of turning an idea into a picture that people understand at a glance. A good *logo design*, a clear *brand identity*, a sharp *social media post* or a well made *brochure* tells customers who you are before you say a word.\n\nOur *graphic designers in Surat, India* draw, test and refine every design: sketches first, then *vector artwork in Adobe Illustrator*, *image editing in Photoshop* and *print layouts in InDesign*, with the right colours, typography and file formats for screen and print. We also design *website and app interfaces (UI/UX)* so your brand looks the same everywhere.",
  subs: {
    chip: "What we design",
    heading: "Our Graphic Design\nServices",
    intro: "Logo, brand, marketing, packaging, print and digital design: one creative team for everything your brand shows to the world.",
    cards: [
      { title: "Logo\nDesign", description: "Memorable logos and logo suites in Adobe Illustrator: vector files that stay sharp on a business card and on a billboard.", href: "/brand-identity" },
      { title: "Brand Identity\nDesign", description: "Colour palette, typography, icons, patterns and brand guidelines that make your business easy to recognise.", href: "/brand-identity" },
      { title: "Social Media\nGraphics", description: "Instagram, Facebook and LinkedIn posts, stories, carousels and covers designed to stop the scroll and stay on brand." },
      { title: "Packaging &\nLabel Design", description: "Box, pouch, bottle and label designs with print-ready dielines, CMYK colour and clear product information." },
      { title: "Brochure &\nCatalogue Design", description: "Company profiles, product catalogues, brochures and flyers laid out in InDesign for easy reading and clean printing." },
      { title: "Poster, Banner &\nAd Creatives", description: "Posters, hoardings, standees, web banners and campaign creatives that carry one clear message." },
      { title: "Stationery &\nBusiness Cards", description: "Business cards, letterheads, envelopes, invoices and ID cards that match your logo and brand colours." },
      { title: "Illustration &\nIcon Design", description: "Custom vector illustrations, icons, infographics and characters that explain ideas and give your brand its own look." },
      { title: "Pitch Decks &\nPresentations", description: "Investor decks, sales presentations and reports with clean layouts, charts and visuals that tell your story." },
      { title: "Website &\nApp UI/UX Design", description: "Website interfaces, mobile app screens, dashboards and design systems with a clear, user-friendly flow.", href: "/ui-ux-design" },
      { title: "E-commerce\nGraphics", description: "Product banners, listing images, store graphics and offer creatives that help online shoppers decide." },
      { title: "Photo Editing &\nRetouching", description: "Colour correction, background removal, retouching and composites in Photoshop for products, people and campaigns." },
    ],
  },
  process: {
    heading: "How We Create\nYour Design",
    intro: "A clear creative process from the first conversation to the final print-ready or screen-ready files.",
    items: [
      { title: "Brief and research", text: "We learn about your business, your customers, your competitors and what the design must achieve.", points: "Goals and audience\nBrand and market research\nMoodboards and references" },
      { title: "Sketches and concepts", text: "Designers draw rough ideas by hand and on screen before choosing the strongest concepts.", points: "Pencil sketches\nLayout and logo concepts\nColour and type options" },
      { title: "Digital design", text: "The chosen concept is built in Adobe Illustrator, Photoshop or InDesign with precise shapes, colours and typography.", points: "Vector artwork\nImage editing and layout\nMock-ups on real products" },
      { title: "Feedback and refinement", text: "You review the design and we refine it together until every detail feels right.", points: "Revision rounds\nResponsive and size variations" },
      { title: "Final files", text: "We prepare every file in the formats you need, for print and for screen.", points: "AI, PSD, PDF, SVG and PNG files\nCMYK print-ready and RGB screen files\nOrganised source files" },
      { title: "Support", text: "We stay available for new sizes, new products and the next design you need.", points: "Brand consistency\nTemplates for your team" },
    ],
  },
  tools: { heading: "Our Design\nTools", items: "Adobe Illustrator\nAdobe Photoshop\nAdobe InDesign\nAdobe After Effects\nFigma\nAdobe XD\nSketch\nZeplin" },
  industries: {
    heading: "Design For\nDifferent Industries",
    intro: "Every industry speaks a different visual language. We design for the way your customers see your business.",
    items: [
      { name: "Healthcare", description: "Clean, calm and trustworthy graphics for clinics, hospitals and wellness brands: logos, patient brochures, signage, social media and app interfaces designed with clarity and care." },
      { name: "Education", description: "Friendly, clear designs for schools, institutes and e-learning: logos, admission brochures, posters, social media graphics and learning platform interfaces." },
      { name: "Construction", description: "Strong, confident branding for builders and real estate: company profiles, project brochures, hoardings, site branding and architecture presentation kits." },
      { name: "E-commerce", description: "Conversion-focused graphics for online stores: product banners, listing images, offer creatives, packaging and storefront and checkout interface design." },
      { name: "Gaming", description: "Bold, energetic designs for games and esports: game UI, menus, logos, promotional art, social graphics and event visuals." },
      { name: "Marketing", description: "High-impact advertising creatives, campaign landing pages, social media graphics, brochures and brand collateral for agencies and marketing teams." },
      { name: "Corporate", description: "Professional identities for companies: logos, stationery, investor pitch decks, annual reports, B2B portals and cohesive corporate design systems." },
    ],
  },
  why: {
    heading: "Why Choose We3vision\nFor Graphic Design",
    items: [
      { title: "Design that meets business goals", description: "Your business goals and target audience guide every layout, colour and font, so the design works as well as it looks." },
      { title: "Hand-drawn thinking, professional tools", description: "We sketch ideas first and then build them with Adobe Illustrator, Photoshop and InDesign for precise, professional results." },
      { title: "One consistent brand everywhere", description: "Logo, brand guidelines, social media, packaging, print and digital interfaces share one look, so customers remember you." },
      { title: "Print-ready and screen-ready files", description: "We deliver the right formats and colour modes (CMYK for print, RGB for screen) so printers and developers can use your files without problems." },
      { title: "A collaborative creative process", description: "We listen, show our thinking and include your feedback at every stage, with remote delivery for clients in the USA, UK, Canada and Australia." },
    ],
  },
  faq: [
    { question: "What is graphic design?", answer: "Graphic design is the art and craft of combining images, shapes, colours and typography to communicate an idea. It is used for logos, brand identities, advertisements, packaging, brochures, social media posts and the look of websites and apps." },
    { question: "What graphic design services do you offer in Surat?", answer: "We3vision, a graphic design company in Surat, India, offers logo design, brand identity design, social media graphics, packaging and label design, brochure and catalogue design, poster and banner design, stationery, illustration, pitch decks, photo editing and website and app UI/UX design. We shape the work around your requirements." },
    { question: "Which software do your graphic designers use?", answer: "We3vision designers work with Adobe Illustrator for logos and vector artwork, Adobe Photoshop for image editing, Adobe InDesign for print layouts, and Figma, Adobe XD and other tools for interface design." },
    { question: "How does your logo design process work?", answer: "We start with a short brief and research, sketch several ideas, refine the strongest concepts in Illustrator, show them to you with mock-ups and then polish the chosen logo. You receive a full set of logo files for print and screen." },
    { question: "What is the difference between graphic design and UI/UX design?", answer: "Graphic design creates visuals such as logos, posters, packaging and social media graphics. UI/UX design plans and designs how a website or app works and feels for its users. We offer both, so your visuals and your digital products look like one brand." },
    { question: "Will I get print-ready files?", answer: "Yes. We prepare print-ready files in CMYK with the right size, bleed and resolution, and screen files in RGB. You can also receive the editable source files depending on the project scope." },
    { question: "Can you redesign my existing logo or website?", answer: "Yes. We3vision offers logo redesign, brand refresh, website redesign and mobile app redesign to update your look with modern visuals and better user experience." },
    { question: "How long does a graphic design project take?", answer: "It depends on the project. On average it takes 1–2 weeks to design a website or mobile application UI/UX, and a logo or a brochure usually needs less time than a complete brand identity or design system. We give you a clear timeline before we start." },
    { question: "Do you offer affordable graphic design services?", answer: "We3vision offers competitive graphic design packages depending on your project scope, business goals and design requirements. Contact us to discuss your project and get a customised quote." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver graphic design projects remotely for clients in the USA, UK, Canada and Australia, as well as India. We keep communication clear and agree the plan, scope and deliverables up front." },
    { question: "How can I get started?", answer: "Contact We3vision to discuss your project. We will understand your needs and share a proposal and a timeline." },
  ],
  related: [
    { title: "Brand Identity\nDesign", description: "Brand strategy, logo, visual identity and guidelines.", href: "/brand-identity" },
    { title: "UI/UX\nDesign", description: "Interfaces for websites and apps.", href: "/ui-ux-design" },
    { title: "2D/3D\nAnimation", description: "Animation and 3D visualization.", href: "/animation" },
    { title: "Brand Kit\nDesign", description: "Logo, colours, type and templates in one kit.", href: "/brand-kit-design" },
  ],
  cta: { heading: "Have A\nDesign Project?", text: "Whether you need a logo, a brand identity, social media graphics, packaging, a brochure or a website interface, We3vision can help. Let's talk about your project.", button: "Start your design project" },
}));

// ---------------------------------------------------------------------------------------------------------------------
// SEO Optimization (/seo)
// ---------------------------------------------------------------------------------------------------------------------
export const SEO_SEO = {
  title: "SEO Company in Surat, India | We3vision",
  description:
    "SEO company in Surat, Gujarat, India: technical SEO, local SEO and AI search readiness for clients in the USA, UK, Canada and Australia. Talk to us.",
};
export const SEO_SECTIONS = build({
  seo: SEO_SEO,
  hero: {
    chip: "SEO & AEO",
    heading: "Be Found Where\nYour Customers Search.",
    text: "We3vision is an SEO company in Surat, Gujarat, India. Our SEO services help your website get found on Google without paid ads, for businesses in India, the USA, UK, Canada and Australia: keyword research, content optimization, local SEO and technical audits, with clear reporting.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we do",
  },
  story:
    "Whether you are a *local business, a startup or a global brand*, our *SEO company in Surat* creates *custom SEO strategies* for *long-term growth and visibility* on Google and beyond.\n\nWe balance *high-quality content and a technically sound website* for a complete SEO solution, we follow *white hat practices only*, and we keep you informed with *clear, regular reports* from Google Analytics and Search Console.",
  subs: {
    chip: "What we do",
    heading: "Our SEO\nServices",
    intro: "Everything a website needs to be found: audit, on-page, technical, content, links and reporting.",
    cards: [
      { title: "Website Audit\n& Analysis", description: "Technical audit and gap analysis, opportunity mapping and competitor benchmarking." },
      { title: "Keyword\nResearch", description: "We study competitors and find high-value keywords aligned with your goals and audience intent." },
      { title: "On-Page\nOptimization", description: "Meta tags, headings, images and internal links optimized for relevance and visibility." },
      { title: "Technical SEO", description: "Speed, mobile responsiveness, crawlability, Core Web Vitals and structured data for strong technical health." },
      { title: "Content Strategy\n& Optimization", description: "We refine existing content and create new pages aligned with search intent, with briefs and an editorial calendar." },
      { title: "Link Building &\nLocal SEO", description: "Quality backlinks, citations and brand signals through ethical outreach, plus Google Business Profile and location pages." },
    ],
  },
  process: {
    heading: "How We Improve\nYour Rankings",
    intro: "A simple, collaborative process from the first audit to monthly reports.",
    items: [
      { title: "Website audit & SEO analysis", text: "We analyze your site to find technical issues, keyword gaps and improvement opportunities.", points: "Technical audit and gap analysis\nOpportunity mapping" },
      { title: "Competitor & keyword research", text: "We study competitors and find high-value keywords aligned with your goals and audience intent.", points: "Competitor benchmarking\nKeyword list and mapping" },
      { title: "On-page optimization", text: "We optimize meta tags, headings, images and internal links to improve relevance and visibility.", points: "Meta, headers and images\nInternal linking" },
      { title: "Technical SEO enhancements", text: "We improve speed, mobile responsiveness, crawlability and structured data for strong technical health.", points: "Core Web Vitals and mobile\nCrawlability and schema" },
      { title: "Content optimization & strategy", text: "We refine existing content and create new pages aligned to search intent and engagement.", points: "Content refresh and briefs\nEditorial calendar" },
      { title: "Off-page SEO & link building", text: "We build quality backlinks, citations and brand signals through ethical outreach campaigns.", points: "Backlink outreach\nLocal citations and PR" },
      { title: "Performance tracking & reporting", text: "We track rankings, traffic and conversions using GA and GSC, and refine the strategy with insights.", points: "GA/GSC dashboards\nMonthly reports and iteration" },
    ],
  },
  tools: { heading: "The Tools\nBehind Our SEO", items: "Google Search\nAhrefs\nSEMrush\nScreaming Frog\nYoast SEO\nMoz\nGTmetrix" },
  industries: {
    heading: "SEO For\nEvery Industry",
    intro: "Search works differently in every business. Here is what SEO looks like in some of them.",
    items: [
      { name: "Healthcare", description: "Rank for treatments, doctor profiles and location-based searches to get more patient inquiries." },
      { name: "Tech & SaaS", description: "Drive organic traffic to your product pages and rank for high-intent software queries." },
      { name: "E-commerce", description: "Boost visibility for product pages, category listings and branded keywords." },
      { name: "Education & training", description: "Appear in front of students searching for online courses or learning programs." },
      { name: "Real estate", description: "Capture location-specific traffic for property listings, builders and agents." },
      { name: "Finance & legal", description: "Show up for critical search terms like loan help, legal advice or tax consulting." },
    ],
  },
  why: {
    heading: "SEO You Can\nTrust",
    items: [
      { title: "Experience since 2019", description: "From Surat, India we plan SEO for clients in India, the USA, UK, Canada and Australia, and keep the work clear." },
      { title: "Custom SEO strategies", description: "No copy-paste plans. We build your strategy around your industry, audience and goals." },
      { title: "White hat SEO only", description: "We follow Google's best practices: no shady tactics, no penalties, just clean, long-term results." },
      { title: "Content + technical balance", description: "We focus on both high-quality content and a technically sound website for a complete SEO solution." },
      { title: "Transparent reporting", description: "You always know what is happening, with clear, regular updates and data-backed insights." },
    ],
  },
  faq: [
    { question: "What is the difference between SEO and AEO?", answer: "SEO helps search engines find, understand and rank your pages. AEO shapes the same content so that clear, well-supported answers are easier for answer systems to interpret and possibly surface. They overlap heavily: helpful content and a healthy website help both." },
    { question: "How long can SEO take to show results?", answer: "It depends on the competition, the condition of the site, the quality of the content and how often changes are made. Some technical fixes show effects sooner, while content and authority usually take longer to build. We do not promise a fixed timeline." },
    { question: "Can you optimize an existing website?", answer: "Yes. We start with an assessment of the current site, then fix what holds it back and improve what already works, without rebuilding it unless that is really needed." },
    { question: "Do you provide technical SEO and content SEO?", answer: "Yes. Technical SEO, on-page work, keyword research, content strategy and optimization, local SEO and AEO are all part of our scope, depending on what your site needs." },
    { question: "Can you help improve AI search visibility?", answer: "We can help you make your information clearer, more consistent and easier to crawl, which can make it more eligible to be used in AI-generated answers. No one can guarantee inclusion in them." },
    { question: "How is SEO progress measured?", answer: "Where tracking is set up, we look at organic clicks and impressions, query performance, indexed pages, landing-page engagement and relevant conversions, and we keep activity metrics separate from business outcomes." },
    { question: "Do you offer local SEO in Surat?", answer: "Yes, local SEO is part of our scope: Google Business Profile, citations and location pages. We work from Surat, Gujarat, India and can focus on Surat, other Indian cities or markets abroad." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver SEO projects remotely for clients in the USA, UK, Canada and Australia, as well as India. We keep communication clear and agree the plan, scope and reporting up front." },
    { question: "Do you guarantee search rankings?", answer: "No. Rankings depend on competition, technical condition, content quality, authority and many other factors, some of which we do not control. We commit to careful, ethical work and clear reporting, not to a ranking position." },
  ],
  related: [
    { title: "Web\nDevelopment", description: "Fast, SEO-friendly websites built with clean code.", href: "/webdev" },
    { title: "UI/UX\nDesign", description: "Designs that keep visitors and turn them into leads.", href: "/ui-ux-design" },
    { title: "Brand\nDesign", description: "A clear brand that people remember and search for.", href: "/brand-identity" },
    { title: "AI\nDevelopment", description: "Chatbots and automation for the leads SEO brings.", href: "/ai" },
  ],
  guide: { scene: "serp", chip: "Watch a website climb", heading: "Climb to\nnumber one", text: "Switch on the improvements one by one and watch the website move up the search results, with the score and the traffic growing.", tips: ["Switch on the improvements and watch the website climb."] },
  cta: { heading: "Let's Make Your Website\nEasier to Discover.", text: "Tell us about your website, your audience and your growth goals. We'll help you identify the right SEO and AEO priorities for your business.", button: "Discuss Your SEO Strategy" },
});
