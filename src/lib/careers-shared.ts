// What the Careers page and the admin panel (Careers) both need: the shapes, the fixed answers (notice period, current status), the usual
// questions of the passenger details and the call slots with HR. No server-only imports.

export type CareerRoleView = { id: string; title: string; team: string };
export type QuestionKind = "text" | "textarea" | "select" | "yesno";
export type CareerQuestionView = { id: string; label: string; kind: QuestionKind; options: string[]; required: boolean };

/** What a visitor can pick as "your current career status" (they may also type their own). */
export const CURRENT_STATUS_SUGGESTIONS = ["Fresher", "Intern", "Junior developer", "Developer", "Senior developer", "Team lead", "Project manager", "Senior project manager", "Designer", "Freelancer"];

/** "How soon can you arrive?" = the notice period. */
export const NOTICE_PERIODS = ["Immediately", "15 days", "30 days", "60 days", "90 days"];

/** The usual questions of the passenger details (the questions that HR adds in the admin panel come after them). */
export type CommonField = {
  key: "name" | "email" | "phone" | "linkedin" | "skills" | "experience" | "currentCtc" | "expectedCtc" | "about";
  label: string;
  kind: "text" | "email" | "tel" | "textarea";
  required: boolean;
  placeholder: string;
};
export const COMMON_FIELDS: CommonField[] = [
  { key: "name", label: "Full name", kind: "text", required: true, placeholder: "Your name as on your ticket" },
  { key: "email", label: "Email", kind: "email", required: true, placeholder: "you@example.com" },
  { key: "phone", label: "Phone / WhatsApp", kind: "tel", required: true, placeholder: "+91 …" },
  { key: "linkedin", label: "LinkedIn or portfolio link", kind: "text", required: false, placeholder: "https://…" },
  { key: "skills", label: "Your skills", kind: "textarea", required: true, placeholder: "e.g. React, Figma, Unity, Python, SEO …" },
  { key: "experience", label: "Total experience", kind: "text", required: false, placeholder: "e.g. 2 years 6 months, or Fresher" },
  { key: "currentCtc", label: "Current salary (per year)", kind: "text", required: false, placeholder: "Optional" },
  { key: "expectedCtc", label: "Expected salary (per year)", kind: "text", required: false, placeholder: "Optional" },
  { key: "about", label: "Why do you want to join We3vision?", kind: "textarea", required: false, placeholder: "A few lines are enough" },
];

/** The interview windows of a working day (India time). */
export const INTERVIEW_TIMES = ["10:00 – 11:00", "11:00 – 12:00", "12:00 – 13:00", "15:00 – 16:00", "16:00 – 17:00", "17:00 – 18:00"];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const IST = 330 * 60_000;

export type InterviewDay = { iso: string; label: string; day: string; dow: number; times: string[] };

/**
 * When interviews can be booked (Admin > Careers > Interview schedule): the open weekdays (0 = Sunday), the windows of a day, how many days ahead the calendar goes,
 * how many days after today the first day is, and the days that are closed (holidays).
 */
export type InterviewSchedule = { days: number[]; times: string[]; daysAhead: number; startAfter: number; closed: string[] };
export const DEFAULT_SCHEDULE: InterviewSchedule = { days: [1, 2, 3, 4, 5, 6], times: INTERVIEW_TIMES, daysAhead: 21, startAfter: 1, closed: [] };
const TIME_RANGE = /^([01]\d|2[0-3]):[0-5]\d – ([01]\d|2[0-3]):[0-5]\d$/;

/** what is saved or sent in -> a schedule that is always safe to use */
export function cleanSchedule(raw: unknown): InterviewSchedule {
  const r = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const num = (v: unknown, min: number, max: number, d: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : d);
  const days = Array.isArray(r.days) ? [...new Set(r.days.filter((x): x is number => Number.isInteger(x) && x >= 0 && x <= 6))].sort((x, y) => x - y) : [];
  const times = Array.isArray(r.times) ? [...new Set(r.times.filter((x): x is string => typeof x === "string" && TIME_RANGE.test(x)))].sort().slice(0, 16) : [];
  const closed = Array.isArray(r.closed) ? [...new Set(r.closed.filter((x): x is string => typeof x === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x)))].sort().slice(0, 150) : [];
  return {
    days: days.length ? days : DEFAULT_SCHEDULE.days,
    times: times.length ? times : DEFAULT_SCHEDULE.times,
    daysAhead: num(r.daysAhead, 7, 60, DEFAULT_SCHEDULE.daysAhead),
    startAfter: num(r.startAfter, 1, 14, DEFAULT_SCHEDULE.startAfter),
    closed,
  };
}

