import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Contact Us page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("contact");

export default function PageContact() {
  return renderPage("contact");
}
