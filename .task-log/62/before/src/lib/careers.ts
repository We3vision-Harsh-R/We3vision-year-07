import "server-only";
import { db, hasDb } from "@/lib/db";
import type { CareerQuestionView, CareerRoleView, QuestionKind } from "@/lib/careers-shared";

// The positions and the questions of HR for the Careers page (Careers in the admin panel). Without a database the built-in positions are shown.

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

export async function getCareerSetup(): Promise<{ roles: CareerRoleView[]; questions: CareerQuestionView[] }> {
  if (!hasDb) return { roles: BUILT_IN_ROLES.map(([title, team], i) => ({ id: `built-in-${i}`, title, team })), questions: [] };
  const [roles, questions] = await Promise.all([
    db.careerRole.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    db.careerQuestion.findMany({ where: { active: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);
  return {
    roles: roles.map((r) => ({ id: r.id, title: r.title, team: r.team })),
    questions: questions.map((q) => ({ id: q.id, label: q.label, kind: kindOf(q.kind), options: optionsOf(q.options), required: q.required })),
  };
}
