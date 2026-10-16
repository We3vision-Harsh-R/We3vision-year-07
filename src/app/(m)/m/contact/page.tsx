import { mobileMetadata, renderMobilePage } from "@/components/site/mobile/pages/render";
import { ContactCard, ContactForm, ContactReach } from "@/components/site/mobile/pages/custom/contact/sections";
import "./page.css";

// /contact as the company's Contacts card: the same CMS page and settings as the laptop route.
export const revalidate = 600;

export const generateMetadata = () => mobileMetadata("contact");

export default function Page() {
  return renderMobilePage("contact", { overrides: { pageHero: ContactCard, contact: ContactForm, reach: ContactReach } });
}
