import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// WeJobs page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("wejobs");

export default function PageWeJobs() {
  return renderPage("wejobs");
}
