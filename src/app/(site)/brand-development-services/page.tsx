import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Brand Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("brand-development");

export default function PageBrandDevelopment() {
  return renderPage("brand-development");
}
