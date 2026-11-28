import type { PageSection } from "../pages";
import type { SectionData, SectionType } from "../sections";

// BRAND DESIGN PAGES: the main page + one page for each of its four sub-services.
// Source of the main page: https://we3vision.com/#/brand-identity (the old site), same facts, process, tools, benefits and
// industries; wording tidied and enriched with search keywords (brand identity design, logo design, brand strategy,
// brand guidelines, Surat, India). The old site has NO separate pages for the four sub-services, so those pages are new:
// they only use what the old brand page says (strategy, logo, visual identity, guidelines, marketing collateral, process
// steps and tools). Nothing is invented: no numbers, prices, durations or client names.
// Words in *stars* are highlighted. This is what visitors see until someone publishes a version from the admin panel.

const section = <T extends SectionType>(type: T, data: SectionData<T>): PageSection => ({
  id: type,
  type,
  data: data as Record<string, unknown>,
});

const contact = (heading: string, text: string, button: string) => section("contact", { chip: "Let's talk", heading, text, buttonLabel: button });

// ---------------------------------------------------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------------------------------------------------

// 30 placeholder projects for the sliding pills: the 8 own artworks of /images/showcase in a mixed order, with numbered names so
// they are easy to find and replace in the admin panel (real photo: put the file in public/images/projects/ and set "image").
const SHOWCASE_IMAGES = ["peach", "rainbow", "silk", "leaf", "flowers", "swing", "tree", "dunes"];
const SHOWCASE_LABELS = ["Brand identity", "Logo design", "Visual identity", "Brand strategy", "Marketing collateral"];
export const SHOWCASE = Array.from({ length: 30 }, (_, i) => ({
  image: `/images/showcase/${SHOWCASE_IMAGES[(i * 3) % SHOWCASE_IMAGES.length]}.svg`,
  title: `Project ${String(i + 1).padStart(2, "0")}`,
  category: SHOWCASE_LABELS[i % SHOWCASE_LABELS.length],
  text: "A short description of the project: the client's goal and what we designed for them.",
}));

export const BRAND_SEO = {
  title: "Brand Identity Design Agency in Surat | Logo, Guidelines",
  description:
    "Brand identity design agency in Surat, India: logo design, brand strategy, guidelines and visual identity for USA, UK, Canada and Australia clients.",
};

