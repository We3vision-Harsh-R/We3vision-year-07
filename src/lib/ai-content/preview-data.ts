import { dateLabel, parseContent, tileOf, type BlogEntry } from "@/lib/blog-shared";
import type { JobView } from "@/lib/careers-shared";
import type { DraftData } from "./types";

// A draft in the shape the real public components use, so the approval screen can show it with the SAME components as the live page
// (BlogPost for an article, JobPage for a job). No server-only imports.

const str = (v: unknown) => (typeof v === "string" ? v : "");
const strings = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

export function draftToBlogEntry(d: DraftData, slug: string): BlogEntry {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(str(d.date)) ? str(d.date) : new Date().toISOString().slice(0, 10);
  const faq = (Array.isArray(d.faq) ? d.faq : []).flatMap((x) => {
    const o = x as { question?: unknown; answer?: unknown };
    return typeof o?.question === "string" && typeof o?.answer === "string" ? [{ question: o.question, answer: o.answer }] : [];
  });
  return {
    id: "preview",
    slug,
    title: str(d.title),
    category: str(d.category),
    summary: str(d.summary),
    image: str(d.cover),
    tile: tileOf(d.tile),
    date,
    dateLabel: dateLabel(date),
    tags: strings(d.tags),
    blocks: parseContent(str(d.content)),
    faq,
    sortOrder: 0,
    published: true,
  };
}

export function draftToJobView(d: DraftData, slug: string): JobView {
  return {
    id: "preview",
    slug,
    title: str(d.title),
    team: str(d.team),
    summary: str(d.summary),
    description: str(d.description),
    responsibilities: strings(d.responsibilities),
    requirements: strings(d.requirements),
    perks: strings(d.perks),
    location: str(d.location) || "Surat, India",
    workType: str(d.workType) || "Full-time",
    workMode: str(d.workMode) || "On-site",
    experience: str(d.experience),
    openings: typeof d.openings === "number" ? d.openings : 1,
    salary: str(d.salary),
    closesAt: str(d.closesAt),
    postedAt: new Date().toISOString(),
    postedLabel: "Posted today",
  };
}
