import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// CRM Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("crm");

export default function PageCrm() {
  return renderPage("crm");
}
