// The full-screen chat (task 160, components/site/chat-overlay.tsx). Every chat box of the site (PANDA in the big menu, the Ask Panda bar of the Metaverse
// section, the AI box of the technology pages, the PANDA card of the first screen) keeps its place on the page for the first look, but the moment a visitor
// SENDS a question, the conversation opens full screen, over the page, which goes out of focus behind it. The boxes call openChatOverlay(); the overlay
// (loaded after the first paint, in LateExtras) keeps the one conversation for the whole visit, so a question asked in one box continues in the next.
// CHAT_FULL_ON = false brings the old small chat windows back everywhere.
export const CHAT_FULL_ON = true;
export const CHAT_QUEUE = "__w3vChatQueue";
/** the full-screen chat is for laptop and desktop screens (1024 px and more); phones and tablets keep their small chat windows (task 162) */
export const chatFull = () => CHAT_FULL_ON && typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;
export const CHAT_EVENT = "w3v-chat-open";
export type ChatOpenDetail = {
  /** the question to send (the chat opens with it); without it the chat just opens */
  question?: string;
  /** the service the answers are narrowed to ("" = all services) */
  serviceId?: string;
};

/** open the full-screen chat; the question is queued, so it also works while the overlay is still loading */
export function openChatOverlay(detail: ChatOpenDetail = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as Record<string, ChatOpenDetail[] | undefined>;
  (w[CHAT_QUEUE] ??= []).push(detail);
  window.dispatchEvent(new Event(CHAT_EVENT));
}
