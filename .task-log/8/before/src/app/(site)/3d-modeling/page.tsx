import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// 3D Modeling page. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("3d-modeling");

export default function Page3dModeling() {
  return renderPage("3d-modeling");
}
