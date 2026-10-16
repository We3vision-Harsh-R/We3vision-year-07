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
];

export const SITE_DEFAULTS = {
  name: "We3vision",
  legalName: "We3vision Private Limited",
  tagline:
    "We're thrilled to have you on board. At We3vision Private Limited, we value innovation, collaboration, and growth. We're excited to see the impact you'll make as part of our team. Let's achieve great things together!",
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
    { label: "LinkedIn", href: "https://www.linkedin.com/company/we3visioninfotech/" },
    { label: "Instagram", href: "https://www.instagram.com/we3vision_private_limited/" },
  ],
  copyright: "Copyright © 2026 We3Vision Private Limited. All Rights Reserved.",
};

export type SiteSettings = typeof SITE_DEFAULTS;

export function normalizeSite(input: unknown): SiteSettings {
  const merged = { ...SITE_DEFAULTS, ...(typeof input === "object" && input !== null ? input : {}) };
  return normalize(SITE_FIELDS, merged) as SiteSettings;
}
