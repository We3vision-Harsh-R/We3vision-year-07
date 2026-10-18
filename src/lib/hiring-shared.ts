// The hiring desk of the admin panel (Careers): the pipeline, the extra facts HR keeps on an application, the message templates and the
// CSV export. Shared by the server (actions/hiring.ts, lib/hiring.ts) and the admin screens. No server-only imports.

/** the pipeline, in order; "hold" and "rejected" sit beside it */
export const PIPELINE = [
  { value: "new", label: "New", dot: "bg-sky-500", chip: "bg-sky-100 text-sky-800" },
  { value: "contacted", label: "Contacted", dot: "bg-indigo-500", chip: "bg-indigo-100 text-indigo-800" },
  { value: "shortlisted", label: "Shortlisted", dot: "bg-cyan-600", chip: "bg-cyan-100 text-cyan-800" },
  { value: "interview", label: "Interview", dot: "bg-amber-500", chip: "bg-amber-100 text-amber-800" },
  { value: "offer", label: "Offer sent", dot: "bg-lime-600", chip: "bg-lime-100 text-lime-800" },
  { value: "hired", label: "Hired", dot: "bg-emerald-600", chip: "bg-emerald-100 text-emerald-800" },
  { value: "hold", label: "On hold", dot: "bg-zinc-400", chip: "bg-zinc-100 text-zinc-700" },
  { value: "rejected", label: "Not now", dot: "bg-rose-500", chip: "bg-rose-100 text-rose-700" },
] as const;
export type StageValue = (typeof PIPELINE)[number]["value"];
export const stageOf = (v: string) => PIPELINE.find((s) => s.value === v) ?? PIPELINE[0];
export const isStage = (v: unknown): v is StageValue => PIPELINE.some((s) => s.value === v);
/** still in the race (not hired, not "not now") */
export const isActiveStage = (v: string) => v !== "hired" && v !== "rejected";

export const INTERVIEW_MODES = ["In the office", "Video call", "Phone call"] as const;

export type TimelineEntry = {
  id: string;
  /** ISO date-time */
  at: string;
  /** name of the admin, or "Website" */
  by: string;
  kind: "status" | "note" | "interview" | "assign" | "message" | "tag";
  text: string;
};
export type Interview = { at: string; mode: string; place: string; with: string };
export type AppMeta = {
  rating: number;
  tags: string[];
  starred: boolean;
  /** id of the admin user who looks after this application ("" = nobody) */
  assignee: string;
  interview: Interview | null;
  timeline: TimelineEntry[];
};
export const EMPTY_META: AppMeta = { rating: 0, tags: [], starred: false, assignee: "", interview: null, timeline: [] };

/** a value read from the database, made safe */
export function cleanMeta(v: unknown): AppMeta {
  const m = (v && typeof v === "object" ? v : {}) as Partial<Record<keyof AppMeta, unknown>>;
  const str = (x: unknown, max: number) => (typeof x === "string" ? x.slice(0, max) : "");
  const iv = m.interview && typeof m.interview === "object" ? (m.interview as Record<string, unknown>) : null;
  return {
    rating: Math.min(5, Math.max(0, Math.round(Number(m.rating) || 0))),
    tags: Array.isArray(m.tags) ? [...new Set(m.tags.map((t) => str(t, 30).trim()).filter(Boolean))].slice(0, 12) : [],
    starred: m.starred === true,
    assignee: str(m.assignee, 40),
    interview: iv && str(iv.at, 20) ? { at: str(iv.at, 20), mode: str(iv.mode, 30), place: str(iv.place, 300), with: str(iv.with, 80) } : null,
    timeline: Array.isArray(m.timeline)
      ? m.timeline
          .filter((e): e is Record<string, unknown> => Boolean(e) && typeof e === "object")
          .map((e) => ({
            id: str(e.id, 20),
            at: str(e.at, 40),
            by: str(e.by, 80),
            kind: (["status", "note", "interview", "assign", "message", "tag"].includes(String(e.kind)) ? e.kind : "note") as TimelineEntry["kind"],
            text: str(e.text, 2000),
          }))
          .slice(0, 200)
      : [],
  };
}

/** "2026-10-21T15:30" -> "Tue 21 Oct, 15:30" */
export function interviewLabel(at: string) {
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return at;
  return d.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
}

/** Google Calendar "add event" link for an interview (one hour) */
export function calendarLink(i: Interview, name: string, position: string) {
  const start = new Date(i.at);
  if (Number.isNaN(start.getTime())) return "";
  const end = new Date(start.getTime() + 60 * 60_000);
  const z = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: `Interview: ${name}${position ? ` (${position})` : ""}`,
    dates: `${z(start)}/${z(end)}`,
    details: [i.mode, i.with && `With: ${i.with}`].filter(Boolean).join("\n"),
    location: i.place,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

// ---- message templates: {name} {position} {date} {place} are filled in; HR can change the text before sending
export const TEMPLATES = [
  {
    id: "received",
    label: "Application received",
    subject: "Your application at We3vision",
    text: "Hello {name},\n\nThank you for applying for {position} at We3vision. Our HR team is going through your application and will get back to you soon.\n\nRegards,\nHR team, We3vision",
  },
  {
    id: "shortlisted",
    label: "Shortlisted, next step",
    subject: "Next step for {position} at We3vision",
    text: "Hello {name},\n\nGood news: your profile is shortlisted for {position}. Could you share a good time for a short call with our HR team?\n\nRegards,\nHR team, We3vision",
  },
  {
    id: "interview",
    label: "Interview invite",
    subject: "Interview for {position} at We3vision",
    text: "Hello {name},\n\nWe would like to invite you for an interview for {position}.\nWhen: {date}\nWhere: {place}\n\nPlease reply to confirm.\n\nRegards,\nHR team, We3vision",
  },
  {
    id: "documents",
    label: "Ask for documents",
    subject: "Documents for your application at We3vision",
    text: "Hello {name},\n\nTo move ahead with your application for {position}, please send us your latest resume and any work samples or portfolio links.\n\nRegards,\nHR team, We3vision",
  },
  {
    id: "offer",
    label: "Offer",
    subject: "Offer for {position} at We3vision",
    text: "Hello {name},\n\nWe are happy to offer you the position of {position} at We3vision. Our HR team will share the offer letter and the next steps with you.\n\nRegards,\nHR team, We3vision",
  },
  {
    id: "notnow",
    label: "Not now (polite)",
    subject: "Your application at We3vision",
    text: "Hello {name},\n\nThank you for your interest in {position} at We3vision. We will not move ahead with your application for now, but we will keep your profile for future openings.\n\nWe wish you all the best.\nHR team, We3vision",
  },
] as const;

export function fillTemplate(text: string, vars: Record<string, string | undefined>) {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);
}

/** digits for a wa.me link; a 10-digit Indian number gets 91 in front */
export function waDigits(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
}

/** a CSV file (Excel-friendly: BOM, quoted cells, formulas made harmless) */
export function toCsv(rows: (string | number)[][]) {
  const cell = (v: string | number) => {
    let s = String(v ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
}

/** one application as the hiring desk shows it: the visitor's answers + what HR keeps on it */
export type HireRow = {
  id: string;
  city: string;
  currentStatus: string;
  roleId: string;
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
  /** booked (seat only) | complete */
  stage: string;
  /** ticket | job */
  source: string;
  status: string;
  /** the single note of the first version of this screen */
  oldNote: string;
  /** ISO */
  createdAt: string;
  created: string;
  meta: AppMeta;
};
export type AdminOption = { id: string; name: string };
