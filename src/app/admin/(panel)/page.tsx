import { DashboardView, type DashboardData } from "@/components/admin/dashboard-view";
import { todayIst } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/admin-badges";
import { requireAdmin } from "@/lib/auth";
import { PAGES } from "@/lib/cms/pages";
import { getPageStatuses } from "@/lib/cms/queries";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [statuses, totalLeads, latest, projectCount, badges] = await Promise.all([
    getPageStatuses(),
    db.lead.count(),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    db.project.count(),
    getAdminBadges(),
  ]);

  const data: DashboardData = {
    adminName: admin.name,
    dateLabel: todayIst().date,
    stats: [
      { label: "New enquiries", value: badges.leads, hint: "from the contact form", href: "/admin/leads", tone: "brand", icon: "leads" },
      { label: "New applications", value: badges.applications, hint: "waiting in Careers", href: "/admin/careers", tone: "sky", icon: "careers" },
      { label: "AI drafts to check", value: badges.submissions, hint: "waiting for your OK", href: "/admin/ai-submissions", tone: "amber", icon: "submissions" },
      { label: "Unread alerts", value: badges.alerts, hint: "errors and warnings", href: "/admin/alerts", tone: "rose", icon: "alerts" },
    ],
    projects: projectCount,
    leadsTotal: totalLeads,
    pages: Object.entries(PAGES).map(([slug, page]) => ({ slug, title: page.title, path: page.path, status: statuses[slug].status })),
    latest: latest.map((l) => ({ id: l.id, name: l.name, message: l.message, when: formatDate(l.createdAt), isRead: l.isRead })),
    badges,
  };
  return <DashboardView data={data} />;
}
