import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Blog page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("blog");

export default function PageBlog() {
  return renderPage("blog");
}
