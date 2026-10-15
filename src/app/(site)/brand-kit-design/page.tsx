import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Brand Kit Design page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("brand-kit");

export default function PageBrandKit() {
  return renderPage("brand-kit");
}
