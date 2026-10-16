"use client";

import { useState, useTransition } from "react";
import { deleteApplication, setApplicationStatus } from "@/actions/careers";
import type { ActionResult } from "@/actions/types";
import { APPLICATION_STATUSES } from "@/lib/careers-shared";
import { btnDanger, btnPrimary, card, inputClass, labelClass } from "./ui";

// Careers in the admin panel: the tickets that visitors have booked. A ticket with only a city is a visitor who booked a seat and did not
// give the passenger details ("Seat only"); with the details it is "Complete".

export type ApplicationRow = {
  id: string;
  city: string;
  currentStatus: string;
  roleTitle: string;
  joinDate: string;
  noticePeriod: string;
  callSlot: string;
  resume: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  skills: string;
  experience: string;
  answers: { q: string; a: string }[];
  stage: string;
  status: string;
  note: string;
  created: string;
  /** ticket (the ticket office) | job (the apply form of a job page) */
  source: string;
  roleId: string;
};

const Row = ({ k, v }: { k: string; v: React.ReactNode }) =>
  v ? (
    <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-zinc-100 py-2 text-sm">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="min-w-0 break-words text-zinc-900">{v}</dd>
    </div>
  ) : null;

export function CareersApplications({ rows, initialJob = "" }: { rows: ApplicationRow[]; initialJob?: string }) {
  const [list, setList] = useState(rows);
  const [sel, setSel] = useState(rows[0]?.id ?? "");
  const [note, setNote] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [filter, setFilter] = useState("all");
  const [job, setJob] = useState(initialJob);
  const [pending, start] = useTransition();

  // the jobs that have applications (by position name)
  const jobs = [...new Map(list.filter((r) => r.roleId).map((r) => [r.roleId, r.roleTitle])).entries()];
  const shown = list
    .filter((r) => (job ? r.roleId === job : true))
    .filter((r) => (filter === "all" ? true : filter === "complete" ? r.stage === "complete" : filter === "seat" ? r.stage !== "complete" : filter === "job" ? r.source === "job" : filter === "ticket" ? r.source !== "job" : r.status === filter));
  const cur = list.find((r) => r.id === sel) ?? null;

  const save = (r: ApplicationRow, status: string) =>
    start(async () => {
      const res = await setApplicationStatus(r.id, status, note[r.id] ?? r.note);
      setResult(res);
      if (res.ok) setList((l) => l.map((x) => (x.id === r.id ? { ...x, status, note: note[r.id] ?? r.note } : x)));
    });
  const remove = (r: ApplicationRow) => {
    if (!window.confirm(`Remove the ticket of ${r.name || r.city}?`)) return;
    start(async () => {
      const res = await deleteApplication(r.id);
      setResult(res);
      if (res.ok) {
        setList((l) => l.filter((x) => x.id !== r.id));
        setSel("");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <section className={`${card} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Tickets <span className="text-sm font-normal text-zinc-400">({shown.length})</span>
          </h2>
          <select className={`${inputClass} !mt-0 !w-auto`} value={job} onChange={(e) => setJob(e.target.value)} aria-label="Job">
            <option value="">All jobs</option>
            {jobs.map(([id, title]) => (
              <option key={id} value={id}>
                {title}
              </option>
            ))}
          </select>
          <select className={`${inputClass} !mt-0 !w-auto`} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
            <option value="all">All</option>
            <option value="job">Applied on a job page</option>
            <option value="ticket">Ticket of the ticket office</option>
            <option value="complete">With passenger details</option>
            <option value="seat">Seat only (no details)</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {shown.length === 0 && <p className="text-sm text-zinc-500">No tickets yet. They appear here when visitors book a seat on the Careers page.</p>}
        <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200">
          {shown.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => setSel(r.id)} className={`block w-full px-4 py-3 text-left transition hover:bg-zinc-50 ${r.id === sel ? "bg-brand/5" : ""}`}>
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-medium">{r.name || "Seat only"}</span>
                  <span className="shrink-0 text-xs text-zinc-400">{r.created}</span>
                </span>
                <span className="mt-0.5 block truncate text-sm text-zinc-500">
                  {r.city}
                  {r.roleTitle ? ` → ${r.roleTitle}` : ""}
                </span>
                <span className="mt-1 flex flex-wrap gap-2 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${r.source === "job" ? "bg-brand/10 text-brand" : "bg-sky-100 text-sky-800"}`}>{r.source === "job" ? "Job page" : "Ticket"}</span>
                  <span className={`rounded-full px-2 py-0.5 ${r.stage === "complete" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{r.stage === "complete" ? "Complete" : "Seat only"}</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">{APPLICATION_STATUSES.find((s) => s.value === r.status)?.label ?? r.status}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${card} space-y-4`}>
        {cur ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{cur.name || "Seat only (no passenger details)"}</h2>
                <p className="text-sm text-zinc-500">Booked {cur.created}</p>
              </div>
              <button type="button" className={btnDanger} disabled={pending} onClick={() => remove(cur)}>
                Remove
              </button>
            </div>
            <dl>
              <Row k="Came from" v={cur.source === "job" ? "The apply form of a job page" : "The ticket office"} />
              <Row k="Location" v={cur.city} />
              <Row k="Position" v={cur.roleTitle} />
              <Row k="Current status" v={cur.currentStatus} />
              <Row k="Can join" v={cur.joinDate} />
              <Row k="Notice period" v={cur.noticePeriod} />
              <Row k="Call slot with HR" v={cur.callSlot} />
              <Row
                k="Resume"
                v={
                  cur.resume ? (
                    <a href={cur.resume} className="text-brand underline" target="_blank" rel="noreferrer">
                      Download
                    </a>
                  ) : null
                }
              />
              <Row k="Email" v={cur.email ? <a href={`mailto:${cur.email}`} className="text-brand underline">{cur.email}</a> : null} />
              <Row k="Phone" v={cur.phone} />
              <Row k="LinkedIn / portfolio" v={cur.linkedin} />
              <Row k="Skills" v={cur.skills} />
              <Row k="Experience" v={cur.experience} />
              {cur.answers.map((a, i) => (
                <Row key={i} k={a.q} v={a.a} />
              ))}
            </dl>
            <div className="space-y-3 border-t border-zinc-100 pt-4">
              <label className={labelClass}>
                Status
                <select className={inputClass} value={cur.status} disabled={pending} onChange={(e) => save(cur, e.target.value)}>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Note (only for HR)
                <textarea className={`${inputClass} min-h-20`} value={note[cur.id] ?? cur.note} maxLength={1000} onChange={(e) => setNote({ ...note, [cur.id]: e.target.value })} />
              </label>
              <button type="button" className={btnPrimary} disabled={pending} onClick={() => save(cur, cur.status)}>
                {pending ? "Saving…" : "Save note"}
              </button>
              {result && (
                <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
                  {result.ok ? result.message : result.error}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500">Choose a ticket in the list.</p>
        )}
      </section>
    </div>
  );
}
