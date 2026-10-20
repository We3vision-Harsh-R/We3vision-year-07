import type { SiteAlert } from "@/lib/alerts";

// "Copy for AI" on Admin > Alerts: turns an alert into a ready prompt (what happened, where, how often, the stack trace, the tech stack of this
// website and exactly what to answer), so the owner can paste it into ChatGPT / Claude / Gemini / Cursor and get the cause and the fix.
// Pure text building (no server code): the button builds it in the browser from the alert data already on the page.

const KIND: Record<string, { name: string; means: string }> = {
  server: { name: "Server error", means: "A page, API route or form (server action) of the website crashed on the server while a visitor or an admin used it." },
  browser: { name: "Browser error", means: "A JavaScript error happened inside a visitor's browser (a part of a page crashed). The file names in the trace are the browser bundles under /_next/static/." },
  save: { name: "Failed save", means: "Saving something to the database failed (a contact message, an application, a page edit ...). Data may have been lost." },
  attack: { name: "Blocked attack", means: "A hacking tool or bot request was blocked by the website's shield. Usually no code fix is needed unless it is a real bug being exploited." },
  login: { name: "Login problem", means: "Many failed admin login attempts, or a login error." },
  limit: { name: "Rate limit", means: "A visitor or bot sent too many requests to a form or API and was stopped." },
  admin: { name: "Admin activity", means: "A change of admin users, passwords or sign-ins." },
  ai: { name: "AI integration", means: "A problem in the AI content integration (the private MCP server, AI tokens or the approval queue)." },
  oauth: { name: "OAuth", means: "A problem in the sign-in flow that connects an AI tool (Claude, Cursor ...) to the website." },
  token: { name: "AI token", means: "A problem with a personal access token of the AI integration." },
};

const LEVEL = { critical: "Critical (serious: needs a fix)", warning: "Warning (look at it soon)", info: "Info (for your knowledge)" } as const;

const ist = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Kolkata" }).format(d)} IST`;
};

const STACK = [
  "Website: We3vision (company website + admin CMS). One Next.js 16 app (App Router, webpack build), React 19, TypeScript 6, Tailwind CSS 4, Prisma 7 with PostgreSQL (Supabase), hosted as a Node app on Hostinger.",
  "Code is in the `src/` folder: pages in `src/app/` (route groups in round brackets such as `(site)` or `(panel)` are NOT part of the web address), server actions in `src/actions/`, shared code in `src/lib/`, admin screens in `src/components/admin/`.",
  "In production the file names in a stack trace can be minified bundle names; then use the route / page address above to find the page file.",
];

const ASK = [
  "I am not a developer. Please do these things:",
  "1. Explain in simple words what went wrong.",
  "2. Tell me exactly WHERE the problem is (file and line if you can tell from the details; otherwise which page or feature, and which file to open).",
  "3. Give the exact fix: the code to change (old code -> new code) or the setting to change, step by step.",
  "4. Tell me how to test that it is fixed and how to stop it coming back.",
  "If something is missing to be sure, say exactly what I should send you (for example which file).",
];

function alertBlock(a: SiteAlert, siteUrl: string, heading: string): string[] {
  const kind = KIND[a.kind];
  return [
    heading,
    `- Severity: ${LEVEL[a.level] ?? a.level}`,
    `- Type: ${kind ? `${kind.name} (${a.kind})` : a.kind || "unknown"}`,
    kind ? `- What this type means: ${kind.means}` : null,
    `- Title: ${a.title}`,
    a.path ? `- Page / address where it happened: ${siteUrl.replace(/\/$/, "")}${a.path}` : null,
    a.ip ? `- From IP: ${a.ip}` : null,
    `- Times it happened: ${a.count}`,
    `- First seen: ${ist(a.firstAt)}`,
    `- Last seen: ${ist(a.lastAt)}`,
    "",
    "Error details and stack trace:",
    "```",
    a.detail.trim() || "(no more details were recorded)",
    "```",
  ].filter((l): l is string => l !== null);
}

const ABOUT = ["## About my website", ...STACK.map((s) => `- ${s}`)];

/** one alert as a prompt for an AI */
export function buildAlertReport(a: SiteAlert, siteUrl = ""): string {
  return [
    "My website's admin panel (Admin > Alerts) logged the problem below.",
    ...ASK,
    "",
    ...alertBlock(a, siteUrl, "## The alert"),
    "",
    ...ABOUT,
  ].join("\n");
}

/** several alerts in one prompt (the AI is asked to find what they have in common) */
export function buildAlertsReport(list: SiteAlert[], siteUrl = ""): string {
  if (list.length === 1) return buildAlertReport(list[0], siteUrl);
  return [
    `My website's admin panel (Admin > Alerts) logged ${list.length} problems.`,
    ...ASK,
    "For EACH problem give the answer. If several have the same cause, say so and give one fix for them.",
    "",
    ...list.flatMap((a, i) => [...alertBlock(a, siteUrl, `## Problem ${i + 1} of ${list.length}`), ""]),
    ...ABOUT,
  ].join("\n");
}

/** the readable name of an alert type (kind), for the label on the alert card */
export const alertKindName = (kind: string) => KIND[kind]?.name ?? kind;
