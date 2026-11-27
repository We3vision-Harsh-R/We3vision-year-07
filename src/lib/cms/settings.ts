import { normalize, type Field } from "./fields";

// Site-wide settings: header menu, footer, contact cards, social links. Edited at /admin/settings.
// Defaults below come from the old site https://www.we3vision.com (same menu, same URLs, so Google rankings carry over).
const linkFields: Field[] = [
  { kind: "text", key: "label", label: "Text", max: 60 },
  { kind: "url", key: "href", label: "Link" },
];

export const SITE_FIELDS: Field[] = [
  { kind: "text", key: "name", label: "Company name", max: 60 },
  { kind: "text", key: "legalName", label: "Legal name (SEO)", max: 100 },
  { kind: "textarea", key: "tagline", label: "Footer welcome text", max: 400 },
  { kind: "list", key: "nav", label: "Floating menu links (bottom of the page)", itemLabel: "Link", max: 7, fields: linkFields },
  { kind: "text", key: "megaTitle", label: "Big menu: heading", max: 120, hint: "The big menu opens from the round button of the floating menu." },
  { kind: "textarea", key: "megaText", label: "Big menu: text under the heading", max: 600 },
  { kind: "text", key: "megaCta", label: "Big menu: button text", max: 40 },
  { kind: "url", key: "megaCtaHref", label: "Big menu: button link" },
  {
    kind: "list",
    key: "badges",
    label: "Big menu: recognitions (Startup India, MSME)",
    itemLabel: "Badge",
    max: 4,
    fields: [
      { kind: "text", key: "label", label: "Name", max: 60 },
      { kind: "image", key: "image", label: "Logo (white on transparent works best)" },
    ],
  },
  {
    kind: "list",
    key: "menus",
    label: "Footer link columns",
    itemLabel: "Menu",
    max: 4,
    fields: [
      { kind: "text", key: "label", label: "Menu name", max: 40 },
      { kind: "list", key: "items", label: "Links", itemLabel: "Link", max: 14, fields: linkFields },
    ],
  },
  { kind: "text", key: "menuNote", label: "Text under the last footer column", max: 140 },
  {
    kind: "list",
    key: "contactCards",
    label: "Footer contact cards",
    itemLabel: "Card",
    max: 4,
    fields: [
      { kind: "text", key: "title", label: "Title", max: 60 },
      { kind: "textarea", key: "lines", label: "Lines (one per line; emails and phone numbers become links)", max: 400 },
    ],
  },
  { kind: "list", key: "social", label: "Social links (LinkedIn, Instagram, …)", itemLabel: "Link", max: 6, fields: linkFields },
  { kind: "text", key: "copyright", label: "Copyright line", max: 140 },
  // the colour picker of the visitors ("Make this website yours", components/site/theme-picker.tsx)
  {
    kind: "group",
    key: "picker",
    label: "Colour picker (\"Make this website yours\")",
    fields: [
      {
        kind: "choice",
        key: "show",
        label: "When does the colour card open by itself?",
        options: [
          { value: "first", label: "Once, on the first visit of a person (then only the round button)" },
          { value: "session", label: "Once in every new visit (every time the browser is opened again)" },
          { value: "button", label: "Never by itself: only when the round colour button is clicked" },
          { value: "off", label: "Off: no card and no button, everybody sees the normal colour of the website" },
        ],
      },
      {
        kind: "choice",
        key: "when",
        label: "When it opens by itself, after",
        options: [
          { value: "1.4", label: "1.4 seconds (the page is already on the screen)" },
          { value: "4", label: "4 seconds" },
          { value: "8", label: "8 seconds" },
          { value: "scroll", label: "The first scroll of the visitor" },
        ],
      },
      {
        kind: "choice",
        key: "free",
        label: "Can visitors make their own colour too?",
        options: [
          { value: "yes", label: "Yes: the colours below, plus the colour code and the strength slider" },
          { value: "no", label: "No: only the colours below" },
        ],
      },
      {
        kind: "list",
        key: "colors",
        label: "The colours of the card (empty = the 18 colours of the design)",
        itemLabel: "Colour",
        max: 18,
        fields: [
          { kind: "text", key: "name", label: "Name (read out to screen readers)", max: 30 },
          { kind: "text", key: "hex", label: "Colour code, like #D387FF", max: 7, hint: "The first 12 colours make the big outer ring, the next 6 the small inner ring." },
        ],
      },
    ],
  },
];

