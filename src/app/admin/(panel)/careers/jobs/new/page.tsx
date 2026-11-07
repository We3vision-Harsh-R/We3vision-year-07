import { EMPTY_JOB, JobForm } from "@/components/admin/job-form";

import { requireAdmin } from "@/lib/auth";
import { IconBtn } from "@/components/admin/icon-btn";

export const metadata = { title: "Careers: new job" };

export default async function NewJobPage() {
  await requireAdmin();
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-bold">New job</h1>
        <IconBtn icon="back" label="Back to the jobs" href="/admin/careers/jobs" />
      </div>
      <JobForm initial={EMPTY_JOB} />
    </div>
  );
}
