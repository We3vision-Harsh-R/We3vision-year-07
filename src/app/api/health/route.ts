import { db, hasDb } from "@/lib/db";

// Keep-alive of the database (task 144). A free Supabase project is PAUSED after 7 days without any database activity, and the website then
// stops working until somebody presses Resume. A scheduled job (docs/github-keepalive.yml (add it to GitHub as .github/workflows/keepalive.yml), every 6 hours) opens this address; it makes one
// tiny real read, so the database never counts as idle. It shows no data and no secret: only "ok" and the time. It is also a health check:
// the answer is 503 when the database does not answer, so the job (and the owner) can see the problem the same day.
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
let last = { at: 0, ok: false };

export async function GET() {
  // one real query at most every 20 seconds, so this address can not be used to load the database
  if (Date.now() - last.at < 20_000) return Response.json({ ok: last.ok, cached: true }, { status: last.ok ? 200 : 503, headers: HEADERS });
  if (!hasDb) return Response.json({ ok: false, error: "no database configured" }, { status: 503, headers: HEADERS });
  try {
    await db.$queryRaw`select 1 as ok`;
    last = { at: Date.now(), ok: true };
    return Response.json({ ok: true, at: new Date().toISOString() }, { headers: HEADERS });
  } catch {
    last = { at: Date.now(), ok: false };
    return Response.json({ ok: false, error: "database did not answer" }, { status: 503, headers: HEADERS });
  }
}
