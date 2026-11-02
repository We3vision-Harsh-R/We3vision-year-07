import { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { cleanName, deviceOf } from "@/lib/presence";
import { getPresenceConfigLive, logVisit, reportAndList } from "@/lib/presence-server";

// The live cursors: every open laptop page posts where its pointer is a few times a second and gets back the cursors of the other visitors
// who are on the same page (components/site/presence-cursors.tsx). Nothing is kept except the visitor log (id, name, device, last page).
export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : null);

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "ip";
  if (!rateLimit(`presence:${ip}`, 900, 60_000)) return Response.json({ ok: false }, { status: 429, headers: NO_STORE });
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return Response.json({ ok: false }, { status: 400, headers: NO_STORE });
  }
  const id = typeof b.id === "string" && /^[a-z0-9]{8,32}$/i.test(b.id) ? b.id : "";
  const path = typeof b.p === "string" && b.p.startsWith("/") ? b.p.slice(0, 120) : "/";
  if (!id) return Response.json({ ok: false }, { status: 400, headers: NO_STORE });
  const name = cleanName(b.n) || "Guest";
  const cfg = await getPresenceConfigLive();
  const others = cfg.cursors ? reportAndList({ id, name, path, x: num(b.x), y: num(b.y) }, cfg.max) : [];
  if (b.hi === true) void logVisit(id, cleanName(b.n), deviceOf(req.headers.get("user-agent") ?? ""), path, b.tab === true);
  return Response.json({ ok: true, cursors: cfg.cursors, askName: cfg.askName, others }, { headers: NO_STORE });
}

// the settings a page needs before it asks anything (first visit): does it ask for a name, are cursors on
export async function GET() {
  const cfg = await getPresenceConfigLive();
  return Response.json({ cursors: cfg.cursors, askName: cfg.askName }, { headers: NO_STORE });
}
