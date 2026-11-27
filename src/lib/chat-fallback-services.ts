// The services of the website as a list for the PANDA dropdown, used when the chatbot server is asleep or does not answer (so the dropdown
// always opens). Same pages as the big menu (lib/site-menu.ts); a plain list on purpose: site-menu.ts pulls in all the page content, which the
// browser must not download for a dropdown. The ids start with "menu:" so the chat knows they are not ids of the chatbot server.
import type { ChatService } from "./ai-chat";

const G: [string, [string, string][]][] = [
  ["Development", [["AI/ML Development", "/ai"], ["Metaverse Development", "/metaverse"], ["Software Development", "/software-development-services"], ["Web Development", "/webdev"], ["App Development", "/mobile"], ["CRM Development", "/crm"], ["Headless CMS Development", "/headless-CMS-devlopment-services"]]],
  ["Creatives", [["Brand Design", "/brand-identity"], ["UI/UX Design", "/ui-ux-design"], ["Graphic Design", "/graphics"], ["2D/3D Modeling", "/3d-modeling"], ["Animation & Video Editing", "/animation"]]],
  ["E-commerce", [["Shopify Development", "/shopify-development-services"], ["Shopify Plugin Development", "/shopify-plugin-development-services"], ["Shopify App Development", "/shopify-app-development-services"], ["WordPress Development", "/custom-wordpress-devlopment-services"], ["Custom WooCommerce Development", "/custom-woocommerce-devlopment"], ["WordPress Plugin Development", "/wordpress-plugin-development-company"]]],
  ["Branding", [["Brand Development", "/brand-development-services"], ["Brand Kit Design", "/brand-kit-design"], ["Brand Video", "/brand-video-production"], ["End-to-End Brand Development", "/zero-to-n-brand-development"]]],
  ["Marketing", [["SEO / AEO", "/seo"], ["Meta Marketing", "/meta-marketing-services"], ["Physical Marketing", "/physical-marketing-services"]]],
];

export const FALLBACK_SERVICES: ChatService[] = G.flatMap(([category, items]) => items.map(([title, url]) => ({ id: `menu:${url}`, title, category, url })));
