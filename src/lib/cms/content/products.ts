import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// OUR PRODUCTS: software products built by We3vision. WeBugMate is live on its own website; WeJobs, WeThink and WePresent are coming soon.
// Only what the owner has said is written here: WeBugMate is an AI-powered project and task management product (its own site says the same);
// the other three have no public description yet, so their pages say that they are in development and nothing more. No features, prices or
// numbers are invented. The owner can edit every word in the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>, id: string = type): PageSection => ({ id, type, data: data as Record<string, unknown> });

export const PRODUCT_LINKS = {
  webugmate: "https://www.webugmate.com",
  wejobs: "https://www.wejobs.we3vision.com",
  wethink: "https://www.wethink.we3vision.com",
} as const;

const contact = (heading: string, text: string, button: string) => section("contact", { chip: "Let's talk", heading, text, buttonLabel: button });

// ---- /products ----
export const PRODUCTS_SEO = {
  title: "Our Software Products | WeBugMate, WeJobs, WeThink, WePresent | We3vision",
  description: "Software products built by We3vision, Surat, India: WeBugMate, an AI-powered project and task management tool, and the upcoming WeJobs, WeThink and WePresent.",
};
export const PRODUCTS_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Our Products",
    heading: "Software Products\nBuilt By We3vision",
    text: "Besides building software for clients, we build our own. These are the products we are developing and bringing to the market.",
    primaryLabel: "See WeBugMate",
    primaryHref: "/products/webugmate",
    secondaryLabel: "Talk to us",
    secondaryHref: "#contact",
  }),
  section("story", {
    body: "We3vision is a *software and digital company in Surat, India*. Years of building websites, apps and business software for clients taught us what teams really need, and now we are turning that experience into *our own software products*.\n\n*WeBugMate* is live today. *WeJobs, WeThink and WePresent* are on the way, and this page will grow as each one launches.",
  }),
  section("services", {
    chip: "Products",
    heading: "Meet The\nProducts",
    intro: "One live product and three that are coming soon.",
    buttonLabel: "",
    buttonHref: "",
    cards: [
      { title: "WeBugMate", description: "AI-powered project and task management. Live now, with its own website.", href: "/products/webugmate", fit: "", problems: "", outcomes: "" },
      { title: "WeJobs", description: "A new software product from We3vision. Coming soon.", href: "/products/wejobs", fit: "", problems: "", outcomes: "" },
      { title: "WeThink", description: "A new software product from We3vision. Coming soon.", href: "/products/wethink", fit: "", problems: "", outcomes: "" },
      { title: "WePresent", description: "A new software product from We3vision. Coming soon.", href: "/products/wepresent", fit: "", problems: "", outcomes: "" },
    ],
  }),
  contact("Want To Know\nWhen They Launch?", "Tell us your name and email and what you are interested in. We will write to you when a product is ready.", "Contact us"),
];

// ---- /products/webugmate ----
export const WEBUGMATE_SEO = {
  title: "WeBugMate | AI-Powered Project & Task Management | We3vision",
  description: "WeBugMate is an AI-powered project and task management product built by We3vision, Surat, India. Visit www.webugmate.com to see it.",
};
export const WEBUGMATE_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Our Product",
    heading: "WeBugMate\nAI-Powered Project Management",
    text: "WeBugMate is an AI-powered project and task management product built by We3vision. Plan your work, organise your tasks and keep your team on the same page.",
    primaryLabel: "Visit WeBugMate",
    primaryHref: PRODUCT_LINKS.webugmate,
    secondaryLabel: "All products",
    secondaryHref: "/products",
  }),
  section("story", {
    body: "*WeBugMate* is project and task management software, made by the team at *We3vision Private Limited, Surat, India*. It brings *artificial intelligence* into the everyday work of planning projects and following tasks.\n\nThe product has its own website, where you can see what it offers and get started: *www.webugmate.com*.",
  }),
  section("faq", {
    chip: "FAQ",
    heading: "Questions\nAbout WeBugMate",
    intro: "",
    items: [
      { question: "What is WeBugMate?", answer: "WeBugMate is an AI-powered project and task management product built by We3vision." },
      { question: "Who built WeBugMate?", answer: "It is developed by We3vision Private Limited, a software company based in Surat, India." },
      { question: "Where can I try it or read more?", answer: "Everything about the product is on its own website, www.webugmate.com." },
      { question: "Can We3vision build a similar product for my business?", answer: "Yes. We build custom software and software products for clients. Tell us your idea through the contact form." },
    ],
  }),
  contact("Questions About\nWeBugMate?", "Write to us and we will reply, or visit the product website to see it for yourself.", "Contact us"),
];

// ---- coming soon pages ----
const soon = (name: string, url?: string): PageSection[] => [
  section("pageHero", {
    chip: "Coming soon",
    heading: `${name}\nIs Coming Soon`,
    text: `${name} is a new software product from We3vision and it is in development. The details will be shared here when it is ready to launch.`,
    primaryLabel: url ? `Visit ${url.replace("https://", "")}` : "Tell me when it launches",
    primaryHref: url ?? "#contact",
    secondaryLabel: "All products",
    secondaryHref: "/products",
  }),
  section("story", {
    body: `*${name}* is one of the software products that the team at *We3vision Private Limited, Surat, India* is building. We are working on it now and will publish what it does, who it is for and how to start as soon as it is ready.\n\nMeanwhile, you can see our live product *WeBugMate*, or write to us if you would like to hear about ${name} first.`,
  }),
  contact(`Hear About ${name}\nFirst`, `Leave your details and we will tell you when ${name} is ready.`, "Notify me"),
];
export const WEJOBS_SEO = { title: "WeJobs | Coming Soon | We3vision", description: "WeJobs is a new software product from We3vision, Surat, India, currently in development." };
export const WEJOBS_SECTIONS = soon("WeJobs", PRODUCT_LINKS.wejobs);
export const WETHINK_SEO = { title: "WeThink | Coming Soon | We3vision", description: "WeThink is a new software product from We3vision, Surat, India, currently in development." };
export const WETHINK_SECTIONS = soon("WeThink", PRODUCT_LINKS.wethink);
export const WEPRESENT_SEO = { title: "WePresent | Coming Soon | We3vision", description: "WePresent is a new software product from We3vision, Surat, India, currently in development." };
export const WEPRESENT_SECTIONS = soon("WePresent");
