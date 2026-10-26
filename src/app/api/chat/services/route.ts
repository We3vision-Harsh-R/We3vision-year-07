import { callChatbot, chatConfigured, jsonError } from "@/lib/chat-upstream";

// The list of services for the PANDA dropdown, fetched from the chatbot server by our own server (see lib/chat-upstream.ts).
export async function GET() {
  if (!chatConfigured()) return jsonError(503, "The chatbot is not configured.");
  try {
    const r = await callChatbot("/api/chat/services", { timeoutMs: 12_000 });
    const body = await r.text();
    return new Response(body, { status: r.status, headers: { "content-type": r.headers.get("content-type") ?? "application/json", "cache-control": "no-store" } });
  } catch {
    return jsonError(502, "The chatbot is waking up. Please try again in a moment.");
  }
}
