import type { Field } from "./fields";

// Every section a page can contain. Adding a new section = add an entry here + a component in
// src/components/site/sections/ + one line in that folder's index.tsx. The admin editor picks it up automatically.
// `defaults` only describe the data shape (and fill in keys that are missing from old saved data);
// the real home page content lives in ./content/home.ts.

function defineSection<D extends Record<string, unknown>>(def: { label: string; description: string; fields: Field[]; defaults: D }) {
  return def;
}

const HIGHLIGHT_HINT = "Tip: put *stars* around words to highlight them.";
const LINES_HINT = "Press Enter to start the second line (the lower line is brighter).";

const chip = (hint?: string): Field => ({ kind: "text", key: "chip", label: "Small label above the heading", max: 40, hint });
const headingField = (label = "Heading"): Field => ({ kind: "textarea", key: "heading", label, max: 120, hint: LINES_HINT });

export const SECTIONS = {
  hero: defineSection({
    label: "Hero scene (ball + service cards)",
    description: "One pinned screen: a glowing ball that breaks into particles while you scroll, then glass cards",
    fields: [
      { kind: "text", key: "title", label: "Page heading (not shown on screen)", max: 160, hint: "Read by Google and screen readers only. Put your brand and main keywords here." },
      { kind: "text", key: "mark", label: "Character inside the glowing ball", max: 3, hint: "Shown in the middle of the ball, e.g. 7" },
      { kind: "text", key: "above", label: "Text above the ball", max: 30, hint: "Made of particles, e.g. Celebrating (leave empty for none)" },
      { kind: "text", key: "below", label: "Text below the ball", max: 30, hint: "Made of particles, e.g. Years of We3vision (leave empty for none)" },
      {
        kind: "list",
        key: "cards",
        label: "Service boxes (a small row at the top; pointing at one opens its sub-services)",
        itemLabel: "Service",
        max: 8,
        fields: [
          { kind: "textarea", key: "title", label: "Name", max: 60, hint: "Press Enter to start a second line inside the small box." },
          { kind: "url", key: "href", label: "Link to the service page (leave empty for no link)" },
          { kind: "textarea", key: "summary", label: "One sentence about the service (shown when it is open)", max: 200, hint: "Plain words with your main keywords, so visitors and Google understand what the service is." },
          {
            kind: "textarea",
            key: "subs",
            label: "Sub-services: one per line as  Name | short description | page link  (up to 4 are shown)",
            max: 1100,
            hint: "The page link is optional. Example: Logo design | A logo that fits your business. | /brand-identity/logo-design",
          },
        ],
      },
    ],
    defaults: { title: "Brand: main keywords", mark: "7", above: "", below: "", cards: [{ title: "Service\nname", href: "", summary: "One sentence about this service.", subs: "Sub-service one | What you get from it\nSub-service two | What you get from it" }] },
  }),
  story: defineSection({
    label: "Story",
    description: "Large paragraph text with highlighted phrases",
    fields: [{ kind: "textarea", key: "body", label: "Text", max: 3000, hint: `${HIGHLIGHT_HINT} Leave an empty line between paragraphs.` }],
    defaults: { body: "Text with *highlighted words*." },
  }),
  brandBoard: defineSection({
    label: "Brand board (text + live brand board)",
    description: "A wide two-column intro: a brand board that lights up tile by tile on the left, a large sentence that fills with light while you scroll and a list of what is included on the right.",
    fields: [
      chip(),
      { kind: "textarea", key: "lead", label: "Large sentence (fills with light while scrolling)", max: 220, hint: HIGHLIGHT_HINT },
      { kind: "textarea", key: "body", label: "Paragraph under it", max: 700, hint: HIGHLIGHT_HINT },
      { kind: "text", key: "listIntro", label: "Words above the list", max: 60, hint: "e.g. Our branding service can include" },
      { kind: "textarea", key: "points", label: "List: one per line as  Name | short description  (the five lines belong to the five boxes of the board)", max: 700, hint: "Example: Logo design | A logo, colours and typography that fit your business." },
      { kind: "text", key: "ctaLabel", label: "Button at the end of the list (leave empty for none)", max: 40 },
      { kind: "url", key: "ctaHref", label: "Button link", hint: "e.g. #contact" },
      { kind: "text", key: "note", label: "Small note next to the button", max: 100, hint: "e.g. depending on what your project needs" },
    ],
    defaults: { chip: "About the service", lead: "A *strong brand* gives your business a consistent look.", body: "Short paragraph.", listIntro: "It can include", points: "Point one | What it is\nPoint two | What it is", ctaLabel: "", ctaHref: "#contact", note: "" },
  }),
  strengths: defineSection({
    label: "Strengths",
    description: "Heading and large cards with an illustration",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      {
        kind: "list",
        key: "items",
        label: "Cards (the first one is shown wide)",
        itemLabel: "Card",
        max: 3,
        fields: [
          { kind: "textarea", key: "title", label: "Title", max: 80, hint: LINES_HINT },
          { kind: "textarea", key: "description", label: "Description", max: 360 },
        ],
      },
    ],
    defaults: { chip: "Strengths", heading: "Heading\nsecond line", intro: "Intro.", items: [{ title: "Title\nsecond line", description: "Description." }] },
  }),
  services: defineSection({
    label: "Services",
    description: "Heading and a grid of service cards",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      { kind: "text", key: "buttonLabel", label: "Button text", max: 30 },
      { kind: "url", key: "buttonHref", label: "Button link" },
      {
        kind: "list",
        key: "cards",
        label: "Cards",
        itemLabel: "Card",
        max: 12,
        fields: [
          { kind: "textarea", key: "title", label: "Title", max: 60, hint: LINES_HINT },
          { kind: "textarea", key: "description", label: "Description", max: 260 },
          { kind: "url", key: "href", label: "Link to the service page (leave empty to hide)" },
        ],
      },
    ],
    defaults: {
      chip: "Services",
      heading: "Heading\nsecond line",
      intro: "Intro.",
      buttonLabel: "Contact Us",
      buttonHref: "#contact",
      cards: [{ title: "Service\nname", description: "Description.", href: "" }],
    },
  }),
  highlights: defineSection({
    label: "Highlights",
    description: "Big numbers with a label",
    fields: [
      chip(),
      {
        kind: "list",
        key: "items",
        label: "Numbers",
        itemLabel: "Number",
        max: 6,
        fields: [
          { kind: "text", key: "value", label: "Number", max: 12 },
          { kind: "text", key: "label", label: "Label", max: 40 },
        ],
      },
    ],
    defaults: { chip: "Highlights", items: [{ value: "10+", label: "Label" }] },
  }),
  industries: defineSection({
    label: "Industries",
    description: "Tabs of industries; picking one shows its description",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      {
        kind: "list",
        key: "items",
        label: "Industries",
        itemLabel: "Industry",
        max: 12,
        fields: [
          { kind: "text", key: "name", label: "Industry", max: 60 },
          { kind: "textarea", key: "description", label: "Description", max: 700 },
        ],
      },
    ],
    defaults: { chip: "Industries", heading: "Heading\nsecond line", intro: "", items: [{ name: "Industry", description: "Description." }] },
  }),
  advantages: defineSection({
    label: "Advantages",
    description: "Heading and a 2-column list of benefits",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      {
        kind: "list",
        key: "items",
        label: "Benefits",
        itemLabel: "Benefit",
        max: 8,
        fields: [
          { kind: "text", key: "title", label: "Title", max: 60 },
          { kind: "textarea", key: "description", label: "Description", max: 260 },
        ],
      },
    ],
    defaults: { chip: "Advantages", heading: "Heading\nsecond line", intro: "", items: [{ title: "Benefit", description: "Description." }] },
  }),
  blogs: defineSection({
    label: "Blog cards",
    description: "Heading with a 'view all' button and blog post cards",
    fields: [
      chip(),
      headingField(),
      { kind: "text", key: "buttonLabel", label: "Button text", max: 30 },
      { kind: "url", key: "buttonHref", label: "Button link" },
      {
        kind: "list",
        key: "items",
        label: "Blog posts",
        itemLabel: "Post",
        max: 6,
        fields: [
          { kind: "text", key: "category", label: "Category label", max: 30 },
          { kind: "text", key: "title", label: "Title", max: 140 },
          { kind: "url", key: "image", label: "Image", hint: "Image path or link, e.g. /images/blog/post.webp" },
          { kind: "url", key: "href", label: "Link" },
        ],
      },
    ],
    defaults: {
      chip: "Blog",
      heading: "Heading\nsecond line",
      buttonLabel: "View all",
      buttonHref: "/blog",
      items: [{ category: "Category", title: "Post title", image: "", href: "/blog" }],
    },
  }),
  reach: defineSection({
    label: "Global reach",
    description: "Card with text and a rotating globe that marks your offices",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "text", label: "Text", max: 360 },
      { kind: "text", key: "buttonLabel", label: "Button text", max: 30 },
      { kind: "url", key: "buttonHref", label: "Button link" },
      {
        kind: "list",
        key: "places",
        label: "Places marked on the globe (first two are joined by a line)",
        itemLabel: "Place",
        max: 6,
        fields: [
          { kind: "text", key: "label", label: "Name", max: 40 },
          { kind: "text", key: "lat", label: "Latitude", max: 10, hint: "e.g. 21.1702 (north is positive)" },
          { kind: "text", key: "lng", label: "Longitude", max: 10, hint: "e.g. 72.8311 (east is positive)" },
        ],
      },
    ],
    defaults: {
      chip: "Global Reach",
      heading: "Heading\nsecond line",
      text: "Text.",
      buttonLabel: "Contact Us",
      buttonHref: "#contact",
      places: [{ label: "Place", lat: "0", lng: "0" }],
    },
  }),
  contact: defineSection({
    label: "Contact form",
    description: "Heading, enquiry form (saved in Leads) and your contact cards",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "text", label: "Text", max: 360 },
      { kind: "text", key: "buttonLabel", label: "Submit button text", max: 30 },
    ],
    defaults: { chip: "Contact", heading: "Let's Get Started!", text: "Text.", buttonLabel: "Send a Message" },
  }),
  flow: defineSection({
    label: "Diagram: tools → AI → actions",
    description: "A circuit-style picture: boxes on top (where your data lives), a glowing core in the middle, boxes below (what it does). Wires draw themselves and light pulses flow.",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 360 },
      { kind: "text", key: "sourcesLabel", label: "Top row title", max: 24, hint: "e.g. Sources" },
      { kind: "text", key: "sourcesNote", label: "Top row note (right side)", max: 30, hint: "e.g. 06 connected" },
      {
        kind: "list",
        key: "sources",
        label: "Top row boxes (6 fit best)",
        itemLabel: "Box",
        max: 6,
        fields: [
          { kind: "text", key: "label", label: "Name", max: 26 },
          { kind: "text", key: "icon", label: "Icon", max: 12, hint: "globe, chat, mail, database, doc, image, users, cart, chart, shield, bolt, bell, gear, calendar, search, spark" },
        ],
      },
      { kind: "text", key: "coreLabel", label: "Core (middle) text", max: 30, hint: "e.g. WE3VISION AI" },
      { kind: "text", key: "actionsLabel", label: "Bottom row title", max: 24, hint: "e.g. Actions" },
      { kind: "text", key: "actionsNote", label: "Bottom row note (right side)", max: 30, hint: "e.g. 06 automations" },
      {
        kind: "list",
        key: "actions",
        label: "Bottom row boxes (6 fit best)",
        itemLabel: "Box",
        max: 6,
        fields: [
          { kind: "text", key: "label", label: "Name", max: 26 },
          { kind: "text", key: "icon", label: "Icon", max: 12, hint: "same names as above" },
        ],
      },
    ],
    defaults: {
      chip: "How it works",
      heading: "From your data\nto real actions",
      intro: "",
      sourcesLabel: "Sources",
      sourcesNote: "06 connected",
      sources: [{ label: "Source", icon: "database" }],
      coreLabel: "AI CORE",
      actionsLabel: "Actions",
      actionsNote: "06 automations",
      actions: [{ label: "Action", icon: "bolt" }],
    },
  }),
  automate: defineSection({
    label: "Switches: by hand → automated",
    description: "A list of problems; each row has a switch that flips by itself when it scrolls into view, and the solution lights up. Visitors can flip the switches too.",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      { kind: "text", key: "beforeLabel", label: "Left column title", max: 30, hint: "e.g. Today: by hand" },
      { kind: "text", key: "afterLabel", label: "Right column title", max: 30, hint: "e.g. With AI" },
      { kind: "text", key: "doneLabel", label: "Word after the counter", max: 20, hint: "e.g. automated" },
      {
        kind: "list",
        key: "items",
        label: "Rows (up to 8)",
        itemLabel: "Row",
        max: 8,
        fields: [
          { kind: "text", key: "icon", label: "Icon", max: 12, hint: "globe, chat, mail, database, doc, image, users, cart, chart, shield, bolt, bell, gear, calendar, search, spark" },
          { kind: "text", key: "problem", label: "The problem (left)", max: 70 },
          { kind: "textarea", key: "solution", label: "What AI does (right)", max: 200 },
        ],
      },
    ],
    defaults: {
      chip: "What AI can automate",
      heading: "Problems AI can\ntake off your plate",
      intro: "",
      beforeLabel: "Today: by hand",
      afterLabel: "With AI",
      doneLabel: "automated",
      items: [{ icon: "bolt", problem: "A slow manual task", solution: "How AI does it for you." }],
    },
  }),
  faq: defineSection({
    label: "Questions & answers",
    description: "Frequently asked questions: one answer open at a time (also helps Google show your answers)",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      {
        kind: "list",
        key: "items",
        label: "Questions",
        itemLabel: "Question",
        max: 12,
        fields: [
          { kind: "text", key: "question", label: "Question", max: 140 },
          { kind: "textarea", key: "answer", label: "Answer", max: 600 },
        ],
      },
    ],
    defaults: { chip: "FAQ", heading: "Questions\nwe often hear", intro: "", items: [{ question: "Question?", answer: "Answer." }] },
  }),
  archGallery: defineSection({
    label: "Project photos: sliding arches",
    description: "A row of tall arch-shaped photos that slides by itself (pauses when pointed at). For photos of your own client work.",
    fields: [
      {
        kind: "list",
        key: "items",
        label: "Photos",
        itemLabel: "Photo",
        max: 40,
        fields: [
          { kind: "url", key: "image", label: "Photo", hint: "Put the file in public/images/projects/ and write /images/projects/name.webp here. Empty = a soft colour placeholder." },
          { kind: "text", key: "title", label: "Project name", max: 60, hint: "Shown when the photo opens on hover." },
          { kind: "text", key: "category", label: "What we did (small label)", max: 40, hint: "e.g. Brand identity" },
          { kind: "textarea", key: "text", label: "Short description (keep it to 1-2 sentences)", max: 140, hint: "Shown under the name when the photo opens; short text reads best." },
        ],
      },
    ],
    defaults: { items: [{ image: "", title: "Project", category: "", text: "" }] },
  }),
  process: defineSection({
    label: "Process steps",
    description: "Numbered steps (01, 02 …), each with a short text and small tags",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      {
        kind: "list",
        key: "items",
        label: "Steps",
        itemLabel: "Step",
        max: 10,
        fields: [
          { kind: "text", key: "title", label: "Title", max: 60 },
          { kind: "textarea", key: "text", label: "Text", max: 300 },
          { kind: "textarea", key: "points", label: "Small tags (one per line, optional)", max: 240 },
        ],
      },
    ],
    defaults: { chip: "Process", heading: "How we\nwork", intro: "", items: [{ title: "Step", text: "What happens in this step.", points: "Tag one\nTag two" }] },
  }),
  tags: defineSection({
    label: "Tools / tags",
    description: "Heading and a cloud of small rounded tags (tools, technologies)",
    fields: [
      chip(),
      headingField(),
      { kind: "textarea", key: "intro", label: "Intro text", max: 300 },
      { kind: "textarea", key: "items", label: "Tags (one per line)", max: 800 },
    ],
    defaults: { chip: "Tools", heading: "Tools we\nuse", intro: "", items: "Tool one\nTool two" },
  }),
  backdrop7: defineSection({
    label: "Background: giant 7W monogram",
    description: "Page background: a very thick glowing 7 that turns into a W through a round junction node. Put it first.",
    fields: [],
    defaults: {},
  }),
  pageHero: defineSection({
    label: "Page hero",
    description: "First screen of an inner page: label, big heading, text and two buttons",
    fields: [
      chip(),
      headingField("Big heading"),
      { kind: "textarea", key: "text", label: "Text", max: 360 },
      { kind: "text", key: "primaryLabel", label: "First button text", max: 30 },
      { kind: "url", key: "primaryHref", label: "First button link" },
      { kind: "text", key: "secondaryLabel", label: "Second button text", max: 30 },
      { kind: "url", key: "secondaryHref", label: "Second button link" },
    ],
    defaults: { chip: "About", heading: "Big heading", text: "Text.", primaryLabel: "Learn more", primaryHref: "#about", secondaryLabel: "Our services", secondaryHref: "#services" },
  }),
  wordHero: defineSection({
    label: "Hero: giant swiping word",
    description: "First screen: one giant heavy word whose letters swipe through the same word in other languages, a tagline, text, two buttons, a live clock and your social links",
    fields: [
      {
        kind: "textarea",
        key: "words",
        label: "The word in different languages (one per line: Language label | Word)",
        max: 500,
        hint: "The first line is the main word (e.g. English · UK | Brand). Every letter swipes to the next line's word, then stands still for 1 second.",
      },
      { kind: "text", key: "heading", label: "Tagline (also the page heading for Google)", max: 160 },
      { kind: "textarea", key: "text", label: "Short text under the tagline", max: 300 },
      { kind: "text", key: "primaryLabel", label: "First button text", max: 30 },
      { kind: "url", key: "primaryHref", label: "First button link" },
      { kind: "text", key: "secondaryLabel", label: "Second button text", max: 30 },
      { kind: "url", key: "secondaryHref", label: "Second button link" },
      { kind: "text", key: "timezone", label: "Clock time zone", max: 40, hint: "e.g. Asia/Kolkata" },
      { kind: "text", key: "clockLabel", label: "Clock label", max: 8, hint: "e.g. IN" },
    ],
    defaults: {
      words: "English · UK | Brand",
      heading: "Tagline",
      text: "",
      primaryLabel: "Learn more",
      primaryHref: "#contact",
      secondaryLabel: "Our services",
      secondaryHref: "#services",
      timezone: "Asia/Kolkata",
      clockLabel: "IN",
    },
  }),
  timeline: defineSection({
    label: "Timeline",
    description: "Year-by-year story with a glowing line down the middle",
    fields: [
      chip(),
      headingField(),
      {
        kind: "list",
        key: "items",
        label: "Milestones",
        itemLabel: "Milestone",
        max: 16,
        fields: [
          { kind: "text", key: "year", label: "Year", max: 12 },
          { kind: "textarea", key: "text", label: "What happened", max: 240 },
        ],
      },
    ],
    defaults: { chip: "Journey", heading: "Heading\nsecond line", items: [{ year: "2019", text: "What happened." }] },
  }),
  team: defineSection({
    label: "Team / leaders",
    description: "People cards with a round initials avatar, name and role",
    fields: [
      chip(),
      headingField(),
      {
        kind: "list",
        key: "members",
        label: "People",
        itemLabel: "Person",
        max: 9,
        fields: [
          { kind: "text", key: "name", label: "Name", max: 60 },
          { kind: "text", key: "role", label: "Role", max: 80 },
        ],
      },
    ],
    defaults: { chip: "Team", heading: "Heading\nsecond line", members: [{ name: "Full Name", role: "Role" }] },
  }),
} as const;

export type SectionType = keyof typeof SECTIONS;
export type SectionData<T extends SectionType> = (typeof SECTIONS)[T]["defaults"];
export const SECTION_TYPES = Object.keys(SECTIONS) as SectionType[];
export const isSectionType = (v: unknown): v is SectionType => typeof v === "string" && Object.hasOwn(SECTIONS, v);
