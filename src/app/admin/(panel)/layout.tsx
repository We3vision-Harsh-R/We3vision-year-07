import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/admin-badges";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const badges = await getAdminBadges();
  return (
    <AdminShell admin={admin} badges={badges}>
      {children}
    </AdminShell>
  );
}
