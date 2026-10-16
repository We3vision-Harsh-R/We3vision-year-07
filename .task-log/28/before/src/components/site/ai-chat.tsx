"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { askBot, type ChatMessage } from "../../lib/ai-chat";
import { PandaMini } from "./about/panda-mini";

const SUGGESTIONS = ["What does We3vision do?", "Where is your office?", "How can I get a quote?"];

// PANDA: Professional AI Navigation & Digital Assistant. The chat of the site, kept very simple: a slim bar at the bottom (a little
// panda, a field and a send button). Pointing at it or tapping it opens a small chat window just above the bar; the bar itself never
// changes size, only the window fades and slides in, so it stays light and smooth. The conversation is kept while it is closed.
export function AiChat() {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const open = hover || focused;

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = async (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setText("");
    setBusy(true);
    let answer: string;
    try {
      answer = await askBot(next);
    } catch {
      answer = "Sorry, I could not answer just now. Please try again in a moment.";
    }
    setMessages([...next, { role: "assistant", text: answer }]);
    setBusy(false);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };

  return (
    <div
      className="pd"
      data-open={open}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(timer.current);
        setHover(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setHover(false), 300);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && (e.target as HTMLElement).blur()}
    >
      {/* the soft blur of the page behind the chat (it fades out towards the edges) */}
      <span className="pd-blur" aria-hidden>
        {[1.4, 1.9, 2.4, 2.8, 3.3, 3.8].map((b, i) => (
          <i key={i} style={{ "--k": i + 1, "--b": b } as React.CSSProperties} />
        ))}
      </span>
      <section className="pd-panel" inert={!open} aria-label="PANDA chat">
        <header className="pd-head">
          <span className="pd-face">
            <PandaMini paws={false} />
          </span>
          <div>
            <b>PANDA</b>
            <span>Professional AI Navigation &amp; Digital Assistant</span>
          </div>
        </header>
        <div ref={bodyRef} className="pd-body" aria-live="polite">
          <p className="pd-msg" data-role="assistant">
            Hi! I am PANDA. Ask me anything about We3vision.
          </p>
          {messages.length === 0 ? (
            <div className="pd-chips">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="pd-chip" onClick={() => void send(s)}>
                  {s}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, i) => (
              <p key={i} className="pd-msg" data-role={m.role}>
                {m.text}
              </p>
            ))
          )}
          {busy && (
            <p className="pd-msg" data-role="assistant" aria-label="Typing">
              <span className="pd-dots">
                <i />
                <i />
                <i />
              </span>
            </p>
          )}
        </div>
      </section>

      <span className="pd-ring" aria-hidden />
      <form className="pd-bar" role="search" onSubmit={onSubmit}>
        <span className="pd-icon">
          <PandaMini paws={false} />
        </span>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask PANDA…" aria-label="Ask PANDA" maxLength={400} autoComplete="off" enterKeyHint="send" />
        <button type="submit" className="pd-send" aria-label="Send" disabled={busy || !text.trim()}>
          <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
