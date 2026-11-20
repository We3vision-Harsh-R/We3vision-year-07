"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { askBot, getChatServices, normalizeMarkdown, type ChatMessage, type ChatService } from "@/lib/ai-chat";
import { CHAT_EVENT, CHAT_QUEUE, type ChatOpenDetail } from "@/lib/chat-overlay";
import { PandaMini } from "./about/panda-mini";
import "@/styles/chat-overlay.css";

// the markdown library is fetched when the first answer comes
const AskMd = dynamic(() => import("./chat-md").then((m) => m.AskMd), { ssr: false });

// THE FULL-SCREEN CHAT (task 160, styles/chat-overlay.css prefix chx-). One window for every chat box of the site: when a visitor sends a question from any of them
// (lib/chat-overlay.ts openChatOverlay), the conversation opens here, almost as big as the screen, and the page behind it goes out of focus (blur). Esc, the
// close button or a click on the blurred page closes it; the conversation is kept while it is closed (and "New chat" starts again). While it is open the page
// does not scroll, the keyboard stays inside the window and the focus goes back to where it was when it closes.
const STARTERS = [
  { q: "What does We3vision do?", hint: "Our services in one minute" },
  { q: "How can I get a quote?", hint: "Tell us the idea, we send the plan" },
  { q: "Where is your office?", hint: "Surat, and the cities we work in" },
];
const SORRY = "Sorry, I could not answer just now. Please try again in a moment.";

type Lenis = { stop?: () => void; start?: () => void };

export function ChatOverlay() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [services, setServices] = useState<ChatService[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const thread = useRef<ChatMessage[]>([]); // the latest conversation, for the async answer
  const working = useRef(false);
  const service = useRef("");
  const loaded = useRef(false);
  const back = useRef<HTMLElement | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const winRef = useRef<HTMLElement>(null);

  const pickService = (id: string) => {
    service.current = id;
    setServiceId(id);
  };
  const ask = useCallback(async (raw: string, svc?: string) => {
    const q = raw.trim();
    if (!q || working.current) return;
    if (svc !== undefined) {
      service.current = svc;
      setServiceId(svc);
    }
    const next: ChatMessage[] = [...thread.current, { role: "user", text: q }];
    thread.current = next;
    setMsgs(next);
    setText("");
    working.current = true;
    setBusy(true);
    let res: { answer: string; serviceLinks: { title: string; url: string }[] };
    try {
      res = await askBot(next, service.current || undefined);
    } catch (e) {
      res = { answer: e instanceof Error && e.message ? e.message : SORRY, serviceLinks: [] };
    }
    const done: ChatMessage[] = [...next, { role: "assistant", text: res.answer, links: res.serviceLinks }];
    thread.current = done;
    setMsgs(done);
    working.current = false;
    setBusy(false);
  }, []);

  // a chat box of the page asks to open (also the questions that were queued before this file was loaded)
  useEffect(() => {
    const drain = () => {
      const w = window as unknown as Record<string, ChatOpenDetail[] | undefined>;
      const queued = w[CHAT_QUEUE];
      w[CHAT_QUEUE] = [];
      if (!queued?.length) return;
      if (!back.current) back.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
      queued.forEach((d) => {
        if (d.question) void ask(d.question, d.serviceId);
        else if (d.serviceId !== undefined) pickService(d.serviceId);
      });
    };
    drain();
    window.addEventListener(CHAT_EVENT, drain);
    return () => window.removeEventListener(CHAT_EVENT, drain);
  }, [ask]);

  const close = useCallback(() => {
    setOpen(false);
    const el = back.current;
    back.current = null;
    if (el && document.contains(el)) window.setTimeout(() => el.blur(), 0); // the box it came from does not pop open again
  }, []);

  // while it is open: the page does not scroll, Esc closes, the services are loaded once, the field has the focus
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.stop?.();
    document.documentElement.classList.add("chx-lock");
    if (!loaded.current) {
      loaded.current = true;
      getChatServices()
        .then(setServices)
        .catch(() => setServices([]));
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("chx-lock");
      lenis?.start?.();
    };
  }, [open, close]);

  useEffect(() => {
    const el = bodyRef.current;
    if (open && el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [open, msgs, busy]);

  // the keyboard stays inside the window
  const onTab = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const items = Array.from(winRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]") ?? []).filter((x) => x.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(text);
  };
  const reset = () => {
    if (working.current) return;
    thread.current = [];
    setMsgs([]);
    inputRef.current?.focus();
  };

  if (!open) return null;
  const topics = services.slice(0, 9);
  return (
    <div className="chx" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <section ref={winRef} className="chx-win" role="dialog" aria-modal="true" aria-label="Chat with PANDA, the AI of We3vision" onKeyDown={onTab}>
        <header className="chx-head">
          <span className="chx-face">
            <PandaMini paws={false} />
          </span>
          <div className="chx-id">
            <b>PANDA</b>
            <span>
              <i aria-hidden /> Online, answers in seconds
            </span>
          </div>
          <div className="chx-actions">
            {msgs.length > 0 && (
              <button type="button" className="chx-new" onClick={reset} disabled={busy}>
                New chat
              </button>
            )}
            <button type="button" className="chx-x" aria-label="Close the chat" onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        </header>

        {topics.length > 0 && (
          <div className="chx-topics" role="group" aria-label="Narrow the answers to one service">
            <button type="button" data-on={serviceId === ""} onClick={() => pickService("")}>
              All services
            </button>
            {topics.map((s) => (
              <button key={s.id} type="button" data-on={serviceId === s.id} onClick={() => pickService(s.id)}>
                {s.title}
              </button>
            ))}
          </div>
        )}

        <div ref={bodyRef} className="chx-body" data-lenis-prevent aria-live="polite" onWheel={(e) => e.stopPropagation()}>
          {msgs.length === 0 ? (
            <div className="chx-hello">
              <span className="chx-hello-face">
                <PandaMini paws={false} />
              </span>
              <h2>
                Hi, ask me <em>anything</em> about your project.
              </h2>
              <ul>
                {STARTERS.map((s) => (
                  <li key={s.q}>
                    <button type="button" onClick={() => void ask(s.q)}>
                      <span>
                        <b>{s.q}</b>
                        <small>{s.hint}</small>
                      </span>
                      <i aria-hidden>→</i>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            msgs.map((m, i) => (
              <div key={`${m.role}-${i}`} className="chx-m" data-role={m.role}>
                {m.role === "assistant" ? (
                  <div className="chx-md">
                    <AskMd text={normalizeMarkdown(m.text)} />
                  </div>
                ) : (
                  <p>{m.text}</p>
                )}
                {m.role === "assistant" && m.links?.length ? (
                  <div className="chx-links" aria-label="Related service pages">
                    {m.links.map((l) => (
                      <a key={l.url} href={l.url}>
                        {l.title} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
          {busy && (
            <div className="chx-m" data-role="assistant" aria-label="Typing">
              <span className="chx-dots">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        <form className="chx-bar" role="search" onSubmit={onSubmit}>
          <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" aria-label="Ask PANDA" maxLength={400} autoComplete="off" enterKeyHint="send" />
          <button type="submit" aria-label="Send" disabled={busy || !text.trim()}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </form>
      </section>
    </div>
  );
}
