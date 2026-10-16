import Link from "next/link";
import { CareersApplications, type ApplicationRow } from "@/components/admin/careers-applications";
import { btnSecondary } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Careers" };

const fmt = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

export default async function CareersAdminPage() {
  await requireAdmin();
  const rows = await db.careerApplication.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
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
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Careers</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            The tickets that visitors book on the Careers page: where they are, the position they want, and (when they gave them) their passenger details.
          </p>
        </div>
        <Link href="/admin/careers/setup" className={btnSecondary}>
          Positions and questions →
        </Link>
      </div>
      <CareersApplications rows={view} />
    </div>
  );
}
