import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Shopify App Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("shopify-app");

export default function PageShopifyApp() {
  return renderPage("shopify-app");
}
