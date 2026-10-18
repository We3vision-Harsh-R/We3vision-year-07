"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { bulkApplications, moveApplication } from "@/actions/hiring";
import { type AdminOption, type AppMeta, type HireRow, PIPELINE, interviewLabel, isActiveStage, stageOf, toCsv } from "@/lib/hiring-shared";
import { btnSecondary, card, inputClass } from "../ui";
import { ApplicationDrawer } from "./application-drawer";

// Careers > Applications, the hiring desk. Two views of the same applications:
//   Board: one column per step of the pipeline; drag a card to another column to move it.
//   List:  a table with check boxes; many applications can be moved, tagged, exported or removed at once.
// Search, filters and sorting work on both. A click opens the application (application-drawer.tsx).
// Seat-only tickets (a visitor booked a seat on the Careers page but did not give the details) are hidden unless "Seat-only tickets" is on.

type Job = { id: string; title: string; active: boolean };
type Sort = "new" | "old" | "rating" | "name";

const WEEK = 7 * 24 * 60 * 60_000;
const idKeys = (r: HireRow) => [r.email.trim().toLowerCase(), r.phone.replace(/\D/g, "").slice(-10)].filter((x) => x.length > 4);

export function HiringDesk({ rows, jobs, admins, me, initialJob = "", initialOpen = "" }: { rows: HireRow[]; jobs: Job[]; admins: AdminOption[]; me: string; initialJob?: string; initialOpen?: string }) {
  const [list, setList] = useState(rows);
  const [view, setView] = useState<"board" | "list">("board");
  const [q, setQ] = useState("");
  const [job, setJob] = useState(initialJob);
  const [source, setSource] = useState<"all" | "job" | "ticket">("all");
  const [step, setStep] = useState("all");
  const [tag, setTag] = useState("");
  const [who, setWho] = useState("all");
  const [sort, setSort] = useState<Sort>("new");
  const [starred, setStarred] = useState(false);
  const [seats, setSeats] = useState(false);
  const [open, setOpen] = useState(initialOpen && rows.some((r) => r.id === initialOpen) ? initialOpen : "");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [drag, setDrag] = useState("");
  const [over, setOver] = useState("");
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
  const [bulkTag, setBulkTag] = useState("");
  const [pending, start] = useTransition();
  const [now] = useState(() => Date.now());

  const say = (ok: boolean, text: string) => {
    setToast({ ok, text });
    window.setTimeout(() => setToast((t) => (t?.text === text ? null : t)), 4000);
  };

  // the same person (same e-mail or phone) applying more than once
  const dupes = useMemo(() => {
    const n = new Map<string, number>();
    for (const r of list) for (const k of idKeys(r)) n.set(k, (n.get(k) ?? 0) + 1);
    return n;
  }, [list]);
  const dupOf = (r: HireRow) => Math.max(1, ...idKeys(r).map((k) => dupes.get(k) ?? 1));
  const allTags = useMemo(() => [...new Set(list.flatMap((r) => r.meta.tags))].sort((a, b) => a.localeCompare(b)), [list]);
  const jobTitle = (r: HireRow) => r.roleTitle || jobs.find((j) => j.id === r.roleId)?.title || "General application";

  // everything except the step filter (the board shows every step; the counters count every step)
  const base = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const out = list.filter((r) => {
      if (!seats && r.stage !== "complete") return false;
      if (job && r.roleId !== job) return false;
      if (source === "job" && r.source !== "job") return false;
      if (source === "ticket" && r.source === "job") return false;
      if (starred && !r.meta.starred) return false;
      if (tag && !r.meta.tags.includes(tag)) return false;
      if (who === "me" && r.meta.assignee !== me) return false;
      if (who === "none" && r.meta.assignee) return false;
      if (who !== "all" && who !== "me" && who !== "none" && r.meta.assignee !== who) return false;
      if (words.length) {
        const hay = [r.name, r.email, r.phone, r.city, r.roleTitle, r.skills, r.experience, r.currentStatus, r.meta.tags.join(" ")].join(" ").toLowerCase();
        if (!words.every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    const by: Record<Sort, (a: HireRow, b: HireRow) => number> = {
      new: (a, b) => b.createdAt.localeCompare(a.createdAt),
      old: (a, b) => a.createdAt.localeCompare(b.createdAt),
      rating: (a, b) => b.meta.rating - a.meta.rating || Number(b.meta.starred) - Number(a.meta.starred) || b.createdAt.localeCompare(a.createdAt),
      name: (a, b) => (a.name || "~").localeCompare(b.name || "~"),
    };
    return out.sort(by[sort]);
  }, [list, q, job, source, starred, tag, who, me, seats, sort]);
  const shown = useMemo(() => (step === "all" ? base : step === "active" ? base.filter((r) => isActiveStage(r.status)) : base.filter((r) => r.status === step)), [base, step]);
  const count = (s: string) => base.filter((r) => r.status === s).length;
  const seatOnly = list.filter((r) => r.stage !== "complete").length;
  const thisWeek = base.filter((r) => now - Date.parse(r.createdAt) < WEEK).length;
  const interviews = base.filter((r) => r.meta.interview && Date.parse(r.meta.interview.at) >= now - 60 * 60_000).sort((a, b) => (a.meta.interview?.at ?? "").localeCompare(b.meta.interview?.at ?? ""));

  const patch = useCallback((id: string, p: { meta?: AppMeta; status?: string }) => setList((l) => l.map((r) => (r.id === id ? { ...r, ...(p.meta ? { meta: p.meta } : {}), ...(p.status ? { status: p.status } : {}) } : r))), []);

  const move = (id: string, status: string) => {
    const before = list.find((r) => r.id === id);
    if (!before || before.status === status) return;
    patch(id, { status });
    start(async () => {
      const res = await moveApplication(id, status);
      if (res.ok) {
        patch(id, { meta: res.meta });
        say(true, `${before.name || "Ticket"} → ${stageOf(status).label}`);
      } else {
        patch(id, { status: before.status });
        say(false, res.error);
      }
    });
  };

  const bulk = (op: { status?: string; tag?: string; remove?: boolean }) => {
    const ids = [...picked];
    if (!ids.length) return;
    if (op.remove && !window.confirm(`Remove ${ids.length} application${ids.length > 1 ? "s" : ""}? Their notes and timelines go too.`)) return;
    start(async () => {
      const res = await bulkApplications(ids, op);
      if (!res.ok) return say(false, res.error);
      say(true, res.message ?? "Done.");
      if (op.remove) {
        setList((l) => l.filter((r) => !picked.has(r.id)));
        setPicked(new Set());
      } else if (op.status) {
        const s = op.status;
        setList((l) => l.map((r) => (picked.has(r.id) ? { ...r, status: s } : r)));
      } else if (op.tag) {
        const t = op.tag;
        setList((l) => l.map((r) => (picked.has(r.id) && !r.meta.tags.includes(t) ? { ...r, meta: { ...r.meta, tags: [...r.meta.tags, t] } } : r)));
        setBulkTag("");
      }
    });
  };

  const exportCsv = (only: HireRow[]) => {
    const name = (id: string) => admins.find((a) => a.id === id)?.name ?? "";
    const head = ["Applied", "Name", "Email", "Phone", "Position", "Location", "Step", "Rating", "Starred", "Tags", "Looked after by", "Interview", "Experience", "Current status", "Notice period", "Can join", "Skills", "LinkedIn / portfolio", "Resume", "Came from"];
    const body = only.map((r) => [
      r.created,
      r.name,
      r.email,
      r.phone,
      jobTitle(r),
      r.city,
      stageOf(r.status).label,
      r.meta.rating || "",
      r.meta.starred ? "yes" : "",
      r.meta.tags.join("; "),
      name(r.meta.assignee),
      r.meta.interview ? `${interviewLabel(r.meta.interview.at)} (${r.meta.interview.mode})` : "",
      r.experience,
      r.currentStatus,
      r.noticePeriod,
      r.joinDate,
      r.skills,
      r.linkedin,
      r.resume ? new URL(r.resume, location.origin).href : "",
      r.source === "job" ? "Job page" : "Ticket office",
    ]);
    const url = URL.createObjectURL(new Blob([toCsv([head, ...body])], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `we3vision-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const togglePick = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allPicked = shown.length > 0 && shown.every((r) => picked.has(r.id));

  const order = view === "board" ? PIPELINE.flatMap((s) => base.filter((r) => r.status === s.value)) : shown;
  const at = order.findIndex((r) => r.id === open);
  const cur = list.find((r) => r.id === open);

  const renderCard = (r: HireRow) => (
    <button
      key={r.id}
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", r.id);
        e.dataTransfer.effectAllowed = "move";
        setDrag(r.id);
      }}
      onDragEnd={() => {
        setDrag("");
        setOver("");
      }}
      onClick={() => setOpen(r.id)}
      className={`block w-full rounded-xl border bg-white p-3 text-left shadow-sm transition hover:border-brand/40 hover:shadow ${drag === r.id ? "opacity-40" : ""} ${r.meta.starred ? "border-amber-300" : "border-zinc-200"}`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-semibold text-zinc-900">{r.name || "Seat only"}</span>
        {r.meta.rating > 0 && <span className="shrink-0 text-xs text-amber-500">{"★".repeat(r.meta.rating)}</span>}
      </span>
      <span className="mt-0.5 block truncate text-xs text-zinc-500">{[jobTitle(r), r.city].filter(Boolean).join(" · ")}</span>
      <span className="mt-2 flex flex-wrap gap-1 text-[11px]">
        {r.meta.interview && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">{interviewLabel(r.meta.interview.at)}</span>}
        {dupOf(r) > 1 && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">{dupOf(r)}×</span>}
        {r.stage !== "complete" && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">seat only</span>}
        {r.meta.tags.slice(0, 2).map((t) => (
          <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">
            {t}
          </span>
        ))}
      </span>
      <span className="mt-2 block text-[11px] text-zinc-400">{r.created}</span>
    </button>
  );

  return (
    <div className="space-y-5">
      {/* numbers */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className={card}>
          <p className="text-sm text-zinc-500">Applications</p>
          <p className="mt-1 text-3xl font-bold">{base.length}</p>
          <p className="mt-1 text-xs text-zinc-400">{thisWeek} this week</p>
        </div>
        <button type="button" className={`${card} text-left transition hover:border-brand/40`} onClick={() => {
            setView("list");
            setStep("new");
          }}>
          <p className="text-sm text-zinc-500">Waiting for a reply</p>
          <p className="mt-1 text-3xl font-bold text-brand">{count("new")}</p>
          <p className="mt-1 text-xs text-zinc-400">step “New”</p>
        </button>
        <div className={card}>
          <p className="text-sm text-zinc-500">In process</p>
          <p className="mt-1 text-3xl font-bold">{base.filter((r) => isActiveStage(r.status) && r.status !== "new").length}</p>
          <p className="mt-1 text-xs text-zinc-400">contacted → offer</p>
        </div>
        <div className={card}>
          <p className="text-sm text-zinc-500">Hired</p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{count("hired")}</p>
          <p className="mt-1 text-xs text-zinc-400">{count("rejected")} not now</p>
        </div>
      </div>

      {interviews.length > 0 && (
        <section className={`${card} !py-4`}>
          <h2 className="text-sm font-semibold">Next interviews</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {interviews.slice(0, 8).map((r) => (
              <li key={r.id}>
                <button type="button" className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-100" onClick={() => setOpen(r.id)}>
                  <b>{interviewLabel(r.meta.interview?.at ?? "")}</b> · {r.name} · {jobTitle(r)}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* tools */}
      <section className={`${card} !p-4 space-y-3`}>
        <div className="flex flex-wrap items-center gap-2">
          <input className={`${inputClass} !mt-0 !w-72`} type="search" placeholder="Search name, e-mail, phone, skills, city…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
          <select className={`${inputClass} !mt-0 !w-auto`} value={job} onChange={(e) => setJob(e.target.value)} aria-label="Job">
            <option value="">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
                {j.active ? "" : " (closed)"}
              </option>
            ))}
          </select>
          <select className={`${inputClass} !mt-0 !w-auto`} value={source} onChange={(e) => setSource(e.target.value as typeof source)} aria-label="Came from">
            <option value="all">Job page + ticket office</option>
            <option value="job">Job page</option>
            <option value="ticket">Ticket office</option>
          </select>
          <select className={`${inputClass} !mt-0 !w-auto`} value={who} onChange={(e) => setWho(e.target.value)} aria-label="Looked after by">
            <option value="all">Everybody’s</option>
            <option value="me">Mine</option>
            <option value="none">Nobody looks after</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {allTags.length > 0 && (
            <select className={`${inputClass} !mt-0 !w-auto`} value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Tag">
              <option value="">All tags</option>
              {allTags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          )}
          <select className={`${inputClass} !mt-0 !w-auto`} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="rating">Best rated first</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-zinc-300 p-0.5" role="group" aria-label="View">
            {(["board", "list"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-md px-3 py-1.5 text-sm font-medium ${view === v ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"}`}>
                {v === "board" ? "Board" : "List"}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700">
            <input type="checkbox" checked={starred} onChange={(e) => setStarred(e.target.checked)} /> Starred only
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700">
            <input type="checkbox" checked={seats} onChange={(e) => setSeats(e.target.checked)} /> Seat-only tickets ({seatOnly})
          </label>
          <button type="button" className={`${btnSecondary} ml-auto`} onClick={() => exportCsv(shown)} disabled={!shown.length}>
            Export CSV ({shown.length})
          </button>
        </div>
      </section>

      {view === "board" ? (
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
          {PIPELINE.map((s) => {
            const col = base.filter((r) => r.status === s.value);
            return (
              <section
                key={s.value}
                aria-label={s.label}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (over !== s.value) setOver(s.value);
                }}
                onDragLeave={() => setOver((o) => (o === s.value ? "" : o))}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/plain") || drag;
                  setOver("");
                  setDrag("");
                  if (id) move(id, s.value);
                }}
                className={`flex w-64 shrink-0 flex-col rounded-2xl border p-2 transition ${over === s.value ? "border-brand bg-brand/5" : "border-zinc-200 bg-zinc-50"}`}
              >
                <h3 className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-zinc-800">
                  <span className={`size-2.5 rounded-full ${s.dot}`} aria-hidden="true" />
                  {s.label}
                  <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium text-zinc-500">{col.length}</span>
                </h3>
                <div className="mt-1 flex max-h-[62vh] min-h-24 flex-col gap-2 overflow-y-auto p-0.5">
                  {col.map(renderCard)}
                  {col.length === 0 && <p className="px-2 py-6 text-center text-xs text-zinc-400">Drop here</p>}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <section className={`${card} !p-0 overflow-hidden`}>
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 px-4 py-3">
            <select className={`${inputClass} !mt-0 !w-auto`} value={step} onChange={(e) => setStep(e.target.value)} aria-label="Step">
              <option value="all">Every step ({base.length})</option>
              <option value="active">Still in the race ({base.filter((r) => isActiveStage(r.status)).length})</option>
              {PIPELINE.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({count(s.value)})
                </option>
              ))}
            </select>
            {picked.size > 0 && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-white">
                <b>{picked.size} chosen</b>
                <select
                  className="rounded-md bg-white/10 px-2 py-1 text-sm text-white"
                  value=""
                  disabled={pending}
                  onChange={(e) => e.target.value && bulk({ status: e.target.value })}
                  aria-label="Move the chosen to"
                >
                  <option value="" className="text-zinc-900">
                    Move to…
                  </option>
                  {PIPELINE.map((s) => (
                    <option key={s.value} value={s.value} className="text-zinc-900">
                      {s.label}
                    </option>
                  ))}
                </select>
                <input
                  className="w-28 rounded-md bg-white/10 px-2 py-1 text-sm text-white placeholder:text-white/50"
                  placeholder="Tag + Enter"
                  value={bulkTag}
                  maxLength={30}
                  list="hire-tags-bulk"
                  onChange={(e) => setBulkTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && bulkTag.trim()) {
                      e.preventDefault();
                      bulk({ tag: bulkTag.trim() });
                    }
                  }}
                />
                <datalist id="hire-tags-bulk">
                  {allTags.map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
                <button type="button" className="rounded-md bg-white/10 px-2 py-1 hover:bg-white/20" onClick={() => exportCsv(list.filter((r) => picked.has(r.id)))}>
                  Export
                </button>
                <button type="button" className="rounded-md bg-rose-500/80 px-2 py-1 hover:bg-rose-500" disabled={pending} onClick={() => bulk({ remove: true })}>
                  Remove
                </button>
                <button type="button" className="px-1 text-white/70 hover:text-white" onClick={() => setPicked(new Set())} aria-label="Clear the choice">
                  ✕
                </button>
              </div>
            )}
          </div>
          {shown.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-zinc-500">No applications here. Change the search or the filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="w-10 px-4 py-2">
                      <input type="checkbox" checked={allPicked} onChange={() => setPicked(allPicked ? new Set() : new Set(shown.map((r) => r.id)))} aria-label="Choose all" />
                    </th>
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2">Position</th>
                    <th className="px-2 py-2">Step</th>
                    <th className="px-2 py-2">Rating</th>
                    <th className="px-2 py-2">Tags</th>
                    <th className="px-2 py-2">Applied</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {shown.map((r) => {
                    const s = stageOf(r.status);
                    return (
                      <tr key={r.id} className={`cursor-pointer hover:bg-zinc-50 ${picked.has(r.id) ? "bg-brand/5" : ""}`} onClick={() => setOpen(r.id)}>
                        <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" checked={picked.has(r.id)} onChange={() => togglePick(r.id)} aria-label={`Choose ${r.name || "ticket"}`} />
                        </td>
                        <td className="max-w-56 px-2 py-2.5">
                          <p className="truncate font-medium text-zinc-900">
                            {r.meta.starred && <span className="text-amber-500">★ </span>}
                            {r.name || "Seat only"}
                            {dupOf(r) > 1 && <span className="ml-1 rounded-full bg-amber-50 px-1.5 text-[11px] text-amber-700">{dupOf(r)}×</span>}
                          </p>
                          <p className="truncate text-xs text-zinc-500">{r.email || r.city}</p>
                        </td>
                        <td className="max-w-48 truncate px-2 py-2.5 text-zinc-700">{jobTitle(r)}</td>
                        <td className="px-2 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <select className={`rounded-full border-0 px-2 py-1 text-xs font-medium ${s.chip}`} value={r.status} disabled={pending} onChange={(e) => move(r.id, e.target.value)} aria-label="Step">
                            {PIPELINE.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-2.5 text-amber-500">{r.meta.rating ? "★".repeat(r.meta.rating) : <span className="text-zinc-300">–</span>}</td>
                        <td className="max-w-40 px-2 py-2.5">
                          <span className="flex flex-wrap gap-1">
                            {r.meta.tags.slice(0, 3).map((t) => (
                              <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                                {t}
                              </span>
                            ))}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5 text-xs text-zinc-500">{r.created}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {cur && (
        <ApplicationDrawer
          key={cur.id}
          row={cur}
          admins={admins}
          allTags={allTags}
          duplicates={dupOf(cur)}
          position={at >= 0 ? `${at + 1} of ${order.length}` : "1 of 1"}
          onChange={patch}
          onRemoved={(id) => {
            setList((l) => l.filter((r) => r.id !== id));
            setOpen("");
            say(true, "The application is removed.");
          }}
          onClose={() => setOpen("")}
          onPrev={at > 0 ? () => setOpen(order[at - 1].id) : undefined}
          onNext={at >= 0 && at < order.length - 1 ? () => setOpen(order[at + 1].id) : undefined}
        />
      )}

      {toast && (
        <p role="status" className={`fixed bottom-5 right-5 z-[60] rounded-xl px-4 py-3 text-sm shadow-lg ${toast.ok ? "bg-zinc-900 text-white" : "bg-rose-600 text-white"}`}>
          {toast.text}
        </p>
      )}
      {pending && <span className="sr-only">Saving…</span>}
      {!list.length && <p className={`${card} text-sm text-zinc-500`}>No applications yet. They come here when visitors apply on a job page or book a seat on the Careers page.</p>}
      <p className="text-xs text-zinc-400">
        Tip: drag a card to another column to move it. In an open application, ← and → go to the previous / next one, Esc closes it.
      </p>
    </div>
  );
}
