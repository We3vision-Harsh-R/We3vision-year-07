"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon } from "@/components/admin/admin-icons";
import { ADMIN_GROUPS } from "@/components/admin/admin-menu";

// The top bar of the admin panel: the name of the open screen (found from the menu list, the longest matching address), the day and date, and
// the bell that opens the Alerts (with the number of unread alerts). The look is in styles/admin-shell.css (.ads-top*).
const ITEMS = ADMIN_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));

export function AdminTopbar({ weekday, date, alerts, siteName, pathOverride }: { weekday: string; date: string; alerts: number; siteName: string; pathOverride?: string }) {
  const livePath = usePathname();
  const pathname = pathOverride ?? livePath;
  const hit = ITEMS.filter((i) => (i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`))).sort((a, b) => b.href.length - a.href.length)[0];

  return (
    <header className="ads-top">
      <div className="ads-top-title">
        <span className="ads-top-eyebrow">Admin panel workspace{hit && hit.group !== "Overview" ? ` · ${hit.group}` : ""}</span>
        <h2>
          {hit?.label ?? "Admin"} <small>{siteName}</small>
        </h2>
      </div>
      <div className="ads-top-right">
        <p className="ads-top-date">
          <b>{weekday}</b>
          <span>{date}</span>
        </p>
        <Link href="/admin/alerts" className="ads-bell" aria-label={alerts > 0 ? `${alerts} unread alerts` : "Alerts"} data-hot={alerts > 0}>
          <AdminIcon name="bell" size={20} />
          {alerts > 0 && <span className="ads-bell-dot">{alerts > 99 ? "99+" : alerts}</span>}
        </Link>
      </div>
    </header>
  );
}
