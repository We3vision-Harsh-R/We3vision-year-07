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
            label: "Sub-services: one per line as  Name | short description  (up to 4 are shown)",
            max: 700,
            hint: "Example: Android apps | Native and cross-platform Android apps built for speed on every device.",
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
