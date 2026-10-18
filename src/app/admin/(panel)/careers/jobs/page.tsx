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
    db.careerApplication.groupBy({ by: ["roleId", "status"], _count: { _all: true } }),
  ]);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const sum = (roleId: string, test: (status: string) => boolean) => counts.filter((c) => c.roleId === roleId && test(c.status)).reduce((n, c) => n + c._count._all, 0);
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
    applications: sum(r.id, () => true),
    fresh: sum(r.id, (s) => s === "new"),
    inProcess: sum(r.id, (s) => ["contacted", "shortlisted", "interview", "offer"].includes(s)),
    hired: sum(r.id, (s) => s === "hired"),
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
            + Post a job
          </Link>
        </div>
      </div>
      <CareersJobs rows={rows} />
    </div>
  );
}
