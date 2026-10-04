"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { askBot, type ChatMessage } from "../../lib/ai-chat";

const SUGGESTIONS = ["What does We3vision do?", "Where is your office?", "How can I get a quote?"];

// The AI chat. At rest it is a slim liquid-glass bar (the size of the menu pill); pointing at it (or tapping / typing in
// it) opens it into a roomy chat box, and it closes again when the pointer leaves. The conversation is kept meanwhile.
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
      className="ai lg"
      data-open={open}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(timer.current);
        setHover(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setHover(false), 250);
      }}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && (e.target as HTMLElement).blur()}
    >
      <div ref={bodyRef} className="ai-body" inert={!open} aria-live="polite">
        <p className="ai-title">
          <Sparkle /> We3vision AI <span>Ask anything about We3vision</span>
        </p>
        {messages.length === 0 ? (
          <div className="ai-chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="ai-chip" onClick={() => void send(s)}>
                {s}
              </button>
            ))}
          </div>
        ) : (
          <ul className="ai-msgs">
            {messages.map((m, i) => (
              <li key={i} data-role={m.role}>
                {m.text}
              </li>
            ))}
            {busy && (
              <li data-role="assistant" aria-label="Typing">
                <span className="ai-dots">
                  <i />
                  <i />
                  <i />
                </span>
              </li>
            )}
          </ul>
        )}
      </div>

      <form className="ai-bar" role="search" onSubmit={onSubmit}>
        <Sparkle className="ai-spark" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask We3vision AI…"
          aria-label="Ask We3vision AI"
          maxLength={400}
          autoComplete="off"
          enterKeyHint="send"
        />
        <button type="submit" className="ai-send" aria-label="Send" disabled={busy || !text.trim()}>
          <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 shrink-0 fill-current ${className}`} aria-hidden>
      <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
    </svg>
  );
}
