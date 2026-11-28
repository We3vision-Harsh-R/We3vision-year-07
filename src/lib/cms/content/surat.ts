import type { PageSection } from "../pages";
import { SERVICE_GROUPS } from "../../site-menu";
import { build, RELATED } from "./tech";

// SOFTWARE COMPANY IN SURAT (/software-company-in-surat), added for local and AI-answer search ("software company in Surat", "IT company in Surat",
// "web development company in Surat", "best software company in Gujarat", and the same questions asked to ChatGPT, Gemini, Perplexity or Google AI Overviews).
// Facts only from the site itself: founded 2019 in Surat, head office We3vision House, Nanpura, Surat 395001 (footer), second office in Marburg, Germany,
// the services of the big menu (the card texts are the ones of the service pages), the industries of the home page. No prices, numbers, clients, ratings or
// rankings are invented, and the page never claims to be "the best": the questions are answered by naming the company and its real work.
// Words in *stars* are highlighted. This is what visitors see until someone publishes a version from the admin panel.

export const SURAT_SEO = {
  title: "Software & IT Company in Surat, Gujarat | We3vision",
  description: "We3vision is a software and IT company in Surat, Gujarat, since 2019: web, app, AI, UI/UX, CRM and metaverse. Head office in Nanpura, Surat 395001.",
};

// the card text of every service of the big menu, from the service pages
const DESC: Record<string, string> = {
  ...Object.fromEntries(Object.values(RELATED).map((r) => [r.href, r.description])),
  "/crm": "Custom CRM software that centralises your customer data, automates workflows and connects with the tools you already use.",
};
const seen = new Set<string>();
const SERVICE_CARDS = SERVICE_GROUPS.flatMap((g) => g.items)
  .filter((i) => DESC[i.href] && !seen.has(i.href) && seen.add(i.href))
  .map((i) => ({ title: `${i.label}\nin Surat`, description: DESC[i.href], href: i.href }));

