import type { PageSection } from "@/lib/cms/pages";
import type { NavTab, OutlineItem, TabIconName } from "../app/nav-types";
import { oneLine } from "../app/text";

// The bottom tab bar of a page is worked out from its sections: "Intro" (the top) and up to three main topics, in the order they appear on the page.
// The Apps tab is added by the bar itself. Every other section is reachable from "On this page" in the Apps sheet.

const TOPICS: { type: string; label: string; icon: TabIconName }[] = [
  { type: "services", label: "Services", icon: "services" },
  { type: "process", label: "Process", icon: "process" },
  { type: "tags", label: "Tech", icon: "tech" },
  { type: "projects", label: "Work", icon: "work" },
  { type: "advantages", label: "Why us", icon: "why" },
  { type: "strengths", label: "Why us", icon: "why" },
  { type: "industries", label: "Sectors", icon: "industries" },
  { type: "faq", label: "FAQ", icon: "faq" },
  { type: "highlights", label: "Facts", icon: "why" },
  { type: "timeline", label: "Journey", icon: "process" },
  { type: "team", label: "Team", icon: "team" },
  { type: "blogs", label: "Blog", icon: "blog" },
  { type: "contact", label: "Contact", icon: "contact" },
];

export function tabsFor(sections: PageSection[]): NavTab[] {
  const tabs: NavTab[] = [{ id: null, label: "Intro", icon: "overview" }];
  const picked: { at: number; tab: NavTab }[] = [];
  const used = new Set<string>();
  for (const t of TOPICS) {
    if (picked.length >= 3) break;
    if (used.has(t.label)) continue;
    const at = sections.findIndex((s, i) => i > 0 && s.type === t.type && s.id);
    if (at < 0) continue;
    used.add(t.label);
    picked.push({ at, tab: { id: sections[at].id, label: t.label, icon: t.icon } });
  }
  picked.sort((a, b) => a.at - b.at);
  return [...tabs, ...picked.map((p) => p.tab)];
}

/** every section that has a title, for the "On this page" list */
export function outlineFor(sections: PageSection[]): OutlineItem[] {
  const out: OutlineItem[] = [];
  const seen = new Set<string>();
  sections.forEach((s, i) => {
    if (i === 0 || !s.id) return;
    const d = s.data as { chip?: unknown; heading?: unknown };
    const raw = typeof d.chip === "string" && d.chip.trim() ? d.chip : typeof d.heading === "string" ? d.heading : "";
    const label = oneLine(raw).trim();
    if (!label || seen.has(label)) return;
    seen.add(label);
    out.push({ id: s.id, label });
  });
  return out.slice(0, 14);
}
