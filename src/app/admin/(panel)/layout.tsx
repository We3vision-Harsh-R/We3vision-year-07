import Image from "next/image";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminBadges } from "@/lib/admin-badges";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const badges = await getAdminBadges();

  return (
    <div className="ads-app">
      <aside className="ads-side">
        <Link href="/admin" className="ads-brand">
          <Image src="/brand/logo-mark.webp" alt="" width={480} height={395} className="ads-brand-mark" />
          <span>
            <b>We3vision</b>
            <small>Admin panel</small>
          </span>
        </Link>
        <AdminNav badges={badges} />
        <div className="ads-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="ads-site-link">
            View website ↗
          </a>
          <p className="ads-who" title={admin.email}>
            <span className="ads-avatar" aria-hidden="true">
              {admin.name.trim().charAt(0).toUpperCase() || "A"}
            </span>
            <span>
              <b>{admin.name}</b>
              <small>{admin.email}</small>
            </span>
          </p>
          <form action={logout}>
            <button className="ads-logout">Log out</button>
          </form>
        </div>
      </aside>
      <div className="ads-main">{children}</div>
    </div>
  );
}
