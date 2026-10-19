import { build, related } from "./tech";

// NEW SERVICE PAGES (part 1): Shopify Plugin Development, Custom Software Development, Brand Development, Brand Kit Design.
// Written for this site (they are not on the old site): plain wording, search words a customer would type (service + company + Surat + India),
// and nothing invented: no prices, client names, counts or results. Words in *stars* are highlighted. This is what visitors see until someone
// publishes a version from the admin panel.

// ---------------------------------------------------------------------------------------------------------------------
// Shopify Plugin Development (/shopify-plugin-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFYPLUGIN_SEO = {
  title: "Shopify Plugin Development Services | We3vision",
  description: "Custom Shopify plugins: theme extensions, sections, widgets, checkout add-ons and integrations by We3vision, a Shopify company in Surat, India.",
};
export const SHOPIFYPLUGIN_SECTIONS = build({
  seo: SHOPIFYPLUGIN_SEO,
  hero: {
    chip: "Shopify Plugins",
    heading: "Shopify Plugin\nDevelopment Services",
    text: "Need one more feature in your Shopify store? We build custom plugins and add-ons that plug into your theme and checkout, so your store does exactly what your business needs.",
  },
  story:
    "A Shopify store becomes powerful when it has the *right small features*: a size guide, a product bundle, a delivery date picker, a custom discount, a pop-up that really fits your brand. Ready-made apps often give you *ten features when you need one*, and slow the store down.\n\nAs a *Shopify development company in Surat, India*, we build *light, custom Shopify plugins* with theme app extensions, Liquid, JavaScript and Shopify's own APIs. They load fast, match your design and are easy for your team to switch on and off.",
  services: {
    heading: "Our Shopify Plugin\nDevelopment Services",
    intro: "Small or large, every plugin is built for your theme, your products and your way of selling.",
    cards: [
      { title: "Custom Shopify\nplugins", description: "A new feature designed and built from scratch for your store, instead of a heavy app with features you never use." },
      { title: "Theme app\nextensions", description: "App blocks and embeds that merchants can add from the theme editor with a click, without touching the code." },
      { title: "Custom sections\nand blocks", description: "New sections for your Online Store 2.0 theme: banners, product highlights, size guides, comparison tables and more." },
      { title: "Checkout and cart\nadd-ons", description: "Gift notes, delivery date pickers, free-gift rules, upsells and cart messages that help customers finish their order." },
      { title: "Discounts and\ncustom rules", description: "Bundle offers, tiered discounts and shipping or payment rules built with Shopify Functions." },
      { title: "Third-party\nintegrations", description: "Your store connected with your ERP, CRM, courier, accounting tool or marketing platform through APIs." },
      { title: "Plugin upgrades\nand fixes", description: "We update, speed up and repair plugins you already have so they keep working with new Shopify versions." },
      { title: "Support and\nmaintenance", description: "Ongoing care after launch: bug fixes, updates and small improvements whenever your store needs them." },
    ],
  },
  process: {
    heading: "How We Build\nYour Shopify Plugin",
    intro: "A simple path from the first idea to a plugin running on your live store.",
    items: [
      { title: "Understand the need", text: "We learn what the plugin must do, who will use it and where it appears in your store.", points: "Goal of the feature\nWhere it shows in the store" },
      { title: "Plan and design", text: "We choose the right way to build it (theme extension, section, Function or app) and design how it looks and behaves.", points: "Technical plan\nScreens and settings" },
      { title: "Build and connect", text: "We write clean code that fits your theme and connects to Shopify and your other tools.", points: "Liquid, JavaScript and APIs\nTheme-friendly styling" },
      { title: "Test on a copy", text: "We test on a duplicate theme and on different browsers and screens, so nothing breaks on your live store.", points: "Duplicate theme testing\nSpeed check" },
      { title: "Launch and support", text: "We publish the plugin, show your team how to use it and stay on hand for fixes and changes.", points: "Safe go-live\nHand-over and support" },
    ],
  },
  tools: { heading: "Our Shopify\nTech Stack", items: "Shopify\nLiquid\nJavaScript\nNode.js\nReact.js\nShopify GraphQL API\nShopify Functions\nHTML5\nCSS3" },
  why: {
    heading: "Why Choose We3vision\nFor Shopify Plugins",
    items: [
      { title: "Light and fast", description: "Only the code your feature needs, so your store stays quick and your search rankings are not hurt." },
      { title: "Made for your theme", description: "Plugins that follow your colours, fonts and layout, so they look like a native part of your store." },
      { title: "Easy for your team", description: "Settings live in the theme editor, so your team can change text, colours and placement without a developer." },
      { title: "You own the code", description: "A custom plugin is yours. There is no monthly app fee for a feature you only need once." },
      { title: "Safe updates", description: "We build with current Shopify standards, so your plugin keeps working as Shopify improves." },
      { title: "One team for everything", description: "Design, development, testing and support from the same team, so nothing is lost between people." },
    ],
  },
  industries: {
    heading: "Shopify Plugins\nFor Every Store",
    intro: "Every kind of store has its own small missing features. Here are a few examples.",
    items: [
      { name: "Fashion and apparel", description: "Size guides, colour swatches and look-book sections that help shoppers choose with confidence." },
      { name: "Jewellery", description: "Engraving options, gift packaging choices and metal or size pickers on the product page." },
      { name: "Home and living", description: "Room-style galleries, bundle builders and delivery date selection for larger items." },
      { name: "Beauty and wellness", description: "Shade finders, subscription choices and free-sample rules at the cart." },
      { name: "Food and gifting", description: "Gift messages, scheduled delivery and combo boxes built from several products." },
      { name: "B2B and wholesale", description: "Minimum order rules, quantity tiers and quick-order forms for trade customers." },
    ],
  },
  faq: [
    { question: "What is the difference between a Shopify plugin and a Shopify app?", answer: "People often use both words for the same thing. A plugin usually means a small add-on feature for your store, such as a theme extension or section. A Shopify app can be larger, has its own admin screens and can serve many stores. We help you pick the lighter option that does the job." },
    { question: "Can you build a plugin for my existing theme?", answer: "Yes. We build plugins for most themes, including Online Store 2.0 themes, and test them on a duplicate of your theme first." },
    { question: "Will a custom plugin slow down my store?", answer: "A custom plugin carries only the code it needs, so it is usually lighter than a ready-made app. We also check the speed of your store before and after." },
    { question: "Can my team manage the plugin without a developer?", answer: "Yes. We add settings to the theme editor so that your team can change text, colours and where the plugin appears." },
    { question: "Can you fix or upgrade a plugin that already exists?", answer: "Yes. We review the code, repair what is broken, update it for current Shopify versions and improve its speed." },
    { question: "How long does a Shopify plugin take to build?", answer: "A small plugin can take a few days, while larger ones with settings and integrations take longer. We give you a clear timeline after we understand what you need." },
  ],
  related: related("shopify", "shopapp", "software"),
  cta: { heading: "Ready To Add\nThat Missing Feature?", text: "Tell us what your Shopify store needs and we will suggest the lightest way to build it.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom Software Development (/software-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SOFTWARE_SEO = {
  title: "Custom Software Development in Surat, India | We3vision",
  description: "Custom software in Surat, India: business portals, dashboards, ERP and CRM systems, SaaS, automation and API integrations built around your team.",
};
export const SOFTWARE_SECTIONS = build({
  seo: SOFTWARE_SEO,
  hero: {
    chip: "Software Development",
    heading: "Custom Software\nDevelopment Company",
    text: "Spreadsheets, scattered tools and manual work slow a business down. We build custom software around the way your team really works: simple to use, secure and ready to grow.",
  },
  story:
    "Off-the-shelf software forces you to change your process to fit the tool. *Custom software does the opposite*: it fits your process, connects your tools and removes repeated manual work.\n\nWe are a *custom software development company in Surat, India*. We plan with you, design clear screens, build *web-based business software* and keep supporting it after launch, for startups, growing companies and established businesses.",
  services: {
    heading: "Our Software\nDevelopment Services",
    intro: "From a small internal tool to a full product, we cover the whole journey.",
    cards: [
      { title: "Custom business\nsoftware", description: "Software built for your exact workflow: orders, stock, billing, staff, approvals or anything else your team does every day." },
      { title: "Web portals and\ndashboards", description: "Customer, vendor and staff portals with live dashboards, so everyone sees the information they need in one place." },
      { title: "ERP and CRM\nsystems", description: "Systems that bring sales, operations and customers together, shaped around your company instead of a generic template." },
      { title: "SaaS product\ndevelopment", description: "We help you turn an idea into a software product with accounts, plans, admin panel and a clean, scalable foundation." },
      { title: "Workflow\nautomation", description: "Repeated tasks such as reports, reminders, data entry and approvals moved from people to software." },
      { title: "API and system\nintegration", description: "Your payment gateway, accounting tool, courier, WhatsApp or CRM connected so data flows without retyping." },
      { title: "Legacy software\nmodernisation", description: "Old, slow or unsupported software rebuilt or upgraded to a modern, secure platform, with your data moved safely." },
      { title: "Support and\nmaintenance", description: "Updates, security fixes, backups and new features after launch, so your software stays healthy." },
    ],
  },
  process: {
    heading: "Our Software\nDevelopment Life Cycle",
    intro: "A clear, step-by-step way of working so you always know what is happening.",
    items: [
      { title: "Discovery", text: "We listen, study how your team works today and agree what the software must achieve.", points: "Goals and users\nCurrent process" },
      { title: "Planning", text: "We list the features, choose the technology and prepare a plan with clear stages.", points: "Feature list\nTechnology and timeline" },
      { title: "UI/UX design", text: "We design simple screens and test the flow with you before building.", points: "Wireframes\nClickable prototype" },
      { title: "Development", text: "We build the software in stages, so you can see and try it as it grows.", points: "Regular demos\nClean, secure code" },
      { title: "Testing", text: "We test every feature, on different devices, and fix issues before launch.", points: "Functional testing\nSecurity checks" },
      { title: "Launch and support", text: "We deploy the software, train your team and keep improving it.", points: "Go-live\nTraining and support" },
    ],
  },
  tools: { heading: "Technologies\nWe Work With", items: "React.js\nNext.js\nNode.js\nPython\nPostgreSQL\nMySQL\nMongoDB\nREST APIs\nGraphQL\nDocker\nAWS" },
  why: {
    heading: "Why Choose We3vision\nFor Custom Software",
    items: [
      { title: "Built around you", description: "We start from your process and your people, not from a template." },
      { title: "Simple to use", description: "Clean screens and clear steps, so your team learns the software quickly." },
      { title: "Secure by design", description: "Safe logins, roles, backups and secure data handling from the first day." },
      { title: "Ready to grow", description: "A clean structure that lets you add features, users and branches later." },
      { title: "Clear communication", description: "Regular demos and plain updates, so there are no surprises." },
      { title: "Support after launch", description: "We stay with you for fixes, updates and new ideas." },
    ],
  },
  industries: {
    heading: "Software For\nEvery Industry",
    intro: "Every industry has its own process. Here are some where custom software helps.",
    items: [
      { name: "Manufacturing and trading", description: "Order, stock, dispatch and billing in one system, with reports for the owner." },
      { name: "Diamond and jewellery", description: "Inventory, job work and sales tracking made simple and secure." },
      { name: "Textile and retail", description: "Stock, parties, orders and accounts connected from one place." },
      { name: "Education", description: "Student, fee, class and exam management with portals for teachers and parents." },
      { name: "Healthcare", description: "Appointments, patient records and billing with privacy in mind." },
      { name: "Logistics", description: "Booking, tracking and delivery management with live status." },
      { name: "Real estate", description: "Leads, listings, site visits and payments in one system." },
      { name: "Startups", description: "A first working product (MVP) built quickly and ready to improve with feedback." },
    ],
  },
  faq: [
    { question: "What is custom software development?", answer: "It is software designed and built for one business, around its own process, instead of using a ready-made product that every company shares." },
    { question: "Why choose custom software instead of ready-made software?", answer: "Custom software fits your process exactly, connects with your other tools, and you pay for the features you really need. You also own and control it." },
    { question: "How long does it take to build custom software?", answer: "A simple tool can take a few weeks, while a bigger system takes a few months. After discovery we give you a plan with stages and a timeline." },
    { question: "Can you improve or replace our old software?", answer: "Yes. We can upgrade, rebuild or replace old software and move your data safely to the new system." },
    { question: "Will the software work on mobile phones?", answer: "Yes. Our web software works on phones, tablets and computers, and we can also build a mobile app if you need one." },
    { question: "Do you provide support after launch?", answer: "Yes. We offer updates, fixes, backups and new features after launch through a support plan." },
    { question: "Is my data safe?", answer: "We use secure logins, roles and permissions, encrypted connections and regular backups, and we agree on confidentiality before we start." },
  ],
  related: related("mobile", "ai", "web"),
  cta: { heading: "Ready To Build\nYour Software?", text: "Tell us how your team works today and where it slows down. We will suggest what to build and how to start.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Brand Development (/brand-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const BRANDDEV_SEO = {
  title: "Brand Development Services in Surat, India | We3vision",
  description: "Complete brand development: strategy, naming, logo and identity, packaging, brand guidelines and launch for startups and companies in Surat, India.",
};
export const BRANDDEV_SECTIONS = build({
  seo: BRANDDEV_SEO,
  hero: {
    chip: "Brand Development",
    heading: "Brand Development\nServices",
    text: "Brand development is much more than a logo. We3vision builds the whole brand for a new business: strategy, name, identity, design, communication, guidelines and launch.",
  },
  story:
    "*Brand development is not only logo design.* It is a complete service that helps a business establish itself in the market as a *new brand*: *brand strategy, brand identity, design, communication and brand guidelines*, everything from the first research to the day of the launch.\n\nIt is made for any company that wants to build a *website, a mobile app or a software product* and *launch it as a brand*. As a *brand development agency in Surat, India*, We3vision follows one clear process and delivers every part of it: *research and positioning, naming and tagline, logo and visual identity, stationery and marketing material, digital and social media branding, packaging, brand guidelines and a brand launch plan*.",
  services: {
    heading: "Our Brand Development\nService Lines",
    intro: "Seven service lines that together make a complete brand, from research to rebranding.",
    cards: [
      { title: "Brand Strategy\n& Research", description: "Research, positioning, audience, naming and messaging: the planning that comes before the design." },
      { title: "Visual Identity\n& Logo Design", description: "Logo systems, typography, colours, graphic language and visual assets that make the brand recognisable." },
      { title: "Corporate Identity\n& Collateral", description: "Stationery, company profiles, brochures, presentations and office branding for a professional first impression." },
      { title: "Digital & Social\nMedia Branding", description: "Website identity, app and SaaS branding, social media templates and digital campaigns." },
      { title: "Packaging &\nProduct Branding", description: "Product identity, labels, packaging systems and retail presentation that sell on the shelf and online." },
      { title: "Brand Guidelines\n& Launch", description: "The brand book, asset handover, launch creatives and a rollout plan so the whole team uses the brand correctly." },
      { title: "Rebranding &\nAdvanced Branding", description: "Brand refresh, employer branding, 3D and motion identity, mascots and immersive branding." },
    ],
  },
  process: {
    heading: "How We Develop\nYour Brand",
    intro: "One clear journey from the first conversation to the launch day.",
    items: [
      { title: "Strategy and research", text: "We study your business, industry, market, competitors and audience, and define your positioning, purpose and personality.", points: "Brand discovery and consultation\nMarket and competitor research\nPositioning, USP and brand personality" },
      { title: "Name and verbal identity", text: "We create the name, tagline, story and the voice of the brand.", points: "Naming and shortlisting\nTagline and brand story\nVoice and tone guidelines" },
      { title: "Visual identity", text: "We design the logo system, typography, colours and the graphic language of the brand.", points: "Logo and logo variations\nTypography and colour palette\nIcons, patterns and image style" },
      { title: "Brand in use", text: "We apply the identity to stationery, marketing material, digital products, social media and packaging.", points: "Stationery and collateral\nWebsite, app and social media\nPackaging and product branding" },
      { title: "Guidelines and handover", text: "We write the brand book and hand over every approved file, specification and template.", points: "Brand guidelines document\nEditable templates\nOrganised source assets" },
      { title: "Launch and rollout", text: "We plan the launch, create the announcement material and help your team adopt the brand.", points: "Launch strategy and creatives\nSocial media launch kit\nBrand consistency review" },
    ],
  },
  tools: { heading: "What We Use\nTo Build Brands", items: "Brand workshops\nMarket research\nCompetitor analysis\nCustomer personas\nAdobe Illustrator\nAdobe Photoshop\nAdobe InDesign\nFigma\nMiro" },
  why: {
    heading: "Why Choose We3vision\nFor Brand Development",
    items: [
      { title: "A complete service, not only a logo", description: "Strategy, naming, identity, design, communication, guidelines and launch, all with one team." },
      { title: "Made for products that launch", description: "We know how to brand a website, an app or a software product so that it is ready to be launched in the market." },
      { title: "One clear process", description: "Twelve chapters of work with clear deliverables, so you always know what you receive." },
      { title: "Every industry", description: "From startups and SaaS to real estate, healthcare, hospitality, retail and luxury." },
      { title: "A brand your team can use", description: "A brand book, templates and organised files, so every future design stays consistent." },
      { title: "Design and development together", description: "The same company designs the brand and builds the website, app or software that carries it." },
    ],
  },
  industries: {
    heading: "Brand Development\nFor Every Industry",
    intro: "Every industry needs a different kind of brand. Here is where we build them.",
    items: [
      { name: "Startups", description: "A clear name, identity and launch plan before the first customer arrives." },
      { name: "Technology and SaaS", description: "Branding for software products, apps, dashboards and platforms, from identity to product design system." },
      { name: "E-commerce", description: "Brand identity, packaging and store branding for online sellers who want to become a brand." },
      { name: "Real estate", description: "Project and developer branding, brochures, hoardings and sales office identity." },
      { name: "Hospitality and restaurants", description: "Brands with personality: logo, menu, packaging, signage and social media." },
      { name: "Healthcare and pharma", description: "Calm, trustworthy identities and packaging that follow the needs of the sector." },
      { name: "Luxury", description: "Refined brands with careful typography, materials and presentation." },
      { name: "Franchise and retail", description: "Identity systems that stay consistent in every store and every city." },
    ],
  },
  faq: [
    { question: "What is brand development?", answer: "Brand development is the complete process of building a brand: research, positioning, name and story, logo and visual identity, communication, brand guidelines and the launch. It is much more than logo design." },
    { question: "What is the difference between brand development and logo design?", answer: "A logo is one part of a brand. Brand development covers the strategy behind the logo, the name, the voice, the visual identity system, the stationery, the digital and packaging design, the brand book and the launch." },
    { question: "Who needs brand development services?", answer: "Any new business, startup or company that wants to launch a website, a mobile app or a software product as a brand, and any existing business that needs a brand refresh or rebranding." },
    { question: "What does We3vision deliver in a brand development project?", answer: "Depending on the package: brand research and strategy, name and tagline, logo and logo variations, typography and colours, stationery, social media templates, brand guidelines, packaging, website or app branding and a launch kit. Deliverables and revisions are written in the project scope and contract." },
    { question: "Can you do only a part of the brand?", answer: "Yes. We offer a starter, a complete and a premium brand package, and individual services such as brand strategy, logo design, brand kit design, packaging or a brand launch." },
    { question: "Do you also build the website or app for my brand?", answer: "Yes. We3vision is a design and development company, so we can brand your product and also build the website, mobile app or software that carries the brand." },
    { question: "Do you work on rebranding?", answer: "Yes. We audit your existing brand and then refresh the logo, identity, messaging, packaging, website and guidelines, with a plan to introduce the change." },
    { question: "Do you offer social media management?", answer: "Our brand development includes social media branding: templates, profile design and guidelines. Daily posting, content calendars and community management are offered as a separate service." },
  ],
  related: related("brandkit", "brand", "zero"),
  cta: { heading: "Ready To Launch\nYour Brand?", text: "Tell us about your business, your product and your plan. We will suggest the right brand package and how to start.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Brand Kit Design (/brand-kit-design)
// ---------------------------------------------------------------------------------------------------------------------
export const BRANDKIT_SEO = {
  title: "Brand Kit Design Services in Surat, India | We3vision",
  description: "Brand kit design in Surat, India: logo suite, colour palette, typography, social media and stationery templates and guidelines in one ready-to-use kit.",
};
export const BRANDKIT_SECTIONS = build({
  seo: BRANDKIT_SEO,
  hero: {
    chip: "Brand Kit",
    heading: "Brand Kit\nDesign Services",
    text: "Your logo, colours, fonts and templates in one kit. Anyone in your team, or any printer or designer you work with, can use it and your brand will look the same everywhere.",
  },
  story:
    "A business without a brand kit looks different on every post, brochure and signboard. A *brand kit puts everything in one place*: your logo versions, colour palette, fonts, icon style, photo style and ready-made templates.\n\nWe are a *brand kit design company in Surat, India*. We design the kit, test it on real examples such as a post, a visiting card and a signboard, and hand it over with simple *brand guidelines* so that your brand stays consistent as you grow.",
  services: {
    heading: "What Is Inside\nYour Brand Kit",
    intro: "Every kit is made for your brand, but most contain the following.",
    cards: [
      { title: "Logo suite", description: "Your main logo and the versions you need: horizontal, stacked, icon only, light and dark, with clear space and minimum-size rules." },
      { title: "Colour palette", description: "Main and supporting colours with codes for screen and print, and notes on how to use them." },
      { title: "Typography", description: "A heading and body font pair, sizes and spacing, chosen for readability on screen and in print." },
      { title: "Graphic elements\nand icons", description: "Patterns, shapes, icons and illustration style that make your brand recognisable at a glance." },
      { title: "Photo and image\nstyle", description: "Guidance for the look of photos and graphics, so new images always match your brand." },
      { title: "Social media\ntemplates", description: "Editable post, story and cover templates, so your team can publish quickly and stay on brand." },
      { title: "Stationery and\ndocuments", description: "Visiting card, letterhead, envelope, invoice, presentation and email signature templates." },
      { title: "Brand guidelines", description: "A short, clear document that explains how to use every part of the kit, with do and don't examples." },
    ],
  },
  process: {
    heading: "How We Create\nYour Brand Kit",
    intro: "A short, clear process with your feedback at every stage.",
    items: [
      { title: "Brief and review", text: "We understand your brand, your audience and how you will use the kit.", points: "Brand questions\nExisting material review" },
      { title: "Design the core", text: "We design or refine the logo, colours and typography and show you the options.", points: "Logo and colours\nTypography" },
      { title: "Build the kit", text: "We add icons, patterns, templates and examples on real uses.", points: "Templates\nReal-life mock-ups" },
      { title: "Guidelines and hand-over", text: "We write the guidelines and give you all files in the formats you need.", points: "Brand guidelines\nFiles for print and screen" },
    ],
  },
  tools: { heading: "Tools We\nUse", items: "Adobe Illustrator\nAdobe Photoshop\nAdobe InDesign\nFigma\nCanva\nAdobe After Effects" },
  why: {
    heading: "Why Choose We3vision\nFor Your Brand Kit",
    items: [
      { title: "Everything in one place", description: "No more searching for the latest logo or the right colour code." },
      { title: "Easy for your team", description: "Editable templates mean your team can make on-brand posts and documents without a designer each time." },
      { title: "Ready for print and screen", description: "Files and colour values prepared for both websites and printers." },
      { title: "Tested on real examples", description: "We show the kit on real uses before you approve it." },
      { title: "Consistent everywhere", description: "The same look on your website, social media, packaging and signboards." },
      { title: "Grows with you", description: "A clear structure that is easy to extend when you add new products or services." },
    ],
  },
  faq: [
    { question: "What is a brand kit?", answer: "A brand kit, also called a brand identity kit, is a set of files that contains your logo versions, colours, fonts, graphic style and templates, plus guidelines on how to use them." },
    { question: "What is included in a brand kit?", answer: "Usually a logo suite, colour palette, typography, icons and graphic elements, photo style, social media templates, stationery templates and brand guidelines. We shape the kit around what your business needs." },
    { question: "Can you make a kit if I already have a logo?", answer: "Yes. We can build the rest of the kit around your existing logo, and improve the logo files if they need cleaning up." },
    { question: "What file formats do I get?", answer: "You receive files for print and screen, such as vector files, PNG and PDF, along with editable templates." },
    { question: "How long does it take?", answer: "A brand kit usually takes a few weeks, depending on how much is included. We agree on the stages and dates at the start." },
    { question: "I need a complete brand, not only a kit. Can you help?", answer: "Yes. Our brand development and end-to-end brand development services cover strategy, design, printing and launch." },
  ],
  related: related("branddev", "brand", "graphics"),
  cta: { heading: "Ready For A Brand\nThat Looks The Same Everywhere?", text: "Send us your logo or your idea. We will tell you what your brand kit needs.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Brand Video Production (/brand-video-production)
// ---------------------------------------------------------------------------------------------------------------------
export const BRANDVIDEO_SEO = {
  title: "Brand Video Production in Surat, India | We3vision",
  description: "Brand video production from planning to editing: brand films, product videos, reels and influencer-based video shoots. Video production company in Surat, India.",
};
export const BRANDVIDEO_SECTIONS = build({
  seo: BRANDVIDEO_SEO,
  hero: {
    chip: "Brand Video",
    heading: "Brand Video\nProduction",
    text: "From the first idea to the final edit. We plan, shoot and edit your brand videos, including influencer-based shoots, and hand you finished videos that are ready to post.",
  },
  story:
    "Video is the fastest way for people to understand and *trust a brand*. But a good video is more than a camera: it needs a *clear idea, a script, the right people, careful shooting and sharp editing*.\n\nAs a *video production company in Surat, India*, we handle the whole job. You tell us about your brand and your goal; we take care of *planning, shooting and editing*, and we also arrange *influencer-based videos* when your brand needs a human face and a wider reach.",
  services: {
    heading: "Our Brand Video\nServices",
    intro: "One team for the whole video, from idea to final cut.",
    cards: [
      { title: "Brand films", description: "A story about who you are and why you do what you do, shaped for your website, social media and presentations." },
      { title: "Product and\nservice videos", description: "Clear videos that show what your product does and how it helps, made to build confidence before a purchase." },
      { title: "Influencer-based\nvideos", description: "We find and brief suitable influencers, plan the shoot with them and deliver content that looks natural and fits your brand." },
      { title: "Reels and short\nvideos", description: "Vertical short videos for Instagram, YouTube Shorts and Facebook, planned for quick attention." },
      { title: "Corporate and\nfactory shoots", description: "Company profile videos, factory and showroom walk-throughs and event coverage." },
      { title: "Ad films and\ncampaign videos", description: "Short promotional films for launches, offers and festivals, cut in the right sizes for each platform." },
      { title: "Editing and\npost-production", description: "Editing, colour correction, sound, music, titles, subtitles and simple motion graphics." },
      { title: "Planning and\nscripting", description: "Concept, script, storyboard, shot list and shoot plan, so the day of the shoot is smooth and on budget." },
    ],
  },
  process: {
    heading: "From Planning\nTo Final Edit",
    intro: "We run the full process, so you do not have to manage a crew, a studio and an editor separately.",
    items: [
      { title: "Idea and planning", text: "We understand your brand, goal and audience, and plan the concept, budget and schedule.", points: "Goal and audience\nConcept and timeline" },
      { title: "Script and storyboard", text: "We write the script and draw the storyboard, so you can see the video before we shoot it.", points: "Script\nStoryboard and shot list" },
      { title: "Casting and preparation", text: "We prepare locations, props, equipment and people. For influencer videos, we choose and brief the right creators.", points: "Locations and props\nInfluencer selection" },
      { title: "Shooting", text: "Our crew shoots the video with the right camera, light and sound.", points: "Professional equipment\nDirection on set" },
      { title: "Editing and finishing", text: "We edit, add sound, music, titles and effects and prepare versions for each platform.", points: "Editing and colour\nSound, subtitles and formats" },
      { title: "Delivery", text: "You receive the final videos in the sizes and formats you need, ready to publish.", points: "Platform-ready files\nRevisions included as agreed" },
    ],
  },
  tools: { heading: "Tools And\nEquipment", items: "Adobe Premiere Pro\nAdobe After Effects\nDaVinci Resolve\nCinema cameras\nLighting kits\nAudio recording\nDrones" },
  why: {
    heading: "Why Choose We3vision\nFor Brand Video",
    items: [
      { title: "Planning to editing, one team", description: "No handovers between planners, camera people and editors. One team stays responsible for the result." },
      { title: "Influencer experience", description: "We run influencer-based shoots and know how to brief creators so the content stays on brand." },
      { title: "Designed for platforms", description: "Videos cut in the right sizes and lengths for Instagram, YouTube, Facebook and your website." },
      { title: "Brand-first", description: "Our brand design and kit teams are in the same company, so your videos match your logo, colours and voice." },
      { title: "Clear schedule", description: "You know what happens on which day, and when to expect each version." },
      { title: "Ready to publish", description: "Finished videos with subtitles, music and platform sizes, not raw footage." },
    ],
  },
  industries: {
    heading: "Brand Videos\nFor Every Business",
    intro: "Every business has a story that looks good on video. Some examples.",
    items: [
      { name: "Fashion and lifestyle", description: "Look-book videos, reels and influencer shoots for collections and campaigns." },
      { name: "Jewellery and luxury", description: "Close-up product films that show detail, craft and finish." },
      { name: "Food and restaurants", description: "Menu, kitchen and ambience videos that make people hungry and curious." },
      { name: "Manufacturing", description: "Factory and process videos that build trust with buyers and distributors." },
      { name: "Real estate", description: "Project films, site walk-throughs and drone views." },
      { name: "Education and events", description: "Campus videos, course promotions and event highlights." },
    ],
  },
  faq: [
    { question: "What is included in brand video production?", answer: "Planning, scripting, shooting, editing and delivery. We handle the whole process so you receive finished videos that are ready to publish." },
    { question: "Do you work with influencers?", answer: "Yes. We arrange and brief suitable influencers, plan the shoot together and edit the final content so it fits your brand." },
    { question: "Can you shoot and edit in one package?", answer: "Yes. Planning, shooting and editing are all handled by our team." },
    { question: "How long does a brand video take?", answer: "It depends on the length and the shoot. A short reel can be ready in days, and a brand film takes a few weeks. We share a schedule before we begin." },
    { question: "Can you make videos for Instagram and YouTube?", answer: "Yes. We deliver the same video in different sizes and lengths for each platform." },
    { question: "Do I need to prepare a script?", answer: "No. We help with the idea, script and storyboard. If you already have a script, we can work with it." },
    { question: "Where do you shoot?", answer: "We shoot at your location, in a studio or at a chosen outdoor location, depending on the video. We are based in Surat, India and can plan shoots in other cities." },
  ],
  related: related("brand", "animation", "meta"),
  cta: { heading: "Ready To Put\nYour Brand On Video?", text: "Tell us about your brand and the video you imagine. We will plan it, shoot it and edit it for you.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// End-to-End Brand Development, was "0 to N" (/zero-to-n-brand-development, the route stays)
// ---------------------------------------------------------------------------------------------------------------------
export const ZERO_SEO = {
  title: "End-to-End Brand Development Services | We3vision",
  description: "Build your brand from the ground up: strategy, naming, logo, visual identity, packaging, digital branding, brand videos and launch support.",
};
export const ZERO_SECTIONS = build({
  seo: ZERO_SEO,
  hero: {
    chip: "End-to-End Brand Development",
    heading: "From Zero to a\nBrand That Leads.",
    text: "We build brands from the ground up: from research, strategy and naming to visual identity, digital experiences, packaging, brand films and launch-ready brand systems. Everything your business needs to create a consistent, recognizable and future-ready brand, under one roof.",
  },
  story:
    "Starting a brand usually means finding a strategist, a designer, a printer, a photographer, a website developer and a marketer, and then trying to make them work together. *End-to-end brand development* is our answer: *one team that builds your whole brand from the starting phase to the end*.\n\nYou bring the idea, the product or the service. We take care of *planning, design, printing and execution*. We have built brands for *many different industries*, so whatever you sell, we know how to make it look and feel like a real brand.",
  services: {
    heading: "Everything Your\nBrand Needs",
    intro: "N is whatever your brand needs. These are the parts we usually build.",
    cards: [
      { title: "Brand strategy\nand planning", description: "Purpose, positioning, audience and a clear plan for what your brand should become." },
      { title: "Name, logo and\nidentity", description: "A name, tagline and logo with a complete visual identity that suits your market." },
      { title: "Brand kit and\nguidelines", description: "Colours, fonts, templates and rules, so every future design stays consistent." },
      { title: "Packaging and\nlabels", description: "Boxes, pouches, bottles and labels designed to stand out on the shelf and online." },
      { title: "Printing and\nstationery", description: "Visiting cards, brochures, catalogues, bags, uniforms and more, designed and printed for you." },
      { title: "Website and\nonline presence", description: "A website, social media profiles and online listings that match your brand and are ready to find." },
      { title: "Photos and\nbrand video", description: "Product photography and brand video that give your brand real content from the first day." },
      { title: "Launch and\nmarketing", description: "A launch plan with social media, digital marketing and on-ground activity to introduce your brand." },
    ],
  },
  process: {
    heading: "From Zero\nTo Launch",
    intro: "A single, connected journey. You always know the next step.",
    items: [
      { title: "Idea and discovery", text: "We understand your idea, your customers and your market, and decide where your brand should stand.", points: "Idea and goals\nMarket and audience" },
      { title: "Strategy and name", text: "We define the brand, its promise and its voice, and create the name and tagline.", points: "Positioning\nName and tagline" },
      { title: "Design and identity", text: "We design the logo, colours, typography and the full brand kit.", points: "Logo and identity\nBrand kit" },
      { title: "Products and print", text: "We design and prepare packaging, labels and printed material and supervise printing.", points: "Packaging and labels\nPrint production" },
      { title: "Online presence", text: "We build the website and social media profiles and prepare photos and videos.", points: "Website and social media\nPhoto and video content" },
      { title: "Launch and execution", text: "We plan and run the launch and stay with you for the first steps.", points: "Launch plan\nMarketing in action" },
    ],
  },
  tools: { heading: "Services Inside\nEnd-To-End Branding", items: "Brand strategy\nLogo design\nBrand kit\nPackaging design\nPrint design\nWebsite development\nBrand video\nSocial media\nMarketing" },
  why: {
    heading: "Why Choose We3vision\nFor End-To-End Branding",
    items: [
      { title: "One team, one brand", description: "Strategy, design, print, website, video and marketing are all done by one team, so everything fits." },
      { title: "Nothing left for you to arrange", description: "You do not need to find designers, printers or developers. We take care of it." },
      { title: "Planning to execution", description: "We do not stop at designs. We see your brand through to printing, launch and first marketing." },
      { title: "Every industry", description: "We have built brands for many industries and know how to adapt a brand to each market." },
      { title: "Clear stages", description: "Each stage has a clear outcome, so you can see progress and approve step by step." },
      { title: "Built to grow", description: "A solid base, so you can add products, shops and services later without starting again." },
    ],
  },
  industries: {
    heading: "Brands We Build\nIn Every Industry",
    intro: "If you can sell it, we can brand it. Some examples.",
    items: [
      { name: "Food and beverages", description: "Brands for snacks, sweets, drinks and restaurants, with packaging and labels that sell." },
      { name: "Fashion and clothing", description: "Labels, tags, packaging and a look that suits your customer." },
      { name: "Jewellery and accessories", description: "Elegant identities and packaging that feel valuable." },
      { name: "Health and wellness", description: "Calm and trustworthy brands for clinics, products and wellness services." },
      { name: "Manufacturing and industry", description: "Strong, clear brands for B2B products, catalogues and dealer material." },
      { name: "Education and training", description: "Brands for schools, institutes and coaching, from logo to admission material." },
      { name: "Technology and startups", description: "Modern identities, websites and decks for new products and companies." },
      { name: "Retail and FMCG", description: "Shelf-ready brands with packaging, display and promotion material." },
    ],
  },
  faq: [
    { question: "What is included in end-to-end brand development?", answer: "It can include research, strategy, naming, logo design, visual identity, brand assets, guidelines and launch materials, depending on the agreed scope." },
    { question: "Can I choose only one branding service?", answer: "Yes. Individual services such as Brand Design, Brand Kit Design and Brand Video can also be commissioned separately." },
    { question: "Can you rebrand an existing business?", answer: "Yes. We can assess your current identity and develop a refreshed brand strategy, visual system and rollout plan." },
    { question: "Do you provide website and packaging design?", answer: "Yes. Website, app and packaging design can be included according to your business needs and project scope." },
    { question: "Will I receive the source files?", answer: "Deliverable formats, editable files and source assets will be specified in the project proposal." },
    { question: "How much does brand development cost?", answer: "Pricing depends on the scope, number of deliverables, complexity and timeline. Contact our team for a tailored proposal." },
  ],
  related: related("branddev", "brandkit", "brandvideo"),
  cta: { heading: "Start Your\nBrand Journey", text: "Tell us about your business, your goals and the brand you want to create.", button: "Let's Build Your Brand" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Meta Marketing (/meta-marketing-services)
// ---------------------------------------------------------------------------------------------------------------------
export const META_SEO = {
  title: "Meta Ads & Marketing Services | We3vision",
  description: "Plan and optimize Facebook and Instagram advertising with campaign strategy, creative production, audience testing and performance measurement.",
};
export const META_SECTIONS = build({
  seo: META_SEO,
  hero: {
    chip: "Meta Marketing",
    heading: "Meta Marketing\nServices",
    text: "Reach the people who are looking for you on Facebook and Instagram. We plan, design and run your Meta campaigns and report what they bring in plain words.",
  },
  story:
    "Facebook and Instagram are where *many of your customers spend their time*. Good Meta marketing is not just boosting a post: it is a *clear goal, the right audience, strong creative and careful testing*.\n\nAs a *Meta marketing agency in Surat, India*, we handle the whole job: strategy, *ad creative, copy, campaign set-up, optimisation and reporting*. Your brand, ads and videos come from the same team, so everything looks and sounds consistent.",
  services: {
    heading: "Our Meta Marketing\nServices",
    intro: "Everything that is needed to turn Facebook and Instagram into a steady source of customers.",
    cards: [
      { title: "Meta ads\nmanagement", description: "Campaigns on Facebook and Instagram set up, tested and improved week after week to reach your goal." },
      { title: "Lead generation\ncampaigns", description: "Ads with simple forms or click-to-message that bring in enquiries you can follow up quickly." },
      { title: "Sales and\ne-commerce ads", description: "Catalogue and product ads for online stores, with retargeting for people who visited but did not buy." },
      { title: "Brand awareness\ncampaigns", description: "Campaigns that make more of the right people know your name, product or launch." },
      { title: "Ad creative and\ncopywriting", description: "Images, videos, reels and carousels with clear messages, made by our design and video teams." },
      { title: "Instagram and Facebook\ncontent", description: "Regular posts, stories and reels that keep your page active and on brand." },
      { title: "Audience and\nstrategy", description: "A clear plan for who to reach, what to say and how much to spend, based on your goals." },
      { title: "Tracking and\nreporting", description: "Pixel and conversion set-up, with simple reports about spend, leads, sales and what to improve." },
    ],
  },
  process: {
    heading: "How We Run\nYour Campaigns",
    intro: "A repeatable process that starts with your goal and keeps improving.",
    items: [
      { title: "Goal and audit", text: "We agree on what success means and review your page, offer and past results.", points: "Goals and budget\nPage and offer review" },
      { title: "Strategy and creative", text: "We plan the audience and message and create the ads.", points: "Audience plan\nImages, videos and copy" },
      { title: "Set-up and launch", text: "We set up tracking and launch campaigns with a few variations to learn quickly.", points: "Pixel and tracking\nTest variations" },
      { title: "Optimise", text: "We watch the numbers, pause what does not work and put more into what does.", points: "Weekly review\nBudget and audience changes" },
      { title: "Report", text: "You receive clear reports and a plan for the next step.", points: "Plain-language reports\nNext-step plan" },
    ],
  },
  tools: { heading: "Platforms And\nTools", items: "Facebook Ads\nInstagram Ads\nMeta Business Suite\nMeta Pixel\nConversions API\nGoogle Analytics\nCanva\nAdobe Premiere Pro" },
  why: {
    heading: "Why Choose We3vision\nFor Meta Marketing",
    items: [
      { title: "Creative and ads together", description: "Design, video and ad management in one team, so the creative is made for the campaign." },
      { title: "Clear goals", description: "We start with what you want: leads, sales or awareness, and judge the work by that." },
      { title: "Plain reports", description: "Simple reports about what you spent, what you got and what happens next." },
      { title: "Tested, not guessed", description: "We test different images, texts and audiences and keep what works." },
      { title: "Brand-safe", description: "Ads that follow your brand kit, so your page looks professional and consistent." },
      { title: "Works with your other marketing", description: "Meta campaigns planned together with your SEO, website and offline marketing." },
    ],
  },
  industries: {
    heading: "Meta Marketing\nFor Every Industry",
    intro: "Different businesses use Facebook and Instagram in different ways.",
    items: [
      { name: "E-commerce and retail", description: "Product ads, offers and retargeting that bring shoppers back to your store." },
      { name: "Fashion and jewellery", description: "Visual campaigns and reels that show your collection at its best." },
      { name: "Restaurants and food", description: "Local ads, offers and event promotion that bring people through the door." },
      { name: "Education and coaching", description: "Lead campaigns for admissions, courses and workshops." },
      { name: "Real estate", description: "Lead ads and project promotion to interested buyers in your area." },
      { name: "Services and B2B", description: "Targeted campaigns that bring serious enquiries for professional services." },
    ],
  },
  faq: [
    { question: "What is Meta marketing?", answer: "It is advertising and promotion on Meta platforms such as Facebook and Instagram: planning the campaign, creating the ads, choosing audiences, running the campaign and measuring what it delivers." },
    { question: "Do you manage Facebook and Instagram ads?", answer: "Yes. We set up, run, monitor and optimize campaigns, and report on them clearly." },
    { question: "Do you create ad creatives?", answer: "Yes. Static images, carousels, short videos, reels-style content and motion graphics, with variations for testing." },
    { question: "Can you help generate leads?", answer: "Yes. We can plan lead campaigns with instant forms or landing pages and help connect them to your team or CRM. We cannot promise a number of leads." },
    { question: "Is the advertising budget included in your service fee?", answer: "No. Media spend is paid to the platform and our fee is separate, unless a proposal clearly says otherwise." },
    { question: "Can you set up Pixel and conversion tracking?", answer: "Yes. We can support Meta Pixel and Conversions API set-up and check events, following privacy, consent and platform rules." },
    { question: "Do you guarantee leads or sales?", answer: "No. Results depend on the offer, audience, budget, creative, competition and your website, so we do not guarantee leads or sales." },
    { question: "Can you manage existing ad accounts?", answer: "Yes. We can review an existing account and campaigns, then improve the structure, creative and tracking." },
  ],
  related: related("seo", "brandvideo", "physical"),
  cta: { heading: "Let's Build Your\nNext Campaign.", text: "Tell us what you want to achieve, who you want to reach and what you are promoting. We'll help you plan the right campaign approach.", button: "Discuss Your Meta Campaign" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Physical Marketing (/physical-marketing-services)
// ---------------------------------------------------------------------------------------------------------------------
export const PHYSICAL_SEO = {
  title: "Physical Marketing & Offline Campaigns | We3vision",
  description: "Explore physical marketing, print collateral, outdoor advertising, event branding and offline-to-online campaign design with We3vision.",
};
export const PHYSICAL_SECTIONS = build({
  seo: PHYSICAL_SEO,
  hero: {
    chip: "Physical Marketing",
    heading: "Physical Marketing\nServices",
    text: "Be seen in the real world as well as online. We design and deliver print, outdoor and on-ground marketing that people can see, touch and remember.",
  },
  story:
    "Not every customer is scrolling on a phone. People walk past a *signboard*, pick up a *brochure*, hold a *package* and visit a *stall*. Physical marketing builds trust in places where screens cannot.\n\nWe are a *physical marketing and branding agency in Surat, India*. We design the material in the same brand identity as your digital work, take care of *printing and production*, and help you plan how and where to put it in front of people.",
  services: {
    heading: "Our Physical\nMarketing Services",
    intro: "From a visiting card to a full exhibition stall, designed, produced and delivered.",
    cards: [
      { title: "Print marketing", description: "Brochures, catalogues, flyers, leaflets, posters and company profiles designed to be read and kept." },
      { title: "Outdoor and\nsignage", description: "Hoardings, shop boards, glow signs, banners and wall branding that make your business easy to find." },
      { title: "Packaging and\nlabels", description: "Boxes, bags, labels and stickers that make your product look better and your brand stay in mind." },
      { title: "Exhibition and\nevent branding", description: "Stalls, standees, backdrops, kiosks and giveaways designed for trade shows and events." },
      { title: "Retail and\nin-store branding", description: "Counters, displays, posters and shelf branding that guide customers and increase interest." },
      { title: "Vehicle and\nuniform branding", description: "Branding for delivery vehicles, uniforms and ID cards that turn your team into walking advertising." },
      { title: "Corporate gifts and\nmerchandise", description: "Branded gifts and merchandise for clients, staff and events." },
      { title: "Campaign planning\nand execution", description: "A plan for where, when and how to place your material, and on-ground teams to carry it out." },
    ],
  },
  process: {
    heading: "How We Plan\nYour Physical Marketing",
    intro: "From a clear plan to material delivered and in place.",
    items: [
      { title: "Understand and plan", text: "We learn about your goal, your customers and the places where you can reach them.", points: "Goal and audience\nPlaces and budget" },
      { title: "Design", text: "We design every piece in your brand identity, so print and online look the same.", points: "Layouts and mock-ups\nBrand consistency" },
      { title: "Produce", text: "We take care of printing and production, check quality and handle delivery.", points: "Printing and fabrication\nQuality checks" },
      { title: "Install and execute", text: "We help install signage and run on-ground activities, such as events and distribution.", points: "Installation\nOn-ground activity" },
    ],
  },
  tools: { heading: "What We\nProduce", items: "Brochures\nCatalogues\nBanners\nHoardings\nStandees\nPackaging\nSignage\nStationery\nMerchandise" },
  why: {
    heading: "Why Choose We3vision\nFor Physical Marketing",
    items: [
      { title: "Design and production together", description: "The same team designs and produces, so what you approve is what you receive." },
      { title: "Matches your brand", description: "Print and outdoor material in the same style as your website and social media." },
      { title: "One point of contact", description: "You deal with one team, not separate designers, printers and installers." },
      { title: "Quality checked", description: "We check colours, materials and finish before delivery." },
      { title: "Plan for the place", description: "We design with the real location in mind: distance, light, size and surroundings." },
      { title: "Connected with digital", description: "Physical campaigns planned together with Meta marketing, SEO and your website." },
    ],
  },
  industries: {
    heading: "Physical Marketing\nFor Every Business",
    intro: "Wherever customers meet your business in person, good branding helps.",
    items: [
      { name: "Retail and showrooms", description: "Shop boards, displays and in-store branding that bring people in and help them choose." },
      { name: "Restaurants and cafes", description: "Menus, signage, packaging and table branding that feel like one place." },
      { name: "Manufacturing and B2B", description: "Catalogues, stall design and dealer material for trade shows and distributors." },
      { name: "Education", description: "Admission brochures, hoardings and event material." },
      { name: "Real estate", description: "Site hoardings, brochures and sales office branding." },
      { name: "Healthcare", description: "Clear signage, patient material and clinic branding." },
    ],
  },
  faq: [
    { question: "What services are included in physical marketing?", answer: "Design and planning for print, outdoor, retail, event, promotional and activation materials, so your brand shows up in the real world and connects with your digital marketing." },
    { question: "Do you design brochures, posters and catalogues?", answer: "Yes. We design them and prepare print-ready artwork, with specifications for the printer." },
    { question: "Can you help with billboard and outdoor advertising?", answer: "We can plan the format and design the artwork. Media space, permissions and installation come from media owners and production partners, which we can coordinate where it is in the scope." },
    { question: "Do you manage event and exhibition branding?", answer: "Yes. We can design booth and backdrop graphics, signage, handouts and a follow-up flow to capture leads." },
    { question: "Is printing included in your service?", answer: "Design and artwork are ours. Printing and production depend on the approved scope and on vendor arrangements, and can be coordinated if included." },
    { question: "Can physical campaigns connect to digital marketing?", answer: "Yes. QR codes, short URLs, dedicated landing pages and campaign tags can link a physical piece to an online action." },
    { question: "Can you coordinate production and installation?", answer: "Where it is part of the scope, we coordinate with printers, fabricators and installers. This is agreed in the proposal." },
    { question: "How is the cost of a physical campaign calculated?", answer: "It depends on the formats, quantities, materials, locations, production and installation requirements. We prepare a tailored proposal after we understand the brief." },
  ],
  related: related("meta", "brandkit", "zero"),
  cta: { heading: "Let's Take Your Brand\nBeyond the Screen.", text: "Tell us about your audience, campaign goals and the physical touchpoints you want to create. We'll help you shape a campaign that connects your brand with people in the real world.", button: "Plan Your Physical Campaign" },
});
