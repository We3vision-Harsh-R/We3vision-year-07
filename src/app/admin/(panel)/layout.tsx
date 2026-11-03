import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/admin-badges";
import { requireAdmin } from "@/lib/auth";
import { getContentState } from "@/lib/content-version";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [badges, content] = await Promise.all([getAdminBadges(), getContentState(0)]);
  return (
    <AdminShell admin={admin} badges={badges} lock={{ locked: content.locked, version: content.v }}>
      {children}
    </AdminShell>
  );
}
