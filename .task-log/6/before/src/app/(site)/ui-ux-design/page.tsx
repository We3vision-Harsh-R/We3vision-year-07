import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// UI/UX Design page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("ui-ux-design");

export default function PageUiUxDesign() {
  return renderPage("ui-ux-design");
}
