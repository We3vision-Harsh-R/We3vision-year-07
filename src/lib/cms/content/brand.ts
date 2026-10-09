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

const BASE = "/brand-identity";

/** Cards that link to the other brand pages (used at the bottom of every sub-service page). */
const otherServices = (except: string) =>
  [
    { id: "brand-strategy", title: "Brand\nStrategy", description: "Define your goals, audience and brand direction before any design starts.", href: `${BASE}/brand-strategy` },
    { id: "logo-design", title: "Logo\nDesign", description: "A logo, colours and typography that reflect your business and speak to your audience.", href: `${BASE}/logo-design` },
    { id: "visual-identity", title: "Visual Identity\n& Guidelines", description: "One consistent visual system, documented in brand guidelines your team can follow.", href: `${BASE}/visual-identity-guidelines` },
    { id: "marketing-collateral", title: "Marketing\nCollateral", description: "Brand-aligned creative materials for graphic design, web and advertising.", href: `${BASE}/marketing-collateral` },
  ]
    .filter((c) => c.id !== except)
    .map(({ title, description, href }) => ({ title, description, href }));

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
    "Brand strategy, logo design, visual identity, brand guidelines and marketing collateral. We3vision helps businesses build a clear, consistent brand identity that people remember.",
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
      { title: "Brand\nStrategy", description: "Your business goals, audience and brand direction, defined before any design starts.", href: `${BASE}/brand-strategy` },
      { title: "Logo\nDesign", description: "A logo, colours and typography that reflect your business and speak to your audience.", href: `${BASE}/logo-design` },
      { title: "Visual Identity\n& Guidelines", description: "One consistent visual system, with brand guidelines your team and partners can follow.", href: `${BASE}/visual-identity-guidelines` },
      { title: "Marketing\nCollateral", description: "Brand assets and creative materials for graphic design, website design and advertising.", href: `${BASE}/marketing-collateral` },
    ],
  }),
  contact(
    "Ready to Give Your Business\nA Clear Brand Identity?",
    "Whether you are launching a new business, refreshing an existing identity or preparing creative assets for your next campaign, We3vision can discuss your requirements and explore a suitable branding approach.",
    "Discuss your brand project",
  ),
];

// ---------------------------------------------------------------------------------------------------------------------
// Sub-service pages
// ---------------------------------------------------------------------------------------------------------------------

export const BRAND_STRATEGY_SEO = {
  title: "Brand Strategy Services | Brand Direction & Positioning | We3vision",
  description: "Define your business goals, audience and brand direction before design starts. Brand strategy services from We3vision, a Surat-based design and development company.",
};

