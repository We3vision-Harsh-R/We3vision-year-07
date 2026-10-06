import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Web Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("webdev");

export default function PageWebdev() {
  return renderPage("webdev");
}
