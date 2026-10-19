import type { Metadata } from "next";
import { NotFoundView } from "@/components/site/not-found-view";

// Shown inside the site layout when a blog article, job or project address does not exist (notFound()).
export const metadata: Metadata = { title: "Page Not Found | We3vision", robots: { index: false, follow: true } };

export default function SiteNotFound() {
  return <NotFoundView />;
}
