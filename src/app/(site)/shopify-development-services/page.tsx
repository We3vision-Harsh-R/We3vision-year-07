import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Shopify Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("shopify");

export default function PageShopify() {
  return renderPage("shopify");
}
