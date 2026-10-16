import "@/styles/home-hero.css";
import "@/styles/ai.css";
import "@/styles/brand-identity.css";
import "@/styles/theme-picker.css";
import "@/styles/office.css";
import "@/styles/process-floor.css";
import "@/styles/reasons-stack.css";
import "@/styles/metaverse.css";
import "@/styles/about.css";
import "@/styles/panda-chat.css";
import "@/styles/modern-base.css";
import "@/styles/modern-service.css";
import "@/styles/team.css";
import "@/styles/mega-menu.css";
import "@/styles/admin.css";
import "@/styles/blog.css";
import "@/styles/contact.css";
import "@/styles/careers.css";
import "@/styles/animation.css";
import "@/styles/ui-ux.css";
import "@/styles/seo-lab.css";
import "@/styles/modern-process.css";
import "@/styles/modern-faq.css";
import "@/styles/modern-why.css";
import "@/styles/modern-related.css";
import "@/styles/modern-tools.css";
import "@/styles/headless-cms.css";
import "@/styles/wordpress.css";
import "@/styles/shopify.css";
import "@/styles/woocommerce.css";
import "@/styles/shopify-app.css";
import "@/styles/wp-plugin.css";
import "@/styles/graphics.css";
import "@/styles/brand-dev.css";
import "@/styles/end-to-end.css";
import "@/styles/seo-marketing.css";
import "@/styles/physical-marketing.css";
import "@/styles/meta-marketing.css";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSections } from "@/components/site/sections";
import { requireAdmin } from "@/lib/auth";
import { getDraftPage, getSiteSettings } from "@/lib/cms/queries";
import { isPageSlug } from "@/lib/cms/pages";
import { skinOf } from "@/lib/cms/page-route";

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
      <PageSections sections={draft.content.sections} site={site} skin={skinOf(slug)} page={slug} />
    </>
  );
}
