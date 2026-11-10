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
  title: "Brand Identity Design Services in Surat, India | We3vision",
  description:
    "Brand strategy, logo design, visual identity, guidelines and collateral. We3vision builds a clear, consistent brand identity that people remember.",
};

export const BRAND_SECTIONS: PageSection[] = [
  // Giant word "Brand": its letters swipe through the same word in 7 languages of 7 countries (meaning is the same,
  // letters and spelling look different). Only this page has this hero.
  section("wordHero", {
    words:
      "English · UK | Brand\nHindi · India | ब्रांड\nRussian · Russia | Бренд\nGreek · Greece | Μάρκα\nJapanese · Japan | ブランド\nKorean · Korea | 브랜드\nChinese · China | 品牌",
    heading: "Build a brand identity that people remember.",
    text: "Your brand is more than a logo. We3vision helps businesses develop a clear and consistent visual identity through thoughtful brand design, visual systems and creative assets.",
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
    lead: "A strong brand identity gives your business a *consistent look* and lets people recognise it across every platform.",
    body: "At We3vision we focus on *brand identity design* that brings together your visual direction, *logo, colours and typography* and the supporting creative materials. Whether you are launching a new business or redesigning an existing brand, we help you build a visual identity that reflects your needs and your communication.",
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
    intro: "A clear process lets us understand your business before we make any design decision.",
    items: [
      {
        title: "Understand your brand",
        text: "We discuss your audience, your goals and the brand direction you want to build.",
        points: "Business goals\nTarget audience\nBrand direction\nMoodboards\nVisual references\nCreative direction",
      },
      {
        title: "Define the visual direction",
        text: "We explore design references, visual styles and creative directions that fit your brand and your audience.",
        points: "Design references\nVisual styles\nCreative direction",
      },
      {
        title: "Design your brand identity",
        text: "We develop the agreed brand elements: logo design, colours, typography and visual assets.",
        points: "Logo design\nColors & typography\nVisual identity\nDesign review\nClient feedback\nIterative refinements",
      },
      {
        title: "Review and refine",
        text: "We review the proposed designs with you and make the agreed refinements within the project scope.",
        points: "Design review\nAgreed refinements",
      },
      {
        title: "Prepare brand assets",
        text: "We prepare the approved identity elements and the brand documentation or marketing assets included in your project.",
        points: "Brand assets\nGuidelines documentation\nProject handover",
      },
    ],
  }),
  section("advantages", {
    chip: "Why We3vision",
    heading: "A Practical Approach\nTo Building Your Brand",
    intro: "A good branding partner understands your requirements and keeps your creative materials consistent.",
    items: [
      { title: "Business-focused design", description: "We begin with your goals and your audience, and let them guide the design direction." },
      { title: "Consistent visual identity", description: "We unify your logo, colours, typography and brand assets into one coherent visual system." },
      { title: "Design suited to your needs", description: "Your project scope can include exactly the brand elements and creative materials you require." },
      { title: "Connected creative services", description: "Brand identity connects with graphic design, website design and advertising creatives where relevant." },
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
    intro: "Four connected services. Choose one, or combine them into a complete brand.",
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
  contact(
    "Ready to Give Your Business\nA Clear Brand Identity?",
    "Whether you are launching a new business, refreshing an existing identity or preparing creative assets for your next campaign, We3vision can discuss your requirements and explore a suitable branding approach.",
    "Discuss your brand project",
  ),
];
