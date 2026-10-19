import "server-only";
import { createBlogPost, type BlogInput } from "@/actions/blog";
import { saveJob, type JobInput } from "@/actions/jobs";
import { db } from "@/lib/db";
import type { ContentTypeKey } from "../registry";

// How an approved submission becomes a real item. It calls the SAME server actions the admin forms call (createBlogPost, saveJob), so the
// address (slug), the cleaning of the text, the order in the list and the refresh of the cached pages are exactly what a hand-made item gets.
// One publisher per registry entry (TypeScript forces it). The actions check requireAdmin(): an approval is always done by a logged-in admin.

export type Published = { ok: true; id: string; slug: string } | { ok: false; error: string };

export const PUBLISHERS: Record<ContentTypeKey, (input: Record<string, unknown>) => Promise<Published>> = {
  async blog(input) {
    const r = await createBlogPost(input as BlogInput);
    if (!r.ok) return { ok: false, error: r.error };
    if (!r.id) return { ok: false, error: "The article was not saved." };
    const row = await db.blogPost.findUnique({ where: { id: r.id }, select: { slug: true } });
    return { ok: true, id: r.id, slug: row?.slug ?? "" };
  },
  async career(input) {
    const r = await saveJob(input as JobInput);
    if (!r.ok) return { ok: false, error: r.error };
    if (!r.id || !r.slug) return { ok: false, error: "The job was not saved." };
    return { ok: true, id: r.id, slug: r.slug };
  },
};
