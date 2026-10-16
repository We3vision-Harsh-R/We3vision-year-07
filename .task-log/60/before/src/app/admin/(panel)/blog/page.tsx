import Link from "next/link";
import { BlogList, type BlogRow } from "@/components/admin/blog-list";
import { btnPrimary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { dateLabel } from "@/lib/blog-shared";

export const metadata = { title: "Blog" };

export default async function BlogAdminPage() {
  await requireAdmin();
  const posts = await db.blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] });
  const rows: BlogRow[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    cover: p.cover,
    tile: p.tile,
    published: p.published,
    dateLabel: dateLabel(p.publishedAt.toISOString().slice(0, 10)),
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            The articles of the website. The Blog page shows only the cover pictures, each in the shape you choose; a click opens the article. The order here is the
            order of the pictures.
          </p>
        </div>
        <Link href="/admin/blog/new" className={btnPrimary}>
          + Add article
        </Link>
      </div>
      <BlogList rows={rows} />
    </div>
  );
}
