import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Our Products page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("products");

export default function PageProducts() {
  return renderPage("products");
}
