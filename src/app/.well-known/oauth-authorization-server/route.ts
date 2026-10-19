import { SCOPES } from "@/lib/ai-content/server/tokens";
import { preflight, reply, siteOrigin } from "@/lib/ai-content/server/http";

// OAuth discovery (RFC 8414): where an AI tool registers itself, sends the admin to allow access, and gets tokens.
export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

export function GET(request: Request) {
  const origin = siteOrigin(request);
  return reply({
    issuer: origin,
    authorization_endpoint: `${origin}/admin/connect`,
    token_endpoint: `${origin}/api/oauth/token`,
    registration_endpoint: `${origin}/api/oauth/register`,
    revocation_endpoint: `${origin}/api/oauth/revoke`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    scopes_supported: SCOPES,
  });
}
