import Image from "next/image";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { AdminIcon } from "@/components/admin/admin-icons";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import type { AdminBadges } from "@/lib/admin-badges";
import { SITE_VERSION } from "@/lib/version";

// The frame of every admin screen: a floating glass sidebar (brand, menu, the signed-in admin, sign out), the top bar and the place for the screen.
// The panel layout (app/admin/(panel)/layout.tsx) fills it with the real admin; the design sandbox fills it with sample data.
// The look is in styles/admin-shell.css (.ads-*).

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("") || "A";

/** "Friday" and "October 23, 2026", in Indian time (the same on the server and in the browser). */
export function todayIst(now = new Date()) {
  const parts = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", ...opts }).format(now);
  return { weekday: parts({ weekday: "long" }), date: parts({ month: "long", day: "numeric", year: "numeric" }) };
}

export function AdminShell({
  admin,
  badges,
  siteName = "We3vision",
  pathOverride,
  children,
}: {
  admin: { name: string; email: string };
  badges: AdminBadges;
  siteName?: string;
  pathOverride?: string;
  children: React.ReactNode;
}) {
  const { weekday, date } = todayIst();
  return (
    <div className="ads-app">
      <aside className="ads-side">
        <Link href="/admin" className="ads-brand">
          <Image src="/brand/logo-mark.webp" alt="" width={480} height={395} className="ads-brand-mark" />
          <span>
            <b>{siteName}</b>
            <small>Admin panel · v{SITE_VERSION}</small>
          </span>
        </Link>
        <AdminNav badges={badges} pathOverride={pathOverride} />
        <div className="ads-side-foot">
          <a href="/" target="_blank" rel="noreferrer" className="ads-site-link">
            View website
            <AdminIcon name="external" size={15} />
          </a>
          <div className="ads-who" title={admin.email}>
            <span className="ads-avatar" aria-hidden="true">
              {initials(admin.name)}
            </span>
            <span>
              <b>{admin.name}</b>
              <small>Administrator</small>
            </span>
          </div>
          <form action={logout}>
            <button className="ads-logout">
              <span>Sign out</span>
              <AdminIcon name="logout" size={18} />
            </button>
          </form>
        </div>
      </aside>
      <div className="ads-main">
        <AdminTopbar weekday={weekday} date={date} alerts={badges.alerts} siteName={siteName} pathOverride={pathOverride} />
        <div className="ads-content">{children}</div>
      </div>
    </div>
  );
}
