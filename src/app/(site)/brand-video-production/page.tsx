import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Brand Video Production page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("brand-video");

export default function PageBrandVideo() {
  return renderPage("brand-video");
}
