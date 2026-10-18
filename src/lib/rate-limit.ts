// Tiny in-memory sliding-window limiter. Good enough for one Node process (Hostinger);
// resets on restart. Used for login attempts, the contact form and the Careers forms.
// The first time a limit is reached in a window, an alert is raised (Admin > Alerts + WhatsApp, see lib/alerts.ts).
const hits = new Map<string, number[]>();
const alerted = new Map<string, number>();

const ALERT_FOR: Record<string, string> = {
  login: "Too many login attempts on the admin panel",
  "login-email": "Too many wrong passwords for one admin account (locked for 15 minutes)",
  lead: "The contact form is being flooded by one visitor",
  "career-book": "The Careers seat booking is being flooded by one visitor",
  "career-done": "The Careers ticket form is being flooded by one visitor",
  "career-apply": "The job application form is being flooded by one visitor",
  resume: "Too many resume uploads from one visitor",
};

function warn(key: string, windowMs: number, now: number) {
  const at = key.indexOf(":");
  const kind = at > 0 ? key.slice(0, at) : key;
  const title = ALERT_FOR[kind];
  if (!title || now - (alerted.get(key) ?? 0) < windowMs) return;
  if (alerted.size > 2000) alerted.clear();
  alerted.set(key, now);
  const who = key.slice(at + 1);
  void import("./alerts")
    .then(({ alertLater }) => alertLater({ level: "warning", kind: "limit", title, ...(kind === "login-email" ? { detail: `Account: ${who}` } : { ip: who }) }))
    .catch(() => undefined);
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    warn(key, windowMs, now);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (recent.length === limit) warn(key, windowMs, now);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

/** true when the key already used its limit in the window (does not count as a new try) */
export function isLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  return (hits.get(key) ?? []).filter((t) => now - t < windowMs).length >= limit;
}

export function resetLimit(key: string) {
  hits.delete(key);
}
