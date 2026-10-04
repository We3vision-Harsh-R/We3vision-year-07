import { notFound } from "next/navigation";
import { PageEditor } from "@/components/admin/page-editor";
import { requireAdmin } from "@/lib/auth";
import { PAGES, isPageSlug } from "@/lib/cms/pages";
import { getDraftPage } from "@/lib/cms/queries";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Edit page" };

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ restored?: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const { restored } = await searchParams;
  if (!isPageSlug(slug)) notFound();
  const page = await getDraftPage(slug);

  return (
    <PageEditor
      // A restore redirects here with a fresh token, which remounts the editor with the restored draft.
      key={restored ?? "initial"}
      restored={Boolean(restored)}
      slug={slug}
      title={PAGES[slug].title}
      path={PAGES[slug].path}
      initial={{ seoTitle: page.seoTitle, seoDescription: page.seoDescription, sections: page.content.sections }}
      hasDraftChanges={page.hasDraftChanges}
      isPublished={page.isPublished}
      publishedAt={page.publishedAt ? formatDate(page.publishedAt) : null}
      versions={page.versions.map((v) => ({ id: v.id, createdAt: formatDate(v.createdAt) }))}
    />
  );
}
