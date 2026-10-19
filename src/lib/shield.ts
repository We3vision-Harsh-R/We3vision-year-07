import type { AlertInput } from "@/lib/alerts";

// The shield in front of every page (used by proxy.ts). It stops, before any page code runs:
//   - hacking tools that look for weak spots (WordPress / PHP / .env / .git addresses this site does not have, sqlmap, nikto ...)
//   - attack text in the address (SQL injection, <script>, ../ path tricks)
//   - one visitor sending a flood of requests (more than 400 pages a minute)
// A visitor that keeps probing (15 times in 10 minutes) is blocked for an hour, a flood for 10 minutes. Everything is counted in memory
// (one Node process, reset on restart) and reported to Admin > Alerts at most once a minute, so an attack costs almost nothing.
// Visitors without a known address (or with a private one: the host's own network) are never blocked by the counters.

const PROBE_PATH =
  /^\/(?:wp-(?:admin|login|content|includes|json|config)|wordpress(?:\/|$)|xmlrpc|phpmyadmin|pma\b|myadmin|mysql|adminer|cgi-bin|vendor\/|boaform|hnap1|owa\/|autodiscover|actuator|solr\b|jenkins|manager\/html|telescope|_ignition|administrator|server-status|backup\b)/i;
const PROBE_EXT = /\.(?:php\d?|aspx?|jsp|cgi|pl|env|ini|sql|bak|old|swp|sh|cfg|conf|log|ya?ml|git|svn|htaccess|htpasswd|ds_store)(?:$|[/.])/i;
const BAD_INPUT =
  /<\s*\/?\s*script|javascript:|\bunion\b[\s+/*]+(?:all[\s+]+)?select\b|information_schema|\b(?:sleep|benchmark|pg_sleep|waitfor)\s*\(|\.\.[/\\]|\/etc\/passwd|win\.ini|\$\{jndi:|\bor\b\s+['"]?1['"]?\s*=\s*['"]?1|<\?php|\bon(?:error|load)\s*=/i;
const BAD_AGENT = /sqlmap|nikto|nmap|masscan|zgrab|wpscan|acunetix|nessus|dirbuster|gobuster|nuclei|havij|netsparker|feroxbuster|ffuf|whatweb|jorgee/i;
const PRIVATE = /^(?:unknown$|10\.|127\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|::1$|::ffff:127\.|f[cd][0-9a-f]{2}:|fe80:)/i;

const FLOOD_LIMIT = 400;
const FLOOD_WINDOW = 60_000;
const FLOOD_BAN = 10 * 60_000;
const PROBE_LIMIT = 15;
const PROBE_WINDOW = 10 * 60_000;
const PROBE_BAN = 60 * 60_000;
const REPORT_EVERY = 60_000;

const banned = new Map<string, number>();
const flood = new Map<string, { start: number; n: number }>();
const probes = new Map<string, { start: number; n: number }>();
let pending = { n: 0, path: "", ip: "", why: "" };
let lastReport = 0;
const queued: AlertInput[] = [];

function bump(map: Map<string, { start: number; n: number }>, ip: string, windowMs: number, now: number) {
  const v = map.get(ip);
  if (!v || now - v.start >= windowMs) {
    if (map.size > 20_000) map.clear();
    map.set(ip, { start: now, n: 1 });
    return 1;
  }
  v.n += 1;
  return v.n;
}

function decode(s: string) {
  try {
    return decodeURIComponent(s.replace(/\+/g, " "));
  } catch {
    return s;
  }
}

export type ShieldResult = { status: 403 | 404 | 429; text: string; retryAfter?: number } | null;

/** null = let the request through; otherwise the answer to send instead. takeAlerts() gives what to report. */
export function shield(pathname: string, search: string, userAgent: string, ip: string, now = Date.now()): ShieldResult {
  if (pathname.startsWith("/.well-known/")) return null; // SSL certificates, app links
  const trusted = PRIVATE.test(ip);

  const until = banned.get(ip);
  if (until) {
    if (now < until) return { status: 403, text: "Access blocked for a while.", retryAfter: Math.ceil((until - now) / 1000) };
    banned.delete(ip);
  }

  if (!trusted && bump(flood, ip, FLOOD_WINDOW, now) > FLOOD_LIMIT) {
    banned.set(ip, now + FLOOD_BAN);
    queued.push({ level: "warning", kind: "attack", title: "Blocked a flood of requests from one visitor", detail: `More than ${FLOOD_LIMIT} requests in a minute. Blocked for 10 minutes.`, ip });
    return { status: 429, text: "Too many requests.", retryAfter: FLOOD_BAN / 1000 };
  }

  const why = PROBE_PATH.test(pathname) || PROBE_EXT.test(pathname) ? "looked for a weak spot" : BAD_AGENT.test(userAgent) ? "hacking tool" : BAD_INPUT.test(decode(pathname + search)) ? "attack text in the address" : "";
  if (!why) return null;

  pending = { n: pending.n + 1, path: (pathname + search).slice(0, 160), ip, why };
  if (!trusted && bump(probes, ip, PROBE_WINDOW, now) === PROBE_LIMIT) {
    banned.set(ip, now + PROBE_BAN);
    if (banned.size > 20_000) banned.clear();
    queued.push({ level: "warning", kind: "attack", title: "Blocked a visitor that scanned the site for weak spots", detail: `${PROBE_LIMIT} hacking requests in 10 minutes (last: ${pending.path}). Blocked for 1 hour.`, ip });
  }
  return { status: why === "hacking tool" ? 403 : 404, text: "Not found." };
}

/** the alerts to raise now (blocked requests are summed up, once a minute at most) */
export function takeAlerts(now = Date.now()): AlertInput[] {
  if (pending.n > 0 && now - lastReport >= REPORT_EVERY) {
    lastReport = now;
    queued.push({ level: "info", kind: "attack", title: "Blocked hacking requests", detail: `${pending.n} blocked. Last one (${pending.why}): ${pending.path}`, ip: pending.ip, count: pending.n });
    pending = { n: 0, path: "", ip: "", why: "" };
  }
  return queued.splice(0, queued.length);
}
