import Link from "next/link";
import { AdminIcon } from "@/components/admin/admin-icons";
import { ADMIN_GROUPS } from "@/components/admin/admin-menu";
import { StatusBadge } from "@/components/admin/status-badge";
import { card } from "@/components/admin/ui";
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

  const stats = [
    { label: "New enquiries", value: badges.leads, hint: `${totalLeads} in total`, href: "/admin/leads", tone: "brand" },
    { label: "New applications", value: badges.applications, hint: "waiting in Careers", href: "/admin/careers", tone: "sky" },
    { label: "AI drafts to check", value: badges.submissions, hint: "waiting for your OK", href: "/admin/ai-submissions", tone: "amber" },
    { label: "Unread alerts", value: badges.alerts, hint: "errors and warnings", href: "/admin/alerts", tone: "rose" },
    { label: "Projects", value: projectCount, hint: "in the portfolio", href: "/admin/projects", tone: "plain" },
    { label: "Pages", value: Object.keys(PAGES).length, hint: "editable pages", href: "/admin/pages", tone: "plain" },
  ];

  return (
    <div className="ads-dash">
      <header className="ads-dash-head">
        <h1>Welcome, {admin.name}</h1>
        <p>Manage everything on the website from here. Pick a category below.</p>
      </header>

      <div className="ads-stats">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="ads-stat" data-tone={s.tone} data-hot={s.tone !== "plain" && s.value > 0}>
            <span className="ads-stat-label">{s.label}</span>
            <span className="ads-stat-value">{s.value}</span>
            <span className="ads-stat-hint">{s.hint}</span>
          </Link>
        ))}
      </div>

      {ADMIN_GROUPS.filter((g) => g.id !== "overview").map((group) => (
        <section key={group.id} className="ads-cat" aria-labelledby={`ads-cat-${group.id}`}>
          <div className="ads-cat-head">
            <h2 id={`ads-cat-${group.id}`}>{group.title}</h2>
            <p>{group.blurb}</p>
          </div>
          <div className="ads-tiles">
            {group.items.map((item) => {
              const count = item.badge ? badges[item.badge.key] : 0;
              return (
                <Link key={item.href} href={item.href} className="ads-tile">
                  <span className="ads-tile-icon">
                    <AdminIcon name={item.icon} size={22} />
                  </span>
                  <span className="ads-tile-text">
                    <b>{item.label}</b>
                    <small>{item.hint}</small>
                  </span>
                  {item.badge && count > 0 && (
                    <span className="ads-badge" data-tone={item.badge.tone}>
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <div className="ads-two">
        <section className={card}>
          <h2 className="font-semibold">Pages</h2>
          <ul className="mt-3 divide-y divide-zinc-100">
            {Object.entries(PAGES).map(([slug, page]) => (
              <li key={slug} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <Link href={`/admin/pages/${slug}`} className="font-medium hover:text-brand">
                    {page.title}
                  </Link>
                  <span className="ml-2 text-xs text-zinc-400">{page.path}</span>
                </div>
                <StatusBadge status={statuses[slug].status} />
              </li>
            ))}
          </ul>
        </section>

        <section className={card}>
          <h2 className="font-semibold">Latest enquiries</h2>
          {latest.length === 0 ? (
            <p className="mt-3 text-sm text-zinc-400">No enquiries yet. Messages sent from the website contact form appear here.</p>
          ) : (
            <ul className="mt-3 divide-y divide-zinc-100">
              {latest.map((lead) => (
                <li key={lead.id} className="py-3 text-sm">
                  <p className="font-medium">
                    {lead.name} {!lead.isRead && <span className="ml-1 rounded-full bg-brand px-2 py-0.5 text-xs text-white">new</span>}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-zinc-500">{lead.message}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">{formatDate(lead.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
