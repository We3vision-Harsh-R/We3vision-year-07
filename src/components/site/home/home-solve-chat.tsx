"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { askBot, getChatServices, normalizeMarkdown, type ChatMessage, type ChatService, type ChatServiceLink } from "@/lib/ai-chat";

// the markdown library is fetched when the first typed answer comes
const AskMd = dynamic(() => import("@/components/site/chat-md").then((m) => m.AskMd), { ssr: false });

// THE PROBLEM CHAT (owner, 2026-11-13, phone): the problems of the AI and the Brand Design sections are asked in the same glowing "Ask Panda" bar as the Metaverse
// section (its classes, styles/home-metaverse.css "hbm-"). The problems are the idea chips: a tap shows the answer of the list ("With AI", "Our answer") at once, no
// network. A question typed in the bar goes to the same PANDA as everywhere else, narrowed to the service (AI or Brand). Phone only (styles/home-phone-ux.css, "hps-");
// on a laptop the list of problems stays.
type Item = { q: string; a: string };
type Shown = { q: string; text: string; tag?: string; md?: boolean };

export function SolveChat({ items, tag, kind }: { items: Item[]; tag: string; kind: "ai" | "brand" }) {
  const [text, setText] = useState("");
  const [shown, setShown] = useState<Shown | null>(null);
  const [links, setLinks] = useState<ChatServiceLink[]>([]);
  const [busy, setBusy] = useState(false);
  const hist = useRef<ChatMessage[]>([]);
  const service = useRef<string | null>(null);
  const out = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shown) out.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [shown, busy]);

  const pick = (i: number) => {
    if (busy) return;
    setLinks([]);
    setShown({ q: items[i].q, text: items[i].a, tag });
  };

  async function send(raw: string) {
    const q = raw.trim();
    if (!q || busy) return;
    const next: ChatMessage[] = [...hist.current, { role: "user", text: q }];
    hist.current = next;
    setText("");
    setShown({ q, text: "", md: true });
    setBusy(true);
    let res: { answer: string; serviceLinks: ChatServiceLink[] };
    try {
      if (service.current === null) {
        const all: ChatService[] = await getChatServices().catch(() => []);
        const re = kind === "ai" ? /\bai\b|artificial|machine/i : /brand|logo|identity/i;
        service.current = all.find((s) => re.test(`${s.title} ${s.category}`))?.id ?? "";
      }
      res = await askBot(next, service.current || undefined);
    } catch {
      res = { answer: "Sorry, I could not answer just now. Please try again in a moment.", serviceLinks: [] };
    }
    hist.current = [...next, { role: "assistant", text: res.answer }];
    setShown({ q, text: res.answer, md: true });
    setLinks(res.serviceLinks);
    setBusy(false);
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(text);
  };

  return (
    <div className="hbm-ask hps-wrap">
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
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Panda" aria-label="Ask Panda about this problem" maxLength={400} autoComplete="off" enterKeyHint="send" />
        <button type="submit" aria-label="Send" disabled={busy || !text.trim()}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </form>

      <ul className="hbm-ideas">
        {items.map((s, i) => (
          <li key={s.q}>
            <button type="button" onClick={() => pick(i)} aria-pressed={shown?.q === s.q}>
              {s.q}
            </button>
          </li>
        ))}
      </ul>

      {shown && (
        <div ref={out} className="hbm-ans" aria-live="polite">
          <p className="hbm-q">{shown.q}</p>
          {busy ? (
            <span className="hbm-dots" aria-label="Typing">
              <i />
              <i />
              <i />
            </span>
          ) : shown.md ? (
            <>
              <AskMd text={normalizeMarkdown(shown.text)} />
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
          ) : (
            <>
              {shown.tag && <p className="hps-tag">{shown.tag}</p>}
              <p>{shown.text}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
