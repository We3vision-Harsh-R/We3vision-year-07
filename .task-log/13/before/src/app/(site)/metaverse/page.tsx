import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Metaverse Solutions page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("metaverse");

export default function PageMetaverse() {
  return renderPage("metaverse");
}
