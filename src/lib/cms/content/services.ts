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
  guide: { scene: string; chip: string; heading: string; text: string; tips: string[] };
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
  section("guide", { chip: s.guide.chip, heading: s.guide.heading, text: s.guide.text, scene: s.guide.scene, tips: s.guide.tips.join("\n"), buttonLabel: "", buttonHref: "" }),
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
  title: "Web Development Company in Surat, India | Custom Websites | We3vision",
  description:
    "Modern, responsive and SEO-friendly websites: WordPress, WooCommerce, Shopify, headless CMS and custom e-commerce. We3vision builds fast, secure websites that are easy to manage, from landing pages to complex web portals.",
};
export const WEBDEV_SECTIONS = build({
  seo: WEBDEV_SEO,
  hero: {
    chip: "Web Development",
    heading: "Professional Websites\nThat Drive Results",
    text: "We create modern, responsive and SEO-friendly websites tailored to your business needs. Whether you are a startup, a growing brand or an established enterprise, we develop websites that are fast, secure and easy to manage.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we build",
  },
  story:
    "Our *web development* services help you *attract more visitors, improve the user experience and increase conversions*. From *landing pages to complex web portals* we build everything with *clean code and a focus on performance*.\n\nEvery project is custom developed to reflect your brand and your business goals (we do not use generic templates). We build with *WordPress and WooCommerce, Shopify, headless CMS front ends in React, Vue or Angular*, and custom back ends in *Node.js, Laravel or PHP*, and we can help you with *domain, hosting and SSL* as well.",
  subs: {
    chip: "What we build",
    heading: "Websites For\nEvery Need",
    intro: "Six kinds of web work, from a CMS website you manage yourself to a custom online store.",
    cards: [
      { title: "WordPress &\nWooCommerce", description: "Custom WordPress websites and WooCommerce stores that you can manage yourself, with easy-to-use CMS options and training." },
      { title: "Shopify\nStores", description: "Conversion-focused Shopify stores and apps to sell your products online." },
      { title: "Headless\nCMS", description: "Fast React, Vue or Angular front ends connected to a headless CMS, built for speed and flexibility." },
      { title: "E-commerce\nWebsites", description: "Secure online stores with scalable Node.js, Laravel or PHP back ends, payments and inventory." },
      { title: "Custom Web\nPortals", description: "From landing pages to complex web portals: booking systems, listings, course portals and dashboards." },
      { title: "Domain, Hosting\n& SSL", description: "We help you purchase and set up your domain, hosting and SSL, and deploy on secure servers." },
    ],
  },
  process: {
    heading: "How We Build\nYour Website",
    intro: "A simple, collaborative process that takes your website from first idea to launch and long-term support.",
    items: [
      { title: "Discovery & requirement analysis", text: "We understand goals, audience and functionality needs to create a clear roadmap aligned with business objectives.", points: "Goals, audience and KPIs\nFunctional requirements\nSitemap and navigation model\nLow-fidelity wireframes" },
      { title: "Information architecture", text: "We structure navigation and user flow. Wireframes define layout, content hierarchy and journeys." },
      { title: "UI design & prototyping", text: "We design brand-aligned, responsive interfaces focused on usability, aesthetics and accessibility.", points: "High-fidelity UI and design system\nInteractive prototypes" },
      { title: "Front-end development", text: "Using React, Angular or Vue, we build interactive, pixel-perfect pages optimized for all devices.", points: "Component-based implementation\nPerformance and responsiveness" },
      { title: "Back-end development", text: "We build scalable back-end systems with Node.js, Laravel or PHP to ensure seamless performance.", points: "API design and integrations\nSecurity and scalability" },
      { title: "Content integration & CMS setup", text: "We integrate optimized content and set up a CMS (WordPress or a custom admin) for easy management.", points: "Content loading and SEO basics\nCMS configuration and training" },
      { title: "Testing & quality assurance", text: "Comprehensive testing: speed, SEO, accessibility, cross-browser compatibility and security.", points: "Functional and UX testing\nPerformance, SEO and security checks" },
      { title: "Launch & ongoing support", text: "We deploy on secure servers and provide monitoring, updates and optimization for long-term success.", points: "Production deployment\nMonitoring and continuous improvements" },
    ],
  },
  tools: { heading: "The Technology\nBehind Our Websites", items: "HTML5\nCSS3\nJavaScript\nReact.js\nVue.js\nAngular\nNode.js\nLaravel\nDjango\nMySQL\nPostgreSQL\nMongoDB" },
  industries: {
    heading: "Websites For\nEvery Industry",
    intro: "We do not work with only one kind of business. Here is what a website can look like in some of them.",
    items: [
      { name: "E-commerce", description: "Fast and conversion-optimized online stores to help grow your sales." },
      { name: "Healthcare", description: "Secure and user-friendly portals for clinics, hospitals and health startups." },
      { name: "Real estate", description: "Listing platforms with advanced filters, maps and booking capabilities." },
      { name: "Education", description: "Online learning websites, course portals and student management systems." },
      { name: "Finance", description: "Web apps for banking, fintech and secure transaction platforms." },
      { name: "Travel & hospitality", description: "Booking systems, tour showcase websites and itinerary planners." },
    ],
  },
  why: {
    heading: "Websites Built\nTo Last",
    items: [
      { title: "Experienced team of developers", description: "Our developers are highly skilled and experienced in building websites across diverse industries, so your platform is technically sound and strategically built." },
      { title: "Tailored solutions for every business", description: "We do not use generic templates. Every project is custom developed to reflect your brand's identity and your business goals." },
      { title: "Optimised for all devices & search engines", description: "Our websites are mobile-first, fully responsive and built with clean, SEO-optimized code to maximize visibility." },
      { title: "Scalable & future-ready architecture", description: "Whether you launch small or scale up, our development ensures your site can grow with your business." },
      { title: "Transparent communication & support", description: "You always know where your project stands. We offer clear timelines, open communication and dedicated post-launch support." },
    ],
  },
  faq: [
    { question: "Do you only work with specific industries?", answer: "No, we develop websites for all industries including education, health, real estate and more." },
    { question: "Will my website work on all devices?", answer: "Yes, we create fully responsive websites that look great on desktop, tablet and mobile." },
    { question: "Do you provide hosting and domain help?", answer: "Yes, we can help you purchase and set up a domain, hosting and SSL." },
    { question: "Can I manage the website after launch?", answer: "Absolutely! We build websites with easy-to-use CMS options like WordPress." },
    { question: "How long will it take to develop a website?", answer: "Basic websites can be ready in 1–2 weeks. More complex ones may take 3–6 weeks." },
  ],
  related: [
    { title: "UI/UX\nDesign", description: "Interfaces that look great and guide visitors towards action.", href: "/ui-ux-design" },
    { title: "SEO\nOptimization", description: "Get found on Google and grow organically.", href: "/seo" },
    { title: "CRM\nDevelopment", description: "Connect your website to a custom CRM.", href: "/crm" },
    { title: "Brand\nDesign", description: "A clear, consistent brand identity for your website and beyond.", href: "/brand-identity" },
  ],
  guide: { scene: "office", chip: "Meet the builder", heading: "Type a name,\nwatch it get built", text: "Our guide builds websites all day. Type your business name below and watch it appear on the screen, then imagine a whole site built around it.", tips: ["Hi! I build websites. Type your brand name below.","Fast, responsive and easy to manage: that is how we build.","Every site is custom made, with no generic templates.","A basic website can be ready in 1–2 weeks.","Need an online store? Ask me about WooCommerce and Shopify."] },
  cta: { heading: "Ready To Build\nYour Next Website?", text: "Tell us your idea and we will suggest the best approach, timeline and cost.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Mobile App Development (/mobile)
// ---------------------------------------------------------------------------------------------------------------------
export const MOBILE_SEO = {
  title: "Mobile App Development Company in Surat, India | Android & iOS | We3vision",
  description:
    "Custom Android, iOS and cross-platform mobile apps built with Flutter, React Native, Kotlin and Swift. We3vision takes your app from idea to Google Play and App Store launch, and keeps it updated.",
};
export const MOBILE_SECTIONS = build({
  seo: MOBILE_SEO,
  hero: {
    chip: "Mobile App Development",
    heading: "Custom Mobile Apps\nBuilt For Growth",
    text: "We design and develop mobile applications that are fast, user-friendly and built to scale. Whether you need an app for Android, iOS or a hybrid solution, we create mobile experiences that help your business stand out in a competitive app market.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we build",
  },
  story:
    "From *food delivery apps to fitness trackers and enterprise tools*, our team builds apps tailored to your goals, your users and your industry. Expect *high performance, beautiful design and reliable functionality* across every device.\n\nWe build *native Android and iOS apps* (Kotlin and Swift) and *cross-platform apps* with *Flutter and React Native*, connect them to your back end through *APIs and databases*, and take care of the *Google Play and App Store submission* and the updates after launch.",
  subs: {
    chip: "What we build",
    heading: "Apps For\nEvery Platform",
    intro: "Six kinds of app work, from a first version to a full-scale product.",
    cards: [
      { title: "Android\nApps", description: "Native Kotlin and cross-platform Android apps tuned for performance on every device." },
      { title: "iOS\nApps", description: "Native Swift apps with clean, brand-aligned interfaces, ready for App Store approval." },
      { title: "Cross-platform\n& Hybrid Apps", description: "One codebase for Android and iOS with Flutter or React Native, picked to fit your goals and budget." },
      { title: "MVP\nDevelopment", description: "A focused first version with the core features, so you can launch and learn quickly." },
      { title: "Full-scale\nProducts", description: "Apps with APIs, real-time sync and storage, authentication and ongoing updates as you grow." },
      { title: "Store Launch\n& Maintenance", description: "Play Store and App Store submission with listing optimization, then monitoring, fixes and new features." },
    ],
  },
  process: {
    heading: "How We Build\nYour App",
    intro: "A simple, collaborative process, from the first conversation to long-term support.",
    items: [
      { title: "Discovery & strategy", text: "We discuss business goals, target users and objectives to define the right features, platforms and technologies.", points: "Goals, users and KPIs\nPlatforms and tech stack" },
      { title: "UX research & wireframing", text: "We map app flow, navigation and interactions. Wireframes act as the blueprint for structure and journeys.", points: "User flows and navigation\nLow-fidelity wireframes" },
      { title: "UI design & prototyping", text: "We design clean, brand-aligned interfaces focused on usability, engagement and responsiveness.", points: "High-fidelity UI screens\nInteractive prototypes" },
      { title: "App development", text: "We build native (iOS/Android) or cross-platform apps with Flutter, React Native or Swift, focusing on performance and scalability.", points: "Native or cross-platform builds\nPerformance and scalability" },
      { title: "API & database integration", text: "We connect to back-end systems and databases for auth, data sync and real-time updates.", points: "API integration and auth\nReal-time sync and storage" },
      { title: "Testing & quality assurance", text: "Rigorous testing across devices for performance, security and a bug-free experience before going live.", points: "Functional, performance, security\nMulti-device QA" },
      { title: "Deployment & launch", text: "We handle Google Play and App Store submissions with metadata optimization for smooth approval.", points: "Play Store and App Store submission\nStore listing optimization" },
      { title: "Maintenance & updates", text: "Post-launch monitoring, issue fixes and feature updates to align with user needs and platform changes.", points: "Ongoing maintenance and updates\nPerformance monitoring" },
    ],
  },
  tools: { heading: "The Technology\nBehind Our Apps", items: "Flutter\nReact Native\nKotlin\nSwift\nFirebase\nMongoDB\nMySQL\nNode.js\nExpress.js\nLaravel\nAWS\nGoogle Cloud\nAzure\nRESTful APIs\nGraphQL\nFigma\nAdobe XD\nZeplin" },
  industries: {
    heading: "Apps For\nEvery Industry",
    intro: "The same app ideas work differently in every business. Here is what apps look like in some of them.",
    items: [
      { name: "Healthcare", description: "Appointment booking, health tracking and doctor-patient communication apps." },
      { name: "E-commerce", description: "Shopping apps with secure payments, inventory sync and push notifications." },
      { name: "Finance", description: "Secure banking, investment tracking and wallet-based mobile solutions." },
      { name: "Education", description: "Learning apps with video content, quizzes and student dashboards." },
      { name: "Logistics", description: "Real-time tracking, route optimization and fleet management solutions." },
      { name: "On-demand services", description: "From food delivery to salon services, we build user-friendly on-demand apps." },
    ],
  },
  why: {
    heading: "Apps People\nKeep Using",
    items: [
      { title: "Experienced mobile developers", description: "Our team has hands-on experience building apps for startups, SMEs and enterprise clients across various domains." },
      { title: "Custom solutions, not templates", description: "We create fully tailored mobile apps that solve real user problems and reflect your brand identity." },
      { title: "Cross-platform & native expertise", description: "Whether you want native iOS, Android or hybrid apps, we pick the right tech for your goals and budget." },
      { title: "Performance-focused development", description: "Speed, stability and scalability are at the core of every app we develop." },
      { title: "Ongoing support & optimization", description: "We do not stop at launch. We offer updates, new features and performance improvements as your app scales." },
    ],
  },
  faq: [
    { question: "Do you build both Android and iOS apps?", answer: "Yes, we develop native and cross-platform apps for Android and iOS." },
    { question: "Can I see progress during development?", answer: "Absolutely! We share regular updates and test builds, and collect your feedback." },
    { question: "Do you help with publishing on app stores?", answer: "Yes, we assist with Play Store and App Store submissions, compliance and metadata." },
    { question: "How secure will my app be?", answer: "Security is a top priority. We use encryption, secure APIs and best practices for data protection." },
    { question: "Can you maintain and update my app post-launch?", answer: "Yes, we offer app maintenance, bug fixes and feature enhancements after launch." },
  ],
  related: [
    { title: "UI/UX\nDesign", description: "Clean, brand-aligned app interfaces and prototypes.", href: "/ui-ux-design" },
    { title: "Web\nDevelopment", description: "A website or web app to go with your mobile app.", href: "/webdev" },
    { title: "AI\nDevelopment", description: "Add chatbots, recommendations and predictions to your app.", href: "/ai" },
    { title: "CRM\nDevelopment", description: "Connect your app with a custom CRM.", href: "/crm" },
  ],
  guide: { scene: "mobile", chip: "Meet the app maker", heading: "Tap the phone,\nopen the app", text: "Tap the phone to move between the screens of an app, the way your customers will. Then imagine it with your own brand on it.", tips: ["Tap my phone to switch between app screens.","Android, iOS or both from one codebase: I can do it all.","From idea to Play Store and App Store, we handle it.","Fast, secure and built to scale."] },
  cta: { heading: "Have An App Idea?\nLet's Bring It To Life.", text: "Share your concept with us and we will guide you on the tech, timeline and cost.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Metaverse Solutions (/metaverse)
// ---------------------------------------------------------------------------------------------------------------------
export const METAVERSE_SEO = {
  title: "Metaverse Development Company in India | Virtual Worlds & Experiences | We3vision",
  description:
    "Metaverse solutions, virtual world development, metaverse applications and virtual events built with Unity, Unreal Engine, WebGL and WebXR. We3vision creates immersive digital experiences around your business goals.",
};
// the earlier Metaverse page (all sections), kept for when the page is built up again
export const METAVERSE_FULL_SECTIONS = build({
  seo: METAVERSE_SEO,
  hero: {
    chip: "Metaverse Solutions",
    heading: "Metaverse Solutions For\nImmersive Experiences",
    text: "We3vision provides metaverse concepts and interactive digital environments to help businesses explore virtual experiences. From metaverse applications and virtual worlds to virtual events, we build engaging experiences around your business objectives and audience needs.",
    primaryLabel: "Discuss your metaverse project",
    secondaryLabel: "What we build",
  },
  story:
    "*Metaverse solutions* are interactive digital experiences that can include *virtual worlds, metaverse applications, virtual events and immersive environments*. We plan every project around your *business goals and your audience*, and we use *3D development, 3D modeling and interactive 3D experiences* to make them real.\n\nWe build with *Unity, Unreal Engine, WebGL, Three.js and WebXR*, and we follow a clear process from *project discovery to deployment*. Project features and implementation requirements are discussed together during the planning stage.",
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
    { question: "What metaverse services does We3vision offer?", answer: "Our listed services include metaverse development, metaverse applications, virtual world development and virtual events and experiences." },
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
    { title: "AI\nDevelopment", description: "Smart characters, assistants and automation.", href: "/ai" },
  ],
  guide: { scene: "metaverse", chip: "Step inside", heading: "Put on the headset,\nenter the metaverse", text: "Our guide explores virtual worlds with a headset on. Click the portal to teleport to another world and move your mouse to look around.", tips: ["Welcome to the metaverse! Click the portal to teleport.","Virtual worlds, applications and events, built with Unity and Unreal.","Move your mouse: the whole world tilts with you.","Virtual showrooms, campuses and arenas are all possible."] },
  cta: { heading: "Ready To Build Your\nVirtual Experience?", text: "Discuss your metaverse idea with We3vision and explore virtual worlds, metaverse applications and immersive digital experiences for your business.", button: "Discuss your metaverse project" },
});

// The Metaverse page: the 3D office walk (the visitor puts on a headset), the floor with Rutvi and the four cabins, the glass windows,
// a soft fade out of the black and then the sections of a normal service page (without its hero, story and guide, which the scenes replace).
export const METAVERSE_SECTIONS: PageSection[] = [
  section("vrEntry", {
    heading: "Metaverse Solutions For\nImmersive Experiences",
    text: "We3vision provides metaverse concepts and interactive digital environments to help businesses explore virtual experiences. From metaverse applications and virtual worlds to virtual events, we build engaging experiences around your business objectives and audience needs.",
    hint: "Scroll to walk in",
    captions: "Welcome to the We3vision studio.\nThis is where ideas become worlds.\nOne more step.\nPut it on.",
  }),
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
  ...METAVERSE_FULL_SECTIONS.slice(3).flatMap((sec) => (sec.type === "tags" ? [section("vrDevices", DEVICES, "devices")] : sec.type === "contact" ? [section("vrQuiz", QUIZ, "quiz"), sec] : [sec])),
];

// ---------------------------------------------------------------------------------------------------------------------
// UI/UX Design (/ui-ux-design)
// ---------------------------------------------------------------------------------------------------------------------
export const UIUX_SEO = {
  title: "UI/UX Design Services in Surat, India | Web & Mobile App Design | We3vision",
  description:
    "UI/UX design for websites and apps: UX research, wireframes, prototypes, UI design, design systems, usability testing and redesign. We3vision designs interfaces that look great and convert.",
};
export const UIUX_SECTIONS = build({
  seo: UIUX_SEO,
  hero: {
    chip: "UI/UX Design",
    heading: "UI/UX Design\nServices",
    text: "At We3vision Private Limited we design user experiences that work beautifully and perform flawlessly. We blend creativity with strategy, designing websites, apps and interfaces that attract users, hold their attention and guide them naturally toward action.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we design",
  },
  story:
    "Our *UI/UX design services* help businesses create digital products that are not only *visually impressive* but also *easy to use, fast and conversion-driven*. From *wireframes to pixel-perfect prototypes*, we make sure every click, swipe and scroll feels effortless.\n\nWe work in *Figma, Adobe XD, Sketch and InVision*, we hand over *editable design files*, and because We3vision also has a full development team, your designs can be turned into *working websites and apps*.",
  subs: {
    chip: "What we design",
    heading: "Our UI/UX\nDesign Services",
    intro: "Everything from the first research to the style guide and the redesign of an existing product.",
    cards: [
      { title: "UX Research\n& Strategy", description: "User interviews, competitor analysis and behavioral mapping to define a clear design direction." },
      { title: "Information\nArchitecture", description: "Navigation hierarchy, content grouping and overall site or app flow, so users find what they need." },
      { title: "Wireframes &\nPrototypes", description: "Low and high fidelity wireframes and interactive prototypes to test functionality early." },
      { title: "UI Design &\nVisual Branding", description: "Modern interfaces using colour, typography, iconography and layout balance that carry your brand's tone." },
      { title: "Interaction &\nMotion Design", description: "Subtle animations and transitions, from hover effects to loading states, that make every interaction feel natural." },
      { title: "Responsive &\nAdaptive Design", description: "Designs for web, mobile, tablet or even AR/VR environments with a consistent experience everywhere." },
      { title: "Usability Testing\n& Optimization", description: "Tests with real users to find friction points, then refinements based on the feedback." },
      { title: "Design Systems\n& Style Guides", description: "Reusable UI kits, colour libraries and style guidelines for every digital touchpoint." },
      { title: "UI/UX Audit\n& Redesign", description: "A detailed audit of an existing product, then a redesign that improves performance, accessibility and engagement." },
    ],
  },
  process: {
    heading: "How We Design\nYour Product",
    intro: "From research to a tested prototype, in a process you can follow every step of the way.",
    items: [
      { title: "Research & discovery", text: "We learn about your business goals, target audience and competitors through user research, stakeholder interviews and market analysis.", points: "User research\nStakeholder interviews\nMarket analysis" },
      { title: "User personas & journey mapping", text: "We create detailed user personas and map the journeys, finding what motivates users and where they may face friction." },
      { title: "Information architecture & wireframing", text: "We structure the content and features logically, then outline the layout and navigation flow in simple wireframes.", points: "Information architecture\nWireframes" },
      { title: "UI design & visual direction", text: "Our designers craft pixel-perfect layouts using consistent colour palettes, typography, icons and components that match your brand identity." },
      { title: "Interactive prototyping", text: "We build clickable prototypes in Figma, Adobe XD or InVision so you can test how the product works before development begins.", points: "Figma\nAdobe XD\nInVision" },
      { title: "Usability testing & optimization", text: "We test with real users to see how they interact with the prototype, and use the feedback to refine the design.", points: "Usability tests\nFeedback and iteration" },
    ],
  },
  tools: { heading: "Our Design\nTool Stack", items: "UI Design\nPrototyping\nUX Research\nAnimation & Interaction\nFigma\nAdobe XD\nSketch\nInVision" },
  industries: {
    heading: "Design For\nEvery Industry",
    intro: "We adapt our approach to your industry, audience and brand identity.",
    items: [
      { name: "Health & beauty", description: "Interfaces for hospitals, clinics, telemedicine apps and diagnostic portals with easy-to-use, clean layouts and accessible navigation." },
      { name: "Real estate & architecture", description: "Immersive property browsing, project showcase websites and interior visualization apps that turn interest into leads." },
      { name: "Startups & emerging businesses", description: "From MVP wireframes to full-scale product UI/UX that communicates innovation and clarity." },
      { name: "Retail & e-commerce", description: "Visually appealing, conversion-focused shopping experiences, from product filtering to frictionless checkout." },
      { name: "Manufacturing & engineering", description: "Interfaces for factory dashboards, process monitoring systems and training tools." },
      { name: "Entertainment & media", description: "UI/UX for OTT platforms, gaming apps, event management sites and streaming portals." },
      { name: "Education & training", description: "Engaging learning platforms, learning management systems (LMS) and apps for schools, colleges and edtech startups." },
      { name: "Tourism & hospitality", description: "Travel portals, booking systems and hospitality apps that simplify exploring destinations and booking trips." },
    ],
  },
  why: {
    heading: "Design That\nPerforms",
    items: [
      { title: "User-first design philosophy", description: "Everything we design starts with empathy: user needs, pain points and emotions." },
      { title: "Data-driven creativity", description: "Our designs are backed by analytics, usability testing and behavioral insights." },
      { title: "Industry-specific expertise", description: "We adapt our approach to your industry, audience segment and brand identity." },
      { title: "Collaborative & transparent process", description: "We work as an extended part of your team, with open communication, regular feedback and design previews." },
      { title: "Design systems that scale", description: "Reusable UI kits and design systems keep your product consistent and make future updates faster." },
      { title: "End-to-end delivery & support", description: "We collaborate with developers, perform handoff checks and keep suggesting improvements after launch." },
    ],
  },
  faq: [
    { question: "What does UI/UX design include?", answer: "It includes user research, wireframing, prototyping, interface design and usability testing." },
    { question: "What tools do you use for UI/UX design?", answer: "We mainly use Figma, Adobe XD, Sketch and InVision for design and prototyping." },
    { question: "How long does it take to design a UI/UX project?", answer: "Typically 2–6 weeks depending on project complexity and number of screens." },
    { question: "Can you redesign my existing website or app?", answer: "Yes, we specialize in UX audits and complete redesigns for outdated interfaces." },
    { question: "Do you design for both web and mobile apps?", answer: "Yes, we design responsive web and mobile interfaces for all devices." },
    { question: "How do you test the design before launch?", answer: "We perform user testing, feedback analysis and prototype reviews to ensure smooth usability." },
    { question: "Will you share the editable design files?", answer: "Of course. We provide all Figma or XD files along with assets and design systems." },
    { question: "Can you also handle development?", answer: "Yes, We3vision has a full development team to turn UI/UX designs into working websites or apps." },
  ],
  related: [
    { title: "Web\nDevelopment", description: "Turn your designs into a fast, responsive website.", href: "/webdev" },
    { title: "Mobile App\nDevelopment", description: "Build your app designs for Android and iOS.", href: "/mobile" },
    { title: "Brand\nDesign", description: "Brand identity, logo and guidelines.", href: "/brand-identity" },
    { title: "Graphics &\nUI/UX Design", description: "Website interfaces, brand visuals and marketing graphics.", href: "/graphics" },
  ],
  guide: { scene: "uiux", chip: "Meet the designer", heading: "From wireframe\nto final design", text: "Switch between the wireframe and the finished design to see how a screen grows from structure to colour and type.", tips: ["Switch between the wireframe and the final design.","First structure, then colour: that is how good design works.","We test with real users before the final handoff.","Design systems keep every screen consistent."] },
  cta: { heading: "Ready To Design\nSomething Great?", text: "Tell us about your product and we will suggest the best design approach, timeline and cost.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// CRM Development (/crm)
// ---------------------------------------------------------------------------------------------------------------------
export const CRM_SEO = {
  title: "Custom CRM Development Company in India | CRM Software | We3vision",
  description:
    "Custom CRM development: sales, marketing and support CRMs with automation, dashboards and integrations (ERP, HubSpot, Salesforce, WhatsApp Business API). We3vision builds CRMs that grow with your business.",
};
export const CRM_SECTIONS = build({
  seo: CRM_SEO,
  hero: {
    chip: "CRM Development",
    heading: "Smart CRM Solutions\nThat Grow With You",
    text: "We3vision Private Limited builds custom CRM systems that streamline your customer relationships, automate workflows and centralize your data, so your team can sell smarter, support better and scale faster.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we build",
  },
  story:
    "Whether you need a *lightweight CRM for a growing startup* or a *full-scale enterprise system with API integrations*, we architect CRM platforms that align with your operations, goals and customer journey.\n\nYour CRM is built *from the ground up around your workflows, teams and business model*, with *modules, dashboards, roles and permissions*, *automation* and connections to the tools you already use: *ERP and CMS systems, HubSpot, Salesforce, email, SMS and the WhatsApp Business API*.",
  subs: {
    chip: "What we build",
    heading: "CRM Systems For\nEvery Team",
    intro: "Six kinds of CRM, plus the ERP, lead tracking and inventory tools that go with them.",
    cards: [
      { title: "Sales\nCRM", description: "Manage leads, track pipelines, forecast deals and close more efficiently." },
      { title: "Marketing\nCRM", description: "Automate campaigns, track engagement, segment users and improve conversions." },
      { title: "Customer Support\nCRM", description: "Centralize tickets, manage SLAs, chat integrations and feedback loops." },
      { title: "ERP Software\n& Connectors", description: "ERP and CMS connectors so all your systems share one source of data." },
      { title: "Lead Tracking\n& Automation", description: "Pipelines and automation with email, analytics and the WhatsApp Business API." },
      { title: "Inventory\n& Support", description: "Track stock and customer requests, with team onboarding, training and ongoing support." },
    ],
  },
  process: {
    heading: "How We Build\nYour CRM",
    intro: "A simple, collaborative process, from the CRM structure to training and long-term support.",
    items: [
      { title: "Planning & architecture design", text: "We define the CRM structure, modules and integrations, ensuring flexibility and scalability for growth.", points: "CRM structure and modules\nIntegration points and scalability\nDashboards and data hierarchies" },
      { title: "UI/UX design", text: "We design a clean, intuitive interface to enhance usability for sales, marketing and support teams." },
      { title: "Development & customization", text: "We build and customize your CRM, integrating tools like email automation, analytics and contact management.", points: "Core CRM engine and automation\nFields, roles and permissions\nERP/CMS connectors" },
      { title: "Integration with existing systems", text: "We integrate ERP, CMS or third-party apps such as HubSpot, Salesforce or the WhatsApp Business API.", points: "3rd-party API integrations" },
      { title: "Testing & quality assurance", text: "We test modules for data accuracy, performance and smooth workflows to ensure reliability.", points: "Functional and performance QA\nData validation and security" },
      { title: "Deployment & user training", text: "We deploy the CRM and train teams to ensure everyone understands features and workflows.", points: "Go-live and configuration\nTeam onboarding and training" },
      { title: "Post-launch support & optimization", text: "We monitor performance, ship updates and optimize to improve efficiency and ROI.", points: "Monitoring and updates\nWorkflow and ROI optimization" },
    ],
  },
  tools: { heading: "The Technology\nBehind Our CRMs", items: "Laravel\nNode.js\nDjango\nReact\nAngular\nVue.js\nMySQL\nMongoDB\nPostgreSQL\nFirebase\nAWS\nREST & GraphQL APIs\nZapier\nHubSpot APIs\nDocker\nGit\nCI/CD Pipelines" },
  industries: {
    heading: "CRM For Every\nKind Of Business",
    intro: "The kind of CRM depends on the work your team does. Here are some we build.",
    items: [
      { name: "Sales CRM", description: "Manage leads, track pipelines, forecast deals and close more efficiently." },
      { name: "Marketing CRM", description: "Automate campaigns, track engagement, segment users and improve conversions." },
      { name: "Customer support CRM", description: "Centralize tickets, manage SLAs, chat integrations and feedback loops." },
      { name: "Project-based CRM", description: "Integrate tasks, time tracking, file sharing and client communication." },
      { name: "Healthcare / clinic CRM", description: "Patient management, scheduling, reports and secure data handling (HIPAA-ready)." },
      { name: "Real estate CRM", description: "Property listings, lead scoring, appointment management and CRM-to-website sync." },
    ],
  },
  why: {
    heading: "A CRM That Works\nThe Way You Do",
    items: [
      { title: "Built from the ground up", description: "We do not believe in one-size-fits-all. Your CRM is tailored exactly to your workflows, teams and business model." },
      { title: "User-centric design", description: "We design clean, modern dashboards that reduce learning curves and increase user adoption across your organization." },
      { title: "Modular & scalable", description: "Add features, integrations and automations as you grow. Your CRM evolves with your business." },
      { title: "Automation-first approach", description: "We help you eliminate repetitive tasks, reduce human error and scale faster with smart workflows and triggers." },
      { title: "Security & compliance ready", description: "Your data is protected with enterprise-grade encryption, access control and audit logs, GDPR and HIPAA ready." },
    ],
  },
  faq: [
    { question: "Why not use existing CRMs like HubSpot or Salesforce?", answer: "They are great, but they can be overkill, expensive and hard to customize. We build CRMs tailored exactly to your business needs, workflows and goals." },
    { question: "Can you migrate data from our old system?", answer: "Yes, we handle data migration from spreadsheets, legacy CRMs and third-party apps with minimal downtime." },
    { question: "Can I integrate email, SMS or WhatsApp into the CRM?", answer: "Absolutely. We integrate your preferred communication tools and automate messages, follow-ups and workflows." },
    { question: "Is the CRM cloud-based?", answer: "Yes, we build secure, scalable, cloud-based CRMs accessible anytime from desktop or mobile." },
    { question: "What does CRM development typically cost?", answer: "Pricing depends on features, integrations and scale. We offer transparent pricing for startups, SMBs and enterprises." },
  ],
  related: [
    { title: "Web\nDevelopment", description: "Connect your website and forms to the CRM.", href: "/webdev" },
    { title: "AI\nDevelopment", description: "Lead qualification bots and predictive models for your CRM.", href: "/ai" },
    { title: "Mobile App\nDevelopment", description: "A mobile app for your sales and support teams.", href: "/mobile" },
    { title: "UI/UX\nDesign", description: "Dashboards your team enjoys using.", href: "/ui-ux-design" },
  ],
  guide: { scene: "crm", chip: "Meet the sales guide", heading: "Move a deal,\nwin a customer", text: "Tap a deal to move it to the next stage and watch the number of won deals grow. A custom CRM keeps all of this in one place.", tips: ["Tap a deal card to move it to the next stage.","A CRM keeps leads, deals and customers in one place.","Automations follow up so nobody is forgotten.","We connect it to email, WhatsApp and your ERP."] },
  cta: { heading: "Let's Build A CRM That\nWorks The Way You Do", text: "Tell us how you run your business and we will build a CRM that makes it faster, smarter and more profitable.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// 2D & 3D Animation (/animation)
// ---------------------------------------------------------------------------------------------------------------------
export const ANIMATION_SEO = {
  title: "2D & 3D Animation Services in India | CGI & Product Visualization | We3vision",
  description:
    "2D animation, 3D animation, CGI and 3D product visualization for explainers, promotions and brand storytelling. We3vision turns concepts into engaging visual content tailored to your project.",
};
export const ANIMATION_SECTIONS = build({
  seo: ANIMATION_SEO,
  hero: {
    chip: "2D/3D Animation",
    heading: "Bring Your Ideas To Life\nWith 2D & 3D Animation",
    text: "Transform concepts into engaging digital experiences through creative 2D animation, 3D animation, CGI and product visualization. We3vision helps businesses communicate ideas, showcase products and create memorable digital content aligned to their project requirements.",
    primaryLabel: "Discuss your animation project",
    secondaryLabel: "Our animation services",
  },
  story:
    "*Animation* is one of the clearest ways to explain a product, tell a brand story or present an idea. We create *2D animation, 3D animation, CGI and 3D visualization* in a style that fits your *audience and your goals*.\n\nOur animation and 3D capabilities connect with broader digital work too, including *AR/VR, metaverse solutions and creative design services*. Every project starts with understanding your objectives and ends with the animation delivered in the format you need.",
  subs: {
    chip: "Tailored visual experiences",
    heading: "Our Animation\nServices",
    intro: "Three kinds of animation work, each tailored to your creative goals and project requirements.",
    cards: [
      { title: "2D\nAnimation", description: "Engaging visual content for explainers, promotional campaigns, educational content and brand storytelling." },
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
      { title: "Project-focused solutions", description: "We focus on understanding your business goals and developing animation concepts that align with your project requirements." },
      { title: "Creative & 3D capabilities", description: "Our portfolio covers 3D modeling, 3D product visualization, 3D animation and interactive 3D experiences." },
      { title: "Structured development process", description: "A well-defined process organizes creative planning, production, feedback and final delivery." },
      { title: "Connected digital services", description: "Animation and 3D work can be used for broader digital experiences, including AR/VR, metaverse solutions and creative design." },
    ],
  },
  faq: [
    { question: "What animation services does We3vision offer?", answer: "We3vision's service portfolio covers 3D animation, 3D modeling, 3D product visualization and interactive 3D experiences. The availability of specific 2D animation and CGI deliverables depends on your project requirements." },
    { question: "Can you create custom 3D animation for my business?", answer: "Yes, custom 3D animation requirements can be discussed as per your project objectives, creative concept, visual requirements and expected deliverables." },
    { question: "What is the difference between 2D and 3D animation?", answer: "2D animation follows two-dimensional artwork and motion, while 3D animation creates depth in the visual. The right approach depends on your content, audience and project goals." },
    { question: "Can you create 3D product visualization?", answer: "3D product visualization falls under We3vision's 3D service portfolio. The final output and level of detail depend on the product, reference materials and project requirements." },
    { question: "How long does an animation project take?", answer: "The timeline depends on the type of animation, complexity of the project, number of scenes, revisions and deliverables. A timeline can be discussed after reviewing your project scope." },
    { question: "How much do 2D and 3D animation services cost?", answer: "The cost depends on the project complexity, time, visual quality, design requirements and production scope. Contact our team to discuss your requirements and receive a project-specific quotation." },
    { question: "Can animation be used for marketing and promotional content?", answer: "Yes, animation can be used to explain products, communicate concepts, present services and create promotional visuals. The suitable format depends on your campaign goals and target audience." },
    { question: "How do I start an animation project with We3vision?", answer: "Share your project idea, animation type, reference materials, expected deliverables and timeline. Our team can review your requirements and discuss the next steps." },
  ],
  related: [
    { title: "3D\nModeling", description: "3D assets, product visuals and digital environments.", href: "/3d-modeling" },
    { title: "Metaverse\nSolutions", description: "Virtual worlds and immersive experiences.", href: "/metaverse" },
    { title: "Graphics &\nUI/UX Design", description: "Brand visuals and marketing graphics.", href: "/graphics" },
    { title: "UI/UX\nDesign", description: "Interfaces for websites and apps.", href: "/ui-ux-design" },
  ],
  guide: { scene: "animation", chip: "Meet the animator", heading: "Press play,\nscrub the frames", text: "Drag the slider to move through the frames of a tiny animation, or press play and let the ball bounce.", tips: ["Drag the slider to scrub the animation frame by frame.","Squash and stretch make a simple ball feel alive.","2D, 3D, CGI and product visualization: all from one team.","Tell your story, explain your product, grow your brand."] },
  cta: { heading: "Have An Animation\nProject In Mind?", text: "Turn your concept into engaging visual content with animation and 3D solutions tailored to your goals. Share your requirements with our team and discuss the right approach.", button: "Discuss your animation project" },
});

// ---------------------------------------------------------------------------------------------------------------------
// 3D Modeling (/3d-modeling)
// ---------------------------------------------------------------------------------------------------------------------
export const MODELING_SEO = {
  title: "3D Modeling Services in India | 3D Product Visualization | We3vision",
  description:
    "Custom 3D modeling, 3D product visualization and digital environments for brands and immersive experiences. We3vision creates detailed 3D assets with PBR materials, lighting and optimization.",
};
export const MODELING_SECTIONS = build({
  seo: MODELING_SEO,
  hero: {
    chip: "3D Modeling",
    heading: "Bring Your Concepts To Life\nWith Custom 3D Modeling",
    text: "We create detailed 3D assets, product visuals and digital environments for businesses, brands and immersive experiences. Turn concepts into engaging visuals designed for your specific project requirements.",
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
      { title: "3D Product\nModels", description: "Custom product models and 3D product visualization for presentations, catalogs and interactive shopping." },
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
      { title: "Custom 3D solutions", description: "Our 3D modeling services are made to your project requirements, visualization references and business use." },
      { title: "Design and technology integration", description: "Our 3D development can be combined with related creative and technology projects such as product visualization, animation and interactive 3D experiences." },
      { title: "Project-focused workflow", description: "A consistent approach from concept planning to asset creation, refinement and delivery." },
      { title: "Assets for different digital experiences", description: "3D models for product presentation, immersive experiences, digital environments and other approved applications." },
      { title: "Scalable project scope", description: "From individual 3D assets to broader visualization projects, you can discuss the scope, requirements and deliverables with us." },
    ],
  },
  faq: [
    { question: "What is 3D modeling?", answer: "3D modeling is the process of creating digital three-dimensional objects or environments. These can be used for product visualization, animation, games, immersive experiences and other digital applications." },
    { question: "What types of 3D modeling services does We3vision offer?", answer: "We3vision's listed 3D services include 3D development, 3D product visualization, 3D modeling, 3D animation and interactive 3D experiences. The specific deliverables depend on your project requirements." },
    { question: "Can you create custom 3D product models?", answer: "Yes, custom 3D product modeling can be discussed based on your product references, design requirements and intended use. Product complexity, formats and deliverables are confirmed before starting the project." },
    { question: "Can 3D models be used in AR, VR or metaverse projects?", answer: "Yes. 3D models can be used as assets in AR, VR and metaverse experiences. The modeling and optimization requirements are determined by the target platform and the planned interactions." },
    { question: "What information do you need to start a 3D modeling project?", answer: "Share your project concept, reference images, product specifications, preferred visual style, intended platform and expected deliverables. Our team can then discuss the scope and requirements." },
    { question: "How long does a 3D modeling project take?", answer: "The timeline depends on the complexity of the model, level of detail, number of assets, revisions and project requirements. We3vision can provide it after reviewing your project scope." },
    { question: "Can you optimize 3D models for interactive experiences?", answer: "3D asset optimization can be considered when the project needs performance for interactive or immersive platforms. The approach depends on the target device and application." },
    { question: "How much do 3D modeling services cost?", answer: "The cost depends on the complexity of the model, design requirements, number of assets, texturing, revisions and final deliverables. Contact We3vision for a project-specific estimate." },
  ],
  related: [
    { title: "2D/3D\nAnimation", description: "Animation, CGI and 3D visualization.", href: "/animation" },
    { title: "Metaverse\nSolutions", description: "Virtual worlds that use your 3D assets.", href: "/metaverse" },
    { title: "Web\nDevelopment", description: "Show your 3D models on a fast, responsive website.", href: "/webdev" },
    { title: "Graphics &\nUI/UX Design", description: "Brand visuals and interfaces.", href: "/graphics" },
  ],
  guide: { scene: "modeling", chip: "Meet the 3D artist", heading: "Turn the model\naround", text: "Drag the cube to look at it from every side, or switch the turntable on. This is how we show 3D products.", tips: ["Drag the cube to look at it from every side.","3D models work for products, games, AR and VR.","PBR materials and lighting make assets look real.","We optimize models for the platform they run on."] },
  cta: { heading: "Bring Your 3D\nConcept To Life", text: "Do you have a product, character, environment or creative idea that you want to see in 3D? Tell us about your project and discuss the right approach.", button: "Start your 3D project" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Graphics & UI/UX Design (/graphics)
// ---------------------------------------------------------------------------------------------------------------------
export const GRAPHICS_SEO = {
  title: "Graphic Design & UI/UX Design Services in India | We3vision",
  description:
    "Logo design, website and app UI/UX design, branding kits, pitch decks and marketing graphics. We3vision creates brand visuals and interfaces that connect with your audience.",
};
export const GRAPHICS_SECTIONS = build({
  seo: GRAPHICS_SEO,
  hero: {
    chip: "Graphic Design",
    heading: "Graphics & UI/UX Design\nThat Connect With People",
    text: "Create engaging brand visuals and user experiences with We3vision Graphics & UI/UX Design services. We design website interfaces, e-commerce concepts, brand visuals, marketing materials and other graphics for digital products.",
    primaryLabel: "Start your design project",
    secondaryLabel: "What we design",
  },
  story:
    "We combine *creative design thinking and product development experience* to bring business goals and user experience together in *brand visuals and interface designs*.\n\nOur design services cover *UI/UX design, web design, responsive web design, e-commerce design and mobile app design*, together with *brand identity, logo design, brand guidelines and marketing collateral*, so your brand looks consistent everywhere your audience meets it.",
  subs: {
    chip: "What we design",
    heading: "Our Design\nServices",
    intro: "Interfaces for your digital products and graphics for your brand.",
    cards: [
      { title: "Website & App\nUI/UX Design", description: "Website interfaces, responsive web design and mobile app design tailored to your product ecosystem.", href: "/ui-ux-design" },
      { title: "E-commerce\nDesign", description: "Conversion-optimized storefronts, product cards and intuitive checkout flows." },
      { title: "Logo &\nBrand Identity", description: "Logo design, brand guidelines and a distinctive, memorable brand presence.", href: "/brand-identity" },
      { title: "Marketing\nGraphics", description: "Advertising creatives, social media content, campaign landing pages and brand collateral.", href: "/brand-identity/marketing-collateral" },
      { title: "Pitch Decks &\nPresentations", description: "Investor pitch decks and presentation design that tell your story clearly." },
      { title: "Design Systems", description: "Design systems that keep your product consistent across platforms and simplify future growth.", href: "/ui-ux-design" },
    ],
  },
  process: {
    heading: "A Structured Process\nFor Design Projects",
    intro: "An organized process to learn your requirements, develop creative concepts and plan the design and prototyping stages.",
    items: [
      { title: "Discover your requirements", text: "We learn about your business, target audience, brand guidelines, business goals and design requirements.", points: "Business and project goals\nTarget audience analysis\nBrand preferences & guidelines" },
      { title: "Research and planning", text: "We conduct research and plan the project based on your requirements and expectations.", points: "User and competitor research\nInformation architecture\nVisual direction & moodboards" },
      { title: "Wireframes and UX planning", text: "We develop UX strategies and design page layouts for web and mobile apps.", points: "Low & high-fidelity wireframes\nUser flows & navigation paths" },
      { title: "Visual design and prototyping", text: "We develop UI design concepts and interactive mockups for your approval.", points: "Typography, color & iconography\nInteractive clickable prototypes" },
      { title: "Review and refinement", text: "We hold a review meeting to receive your feedback and finalize the design.", points: "Design iterations & revisions\nResponsive layout adjustments" },
      { title: "Design handoff", text: "We prepare design handoff packages for implementation when needed.", points: "Organized design source files\nAsset export & developer handoff" },
    ],
  },
  tools: { heading: "Our Design\nTools", items: "Figma\nAdobe XD\nAdobe Illustrator\nAdobe Photoshop\nSketch\nInVision\nZeplin\nAfter Effects" },
  industries: {
    heading: "Design For\nDifferent Industries",
    intro: "We tailor our design services to the user habits and business models of each sector.",
    items: [
      { name: "Healthcare", description: "Clean, accessible patient portals, telemedicine interfaces and digital health applications designed with clarity and trust in mind." },
      { name: "Education", description: "Intuitive LMS platforms, educational apps and engaging e-learning dashboards that simplify digital learning." },
      { name: "Construction", description: "Functional project management interfaces, architecture presentation kits and equipment visualization platforms." },
      { name: "E-commerce", description: "Conversion-optimized storefronts, attractive product cards, intuitive checkout flows and dynamic shopping experiences." },
      { name: "Gaming", description: "Engaging game UI/UX, responsive HUD design, interactive game menus and striking promotional art." },
      { name: "Marketing", description: "High-impact advertising creatives, campaign landing pages, social media graphics and brand collateral." },
      { name: "Corporate", description: "Professional B2B portals, executive dashboards, investor pitch decks and cohesive corporate design systems." },
    ],
  },
  why: {
    heading: "Design That Helps Your\nBrand Connect",
    items: [
      { title: "Design to meet business goals", description: "Your business goals and target audience inform our design strategy and help us create effective digital experiences that drive engagement and conversions." },
      { title: "Comprehensive design solutions", description: "UI/UX design, web design, responsive web design, e-commerce design and mobile app design for your product ecosystem." },
      { title: "Consistent brand presentation", description: "Brand identity design, logo design, brand guidelines and marketing collateral to establish a memorable brand presence." },
      { title: "Design systems for consistency", description: "Design systems maintain consistency across platforms, simplify product expansion and streamline collaboration between designers and developers." },
      { title: "Collaborative design process", description: "We collaborate closely with you and incorporate your feedback at every iteration." },
    ],
  },
  faq: [
    { question: "What graphic design & UI/UX services does We3vision offer?", answer: "We3vision offers logo design, website UI/UX design, website and mobile app design, branding kits, pitch deck design and other graphic design services. We offer custom graphic design solutions depending on your requirements." },
    { question: "Can you redesign my website or mobile app?", answer: "Yes, We3vision offers website redesign and mobile app redesign services to help you update your website and application with modern UX and refreshed visual aesthetics." },
    { question: "What design tools do you use for UI/UX design?", answer: "We3vision works with Figma, Adobe XD, Illustrator, Photoshop and other design tools to deliver quality design solutions." },
    { question: "How long does it take to design a website or application?", answer: "It depends on the complexity of your project. On average, it takes 1–2 weeks to design a website or mobile application UI/UX, and longer to develop complete design systems." },
    { question: "Can I get design files for my project?", answer: "Yes, we offer design files as part of our design service depending on the project scope and requirements." },
    { question: "Do you offer affordable graphic design & UI/UX services?", answer: "We3vision offers competitive graphic design rates and packages depending on your project scope, business goals and design requirements. Contact us to discuss and get a customized quote." },
    { question: "Can you assist with branding and marketing design?", answer: "Yes, We3vision offers branding and marketing design services including logo design, brand guidelines, advertising creatives, social media content and other marketing materials." },
    { question: "How can I get started with We3vision design services?", answer: "Contact We3vision to discuss your project requirements and get a custom quote and project proposal." },
  ],
  related: [
    { title: "Brand Identity\nDesign", description: "Brand strategy, logo, visual identity and guidelines.", href: "/brand-identity" },
    { title: "UI/UX\nDesign", description: "Interfaces for websites and apps.", href: "/ui-ux-design" },
    { title: "2D/3D\nAnimation", description: "Animation and 3D visualization.", href: "/animation" },
    { title: "Web\nDevelopment", description: "Bring your designs to life on the web.", href: "/webdev" },
  ],
  guide: { scene: "graphics", chip: "Meet the designer", heading: "Pick a colour,\nchange the brand", text: "Pick a colour and watch the logo, and the guide's shirt, change with it. One consistent look is what good branding is about.", tips: ["Pick a colour: the logo and my shirt change with it.","One consistent look across logo, website and ads.","Logo, brand guidelines, pitch decks and social graphics: we design them all."] },
  cta: { heading: "Have A\nDesign Project?", text: "Whether you need a website interface redesign, brand identity design or other graphic design, We3vision can help. Let's talk about your project and requirements.", button: "Start your design project" },
});

// ---------------------------------------------------------------------------------------------------------------------
// SEO Optimization (/seo)
// ---------------------------------------------------------------------------------------------------------------------
export const SEO_SEO = {
  title: "SEO Services in Surat, India | Get Found on Google | We3vision",
  description:
    "SEO optimization: website audits, keyword research, on-page and technical SEO, content strategy, link building and reporting. We3vision helps your website rank higher and bring organic traffic and leads.",
};
export const SEO_SECTIONS = build({
  seo: SEO_SEO,
  hero: {
    chip: "SEO Optimization",
    heading: "Get Found On Google,\nGrow Organically",
    text: "Struggling to appear on search engines? Our SEO services are designed to put your website in front of the right audience without paid ads. From keyword research to content optimization and technical audits, we make sure your site ranks higher, loads faster and attracts more traffic that converts.",
    primaryLabel: "Get a free quote",
    secondaryLabel: "What we do",
  },
  story:
    "Whether you are a *local business, a startup or a global brand*, we create *custom SEO strategies* that drive *long-term growth and visibility* on Google and beyond.\n\nWe balance *high-quality content and a technically sound website* for a complete SEO solution, we follow *white hat practices only*, and we keep you informed with *clear, regular reports* from Google Analytics and Search Console.",
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
      { title: "Proven SEO track record", description: "We have helped startups and established brands climb the rankings and increase leads organically." },
      { title: "Custom SEO strategies", description: "No copy-paste plans. We build your strategy around your industry, audience and goals." },
      { title: "White hat SEO only", description: "We follow Google's best practices: no shady tactics, no penalties, just clean, long-term results." },
      { title: "Content + technical balance", description: "We focus on both high-quality content and a technically sound website for a complete SEO solution." },
      { title: "Transparent reporting", description: "You always know what is happening, with clear, regular updates and data-backed insights." },
    ],
  },
  faq: [
    { question: "How long does SEO take to show results?", answer: "SEO is a long-term strategy. You may start seeing results in 2–3 months, with strong improvements over 6–12 months." },
    { question: "Do you guarantee top rankings?", answer: "No ethical SEO company can guarantee #1 rankings. We focus on real growth, quality traffic and sustainable progress." },
    { question: "Can you do SEO for multilingual or global websites?", answer: "Yes. We have experience with international SEO and multilingual site optimization." },
    { question: "What is included in your monthly SEO package?", answer: "It includes audits, keyword research, content updates, technical fixes, backlink outreach and monthly reporting." },
    { question: "Will you help with local SEO for my business?", answer: "Absolutely. We can optimize your Google Business Profile and location pages to drive foot traffic and local leads." },
  ],
  related: [
    { title: "Web\nDevelopment", description: "Fast, SEO-friendly websites built with clean code.", href: "/webdev" },
    { title: "UI/UX\nDesign", description: "Designs that keep visitors and turn them into leads.", href: "/ui-ux-design" },
    { title: "Brand\nDesign", description: "A clear brand that people remember and search for.", href: "/brand-identity" },
    { title: "AI\nDevelopment", description: "Chatbots and automation for the leads SEO brings.", href: "/ai" },
  ],
  guide: { scene: "seo", chip: "Meet the SEO guide", heading: "Climb to\nnumber one", text: "Press the button to optimise the site and watch it climb the search results, one step at a time.", tips: ["Press Optimise and watch the website climb the results.","Good SEO means better content and a faster, cleaner site.","We use white hat SEO only: no shady tricks.","Results usually start in 2–3 months and grow over 6–12."] },
  cta: { heading: "Want To Rank\nHigher On Google?", text: "Let's audit your site and discuss the best way to bring you more organic traffic, leads and visibility.", button: "Get a free quote" },
});