export const SITE_DEFAULTS = {
  name: "We3vision",
  legalName: "We3vision Private Limited",
  tagline:
    "We're thrilled to have you on board. At We3vision Private Limited, we value innovation, collaboration, and growth. We're excited to see the impact you'll make as part of our team. Let's achieve great things together!",
  megaTitle: "Leading Web, AI & Metaverse Development Services in India",
  megaText:
    "We3vision Private Limited offers the exceptional of Virtual reality (VR) and Augmented Reality (AR) development services and delivering innovative and immersive solutions to satisfy various corporate to requirements in different sectors.",
  megaCta: "View works",
  megaCtaHref: "/portfolio",
  badges: [
    { label: "Startup India", image: "/images/startup-india.webp" },
    { label: "MSME, Ministry of MSME, Govt. of India", image: "/images/make-in-india.webp" },
  ],
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/#services" },
  ],
  menus: [
    {
      label: "Services",
      items: [
        { label: "AI Development", href: "/ai" },
        { label: "Metaverse", href: "/metaverse" },
        { label: "Web Development", href: "/webdev" },
        { label: "App Development", href: "/mobile" },
        { label: "Brand Design", href: "/brand-identity" },
        { label: "CRM Development", href: "/crm" },
        { label: "2D/3D Animation", href: "/animation" },
        { label: "3D Modeling", href: "/3d-modeling" },
        { label: "UI/UX Design", href: "/ui-ux-design" },
        { label: "Graphic Design", href: "/graphics" },
        { label: "SEO Optimization", href: "/seo" },
      ],
    },
    {
      label: "Technology",
      items: [
        { label: "Headless CMS Development", href: "/headless-CMS-devlopment-services" },
        { label: "Custom WordPress Development", href: "/custom-wordpress-devlopment-services" },
        { label: "Shopify Development Services", href: "/shopify-development-services" },
        { label: "Custom WooCommerce Development", href: "/custom-woocommerce-devlopment" },
        { label: "Shopify App Development Services", href: "/shopify-app-development-services" },
        { label: "WordPress Plugin Development Services", href: "/wordpress-plugin-development-company" },
      ],
    },
    {
      label: "Company",
      items: [
        { label: "Portfolio", href: "/portfolio" },
        { label: "Blog", href: "/blog" },
        { label: "Who We Are", href: "/about" },
        { label: "Our Team", href: "/team" },
        { label: "Contact Us", href: "/contact" },
        { label: "What We Done", href: "/blog" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ],
  menuNote: "Looking for the best solutions for your business or project",
  contactCards: [
    {
      title: "Surat (Head Office)",
      lines: "We3vision House 1/936, Bhim Kachchhi Mohallo,\nNanpura Surat, Gujarat, India, 395001\ninfo@we3vision.com",
    },
    { title: "Contact US", lines: "hr@we3vision.com\n+91 7383216096\n+91 7600772240" },
    { title: "Germany", lines: "Zum Lahnberg 64, Marburg, 35037\ngermany@we3vision.com\n+49 1516 2774145" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/we3visionprivatelimited/" },
    { label: "Instagram", href: "https://www.instagram.com/we3vision_private_limited/" },
  ],
  copyright: "Copyright © 2026 We3Vision Private Limited. All Rights Reserved.",
  picker: { show: "first", when: "1.4", free: "yes", colors: [] as { name: string; hex: string }[] },
};

export type SiteSettings = typeof SITE_DEFAULTS;

/** the official LinkedIn company page of We3vision */
export const LINKEDIN_URL = "https://www.linkedin.com/company/we3visionprivatelimited/";

export function normalizeSite(input: unknown): SiteSettings {
  const merged = { ...SITE_DEFAULTS, ...(typeof input === "object" && input !== null ? input : {}) };
  const site = normalize(SITE_FIELDS, merged) as SiteSettings;
  // the old LinkedIn page of the company is gone ("This LinkedIn Page isn't available"): a saved old address is replaced by the real one
  site.social = site.social.map((l) => (l.href.toLowerCase().includes("linkedin.com/company/we3visioninfotech") ? { ...l, href: LINKEDIN_URL } : l));
  return site;
}
