import Link from "next/link";
import { HiringDesk } from "@/components/admin/hiring/hiring-desk";
import { btnPrimary, btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { readAllMeta } from "@/lib/hiring";
import { EMPTY_META, type HireRow } from "@/lib/hiring-shared";

export const metadata = { title: "Careers: applications" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
const ID = /^[a-z0-9]{10,40}$/i;

export default async function CareersAdminPage({ searchParams }: { searchParams: Promise<{ job?: string; open?: string }> }) {
  const admin = await requireAdmin();
  const { job, open } = await searchParams;
  const [rows, metas, roles, admins] = await Promise.all([
    db.careerApplication.findMany({ orderBy: { createdAt: "desc" }, take: 1500 }),
    readAllMeta(),
    db.careerRole.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }], select: { id: true, title: true, active: true } }),
    db.adminUser.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  const view: HireRow[] = rows.map((r) => ({
    id: r.id,
    city: r.city,
    currentStatus: r.currentStatus,
    roleId: r.roleId,
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
    source: r.source,
    status: r.status,
    oldNote: r.note,
    createdAt: r.createdAt.toISOString(),
    created: fmt.format(r.createdAt),
    meta: metas.get(r.id) ?? EMPTY_META,
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Careers: applications</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Every application that comes from a job page or the ticket office of the Careers page. Move it through the steps, rate it, tag it, plan the interview, send a ready
            message and keep notes; the timeline remembers who did what.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/careers/setup" className={btnSecondary}>
            Questions of HR
          </Link>
          <Link href="/admin/careers/jobs" className={btnSecondary}>
            Jobs
          </Link>
          <Link href="/admin/careers/jobs/new" className={btnPrimary}>
            + Post a job
          </Link>
        </div>
      </div>
      <HiringDesk
        rows={view}
        jobs={roles}
        admins={admins}
        me={admin.id}
        initialJob={typeof job === "string" && ID.test(job) ? job : ""}
        initialOpen={typeof open === "string" && ID.test(open) ? open : ""}
      />
    </div>
  );
}
