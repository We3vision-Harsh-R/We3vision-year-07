"use client";

import { useEffect, useState, useTransition } from "react";
import {
  type HireResult,
  addApplicationNote,
  deleteApplicationNote,
  logApplicationMessage,
  moveApplication,
  removeApplication,
  scheduleInterview,
  updateApplicationMeta,
} from "@/actions/hiring";
import {
  type AdminOption,
  type AppMeta,
  type HireRow,
  INTERVIEW_MODES,
  PIPELINE,
  TEMPLATES,
  calendarLink,
  fillTemplate,
  interviewLabel,
  stageOf,
  waDigits,
} from "@/lib/hiring-shared";
import { btnDanger, btnPrimary, btnSecondary, inputClass, labelClass } from "../ui";

// Careers > Applications: one application, opened from the board or the list. Everything HR does on it is here: the step, a rating, a star,
// tags, who looks after it, the interview, a ready message for WhatsApp or e-mail, notes, and the timeline of all of it.
// Keys: Esc closes, ← → go to the previous / next application of the list.

const Row = ({ k, v }: { k: string; v: React.ReactNode }) =>
  v ? (
    <div className="grid grid-cols-[150px_1fr] gap-3 border-b border-zinc-100 py-2 text-sm">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="min-w-0 whitespace-pre-line break-words text-zinc-900">{v}</dd>
    </div>
  ) : null;

const KIND_DOT: Record<string, string> = {
  status: "bg-sky-500",
  note: "bg-zinc-800",
  interview: "bg-amber-500",
  assign: "bg-indigo-500",
  message: "bg-emerald-600",
  tag: "bg-cyan-600",
};
const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
};

