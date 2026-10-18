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

/** The call slots with HR: the next working days, three windows a day. */
export function callSlots(from: Date = new Date(), days = 5): { day: string; label: string; times: string[] }[] {
  const out: { day: string; label: string; times: string[] }[] = [];
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  while (out.length < days) {
    if (d.getDay() !== 0) {
      const label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
      out.push({ day: label, label, times: ["11:00 – 12:00", "15:00 – 16:00", "17:00 – 18:00"] });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
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
