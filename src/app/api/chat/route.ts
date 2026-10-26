import { callChatbot, chatConfigured, jsonError } from "@/lib/chat-upstream";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";

// A message to the chatbot, sent on by our own server (see lib/chat-upstream.ts): no CORS, a time limit, and a friendly error when the
// chatbot server is asleep. Same-origin pages only, small messages only, 30 messages per visitor per 10 minutes.
const MAX = 6 * 1024;

export async function POST(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return new Response(null, { status: 403 });
  if (!chatConfigured()) return jsonError(503, "The chatbot is not configured.");
  if (Number(req.headers.get("content-length") ?? 0) > MAX) return jsonError(413, "That message is too long.");
  if (!rateLimit(`chat:${await clientIp()}`, 30, 10 * 60_000)) return jsonError(429, "Too many messages. Please wait a little.");
  try {
    const raw = await req.text();
    if (raw.length > MAX) return jsonError(413, "That message is too long.");
    const r = await callChatbot("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: raw });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json", "cache-control": "no-store" } });
  } catch {
    return jsonError(502, "The chatbot is waking up. Please try again in a moment.");
  }
}
