import { DashboardView, type DashApplication, type DashLead, type DashStat, type DashboardData } from "@/components/admin/dashboard-view";
import { ADMIN_AREAS } from "@/components/admin/admin-menu";
import { todayIst } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/admin-badges";
import { listAdmins } from "@/lib/admin-users";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { timeAgo } from "@/lib/format";
import { readMeta } from "@/lib/hiring";
import { stageOf, whoHue, whoVars } from "@/lib/hiring-shared";

export const metadata = { title: "Dashboard" };

/** the colour of the status pill of an application */
const stageTone = (status: string): DashApplication["tone"] => (status === "new" ? "brand" : status === "offer" || status === "hired" ? "ok" : status === "hold" || status === "rejected" ? "quiet" : "warn");

// The dashboard is open to every signed-in admin, but it shows only what that admin may open (Admin access): the counters, the two lists and the tiles
// of the other screens are left out, and their data is not even read from the database.
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const admin = await requireAdmin();
  const { denied } = await searchParams;
  const can = (area: string) => admin.isSuper || admin.areas.includes(area as (typeof admin.areas)[number]);
  const badges = await getAdminBadges();

  // enquiries (needs Leads)
  let leadsTotal = 0;
  let projects = 0;
  let latest: DashLead[] | null = null;
  if (can("leads")) {
    const [total, rows, projectCount] = await Promise.all([db.lead.count(), db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }), db.project.count()]);
    leadsTotal = total;
    projects = projectCount;
    latest = rows.map((l) => ({ id: l.id, name: l.name, message: l.message.replace(/\s+/g, " ").trim().slice(0, 200), ago: timeAgo(l.createdAt), isRead: l.isRead }));
  }

  // applications (needs Careers)
  let applications: DashApplication[] | null = null;
  let applicationsTotal = 0;
  if (can("careers")) {
    const [apps, total, admins] = await Promise.all([
      // only finished applications (a visitor who only booked a seat on the Careers page is not an application yet)
      db.careerApplication.findMany({ where: { stage: "complete" }, orderBy: { createdAt: "desc" }, take: 5 }),
      db.careerApplication.count({ where: { stage: "complete" } }),
      // the same list and order as the hiring board, so a person keeps the same colour on both screens
      listAdmins(),
    ]);
    const metas = await Promise.all(apps.map((a) => readMeta(a.id)));
    applicationsTotal = total;
    applications = apps.map((a, i) => {
      const assignee = metas[i].assignee;
      const person = whoHue(admins, assignee) === null ? null : { name: admins.find((x) => x.id === assignee)?.name ?? "", vars: whoVars(admins, assignee) };
      return {
        id: a.id,
        name: a.name || "Unnamed applicant",
        line: [a.roleTitle || "General application", a.city].filter(Boolean).join(" · "),
        stageLabel: stageOf(a.status).label,
        tone: stageTone(a.status),
        ago: timeAgo(a.createdAt),
        isNew: a.status === "new",
        who: person,
      };
    });
  }

  const stats: (DashStat & { area: string })[] = [
    { area: "leads", label: "New enquiries", value: badges.leads, hint: "from the contact form", href: "/admin/leads", tone: "brand", icon: "leads" },
    { area: "careers", label: "New applications", value: badges.applications, hint: "waiting in Careers", href: "/admin/careers", tone: "sky", icon: "careers" },
    { area: "ai-submissions", label: "AI drafts to check", value: badges.submissions, hint: "waiting for your OK", href: "/admin/ai-submissions", tone: "amber", icon: "submissions" },
    { area: "alerts", label: "Unread alerts", value: badges.alerts, hint: "errors and warnings", href: "/admin/alerts", tone: "rose", icon: "alerts" },
  ];

  const deniedLabel = denied === "access" ? "Admin access" : ADMIN_AREAS.find((a) => a.key === denied)?.label;
  const data: DashboardData = {
    adminName: admin.name,
    dateLabel: todayIst().date,
    stats: stats.filter((s) => can(s.area)).map((s) => ({ label: s.label, value: s.value, hint: s.hint, href: s.href, tone: s.tone, icon: s.icon })),
    projects,
    leadsTotal,
    latest,
    applications,
    applicationsTotal,
    badges,
    access: { isSuper: admin.isSuper, areas: admin.areas },
    notice: deniedLabel ? `You do not have access to ${deniedLabel}. Ask the admin to give it to you.` : undefined,
  };
  return <DashboardView data={data} />;
}
