"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { moveProject, setProjectPublished } from "@/actions/projects";
import { PROJECT_GROUPS } from "@/lib/project-groups";
import { btnIcon, btnSecondary, card } from "./ui";

export type ProjectRow = { id: string; title: string; category: string; cover: string; group: string; published: boolean; pictures: number };

/** The list of the projects, group by group, in the order they have on the website (move up / down, show / hide). */
export function ProjectsList({ rows }: { rows: ProjectRow[] }) {
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
        <p className="font-medium">No projects yet.</p>
        <p className="mt-1 text-sm text-zinc-500">Add the first project: a name, a few words and some pictures.</p>
        <Link href="/admin/projects/new" className={`${btnSecondary} mt-4 !border-brand !text-brand`}>
          + Add project
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {PROJECT_GROUPS.map((g) => {
        const list = rows.filter((r) => r.group === g.value);
        if (list.length === 0) return null;
        return (
          <section key={g.value}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {g.label} <span className="font-normal normal-case text-zinc-400">({list.length})</span>
            </h2>
            <ul className="space-y-2">
              {list.map((r, i) => (
                <li key={r.id} className={`${card} flex items-center gap-4 !p-3 sm:!p-4 ${r.published ? "" : "opacity-60"}`}>
                  <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-zinc-100 text-[10px] text-zinc-400">
                    {r.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.cover} alt="" className="size-full object-cover" loading="lazy" />
                    ) : (
                      "no picture"
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/projects/${r.id}`} className="block truncate font-medium hover:text-brand">
                      {r.title}
                    </Link>
                    <p className="truncate text-xs text-zinc-500">
                      {r.category || "no label"} · {r.pictures} picture{r.pictures === 1 ? "" : "s"}
                      {!r.published && " · hidden"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button type="button" className={btnIcon} disabled={pending || i === 0} onClick={() => run(() => moveProject(r.id, "up"))} aria-label="Move up">
                      ↑
                    </button>
                    <button type="button" className={btnIcon} disabled={pending || i === list.length - 1} onClick={() => run(() => moveProject(r.id, "down"))} aria-label="Move down">
                      ↓
                    </button>
                    <button type="button" className={`${btnIcon} !w-auto px-2.5 text-xs`} disabled={pending} onClick={() => run(() => setProjectPublished(r.id, !r.published))}>
                      {r.published ? "Hide" : "Show"}
                    </button>
                    <Link href={`/admin/projects/${r.id}`} className={`${btnSecondary} !px-3 !py-1.5`}>
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
