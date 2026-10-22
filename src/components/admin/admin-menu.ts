// The admin panel menu: ONE list that drives the sidebar (admin-nav.tsx) and the dashboard tiles (app/admin/(panel)/page.tsx).
// To add a screen: add it to a group here and give it an icon key in admin-icons.tsx.
import type { AdminBadges } from "@/lib/admin-badges";

export type AdminIconKey =
  | "dashboard" | "pages" | "projects" | "blog" | "team" | "settings" | "careers" | "jobs" | "setup"
  | "leads" | "alerts" | "submissions" | "instructions" | "integrations" | "guide" | "access";

export type AdminItem = {
  href: string;
  label: string;
  hint: string;
  icon: AdminIconKey;
  /** the active state is the exact path only (a parent of other menu items) */
  exact?: boolean;
  /** which number of AdminBadges is shown next to it, and in which colour */
  badge?: { key: keyof AdminBadges; tone: "brand" | "sky" | "amber" | "rose" };
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
      { href: "/admin/pages", label: "Pages", hint: "Text and pictures of every page", icon: "pages" },
      { href: "/admin/projects", label: "Projects", hint: "Portfolio projects with pictures", icon: "projects" },
      { href: "/admin/blog", label: "Blog", hint: "Write and publish articles", icon: "blog" },
      { href: "/admin/team", label: "Team", hint: "People on the About and Team pages", icon: "team" },
      { href: "/admin/settings", label: "Site settings", hint: "Menu, contact details, footer", icon: "settings" },
    ],
  },
  {
    id: "hiring",
    title: "Hiring",
    blurb: "Jobs and applications",
    items: [
      { href: "/admin/careers", label: "Careers", hint: "Applications board, notes, interviews", icon: "careers", exact: true, badge: { key: "applications", tone: "sky" } },
      { href: "/admin/careers/jobs", label: "Job openings", hint: "Create and edit jobs", icon: "jobs" },
      { href: "/admin/careers/setup", label: "Careers setup", hint: "Questions and options of the apply form", icon: "setup" },
    ],
  },
  {
    id: "inbox",
    title: "Inbox",
    blurb: "Messages and warnings",
    items: [
      { href: "/admin/leads", label: "Leads", hint: "Messages from the contact form", icon: "leads", badge: { key: "leads", tone: "brand" } },
      { href: "/admin/alerts", label: "Alerts", hint: "Errors and warnings of the site", icon: "alerts", badge: { key: "alerts", tone: "rose" } },
    ],
  },
  {
    id: "ai",
    title: "AI",
    blurb: "Content written with Claude and other AI tools",
    items: [
      { href: "/admin/ai-submissions", label: "AI Submissions", hint: "Drafts waiting for your OK", icon: "submissions", badge: { key: "submissions", tone: "amber" } },
      { href: "/admin/ai-instructions", label: "AI Instructions", hint: "What the AI must ask and how it writes", icon: "instructions" },
      { href: "/admin/ai-integrations", label: "AI Integrations", hint: "Connect Claude and other AI tools", icon: "integrations" },
      { href: "/admin/ai-guide", label: "AI Guide", hint: "How to work with the AI", icon: "guide" },
    ],
  },
  {
    id: "access",
    title: "Access",
    blurb: "Who can sign in",
    items: [{ href: "/admin/access", label: "Admin access", hint: "Admin accounts and passwords", icon: "access" }],
  },
];

export const isItemActive = (item: AdminItem, pathname: string) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));
