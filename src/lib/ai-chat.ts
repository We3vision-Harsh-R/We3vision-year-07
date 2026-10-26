export type ChatServiceLink = { title: string; url: string };
export type ChatMessage = { role: "user" | "assistant"; text: string; links?: ChatServiceLink[] };
import { FALLBACK_SERVICES } from "./chat-fallback-services";

export type ChatService = { id: string; title: string; category: string; url: string };

/** Repairs Markdown that arrives flattened onto one line or with squashed formatting so ReactMarkdown can render it cleanly like ChatGPT. */
export function normalizeMarkdown(text: string): string {
  if (!text || typeof text !== "string") return "";

  let t = text
    .replace(/[\u00a0\u2007\u202f]/g, " ")
    .replace(/[\u200b\u200c\u200d\ufeff]/g, "")
    .replace(/&lt;br\s*\/?&gt;/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n?/g, "\n")
    .replace(/\\([\\`*_{}\[\]()#+.!>|~-])/g, "$1");

  // Fix squashed sentence boundaries: "provider.It delivers" -> "provider.\n\nIt delivers"
  t = t.replace(/([a-z0-9][.:!?])([A-Z])/g, "$1\n\n$2");

  // Horizontal rules/dividers in middle of line: "---"
  t = t.replace(/(?<=\S)[ \t]+(---+)[ \t]*/g, "\n\n$1\n\n");
  t = t.replace(/^[ \t]*(---+)[ \t]+(?=\S)/gm, "$1\n\n");

  // Headings in the middle of a line: "...text ### Title" -> "\n\n### Title"
  t = t.replace(/(?<=\S)[ \t]+(#{1,6}[ \t]+)/g, "\n\n$1");

  // Heading without space: "##Title" -> "## Title"
  t = t.replace(/^(#{1,6})[ \t]*(?=[^\s#])/gm, "$1 ");

  // Heading followed directly by a bullet item on the same line:
  // e.g. "#### 1. Design & Creative – 6 Services - Brand Identity..." -> "#### 1. Design & Creative – 6 Services\n\n- Brand Identity..."
  t = t.replace(/^(#{1,6}[ \t]+[^\n]+?)[ \t]+[-*][ \t]+(?=[A-Za-z0-9])/gm, "$1\n\n- ");

  // Heading ending in ? or : followed by body text on the same line
  t = t.replace(/^(#{1,6}[ \t]+[^\n?:]+?[?:])[ \t]+([A-Z])/gm, "$1\n\n$2");

  // Specific title phrases followed by body text on the same line:
  t = t.replace(
    /^(#{1,6}[ \t]+(?:Overview of What [A-Za-z0-9]+ Does|About [A-Za-z0-9]+|Introduction to [A-Za-z0-9]+|What [A-Za-z0-9]+ Does))[ \t]+([A-Z])/gm,
    "$1\n\n$2",
  );

  // General heading followed directly by body text on the same line:
  t = t.replace(
    /^(#{1,6}[ \t]+[A-Z][A-Za-z0-9\s/&,–—'-]+?\b(?:Does|About|Services|Solutions|Overview|Guide|Locations|Details|Catalogue|Snapshot|Summary|FAQ))\s+([A-Z])/gm,
    "$1\n\n$2",
  );

  // Ensure any heading line is followed by an empty line
  t = t.replace(/^(#{1,6}[ \t]+[^\n]+)\n(?!\n|#{1,6}[ \t])/gm, "$1\n\n");

  // Convert bullet characters (•, ●, ▪) to standard markdown dash
  t = t.replace(/[ \t]*[•●▪][ \t]*/g, "\n- ");

  // En-dash or em-dash used as bullet:
  t = t.replace(/^([ \t]*)[–—][ \t]+/gm, "$1- ");

  // Bullets inline after colon or sentence: "with: - **Branding..." -> "with:\n\n- **Branding..."
  t = t.replace(/([.:!?])[ \t]+[-*][ \t]+(?=\*\*|[A-Za-z0-9])/g, "$1\n\n- ");

  // Bullets inline after previous bullet item ending with a period or closing parenthesis:
  // "...animation. - **Web..." -> "...animation.\n- **Web..."
  // "(/brand-identity) - Graphics..." -> "(/brand-identity)\n- Graphics..."
  t = t.replace(/([a-z0-9\)])\.[ \t]+[-*][ \t]+(?=\*\*|[A-Za-z0-9])/g, "$1.\n- ");
  t = t.replace(/(\(\/[a-z0-9_-]+\))[ \t]+[-*][ \t]+(?=\*\*|[A-Za-z0-9])/gi, "$1\n- ");

  // Any other inline bullet between words: " - " followed by uppercase or bold:
  t = t.replace(/(?<=[^\n])[ \t]+[-*][ \t]+(?=\*\*[A-Z]|[A-Z][a-z]+)/g, "\n- ");

  // Numbered list items inline: "1. Foo 2. Bar" -> "1. Foo\n2. Bar"
  t = t.replace(/([.:!?])[ \t]+(\d{1,2}\.)[ \t]+(?=[A-Z*])/g, "$1\n$2 ");

  // Blank line before lists
  t = t.replace(/([^\n])\n([-*][ \t]+|\d{1,2}\.[ \t]+)/g, "$1\n\n$2");

  // Blank line after lists (before regular text or dividers)
  t = t.replace(/(\n[-*][ \t]+[^\n]+)\n([A-Z*])/g, "$1\n\n$2");

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
    .split("\n")
    // blank line before a table (header row followed by a separator row)
    .flatMap((line, i, all) => {
      const isHeader = line.trimStart().startsWith("|") && /^[ \t]*\|[ \t:|-]*-{3,}[ \t:|-]*$/.test(all[i + 1] ?? "");
      const prev = all[i - 1];
      return isHeader && prev !== undefined && prev.trim() !== "" && !prev.trimStart().startsWith("|") ? ["", line] : [line];
    })
    .join("\n");

  return t
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// the chatbot is reached through this website (/api/chat, see lib/chat-upstream.ts): same origin, so the browser never blocks it (CORS)
const API_URL = "";

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
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/chat/services`, { cache: "no-store" });
  } catch {
    return FALLBACK_SERVICES; // no connection: the dropdown still opens, with the services of the website
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) return FALLBACK_SERVICES;
  const result = data && typeof data === "object" ? data as Record<string, unknown> : null;
  const list = Array.isArray(result?.services)
    ? result.services.filter((item): item is ChatService =>
        !!item && typeof item === "object" &&
        typeof (item as ChatService).id === "string" &&
        typeof (item as ChatService).title === "string" &&
        typeof (item as ChatService).category === "string" &&
        typeof (item as ChatService).url === "string",
      )
    : [];
  return list.length > 0 ? list : FALLBACK_SERVICES;
}

export async function askBot(
  history: ChatMessage[],
  selectedServiceId?: string,
): Promise<{ answer: string; serviceLinks: ChatServiceLink[] }> {
  const message = [...history].reverse().find((item) => item.role === "user")?.text.trim();
  if (!message) throw new Error("Please enter a message.");

  const userId = persistentId("we3vision_user_id");
  const sessionId = persistentId("webot_session_id");
  // a service of the website's own list ("menu:...") is not an id of the chatbot server: it goes into the question instead
  const own = selectedServiceId?.startsWith("menu:") ? FALLBACK_SERVICES.find((s) => s.id === selectedServiceId) : undefined;
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: own ? `${message} (about: ${own.title})` : message,
        user_id: userId,
        session_id: sessionId,
        selected_service_id: own ? null : selectedServiceId || null,
      }),
    });
  } catch {
    throw new Error("No connection. Please check your internet and try again.");
  }

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
