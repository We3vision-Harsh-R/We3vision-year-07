import "@/styles/seo-marketing.css";
import "@/styles/software-dev.css";
import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Custom Software Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("software");

export default function PageSoftware() {
  return renderPage("software");
}
