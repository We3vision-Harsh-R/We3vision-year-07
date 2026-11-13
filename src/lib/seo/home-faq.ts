import type { SiteSettings } from "@/lib/cms/settings";

// The questions of the home page FAQ (components/site/home/home-faq.tsx) AND the FAQPage data of the home page (app/(site)/page.tsx): one list,
// so the visible text and the structured data are always the same. Each answer starts with the answer itself (a search engine or an AI assistant
// can quote it as it is) and every fact is one that is already on the website (About, Services, Metaverse, AI and Contact pages, the footer).
// Nothing here is a number, a client or a result that the site does not show. Edit the wording here; the contact answer follows Admin > Settings.

export type HomeFaqItem = { question: string; answer: string; href: string; link: string };

const isEmail = (l: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l);
const isPhone = (l: string) => /^\+?\d[\d\s().-]{6,}$/.test(l);

export function homeFaq(site: SiteSettings): HomeFaqItem[] {
  const lines = site.contactCards.flatMap((c) => c.lines.split("\n").map((l) => l.trim()));
  const email = lines.find(isEmail);
  const phone = lines.find(isPhone);
  const reach = [email ? `write to ${email}` : "", phone ? `call ${phone}` : ""].filter(Boolean).join(" or ");
  return [
    {
      question: "What services does We3vision Private Limited provide?",
      answer:
        "We3vision Private Limited is a software and digital company in Surat, India, founded in 2019. It builds websites, mobile apps, AI solutions, AR/VR and metaverse experiences, games, UI/UX design, brand and graphic design, 2D and 3D animation, CRM and custom software for businesses in India and around the world.",
      href: "/services",
      link: "See all services",
    },
    {
      question: "Is We3vision an AI development company in India?",
      answer:
        "Yes. We3vision is based in Surat, Gujarat, and builds custom AI for businesses: chatbots and AI assistants, document and data understanding, prediction and automation, and the integration of these into the software a team already uses.",
      href: "/ai",
      link: "AI development services",
    },
    {
      question: "Does We3vision develop AR and VR applications?",
      answer:
        "Yes. We3vision builds VR and AR experiences, 3D worlds and showrooms, and real-time 3D for the web, using tools such as Unity and Unreal Engine. The metaverse page shows examples, including a VR simulation of the coal mining process and a metaverse roadwork digitization project.",
      href: "/metaverse",
      link: "AR, VR and metaverse work",
    },
    {
      question: "Does We3vision provide metaverse development services?",
      answer:
        "Yes. Metaverse development is one of We3vision's core services: virtual worlds and platforms, virtual events and spaces, immersive brand experiences and metaverse games, planned around your business goals and audience.",
      href: "/metaverse",
      link: "Metaverse development",
    },
    {
      question: "Can We3vision build custom mobile applications?",
      answer:
        "Yes. We3vision designs and develops custom mobile apps, using native tools such as Kotlin and Swift as well as cross-platform frameworks such as Flutter and React Native, from planning and design through launch and ongoing support.",
      href: "/mobile",
      link: "Mobile app development",
    },
    {
      question: "Does We3vision provide game development services?",
      answer:
        "Yes. We3vision builds interactive games and 3D game experiences for web, mobile and emerging platforms. Game development is part of its metaverse and 3D work, with engines such as Unity and Unreal Engine.",
      href: "/metaverse",
      link: "Games and 3D experiences",
    },
    {
      question: "Which industries does We3vision serve?",
      answer:
        "We3vision works with e-commerce, healthcare, real estate, education, finance, construction and mining, and travel and hospitality businesses. Typical work includes online stores, clinic portals, property platforms with VR walkthroughs, learning platforms and fintech web apps.",
      href: "#industries",
      link: "Industries we build for",
    },
    {
      question: "Which technologies does We3vision use?",
      answer:
        "We3vision works with React.js, Vue.js, Angular, Node.js, Laravel, PHP, WordPress, Shopify, Kotlin, Swift, Flutter, React Native, Python, TensorFlow, OpenAI, Unity, Unreal Engine, PostgreSQL, MongoDB and Docker.",
      href: "#tools",
      link: "Our tools and technologies",
    },
    {
      question: "Does We3vision work with clients outside India?",
      answer:
        "Yes. We3vision is based in Surat, India, has a second office in Marburg, Germany, and has worked with clients from many countries, including the United States, Canada, the United Kingdom, Germany, the UAE, Singapore and Australia.",
      href: "/about",
      link: "About We3vision",
    },
    {
      question: "How can businesses contact We3vision?",
      answer: `Send a message through the contact form on the website${reach ? `, or ${reach}` : ""}. The head office is in Surat, Gujarat, India, and a second office is in Marburg, Germany. The We3vision team will get back to you.`,
      href: "/contact",
      link: "Contact We3vision",
    },
  ];
}
