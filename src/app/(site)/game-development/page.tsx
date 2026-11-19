import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Game Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("game");

export default function PageGame() {
  return renderPage("game");
}
