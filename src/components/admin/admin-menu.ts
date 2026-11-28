// The admin panel menu: ONE list that drives the sidebar (admin-nav.tsx), the dashboard tiles (app/admin/(panel)/page.tsx) AND the access rights
// (who may open which screen: lib/admin-grants.ts, lib/auth.ts requireArea). To add a screen: add it to a group here, give it an icon key in
// admin-icons.tsx and an `area` (its name in the access list). A screen without an `area` is open to every admin who is signed in (the dashboard).
import type { AdminBadges } from "@/lib/admin-badges";

export type AdminIconKey =
  | "dashboard" | "pages" | "projects" | "blog" | "team" | "settings" | "careers" | "jobs" | "setup"
  | "training" | "leads" | "alerts" | "submissions" | "instructions" | "integrations" | "guide" | "access" | "versions" | "visitors";

/** The names of the screens an admin can be given access to (one per menu item, except the dashboard and Admin access). */
export type AdminArea =
  | "projects" | "blog" | "team" | "settings" | "training" | "visitors"
  | "careers" | "jobs" | "setup"
  | "leads" | "alerts"
  | "ai-submissions" | "ai-instructions" | "ai-integrations" | "ai-guide"
  | "versions";

export type AdminItem = {
  href: string;
  label: string;
  hint: string;
  icon: AdminIconKey;
  /** the active state is the exact path only (a parent of other menu items) */
  exact?: boolean;
  /** which number of AdminBadges is shown next to it, and in which colour */
  badge?: { key: keyof AdminBadges; tone: "brand" | "sky" | "amber" | "rose" };
  /** the name of this screen in the access list; none = open to every signed-in admin */
  area?: AdminArea;
  /** only a master admin (Admin@ or Harsh@) may open it; it is never given to the team member */
  superOnly?: boolean;
};

export type AdminGroup = { id: string; title: string; blurb: string; items: AdminItem[] };

export const ADMIN_GROUPS: AdminGroup[] = [
  {
    id: "overview",
    title: "Overview",
    blurb: "Where you start",
    items: [{ href: "/admin", label: "Dashboard", hint: "Everything at a glance", icon: "dashboard", exact: true }],
  },
  {
    id: "content",
    title: "Website content",
    blurb: "What visitors read and see",
    items: [
      { href: "/admin/projects", label: "Projects", hint: "Portfolio projects with pictures", icon: "projects", area: "projects" },
      { href: "/admin/blog", label: "Blog", hint: "Write and publish articles", icon: "blog", area: "blog" },
      { href: "/admin/team", label: "Team", hint: "People on the About and Team pages", icon: "team", area: "team" },
      { href: "/admin/settings", label: "Site settings", hint: "Menu, contact details, footer", icon: "settings", area: "settings" },
      { href: "/admin/industrial-training", label: "Industrial Training", hint: "Courses and fees of the 3, 6 and 9 month training", icon: "training", area: "training" },
      { href: "/admin/visitors", label: "Visitors", hint: "Who opened the site, and how many live cursors show", icon: "visitors", area: "visitors" },
    ],
  },
  {
    id: "hiring",
    title: "Hiring",
    blurb: "Jobs and applications",
    items: [
      { href: "/admin/careers", label: "Careers", hint: "Applications board, notes, interviews", icon: "careers", exact: true, badge: { key: "applications", tone: "sky" }, area: "careers" },
      { href: "/admin/careers/jobs", label: "Job openings", hint: "Create and edit jobs", icon: "jobs", area: "jobs" },
      { href: "/admin/careers/setup", label: "Careers setup", hint: "Questions and options of the apply form", icon: "setup", area: "setup" },
    ],
  },
  {
    id: "inbox",
    title: "Inbox",
    blurb: "Messages and warnings",
    items: [
      { href: "/admin/leads", label: "Leads", hint: "Messages from the contact form", icon: "leads", badge: { key: "leads", tone: "brand" }, area: "leads" },
      { href: "/admin/alerts", label: "Alerts", hint: "Errors and warnings of the site", icon: "alerts", badge: { key: "alerts", tone: "rose" }, area: "alerts" },
    ],
  },
  {
    id: "ai",
    title: "AI",
    blurb: "Content written with Claude and other AI tools",
    items: [
      { href: "/admin/ai-submissions", label: "AI Submissions", hint: "Drafts waiting for your OK", icon: "submissions", badge: { key: "submissions", tone: "amber" }, area: "ai-submissions" },
      { href: "/admin/ai-instructions", label: "AI Instructions", hint: "What the AI must ask and how it writes", icon: "instructions", area: "ai-instructions" },
      { href: "/admin/ai-integrations", label: "AI Integrations", hint: "Connect Claude and other AI tools", icon: "integrations", area: "ai-integrations" },
      { href: "/admin/ai-guide", label: "AI Guide", hint: "How to work with the AI", icon: "guide", area: "ai-guide" },
    ],
  },
  {
    id: "access",
    title: "Access",
    blurb: "Who can sign in, and where",
    items: [{ href: "/admin/access", label: "Admin access", hint: "The three accounts and which screens each one may open", icon: "access", superOnly: true }],
  },
  {
    id: "system",
    title: "System",
    blurb: "Website versions",
    items: [{ href: "/admin/versions", label: "Versions", hint: "Every update with its version number", icon: "versions", area: "versions" }],
  },
];

export const isItemActive = (item: AdminItem, pathname: string) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

/** Every screen that can be given to an admin, in menu order (the rows of the access table). */
export const ADMIN_AREAS: { key: AdminArea; label: string; hint: string; group: string }[] = ADMIN_GROUPS.flatMap((g) =>
  g.items.filter((i): i is AdminItem & { area: AdminArea } => Boolean(i.area)).map((i) => ({ key: i.area, label: i.label, hint: i.hint, group: g.title })),
);
export const isAdminArea = (v: unknown): v is AdminArea => ADMIN_AREAS.some((a) => a.key === v);

/** The screen a path of the admin belongs to: the longest menu address that contains it ("/admin/careers/jobs/new" = jobs, "/admin/careers/interviews" = careers). */
export function areaOfPath(pathname: string): AdminArea | "access" | null {
  let best: AdminItem | null = null;
  for (const g of ADMIN_GROUPS)
    for (const item of g.items) {
      if (!item.area && !item.superOnly) continue;
      if ((pathname === item.href || pathname.startsWith(`${item.href}/`)) && (!best || item.href.length > best.href.length)) best = item;
    }
  return best ? (best.superOnly ? "access" : (best.area ?? null)) : null;
}

/** May this admin see/open the menu item? `areas` = what the admin has been given; `isSuper` = a master admin (everything, and Admin access). */
export const canSee = (item: AdminItem, who: { isSuper: boolean; areas: readonly string[] }) => (item.superOnly ? who.isSuper : !item.area || who.isSuper || who.areas.includes(item.area));
