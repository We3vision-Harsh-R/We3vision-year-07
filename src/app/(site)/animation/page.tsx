import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// 2D/3D Animation page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("animation");

export default function PageAnimation() {
  return renderPage("animation");
}
