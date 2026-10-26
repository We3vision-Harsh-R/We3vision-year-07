"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { askBot, getChatServices, normalizeMarkdown, type ChatMessage, type ChatService } from "../../lib/ai-chat";
import { PandaMini } from "./about/panda-mini";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SUGGESTIONS = ["What does We3vision do?", "Where is your office?", "How can I get a quote?"];

// PANDA: Professional AI Navigation & Digital Assistant. The chat of the site, kept very simple: a slim bar at the bottom (a little
// panda, a field and a send button). Pointing at it or tapping it opens a small chat window just above the bar; the bar itself never
// changes size, only the window fades and slides in, so it stays light and smooth. The conversation is kept while it is closed.
export function AiChat() {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [services, setServices] = useState<ChatService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const open = hover || focused;
  const selectedService = services.find((service) => service.id === selectedServiceId);
  const filteredServices = services.filter((service) =>
    `${service.title} ${service.category}`.toLowerCase().includes(serviceSearch.trim().toLowerCase()),
  );

  const chooseService = (id: string) => {
    setSelectedServiceId(id);
    setServiceSearch("");
    setServicePickerOpen(false);
  };

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    let active = true;
    getChatServices()
      .then((items) => { if (active) setServices(items); })
      .catch(() => { if (active) setServices([]); })
      .finally(() => { if (active) setServicesLoading(false); });
    return () => { active = false; };
  }, []);

  const send = async (raw: string) => {
    const q = raw.trim();
    if (!q || busy) return;
    const next: ChatMessage[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setText("");
    setBusy(true);
    let answer: { answer: string; serviceLinks: { title: string; url: string }[] };
    try {
      answer = await askBot(next, selectedServiceId || undefined);
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
        <label
          className="pd-service-picker"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setServicePickerOpen(false);
              setServiceSearch("");
            }
          }}
        >
          <div className="pd-service-combobox-wrap">
            <input
              className="pd-service-combobox"
              role="combobox"
              aria-label="Choose a We3vision service"
              aria-autocomplete="list"
              aria-expanded={servicePickerOpen}
              aria-controls="panda-service-options"
              aria-busy={servicesLoading}
              placeholder={servicesLoading ? "Loading services…" : "All services"}
              value={servicePickerOpen ? serviceSearch : selectedService?.title ?? ""}
              disabled={servicesLoading || services.length === 0 || busy}
              onFocus={() => { setServicePickerOpen(true); setServiceSearch(""); }}
              onChange={(event) => { setServiceSearch(event.target.value); setServicePickerOpen(true); }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setServicePickerOpen(false);
                  setServiceSearch("");
                } else if (event.key === "Enter" && servicePickerOpen && filteredServices[0]) {
                  event.preventDefault();
                  chooseService(filteredServices[0].id);
                } else if (event.key === "ArrowDown") {
                  setServicePickerOpen(true);
                }
              }}
            />
            {servicePickerOpen && !servicesLoading && services.length > 0 && (
              <div
                id="panda-service-options"
                className="pd-service-options"
                role="listbox"
                aria-label="We3vision services"
                onWheel={(event) => event.stopPropagation()}
              >
                <button type="button" role="option" aria-selected={!selectedServiceId} onClick={() => chooseService("")}>
                  All services
                </button>
                {[...new Set(filteredServices.map((service) => service.category))].map((category) => (
                  <div key={category} className="pd-service-group">
                    <span>{category}</span>
                    {filteredServices.filter((service) => service.category === category).map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        role="option"
                        aria-selected={service.id === selectedServiceId}
                        onClick={() => chooseService(service.id)}
                      >
                        {service.title}
                      </button>
                    ))}
                  </div>
                ))}
                {filteredServices.length === 0 && <p className="pd-service-empty">No matching services</p>}
              </div>
            )}
          </div>
        </label>
        <div
          ref={bodyRef}
          className="pd-body"
          aria-live="polite"
          onWheel={(event) => {
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.scrollTop += event.deltaY;
          }}
        >
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
              <div key={`${m.role}-${i}`} className="pd-message-group" data-role={m.role}>
                
<div className="pd-msg" data-role={m.role}>
  {m.role === "assistant" ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="pd-msg-a" />,
        h1: ({ ...props }) => <h1 {...props} className="pd-msg-h1" />,
        h2: ({ ...props }) => <h2 {...props} className="pd-msg-h2" />,
        h3: ({ ...props }) => <h3 {...props} className="pd-msg-h3" />,
        h4: ({ ...props }) => <h4 {...props} className="pd-msg-h4" />,
        p: ({ ...props }) => <p {...props} className="pd-msg-p" />,
        ul: ({ ...props }) => <ul {...props} className="pd-msg-ul" />,
        ol: ({ ...props }) => <ol {...props} className="pd-msg-ol" />,
        li: ({ ...props }) => <li {...props} className="pd-msg-li" />,
        strong: ({ ...props }) => <strong {...props} className="pd-msg-strong" />,
        hr: () => <hr className="pd-msg-divider" />,
        pre: ({ ...props }) => <pre {...props} className="pd-msg-pre" />,
        code: ({ ...props }) => <code {...props} className="pd-msg-code" />,
        table: ({ ...props }) => <div className="pd-msg-table-wrap"><table {...props} className="pd-msg-table" /></div>,
      }}
    >
      {normalizeMarkdown(m.text)}
    </ReactMarkdown>
  ) : (
    m.text
  )}
</div>

                {m.role === "assistant" && m.links?.length ? (
                  <div className="pd-service-links" aria-label="Related service pages">
                    {m.links.map((link) => (
                      <a key={link.url} href={link.url}>
                        {link.title} details <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
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
