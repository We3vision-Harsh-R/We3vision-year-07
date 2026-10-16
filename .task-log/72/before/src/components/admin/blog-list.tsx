"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { moveBlogPost, setBlogPostPublished } from "@/actions/blog";
import { TILES } from "@/lib/blog-shared";
import { BlogPreview } from "./blog-preview";
import { btnIcon, btnSecondary, card } from "./ui";

export type BlogRow = { id: string; title: string; category: string; cover: string; tile: string; published: boolean; dateLabel: string };

/** The articles in the order of the Blog page (move up / down, show / hide), with a preview of the page above them. */
export function BlogList({ rows }: { rows: BlogRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<unknown>) =>
    start(async () => {
      await fn();
      router.refresh();
    });

  if (rows.length === 0) {
    return (
      <div className={`${card} text-center`}>
        <p className="font-medium">No articles yet.</p>
        <p className="mt-1 text-sm text-zinc-500">Add the first article: a title, a cover picture and the text.</p>
        <Link href="/admin/blog/new" className={`${btnSecondary} mt-4 !border-brand !text-brand`}>
          + Add article
        </Link>
      </div>
    );
  }

  const shown = rows.filter((r) => r.published).map((r) => ({ id: r.id, title: r.title, category: r.category, image: r.cover, tile: r.tile, href: `/admin/blog/${r.id}` }));

  return (
    <div className="space-y-8">
      <div className={card}>
        <p className="text-sm font-semibold text-zinc-700">The Blog page now</p>
        <p className="mb-3 mt-1 text-xs text-zinc-500">Switch the screen size to see how many columns it has. The order below is the order of the pictures.</p>
        <BlogPreview items={shown} />
      </div>

      <ul className="space-y-2">
        {rows.map((r, i) => {
          const tile = TILES.find((t) => t.value === r.tile)?.label ?? r.tile;
          return (
            <li key={r.id} className={`${card} flex items-center gap-4 !p-3 sm:!p-4 ${r.published ? "" : "opacity-60"}`}>
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-zinc-400">{i + 1}</span>
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 text-[10px] text-zinc-400">
                {r.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.cover} alt="" className="size-full object-cover" loading="lazy" />
                ) : (
                  "no picture"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/blog/${r.id}`} className="block truncate font-medium hover:text-brand">
                  {r.title}
                </Link>
                <p className="truncate text-xs text-zinc-500">
                  {r.category || "no topic"} · {tile} · {r.dateLabel}
                  {!r.published && " · hidden"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" className={btnIcon} disabled={pending || i === 0} onClick={() => run(() => moveBlogPost(r.id, "up"))} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className={btnIcon} disabled={pending || i === rows.length - 1} onClick={() => run(() => moveBlogPost(r.id, "down"))} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className={`${btnIcon} !w-auto px-2.5 text-xs`} disabled={pending} onClick={() => run(() => setBlogPostPublished(r.id, !r.published))}>
                  {r.published ? "Hide" : "Show"}
                </button>
                <Link href={`/admin/blog/${r.id}`} className={`${btnSecondary} !px-3 !py-1.5`}>
                  Edit
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
