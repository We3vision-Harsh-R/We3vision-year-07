import { mobileSitemapMetadata, renderMobileSitemap } from "@/components/site/mobile/pages/sitemap";

// /sitemap as an app screen (the same links as the laptop page).
export const revalidate = 600;

export const metadata = mobileSitemapMetadata;

export default function Page() {
  return renderMobileSitemap();
}