export const BRAND_STRATEGY_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Brand Design · Brand Strategy",
    heading: "Know Your Brand\nBefore You Design It",
    text: "Good design starts with a clear direction. We3vision helps you define your business goals, your audience and the brand direction you want to build, so every design decision that follows has a reason.",
    primaryLabel: "Plan your brand",
    primaryHref: "#contact",
    secondaryLabel: "All brand services",
    secondaryHref: BASE,
  }),
  section("story", {
    body: "Brand strategy is the thinking behind the visuals. We start with *your business goals*, your *target audience* and the *brand direction* you want to build, and turn them into *moodboards, visual references* and a clear *creative direction*.\n\nThe result is a shared plan that you, your designers and your future marketing can all follow, whether you are launching a new brand or refreshing an existing one.",
  }),
  section("guide", {
    chip: "Meet the strategist",
    heading: "Plan the brand\nbefore the logo",
    text: "Good brands start with strategy: your goals, your audience and a clear direction. Our guide shows how an idea becomes a logo.",
    scene: "brand",
    tips: "Strategy first: goals, audience and direction.\nThen the logo, colours and typography.\nPick a personality and see the logo, colours and font follow it.",
    buttonLabel: "",
    buttonHref: "",
  }),
  section("advantages", {
    chip: "What's Included",
    heading: "What Your Brand\nStrategy Covers",
    intro: "",
    items: [
      { title: "Business goals", description: "We discuss your objectives and what your brand needs to achieve for your business." },
      { title: "Target audience", description: "We define who you are speaking to and what matters to them." },
      { title: "Brand direction", description: "The personality and direction your brand should take, in words everyone can agree on." },
      { title: "Moodboards & references", description: "Visual references and moodboards that make the creative direction easy to discuss and approve." },
    ],
  }),
  section("process", {
    chip: "How It Works",
    heading: "From Questions\nTo Creative Direction",
    intro: "",
    items: [
      { title: "Understand your business", text: "We learn about your business, your audience and what you want your brand to achieve.", points: "Business goals\nTarget audience\nBrand direction" },
      { title: "Collect references", text: "We explore design references and visual styles that fit your brand and your audience.", points: "Moodboards\nVisual references" },
      { title: "Set the creative direction", text: "We turn what we learned into a clear creative direction that guides every design that follows.", points: "Creative direction\nVisual style" },
      { title: "Review together", text: "We go through the direction with you and refine it until it is agreed.", points: "Client feedback\nAgreed direction" },
    ],
  }),
  section("services", {
    chip: "More Brand Services",
    heading: "Continue With\nYour Brand",
    intro: "Strategy works best together with the design that follows it.",
    buttonLabel: "All brand design services",
    buttonHref: BASE,
    cards: otherServices("brand-strategy"),
  }),
  contact("Let's Define\nYour Brand Direction", "Tell us about your business and your audience. We3vision will discuss your goals and suggest a brand strategy approach that suits your project.", "Plan your brand"),
];

export const LOGO_DESIGN_SEO = {
  title: "Logo Design Services in Surat, India | We3vision",
  description: "Logo design, colours and typography that reflect your business and your audience. Custom logo design services for new and existing brands from We3vision.",
};

export const LOGO_DESIGN_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Brand Design · Logo Design",
    heading: "A Logo That Fits\nYour Business",
    text: "Your logo is the face of your brand. We design logos, colour palettes and typography that reflect your business and speak clearly to your audience.",
    primaryLabel: "Get your logo designed",
    primaryHref: "#contact",
    secondaryLabel: "All brand services",
    secondaryHref: BASE,
  }),
  section("story", {
    body: "We design logos for new businesses and for brands that need a refresh. Every logo starts from your *brand direction* and is shaped together with *colours and typography* that work on your website, in print and on social media.\n\nWe share *design reviews*, collect your *feedback* and make *iterative refinements* until the design is agreed.",
  }),
  section("guide", {
    chip: "Meet the logo designer",
    heading: "Pick a look,\nsee the logo",
    text: "A logo is a small drawing that has to carry your whole business. Try four personalities and see how the same name changes.",
    scene: "brand",
    tips: "A good logo is simple, memorable and works at any size.\nPick another personality for a different mark.\nWe design the logo, the colours and the typography together.",
    buttonLabel: "",
    buttonHref: "",
  }),
  section("advantages", {
    chip: "What's Included",
    heading: "What Your Logo\nProject Covers",
    intro: "",
    items: [
      { title: "Logo design", description: "A logo developed from your business, your audience and your brand direction." },
      { title: "Colours & typography", description: "A colour palette and typefaces that work with the logo across every use." },
      { title: "Design review", description: "We present the design and walk you through the thinking behind it." },
      { title: "Iterative refinements", description: "We collect your feedback and refine the design within the agreed scope." },
    ],
  }),
  section("process", {
    chip: "How It Works",
    heading: "From Idea\nTo Finished Logo",
    intro: "",
    items: [
      { title: "Understand your brand", text: "We start with your audience, goals and the direction you want your brand to take.", points: "Business goals\nTarget audience\nBrand direction" },
      { title: "Design the logo", text: "We develop the logo together with colours and typography, based on the agreed direction.", points: "Logo design\nColors & typography" },
      { title: "Review with you", text: "We present the design, gather your feedback and make the agreed refinements.", points: "Design review\nClient feedback\nIterative refinements" },
      { title: "Prepare brand assets", text: "We prepare the approved logo and identity elements included in your project.", points: "Brand assets\nProject handover" },
    ],
  }),
  section("tags", {
    chip: "Tools",
    heading: "Designed With",
    intro: "",
    items: "Adobe Illustrator\nPhotoshop\nFigma\nGoogle Fonts\nTypekit",
  }),
  section("services", {
    chip: "More Brand Services",
    heading: "Go Beyond\nThe Logo",
    intro: "A logo is the start of a brand, not the whole of it.",
    buttonLabel: "All brand design services",
    buttonHref: BASE,
    cards: otherServices("logo-design"),
  }),
  contact("Ready For A Logo\nThat Fits Your Business?", "Share your business and your audience with us. We3vision will discuss your requirements and explore a logo design approach that suits your brand.", "Discuss your logo"),
];

