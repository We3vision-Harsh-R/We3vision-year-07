// The links of the big menu (the round button of the floating menu): Services in five groups, Our Products and Explore.
// The pages themselves are in lib/cms/pages.ts; this file only decides where they appear in the menu.
// IMPORTANT: this file is imported by client components (menu, wheel, dock). It must NOT import lib/cms/pages (all the page texts, ~370 KB): that would be
// sent to every visitor. The function that needs it, unlistedPages(), is in lib/site-menu-pages.ts (server only).

export type MenuLink = { label: string; href: string; soon?: boolean };
export type MenuGroup = { label: string; items: MenuLink[] };

export const SERVICE_GROUPS: MenuGroup[] = [
  {
    label: "Development",
    items: [
      { label: "AI/ML Development", href: "/ai" },
      { label: "Metaverse Development", href: "/metaverse" },
      { label: "Software Development", href: "/software-development-services" },
      { label: "Web Development", href: "/webdev" },
      { label: "App Development", href: "/mobile" },
      { label: "CRM Development", href: "/crm" },
      { label: "Headless CMS Development", href: "/headless-CMS-devlopment-services" },
    ],
  },
  {
    label: "Creatives",
    items: [
      { label: "Brand Design", href: "/brand-identity" },
      { label: "UI/UX Design", href: "/ui-ux-design" },
      { label: "Graphic Design", href: "/graphics" },
      { label: "2D/3D Modeling", href: "/3d-modeling" },
      { label: "Animation & Video Editing", href: "/animation" },
    ],
  },
  {
    label: "E-commerce",
    items: [
      { label: "Shopify Development", href: "/shopify-development-services" },
      { label: "Shopify Plugin Development", href: "/shopify-plugin-development-services" },
      { label: "Shopify App Development", href: "/shopify-app-development-services" },
      { label: "WordPress Development", href: "/custom-wordpress-devlopment-services" },
      { label: "Custom WooCommerce Development", href: "/custom-woocommerce-devlopment" },
      { label: "WordPress Plugin Development", href: "/wordpress-plugin-development-company" },
    ],
  },
  {
    label: "Branding",
    items: [
      { label: "Brand Design", href: "/brand-identity" },
      { label: "Brand Development", href: "/brand-development-services" },
      { label: "Brand Kit Design", href: "/brand-kit-design" },
      { label: "Brand Video", href: "/brand-video-production" },
      { label: "End-to-End Brand Development", href: "/zero-to-n-brand-development" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "SEO / AEO", href: "/seo" },
      { label: "Meta Marketing", href: "/meta-marketing-services" },
      { label: "Physical Marketing", href: "/physical-marketing-services" },
    ],
  },
];

// The seven main services (the same seven as the home page). The phone/tablet menu shows them as tiles where the products used to be.
export const MAIN_SERVICES: MenuLink[] = [
  { label: "AI/ML Development", href: "/ai" },
  { label: "Brand Design", href: "/brand-identity" },
  { label: "Metaverse Development", href: "/metaverse" },
  { label: "Web Development", href: "/webdev" },
  { label: "App Development", href: "/mobile" },
  { label: "Software Development", href: "/software-development-services" },
  { label: "CRM Development", href: "/crm" },
];

export const PRODUCT_LINKS: MenuLink[] = [
  { label: "WeBugMate", href: "https://webugmate.com/" },
  { label: "WeThink", href: "https://wethink.we3vision.com/" },
  { label: "WeJobs", href: "/products/wejobs", soon: true },
  { label: "WePresent", href: "/products/wepresent", soon: true },
];

export const EXPLORE_LINKS: MenuLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Blogs", href: "/blog" },
  { label: "Our Team", href: "/team" },
  { label: "Contact Us", href: "/contact" },
  { label: "Careers", href: "/careers" },
];

// Industrial Training (owner, 2026-11-12): 3, 6 and 9 month fee-based training. The pages and fees are in lib/industrial-training.ts.
export const TRAINING_LINKS: MenuLink[] = [
  { label: "3 Month Industrial training", href: "/industrial-training/3-month" },
  { label: "6 Month Industrial training", href: "/industrial-training/6-month" },
  { label: "9 Month Industrial training", href: "/industrial-training/9-month" },
];
