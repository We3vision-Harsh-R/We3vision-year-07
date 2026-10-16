import { EMPTY_BLOG, BlogForm, type OtherPost } from "@/components/admin/blog-form";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Add article" };

export default async function NewBlogPage() {
  await requireAdmin();
  const posts = await db.blogPost.findMany({ orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }] });
  const others: OtherPost[] = posts.map((p) => ({ id: p.id, title: p.title, category: p.category, image: p.cover, tile: p.tile, href: "#", published: p.published }));
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add article</h1>
        <p className="mt-1 text-sm text-zinc-500">Write the title and the text, choose the shape of the cover picture and upload it. It is on the website as soon as you save.</p>
      </div>
      <BlogForm initial={EMPTY_BLOG(posts.length + 1)} others={others} />
    </div>
  );
}