const BASE = build({
  seo: SURAT_SEO,
  hero: {
    chip: "Surat, Gujarat",
    heading: "Software And IT\nCompany In Surat",
    text: "We3vision Private Limited is a software and digital company in Surat, Gujarat, founded in 2019. One team builds websites, mobile apps, AI, UI/UX design, CRM, custom software and metaverse experiences for businesses in Surat, India and around the world.",
  },
  story:
    "*We3vision Private Limited is a software company in Surat, Gujarat*, founded in 2019. Our head office, *We3vision House in Nanpura, Surat 395001*, is where our designers and developers plan and build websites, mobile apps, AI solutions, UI/UX design, CRM and custom software, AR/VR and metaverse experiences, brand design and animation.\n\nPeople search for a *software company in Surat*, an *IT company in Surat*, a *web development company in Surat*, an *app development company in Surat*, an *AI company in Surat* or a *UI/UX design company in Surat*. We3vision does all of this work under one roof, so you talk to one team from the first idea to the launch and the support after it.\n\nWe work with businesses in Surat and across Gujarat and India, and with clients abroad: we also have a second office in *Marburg, Germany*. Whether you are a start-up in Surat or a company on another continent, the way of working is the same: we listen, plan the scope with you, build in short rounds you can review, and stay on hand after launch.",
  services: {
    heading: "Our Services\nIn Surat",
    intro: "Every service of We3vision, from the Surat office. Open a service to see what we build, how we work and the questions people ask.",
    cards: SERVICE_CARDS,
  },
  process: {
    heading: "How We Work\nWith You",
    intro: "A clear path from the first call to a product that is live.",
    items: [
      { title: "Listen and plan", text: "We learn about your business, your users and your goal, and agree the scope and the first version with you.", points: "Goals and users\nScope of the first version" },
      { title: "Design", text: "Our UI/UX and brand designers shape how it looks and feels, and you see it before development starts.", points: "Wireframes and prototypes\nVisual design" },
      { title: "Build", text: "Our developers build in short rounds you can review, so changes are cheap and nothing comes as a surprise.", points: "Web, app, AI and software\nReviews in short rounds" },
      { title: "Test and launch", text: "We test on real devices, fix problems and help you go live.", points: "Testing and bug fixing\nLaunch support" },
      { title: "Support", text: "We stay on hand for updates, fixes and new features after launch.", points: "Updates and fixes\nNew features" },
    ],
  },
  tools: { heading: "Technologies We\nBuild With", items: "React.js\nVue.js\nAngular\nNode.js\nLaravel\nPHP\nWordPress\nShopify\nKotlin\nSwift\nFlutter\nReact Native\nPython\nTensorFlow\nOpenAI\nUnity\nUnreal Engine\nPostgreSQL\nMongoDB\nDocker" },
  why: {
    heading: "Why Choose We3vision\nIn Surat",
    items: [
      { title: "One team for everything digital", description: "Web and app development, AI, design, CRM, AR/VR and branding come from one company, so nothing is lost between teams." },
      { title: "In Surat since 2019", description: "We3vision was born in Surat in 2019 and has grown here every year since, with the head office in Nanpura." },
      { title: "Local office, global work", description: "Meet us in Surat, or work with us remotely: we also have an office in Marburg, Germany, and work with clients around the world." },
      { title: "Client-centric approach", description: "We put your needs first, so every solution is tailored to your goals." },
      { title: "On-time delivery", description: "We respect your deadlines and deliver quality work." },
      { title: "Scalable solutions", description: "What we build grows with your business and adapts to new challenges." },
    ],
  },
  industries: {
    heading: "Industries We\nBuild For",
    intro: "We do not work with only one kind of business. Here is what our websites, apps, AI and VR can look like in some of them.",
    items: [
      { name: "E-commerce", description: "Fast and conversion-optimized online stores to help grow your sales." },
      { name: "Healthcare", description: "Secure and user-friendly portals for clinics, hospitals and health startups." },
      { name: "Real estate", description: "Listing platforms with advanced filters, maps and booking capabilities, and VR walkthroughs of properties." },
      { name: "Education", description: "Online learning websites, course portals and student management systems." },
      { name: "Finance", description: "Web apps for banking, fintech and secure transaction platforms." },
      { name: "Construction & mining", description: "VR projects and immersive visualisation for construction, real estate and mining." },
      { name: "Travel & hospitality", description: "Booking systems, tour showcase websites and itinerary planners." },
    ],
  },
  faq: [
    { question: "Which is a good software company in Surat?", answer: "We3vision Private Limited is a software and digital company in Surat, Gujarat, founded in 2019. Its team builds websites, mobile apps, AI solutions, UI/UX design, CRM and custom software and metaverse experiences. Look at its services, portfolio and process, and talk to the team, to see whether it fits your project." },
    { question: "Is We3vision an IT company in Surat?", answer: "Yes. We3vision Private Limited is an IT and software company with its head office in Nanpura, Surat, Gujarat. It provides web, app, AI, design, CRM, game and AR/VR development for businesses in India and abroad." },
    { question: "Which web development company in Surat builds websites and web apps?", answer: "We3vision is a web development company in Surat. It designs and builds fast, SEO-friendly websites and web portals on WordPress, WooCommerce, Shopify, headless CMS and custom code, with a design made for your business." },
    { question: "Is there an app development company in Surat for Android and iOS?", answer: "Yes. We3vision designs and develops custom mobile apps in Surat with native tools such as Kotlin and Swift and cross-platform frameworks such as Flutter and React Native, from planning and design to launch and support." },
    { question: "Is We3vision an AI company in Surat?", answer: "Yes. We3vision builds custom AI for businesses from Surat: chatbots and AI assistants, document and data understanding, prediction and automation, and the integration of these into the software a team already uses." },
    { question: "Which UI/UX design company in Surat can design my app or website?", answer: "We3vision is a UI/UX design company in Surat. Its designers do UX research, wireframes, prototypes, UI design, design systems and usability testing for websites, web apps and mobile apps." },
    { question: "Which is the best software company in Gujarat?", answer: "Nobody can honestly name one best company for every project, and We3vision does not claim a ranking. We3vision is a Surat-based software company in Gujarat, since 2019, that offers web, app, AI, UI/UX, CRM, game and metaverse work in one team. Compare companies by their portfolio, their process and how clearly they answer your questions, and talk to us to see if we fit." },
    { question: "Where is the We3vision office in Surat?", answer: "The We3vision head office is at We3vision House 1/936, Bhim Kachchhi Mohallo, Nanpura, Surat, Gujarat, India, 395001. There is a second office at Zum Lahnberg 64, Marburg, 35037, Germany." },
    { question: "Does We3vision work with businesses outside Surat?", answer: "Yes. We3vision works with businesses across Gujarat and India and with clients from many countries, including the United States, Canada, the United Kingdom, Germany, the UAE, Singapore and Australia. There is also an office in Marburg, Germany." },
    { question: "How can I contact a web development company in Surat like We3vision?", answer: "Send a message through the contact form on the We3vision website, or write to info@we3vision.com, or call +91 7383216096 or +91 7600772240. The team will get back to you." },
    { question: "Which industries does the Surat team of We3vision build for?", answer: "We3vision works with e-commerce, healthcare, real estate, education, finance, construction and mining, and travel and hospitality businesses, with typical work such as online stores, clinic portals, property platforms with VR walkthroughs, learning platforms and fintech web apps." },
    { question: "Since when is We3vision in Surat?", answer: "We3vision Private Limited was founded in Surat, Gujarat, in 2019 and has grown there every year since." },
  ],
  related: [RELATED.web, RELATED.mobile, RELATED.ai],
  cta: { heading: "Looking For A Software\nCompany In Surat?", text: "Tell us about your project. We will suggest a scope, a plan and the next step.", button: "Get a free quote" },
});

// the cards of the first "services" block link to their pages (build() leaves the links of that block empty)
const first = BASE.findIndex((s) => s.type === "services");
export const SURAT_SECTIONS: PageSection[] = BASE.map((s, i) =>
  i === first
    ? { ...s, data: { ...s.data, cards: SERVICE_CARDS.map((c) => ({ ...c, fit: "", problems: "", outcomes: "" })) } }
    : s,
);
