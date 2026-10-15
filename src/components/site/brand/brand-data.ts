// BRAND DEVELOPMENT: the full service, as the owner described it (12 chapters, 7 service lines, 3 packages). The page reads this file; the text of
// the rest of the page (hero, story, FAQ, ...) comes from the CMS like every other page.

export type Chapter = { n: string; title: string; lead: string; items: string[]; note?: string };

export const CHAPTERS: Chapter[] = [
  {
    n: "01",
    title: "Brand Strategy & Research",
    lead: "The planning and research that comes before a brand is built.",
    items: [
      "Brand Discovery & Consultation", "Business & Industry Research", "Market Research", "Competitor Analysis", "Target Audience Research", "Customer Persona Development",
      "Brand Positioning Strategy", "Unique Selling Proposition (USP)", "Brand Value Proposition", "Brand Mission & Vision", "Brand Purpose & Values", "Brand Personality Definition",
      "Brand Archetype Development", "Brand Differentiation Strategy", "Brand Communication Strategy", "Brand Architecture & Product Naming Structure",
    ],
  },
  {
    n: "02",
    title: "Brand Naming & Verbal Identity",
    lead: "The name, the story and the way the brand speaks.",
    items: [
      "Business Name Ideation", "Brand Name Research", "Product & Service Naming", "Brand Name Shortlisting", "Tagline & Slogan Creation", "Brand Story Development", "Brand Messaging Framework",
      "Brand Voice & Tone Guidelines", "Brand Communication Language", "Elevator Pitch Writing", "Company Introduction & Brand Description", "Mission, Vision & Values Copywriting",
      "Brand Naming Convention", "Domain Name Availability Research", "Social Media Handle Availability Research",
    ],
  },
  {
    n: "03",
    title: "Logo Design & Visual Identity",
    lead: "The logo, the colours, the type and the whole visual language of the brand.",
    items: [
      "Primary Logo Design", "Secondary Logo Design", "Logo Variations", "Icon & Symbol Design", "Wordmark & Lettermark Design", "Monogram Logo Design", "Brand Mark Development",
      "Logo Color Variations", "Black & White Logo", "Horizontal & Vertical Logo", "Responsive Logo Versions", "Favicon & App Icon", "Logo Clear Space Rules", "Logo Minimum Size Guidelines",
      "Logo Usage & Misuse Guidelines", "Typography System", "Primary & Secondary Font Selection", "Brand Color Palette", "Color Codes: HEX, RGB, CMYK, Pantone (where applicable)",
      "Supporting Graphic Elements", "Brand Patterns & Textures", "Illustration Style", "Iconography System", "Photography & Image Style Direction", "Visual Identity System Development",
    ],
  },
  {
    n: "04",
    title: "Corporate Stationery & Business Collateral",
    lead: "Everything printed and presented in the name of the company.",
    items: [
      "Business Card Design", "Letterhead Design", "Envelope Design", "Email Signature Design", "Company ID Card Design", "Employee Visiting Card", "Invoice & Quotation Template",
      "Proposal Template", "Company Profile Design", "Corporate Presentation Template", "Document Cover Design", "Folder & File Design", "Certificate Design", "Office Signage Design",
      "Reception Branding", "Office Wall Graphics", "Corporate Merchandise Design", "Notebook, Pen & Diary Branding", "Employee Welcome Kit Design",
    ],
  },
  {
    n: "05",
    title: "Marketing & Advertising Design",
    lead: "The material that introduces the brand to customers.",
    items: [
      "Brochure Design", "Flyer Design", "Poster Design", "Leaflet Design", "Company Catalogue Design", "Product Catalogue Design", "Sales Presentation Design", "Pitch Deck Design",
      "Digital Advertisement Creatives", "Print Advertisement Design", "Billboard & Hoarding Design", "Exhibition & Trade Show Graphics", "Event Branding", "Promotional Merchandise",
      "Campaign Visual Development", "Marketing Collateral Design", "Infographic Design", "Sales Collateral Design", "Lead Magnet & Downloadable PDF Design",
    ],
  },
  {
    n: "06",
    title: "Digital Brand Identity",
    lead: "How the brand looks on a website, in an app and on every screen.",
    items: [
      "Website Brand Identity", "Website UI/UX Design", "Landing Page Design", "Mobile App Brand Identity", "Web Application Visual Identity", "SaaS Product Branding", "Dashboard Design System",
      "Social Media Profile Branding", "Social Media Post Templates", "Instagram Story Templates", "LinkedIn Post Templates", "YouTube Channel Branding", "YouTube Thumbnail Templates",
      "Email Newsletter Templates", "Digital Ad Templates", "Presentation & Pitch Deck Templates", "Digital Asset Design System", "Online Brand Consistency Guidelines",
    ],
  },
  {
    n: "07",
    title: "Social Media Branding",
    lead: "How the brand looks and sounds on every social platform.",
    items: [
      "Social Media Brand Strategy", "Profile Picture & Cover Design", "Social Media Visual Guidelines", "Post Template System", "Story & Reel Cover Design", "Highlight Cover Design",
      "Branded Content Templates", "Campaign Creative Design", "Social Media Brand Voice", "Hashtag & Messaging Guidelines", "Social Media Content Direction", "Platform-Specific Brand Adaptation",
    ],
    note: "Social media management, daily posting, content calendars and community management can be offered as a separate service.",
  },
  {
    n: "08",
    title: "Packaging & Product Branding",
    lead: "The identity of a product, from the name to the box on the shelf.",
    items: [
      "Product Brand Strategy", "Product Name Development", "Packaging Concept Development", "Product Box Design", "Label Design", "Bottle & Jar Packaging", "Pouch & Wrapper Design",
      "Food & Beverage Packaging", "Cosmetic & Skincare Packaging", "Pharmaceutical Packaging", "Retail Packaging", "Shipping Box Design", "Shopping Bag Design",
      "Packaging Typography & Color System", "Packaging Information Layout", "Packaging Mockups", "Print-Ready Packaging Artwork", "Packaging Design Guidelines",
    ],
  },
  {
    n: "09",
    title: "Brand Guidelines & Design System",
    lead: "The brand book and everything your team needs to use the brand correctly.",
    items: [
      "Brand Guidelines Document", "Logo Usage Guidelines", "Brand Color Guidelines", "Typography Guidelines", "Layout & Grid System", "Brand Voice Guidelines", "Photography Guidelines",
      "Illustration & Icon Guidelines", "Stationery Usage Guidelines", "Social Media Design Guidelines", "Website Branding Guidelines", "Marketing Collateral Guidelines", "Packaging Guidelines",
      "Co-Branding Guidelines", "Brand Asset Organization", "Brand Asset Handover", "Editable Design Templates", "Brand Consistency Checklist",
    ],
    note: "Deliverables: a PDF brand book, approved logo files, typography and colour specifications, reusable templates and organised source assets, as agreed in the project scope.",
  },
  {
    n: "10",
    title: "Brand Launch & Brand Rollout",
    lead: "Introducing the new brand to the world and to your own team.",
    items: [
      "Brand Launch Strategy", "Brand Announcement Creatives", "Brand Reveal Campaign", "Website Brand Launch", "Social Media Launch Kit", "Internal Brand Launch Materials", "Employee Brand Introduction",
      "Brand Presentation", "Launch Campaign Visuals", "Marketing Asset Rollout", "Brand Adoption Guidelines", "Brand Consistency Review",
    ],
  },
  {
    n: "11",
    title: "Brand Refresh & Rebranding",
    lead: "Giving an existing brand a new life.",
    items: [
      "Existing Brand Audit", "Logo Modernization", "Visual Identity Refresh", "Brand Positioning Update", "Brand Messaging Refresh", "Color Palette Update", "Typography Modernization",
      "Packaging Redesign", "Website Branding Update", "Social Media Identity Update", "Brand Guidelines Revision", "Brand Migration Planning", "Rebranding Launch Campaign",
    ],
  },
  {
    n: "12",
    title: "Advanced & Specialized Branding",
    lead: "Specialised branding that goes well beyond a regular graphic design studio.",
    items: [
      "Employer Branding", "Personal Branding", "Founder & Executive Branding", "Corporate Branding", "Startup Branding", "Luxury Brand Development", "Real Estate Branding",
      "Hospitality & Restaurant Branding", "Healthcare & Pharma Branding", "Technology & SaaS Branding", "E-commerce Brand Development", "Product Brand Architecture", "Sub-Brand Development",
      "Franchise Branding", "Retail Store Branding", "Event & Exhibition Branding", "Metaverse & Virtual Brand Identity", "AR/VR Experience Branding", "3D Logo & Brand Animation",
      "Motion Branding", "Brand Mascot Design", "Brand Character Development", "Sonic Branding & Audio Identity", "AI-Assisted Brand Asset Creation",
    ],
  },
];