export const VISUAL_IDENTITY_SEO = {
  title: "Visual Identity & Brand Guidelines | Brand Identity Design | We3vision",
  description: "One consistent visual system for your brand: colours, typography, visual assets and brand guidelines documentation. Visual identity design from We3vision.",
};

export const VISUAL_IDENTITY_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Brand Design · Visual Identity & Guidelines",
    heading: "One Visual System\nFor Your Whole Brand",
    text: "A logo alone does not make a brand. We unify your logo, colours, typography and brand assets into one visual system, and document it in brand guidelines.",
    primaryLabel: "Build your identity",
    primaryHref: "#contact",
    secondaryLabel: "All brand services",
    secondaryHref: BASE,
  }),
  section("story", {
    body: "A visual identity is the *colours, typography and design elements* that make your brand recognisable on every platform. We bring them together into *one coherent visual system*.\n\nWe then document it as *brand guidelines*, so your team and your partners use your brand in the same way everywhere, from your website to your next campaign.",
  }),
  section("guide", {
    chip: "Meet the identity guide",
    heading: "One look,\nevery place",
    text: "A visual identity is a system: logo, colours, type and rules. The guide shows how one brand board holds it together.",
    scene: "brand",
    tips: "A visual identity is a system, not just a logo.\nBrand guidelines keep your team consistent.\nPick a personality to see the whole board change together.",
    buttonLabel: "",
    buttonHref: "",
  }),
  section("advantages", {
    chip: "What's Included",
    heading: "What Your Identity\nProject Covers",
    intro: "",
    items: [
      { title: "Colours & typography", description: "A defined colour palette and typefaces, chosen to fit your brand and your audience." },
      { title: "Visual identity system", description: "Your logo, colours, typography and visual assets working together as one system." },
      { title: "Brand guidelines", description: "Guidelines documentation that shows how your identity should and should not be used." },
      { title: "Project handover", description: "The approved brand assets and documentation, handed over ready to use." },
    ],
  }),
  section("process", {
    chip: "How It Works",
    heading: "From Elements\nTo A Complete System",
    intro: "",
    items: [
      { title: "Define the visual direction", text: "We explore design references and visual styles that fit your brand and audience.", points: "Design references\nVisual styles" },
      { title: "Build the visual identity", text: "We develop the agreed brand elements into one consistent visual identity.", points: "Logo design\nColors & typography\nVisual identity" },
      { title: "Document the guidelines", text: "We prepare brand documentation that explains how to use the identity.", points: "Guidelines documentation" },
      { title: "Hand over", text: "We prepare the approved identity elements and hand everything over to you.", points: "Brand assets\nProject handover" },
    ],
  }),
  section("tags", {
    chip: "Tools",
    heading: "Built With",
    intro: "",
    items: "Adobe Illustrator\nInDesign\nFigma\nGoogle Fonts\nTypekit\nNotion",
  }),
  section("services", {
    chip: "More Brand Services",
    heading: "Complete\nYour Brand",
    intro: "Put your identity to work across your business.",
    buttonLabel: "All brand design services",
    buttonHref: BASE,
    cards: otherServices("visual-identity"),
  }),
  contact("Ready For A Consistent\nBrand Identity?", "Tell us about your brand and where it needs to appear. We3vision will discuss your requirements and plan the visual identity your business needs.", "Discuss your identity"),
];

