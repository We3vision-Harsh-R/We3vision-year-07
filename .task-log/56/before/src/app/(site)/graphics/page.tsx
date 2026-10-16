import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Graphics & UI/UX Design page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("graphics");

export default function PageGraphics() {
  return renderPage("graphics");
}
