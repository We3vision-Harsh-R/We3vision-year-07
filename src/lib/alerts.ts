import "server-only";
import { after } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { db, hasDb } from "@/lib/db";
import { siteBase } from "@/lib/seo-ping";
import { sendWhatsApp, whatsappProvider } from "@/lib/whatsapp";

// The alert system of the whole website. Anything that goes wrong or looks like an attack calls raiseAlert(): a server error on any page, a
// failed save of a contact message or a job application, too many login attempts, a form being flooded, a hacking tool scanning the site,
// an error in a visitor's browser. Every alert is kept for Admin > Alerts (table Setting, key "siteAlerts", the latest 300; the same alert
// again only raises its counter) and the serious ones (critical, warning) also go to the owner's WhatsApp (see lib/whatsapp.ts), at most once
// per 30 minutes for the same alert and 12 an hour in all, so an attack can never flood the phone. raiseAlert never throws.

export type AlertLevel = "critical" | "warning" | "info";
export type AlertInput = { level: AlertLevel; kind: string; title: string; detail?: string; path?: string; ip?: string; count?: number; notify?: boolean };
export type SiteAlert = {
  id: string;
  level: AlertLevel;
  kind: string;
  title: string;
  detail: string;
  path: string;
  ip: string;
  count: number;
  firstAt: string;
  lastAt: string;
  read: boolean;
};

const KEY = "siteAlerts";
const KEEP = 300;
const SAME_FOR = 6 * 60 * 60_000; // an unread alert with the same key within 6 hours is counted instead of added again
const WA_EVERY = 30 * 60_000;
const WA_PER_HOUR = 12;

const lastSent = new Map<string, number>();
let sentTimes: number[] = [];
let chain: Promise<unknown> = Promise.resolve();

/** no control characters, no password inside a connection address, not too long */
const clean = (s: unknown, max: number) =>
  String(s ?? "")
    .replace(/\p{Cc}/gu, (c) => (c === "\n" ? c : " "))
    .replace(/(\w+:\/\/)[^\s/@]+@/g, "$1***@")
    .slice(0, max);

export async function readAlerts(): Promise<SiteAlert[]> {
  if (!hasDb) return [];
  try {
    const row = await db.setting.findUnique({ where: { key: KEY } });
    const items = (row?.value as { items?: SiteAlert[] } | null)?.items;
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

async function writeAlerts(items: SiteAlert[]) {
  if (!hasDb) return;
  const value = { items: items.slice(0, KEEP) } as unknown as Prisma.InputJsonValue;
  await db.setting.upsert({ where: { key: KEY }, update: { value }, create: { key: KEY, value } });
}

/** one change at a time in this process (two alerts at the same moment must not overwrite each other) */
export function editAlerts(fn: (items: SiteAlert[]) => SiteAlert[]): Promise<void> {
  const next = chain.then(async () => writeAlerts(fn(await readAlerts())));
  chain = next.catch((error) => console.error("alerts: could not save", error instanceof Error ? error.message : error));
  return chain.then(() => undefined);
}

const when = (d: Date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(d);

function whatsappText(a: { level: AlertLevel; title: string; detail: string; path: string; ip: string }, at: Date) {
  const base = siteBase();
  return [
    `${a.level === "critical" ? "🔴" : a.level === "warning" ? "🟠" : "🔵"} We3vision website alert (${a.level})`,
    a.title,
    a.path ? `Page: ${a.path}` : "",
    a.detail ? a.detail.slice(0, 400) : "",
    a.ip ? `From: ${a.ip}` : "",
    `${when(at)} IST`,
    base ? `Open: ${base}/admin/alerts` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function raiseAlert(input: AlertInput): Promise<void> {
  try {
    const now = new Date();
    const a = {
      level: input.level,
      kind: clean(input.kind, 40),
      title: clean(input.title, 160),
      detail: clean(input.detail, 800),
      path: clean(input.path, 200),
      ip: clean(input.ip, 64),
    };
    const add = Math.max(1, Math.min(100_000, Math.round(input.count ?? 1)));
    const key = `${a.kind}|${a.title}|${a.path}`;
    (a.level === "info" ? console.info : console.error)(`[alert:${a.level}] ${a.title} ${a.path} ${a.detail.slice(0, 200)}`);

    const save = editAlerts((items) => {
      const i = items.findIndex((x) => `${x.kind}|${x.title}|${x.path}` === key && !x.read && now.getTime() - Date.parse(x.lastAt) < SAME_FOR);
      if (i >= 0) {
        const x = items[i];
        const updated: SiteAlert = { ...x, count: x.count + add, lastAt: now.toISOString(), detail: a.detail || x.detail, ip: a.ip || x.ip };
        return [updated, ...items.slice(0, i), ...items.slice(i + 1)];
      }
      const id = `${now.getTime().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
      return [{ id, ...a, count: add, firstAt: now.toISOString(), lastAt: now.toISOString(), read: false }, ...items];
    });

    let send: Promise<unknown> = Promise.resolve();
    if ((a.level !== "info" || input.notify) && whatsappProvider()) {
      const t = now.getTime();
      sentTimes = sentTimes.filter((s) => t - s < 60 * 60_000);
      if (t - (lastSent.get(key) ?? 0) >= WA_EVERY && sentTimes.length < WA_PER_HOUR) {
        lastSent.set(key, t);
        sentTimes.push(t);
        if (lastSent.size > 500) lastSent.clear();
        send = sendWhatsApp(whatsappText(a, now));
      }
    }
    await Promise.allSettled([save, send]);
  } catch (error) {
    console.error("raiseAlert failed", error instanceof Error ? error.message : error);
  }
}

/** raiseAlert after the answer is sent (inside a page, a server action or an API route), so the visitor never waits for it */
export function alertLater(input: AlertInput) {
  try {
    after(() => raiseAlert(input));
  } catch {
    void raiseAlert(input);
  }
}

/** a save that failed (the database is down, a bug): critical when a visitor's message or application is lost, warning in the admin panel */
export function alertFailure(what: string, error: unknown, level: AlertLevel = "critical", detail = "") {
  const why = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  alertLater({ level, kind: "save", title: `${what} failed`, detail: [detail, why].filter(Boolean).join("\n") });
}

/** a new message from the contact form goes to the owner's WhatsApp (it is not kept as an alert: it is already in Admin > Leads) */
export async function notifyNewLead(lead: { name: string; email: string; phone: string; message: string }) {
  if (!whatsappProvider() || process.env.ALERT_LEADS === "off") return;
  const base = siteBase();
  const lines = [
    "📩 New message from the We3vision website",
    `Name: ${clean(lead.name, 100)}`,
    `E-mail: ${clean(lead.email, 200)}`,
    lead.phone ? `Phone: ${clean(lead.phone, 30)}` : null,
    "",
    clean(lead.message, 600),
    base ? `\nOpen: ${base}/admin/leads` : null,
  ];
  await sendWhatsApp(lines.filter((l) => l !== null).join("\n"));
}
