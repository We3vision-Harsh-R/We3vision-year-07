import type { AdminIconKey } from "@/components/admin/admin-menu";

// One line-icon per admin menu item (24 x 24, drawn with the current text colour).
const PATHS: Record<AdminIconKey, string> = {
  dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z",
  pages: "M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5",
  projects: "M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4M9 9.5h.01",
  blog: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3",
  team: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 100-5M21 19c0-2-1.5-3.5-4-4",
  settings: "M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4",
  careers: "M4 5h16v14H4zM9 11a2 2 0 100-4 2 2 0 000 4zM6 16c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5M14 9h4M14 13h4",
  jobs: "M3 8h18v11H3zM9 8V5h6v3M3 13h18",
  setup: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  leads: "M3 6h18v12H3zM3 7l9 6 9-6",
  alerts: "M6 17v-6a6 6 0 0112 0v6l2 2H4zM10 21h4",
  submissions: "M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5",
  instructions: "M4 6h16M4 11h16M4 16h8M16 17l2 2 3-4",
  integrations: "M9 3v5M15 3v5M6 8h12v4a6 6 0 01-12 0zM12 18v3",
  guide: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M9 8h7",
  access: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",
};

export function AdminIcon({ name, size = 20 }: { name: AdminIconKey; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}
