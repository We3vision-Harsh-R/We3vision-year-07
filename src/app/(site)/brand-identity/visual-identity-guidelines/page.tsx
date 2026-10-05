import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Brand Design sub-service page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("visual-identity");

export default function Page() {
  return renderPage("visual-identity");
}
