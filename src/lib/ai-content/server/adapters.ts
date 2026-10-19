import "server-only";
import { db } from "@/lib/db";
import type { ContentTypeKey } from "../registry";

// The database side of each content type: how to look at what already exists (to avoid duplicates and to link related articles).
// TypeScript forces one adapter per registry entry (Record<ContentTypeKey, …>): adding a type to the registry without an adapter
// does not compile. Publishing (approval) is in publish.ts.

export type ExistingItem = { title: string; slug: string; url: string; status: string; details: string };

export type Adapter = {
  /** items that exist now (newest first); `query` filters by a word in the title */
  listExisting: (query: string, limit: number) => Promise<ExistingItem[]>;
};

const contains = (q: string) => (q ? { title: { contains: q, mode: "insensitive" as const } } : {});

export const ADAPTERS: Record<ContentTypeKey, Adapter> = {
  blog: {
    async listExisting(query, limit) {
      const rows = await db.blogPost.findMany({
        where: contains(query),
        orderBy: [{ publishedAt: "desc" }],
        take: limit,
        select: { title: true, slug: true, category: true, published: true, publishedAt: true },
      });
      return rows.map((r) => ({
        title: r.title,
        slug: r.slug,
        url: `/blog/${r.slug}`,
        status: r.published ? "live" : "hidden",
        details: [r.category, r.publishedAt.toISOString().slice(0, 10)].filter(Boolean).join(" · "),
      }));
    },
  },
  career: {
    async listExisting(query, limit) {
      const rows = await db.careerRole.findMany({
        where: contains(query),
        orderBy: [{ sortOrder: "asc" }],
        take: limit,
        select: { title: true, slug: true, team: true, active: true, closesAt: true, location: true },
      });
      return rows.map((r) => ({
        title: r.title,
        slug: r.slug,
        url: `/careers/${r.slug}`,
        status: r.active ? "open" : "closed",
        details: [r.team, r.location, r.closesAt ? `closes ${r.closesAt}` : ""].filter(Boolean).join(" · "),
      }));
    },
  },
};
