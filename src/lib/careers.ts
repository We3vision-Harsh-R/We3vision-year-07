import "server-only";
import { db, hasDb } from "@/lib/db";
import type { CareerQuestionView, CareerRoleView, JobView, QuestionKind } from "@/lib/careers-shared";

// The positions and the questions of HR for the Careers page (Careers in the admin panel). Without a database the built-in positions are
// the destinations of the ticket and there are no job pages.

const BUILT_IN_ROLES = [
  ["Web Developer", "Web & Mobile"],
  ["Mobile App Developer", "Web & Mobile"],
  ["AI Engineer", "AI & CRM"],
  ["Unity / Metaverse Developer", "Metaverse"],
  ["UI/UX Designer", "Design"],
  ["Graphic Designer", "Design"],
  ["SEO Specialist", "Marketing"],
  ["Intern", ""],
] as const;

const kindOf = (v: string): QuestionKind => (v === "textarea" || v === "select" || v === "yesno" ? v : "text");
const optionsOf = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);

/** today as yyyy-mm-dd in India (a job closes at the end of its closing day) */
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

/** "Posted today", "Posted 3 days ago", "Posted 2 weeks ago" */
function posted(at: Date): string {
  const days = Math.max(0, Math.floor((Date.now() - at.getTime()) / 86_400_000));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 14) return `Posted ${days} days ago`;
  if (days < 60) return `Posted ${Math.floor(days / 7)} weeks ago`;
  return `Posted ${Math.floor(days / 30)} months ago`;
}

type Row = Awaited<ReturnType<typeof db.careerRole.findMany>>[number];
const toJob = (r: Row): JobView => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  team: r.team,
  summary: r.summary,
  description: r.description,
  responsibilities: optionsOf(r.responsibilities),
  requirements: optionsOf(r.requirements),
  perks: optionsOf(r.perks),
  location: r.location,
  workType: r.workType,
  workMode: r.workMode,
  experience: r.experience,
  openings: r.openings,
  salary: r.salary,
  closesAt: r.closesAt,
  postedAt: r.createdAt.toISOString(),
  postedLabel: posted(r.createdAt),
});

/** the open jobs, in the order of the admin panel (a job whose closing day has passed is not open any more) */
export async function getOpenJobs(): Promise<JobView[]> {
  if (!hasDb) return [];
  const rows = await db.careerRole.findMany({ where: { active: true, slug: { not: "" } }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
  const now = today();
  return rows.filter((r) => !r.closesAt || r.closesAt >= now).map(toJob);
}

/** one job by the address of its page; null when it does not exist or is closed */
export async function getOpenJob(slug: string): Promise<JobView | null> {
  if (!hasDb || !/^[a-z0-9-]{1,80}$/.test(slug)) return null;
  const r = await db.careerRole.findUnique({ where: { slug } });
  if (!r || !r.active || (r.closesAt && r.closesAt < today())) return null;
  return toJob(r);
}

export async function getCareerSetup(): Promise<{ roles: CareerRoleView[]; questions: CareerQuestionView[] }> {
  if (!hasDb) return { roles: BUILT_IN_ROLES.map(([title, team], i) => ({ id: `built-in-${i}`, title, team })), questions: [] };
  const [roles, questions] = await Promise.all([
    db.careerRole.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    db.careerQuestion.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);
  const now = today();
  return {
    roles: roles.filter((r) => !r.closesAt || r.closesAt >= now).map((r) => ({ id: r.id, title: r.title, team: r.team })),
    questions: questions.map((q) => ({ id: q.id, label: q.label, kind: kindOf(q.kind), options: optionsOf(q.options), required: q.required })),
  };
}