export const MARKETING_COLLATERAL_SEO = {
  title: "Marketing Collateral Design | Brand Creatives | We3vision",
  description: "Brand-aligned marketing collateral and creative materials: graphic design, website design and advertising creatives, designed to match your brand identity.",
};

export const MARKETING_COLLATERAL_SECTIONS: PageSection[] = [
  section("pageHero", {
    chip: "Brand Design · Marketing Collateral",
    heading: "Creative Materials\nThat Look Like You",
    text: "Once your identity is ready, your brand has to show up in the real world. We design marketing collateral and creative materials that follow your brand identity.",
    primaryLabel: "Plan your materials",
    primaryHref: "#contact",
    secondaryLabel: "All brand services",
    secondaryHref: BASE,
  }),
  section("story", {
    body: "We design *marketing collateral* and creative materials that stay true to your *brand identity*, so every touchpoint feels like the same brand.\n\nWe connect them with related services such as *graphic design, website design* and *advertising creatives* where relevant, and prepare the *brand assets* you need for your next campaign.",
  }),
  section("guide", {
    chip: "Meet the creative guide",
    heading: "Your brand,\non everything",
    text: "Marketing collateral puts your brand on everything people see: ads, social posts, brochures and your website.",
    scene: "brand",
    tips: "Brand-aligned graphics for web, print and ads.\nSame logo, colours and tone everywhere.\nType your name and see it on the card and the app icon.",
    buttonLabel: "",
    buttonHref: "",
  }),
  section("advantages", {
    chip: "What's Included",
    heading: "What Your Collateral\nProject Covers",
    intro: "",
    items: [
      { title: "Marketing collateral", description: "Creative materials designed around your identity and the needs of your project." },
      { title: "Graphic design", description: "Graphic design that connects with your visual identity where relevant." },
      { title: "Website design", description: "Brand-aligned website design that carries your identity online, where relevant." },
      { title: "Advertising creatives", description: "Advertising creative design for campaigns that follow your brand." },
    ],
  }),
  section("process", {
    chip: "How It Works",
    heading: "From Brief\nTo Brand Assets",
    intro: "",
    items: [
      { title: "Understand the need", text: "We discuss your campaign or project and where your brand needs to appear.", points: "Business goals\nTarget audience" },
      { title: "Design the materials", text: "We design the creative materials based on your approved identity.", points: "Visual identity\nCreative assets" },
      { title: "Review and refine", text: "We review the designs with you and make the agreed refinements.", points: "Design review\nClient feedback" },
      { title: "Prepare brand assets", text: "We prepare the approved materials and brand assets for your marketing.", points: "Brand assets\nProject handover" },
    ],
  }),
  section("tags", {
    chip: "Tools",
    heading: "Created With",
    intro: "",
    items: "Adobe Illustrator\nPhotoshop\nInDesign\nFigma\nCanva\nPitch",
  }),
  section("services", {
    chip: "More Brand Services",
    heading: "Start With\nA Strong Identity",
    intro: "Collateral works best when it is built on a clear brand.",
    buttonLabel: "All brand design services",
    buttonHref: BASE,
    cards: otherServices("marketing-collateral"),
  }),
  contact("Ready For Creative Materials\nThat Match Your Brand?", "Tell us what you are planning. We3vision will discuss your requirements and design marketing collateral that fits your brand identity.", "Discuss your materials"),
];
