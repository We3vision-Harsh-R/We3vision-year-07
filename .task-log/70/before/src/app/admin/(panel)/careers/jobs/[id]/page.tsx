import Link from "next/link";
import { notFound } from "next/navigation";
import { JobForm, type JobFormValue } from "@/components/admin/job-form";
import { btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Careers: edit job" };

const list = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").join("\n") : "");

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!/^[a-z0-9]{10,40}$/i.test(id)) notFound();
  const r = await db.careerRole.findUnique({ where: { id } });
  if (!r) notFound();
  const initial: JobFormValue = {
    id: r.id,
    title: r.title,
    slug: r.slug,
    team: r.team,
    summary: r.summary,
    description: r.description,
    responsibilities: list(r.responsibilities),
    requirements: list(r.requirements),
    perks: list(r.perks),
    location: r.location,
    workType: r.workType,
    workMode: r.workMode,
    experience: r.experience,
    openings: r.openings,
    salary: r.salary,
    closesAt: r.closesAt,
    active: r.active,
  };
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">{r.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/careers?job=${r.id}`} className={btnSecondary}>
            Applications for this job
          </Link>
          <Link href="/admin/careers/jobs" className={btnSecondary}>
            ← Jobs
          </Link>
        </div>
      </div>
      <JobForm initial={initial} />
    </div>
  );
}
