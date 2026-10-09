import { POSTS } from "../../blog-posts";
import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// COMPANY PAGES of the footer: Blog (/blog), Contact (/contact) and Careers (/careers). Facts (offices, e-mail, phone numbers, the seven teams, the
// values) come from the old site https://www.we3vision.com. No open positions, salaries or numbers are invented. This is what visitors see until
// someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({ id, type, data: data as Record<string, unknown> });

// ---- Blog ----
export const BLOG_SEO = {
  title: "Blog | Web, AI, Design & Digital Insights | We3vision",
  description: "Articles from We3vision on UI/UX design, AI automation and building better websites, apps and digital products.",
};
export const BLOG_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Blog",
    heading: "Ideas, Guides\nAnd Insights",
    text: "Plain-language articles from our team about design, AI and building better websites, apps and digital products.",
    primaryLabel: "Read the articles",
    primaryHref: "#blogs",
    secondaryLabel: "Talk to us",
    secondaryHref: "#contact",
  }),
  section("blogs", {
    chip: "Latest articles",
    heading: "Read Our\nLatest Articles",
    buttonLabel: "",
    buttonHref: "",
    items: POSTS.map((p) => ({ category: p.category, title: p.title, image: p.image, href: `/blog/${p.slug}` })),
  }),
  section("contact", { chip: "Let's talk", heading: "Have A Project\nIn Mind?", text: "Tell us what you want to build and we will get back to you.", buttonLabel: "Send a message" }),
];

// ---- Contact ----
export const CONTACT_SEO = {
  title: "Contact We3vision | Surat, India & Marburg, Germany",
  description: "Contact We3vision Private Limited: send us a message, or write or call our offices in Surat, India and Marburg, Germany. Web, AI, apps, VR and design.",
};
export const CONTACT_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Contact us",
    heading: "Let's Talk\nAbout Your Project",
    text: "Tell us what you need: a website, an app, AI, VR or a new brand. We will get back to you.",
    primaryLabel: "Send a message",
    primaryHref: "#contact",
    secondaryLabel: "Our offices",
    secondaryHref: "#reach",
  }),
  section("contact", {
    chip: "Contact",
    heading: "Let's Get\nStarted!",
    text: "Fill in the form and the We3vision team will reply. You can also write or call one of our offices below.",
    buttonLabel: "Send a message",
  }),
  section("reach", {
    chip: "Our offices",
    heading: "Surat, India\nAnd Marburg, Germany",
    text: "Our head office and development team are in Surat, Gujarat. Our second office is in Marburg, Germany. Write to info@we3vision.com or call +91 7383216096.",
    buttonLabel: "Send a message",
    buttonHref: "#contact",
    places: [
      { label: "Surat, India", lat: "21.1702", lng: "72.8311" },
      { label: "Marburg, Germany", lat: "50.8021", lng: "8.7667" },
    ],
  }),
];

// ---- Careers ----
export const CAREERS_SEO = {
  title: "Careers at We3vision | Join Our Team in Surat, India",
  description: "Work with We3vision Private Limited in Surat: web, apps, AI, metaverse, UI/UX, brand design and CRM. Send us your details and tell us what you would like to build.",
};
export const CAREERS_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Careers",
    heading: "Build Great Things\nWith Us",
    text: "At We3vision we value innovation, collaboration and growth. If you would like to be part of the team, we would be glad to hear from you.",
    primaryLabel: "Get in touch",
    primaryHref: "#contact",
    secondaryLabel: "Our teams",
    secondaryHref: "#services",
  }),
  section("advantages", {
    chip: "What we value",
    heading: "A Place To\nGrow",
    intro: "How we like to work, and what you will find when you join.",
    items: [
      { title: "Innovation", description: "We bring fresh ideas and new technology to every project, from websites and apps to AI and VR." },
      { title: "Collaboration", description: "Designers, developers, artists and project managers work together, and everyone's ideas count." },
      { title: "Growth", description: "We are excited to see the impact you will make, and we want you to grow with the company." },
      { title: "Many skills, one team", description: "Brand design, web, mobile, AI, metaverse, UI/UX and CRM teams work under one roof." },
      { title: "Surat and Germany", description: "Our head office is in Surat, India, and we have a second office in Marburg, Germany." },
    ],
  }, "why-we3vision"),
  section("services", {
    chip: "Our teams",
    heading: "Seven Teams,\nOne Company",
    intro: "These are the areas we work in. Tell us which one fits you.",
    buttonLabel: "",
    buttonHref: "",
    cards: [
      { title: "Brand\nDesign", description: "Brand identity, logos, visual identity and marketing material.", href: "/brand-identity" },
      { title: "Web\nDevelopment", description: "Websites and web portals, from WordPress and Shopify to custom builds.", href: "/webdev" },
      { title: "Mobile App\nDevelopment", description: "Android and iOS apps from the first idea to the store launch.", href: "/mobile" },
      { title: "AI\nDevelopment", description: "Chatbots, machine learning, computer vision and AI agents.", href: "/ai" },
      { title: "Metaverse\nSolutions", description: "Virtual worlds, VR experiences and interactive 3D with Unity and Unreal Engine.", href: "/metaverse" },
      { title: "UI/UX\nDesign", description: "Wireframes, prototypes and interfaces for websites and apps.", href: "/ui-ux-design" },
      { title: "CRM\nDevelopment", description: "Custom CRM software, workflows and integrations.", href: "/crm" },
    ].map((c) => ({ ...c, fit: "", problems: "", outcomes: "" })),
  }),
  section("contact", {
    chip: "Join us",
    heading: "Want To Work\nWith Us?",
    text: "Tell us about yourself, the role you are interested in and what you would like to work on. You can also write to hr@we3vision.com.",
    buttonLabel: "Send message",
  }),
];

// ---- Portfolio (the projects you add under Projects in the admin panel) ----
export const PORTFOLIO_SEO = {
  title: "Portfolio | Our Work | We3vision",
  description: "A selection of the projects We3vision has built for clients: brand identity, websites, apps, AI and immersive experiences.",
};
export const PORTFOLIO_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Portfolio",
    heading: "Our Work",
    text: "Brands, websites, apps and experiences we have made together with our clients.",
    primaryLabel: "See the projects",
    primaryHref: "#projects",
    secondaryLabel: "Start a project",
    secondaryHref: "#contact",
  }),
  section("projects", { chip: "Our work", heading: "Projects We\nAre Proud Of", intro: "", group: "" }, "projects"),
  section("contact", { chip: "Let's talk", heading: "Have A Project\nIn Mind?", text: "Tell us what you want to build and we will get back to you.", buttonLabel: "Send a message" }),
];
