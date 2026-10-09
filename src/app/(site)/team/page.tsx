import { pageMetadata, renderPage } from "@/lib/cms/page-route";

// Team page: the office with the people of the company. Served from cache; Publish in the admin panel refreshes it instantly.
export const revalidate = 600;

export const generateMetadata = () => pageMetadata("team");

export default function PageTeam() {
  return renderPage("team");
}
