import { handleMcpRequest } from "@/lib/ai-content/server/mcp";
import { authenticate } from "@/lib/ai-content/server/tokens";
import { isLimited, rateLimit } from "@/lib/rate-limit";

// The MCP endpoint of the website: AI tools (Claude, Cursor, ChatGPT …) connect here with `Authorization: Bearer <token>`.
// They can only create submissions that wait for approval in Admin > AI Submissions. See docs/MCP_SETUP.md.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Not cookies: the browser is never asked to prove anything here, so any origin may call (the token is the proof). No credentials are allowed.
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};

const ipOf = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

function siteOrigin(request: Request) {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  if (/^https?:\/\//.test(configured)) return configured;
  const h = request.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return host ? `${h.get("x-forwarded-proto") ?? "http"}://${host}` : new URL(request.url).origin;
}

function reply(body: unknown, status: number, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...CORS, "Cache-Control": "no-store", ...extra } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
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
