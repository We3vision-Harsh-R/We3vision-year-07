import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Careers page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("careers");

export default function PageCareers() {
  return renderPage("careers");
}
