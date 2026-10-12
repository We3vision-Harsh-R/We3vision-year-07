import Link from "next/link";
import { CareersApplications, type ApplicationRow } from "@/components/admin/careers-applications";
import { btnPrimary, btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Careers" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function CareersAdminPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  await requireAdmin();
  const { job } = await searchParams;
  const rows = await db.careerApplication.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  const view: ApplicationRow[] = rows.map((r) => ({
    id: r.id,
    city: r.city,
    currentStatus: r.currentStatus,
    roleTitle: r.roleTitle,
    joinDate: r.joinDate,
    noticePeriod: r.noticePeriod,
    callSlot: r.callSlot,
    resume: r.resume,
    name: r.name,
    email: r.email,
    phone: r.phone,
    linkedin: r.linkedin,
    skills: r.skills,
    experience: r.experience,
    answers: Array.isArray(r.answers) ? (r.answers as { q?: unknown; a?: unknown }[]).map((x) => ({ q: String(x.q ?? ""), a: String(x.a ?? "") })) : [],
    stage: r.stage,
    status: r.status,
    note: r.note,
    created: fmt.format(r.createdAt),
    source: r.source,
    roleId: r.roleId,
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Careers</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            The applications: what visitors send on the page of a job, and the tickets they book at the ticket office of the Careers page (where they are, the position they
            want and, when they gave them, their passenger details).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/careers/setup" className={btnSecondary}>
            Questions of HR
          </Link>
          <Link href="/admin/careers/jobs" className={btnPrimary}>
            Jobs →
          </Link>
        </div>
      </div>
      <CareersApplications rows={view} initialJob={typeof job === "string" && /^[a-z0-9]{10,40}$/i.test(job) ? job : ""} />
    </div>
  );
}
