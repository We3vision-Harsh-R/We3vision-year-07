import Link from "next/link";
import { CareersJobs, type JobRow } from "@/components/admin/careers-jobs";
import { btnPrimary, btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Careers: jobs" };

export default async function CareersJobsPage() {
  await requireAdmin();
  const [roles, counts] = await Promise.all([
    db.careerRole.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    db.careerApplication.groupBy({ by: ["roleId"], _count: { _all: true } }),
  ]);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const count = new Map(counts.map((c) => [c.roleId, c._count._all]));
  const rows: JobRow[] = roles.map((r) => ({
    id: r.id,
    title: r.title,
    team: r.team,
    slug: r.slug,
    workType: r.workType,
    location: r.location,
    openings: r.openings,
    active: r.active,
    closesAt: r.closesAt,
    applications: count.get(r.id) ?? 0,
    expired: Boolean(r.closesAt && r.closesAt < today),
  }));
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Careers: jobs</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            The open jobs are listed on the Careers page, every job has its own page where a visitor can apply, and the applications come to Careers.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/careers" className={btnSecondary}>
            ← Applications
          </Link>
          <Link href="/admin/careers/jobs/new" className={btnPrimary}>
            + New job
          </Link>
        </div>
      </div>
      <CareersJobs rows={rows} />
    </div>
  );
}
