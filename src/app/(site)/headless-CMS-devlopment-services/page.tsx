import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Headless CMS Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("headless-cms");

export default function PageHeadlessCms() {
  return renderPage("headless-cms");
}
