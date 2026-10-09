import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Custom WooCommerce Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("custom-woocommerce");

export default function PageCustomWoocommerce() {
  return renderPage("custom-woocommerce");
}
