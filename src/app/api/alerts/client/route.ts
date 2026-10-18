import { alertLater } from "@/lib/alerts";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

// A JavaScript error in a visitor's browser (sent by src/instrumentation-client.ts). Only from this website's own pages (same origin),
// small (8 KB at most) and 20 reports per visitor per 10 minutes. Errors of the site's own scripts are a warning (WhatsApp), others info.
const MAX = 8 * 1024;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let same = site === "same-origin";
  if (!site && origin) {
    try {
      same = new URL(origin).host === host;
    } catch {
      same = false;
    }
  }
  if (!same) return new Response(null, { status: 403 });
  if (Number(req.headers.get("content-length") ?? 0) > MAX) return new Response(null, { status: 413 });
  const ip = await clientIp();
  if (!rateLimit(`client-err:${ip}`, 20, 10 * 60_000)) return new Response(null, { status: 429 });
  try {
    const raw = await req.text();
    if (raw.length > MAX) return new Response(null, { status: 413 });
    const data = JSON.parse(raw) as Record<string, unknown>;
    const message = text(data.message, 300);
    if (!message) return new Response(null, { status: 204 });
    const stack = text(data.stack, 1200);
    const ours = /\/_next\/static\//.test(stack) || /\/_next\/static\//.test(text(data.source, 300));
    alertLater({
      level: ours ? "warning" : "info",
      kind: "browser",
      title: `Error in a visitor's browser: ${message.slice(0, 100)}`,
      detail: [message, stack.split("\n").slice(0, 4).join("\n")].filter(Boolean).join("\n"),
      path: text(data.path, 200),
      ip,
    });
  } catch {
    return new Response(null, { status: 400 });
  }
  return new Response(null, { status: 204 });
}
