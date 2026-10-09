import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// WordPress Plugin Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("wordpress-plugin");

export default function PageWordpressPlugin() {
  return renderPage("wordpress-plugin");
}
