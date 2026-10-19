import { CORS, aiDisabled, ipOf, preflight, reply, siteOrigin } from "@/lib/ai-content/server/http";
import { handleMcpRequest } from "@/lib/ai-content/server/mcp";
import { authenticate } from "@/lib/ai-content/server/tokens";
import { isLimited, rateLimit } from "@/lib/rate-limit";

// The MCP endpoint of the website: AI tools (Claude, Cursor, ChatGPT …) connect here with `Authorization: Bearer <token>`.
// They can only create submissions that wait for approval in Admin > AI Submissions. See docs/MCP_SETUP.md.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const OPTIONS = preflight;

export async function POST(request: Request) {
  if (aiDisabled()) return reply({ jsonrpc: "2.0", error: { code: -32002, message: "The AI integration is switched off on this website." }, id: null }, 503);
  const origin = siteOrigin(request);
  const ip = ipOf(request);
  // too many wrong tokens from one address: stop answering for a while
  if (isLimited(`mcp-auth:${ip}`, 30, 10 * 60_000)) return reply({ error: "Too many failed attempts. Try again later." }, 429, { "Retry-After": "600" });

  const auth = await authenticate(request, origin);
  if (!auth.ok) {
    if (auth.status === 401) rateLimit(`mcp-auth:${ip}`, 30, 10 * 60_000);
    return reply({ jsonrpc: "2.0", error: { code: -32001, message: auth.reason }, id: null }, auth.status, {
      "WWW-Authenticate": `Bearer realm="We3vision", resource_metadata="${origin}/.well-known/oauth-protected-resource"`,
    });
  }
  const res = await handleMcpRequest(request, auth.ctx);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  headers.set("Cache-Control", "no-store");
  return new Response(res.body, { status: res.status, headers });
}

// Stateless server: there is no stream to open and no session to close.
const noStream = () => reply({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed. Use POST." }, id: null }, 405, { Allow: "POST, OPTIONS" });
export const GET = noStream;
export const DELETE = noStream;
