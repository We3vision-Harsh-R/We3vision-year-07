import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// WePresent page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("wepresent");

export default function PageWePresent() {
  return renderPage("wepresent");
}
