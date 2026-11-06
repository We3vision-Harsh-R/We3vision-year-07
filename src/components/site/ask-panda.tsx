"use client";

import { useEffect, useRef, useState, type FormEvent, type PointerEvent as RPointerEvent } from "react";
import dynamic from "next/dynamic";
import { askBot, getChatServices, normalizeMarkdown, type ChatMessage, type ChatService } from "../../lib/ai-chat";
import { PandaMini } from "./about/panda-mini";

// the markdown library (~43 KB gzip) is fetched when the first answer comes, not while the page loads
const AskMd = dynamic(() => import("./chat-md").then((m) => m.AskMd), { ssr: false });

const STARTERS = [
  { q: "What does We3vision do?", hint: "Our services in one minute" },
  { q: "How can I get a quote?", hint: "Tell us the idea, we send the plan" },
  { q: "Where is your office?", hint: "Surat, and the cities we work in" },
];

// ASK PANDA, the AI of the first screen (redesign 2026-11-06). It is the same PANDA of the big menu (same answers, same services) in a new body: one
// glass card with a greeting and three things to start with, the topic chips (a service narrows the answers), the conversation and one field. The
// border of the card lights up where the pointer is (--mx / --my follow the mouse), and the light fades out when the pointer leaves. On a touch
// screen the border glows softly from the top while the field has the focus.
export function AskPanda() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [services, setServices] = useState<ChatService[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let live = true;
    getChatServices()
      .then((s) => live && setServices(s))
      .catch(() => live && setServices([]));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setText("");
    setBusy(true);
    let answer: { answer: string; serviceLinks: { title: string; url: string }[] };
    try {
      answer = await askBot(next, serviceId || undefined);
    } catch {
      answer = { answer: "Sorry, I could not answer just now. Please try again in a moment.", serviceLinks: [] };
    }
    setMessages([...next, { role: "assistant", text: answer.answer, links: answer.serviceLinks }]);
    setBusy(false);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };
  const onMove = (e: RPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const chat = messages.length > 0;
  const topics = services.slice(0, 8);
  return (
    <section ref={cardRef} className="ap" data-chat={chat} onPointerMove={onMove} aria-label="Ask PANDA, the AI of We3vision">
      <span className="ap-edge" aria-hidden />
      <span className="ap-spot" aria-hidden />
      <header className="ap-head">
        <span className="ap-face">
          <PandaMini paws={false} />
        </span>
        <div>
          <b>PANDA</b>
          <span>
            <i aria-hidden /> Online, answers in seconds
          </span>
        </div>
      </header>

      <div ref={bodyRef} className="ap-body" aria-live="polite" onWheel={(e) => e.stopPropagation()}>
        {!chat ? (
          <div className="ap-hello">
            <h3>
              Hi, ask me <span>anything</span> about your project.
            </h3>
            <ul>
              {STARTERS.map((s) => (
                <li key={s.q}>
                  <button type="button" onClick={() => void send(s.q)}>
                    <span>
                      <b>{s.q}</b>
                      <em>{s.hint}</em>
                    </span>
                    <i aria-hidden>→</i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className="ap-msg" data-role={m.role}>
                {m.role === "assistant" ? (
                  <AskMd text={normalizeMarkdown(m.text)} />
                ) : (
                  <p>{m.text}</p>
                )}
                {m.role === "assistant" && m.links?.length ? (
                  <div className="ap-links">
                    {m.links.map((l) => (
                      <a key={l.url} href={l.url}>
                        {l.title} <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {busy && (
              <div className="ap-msg" data-role="assistant" aria-label="Typing">
                <span className="ap-dots">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {topics.length > 0 && (
        <div className="ap-topics" role="group" aria-label="Narrow the answers to one service">
          <button type="button" data-on={serviceId === ""} onClick={() => setServiceId("")}>
            All
          </button>
          {topics.map((s) => (
            <button key={s.id} type="button" data-on={serviceId === s.id} onClick={() => setServiceId(s.id)}>
              {s.title}
            </button>
          ))}
        </div>
      )}

      <form className="ap-bar" role="search" onSubmit={onSubmit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your question…" aria-label="Ask PANDA" maxLength={400} autoComplete="off" enterKeyHint="send" />
        <button type="submit" aria-label="Send" disabled={busy || !text.trim()}>
          <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>
    </section>
  );
}