export const LINES: { n: string; title: string; text: string; chapters: string }[] = [
  { n: "01", title: "Brand Strategy & Research", text: "Research, positioning, audience, naming and messaging.", chapters: "Chapters 01 · 02" },
  { n: "02", title: "Visual Identity & Logo Design", text: "Logo systems, typography, colours, graphic language and visual assets.", chapters: "Chapter 03" },
  { n: "03", title: "Corporate Identity & Collateral", text: "Stationery, company profiles, brochures, presentations and office branding.", chapters: "Chapters 04 · 05" },
  { n: "04", title: "Digital & Social Media Branding", text: "Website identity, app branding, social templates and digital campaigns.", chapters: "Chapters 06 · 07" },
  { n: "05", title: "Packaging & Product Branding", text: "Product identity, labels, packaging systems and retail presentation.", chapters: "Chapter 08" },
  { n: "06", title: "Brand Guidelines & Launch", text: "Brand book, asset handover, launch creatives and rollout planning.", chapters: "Chapters 09 · 10" },
  { n: "07", title: "Rebranding & Advanced Branding", text: "Brand refresh, employer branding, 3D motion identity and immersive branding.", chapters: "Chapters 11 · 12" },
];

export const PACKAGES = ["Starter Brand", "Complete Brand", "Premium Brand"] as const;
export const MATRIX: [string, string, string, string][] = [
  ["Brand discovery", "Basic", "Detailed", "Comprehensive"],
  ["Brand strategy", "Optional", "Included", "Included"],
  ["Logo design system", "Included", "Included", "Included"],
  ["Typography & colors", "Included", "Included", "Included"],
  ["Stationery", "Basic", "Multiple assets", "Extended set"],
  ["Social media templates", "Optional", "Included", "Extended set"],
  ["Brand guidelines", "Basic", "Full PDF", "Comprehensive brand book"],
  ["Packaging design", "Add-on", "As required", "As required"],
  ["Website / app branding", "Add-on", "Optional", "Optional"],
  ["Brand launch kit", "Add-on", "Optional", "Included or scoped"],
  ["Source files & exports", "Agreed files", "Agreed files", "Agreed files"],
];

export const totalItems = () => CHAPTERS.reduce((a, c) => a + c.items.length, 0);
