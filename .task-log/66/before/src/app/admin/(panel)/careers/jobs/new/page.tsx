import Link from "next/link";
import { EMPTY_JOB, JobForm } from "@/components/admin/job-form";
import { btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Careers: new job" };

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">New job</h1>
        <Link href="/admin/careers/jobs" className={btnSecondary}>
          ← Jobs
        </Link>
      </div>
      <JobForm initial={EMPTY_JOB} />
    </div>
  );
}
