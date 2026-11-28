import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Software company in Surat (local and AI-answer search page). Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("surat");

export default function PageSurat() {
  return renderPage("surat");
}
