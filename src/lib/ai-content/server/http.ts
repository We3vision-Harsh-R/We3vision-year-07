// Small helpers shared by the MCP route and the OAuth routes: the address of the site, the client address and the JSON answers with CORS.
// The endpoints use bearer tokens, never cookies, so any origin may call them (the token is the proof) and no credentials are allowed.

export const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};

export const ipOf = (request: Request) => request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

/** The public address of the site (https://…), from NEXT_PUBLIC_SITE_URL or, if that is not set, from the request. */
export function siteOrigin(request: Request) {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
  if (/^https?:\/\//.test(configured)) return configured;
  const h = request.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return host ? `${h.get("x-forwarded-proto") ?? "http"}://${host}` : new URL(request.url).origin;
}

/** AI_INTEGRATION=off in the environment switches the whole integration off at once (MCP, sign-in of tools, tokens) without a deploy of code. */
export const aiDisabled = () => (process.env.AI_INTEGRATION ?? "").trim().toLowerCase() === "off";

export function reply(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...CORS, "Cache-Control": "no-store", ...extra } });
}

export const preflight = () => new Response(null, { status: 204, headers: CORS });
