import "../../blog/page.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_MOBILE } from "@/components/site/mobile/pages/custom/blog/sections";
import { type RenderOptions, renderMobilePage } from "@/components/site/mobile/pages/render";
import { requireAdmin } from "@/lib/auth";
import { MOBILE_PREVIEW_SLUGS, type MobilePreviewSlug } from "@/lib/cms/preview";

export const metadata: Metadata = { title: "Draft preview (phone)", robots: { index: false, follow: false } };

// The unpublished draft of a page as the phone/tablet app shows it (Admin > Pages > Live preview > Phone). Admin only, never cached.
// A page is listed here with the same options as its own mobile route, so the preview looks exactly like the live phone page.
const OPTIONS: Record<MobilePreviewSlug, RenderOptions> = { blog: BLOG_MOBILE };

export default async function MobilePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!(MOBILE_PREVIEW_SLUGS as readonly string[]).includes(slug)) notFound();
  const s = slug as MobilePreviewSlug;
  return renderMobilePage(s, { ...OPTIONS[s], draft: true });
}
