import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// 0 to N Brand Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("zero-to-n");

export default function PageZeroToN() {
  return renderPage("zero-to-n");
}
