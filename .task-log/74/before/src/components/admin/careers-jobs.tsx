"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteJob, setJobOpen } from "@/actions/jobs";
import type { ActionResult } from "@/actions/types";
import { btnDanger, btnSecondary, card } from "./ui";

// Careers > Jobs: the list of the jobs, with how many applications each one has. A job can be closed without losing it.

export type JobRow = {
  id: string;
  title: string;
  team: string;
  slug: string;
  workType: string;
  location: string;
  openings: number;
  active: boolean;
  closesAt: string;
  applications: number;
  /** the closing day has passed */
  expired: boolean;
};

export function CareersJobs({ rows }: { rows: JobRow[] }) {
  const [list, setList] = useState(rows);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const toggle = (r: JobRow) =>
    start(async () => {
      const res = await setJobOpen(r.id, !r.active);
      setResult(res);
      if (res.ok) setList((l) => l.map((x) => (x.id === r.id ? { ...x, active: !r.active } : x)));
    });
  const remove = (r: JobRow) => {
    if (!window.confirm(`Remove the job "${r.title}"? The applications that came for it are kept.`)) return;
    start(async () => {
      const res = await deleteJob(r.id);
      setResult(res);
      if (res.ok) setList((l) => l.filter((x) => x.id !== r.id));
    });
  };

  return (
    <section className={`${card} space-y-4`}>
      {list.length === 0 && <p className="text-sm text-zinc-500">No jobs yet. Use “New job” to put the first one on the Careers page.</p>}
      <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
        {list.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/careers/jobs/${r.id}`} className="block truncate text-sm font-semibold text-zinc-900 hover:text-brand">
                {r.title}
              </Link>
              <p className="mt-0.5 truncate text-sm text-zinc-500">
                {[r.team, r.workType, r.location, `${r.openings} opening${r.openings > 1 ? "s" : ""}`].filter(Boolean).join(" · ")}
              </p>
              <p className="mt-1 flex flex-wrap gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 ${r.active && !r.expired ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>
                  {r.expired ? "Closed (last day passed)" : r.active ? "Open" : "Closed"}
                </span>
                {r.closesAt && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">Last day {r.closesAt}</span>}
                <Link href={`/admin/careers?job=${r.id}`} className="rounded-full bg-brand/10 px-2 py-0.5 text-brand">
                  {r.applications} application{r.applications === 1 ? "" : "s"}
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href={`/careers/${r.slug}`} target="_blank" rel="noreferrer" className={btnSecondary}>
                View ↗
              </a>
              <Link href={`/admin/careers/jobs/${r.id}`} className={btnSecondary}>
                Edit
              </Link>
              <button type="button" className={btnSecondary} disabled={pending} onClick={() => toggle(r)}>
                {r.active ? "Close" : "Open"}
              </button>
              <button type="button" className={btnDanger} disabled={pending} onClick={() => remove(r)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      {result && (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          {result.ok ? result.message : result.error}
        </p>
      )}
    </section>
  );
}
