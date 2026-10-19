import { ipOf, preflight, reply } from "@/lib/ai-content/server/http";
import { registerClient } from "@/lib/ai-content/server/oauth";
import { hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// Dynamic client registration (RFC 7591): an AI tool announces its name and return addresses. It gets a client_id and nothing else: the
// admin still has to log in and press "Allow" before it receives any token.
export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

export async function POST(request: Request) {
  if (!hasDb) return reply({ error: "server_error", error_description: "The website database is not configured." }, 503);
  if (!rateLimit(`oauth-register:${ipOf(request)}`, 10, 60 * 60_000)) return reply({ error: "slow_down", error_description: "Too many registrations. Try again later." }, 429);
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) return reply({ error: "invalid_client_metadata", error_description: "Request too large." }, 413);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ error: "invalid_client_metadata", error_description: "The body must be JSON." }, 400);
  }
  const r = await registerClient(body);
  if (!r.ok) return reply({ error: r.error, error_description: r.description }, 400);
  return reply({ ...r.client, token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"] }, 201);
}
