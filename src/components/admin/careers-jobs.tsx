"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteJob, duplicateJob, moveJob, setJobOpen } from "@/actions/jobs";
import type { ActionResult } from "@/actions/types";
import { btnDanger, btnSecondary, btnIcon, card } from "./ui";

// Careers > Jobs: the jobs in the order of the Careers page, with how far their applications are (new, in process, hired of the openings).
// A job can be closed without losing it, copied to start a similar one, moved up or down, and its link copied to share it.

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
  fresh: number;
  inProcess: number;
  hired: number;
  /** the closing day has passed */
  expired: boolean;
};

type Tab = "all" | "open" | "closed";

export function CareersJobs({ rows }: { rows: JobRow[] }) {
  const router = useRouter();
  const [list, setList] = useState(rows);
  const [tab, setTab] = useState<Tab>("all");
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();

  const isOpen = (r: JobRow) => r.active && !r.expired;
  const shown = list.filter((r) => (tab === "all" ? true : tab === "open" ? isOpen(r) : !isOpen(r)));

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
  const copy = (r: JobRow) =>
    start(async () => {
      const res = await duplicateJob(r.id);
      setResult(res);
      if (res.ok && res.id) router.push(`/admin/careers/jobs/${res.id}`);
    });
  const move = (r: JobRow, direction: "up" | "down") =>
    start(async () => {
      const res = await moveJob(r.id, direction);
      if (!res.ok) return setResult(res);
      setList((l) => {
        const i = l.findIndex((x) => x.id === r.id);
        const j = direction === "up" ? i - 1 : i + 1;
        if (i < 0 || j < 0 || j >= l.length) return l;
        const n = [...l];
        [n[i], n[j]] = [n[j], n[i]];
        return n;
      });
    });
  const share = (r: JobRow) =>
    navigator.clipboard
      ?.writeText(new URL(`/careers/${r.slug}`, location.origin).href)
      .then(() => setResult({ ok: true, message: "The link of the job is copied." }))
      .catch(() => setResult({ ok: false, error: "Could not copy the link." }));

  const tabs: { v: Tab; label: string; n: number }[] = [
    { v: "all", label: "All", n: list.length },
    { v: "open", label: "Open", n: list.filter(isOpen).length },
    { v: "closed", label: "Closed", n: list.filter((r) => !isOpen(r)).length },
  ];

  return (
    <section className={`${card} space-y-4`}>
      <div className="inline-flex rounded-lg border border-zinc-300 p-0.5" role="group" aria-label="Show">
        {tabs.map((t) => (
          <button key={t.v} type="button" aria-pressed={tab === t.v} onClick={() => setTab(t.v)} className={`rounded-md px-3 py-1.5 text-sm font-medium ${tab === t.v ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>
            {t.label} ({t.n})
          </button>
        ))}
      </div>
      {list.length === 0 && <p className="text-sm text-zinc-500">No jobs yet. Use “Post a job” to put the first one on the Careers page.</p>}
      <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
        {shown.map((r) => {
          const i = list.findIndex((x) => x.id === r.id);
          const fill = Math.min(100, Math.round((r.hired / Math.max(1, r.openings)) * 100));
          return (
            <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              {tab === "all" && (
                <div className="flex flex-col gap-1">
                  <button type="button" className={btnIcon} disabled={pending || i === 0} onClick={() => move(r, "up")} aria-label={`Move ${r.title} up`}>
                    ↑
                  </button>
                  <button type="button" className={btnIcon} disabled={pending || i === list.length - 1} onClick={() => move(r, "down")} aria-label={`Move ${r.title} down`}>
                    ↓
                  </button>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <Link href={`/admin/careers/jobs/${r.id}`} className="block truncate text-sm font-semibold text-zinc-900 hover:text-brand">
                  {r.title}
                </Link>
                <p className="mt-0.5 truncate text-sm text-zinc-500">{[r.team, r.workType, r.location, `${r.openings} opening${r.openings > 1 ? "s" : ""}`].filter(Boolean).join(" · ")}</p>
                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${isOpen(r) ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>{r.expired ? "Closed (last day passed)" : r.active ? "Open" : "Closed"}</span>
                  {r.closesAt && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">Last day {r.closesAt}</span>}
                  <Link href={`/admin/careers?job=${r.id}`} className="rounded-full bg-brand/10 px-2 py-0.5 text-brand hover:bg-brand/20">
                    {r.applications} application{r.applications === 1 ? "" : "s"}
                  </Link>
                  {r.fresh > 0 && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">{r.fresh} new</span>}
                  {r.inProcess > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">{r.inProcess} in process</span>}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                  <span className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-100" aria-hidden="true">
                    <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${fill}%` }} />
                  </span>
                  {r.hired} of {r.openings} hired
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a href={`/careers/${r.slug}`} target="_blank" rel="noreferrer" className={btnSecondary}>
                  View ↗
                </a>
                <button type="button" className={btnSecondary} onClick={() => share(r)}>
                  Copy link
                </button>
                <Link href={`/admin/careers/jobs/${r.id}`} className={btnSecondary}>
                  Edit
                </Link>
                <button type="button" className={btnSecondary} disabled={pending} onClick={() => copy(r)}>
                  Duplicate
                </button>
                <button type="button" className={btnSecondary} disabled={pending} onClick={() => toggle(r)}>
                  {r.active ? "Close" : "Open"}
                </button>
                <button type="button" className={btnDanger} disabled={pending} onClick={() => remove(r)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {result && (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          {result.ok ? result.message : result.error}
        </p>
      )}
    </section>
  );
}
