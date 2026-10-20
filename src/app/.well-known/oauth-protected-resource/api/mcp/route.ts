import { SCOPES } from "@/lib/ai-content/server/tokens";
import { preflight, reply, siteOrigin } from "@/lib/ai-content/server/http";

// OAuth discovery (RFC 9728): tells an AI tool which server signs users in for /api/mcp. Used by claude.ai custom connectors and other MCP clients.
export const dynamic = "force-dynamic";
export const OPTIONS = preflight;

export function GET(request: Request) {
  const origin = siteOrigin(request);
  return reply({ resource: `${origin}/api/mcp`, authorization_servers: [origin], scopes_supported: SCOPES, bearer_methods_supported: ["header"], resource_name: "We3vision content" });
}
