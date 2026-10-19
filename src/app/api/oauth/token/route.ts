import { aiDisabled, ipOf, preflight, reply } from "@/lib/ai-content/server/http";
import { exchangeCode, pruneCodes, refreshTokens } from "@/lib/ai-content/server/oauth";
import { hasDb } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

// The OAuth token endpoint: a code (with the PKCE verifier) or a refresh token in, a new access token out.
export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

const oauthError = (error: string, description: string, status = 400) => reply({ error, error_description: description }, status);

export async function POST(request: Request) {
  if (aiDisabled()) return oauthError("temporarily_unavailable", "The AI integration is switched off.", 503);
  if (!hasDb) return oauthError("server_error", "The website database is not configured.", 503);
  if (!rateLimit(`oauth-token:${ipOf(request)}`, 60, 10 * 60_000)) return oauthError("slow_down", "Too many requests. Try again later.", 429);
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) return oauthError("invalid_request", "Request too large.", 413);
  let form: URLSearchParams;
  try {
    const type = request.headers.get("content-type") ?? "";
    form = type.includes("json") ? new URLSearchParams(Object.entries((await request.json()) as Record<string, string>).map(([k, v]) => [k, String(v)])) : new URLSearchParams(await request.text());
  } catch {
    return oauthError("invalid_request", "Could not read the request.");
  }
  const grant = form.get("grant_type");
  const clientId = form.get("client_id") ?? "";
  void pruneCodes();
  const r =
    grant === "authorization_code"
      ? await exchangeCode({ code: form.get("code") ?? "", redirectUri: form.get("redirect_uri") ?? "", clientId, verifier: form.get("code_verifier") ?? "" })
      : grant === "refresh_token"
        ? await refreshTokens({ refreshToken: form.get("refresh_token") ?? "", clientId })
        : null;
  if (!r) return oauthError("unsupported_grant_type", "Use authorization_code or refresh_token.");
  if (!r.ok) return oauthError(r.error, r.description, r.status);
  return reply(r.body);
}
