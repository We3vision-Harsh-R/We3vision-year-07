import { notFound, redirect } from "next/navigation";
import { SubmissionEditForm } from "@/components/admin/submission-edit-form";
import type { OtherPost } from "@/components/admin/blog-form";
import { CONTENT_TYPE_KEYS, getContentType, type ContentTypeKey } from "@/lib/ai-content/registry";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Edit AI submission" };

// The normal admin form of the content type, filled with the draft an AI tool sent. Saving keeps the changes in the submission only.
export default async function EditSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) notFound();
  const sub = await db.contentSubmission.findUnique({ where: { id } });
  const def = sub ? getContentType(sub.contentType) : undefined;
  if (!sub || !def || !CONTENT_TYPE_KEYS.includes(def.key as ContentTypeKey)) notFound();
  if (sub.status !== "pending_review") redirect(`/admin/ai-submissions/${id}`);

  // the draft may be a little off (that is why it is being edited): fill the form with what is there, filling gaps with the defaults
  const data = (sub.data && typeof sub.data === "object" ? sub.data : {}) as Record<string, unknown>;
  const form = def.toFormValues({ ...Object.fromEntries(def.fields.map((f) => [f.name, f.kind === "date" ? "" : "default" in f ? f.default : f.kind === "list" || f.kind === "qa" ? [] : ""])), ...data });

  let others: OtherPost[] = [];
  if (def.key === "blog") {
    const posts = await db.blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] });
    others = posts.map((p) => ({ id: p.id, title: p.title, category: p.category, image: p.cover, tile: p.tile, href: "#", published: p.published }));
    form.position = posts.length + 1;
    form.published = true;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit: {sub.title || def.label}</h1>
        <p className="mt-1 text-sm text-zinc-500">This is the normal form. Your changes are saved into the submission; nothing goes live until you approve it.</p>
      </div>
      <SubmissionEditForm submissionId={sub.id} type={def.key as ContentTypeKey} initial={form} others={others} />
    </div>
  );
}
