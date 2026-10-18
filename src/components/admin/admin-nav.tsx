"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/access", label: "Admin access" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/alerts", label: "Alerts" },
];

export function AdminNav({ unreadLeads, unreadAlerts = 0, newApplications = 0 }: { unreadLeads: number; unreadAlerts?: number; newApplications?: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
              active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
            {item.label === "Leads" && unreadLeads > 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{unreadLeads}</span>}
            {item.label === "Careers" && newApplications > 0 && <span className="rounded-full bg-sky-600 px-2 py-0.5 text-xs text-white">{newApplications}</span>}
            {item.label === "Alerts" && unreadAlerts > 0 && <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white">{unreadAlerts}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
