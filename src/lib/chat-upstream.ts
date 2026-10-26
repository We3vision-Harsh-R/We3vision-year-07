import "server-only";

// The chatbot lives on another server (Render). The browser used to call it directly, and the browser blocked the answer when that server
// did not send the CORS header (and a sleeping free server sends none). Now the browser calls THIS website (/api/chat, same origin: no CORS at all)
// and this file calls the chatbot server from our server, with a time limit (a free Render server needs up to a minute to wake up).
const BASE = (process.env.CHATBOT_API_URL || process.env.NEXT_PUBLIC_CHATBOT_API_URL || "").replace(/\/+$/, "");

export const chatConfigured = () => BASE.length > 0;

export async function callChatbot(path: "/api/chat" | "/api/chat/services", init: RequestInit & { timeoutMs?: number } = {}): Promise<Response> {
  const { timeoutMs = 55_000, ...rest } = init;
  return fetch(BASE + path, { ...rest, cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
}

export const jsonError = (status: number, message: string) => Response.json({ message }, { status });
