import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSections } from "@/components/site/sections";
import { requireAdmin } from "@/lib/auth";
import { getDraftPage, getSiteSettings } from "@/lib/cms/queries";
import { isPageSlug } from "@/lib/cms/pages";

export const metadata: Metadata = { title: "Draft preview", robots: { index: false, follow: false } };

/** Shows the unpublished draft inside the real site layout. Admin only. */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!isPageSlug(slug)) notFound();
  const [draft, site] = await Promise.all([getDraftPage(slug), getSiteSettings()]);
  return (
    <>
      <div className="fixed left-4 top-4 z-[60] rounded-full bg-amber-400 px-5 py-2 text-center text-sm font-semibold text-black shadow-xl">
        Draft preview, visitors cannot see this version until you publish.
      </div>
      <PageSections sections={draft.content.sections} site={site} />
    </>
  );
}
