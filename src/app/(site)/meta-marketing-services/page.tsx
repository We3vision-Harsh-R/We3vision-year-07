import "@/styles/seo-marketing.css";
import "@/styles/meta-marketing.css";
import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Meta Marketing page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("meta-marketing");

export default function PageMetaMarketing() {
  return renderPage("meta-marketing");
}
