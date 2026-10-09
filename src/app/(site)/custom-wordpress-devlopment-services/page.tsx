import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Custom WordPress Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("custom-wordpress");

export default function PageCustomWordpress() {
  return renderPage("custom-wordpress");
}
