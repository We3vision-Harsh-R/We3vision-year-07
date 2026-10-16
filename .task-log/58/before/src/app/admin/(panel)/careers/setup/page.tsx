import Link from "next/link";
import { CareersSetup, type QuestionItem, type RoleItem } from "@/components/admin/careers-setup";
import { btnSecondary } from "@/components/admin/ui";
import type { QuestionKind } from "@/lib/careers-shared";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Careers: positions and questions" };

export default async function CareersSetupPage() {
  await requireAdmin();
  const [roles, questions] = await Promise.all([
    db.careerRole.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    db.careerQuestion.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
  ]);
  const r: RoleItem[] = roles.map((x) => ({ key: x.id, title: x.title, team: x.team, active: x.active }));
  const q: QuestionItem[] = questions.map((x) => ({
    key: x.id,
    label: x.label,
    kind: (x.kind === "textarea" || x.kind === "select" || x.kind === "yesno" ? x.kind : "text") as QuestionKind,
    options: Array.isArray(x.options) ? (x.options as unknown[]).filter((o): o is string => typeof o === "string").join("\n") : "",
    required: x.required,
    active: x.active,
  }));
  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Careers: positions and questions</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">What a visitor can choose as the destination of the ticket, and what HR wants to ask in the passenger details.</p>
        </div>
        <Link href="/admin/careers" className={btnSecondary}>
          ← Tickets
        </Link>
      </div>
      <CareersSetup initialRoles={r} initialQuestions={q} />
    </div>
  );
}