type Props = {
  row: HireRow;
  admins: AdminOption[];
  allTags: string[];
  duplicates: number;
  position: string;
  onChange: (id: string, patch: { meta?: AppMeta; status?: string }) => void;
  onRemoved: (id: string) => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export function ApplicationDrawer({ row, admins, allTags, duplicates, position, onChange, onRemoved, onClose, onPrev, onNext }: Props) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [tag, setTag] = useState("");
  const [note, setNote] = useState("");
  const iv = row.meta.interview;
  const [ivAt, setIvAt] = useState(iv?.at ?? "");
  const [ivMode, setIvMode] = useState(iv?.mode ?? INTERVIEW_MODES[0]);
  const [ivPlace, setIvPlace] = useState(iv?.place ?? "");
  const [ivWith, setIvWith] = useState(iv?.with ?? "");
  const [tpl, setTpl] = useState<string>(TEMPLATES[0].id);
  const vars = { name: row.name || "there", position: row.roleTitle || "the position", ...(iv ? { date: interviewLabel(iv.at), place: iv.place || iv.mode } : {}) };
  const t = TEMPLATES.find((x) => x.id === tpl) ?? TEMPLATES[0];
  const [draft, setDraft] = useState(() => fillTemplate(t.text, vars));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && onPrev) onPrev();
      else if (e.key === "ArrowRight" && onNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const run = (job: () => Promise<HireResult>, after?: () => void) =>
    start(async () => {
      const res = await job();
      if (!res.ok) {
        setMsg({ ok: false, text: res.error });
        return;
      }
      onChange(row.id, { meta: res.meta, status: res.status });
      if (res.message) setMsg({ ok: true, text: res.message });
      after?.();
    });

  const setTags = (tags: string[]) => run(() => updateApplicationMeta(row.id, { tags }));
  const addTag = () => {
    const v = tag.trim().slice(0, 30);
    if (!v || row.meta.tags.includes(v)) return setTag("");
    setTags([...row.meta.tags, v]);
    setTag("");
  };
  const pickTemplate = (id: string) => {
    setTpl(id);
    const next = TEMPLATES.find((x) => x.id === id) ?? TEMPLATES[0];
    setDraft(fillTemplate(next.text, vars));
  };
  const sendWhatsApp = () => {
    const d = waDigits(row.phone);
    if (!d) return setMsg({ ok: false, text: "This application has no phone number." });
    window.open(`https://wa.me/${d}?text=${encodeURIComponent(draft)}`, "_blank", "noopener,noreferrer");
    run(() => logApplicationMessage(row.id, tpl, "WhatsApp"));
  };
  const sendMail = () => {
    if (!row.email) return setMsg({ ok: false, text: "This application has no e-mail address." });
    window.location.href = `mailto:${row.email}?subject=${encodeURIComponent(fillTemplate(t.subject, vars))}&body=${encodeURIComponent(draft)}`;
    run(() => logApplicationMessage(row.id, tpl, "E-mail"));
  };
  const remove = () => {
    if (!window.confirm(`Remove the application of ${row.name || row.city}? Its notes and timeline go too.`)) return;
    start(async () => {
      const res = await removeApplication(row.id);
      if (res.ok) onRemoved(row.id);
      else setMsg({ ok: false, text: res.error });
    });
  };

  const stage = stageOf(row.status);
  const cal = iv ? calendarLink(iv, row.name, row.roleTitle) : "";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Application of ${row.name || "a visitor"}`}
        className="flex h-full w-full max-w-[680px] flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start gap-3 border-b border-zinc-200 px-6 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-zinc-400">
              {position} · applied {row.created} · {row.source === "job" ? "job page" : "ticket office"}
            </p>
            <h2 className="mt-1 flex flex-wrap items-center gap-2 text-xl font-bold">
              <span className="break-words">{row.name || "Seat only (no details yet)"}</span>
              {duplicates > 1 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">applied {duplicates}×</span>}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">{[row.roleTitle, row.city].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="flex shrink-0 gap-1">
            <button type="button" className={btnSecondary} disabled={!onPrev} onClick={onPrev} aria-label="Previous application">
              ←
            </button>
            <button type="button" className={btnSecondary} disabled={!onNext} onClick={onNext} aria-label="Next application">
              →
            </button>
            <button type="button" className={btnSecondary} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* step, star, rating */}
          <section className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700">
              <span className={`size-2.5 rounded-full ${stage.dot}`} aria-hidden="true" />
              <select className={`${inputClass} !mt-0 !w-auto`} value={row.status} disabled={pending} onChange={(e) => run(() => moveApplication(row.id, e.target.value))} aria-label="Step">
                {PIPELINE.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${row.meta.starred ? "border-amber-300 bg-amber-50 text-amber-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"}`}
              aria-pressed={row.meta.starred}
              disabled={pending}
              onClick={() => run(() => updateApplicationMeta(row.id, { starred: !row.meta.starred }))}
            >
              {row.meta.starred ? "★ Starred" : "☆ Star"}
            </button>
            <div className="flex items-center gap-0.5" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={pending}
                  aria-label={`Rate ${n} of 5`}
                  aria-pressed={row.meta.rating >= n}
                  className={`text-2xl leading-none transition ${row.meta.rating >= n ? "text-amber-500" : "text-zinc-300 hover:text-amber-300"}`}
                  onClick={() => run(() => updateApplicationMeta(row.id, { rating: row.meta.rating === n ? 0 : n }))}
                >
                  ★
                </button>
              ))}
            </div>
            <label className="ml-auto flex items-center gap-2 text-sm text-zinc-600">
              Looked after by
              <select className={`${inputClass} !mt-0 !w-auto`} value={row.meta.assignee} disabled={pending} onChange={(e) => run(() => updateApplicationMeta(row.id, { assignee: e.target.value }))}>
                <option value="">Nobody</option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {/* contact */}
          <section className="flex flex-wrap gap-2">
            {row.email && (
              <a className={btnSecondary} href={`mailto:${row.email}`}>
                E-mail
              </a>
            )}
            {row.phone && (
              <>
                <a className={btnSecondary} href={`https://wa.me/${waDigits(row.phone)}`} target="_blank" rel="noreferrer noopener">
                  WhatsApp
                </a>
                <a className={btnSecondary} href={`tel:${row.phone.replace(/[^\d+]/g, "")}`}>
                  Call
                </a>
              </>
            )}
            {row.resume && (
              <a className={btnPrimary} href={row.resume} target="_blank" rel="noreferrer">
                Resume ↓
              </a>
            )}
            {/^https?:\/\//i.test(row.linkedin) && (
              <a className={btnSecondary} href={row.linkedin} target="_blank" rel="noreferrer noopener nofollow">
                LinkedIn / portfolio ↗
              </a>
            )}
          </section>

          {/* tags */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-800">Tags</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {row.meta.tags.map((x) => (
                <span key={x} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 py-1 pl-3 pr-1 text-xs font-medium text-zinc-700">
                  {x}
                  <button type="button" className="grid size-5 place-items-center rounded-full hover:bg-zinc-200" aria-label={`Remove tag ${x}`} disabled={pending} onClick={() => setTags(row.meta.tags.filter((y) => y !== x))}>
                    ×
                  </button>
                </span>
              ))}
              <input
                className={`${inputClass} !mt-0 !w-44 !py-1.5`}
                placeholder="Add a tag + Enter"
                value={tag}
                list="hire-tags"
                maxLength={30}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <datalist id="hire-tags">
                {allTags.map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
            </div>
          </section>

          {/* interview */}
          <section className="rounded-xl border border-zinc-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-800">Interview</h3>
              {iv && (
                <p className="text-sm text-zinc-600">
                  <b className="text-zinc-900">{interviewLabel(iv.at)}</b> · {iv.mode}
                  {cal && (
                    <a className="ml-2 text-brand underline" href={cal} target="_blank" rel="noreferrer noopener">
                      Add to Google Calendar
                    </a>
                  )}
                </p>
              )}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className={labelClass}>
                Day and time
                <input type="datetime-local" className={inputClass} value={ivAt} onChange={(e) => setIvAt(e.target.value)} />
              </label>
              <label className={labelClass}>
                How
                <select className={inputClass} value={ivMode} onChange={(e) => setIvMode(e.target.value)}>
                  {INTERVIEW_MODES.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Place or video link
                <input className={inputClass} value={ivPlace} maxLength={300} onChange={(e) => setIvPlace(e.target.value)} />
              </label>
              <label className={labelClass}>
                Interviewer
                <input className={inputClass} value={ivWith} maxLength={80} onChange={(e) => setIvWith(e.target.value)} />
              </label>
            </div>
            <div className="mt-3 flex gap-2">
              <button type="button" className={btnPrimary} disabled={pending || !ivAt} onClick={() => run(() => scheduleInterview(row.id, { at: ivAt, mode: ivMode, place: ivPlace, with: ivWith }))}>
                {iv ? "Save the interview" : "Plan the interview"}
              </button>
              {iv && (
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={pending}
                  onClick={() =>
                    run(
                      () => scheduleInterview(row.id, { at: "" }),
                      () => setIvAt(""),
                    )
                  }
                >
                  Cancel interview
                </button>
              )}
            </div>
          </section>

          {/* ready messages */}
          <section className="rounded-xl border border-zinc-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-800">Send a message</h3>
              <select className={`${inputClass} !mt-0 !w-auto`} value={tpl} onChange={(e) => pickTemplate(e.target.value)} aria-label="Message">
                {TEMPLATES.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea className={`${inputClass} min-h-40 font-[inherit]`} value={draft} maxLength={3000} onChange={(e) => setDraft(e.target.value)} aria-label="Message text" />
            <p className="mt-1 text-xs text-zinc-400">Change the words if you like. The message opens in your own WhatsApp or e-mail; nothing is sent by the website.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btnPrimary} disabled={pending || !row.phone} onClick={sendWhatsApp}>
                WhatsApp
              </button>
              <button type="button" className={btnSecondary} disabled={pending || !row.email} onClick={sendMail}>
                E-mail
              </button>
              <button
                type="button"
                className={btnSecondary}
                onClick={() =>
                  navigator.clipboard
                    ?.writeText(draft)
                    .then(() => setMsg({ ok: true, text: "Copied." }))
                    .catch(() => setMsg({ ok: false, text: "Could not copy." }))
                }
              >
                Copy
              </button>
            </div>
          </section>

          {/* notes + timeline */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-800">Notes and timeline</h3>
            <div className="mt-2 flex gap-2">
              <textarea className={`${inputClass} !mt-0 min-h-16`} placeholder="A note for HR (only seen here)" value={note} maxLength={2000} onChange={(e) => setNote(e.target.value)} />
              <button
                type="button"
                className={`${btnPrimary} self-start`}
                disabled={pending || !note.trim()}
                onClick={() =>
                  run(
                    () => addApplicationNote(row.id, note),
                    () => setNote(""),
                  )
                }
              >
                Add
              </button>
            </div>
            <ol className="mt-4 space-y-3 border-l border-zinc-200 pl-4">
              {row.meta.timeline.map((e) => (
                <li key={e.id} className="relative">
                  <span className={`absolute -left-[21px] top-1.5 size-2.5 rounded-full ring-4 ring-white ${KIND_DOT[e.kind] ?? "bg-zinc-400"}`} aria-hidden="true" />
                  <p className={`whitespace-pre-line break-words text-sm ${e.kind === "note" ? "rounded-lg bg-zinc-50 px-3 py-2 text-zinc-800" : "text-zinc-700"}`}>{e.text}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                    {e.by} · {when(e.at)}
                    {e.kind === "note" && (
                      <button type="button" className="text-rose-500 hover:underline" disabled={pending} onClick={() => run(() => deleteApplicationNote(row.id, e.id))}>
                        remove
                      </button>
                    )}
                  </p>
                </li>
              ))}
              {row.oldNote && (
                <li className="relative">
                  <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-zinc-800 ring-4 ring-white" aria-hidden="true" />
                  <p className="whitespace-pre-line rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-800">{row.oldNote}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">earlier note</p>
                </li>
              )}
              <li className="relative">
                <span className="absolute -left-[21px] top-1.5 size-2.5 rounded-full bg-brand ring-4 ring-white" aria-hidden="true" />
                <p className="text-sm text-zinc-700">Applied {row.source === "job" ? "on the job page" : "at the ticket office"}</p>
                <p className="mt-0.5 text-xs text-zinc-400">Website · {row.created}</p>
              </li>
            </ol>
          </section>

          {/* what the visitor sent */}
          <section>
            <h3 className="text-sm font-semibold text-zinc-800">What they sent</h3>
            <dl className="mt-2">
              <Row k="Position" v={row.roleTitle} />
              <Row k="Location" v={row.city} />
              <Row k="Current status" v={row.currentStatus} />
              <Row k="Can join" v={row.joinDate} />
              <Row k="Notice period" v={row.noticePeriod} />
              <Row k="Call slot with HR" v={row.callSlot} />
              <Row k="Email" v={row.email} />
              <Row k="Phone" v={row.phone} />
              <Row k="LinkedIn / portfolio" v={row.linkedin} />
              <Row k="Skills" v={row.skills} />
              <Row k="Experience" v={row.experience} />
              {row.answers.map((a, i) => (
                <Row key={i} k={a.q} v={a.a} />
              ))}
            </dl>
          </section>

          <section className="border-t border-zinc-100 pt-4">
            <button type="button" className={btnDanger} disabled={pending} onClick={remove}>
              Remove this application
            </button>
          </section>
        </div>

        {msg && (
          <p role="status" className={`border-t px-6 py-3 text-sm ${msg.ok ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-rose-100 bg-rose-50 text-rose-700"}`}>
            {msg.text}
          </p>
        )}
      </aside>
    </div>
  );
}
