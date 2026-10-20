import { readAlerts } from "@/lib/alerts";
import { db } from "@/lib/db";
import { countPending } from "@/lib/ai-content/server/submissions";

// The little numbers shown next to the admin menu items and on the dashboard tiles (keys = the "badge" field in components/admin/admin-menu.ts).
export type AdminBadges = { leads: number; alerts: number; applications: number; submissions: number };

export async function getAdminBadges(): Promise<AdminBadges> {
  const [leads, alerts, applications, submissions] = await Promise.all([
    db.lead.count({ where: { isRead: false } }),
    readAlerts(),
    db.careerApplication.count({ where: { status: "new", stage: "complete" } }),
    countPending(),
  ]);
  return { leads, alerts: alerts.filter((a) => !a.read && a.level !== "info").length, applications, submissions };
}
