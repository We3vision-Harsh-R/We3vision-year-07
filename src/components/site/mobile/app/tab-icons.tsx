import type { TabIconName } from "./nav-types";

// The icons of the bottom tab bar (24 grid). Each has an outline and, when its tab is active, a solid layer that CSS fades in.
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

const ICONS: Record<TabIconName, { line: string; fill?: string }> = {
  overview: { line: "M4 11.2 12 4l8 7.2V19a1.5 1.5 0 0 1-1.5 1.5h-3.2V15h-6.6v5.5H5.5A1.5 1.5 0 0 1 4 19z", fill: "M4 11.2 12 4l8 7.2V19a1.5 1.5 0 0 1-1.5 1.5h-3.2V15h-6.6v5.5H5.5A1.5 1.5 0 0 1 4 19z" },
  services: { line: "M12 3.5 3.5 8 12 12.5 20.5 8zM3.5 12 12 16.5 20.5 12M3.5 16 12 20.5 20.5 16" },
  process: { line: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" },
  tech: { line: "M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" },
  industries: { line: "M4 20V7.5L12 4l8 3.5V20M4 20h16M9 20v-5h6v5M8.5 10h.01M12 10h.01M15.5 10h.01" },
  why: { line: "M12 3.5 19 6v5.5c0 4.2-2.9 7.2-7 9-4.1-1.8-7-4.8-7-9V6zM8.8 12l2.3 2.3 4.2-4.6" },
  faq: { line: "M12 21a9 9 0 1 0-9-9c0 1.6.4 3 1.2 4.3L3 21l4.8-1.2A9 9 0 0 0 12 21zM9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5M12 16.5h.01" },
  work: { line: "M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5zM9 7V5.8A1.3 1.3 0 0 1 10.3 4.5h3.4A1.3 1.3 0 0 1 15 5.8V7M3.5 12.5h17" },
  blog: { line: "M6 3.5h9l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-11.5A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5zM14.5 3.5V8H19M8 12.5h8M8 16h5" },
  contact: { line: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" },
  price: { line: "M12 3v18M16.5 7.5c-.6-1.2-2.3-2-4.5-2-2.6 0-4.5 1.2-4.5 3.2 0 4.3 9.3 2 9.3 6.3 0 2-2.1 3.2-4.8 3.2-2.4 0-4.2-.9-4.8-2.4" },
  team: { line: "M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.4-3.3 3.1-5.5 6.5-5.5s6.1 2.2 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.5M18 14.8c1.8.7 3.2 2.3 3.5 5.2" },
  apps: { line: "M5 4h4.5a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM14.5 4H19a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM5 13.5h4.5a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4.5a1 1 0 0 1 1-1zM14.5 13.5H19a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-4.5a1 1 0 0 1 1-1z" },
};

export function TabIcon({ name, className }: { name: TabIconName; className?: string }) {
  const i = ICONS[name];
  return (
    <svg {...base} className={className}>
      {i.fill && <path className="ma-ti-fill" d={i.fill} />}
      <path d={i.line} />
    </svg>
  );
}
