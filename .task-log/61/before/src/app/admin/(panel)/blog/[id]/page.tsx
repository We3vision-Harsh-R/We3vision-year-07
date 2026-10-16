import { notFound } from "next/navigation";
import { BlogForm, type BlogData, type OtherPost } from "@/components/admin/blog-form";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { faqToText, tileOf } from "@/lib/blog-shared";

export const metadata = { title: "Edit article" };

export default async function EditBlogPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ added?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { added } = await searchParams;
  const all = await db.blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] });
  const index = all.findIndex((p) => p.id === id);
  if (index < 0) notFound();
  const p = all[index];
  const tags = Array.isArray(p.tags) ? p.tags.filter((x): x is string => typeof x === "string") : [];
  const faq = Array.isArray(p.faq)
    ? p.faq.flatMap((x) => {
        const o = x as { question?: unknown; answer?: unknown };
        return typeof o?.question === "string" && typeof o?.answer === "string" ? [{ question: o.question, answer: o.answer }] : [];
      })
    : [];
  const initial: BlogData = {
    title: p.title,
    category: p.category,
    summary: p.summary,
    cover: p.cover,
    tile: tileOf(p.tile),
    content: p.content,
    tags: tags.join(", "),
    faq: faqToText(faq),
    date: p.publishedAt.toISOString().slice(0, 10),
    position: index + 1,
    published: p.published,
  };
  // the other articles in their order; the one that is edited is put back by the preview at the chosen place
  const others: OtherPost[] = all.filter((x) => x.id !== id).map((x) => ({ id: x.id, title: x.title, category: x.category, image: x.cover, tile: x.tile, href: "#", published: x.published }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{p.title}</h1>
        {added && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Article added. It is on the website now.</p>}
      </div>
      <BlogForm key={p.updatedAt.toISOString()} id={p.id} slug={p.slug} initial={initial} others={others} />
    </div>
  );
}
