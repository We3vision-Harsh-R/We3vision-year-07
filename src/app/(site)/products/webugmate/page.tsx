import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// WeBugMate page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("webugmate");

export default function PageWeBugMate() {
  return renderPage("webugmate");
}
