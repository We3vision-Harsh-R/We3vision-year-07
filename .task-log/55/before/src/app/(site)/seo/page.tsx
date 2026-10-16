import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// SEO Optimization page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("seo");

export default function PageSeo() {
  return renderPage("seo");
}
