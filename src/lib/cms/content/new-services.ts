import { build, related } from "./tech";

// NEW SERVICE PAGES (part 1): Shopify Plugin Development, Custom Software Development, Brand Development, Brand Kit Design.
// Written for this site (they are not on the old site): plain wording, search words a customer would type (service + company + Surat + India),
// and nothing invented: no prices, client names, counts or results. Words in *stars* are highlighted. This is what visitors see until someone
// publishes a version from the admin panel.

// ---------------------------------------------------------------------------------------------------------------------
// Shopify Plugin Development (/shopify-plugin-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SHOPIFYPLUGIN_SEO = {
  title: "Shopify Plugin Development Company in Surat | We3vision",
  description: "Shopify plugin development company in Surat, India. Custom plugins, theme extensions and integrations for stores in the USA, UK, Canada, Australia.",
};
export const SHOPIFYPLUGIN_SECTIONS = build({
  seo: SHOPIFYPLUGIN_SEO,
  hero: {
    chip: "Shopify Plugins",
    heading: "Shopify Plugin\nDevelopment Company",
    text: "Need one more feature in your Shopify store? We are a Shopify plugin development company in Surat, Gujarat, India, building custom Shopify plugins for your theme and checkout, for stores in India, the USA, UK, Canada and Australia.",
  },
  story:
    "*Shopify plugin development services* add the *right small features* to a store: a size guide, a product bundle, a delivery date picker, a custom discount, a pop-up that really fits your brand. Ready-made apps often give you *ten features when you need one*, and slow the store down.\n\nAs a *Shopify plugin development company in Surat, Gujarat, India*, we build *light, custom Shopify plugins* with theme app extensions, Liquid, JavaScript and Shopify's own APIs. They load fast, match your design and are easy for your team to switch on and off.\n\nStore owners in the USA, UK, Canada and Australia hire Shopify developers from India and work with us remotely, with clear updates and a plan agreed up front.",
  services: {
    heading: "Our Shopify Plugin\nDevelopment Services",
    intro: "Small or large, every Shopify plugin is built for your theme, your products and your way of selling, at home or abroad.",
    cards: [
      { title: "Custom Shopify\nplugins", description: "Custom Shopify plugin development: a new feature built from scratch for your store, instead of a heavy app with features you never use." },
      { title: "Shopify theme\nextension", description: "App blocks and embeds that merchants add from the theme editor in a click, with no code, built as Shopify theme extensions." },
      { title: "Shopify sections\nand add-ons", description: "New Online Store 2.0 sections and add-ons: banners, product highlights, size guides, comparison tables and more, in your theme's style." },
      { title: "Checkout and cart\nadd-ons", description: "Gift notes, delivery date pickers, free-gift rules, upsells and cart messages that help customers finish their order smoothly." },
      { title: "Discounts and\ncustom rules", description: "Bundle offers, tiered discounts and shipping or payment rules built with Shopify Functions, for the offers you plan." },
      { title: "Shopify API\nintegrations", description: "Shopify integrations that connect your store with your ERP, CRM, courier, accounting tool or marketing platform through APIs." },
      { title: "Plugin upgrades\nand fixes", description: "Shopify customisation for plugins you already have: we update, speed up and repair them for new Shopify versions." },
      { title: "Support and\nmaintenance", description: "Ongoing care after launch: bug fixes, compatibility updates and small improvements whenever your store needs them." },
    ],
  },
  process: {
    heading: "How We Build\nYour Shopify Plugin",
    intro: "A simple path from the first idea to a plugin running on your live store, with updates at every step.",
    items: [
      { title: "Understand the need", text: "We learn what the plugin must do, who will use it and where it appears in your store, over a call or by message.", points: "Goal of the feature\nWhere it shows in the store" },
      { title: "Plan and design", text: "We choose the right way to build it (theme extension, section, Function or app), agree the plan with you and design how it behaves.", points: "Technical plan\nScreens and settings" },
      { title: "Build and connect", text: "We write clean code that fits your theme and connects to Shopify and your other tools, and share progress as we go.", points: "Liquid, JavaScript and APIs\nTheme-friendly styling" },
      { title: "Test on a copy", text: "We test on a duplicate theme and on different browsers and screens, so nothing breaks on your live store or your theme updates.", points: "Duplicate theme testing\nSpeed check" },
      { title: "Launch and support", text: "We publish the plugin, show your team how to use it and stay on hand for fixes, updates and changes.", points: "Safe go-live\nHand-over and support" },
    ],
  },
  tools: { heading: "Our Shopify\nTech Stack", items: "Shopify\nLiquid\nJavaScript\nNode.js\nReact.js\nShopify GraphQL API\nShopify Functions\nHTML5\nCSS3" },
  why: {
    heading: "Why Choose We3vision\nFor Shopify Plugins",
    items: [
      { title: "Light and fast", description: "Only the code your feature needs, so your store stays quick and your search visibility is not hurt by heavy scripts." },
      { title: "Made for your theme", description: "Plugins that follow your colours, fonts and layout, so they look like a native part of your Shopify store." },
      { title: "Easy for your team", description: "Settings live in the theme editor, so your team can change text, colours and placement without a developer." },
      { title: "You own the code", description: "A custom plugin is yours. There is no monthly app fee for a feature you only need once, as agreed in your plan." },
      { title: "Safe updates", description: "We build with current Shopify standards and test on a copy, so your plugin keeps working as Shopify and your theme change." },
      { title: "One team for everything", description: "One Surat-based team for design, build, testing and support, working remotely with Shopify stores in the USA, UK, Canada and Australia." },
    ],
  },
  industries: {
    heading: "Shopify Plugins\nFor Every Store",
    intro: "Every kind of store has its own small missing features. Here are a few examples from Shopify stores we can help.",
    items: [
      { name: "Fashion and apparel", description: "Size guides, colour swatches and look-book sections that help shoppers choose with confidence." },
      { name: "Jewellery", description: "Engraving options, gift packaging choices and metal or size pickers on the product page, built as simple product options." },
      { name: "Home and living", description: "Room-style galleries, bundle builders and delivery date selection for larger items that need planning." },
      { name: "Beauty and wellness", description: "Shade finders, subscription choices and free-sample rules at the cart, shown in your brand style." },
      { name: "Food and gifting", description: "Gift messages, scheduled delivery and combo boxes built from several products in one simple flow." },
      { name: "B2B and wholesale", description: "Minimum order rules, quantity tiers and quick-order forms for trade customers who reorder often." },
    ],
  },
  faq: [
    { question: "What is a Shopify plugin?", answer: "A Shopify plugin is a small add-on that gives your store one extra feature, such as a size guide, a bundle or a delivery date picker. It is usually built as a theme extension, a section or a Shopify Function. It sits inside your store and follows your theme." },
    { question: "What is the difference between a Shopify plugin, an app and theme customisation?", answer: "A plugin adds one feature, an app is a larger product with its own admin screens, and theme customisation changes how existing parts look. People often use plugin and app for the same thing. We help you pick the lightest option that does the job." },
    { question: "Why choose a Shopify plugin development company in Surat, India?", answer: "A company in Surat, India gives you custom Shopify work built by a team you can talk to directly, with clear communication. We have been building in Surat, Gujarat since 2019 and work remotely with stores abroad. You get a plan agreed up front, so the work is easy to follow." },
    { question: "Do you work with Shopify stores in the USA, UK, Canada and Australia?", answer: "Yes, we deliver Shopify plugin development for stores in the USA, UK, Canada and Australia remotely from Surat, India. We agree the plan up front and share clear updates by call or message. We have worked with clients from these countries." },
    { question: "Can you build a plugin for my existing theme?", answer: "Yes, we build plugins for most themes, including Online Store 2.0 themes. We test every plugin on a duplicate of your theme first. Your live store is not touched until the plugin works." },
    { question: "Will a custom plugin break when Shopify or my theme updates?", answer: "A custom plugin built on current Shopify standards, such as theme app extensions, is designed to keep working through updates. We test on a copy and can update the plugin when Shopify changes. Support and maintenance are available after launch." },
    { question: "Will a custom plugin slow down my store?", answer: "A custom plugin carries only the code it needs, so it is usually lighter than a ready-made app. We check the speed of your store before and after. Heavy scripts are the first thing we avoid." },
    { question: "Can you connect my Shopify store to other tools?", answer: "Yes, we build Shopify integrations with your ERP, CRM, courier, accounting tool or marketing platform through APIs. We use the Shopify GraphQL API, Node.js and your tool's own API. We explain how data will flow before we build." },
    { question: "How much does a custom Shopify plugin cost?", answer: "The cost depends on what the plugin does, where it connects and how much setup it needs. A simple section costs less than a plugin with settings and integrations. Tell us your need and we will send a clear quote before we start." },
    { question: "How long does a Shopify plugin take to build, and can you fix an old one?", answer: "A small plugin can be ready quickly, while larger ones with settings and integrations take longer, and we give a clear timeline once we understand your need. Yes, we can also repair, speed up and upgrade a plugin you already have. We review the code first." },
  ],
  related: related("shopify", "shopapp", "software"),
  cta: { heading: "Ready To Add\nThat Missing Feature?", text: "Tell us what your Shopify store needs and we will suggest the lightest way to build it, with a clear plan up front.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Custom Software Development (/software-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const SOFTWARE_SEO = {
  title: "Custom Software Development Company in Surat | We3vision",
  description: "Custom software development company in Surat, India: bespoke ERP, CRM, portals and API integration for USA, UK, Canada and Australia clients.",
};
export const SOFTWARE_SECTIONS = build({
  seo: SOFTWARE_SEO,
  hero: {
    chip: "Software Development",
    heading: "Custom Software\nDevelopment Company",
    text: "Spreadsheets and manual work slow a business down. We are a custom software development company in Surat, Gujarat, India, building bespoke software around how your team works, for clients in India, the USA, UK, Canada and Australia.",
  },
  story:
    "*Custom software development services* build software around your business, not the other way round. Off-the-shelf tools make you change your process to fit them; *bespoke software* fits your process, connects your tools and removes repeated manual work.\n\nWe are a *custom software development company in Surat, Gujarat, India*, working since 2019. We plan with you, design clear screens, build *web portals, dashboards, ERP and CRM systems and business automation software*, and support them after launch.\n\nStartups and growing businesses in India, and clients in the USA, UK, Canada and Australia who *hire software developers from India*, work with us remotely, with regular demos and a plan agreed up front.",
  services: {
    heading: "Our Software\nDevelopment Services",
    intro: "From a small internal tool to a full product, we cover the whole custom software journey, at home and abroad.",
    cards: [
      { title: "Custom business\nsoftware", description: "Bespoke software built for your exact workflow: orders, stock, billing, staff, approvals or anything else your team does daily." },
      { title: "Web portals and\ndashboards", description: "Web portal and dashboard development for customers, vendors and staff, so everyone sees live information in one place." },
      { title: "ERP and CRM\nsystems", description: "ERP and CRM software that brings sales, operations and customers together, shaped around your company, not a template." },
      { title: "SaaS product\ndevelopment", description: "We turn an idea into a software product with accounts, plans, an admin panel and a clean, scalable foundation." },
      { title: "Workflow\nautomation", description: "Business automation software that moves repeated tasks such as reports, reminders, data entry and approvals from people to software." },
      { title: "API and system\nintegration", description: "Software integration and API development: payment gateway, accounting tool, courier, WhatsApp or CRM connected, with no retyping." },
      { title: "Legacy software\nmodernisation", description: "Old, slow or unsupported software rebuilt or upgraded to a modern, secure platform, with your data moved carefully." },
      { title: "Support and\nmaintenance", description: "Updates, security fixes, backups and new features after launch, so your software keeps working as your business grows." },
    ],
  },
  process: {
    heading: "Our Software\nDevelopment Life Cycle",
    intro: "A clear, step-by-step way of working, by call or message, so you always know what is happening.",
    items: [
      { title: "Discovery", text: "We listen, study how your team works today and agree what the software must achieve, over a call or in person.", points: "Goals and users\nCurrent process" },
      { title: "Planning", text: "We list the features, choose the technology and prepare a plan with clear stages that you approve.", points: "Feature list\nTechnology and timeline" },
      { title: "UI/UX design", text: "We design simple screens and test the flow with you on a prototype before any building starts.", points: "Wireframes\nClickable prototype" },
      { title: "Development", text: "We build the software in stages, so you can see and try each part as it grows, not only at the end.", points: "Regular demos\nClean, secure code" },
      { title: "Testing", text: "We test every feature on different devices and fix the issues we find before launch.", points: "Functional testing\nSecurity checks" },
      { title: "Launch and support", text: "We deploy the software, train your team and keep improving it as your needs change.", points: "Go-live\nTraining and support" },
    ],
  },
  tools: { heading: "Technologies\nWe Work With", items: "React.js\nNext.js\nNode.js\nPython\nPostgreSQL\nMySQL\nMongoDB\nREST APIs\nGraphQL\nDocker\nAWS" },
  why: {
    heading: "Why Choose We3vision\nFor Custom Software",
    items: [
      { title: "Built around you", description: "We start from your process and your people, not from a template, so it matches how you work." },
      { title: "Simple to use", description: "Clean screens and clear steps, so your team learns the software quickly without long training." },
      { title: "Secure by design", description: "Safe logins, roles, backups and secure data handling from the first day, with confidentiality agreed first." },
      { title: "Ready to grow", description: "A clean structure that lets you add features, users and branches later, without a rebuild." },
      { title: "Clear communication", description: "Regular demos and plain updates, so there are no surprises, wherever you are." },
      { title: "Support after launch", description: "We stay with you for fixes, updates and new ideas, as planned." },
    ],
  },
  industries: {
    heading: "Software For\nEvery Industry",
    intro: "Every industry has its own process. Here are some where custom software helps, in India and abroad.",
    items: [
      { name: "Manufacturing and trading", description: "Order, stock, dispatch and billing in one system, with clear reports for the owner." },
      { name: "Diamond and jewellery", description: "Inventory, job work and sales tracking made simple and secure, with role-based access." },
      { name: "Textile and retail", description: "Stock, parties, orders and accounts connected from one place, instead of many sheets." },
      { name: "Education", description: "Student, fee, class and exam management, with portals for teachers, students and parents." },
      { name: "Healthcare", description: "Appointments, patient records and billing, built with privacy and access control in mind." },
      { name: "Logistics", description: "Booking, tracking and delivery management with live status for staff and customers." },
      { name: "Real estate", description: "Leads, listings, site visits and payments in one system, so no enquiry is lost." },
      { name: "Startups", description: "A first working product (MVP) built in stages and ready to improve with real user feedback." },
    ],
  },
  faq: [
    { question: "What is custom software development?", answer: "Custom software development means designing and building software for one business, around its own process, instead of using a ready-made product that every company shares. It can be a web portal, a dashboard, an ERP or CRM system, or automation of repeated work. It is also called bespoke software development." },
    { question: "Why choose custom software instead of ready-made software?", answer: "Custom software fits your process exactly, connects with your other tools, and you pay for the features you really need. Ready-made software makes you change how you work to suit it. You also own and control custom software." },
    { question: "Which custom software development company in Surat should I choose?", answer: "Choose a company that starts from your process, shows you work in stages and agrees a plan before building. We3vision is a custom software development company in Surat, Gujarat, India, founded in 2019. We plan with you, demo regularly and support the software after launch." },
    { question: "How much does custom software development cost?", answer: "The cost depends on the features, the number of users and the systems it must connect to. A small internal tool costs less than a full ERP or SaaS product. After discovery we send a clear quote before any building starts." },
    { question: "How long does it take to build custom software?", answer: "The time depends on how large the system is; a simple tool is quicker than a full ERP or portal. We build in stages, so you can use and test each part early. After discovery we give you a plan with stages and a timeline." },
    { question: "Can you connect the software to our other tools?", answer: "Yes, we do software integration and API development. We can connect a payment gateway, accounting tool, courier, WhatsApp or CRM so data flows without retyping. We use REST APIs and GraphQL, and we explain how data will move before we build." },
    { question: "Is my data safe and who owns the software?", answer: "We build with secure logins, roles and permissions, encrypted connections and regular backups, and we agree on confidentiality before we start. You own and control the software we build for you. We explain how your data is stored and handled." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we deliver custom software development for clients in the USA, UK, Canada and Australia remotely from Surat, India. We agree the plan up front, hold regular demos and share clear updates by call or message. We have worked with clients from these countries." },
    { question: "Can you improve or replace our old software?", answer: "Yes, we can upgrade, rebuild or replace old software and move your data carefully to the new system. We first study what the current software does and what slows your team down. Then we plan the move in stages." },
    { question: "Do you provide support after launch, and will it work on phones?", answer: "Yes, we offer updates, fixes, backups and new features after launch through a support plan. Our web software works on phones, tablets and computers. We can also build a mobile app if you need one." },
  ],
  related: related("mobile", "ai", "web"),
  cta: { heading: "Ready To Build\nYour Software?", text: "Tell us where your team slows down and we will suggest a plan. We work remotely with clients in India, the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Brand Development (/brand-development-services)
// ---------------------------------------------------------------------------------------------------------------------
export const BRANDDEV_SEO = {
  title: "Brand Development Agency in Surat, India | We3vision",
  description: "Brand development agency in Surat, India: brand strategy, naming, story and visual identity for startups and clients in the USA, UK, Canada, Australia.",
};
export const BRANDDEV_SECTIONS = build({
  seo: BRANDDEV_SEO,
  hero: {
    chip: "Brand Development",
    heading: "Brand Development\nServices",
    text: "Brand development is more than a logo. We3vision, a brand development agency in Surat, India, builds the whole brand (strategy, positioning, name, story, identity and launch) for clients in India, the USA, UK, Canada and Australia.",
  },
  story:
    "*Brand development is not only logo design.* It is a complete service that helps a business establish itself in the market as a *new brand*: *brand strategy and positioning, brand naming, brand story and voice, visual identity, communication and brand guidelines*, everything from the first research to launch day.\n\nIt is made for any company that wants to build a *website, a mobile app or a software product* and *launch it as a brand*, from a startup preparing its first launch to an existing brand that needs a fresh start. As a *brand development agency in Surat, Gujarat, India*, We3vision follows one clear process: *research and positioning, naming and tagline, logo and visual identity, stationery and marketing material, digital and social media branding, packaging, brand guidelines and a launch plan*.\n\nSince 2019 we have worked with clients from the USA, Canada, the UK, Germany, UAE, Singapore and Australia. You can *hire branding experts from India* and work remotely, with clear communication and a plan agreed up front.",
  services: {
    heading: "Our Brand Development\nService Lines",
    intro: "Seven service lines that together make a complete brand, from research and strategy to rebranding and launch.",
    cards: [
      { title: "Brand Strategy\n& Research", description: "Research, brand positioning, audience, naming and messaging: the planning that comes before the design, so every later choice has a reason." },
      { title: "Visual Identity\n& Logo Design", description: "Logo systems, typography, colours, graphic language and visual assets that make the brand recognisable on every screen and print." },
      { title: "Corporate Identity\n& Collateral", description: "Stationery, company profiles, brochures, presentations and office branding for a professional first impression with every client and partner." },
      { title: "Digital & Social\nMedia Branding", description: "Website identity, app and SaaS branding, social media templates and digital campaigns, all in one consistent brand voice." },
      { title: "Packaging &\nProduct Branding", description: "Product identity, labels, packaging systems and retail presentation that sell on the shelf and online, and tell your brand story at a glance." },
      { title: "Brand Guidelines\n& Launch", description: "The brand book, asset handover, launch creatives and a rollout plan so the whole team, in any country, uses the brand correctly." },
      { title: "Rebranding &\nAdvanced Branding", description: "Brand refresh, employer branding, 3D and motion identity, mascots and immersive branding for brands that want a fresh start." },
    ],
  },
  process: {
    heading: "How We Develop\nYour Brand",
    intro: "One clear journey from the first conversation to launch day, with a plan agreed up front.",
    items: [
      { title: "Strategy and research", text: "We study your business, industry, market, competitors and audience, and define your brand positioning, purpose and personality in writing.", points: "Brand discovery and consultation\nMarket and competitor research\nPositioning, USP and brand personality" },
      { title: "Name and verbal identity", text: "We create the brand name, tagline, story and voice, so the brand sounds the same everywhere.", points: "Naming and shortlisting\nTagline and brand story\nVoice and tone guidelines" },
      { title: "Visual identity", text: "We design the logo system, typography, colours and the graphic language of the brand, and share options for your feedback.", points: "Logo and logo variations\nTypography and colour palette\nIcons, patterns and image style" },
      { title: "Brand in use", text: "We apply the identity to stationery, marketing material, digital products, social media and packaging, so you can see the brand at work before launch.", points: "Stationery and collateral\nWebsite, app and social media\nPackaging and product branding" },
      { title: "Guidelines and handover", text: "We write the brand book and hand over every approved file, specification and template, ready for your team and printers.", points: "Brand guidelines document\nEditable templates\nOrganised source assets" },
      { title: "Launch and rollout", text: "We plan the launch, create the announcement material and help your team adopt the brand, wherever they work.", points: "Launch strategy and creatives\nSocial media launch kit\nBrand consistency review" },
    ],
  },
  tools: { heading: "What We Use\nTo Build Brands", items: "Brand workshops\nMarket research\nCompetitor analysis\nCustomer personas\nAdobe Illustrator\nAdobe Photoshop\nAdobe InDesign\nFigma\nMiro" },
  why: {
    heading: "Why Choose We3vision\nFor Brand Development",
    items: [
      { title: "A complete service, not only a logo", description: "Brand strategy, naming, identity, design, communication, guidelines and launch, all with one team in Surat." },
      { title: "Made for products that launch", description: "We know how to brand a website, an app or a software product so that it is ready to be launched in the market, in India or abroad." },
      { title: "One clear process", description: "Clear stages of work with clear deliverables, so you always know what you receive and what comes next." },
      { title: "Every industry", description: "From startups and SaaS to real estate, healthcare, hospitality, retail and luxury, for local and global markets." },
      { title: "A brand your team can use", description: "A brand book, templates and organised files, so every future design stays consistent, even when your team grows." },
      { title: "Design and development together", description: "The same company designs the brand and builds the website, app or software that carries it, so nothing gets lost in hand-offs." },
    ],
  },
  industries: {
    heading: "Brand Development\nFor Every Industry",
    intro: "Every industry needs a different kind of brand. Here is where we build them, in India and abroad.",
    items: [
      { name: "Startups", description: "Startup branding: a clear name, identity and launch plan before the first customer arrives." },
      { name: "Technology and SaaS", description: "Branding for software products, apps, dashboards and platforms, from brand identity to product design system, in one consistent look." },
      { name: "E-commerce", description: "Brand identity, packaging and store branding for online sellers who want to become a brand." },
      { name: "Real estate", description: "Project and developer branding, brochures, hoardings and sales office identity." },
      { name: "Hospitality and restaurants", description: "Brands with personality: logo, menu, packaging, signage and social media." },
      { name: "Healthcare and pharma", description: "Calm, trustworthy identities and packaging that follow the needs of the sector." },
      { name: "Luxury", description: "Refined brands with careful typography, materials and presentation." },
      { name: "Franchise and retail", description: "Identity systems that stay consistent in every store and every city." },
    ],
  },
  faq: [
    { question: "What is brand development?", answer: "Brand development is the complete process of building a brand, from research and brand strategy to naming, story, visual identity, guidelines and launch. It is much more than logo design, because it decides how your business looks, sounds and is remembered." },
    { question: "What is the difference between brand development and brand identity design?", answer: "Brand identity design is one part of brand development: the logo, colours, typography and visual style. Brand development also covers the strategy, positioning, name, brand story and voice behind them, plus the guidelines and the launch." },
    { question: "What is included in brand development services?", answer: "A project can include brand research and strategy, name and tagline, logo and logo variations, typography and colours, stationery, social media templates, packaging, website or app branding, brand guidelines and a launch kit. You can also take a single part, such as brand strategy or a brand launch, and the deliverables and revisions are written in the project scope." },
    { question: "How does the brand development process work?", answer: "It runs in clear stages: strategy and research, name and verbal identity, visual identity, brand in use, guidelines and handover, then launch. You review the work at each stage, so you always know what comes next." },
    { question: "How much does brand development cost?", answer: "The cost depends on how much of the brand you need, such as strategy only, a visual identity, or the full brand with packaging and launch. Tell us your goals and we send a written quote with the scope, deliverables and revisions agreed up front." },
    { question: "How long does brand development take?", answer: "It depends on the size of the project and how quickly feedback comes in, because a full brand takes longer than a logo and style guide alone. We agree the stages and dates in the project plan before we start." },
    { question: "Is brand development only for startups, or also for existing brands?", answer: "It suits both. Startups get a name, identity and launch plan before the first customer arrives, and existing businesses use it to refresh the logo, identity, messaging, packaging, website and guidelines. It also fits any company launching a website, app or software product as a brand." },
    { question: "Can you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, we work with clients in the USA, UK, Canada and Australia remotely from Surat, India. We use clear written communication, regular reviews and a project plan agreed up front, and we have worked with clients from these countries since 2019." },
    { question: "How does a remote brand development project work?", answer: "Everything runs online: discovery calls, workshops, shared files, design reviews and feedback rounds. You receive organised files and a brand book at the end, so your team can use the brand anywhere." },
    { question: "Why hire a brand development agency in Surat, India?", answer: "A brand development agency in Surat, India, gives you strategy, design and development under one company, with clear communication and a plan agreed up front. You can hire branding experts from India for the whole brand, not only a logo." },
    { question: "Do you also build the website or app for my brand?", answer: "Yes. We3vision is a design and development company, so we can brand your product and also build the website, mobile app or software that carries the brand." },
  ],
  related: related("brandkit", "brand", "zero"),
  cta: { heading: "Ready To Launch\nYour Brand?", text: "Tell us about your business and plan. We are a brand development agency in Surat, India, working remotely with clients in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Brand Kit Design (/brand-kit-design)
// ---------------------------------------------------------------------------------------------------------------------
export const BRANDKIT_SEO = {
  title: "Brand Kit Design Company in Surat, India | We3vision",
  description: "Brand kit design company in Surat, India: logo and colour palette, brand style guide and templates for USA, UK, Canada and Australia clients. Get a quote.",
};
export const BRANDKIT_SECTIONS = build({
  seo: BRANDKIT_SEO,
  hero: {
    chip: "Brand Kit",
    heading: "Brand Kit\nDesign Services",
    text: "Your logo, colours, fonts and templates in one brand kit, designed by a brand kit design company in Surat, Gujarat, India for businesses in India, the USA, UK, Canada and Australia. Your brand looks the same everywhere.",
  },
  story:
    "A *brand kit design company in Surat* gives you one place for your whole brand. Without a brand kit, a business looks different on every post, brochure and signboard. A *brand kit puts everything in one place*: logo versions, colour palette, fonts, icon style, photo style and ready-made templates.\n\nWe are a *brand kit design company in Surat, Gujarat, India*, founded in 2019. We design the kit, test it on real examples such as a post, a visiting card and a signboard, and hand it over with a simple *brand style guide* so your brand stays consistent as you grow.\n\nWe also provide *brand kit design services for clients in the USA, UK, Canada and Australia*, working remotely with clear communication and a plan agreed up front.",
  services: {
    heading: "What Is Inside\nYour Brand Kit",
    intro: "Every kit is made for your brand, but most contain the following parts.",
    cards: [
      { title: "Logo suite", description: "Your main logo and the versions you need: horizontal, stacked, icon only, light and dark, with clear space and minimum-size rules, so it works everywhere." },
      { title: "Colour palette", description: "Main and supporting colours with codes for screen and print, and notes on how to use them with your logo and colour palette." },
      { title: "Typography", description: "A heading and body font pair, sizes and spacing, chosen for readability on screen and in print, so your text looks the same on every page." },
      { title: "Graphic elements\nand icons", description: "Patterns, shapes, icons and illustration style that make your brand recognisable at a glance, from a post to a signboard." },
      { title: "Photo and image\nstyle", description: "Guidance for the look of photos and graphics, so new images always match your brand, whoever creates them." },
      { title: "Social media\ntemplates", description: "Editable post, story and cover social media templates, so your team can publish quickly and stay on brand." },
      { title: "Stationery and\ndocuments", description: "Visiting card, letterhead, envelope, invoice, presentation and email signature templates, ready for your team to use." },
      { title: "Brand guidelines", description: "A short, clear brand style guide that explains how to use every part of the kit, with do and don't examples." },
    ],
  },
  process: {
    heading: "How We Create\nYour Brand Kit",
    intro: "A short, clear process with feedback at every stage, also online.",
    items: [
      { title: "Brief and review", text: "We understand your brand, your audience and how you will use the kit, and review any existing material.", points: "Brand questions\nExisting material review" },
      { title: "Design the core", text: "We design or refine the logo, colours and typography and show you the options for your feedback.", points: "Logo and colours\nTypography" },
      { title: "Build the kit", text: "We add icons, patterns, templates and examples on real uses, such as posts and cards.", points: "Templates\nReal-life mock-ups" },
      { title: "Guidelines and hand-over", text: "We write the brand style guide and give you all files in the formats you need for print and screen.", points: "Brand guidelines\nFiles for print and screen" },
    ],
  },
  tools: { heading: "Tools We\nUse", items: "Adobe Illustrator\nAdobe Photoshop\nAdobe InDesign\nFigma\nCanva\nAdobe After Effects" },
  why: {
    heading: "Why Choose We3vision\nFor Your Brand Kit",
    items: [
      { title: "Everything in one place", description: "No more searching for the latest logo or the right colour code. Everything sits in one kit." },
      { title: "Easy for your team", description: "Editable templates mean your team can make on-brand posts and documents without a designer each time." },
      { title: "Ready for print and screen", description: "Files and colour values prepared for both websites and printers, in India or abroad." },
      { title: "Tested on real examples", description: "We show the kit on real uses, like a post or a card, before you approve it." },
      { title: "Consistent everywhere", description: "The same look on your website, social media, packaging and signboards, in every country you sell to." },
      { title: "Grows with you", description: "A clear structure that is easy to extend when you add new products or services." },
    ],
  },
  faq: [
    { question: "What is a brand kit?", answer: "A brand kit, also called a brand identity kit, is a set of files that holds your logo versions, colours, fonts, graphic style and templates. It also includes guidelines on how to use them, so everyone creates on-brand work." },
    { question: "What is included in a brand kit?", answer: "A brand kit usually includes a logo suite, colour palette, typography, icons and graphic elements, photo style, social media templates, stationery templates and brand guidelines. We shape the kit around what your business needs." },
    { question: "Brand kit vs logo vs brand guidelines: what is the difference?", answer: "A logo is one part, brand guidelines are the rules, and a brand kit contains both plus the files and templates. In short, the kit is the full toolbox and the guidelines explain how to use it." },
    { question: "Who needs a brand kit design?", answer: "Any business that publishes on social media, prints material or works with more than one person needs one. It helps startups, shops, manufacturers and service companies look the same everywhere." },
    { question: "Do you design brand kits for clients in the USA, UK, Canada and Australia?", answer: "Yes. We work remotely from Surat, India, with clear communication, feedback at every stage and a project plan agreed up front. You can hire brand designers from India without a visit." },
    { question: "Can you make a kit if I already have a logo?", answer: "Yes. We can build the rest of the kit around your existing logo, and improve the logo files if they need cleaning up." },
    { question: "How much does a brand kit cost?", answer: "The cost depends on what the kit includes, so we give a quote after we understand your brand. Send us your logo or idea and we will reply with a clear plan." },
    { question: "How long does a brand kit take?", answer: "The time depends on how much the kit includes. We agree on the stages and dates at the start, and you give feedback at every stage." },
    { question: "What file formats do I get?", answer: "You receive files for print and screen, such as vector files, PNG and PDF, along with editable templates." },
    { question: "Why choose a brand kit design company in Surat, India?", answer: "A Surat-based team gives you a full brand kit with clear communication, working with clients since 2019. We also offer brand development if you need a complete brand, not only a kit." },
  ],
  related: related("branddev", "brand", "graphics"),
  cta: { heading: "Ready For A Brand\nThat Looks The Same Everywhere?", text: "Send us your logo or idea for a brand kit. We work with clients in India, the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Brand Video Production (/brand-video-production)
// ---------------------------------------------------------------------------------------------------------------------
export const BRANDVIDEO_SEO = {
  title: "Brand Video Production Company in Surat, India | We3vision",
  description: "Brand video production company in Surat, India: brand films, corporate and product videos, ad films and reels for USA, UK, Canada, Australia clients.",
};
export const BRANDVIDEO_SECTIONS = build({
  seo: BRANDVIDEO_SEO,
  hero: {
    chip: "Brand Video",
    heading: "Brand Video\nProduction",
    text: "We plan, script, shoot and edit brand videos from Surat, Gujarat, India: brand films, corporate and product videos, ad films and influencer-based shoots for clients in India, the USA, UK, Canada and Australia.",
  },
  story:
    "A *brand video production company in Surat, Gujarat, India* helps people understand and *trust a brand* on screen. A good video needs more than a camera: a *clear idea, a script, the right people, careful shooting and sharp editing*.\n\nWe3vision, founded in 2019, handles the whole job as a video production company in India. You tell us about your brand and goal; we take care of *planning, shooting and editing* for brand films, corporate videos, product videos, ad films and reels, and arrange *influencer-based videos* when your brand needs a human face and wider reach.\n\nClients in the USA, UK, Canada and Australia can hire video producers from India: we plan, script and edit remotely, and agree any shooting arrangements in the plan.",
  services: {
    heading: "Our Brand Video\nServices",
    intro: "One team for the whole video, from first idea to final cut and delivery.",
    cards: [
      { title: "Brand films", description: "A brand film tells who you are and why you do what you do, shaped for your website, social media, presentations and company profile video needs." },
      { title: "Product and\nservice videos", description: "Clear product videos that show what your product or service does and how it helps, made to build confidence before a purchase." },
      { title: "Influencer-based\nvideos", description: "We find and brief suitable influencers, plan the shoot with them and deliver influencer marketing videos that look natural and fit your brand." },
      { title: "Reels and short\nvideos", description: "Vertical short videos and reels for Instagram, YouTube Shorts and Facebook, planned to earn attention quickly." },
      { title: "Corporate and\nfactory shoots", description: "Corporate video production: company profile videos, factory and showroom walk-throughs and event coverage." },
      { title: "Ad films and\ncampaign videos", description: "Ad film production for launches, offers and festivals: short promotional films cut in the right sizes for each platform." },
      { title: "Editing and\npost-production", description: "Video editing services: cutting, colour correction, sound, music, titles, subtitles and simple motion graphics." },
      { title: "Planning and\nscripting", description: "Concept, script, storyboard, shot list and shoot plan, so the shoot day is smooth and on budget, and clients abroad can approve it remotely." },
    ],
  },
  process: {
    heading: "From Planning\nTo Final Edit",
    intro: "We run the full process, so you do not have to manage a crew, a studio and an editor separately, wherever you are.",
    items: [
      { title: "Idea and planning", text: "We understand your brand, goal and audience, and plan the concept, budget and schedule, shared with you in writing.", points: "Goal and audience\nConcept and timeline" },
      { title: "Script and storyboard", text: "We write the script and draw the storyboard, so you can see and approve the video before we shoot it.", points: "Script\nStoryboard and shot list" },
      { title: "Casting and preparation", text: "We prepare locations, props, equipment and people, and agree where the shoot happens. For influencer videos, we choose and brief the right creators.", points: "Locations and props\nInfluencer selection" },
      { title: "Shooting", text: "Our crew shoots the video with the right camera, light and sound, following the agreed plan.", points: "Professional equipment\nDirection on set" },
      { title: "Editing and finishing", text: "We edit, add sound, music, titles and effects and prepare versions for each platform, sharing drafts for review.", points: "Editing and colour\nSound, subtitles and formats" },
      { title: "Delivery", text: "You receive the final videos in the sizes and formats you need, ready to publish, after the review rounds you agreed.", points: "Platform-ready files\nRevisions included as agreed" },
    ],
  },
  tools: { heading: "Tools And\nEquipment", items: "Adobe Premiere Pro\nAdobe After Effects\nDaVinci Resolve\nCinema cameras\nLighting kits\nAudio recording\nDrones" },
  why: {
    heading: "Why Choose We3vision\nFor Brand Video",
    items: [
      { title: "Planning to editing, one team", description: "No handovers between planners, camera people and editors. One team stays responsible for the result, from script to final edit." },
      { title: "Influencer experience", description: "We run influencer-based shoots and know how to brief creators so influencer marketing videos stay on brand." },
      { title: "Designed for platforms", description: "Videos cut in the right sizes and lengths for Instagram, YouTube, Facebook, your website and ad campaigns." },
      { title: "Brand-first", description: "Our brand design and kit teams are in the same company, so your videos match your logo, colours and voice in every video." },
      { title: "Clear schedule", description: "You know what happens on which day, and when to expect each version, which helps clients planning from abroad." },
      { title: "Ready to publish", description: "Finished videos with subtitles, music and platform sizes, not raw footage, ready for your channels." },
    ],
  },
  industries: {
    heading: "Brand Videos\nFor Every Business",
    intro: "Every business has a story that looks good on video. Some examples of where brand videos help.",
    items: [
      { name: "Fashion and lifestyle", description: "Look-book videos, reels and influencer shoots for collections and campaigns, including for overseas buyers." },
      { name: "Jewellery and luxury", description: "Close-up product films that show detail, craft and finish." },
      { name: "Food and restaurants", description: "Menu, kitchen and ambience videos that make people hungry and curious." },
      { name: "Manufacturing", description: "Factory and process videos that build trust with buyers and distributors in India and abroad." },
      { name: "Real estate", description: "Project films, site walk-throughs and drone views." },
      { name: "Education and events", description: "Campus videos, course promotions and event highlights." },
    ],
  },
  faq: [
    { question: "What is a brand video?", answer: "A brand video is a video that shows who your business is, what you offer and why people can trust you. It can be a brand film, company profile video, product video, ad film or a short reel. We plan, script, shoot and edit it so it is ready to publish." },
    { question: "Which types of videos do you make?", answer: "We make brand films, corporate and company profile videos, product and service videos, ad films, reels and influencer-based videos. We also offer video editing services for your own footage. Tell us your goal and we suggest the right type." },
    { question: "What is the video production process?", answer: "It runs in six steps: idea and planning, script and storyboard, casting and preparation, shooting, editing and delivery. You review the plan, the script and the edits along the way. Revisions are included as agreed." },
    { question: "Do you make videos for clients in the USA, UK, Canada and Australia?", answer: "Yes, we work with clients in the USA, UK, Canada and Australia from Surat, India. We plan, script and edit remotely with a project plan agreed up front. If a shoot is needed, the location and how it is handled are agreed in the plan." },
    { question: "Can I hire video producers from India and work remotely?", answer: "Yes, remote work is how many of our clients abroad work with us. Briefs, scripts, storyboards and edits are shared online for your review. You see the plan and each draft before the final video is delivered." },
    { question: "Do you make influencer marketing videos?", answer: "Yes, we arrange and brief suitable influencers, plan the shoot together and edit the final content. This is useful when your brand needs a human face and a wider reach. The content is edited to fit your brand." },
    { question: "How much does a brand video cost?", answer: "The cost depends on the type of video, its length, the shoot and the editing needed. We share a clear quote after you tell us your goal and idea. Use the free quote button and we will plan it with you." },
    { question: "How long does a brand video take?", answer: "It depends on the length, the shoot and the review rounds. A short reel is quicker than a brand film. We share a schedule before we begin, so you know when to expect each version." },
    { question: "Where do you shoot?", answer: "Shoot locations are agreed in the plan. Depending on the video, that can be your premises, a studio or a chosen outdoor location. We are based in Surat, India." },
    { question: "Why choose a video production company in Surat, India?", answer: "A video production company in Surat, India gives you planning, shooting and editing from one team, with remote communication for overseas clients. We3vision was founded in 2019 and has worked with clients from the USA, Canada, the UK, Germany, UAE, Singapore and Australia. We also deliver videos in the sizes needed for Instagram, YouTube and Facebook." },
  ],
  related: related("brand", "animation", "meta"),
  cta: { heading: "Ready To Put\nYour Brand On Video?", text: "Tell us about your brand and the video you imagine, and we will plan it with you. We work with clients in Surat, across India and in the USA, UK, Canada and Australia.", button: "Get a free quote" },
});

// ---------------------------------------------------------------------------------------------------------------------
// End-to-End Brand Development, was "0 to N" (/zero-to-n-brand-development, the route stays)
// ---------------------------------------------------------------------------------------------------------------------
export const ZERO_SEO = {
  title: "End-to-End Brand Development Surat, India | We3vision",
  description: "End-to-end brand development in Surat, India: strategy, logo, packaging, website and launch for brands in India, the USA, UK, Canada and Australia.",
};
export const ZERO_SECTIONS = build({
  seo: ZERO_SEO,
  hero: {
    chip: "End-to-End Brand Development",
    heading: "From Zero to a\nBrand That Leads.",
    text: "We are an end-to-end brand development company in Surat, Gujarat, India. We offer complete branding services for brand building from scratch: strategy, naming, identity, packaging, website, brand film and launch, for clients in India, the USA, UK, Canada and Australia.",
  },
  story:
    "*End-to-end brand development in Surat* means one team builds your whole brand, from the first idea to the launch. Starting a brand usually means finding a strategist, a designer, a printer, a photographer, a website developer and a marketer, and then making them work together. *We do all of it as one team, from the starting phase to the end*.\n\nYou bring the idea, the product or the service. We take care of *planning, design, printing and execution*. We have built brands for *many different industries*, so whatever you sell, we know how to make it look and feel like a real brand.\n\nWe are based in Surat, Gujarat, India, and also work with *brand owners in the USA, UK, Canada and Australia*, remotely, with a plan agreed up front and clear updates at every stage.",
  services: {
    heading: "Everything Your\nBrand Needs",
    intro: "N is whatever your brand needs. These are the parts we usually build, all under one plan.",
    cards: [
      { title: "Brand strategy\nand planning", description: "Purpose, positioning, audience and a clear plan for what your brand should become, before any design starts." },
      { title: "Name, logo and\nidentity", description: "A name, tagline and logo with a complete visual identity that suits your market, in India or abroad." },
      { title: "Brand kit and\nguidelines", description: "Colours, fonts, templates and rules, so every future design stays consistent across print and online." },
      { title: "Packaging and\nlabels", description: "Boxes, pouches, bottles and labels designed to stand out on the shelf and online." },
      { title: "Printing and\nstationery", description: "Visiting cards, brochures, catalogues, bags, uniforms and more, designed and printed for you." },
      { title: "Website and\nonline presence", description: "A website, social media profiles and online listings that match your brand and are built with SEO basics." },
      { title: "Photos and\nbrand video", description: "Product photography and brand video that give your brand real content from the first day." },
      { title: "Launch and\nmarketing", description: "A brand launch plan with social media, digital marketing and on-ground activity to introduce your brand to buyers." },
    ],
  },
  process: {
    heading: "From Zero\nTo Launch",
    intro: "A single, connected journey from idea to launch. You always know the next step.",
    items: [
      { title: "Idea and discovery", text: "We understand your idea, your customers and your market, and decide where your brand should stand among competitors.", points: "Idea and goals\nMarket and audience" },
      { title: "Strategy and name", text: "We define the brand, its promise and its voice, and create the name and tagline.", points: "Positioning\nName and tagline" },
      { title: "Design and identity", text: "We design the logo, colours, typography and the full brand kit.", points: "Logo and identity\nBrand kit" },
      { title: "Products and print", text: "We design and prepare packaging, labels and printed material and supervise printing.", points: "Packaging and labels\nPrint production" },
      { title: "Online presence", text: "We build the website and social media profiles and prepare photos and videos.", points: "Website and social media\nPhoto and video content" },
      { title: "Launch and execution", text: "We plan and run the brand launch and stay with you for the first steps, with updates by call or e-mail.", points: "Launch plan\nMarketing in action" },
    ],
  },
  tools: { heading: "Services Inside\nEnd-To-End Branding", items: "Brand strategy\nLogo design\nBrand kit\nPackaging design\nPrint design\nWebsite development\nBrand video\nSocial media\nMarketing" },
  why: {
    heading: "Why Choose We3vision\nFor End-To-End Branding",
    items: [
      { title: "One team, one brand", description: "Strategy, design, print, website, video and marketing are all done by one team, so identity, website and marketing fit together." },
      { title: "Nothing left for you to arrange", description: "You do not need to find designers, printers or developers. We take care of it, from Surat, for clients near or far." },
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
    { question: "What is end-to-end brand development?", answer: "End-to-end brand development is one team building your whole brand, from the first idea to the launch. It joins strategy, name, logo, brand kit, packaging, print, website, photos and video, and marketing in one connected plan. That way every part looks and sounds like the same brand." },
    { question: "What does end-to-end branding in Surat include?", answer: "It includes brand strategy and planning, name, logo and identity, brand kit and guidelines, packaging and labels, printing and stationery, website and online presence, photos and brand video, and launch and marketing. The exact parts depend on the scope agreed in your proposal. You can start with the stages you need most." },
    { question: "Who is a full branding services package for?", answer: "It suits founders, startups and growing businesses that want to build a brand from scratch, and owners who want to rebrand an existing business. It also fits companies that prefer one team instead of managing a designer, a printer and a developer. We have built brands for many industries, from food and fashion to manufacturing and education." },
    { question: "How is it different from a logo or brand identity only?", answer: "A logo or brand identity covers how your brand looks, while end-to-end brand development also covers strategy, packaging, print, website and launch. The result is a brand that is ready to be used and introduced to buyers, not only a set of design files. If you only need part of it, you can commission single services such as Brand Design, Brand Kit Design or Brand Video." },
    { question: "How does the brand building process work?", answer: "We work in six clear stages: idea and discovery, strategy and name, design and identity, products and print, online presence, and launch and execution. Each stage has a clear outcome that you review and approve before we move on. You always know the next step." },
    { question: "How much do your branding services cost?", answer: "The cost depends on the scope, the number of deliverables, the complexity and the timeline. A startup branding package with a few stages costs differently from a full launch with packaging, website and video. Contact our team and we will prepare a proposal that fits your goals." },
    { question: "How long does a full brand launch take?", answer: "The time depends on the stages you choose and how quickly feedback and approvals come in. We agree on the timeline for each stage in the project plan before work starts. Starting with strategy and identity and adding other stages later is also possible." },
    { question: "What will I receive at the end?", answer: "You receive the deliverables listed in your proposal, such as the logo, brand kit and guidelines, packaging, print and online material that were part of the scope. Deliverable formats, editable files and source assets are specified in the project proposal. Nothing is left unclear at hand-over." },
    { question: "Can you do end-to-end branding for USA, UK, Canada and Australia clients?", answer: "Yes. We deliver remotely from Surat, India, with clear communication, regular updates and a project plan and scope agreed up front. Printing and production abroad depend on the agreed scope. We have worked with clients from the USA, Canada, the UK, Germany, UAE, Singapore and Australia." },
    { question: "Why hire a branding agency from India like We3vision?", answer: "A branding company in India like We3vision gives you strategy, design, print, website, video and marketing from one team, with remote communication for overseas clients. We3vision Private Limited was founded in 2019 in Surat, Gujarat, and also has a second office in Marburg, Germany. We can also rebrand an existing business and assess your current identity first." },
  ],
  related: related("branddev", "brandkit", "brandvideo"),
  cta: { heading: "Start Your\nBrand Journey", text: "Tell us your goals. We work with clients in Surat, India, the USA, UK, Canada and Australia.", button: "Let's Build Your Brand" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Meta Marketing (/meta-marketing-services)
// ---------------------------------------------------------------------------------------------------------------------
export const META_SEO = {
  title: "Meta Marketing Agency in Surat | Facebook & Instagram Ads",
  description: "Meta marketing agency in Surat, India: Facebook ads, Instagram marketing and Meta ads management for clients in the USA, UK, Canada and Australia.",
};
export const META_SECTIONS = build({
  seo: META_SEO,
  hero: {
    chip: "Meta Marketing",
    heading: "Meta Marketing\nServices",
    text: "Reach people who are looking for you on Facebook and Instagram. We are a Meta marketing agency in Surat, India: we plan, design and run your Facebook and Instagram ads for clients in India, the USA, UK, Canada and Australia.",
  },
  story:
    "Meta marketing agency in Surat: we help you use Facebook and Instagram, where *many of your customers spend their time*. Good Meta marketing is not just boosting a post. It is a *clear goal, the right audience, strong creative and careful testing*, so your Facebook ads and Instagram marketing work toward one aim.\n\nAs a *Meta marketing agency in Surat, Gujarat, India*, we handle the whole job for businesses in India and, remotely, in the USA, UK, Canada and Australia: strategy, *ad creative, copy, campaign set-up, optimisation and reporting*. Your brand, ads and videos come from the same team, so everything looks and sounds consistent, and the plan is agreed up front.",
  services: {
    heading: "Our Meta Marketing\nServices",
    intro: "Everything needed to turn Facebook and Instagram into a steady source of customers, from ads to creatives and reports.",
    cards: [
      { title: "Meta ads\nmanagement", description: "Facebook ads and Instagram campaigns set up, tested and improved week after week to reach your goal, with the plan agreed up front." },
      { title: "Lead generation\ncampaigns", description: "Ads with simple forms or click-to-message that bring in enquiries you can follow up quickly; results depend on your offer." },
      { title: "Sales and\ne-commerce ads", description: "Catalogue and product ads for online stores, with retargeting for people who visited but did not buy, at home or overseas." },
      { title: "Brand awareness\ncampaigns", description: "Campaigns that make more of the right people know your name, product or launch on Facebook and Instagram." },
      { title: "Ad creative and\ncopywriting", description: "Social media creatives: images, videos, reels and carousels with clear messages, made by our design and video teams." },
      { title: "Instagram and Facebook\ncontent", description: "Regular posts, stories and reels that keep your page active and on brand between campaigns." },
      { title: "Audience and\nstrategy", description: "A clear plan for who to reach, what to say and how much to spend, including audiences in the USA, UK, Canada and Australia." },
      { title: "Tracking and\nreporting", description: "Pixel and conversion set-up, with simple reports about spend, leads, sales and what to improve, in plain words." },
    ],
  },
  process: {
    heading: "How We Run\nYour Campaigns",
    intro: "A repeatable process that starts with your goal and keeps improving, agreed up front.",
    items: [
      { title: "Goal and audit", text: "We agree on what success means and review your page, offer and past results before any ad is made.", points: "Goals and budget\nPage and offer review" },
      { title: "Strategy and creative", text: "We plan the audience and message and create the ads and creatives.", points: "Audience plan\nImages, videos and copy" },
      { title: "Set-up and launch", text: "We set up tracking and launch campaigns with a few variations to learn quickly, then share first findings.", points: "Pixel and tracking\nTest variations" },
      { title: "Optimise", text: "We watch the numbers, pause what does not work and put more into what does, as results allow.", points: "Weekly review\nBudget and audience changes" },
      { title: "Report", text: "You receive clear reports and a plan for the next step, wherever you are.", points: "Plain-language reports\nNext-step plan" },
    ],
  },
  tools: { heading: "Platforms And\nTools", items: "Facebook Ads\nInstagram Ads\nMeta Business Suite\nMeta Pixel\nConversions API\nGoogle Analytics\nCanva\nAdobe Premiere Pro" },
  why: {
    heading: "Why Choose We3vision\nFor Meta Marketing",
    items: [
      { title: "Creative and ads together", description: "Design, video and ad management in one team, so social media creatives are made for the campaign." },
      { title: "Clear goals", description: "We start with what you want: leads, sales or awareness, and judge the work by that, not by promises." },
      { title: "Plain reports", description: "Simple reports about what you spent, what you got and what happens next, easy to share across countries." },
      { title: "Tested, not guessed", description: "We test different images, texts and audiences and keep what works, as results allow." },
      { title: "Brand-safe", description: "Ads that follow your brand kit, so your page looks professional and consistent on every platform." },
      { title: "Works with your other marketing", description: "Meta campaigns planned together with your SEO, website and offline marketing, for clients in India and abroad." },
    ],
  },
  industries: {
    heading: "Meta Marketing\nFor Every Industry",
    intro: "Different businesses use Facebook and Instagram in different ways, in India and overseas.",
    items: [
      { name: "E-commerce and retail", description: "Product ads, offers and retargeting that bring shoppers back to your store, whether they are local or overseas." },
      { name: "Fashion and jewellery", description: "Visual campaigns and reels that show your collection at its best on Instagram and Facebook." },
      { name: "Restaurants and food", description: "Local ads, offers and event promotion that bring people through the door and keep them coming back." },
      { name: "Education and coaching", description: "Lead campaigns for admissions, courses and workshops, with simple enquiry forms." },
      { name: "Real estate", description: "Lead ads and project promotion to interested buyers in your area, with simple forms." },
      { name: "Services and B2B", description: "Targeted campaigns that bring serious enquiries for professional services from the right decision makers." },
    ],
  },
  faq: [
    { question: "Why hire a Meta marketing agency in Surat, India?", answer: "A Meta marketing agency in Surat, India gives you strategy, creatives, ad management and reports from one team, with remote communication for overseas clients. We3vision Private Limited was founded in 2019 in Surat, Gujarat, and also has a second office in Marburg, Germany." },
    { question: "What is Meta marketing?", answer: "Meta marketing is advertising and promotion on Meta platforms such as Facebook and Instagram. It covers planning the campaign, creating the ads, choosing audiences, running the campaign and measuring what it delivers." },
    { question: "What is the difference between Facebook ads and Instagram ads?", answer: "Both are run through Meta, but the places, formats and audiences differ. Facebook suits posts, forms and catalogue ads, while Instagram leans on visual formats such as reels, stories and carousels. We plan the mix around your goal and audience." },
    { question: "What does your Meta ads management service include?", answer: "It includes strategy, ad creatives and copy, campaign set-up, optimisation and reporting. We can also plan lead campaigns, set up Pixel and Conversions API tracking and review an existing ad account to improve its structure, creative and tracking." },
    { question: "How does the process work?", answer: "We follow five steps: goal and audit, strategy and creative, set-up and launch, optimisation, and reporting. The plan is agreed up front, so you know what happens next." },
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes. We run campaigns remotely from Surat, India, with clear communication, plain reports and a plan agreed up front. We can plan audiences for those countries and work with your brand, offer and goals." },
    { question: "How much does Meta ads management cost?", answer: "Cost depends on your goals, the number of campaigns and the creative needed, so we agree it in a proposal after hearing your needs. Media spend is paid to the platform and our fee is separate, unless a proposal clearly says otherwise." },
    { question: "How long does it take to see results from Meta ads?", answer: "It depends on your offer, audience, budget, creative and competition, so we cannot give a fixed time. We launch with a few variations, review the numbers regularly and improve from there." },
    { question: "How do you report on Facebook and Instagram campaigns?", answer: "We send plain-language reports about spend, leads, sales and what to improve, with a next-step plan. Meta Pixel and Conversions API set-up helps us check the events behind those numbers, following privacy, consent and platform rules." },
    { question: "Do you guarantee leads or sales?", answer: "No. Results depend on the offer, audience, budget, creative, competition and your website, so we do not guarantee leads or sales. We do promise clear goals, careful testing and honest reports." },
  ],
  related: related("seo", "brandvideo", "physical"),
  cta: { heading: "Let's Build Your\nNext Campaign.", text: "Tell us your goal, audience and offer. We work with clients in India, the USA, UK, Canada and Australia and will help you plan the right Meta campaign.", button: "Discuss Your Meta Campaign" },
});

// ---------------------------------------------------------------------------------------------------------------------
// Physical Marketing (/physical-marketing-services)
// ---------------------------------------------------------------------------------------------------------------------
export const PHYSICAL_SEO = {
  title: "Physical Marketing Agency in Surat, India | We3vision",
  description: "Physical marketing agency in Surat, Gujarat, India: print, signage, packaging and branding for clients in the USA, UK, Canada and Australia. Get a quote.",
};
export const PHYSICAL_SECTIONS = build({
  seo: PHYSICAL_SEO,
  hero: {
    chip: "Physical Marketing",
    heading: "Physical Marketing\nServices",
    text: "Be seen in the real world as well as online. A physical marketing agency in Surat, India, we design and deliver print, outdoor and on-ground marketing people remember.",
  },
  story:
    "Not every customer is scrolling on a phone. People walk past a *signboard*, pick up a *brochure*, hold a *package* and visit a *stall*. Physical marketing builds trust in places where screens cannot.\n\nWe are a *physical marketing agency in Surat, Gujarat, India*, designing for businesses in India, the USA, UK, Canada and Australia. We match the material to your digital brand identity, take care of *printing and production*, and help you plan how and where to put it in front of people.",
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
      { title: "Connected with digital", description: "Physical campaigns planned together with Meta marketing, SEO and your website, for clients in India and abroad." },
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
    { question: "Do you work with clients in the USA, UK, Canada and Australia?", answer: "Yes, for design and planning, which we deliver remotely from Surat, India, with clear communication and a plan agreed up front. Printing and installation abroad depend on the agreed scope and local vendors." },
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
