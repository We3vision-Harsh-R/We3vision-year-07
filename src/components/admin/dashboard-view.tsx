import type { CSSProperties } from "react";
import Link from "next/link";
import { AdminIcon, type IconName } from "@/components/admin/admin-icons";
import { ADMIN_GROUPS, canSee } from "@/components/admin/admin-menu";
import type { AdminBadges } from "@/lib/admin-badges";

// The admin dashboard, drawn from plain data (the page fetches it, a design sandbox can pass sample data). The look is in styles/admin-shell.css
// (.ads-dash*, .ads-feed*, .ads-row*, .ads-tile*). Reading order = what the admin should do first:
//   1. the four counters (what is waiting)  2. the two newest lists (enquiries, hiring applications)  3. every screen of the panel, by category.

/** How many of the three grid columns a category takes: as many as it has tiles; four tiles sit as 2 x 2 (never 3 + 1), five or more fill the row. */
const catCols = (n: number) => (n >= 5 ? 3 : n === 4 ? 2 : Math.max(n, 1));

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("") || "?";

export type DashStat = { label: string; value: number; hint: string; href: string; tone: "brand" | "sky" | "amber" | "rose"; icon: IconName };
export type DashLead = { id: string; name: string; message: string; ago: string; isRead: boolean };
export type DashApplication = {
  id: string;
  name: string;
  /** "Frontend Developer · Surat" */
  line: string;
  stageLabel: string;
  tone: "brand" | "ok" | "warn" | "quiet";
  ago: string;
  isNew: boolean;
  /** the person who looks after it, with the colour style of the hiring board (whoVars) */
  who: { name: string; vars: CSSProperties | undefined } | null;
};
export type DashboardData = {
  adminName: string;
  dateLabel: string;
  stats: DashStat[];
  projects: number;
  leadsTotal: number;
  /** null = this admin may not open Leads: the card is not shown */
  latest: DashLead[] | null;
  /** null = this admin may not open Careers: the card is not shown */
  applications: DashApplication[] | null;
  applicationsTotal: number;
  badges: AdminBadges;
  /** what this admin may open: the counters, lists and tiles of the other screens are left out */
  access: { isSuper: boolean; areas: readonly string[] };
  /** "You do not have access to Blog…" after a screen was refused */
  notice?: string;
};

export function DashboardView({ data }: { data: DashboardData }) {
  const waiting = data.badges.submissions;
  const leads = data.latest;
  const apps = data.applications;
  const canAi = data.access.isSuper || data.access.areas.includes("ai-submissions");
  // only the screens this admin may open, and only the categories that still have a screen
  const groups = ADMIN_GROUPS.filter((g) => g.id !== "overview")
    .map((g) => ({ ...g, items: g.items.filter((item) => canSee(item, data.access)) }))
    .filter((g) => g.items.length > 0);
  return (
    <div className="ads-dash">
      <header className="ads-dash-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Welcome, {data.adminName}. Overview of the website on {data.dateLabel}.
          </p>
        </div>
        {canAi && (
          <Link href="/admin/ai-submissions" className="ads-cta">
            {waiting > 0 ? `Review ${waiting} AI draft${waiting === 1 ? "" : "s"}` : "Open AI Submissions"}
            <AdminIcon name="arrow" size={18} />
          </Link>
        )}
      </header>

      {data.notice && (
        <p className="ads-notice" role="status">
          {data.notice}
        </p>
      )}

      {data.stats.length > 0 && (
      <div className="ads-hero-grid" style={{ "--n": data.stats.length } as CSSProperties}>
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
      )}

      {(leads || apps) && (
      <div className="ads-duo">
        {leads && (
        <section className="ads-card ads-feed" aria-labelledby="ads-feed-leads">
          <div className="ads-card-head">
            <div>
              <h2 id="ads-feed-leads">
                Latest enquiries
                {data.badges.leads > 0 && <span className="ads-chip">{data.badges.leads} new</span>}
              </h2>
              <p className="ads-card-sub">Messages from the website contact form</p>
            </div>
            <Link href="/admin/leads" className="ads-card-link">
              All enquiries
              <AdminIcon name="chevron" size={16} />
            </Link>
          </div>
          {leads && leads.length === 0 ? (
            <p className="ads-empty">No enquiries yet. Messages sent from the website contact form appear here.</p>
          ) : (
            <ul className="ads-rows">
              {leads?.map((lead) => (
                <li key={lead.id}>
                  <Link href="/admin/leads" className="ads-row" data-new={!lead.isRead}>
                    <span className="ads-row-icon" data-on={!lead.isRead} aria-hidden="true">
                      {initials(lead.name)}
                    </span>
                    <span className="ads-row-text">
                      <span className="ads-row-top">
                        <b>{lead.name}</b>
                        <span className="ads-row-when">{lead.ago}</span>
                      </span>
                      <small>{lead.message}</small>
                    </span>
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
        )}

        {apps && (
        <section className="ads-card ads-feed" aria-labelledby="ads-feed-apps">
          <div className="ads-card-head">
            <div>
              <h2 id="ads-feed-apps">
                Latest applications
                {data.badges.applications > 0 && <span className="ads-chip">{data.badges.applications} new</span>}
              </h2>
              <p className="ads-card-sub">People who applied for a job or a training</p>
            </div>
            <Link href="/admin/careers" className="ads-card-link">
              Hiring board
              <AdminIcon name="chevron" size={16} />
            </Link>
          </div>
          {apps && apps.length === 0 ? (
            <p className="ads-empty">No applications yet. They appear here when someone applies on the Careers page.</p>
          ) : (
            <ul className="ads-rows">
              {apps?.map((app) => (
                <li key={app.id}>
                  <Link href={`/admin/careers?open=${app.id}`} className="ads-row" data-new={app.isNew}>
                    <span className="ads-row-icon" data-on={app.isNew} aria-hidden="true">
                      {initials(app.name)}
                    </span>
                    <span className="ads-row-text">
                      <span className="ads-row-top">
                        <b>{app.name}</b>
                        <span className="ads-row-when">
                          {app.who && <span className="hwg hwg-dot ads-dot" style={app.who.vars} title={`Looked after by ${app.who.name}`} />}
                          {app.ago}
                        </span>
                      </span>
                      <small>{app.line}</small>
                    </span>
                    <span className="ads-pill" data-tone={app.tone}>
                      {app.stageLabel}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="ads-card-foot">{data.applicationsTotal} applications in total</p>
        </section>
        )}
      </div>
      )}

      <div className="ads-cats">
        {groups.map((group) => (
          <section key={group.id} className="ads-cat" style={{ "--cols": catCols(group.items.length) } as CSSProperties} aria-labelledby={`ads-cat-${group.id}`}>
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
    </div>
  );
}
