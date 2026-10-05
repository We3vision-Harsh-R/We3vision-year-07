import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Served from cache. Admin "Publish" refreshes it instantly; the timer is a safety net.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("brand-identity");

export default function BrandIdentityPage() {
  return renderPage("brand-identity");
}
