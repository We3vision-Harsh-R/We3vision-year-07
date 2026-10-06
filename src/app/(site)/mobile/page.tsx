import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Mobile App Development page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("mobile");

export default function PageMobile() {
  return renderPage("mobile");
}