/** The interview days of the calendar (India time): from `startAfter` days after today up to `daysAhead` days, only the open weekdays, without the closed days. "label" + ", " + a time is what is saved as the slot. */
export function interviewDays(from: Date = new Date(), schedule: InterviewSchedule = DEFAULT_SCHEDULE): InterviewDay[] {
  const out: InterviewDay[] = [];
  const d = new Date(from.getTime() + IST);
  d.setUTCHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setUTCDate(end.getUTCDate() + schedule.daysAhead);
  d.setUTCDate(d.getUTCDate() + schedule.startAfter);
  for (; d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const dow = d.getUTCDay();
    const iso = d.toISOString().slice(0, 10);
    if (!schedule.days.includes(dow) || schedule.closed.includes(iso)) continue;
    const label = `${WD[dow]}, ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
    out.push({ iso, label, day: label, dow, times: schedule.times });
  }
  return out;
}

/** The same days under the old name (the laptop booking and the checks of the server). */
export function callSlots(from: Date = new Date(), schedule: InterviewSchedule = DEFAULT_SCHEDULE): { day: string; label: string; times: string[] }[] {
  return interviewDays(from, schedule);
}

/** "Wed, 26 Nov, 11:00 – 12:00" -> the day and the time; the year is the one nearest to `ref` (when the application was made). null for a text that is not a slot. */
export function parseSlot(slot: string, ref: Date = new Date()): { start: Date; end: string; time: string; iso: string } | null {
  const m = /^([A-Za-z]{3}),? (\d{1,2}) ([A-Za-z]{3}),? (\d{2}):(\d{2}) – (\d{2}:\d{2})$/.exec(slot.trim());
  if (!m) return null;
  const mon = MON.findIndex((x) => x.toLowerCase() === m[3].toLowerCase());
  if (mon < 0) return null;
  const y0 = new Date(ref.getTime() + IST).getUTCFullYear();
  let best: Date | null = null;
  for (const y of [y0 - 1, y0, y0 + 1]) {
    const t = new Date(Date.UTC(y, mon, Number(m[2]), Number(m[4]), Number(m[5])) - IST);
    if (WD[new Date(t.getTime() + IST).getUTCDay()].toLowerCase() !== m[1].toLowerCase()) continue;
    if (!best || Math.abs(t.getTime() - ref.getTime()) < Math.abs(best.getTime() - ref.getTime())) best = t;
  }
  if (!best) return null;
  return { start: best, end: m[6], time: `${m[4]}:${m[5]} – ${m[6]}`, iso: new Date(best.getTime() + IST).toISOString().slice(0, 10) };
}

/** The "Name|CC" lines of public/data/cities.json -> "Name, Country". */
let regions: Intl.DisplayNames | null = null;
export function cityLabel(line: string): string {
  const [name, cc] = line.split("|");
  if (!cc) return name;
  try {
    regions ??= new Intl.DisplayNames(["en"], { type: "region" });
    return `${name}, ${regions.of(cc) ?? cc}`;
  } catch {
    return `${name}, ${cc}`;
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Job openings (the list on the Careers page and the page of a job: /careers/<slug>)
// ---------------------------------------------------------------------------------------------------------------------------------

export const WORK_TYPES = ["Full-time", "Part-time", "Internship", "Contract"] as const;
export const WORK_MODES = ["On-site", "Hybrid", "Remote"] as const;

export type JobView = {
  id: string;
  slug: string;
  title: string;
  team: string;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  location: string;
  workType: string;
  workMode: string;
  experience: string;
  openings: number;
  /** Industrial Training (fee-based) is available in this role: shown as a tag */
  training: boolean;
  salary: string;
  /** yyyy-mm-dd, or empty when the job has no closing day */
  closesAt: string;
  /** ISO date-time of the day the job was put on the site */
  postedAt: string;
  /** "Posted today", "Posted 3 days ago" ... */
  postedLabel: string;
};

/** "Senior Web Developer" -> "senior-web-developer" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}
