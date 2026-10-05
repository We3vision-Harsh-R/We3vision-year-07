import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// AI Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("ai");

export default function AiPage() {
  return renderPage("ai");
}
