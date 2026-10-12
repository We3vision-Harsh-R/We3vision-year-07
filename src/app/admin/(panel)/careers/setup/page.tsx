import Link from "next/link";
import { CareersSetup, type QuestionItem } from "@/components/admin/careers-setup";
import { btnSecondary } from "@/components/admin/ui";
import type { QuestionKind } from "@/lib/careers-shared";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Careers: questions of HR" };

export default async function CareersSetupPage() {
  await requireAdmin();
  const questions = await db.careerQuestion.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
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
          <h1 className="text-2xl font-bold">Careers: questions of HR</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">What HR wants to ask in the passenger details of the ticket and in the apply form of every job.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/careers/jobs" className={btnSecondary}>
            Jobs
          </Link>
          <Link href="/admin/careers" className={btnSecondary}>
            ← Applications
          </Link>
        </div>
      </div>
      <CareersSetup initialQuestions={q} />
    </div>
  );
}
