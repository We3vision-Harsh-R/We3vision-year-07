"use client";

import "@/styles/panda-chat.css";


import { useEffect, useRef, useState, type FormEvent } from "react";
import { askBot, getChatServices, type ChatMessage, type ChatService } from "@/lib/ai-chat";
import { GlassSelect } from "../glass-select";
import { oneLine, type TechData } from "./data";

// The AI box of a technology page. It is PANDA's own setup (src/lib/ai-chat.ts): the same backend, the same service list, the same session, the
// same answer with links to the related service pages. The only difference is that the question is already scoped to the service of this page.

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);

/** the service of the chatbot that fits this page best (by the words of its heading) */
function bestService(services: ChatService[], topic: string): string {
  const want = words(topic).filter((w) => !["development", "services", "service", "custom", "company"].includes(w));
  let best = { id: "", n: 0 };
  for (const s of services) {
    const hay = words(`${s.title} ${s.category}`);
    const n = want.filter((w) => hay.includes(w)).length;
    if (n > best.n) best = { id: s.id, n };
  }
  return best.id;
}

export function AskAi({ d }: { d: TechData }) {
  const topic = oneLine(d.hero.heading);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [services, setServices] = useState<ChatService[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceId, setServiceId] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const body = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let live = true;
    getChatServices()
      .then((items) => { if (live) { setServices(items); setServiceId(bestService(items, topic)); } })
      .catch(() => { if (live) setServices([]); })
      .finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [topic]);
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" }); }, [messages, busy, failed]);

  const chips = d.faq.slice(0, 3).map((f) => f.question);
  const send = async (raw: string, history?: ChatMessage[]) => {
    const q = raw.trim();
    if (!q || busy) return;
    const next: ChatMessage[] = history ?? [...messages, { role: "user", text: q }];
    setMessages(next);
    setText("");
    setFailed(null);
    setBusy(true);
    try {
      const a = await askBot(next, serviceId || undefined);
      setMessages([...next, { role: "assistant", text: a.answer, links: a.serviceLinks }]);
    } catch {
      setFailed(q);
    }
    setBusy(false);
  };
  const onSubmit = (e: FormEvent) => { e.preventDefault(); void send(text); };
  const groups = [...new Set(services.map((s) => s.category))];

  return (
    <section className="hl-ai" aria-label={`Ask about ${topic}`}>
      <header className="hl-ai-head">
        <span className="hl-ai-badge" aria-hidden="true">AI</span>
        <div><b>Ask about {topic}</b><small>Powered by PANDA, the We3vision assistant</small></div>
        {messages.length > 0 && <button type="button" className="hl-ai-new" onClick={() => { setMessages([]); setFailed(null); }}>New chat</button>}
      </header>

      <div className="hl-ai-scope">
        <span className="hl-ai-lab">Service</span>
        <GlassSelect
          className="hl-ai-sel"
          label="Service"
          value={serviceId}
          disabled={loading || services.length === 0 || busy}
          options={[{ value: "", label: loading ? "Loading services…" : "All services" }, ...groups.flatMap((g) => services.filter((s) => s.category === g).map((s) => ({ value: s.id, label: s.title, group: g })))]}
          onChange={setServiceId}
        />
      </div>

      <div className="hl-ai-body" ref={body} role="log" aria-live="polite" aria-label="Conversation" data-lenis-prevent>
        <p className="hl-ai-msg" data-role="assistant">Hi! Which part of our {topic.toLowerCase()} would you like to know about?</p>
        {messages.map((m, i) => (
          <div key={i} className="hl-ai-group" data-role={m.role}>
            <p className="hl-ai-msg" data-role={m.role}>{m.text}</p>
            {m.role === "assistant" && m.links?.length ? (
              <div className="hl-ai-links" aria-label="Related service pages">
                {m.links.map((l) => <a key={l.url} href={l.url}>{l.title} details <span aria-hidden="true">↗</span></a>)}
              </div>
            ) : null}
          </div>
        ))}
        {busy && <p className="hl-ai-msg" data-role="assistant" aria-label="Typing"><span className="hl-ai-dots"><i /><i /><i /></span></p>}
        {failed && (
          <div className="hl-ai-error" role="alert">
            <p>Sorry, I could not answer just now.</p>
            <button type="button" onClick={() => void send(failed, messages)}>Try again</button>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="hl-ai-chips" aria-label="Suggested questions">
          {chips.map((c) => <button key={c} type="button" onClick={() => void send(c)} disabled={busy}>{c}</button>)}
        </div>
      )}

      <form className="hl-ai-form" onSubmit={onSubmit} role="search">
        <label className="hl-ai-sr" htmlFor="hl-ai-input">Your question</label>
        <input id="hl-ai-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask anything about this service…" maxLength={400} autoComplete="off" enterKeyHint="send" />
        <button type="submit" disabled={busy || !text.trim()} aria-label="Send question">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        </button>
      </form>
    </section>
  );
}
