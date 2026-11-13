"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { askBot, getChatServices, normalizeMarkdown, type ChatMessage, type ChatService, type ChatServiceLink } from "@/lib/ai-chat";

// the markdown library is fetched when the first answer comes, not while the page loads
const AskMd = dynamic(() => import("@/components/site/chat-md").then((m) => m.AskMd), { ssr: false });

// THE ASK PANDA BAR OF THE METAVERSE SECTION (owner, 2026-11-12): one glowing line to type a question in. It is the same PANDA of the first screen (same answers),
// narrowed to the Metaverse service. The answer opens under the bar; the history is kept so a follow-up question works.
const IDEAS = ["What can you build in VR?", "Can AR open from a QR code?", "How do we start a metaverse project?"];

export function MetaverseAsk() {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [links, setLinks] = useState<ChatServiceLink[]>([]);
  const [busy, setBusy] = useState(false);
  const service = useRef<string | null>(null);
  const out = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgs.length) out.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [msgs.length, busy]);

  async function send(raw: string) {
    const q = raw.trim();
    if (!q || busy) return;
    const next: ChatMessage[] = [...msgs, { role: "user", text: q }];
    setMsgs(next);
    setText("");
    setBusy(true);
    let res: { answer: string; serviceLinks: ChatServiceLink[] };
    try {
      if (service.current === null) {
        const all: ChatService[] = await getChatServices().catch(() => []);
        service.current = all.find((s) => /metaverse/i.test(`${s.title} ${s.category}`))?.id ?? "";
      }
      res = await askBot(next, service.current || undefined);
    } catch {
      res = { answer: "Sorry, I could not answer just now. Please try again in a moment.", serviceLinks: [] };
    }
    setMsgs([...next, { role: "assistant", text: res.answer }]);
    setLinks(res.serviceLinks);
    setBusy(false);
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };
  const last = [...msgs].reverse().find((m) => m.role === "assistant");
  const asked = [...msgs].reverse().find((m) => m.role === "user");

  return (
    <div className="hbm-ask">
      <form className="hbm-bar" role="search" onSubmit={onSubmit}>
        <span className="hbm-edge hbm-edge-glow" aria-hidden>
          <i />
        </span>
        <span className="hbm-edge" aria-hidden>
          <i />
        </span>
        <span className="hbm-mag" aria-hidden>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </svg>
        </span>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Panda" aria-label="Ask Panda about our metaverse service" maxLength={400} autoComplete="off" enterKeyHint="send" />
        <button type="submit" aria-label="Send" disabled={busy || !text.trim()}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>

      {!msgs.length && (
        <ul className="hbm-ideas">
          {IDEAS.map((q) => (
            <li key={q}>
              <button type="button" onClick={() => void send(q)}>
                {q}
              </button>
            </li>
          ))}
        </ul>
      )}

      {msgs.length > 0 && (
        <div ref={out} className="hbm-ans" aria-live="polite">
          {asked && <p className="hbm-q">{asked.text}</p>}
          {busy ? (
            <span className="hbm-dots" aria-label="Typing">
              <i />
              <i />
              <i />
            </span>
          ) : (
            last && (
              <>
                <AskMd text={normalizeMarkdown(last.text)} />
                {links.length > 0 && (
                  <div className="hbm-links">
                    {links.map((l) => (
                      <a key={l.url} href={l.url}>
                        {l.title} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}
