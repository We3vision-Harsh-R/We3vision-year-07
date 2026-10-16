import "@/styles/seo-marketing.css";
import "@/styles/physical-marketing.css";
import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Physical Marketing page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("physical-marketing");

export default function PagePhysicalMarketing() {
  return renderPage("physical-marketing");
}
