import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Portfolio page. Served from cache; Publish in the admin panel (or saving a project) refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("portfolio");

export default function PagePortfolio() {
  return renderPage("portfolio");
}