export const BRAND_SECTIONS: PageSection[] = [
  // Giant word "Brand": its letters swipe through the same word in 7 languages of 7 countries (meaning is the same,
  // letters and spelling look different). Only this page has this hero.
  section("wordHero", {
    words:
      "English · UK | Brand\nHindi · India | ब्रांड\nRussian · Russia | Бренд\nGreek · Greece | Μάρκα\nJapanese · Japan | ブランド\nKorean · Korea | 브랜드\nChinese · China | 品牌",
    heading: "Build a brand identity that people remember.",
    text: "We3vision is a brand identity design agency in Surat, Gujarat, India. We build logo design, brand strategy, visual identity and brand guidelines for businesses in India, and for clients in the USA, UK, Canada and Australia.",
    primaryLabel: "Start your brand project",
    primaryHref: "#contact",
    secondaryLabel: "Explore brand services",
    secondaryHref: "#services",
    timezone: "Asia/Kolkata",
    clockLabel: "IN",
  }),
  // The 2nd section: tall pill-shaped photos that slide by themselves (same design as the Bungee template). The pictures are
  // our OWN abstract artwork in /images/showcase/*.svg (colour fields, silk, leaf veins, flowers, a swing, a tree ...), only
  // there so the design can be seen. Replace them with the real photos of the company's client projects: put the files in
  // public/images/projects/ and set "image" to /images/projects/<file>.webp (here or in the admin panel).
  // Pointing at a photo opens it into a rounded square (3 pills wide) with the name, a small label and a short description.
  // The texts below are PLACEHOLDERS: write the real client project info together with the real photos.
  // group "brand": the projects you add under Projects in the admin panel (the photos below are what shows until there is one)
  section("archGallery", { items: SHOWCASE, group: "brand" }),
  // Not one long text column: a live brand board (5 tiles that light up one by one with the list), a large sentence that
  // fills with light while scrolling, and the services as a hoverable list. The words are the old site's, unchanged.
  section("brandBoard", {
    chip: "About brand identity",
    lead: "A strong brand identity gives your business a *consistent look* and lets people recognise it across every platform, from your website to your adverts.",
    body: "As a brand identity design agency in Surat, We3vision focuses on *brand identity design* that brings together your visual direction, *logo, colours and typography* and the supporting creative materials. Whether you are launching a new business or rebranding an existing one, we help you build a visual identity that reflects your needs and your communication, with brand guidelines your team can follow.",
    listIntro: "Our branding service can include",
    points:
      "Brand strategy | Your goals, audience and brand direction, defined before any design starts.\nLogo design | A logo, colours and typography that reflect your business.\nVisual identity | One consistent look across every platform.\nBrand guidelines | Clear rules your team and partners can follow.\nMarketing collateral design | Brand-aligned materials for graphic, web and advertising design.",
    ctaLabel: "Start your brand project",
    ctaHref: "#contact",
    note: "Depending on what your project needs.",
  }),
  section("process", {
    chip: "Our Process",
    heading: "How We Build\nYour Brand Identity",
    intro: "A clear process lets us understand your business before we make any design decision, even when we work remotely.",
    items: [
      {
        title: "Understand your brand",
        text: "We discuss your audience, your goals and the brand direction you want to build, by call or video.",
        points: "Business goals\nTarget audience\nBrand direction\nMoodboards\nVisual references\nCreative direction",
      },
      {
        title: "Define the visual direction",
        text: "We explore design references, visual styles and creative directions that fit your brand and your audience, before we start the logo.",
        points: "Design references\nVisual styles\nCreative direction",
      },
      {
        title: "Design your brand identity",
        text: "We develop the agreed brand elements: logo design, colours, typography and visual assets, as one visual identity.",
        points: "Logo design\nColors & typography\nVisual identity\nDesign review\nClient feedback\nIterative refinements",
      },
      {
        title: "Review and refine",
        text: "We review the proposed designs with you and make the agreed refinements within the project scope, so feedback stays clear.",
        points: "Design review\nAgreed refinements",
      },
      {
        title: "Prepare brand assets",
        text: "We prepare the approved identity elements and the brand documentation or marketing assets included in your project, ready to hand over.",
        points: "Brand assets\nGuidelines documentation\nProject handover",
      },
    ],
  }),
  section("advantages", {
    chip: "Why We3vision",
    heading: "A Practical Approach\nTo Building Your Brand",
    intro: "A good branding company in India understands your requirements and keeps your creative materials consistent.",
    items: [
      { title: "Business-focused design", description: "We begin with your goals and audience, and work with clients in India and remotely in the USA, UK, Canada and Australia." },
      { title: "Consistent visual identity", description: "We unify your logo, colours, typography and brand assets into one coherent visual system, so every touchpoint matches." },
      { title: "Design suited to your needs", description: "Your project scope can include exactly the brand elements and creative materials you require, agreed up front." },
      { title: "Connected creative services", description: "Brand identity connects with graphic design, website design and advertising creatives, so your look stays the same." },
    ],
  }),
  section("tags", {
    chip: "Tools & Technologies",
    heading: "The Tools\nWe Design With",
    intro: "",
    items: "Adobe Illustrator\nPhotoshop\nInDesign\nFigma\nCanva\nGoogle Fonts\nTypekit\nNotion\nMiro\nLoom\nPitch",
  }),
  section("industries", {
    chip: "Industries We Serve",
    heading: "Brand Identity For\nEvery Industry",
    intro: "Every industry communicates differently. Your identity should represent your business, your audience and the places where people meet your brand.",
    items: [
      { name: "Healthcare", description: "Brand identity and creative assets for healthcare businesses, clinics and organisations." },
      { name: "Education", description: "Visual branding for educational institutions, learning platforms and education-focused businesses." },
      { name: "Construction & real estate", description: "Brand design for businesses that need a clear visual presence across their business communications." },
      { name: "E-commerce", description: "Branding for online businesses, product brands and e-commerce marketing materials." },
      { name: "Gaming & entertainment", description: "Creative identity concepts for gaming, entertainment and digital experience businesses." },
      { name: "Marketing & corporate", description: "Visual branding for marketing businesses, corporate organisations and professional services." },
    ],
  }),
  section("sketchCanvas", {
    chip: "Your idea, our artist",
    heading: "Draw a rough idea\nwe make it shine",
    text: "You do not need a perfect brief. Sketch a small reference of your brand here and send it to our artist, who turns it into a clear, memorable mark that adds value to your brand.",
    hint: "Press and draw your rough idea here",
    sendLabel: "Send to our artist",
    saveLabel: "Save my sketch",
    sendMessage: "Hi We3vision team, I drew a rough idea on your brand canvas and would like your artist to make it beautiful. I have saved the sketch as an image and will send it to you. About my business: ",
    steps:
      "Draw it | A few lines are enough: a shape, a letter, a feeling.\nWe study it | We look at your business, your audience and the idea behind your lines.\nOur artist returns it | A clean, balanced brand mark that lifts the value of your brand.",
  }),
  section("services", {
    chip: "Brand Design Services",
    heading: "What We\nDesign For You",
    intro: "Four connected branding services. Choose one, or combine them into a complete brand.",
    buttonLabel: "",
    buttonHref: "",
    cards: [
      { title: "Brand\nStrategy", description: "Your business goals, audience and brand direction, defined before any design starts.", href: "" },
      { title: "Logo\nDesign", description: "A logo, colours and typography that reflect your business and speak to your audience.", href: "" },
      { title: "Visual Identity\n& Guidelines", description: "One consistent visual system, with brand guidelines your team and partners can follow.", href: "" },
      { title: "Marketing\nCollateral", description: "Brand assets and creative materials for graphic design, website design and advertising.", href: "" },
    ],
  }),
  // Brand design plans (owner asked for plans on 2026-11-10; the prices are a starting point, edit them in Admin > Pages > Plans & pricing)
  section("plans", {
    chip: "Brand design plans",
    heading: "Choose The Brand Plan\nThat Fits You",
    intro: "Three clear plans, from a first logo to a complete brand. Not sure which one? Tell us about your business and we will suggest it.",
    look: "notes",
    plans: [
      {
        name: "Logo Starter",
        tag: "For new businesses and small shops",
        badge: "",
        priceNote: "Starting from",
        price: "₹14,999",
        period: "one time",
        summary: "A clean logo with the basics of your look, ready to use everywhere.",
        features: "3 logo concepts to choose from\n2 revision rounds\nColour palette and font choice\nLogo files: AI, SVG, PNG and PDF\n- Brand guidelines\n- Stationery and social kit",
        delivery: "5 to 7 working days",
        buttonLabel: "Choose Logo Starter",
        buttonHref: "#contact",
      },
      {
        name: "Brand Identity",
        tag: "For businesses ready to look professional",
        badge: "Most chosen",
        priceNote: "Starting from",
        price: "₹39,999",
        period: "one time",
        summary: "A full visual identity, so your logo, colours and fonts work together on every platform.",
        features: "Brand discovery call and direction\n4 logo concepts and 3 revision rounds\nLogo suite: main, secondary and icon\nColours, typography and patterns\nBrand guidelines document\nBusiness card, letterhead and social profile kit",
        delivery: "2 to 3 weeks",
        buttonLabel: "Choose Brand Identity",
        buttonHref: "#contact",
      },
      {
        name: "Complete Brand",
        tag: "For a brand built from zero to launch",
        badge: "",
        priceNote: "Starting from",
        price: "₹79,999",
        period: "one time",
        summary: "Strategy, identity and marketing materials, planned together by one team.",
        features: "Everything in Brand Identity\nBrand strategy and positioning\nTagline and brand voice direction\nFull brand guidelines book\nPackaging or signage design\nMarketing collateral set: brochure and social templates\n30 days of support after handover",
        delivery: "4 to 6 weeks",
        buttonLabel: "Get a quote",
        buttonHref: "#contact",
      },
    ],
    note: "Prices are a starting point in Indian rupees. After a short call we share an exact quote for your scope.",
  }),
  // Questions as people ask them (also an AI assistant): every answer uses only the facts written above on this page.
  section("faq", {
    chip: "FAQ",
    heading: "Questions\nWe Often Hear",
    intro: "",
    items: [
      {
        question: "Is We3vision a brand identity design agency in Surat?",
        answer:
          "Yes. We3vision is a brand identity design agency in Surat, Gujarat, India, offering brand identity design services India-wide and abroad. We build brand strategy, logo design, visual identity, brand guidelines and marketing collateral, so your business has one clear and consistent look across every platform.",
      },
      {
        question: "What is included in a brand identity design project?",
        answer:
          "Depending on what your project needs: brand strategy (your goals, audience and brand direction), a logo with colours and typography, a visual identity with brand guidelines your team and partners can follow, and brand-aligned marketing collateral. We understand your brand, define the visual direction, design the identity, review and refine it with you, and then prepare the brand assets for handover.",
      },
      {
        question: "Which tools does We3vision use for brand design?",
        answer: "We design with Adobe Illustrator, Photoshop, InDesign, Figma, Canva, Google Fonts and Typekit, and plan and share the work with Notion, Miro, Loom and Pitch.",
      },
      {
        question: "Do you work with clients in the USA, UK, Canada and Australia?",
        answer: "Yes, we deliver brand identity projects remotely for clients in the USA, UK, Canada and Australia, as well as India. We keep communication clear and agree the plan, scope and deliverables up front.",
      },
      {
        question: "Who is brand identity design for?",
        answer:
          "For businesses launching a new brand or redesigning an existing one. We create brand identities for healthcare, education, construction and real estate, e-commerce, gaming and entertainment, and marketing and corporate businesses.",
      },
      {
        question: "What is the difference between a logo, brand identity and branding?",
        answer:
          "A logo is one mark, a brand identity is the full visual system around it, and branding is the wider work of how your business is seen and understood. Brand identity design brings together your logo, colours, typography and brand guidelines so every platform looks consistent. Brand strategy sits underneath, defining your goals, audience and direction.",
      },
      {
        question: "What is a brand guidelines document and do I need one?",
        answer:
          "Brand guidelines are the clear rules that tell your team and partners how to use your logo, colours and typography. You need them if more than one person, agency or printer will create material for your brand. We prepare the guidelines documentation as part of the brand assets we hand over.",
      },
      {
        question: "Can you redesign or rebrand an existing business identity?",
        answer:
          "Yes, we offer rebranding services for existing brands as well as new ones. We start by understanding your audience and current direction, then design a refreshed logo and visual identity and agree the refinements with you. The scope is confirmed before we begin.",
      },
      {
        question: "How much does brand identity design cost and how long does it take?",
        answer:
          "The cost and the time depend on what your project includes, such as strategy, a logo, guidelines or marketing collateral. After a short conversation about your business we agree the scope, deliverables and plan up front. Then you know what you get before work starts.",
      },
      {
        question: "How do the Brand Development, Brand Kit, Brand Video and End-to-End Brand pages relate to this one?",
        answer:
          "They are connected services, and brand identity design is the visual foundation for them. Brand Development, Brand Kit, Brand Video and End-to-End Brand each cover a wider or more specific part of building a brand. You can start with identity and add the others when your project needs them.",
      },
      {
        question: "Why choose a branding company in Surat, India for a brand abroad?",
        answer:
          "A branding company in India lets you hire brand designers from India with a clear, agreed plan and steady communication. We3vision is based in Surat, Gujarat, founded in 2019, with a second office in Marburg, Germany. We have worked with clients from the USA, Canada, the UK, Germany, UAE, Singapore and Australia.",
      },
    ],
  }),
  contact(
    "Ready to Give Your Business\nA Clear Brand Identity?",
    "Whether you are launching a new business, rebranding an existing identity or preparing creative assets for your next campaign, We3vision in Surat can discuss your requirements, in India or from abroad, and explore a suitable branding approach.",
    "Discuss your brand project",
  ),
];
