export type ChatServiceLink = { title: string; url: string };
export type ChatMessage = { role: "user" | "assistant"; text: string; links?: ChatServiceLink[] };
export type ChatService = { id: string; title: string; category: string; url: string };

const API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/+$/, "");

function persistentId(key: string): string {
  try {
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;
    const created = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, created);
    return created;
  } catch {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export async function getChatServices(): Promise<ChatService[]> {
  if (!API_URL) throw new Error("The chatbot backend URL is not configured.");
  const response = await fetch(`${API_URL}/api/chat/services`, { cache: "no-store" });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new Error("Could not load chatbot services.");
  const result = data && typeof data === "object" ? data as Record<string, unknown> : null;
  return Array.isArray(result?.services)
    ? result.services.filter((item): item is ChatService =>
        !!item && typeof item === "object" &&
        typeof (item as ChatService).id === "string" &&
        typeof (item as ChatService).title === "string" &&
        typeof (item as ChatService).category === "string" &&
        typeof (item as ChatService).url === "string",
      )
    : [];
}

export async function askBot(
  history: ChatMessage[],
  selectedServiceId?: string,
): Promise<{ answer: string; serviceLinks: ChatServiceLink[] }> {
  const message = [...history].reverse().find((item) => item.role === "user")?.text.trim();
  if (!message) throw new Error("Please enter a message.");
  if (!API_URL) throw new Error("The chatbot backend URL is not configured.");

  const userId = persistentId("we3vision_user_id");
  const sessionId = persistentId("webot_session_id");
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      user_id: userId,
      session_id: sessionId,
      selected_service_id: selectedServiceId || null,
    }),
  });

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = data && typeof data === "object" ? data as Record<string, unknown> : null;
    throw new Error(
      typeof error?.detail === "string"
        ? error.detail
        : typeof error?.message === "string"
          ? error.message
          : "The chatbot could not get a response. Please try again.",
    );
  }

  const result = data && typeof data === "object" ? data as Record<string, unknown> : null;
  const nested = result?.data && typeof result.data === "object"
    ? result.data as Record<string, unknown>
    : null;
  const answer = [result?.answer, result?.response, result?.reply, result?.message, result?.output, nested?.answer, nested?.response]
    .find((value): value is string => typeof value === "string" && value.trim().length > 0);

  if (!answer) throw new Error("The chatbot returned an empty response. Please try again.");
  const links = Array.isArray(result?.service_links)
    ? result.service_links.filter((item): item is ChatServiceLink =>
        !!item && typeof item === "object" &&
        typeof (item as ChatServiceLink).title === "string" &&
        typeof (item as ChatServiceLink).url === "string" &&
        (item as ChatServiceLink).url.startsWith("/"),
      )
    : [];
  return { answer: answer.trim(), serviceLinks: links };
}
