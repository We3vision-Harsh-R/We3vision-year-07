export type ChatServiceLink = { title: string; url: string };
export type ChatMessage = { role: "user" | "assistant"; text: string; links?: ChatServiceLink[] };
export type ChatService = { id: string; title: string; category: string; url: string };

/** Repairs Markdown that arrives flattened onto one line (## headings, **bold**, | tables |, bullets) so ReactMarkdown can render it. */
export function normalizeMarkdown(text: string): string {
  let t = String(text ?? "")
    .replace(/[\u00a0\u2007\u202f]/g, " ")
    .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
    .replace(/&lt;br\s*\/?&gt;/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/\\([\\`*_{}\[\]()#+.!>|~-])/g, "$1");

  // Tables: only lines where the separator row is NOT already on its own line are flattened and need repair.
  const sepRe = /\|[ \t]*:?-{3,}:?(?:[ \t]*\|[ \t]*:?-{3,}:?)*[ \t]*\|/;
  t = t
    .split("\n")
    .map((line) =>
      sepRe.test(line) && !/^[ \t]*\|[ \t:|-]*$/.test(line)
        ? line
            .replace(/^([^|\n]*[^|\s])[ \t]*(?=\|)/, "$1\n\n") // text before the table -> own paragraph
            .replace(/(?<=\|)[ \t]+(?=\|[ \t]*:?-{3,})/g, "\n") // header end -> separator row
            .replace(/(?<=:?-{3,}:?[ \t]*\|)[ \t]+(?=\|)/g, "\n") // separator end -> first data row
            .replace(/\|[ \t]+\|(?=[ \t]*[^\s|])/g, "|\n|") // row end -> next row
        : line,
    )
    .join("\n")
    // headings in the middle of a line
    .replace(/(?<=\S)[ \t]+(#{1,6})[ \t]+(?=[A-Za-z0-9*])/g, "\n\n$1 ")
    // "##Title" -> "## Title"
    .replace(/^(#{1,6})[ \t]*(?=[^\s#])/gm, "$1 ")
    .split("\n")
    // blank line before a table (header row followed by a separator row)
    .flatMap((line, i, all) => {
      const isHeader = line.trimStart().startsWith("|") && /^[ \t]*\|[ \t:|-]*-{3,}[ \t:|-]*$/.test(all[i + 1] ?? "");
      const prev = all[i - 1];
      return isHeader && prev !== undefined && prev.trim() !== "" && !prev.trimStart().startsWith("|") ? ["", line] : [line];
    })
    .join("\n");

  // bullets inside table cells cannot be line breaks: use a dot separator there, real list items elsewhere
  t = t
    .split("\n")
    .map((line) => (line.trimStart().startsWith("|") ? line.replace(/[ \t]*[•●▪]\s*/g, " · ").replace(/^(\|[^|]*\|)\s*·\s*/, "$1 ") : line))
    .join("\n")
    .replace(/[ \t]+[•●▪][ \t]+/g, "\n- ")
    .replace(/^[ \t]*[•●▪][ \t]+/gm, "- ")
    .replace(/([.:!?])[ \t]+([-*])[ \t]+(?=[A-Z*])/g, "$1\n$2 ")
    .replace(/([.:!?])[ \t]+(\d{1,2}\.)[ \t]+(?=[A-Z*])/g, "$1\n$2 ");

  return t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

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
  return { answer: normalizeMarkdown(answer), serviceLinks: links };
}
