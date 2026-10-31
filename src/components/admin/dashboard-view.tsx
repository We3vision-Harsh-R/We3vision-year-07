import Link from "next/link";
import { AdminIcon, type IconName } from "@/components/admin/admin-icons";
import { ADMIN_GROUPS } from "@/components/admin/admin-menu";
import type { AdminBadges } from "@/lib/admin-badges";

// The admin dashboard, drawn from plain data (the page fetches it, the design sandbox passes sample data). The look is in styles/admin-shell.css
// (.ads-dash*, .ads-donut*, .ads-row*).

export type DashStat = { label: string; value: number; hint: string; href: string; tone: "brand" | "sky" | "amber" | "rose"; icon: IconName };
export type DashLead = { id: string; name: string; message: string; when: string; isRead: boolean };
export type DashboardData = {
  adminName: string;
  dateLabel: string;
  stats: DashStat[];
  projects: number;
  leadsTotal: number;
  latest: DashLead[];
  badges: AdminBadges;
};

export function DashboardView({ data }: { data: DashboardData }) {
  const waiting = data.badges.submissions;
  return (
    <div className="ads-dash">
      <header className="ads-dash-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome, {data.adminName}. Overview of the website on {data.dateLabel}.
          </p>
        </div>
        <Link href="/admin/ai-submissions" className="ads-cta">
          {waiting > 0 ? `Review ${waiting} AI draft${waiting === 1 ? "" : "s"}` : "Open AI Submissions"}
          <AdminIcon name="arrow" size={18} />
        </Link>
      </header>

      <div className="ads-hero-grid">
        {data.stats.map((s) => (
          <Link key={s.label} href={s.href} className="ads-stat" data-tone={s.tone} data-hot={s.value > 0}>
            <span className="ads-stat-label">{s.label}</span>
            <span className="ads-stat-value">{s.value}</span>
            <span className="ads-stat-hint">{s.hint}</span>
            <span className="ads-stat-chip">
              <AdminIcon name={s.icon} size={22} />
            </span>
          </Link>
        ))}
      </div>

      <section className="ads-card">
        <div className="ads-card-head">
          <h2>Latest enquiries</h2>
          <Link href="/admin/leads" className="ads-card-link">
            All enquiries
            <AdminIcon name="chevron" size={16} />
          </Link>
        </div>
        {data.latest.length === 0 ? (
          <p className="ads-empty">No enquiries yet. Messages sent from the website contact form appear here.</p>
        ) : (
          <ul className="ads-rows">
            {data.latest.map((lead) => (
              <li key={lead.id}>
                <Link href="/admin/leads" className="ads-row">
                  <span className="ads-row-icon" data-on={!lead.isRead}>
                    <AdminIcon name={lead.isRead ? "check" : "leads"} size={20} />
                  </span>
                  <span className="ads-row-text">
                    <b>{lead.name}</b>
                    <small>{lead.message}</small>
                  </span>
                  <span className="ads-row-when">{lead.when}</span>
                  <span className="ads-pill" data-tone={lead.isRead ? "quiet" : "brand"}>
                    {lead.isRead ? "Read" : "New"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="ads-card-foot">
          {data.leadsTotal} enquiries in total · {data.projects} projects in the portfolio
        </p>
      </section>

      {ADMIN_GROUPS.filter((g) => g.id !== "overview").map((group) => (
        <section key={group.id} className="ads-cat" aria-labelledby={`ads-cat-${group.id}`}>
          <div className="ads-cat-head">
            <h2 id={`ads-cat-${group.id}`}>{group.title}</h2>
            <p>{group.blurb}</p>
          </div>
          <div className="ads-tiles">
            {group.items.map((item) => {
              const count = item.badge ? data.badges[item.badge.key] : 0;
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

    </div>
  );
}
