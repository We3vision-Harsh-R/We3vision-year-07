import { ipOf, preflight, reply } from "@/lib/ai-content/server/http";
import { revokeToken } from "@/lib/ai-content/server/oauth";
import { hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// RFC 7009: a tool that is being disconnected can revoke its own token. Always answers 200 (it never tells whether a token existed).
export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

export async function POST(request: Request) {
  if (hasDb && rateLimit(`oauth-revoke:${ipOf(request)}`, 30, 10 * 60_000)) {
    try {
      const type = request.headers.get("content-type") ?? "";
      const token = type.includes("json") ? String(((await request.json()) as { token?: unknown }).token ?? "") : (new URLSearchParams(await request.text()).get("token") ?? "");
      if (token) await revokeToken(token.slice(0, 200));
    } catch {
      // nothing to revoke
    }
  }
  return reply({});
}
