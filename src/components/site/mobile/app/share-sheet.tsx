"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Glyph } from "../glyph";
import { IcChat, IcMail, IcWhatsApp } from "./icons";
import { useSheet } from "./use-sheet";

/**
 * The share sheet of iOS: the page (icon, title, address) with a round close button, a row of apps to send it with (Messages, Mail, WhatsApp, ...),
 * a row of round actions (Copy, More) and a grouped list. It slides up with a spring over a blurred page. Open it from anywhere with openShare();
 * on a screen of the app the host also shows a small "Copy | Share" bar above any text you select.
 */
export type ShareData = { title: string; subtitle?: string; url: string; text?: string; glyph?: string; off?: number };
export const openShare = (d: ShareData) => window.dispatchEvent(new CustomEvent("ma:share", { detail: d }));

const enc = encodeURIComponent;
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const a = document.createElement("textarea");
    a.value = text;
    a.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(a);
    a.select();
    const ok = document.execCommand("copy");
    a.remove();
    return ok;
  }
}

export function ShareHost({ selection = true }: { selection?: boolean }) {
  const [data, setData] = useState<ShareData | null>(null);
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [note, setNote] = useState("");
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);
  const close = useCallback(() => setOpen(false), []);
  const { shown, state, drag, grab } = useSheet(open, close);

  useEffect(() => {
    const on = (e: Event) => {
      setData((e as CustomEvent<ShareData>).detail);
      setHost(document.querySelector<HTMLElement>(".ma-root, .lnc"));
      setNote("");
      setOpen(true);
    };
    window.addEventListener("ma:share", on);
    return () => window.removeEventListener("ma:share", on);
  }, []);

  // the bar over selected text
  useEffect(() => {
    if (!selection) return;
    let t = 0;
    const on = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const s = window.getSelection();
        const text = s?.toString().trim() ?? "";
        if (!s || s.isCollapsed || text.length < 3) return setSel(null);
        const r = s.getRangeAt(0);
        const el = r.commonAncestorContainer.nodeType === 1 ? (r.commonAncestorContainer as Element) : r.commonAncestorContainer.parentElement;
        if (!el?.closest(".ma-wrap") || el.closest("input, textarea, .ma-sheet")) return setSel(null);
        const b = r.getBoundingClientRect();
        setSel({ text, x: Math.max(96, Math.min(window.innerWidth - 96, b.left + b.width / 2)), y: Math.max(74, b.top - 58) });
      }, 180);
    };
    document.addEventListener("selectionchange", on);
    return () => { window.clearTimeout(t); document.removeEventListener("selectionchange", on); };
  }, [selection]);

  const flash = (m: string) => { setNote(m); window.setTimeout(() => setNote(""), 1600); };
  const link = data?.url ?? "";
  const body = data ? (data.text ? `“${data.text}”\n${link}` : `${data.title}\n${link}`) : "";
  const apps = data
    ? [
        { n: "Messages", href: `sms:&body=${enc(body)}`, bg: "linear-gradient(180deg,#5af278,#1fc646)", icon: <IcChat /> },
        { n: "Mail", href: `mailto:?subject=${enc(data.title)}&body=${enc(body)}`, bg: "linear-gradient(180deg,#4ab8ff,#1a6df0)", icon: <IcMail /> },
        { n: "WhatsApp", href: `https://wa.me/?text=${enc(body)}`, bg: "linear-gradient(180deg,#4ae27a,#12a844)", icon: <IcWhatsApp />, ext: true },
        { n: "Telegram", href: `https://t.me/share/url?url=${enc(link)}&text=${enc(data.text || data.title)}`, bg: "linear-gradient(180deg,#3fc0f5,#1c8fd9)", icon: <span className="ma-sh-t">T</span>, ext: true },
        { n: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(link)}`, bg: "linear-gradient(180deg,#2a84d6,#0a58a8)", icon: <span className="ma-sh-t">in</span>, ext: true },
        { n: "X", href: `https://twitter.com/intent/tweet?text=${enc(data.text || data.title)}&url=${enc(link)}`, bg: "linear-gradient(180deg,#3a3a3c,#000)", icon: <span className="ma-sh-t">X</span>, ext: true },
      ]
    : [];

  return (
    <div className="ma-share">
      {sel && (
        <div className="ma-selbar" style={{ left: sel.x, top: sel.y } as CSSProperties} role="toolbar" aria-label="Selected text">
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={async () => { await copy(sel.text); setSel(null); window.getSelection()?.removeAllRanges(); }}>Copy</button>
          <i aria-hidden="true" />
          <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { openShare({ title: document.title.split("|")[0].trim(), subtitle: window.location.host, url: window.location.href, text: sel.text }); setSel(null); window.getSelection()?.removeAllRanges(); }}>Share</button>
        </div>
      )}

      {shown && data && host &&
        createPortal(
          <div className="ma-sheet ma-share" data-state={state} role="dialog" aria-modal="true" aria-label="Share">
            <button type="button" className="ma-sheet-back" aria-label="Close" tabIndex={-1} onClick={close} />
            <div className="ma-sheet-panel ma-sh-panel" style={drag ? { transform: `translate3d(0, ${drag}px, 0)`, transition: "none" } : undefined}>
              <div className="ma-sheet-grab" {...grab}><i /></div>
              <div className="ma-sh-body">
                <div className="ma-sh-head">
                  <span className="ma-appic" style={{ "--off": data.off ?? 0 } as CSSProperties} aria-hidden="true"><Glyph name={data.glyph ?? "globe"} /></span>
                  <div>
                    <b>{data.title}</b>
                    <small>{data.subtitle ?? link.replace(/^https?:\/\//, "")}</small>
                  </div>
                  <button type="button" className="ma-sh-x" onClick={close} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
                  </button>
                </div>
                {data.text && <p className="ma-sh-quote">“{data.text}”</p>}

                <div className="ma-sh-row" role="list">
                  {apps.map((a) => (
                    <a key={a.n} role="listitem" href={a.href} {...(a.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="ma-sh-app" onClick={() => window.setTimeout(close, 200)}>
                      <span style={{ background: a.bg }}>{a.icon}</span>
                      <small>{a.n}</small>
                    </a>
                  ))}
                </div>

                <div className="ma-sh-row ma-sh-acts" role="list">
                  <button type="button" role="listitem" className="ma-sh-act" onClick={async () => flash((await copy(link)) ? "Link copied" : "Could not copy")}>
                    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg></span>
                    <small>Copy link</small>
                  </button>
                  {data.text && (
                    <button type="button" role="listitem" className="ma-sh-act" onClick={async () => flash((await copy(data.text ?? "")) ? "Text copied" : "Could not copy")}>
                      <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h9" /></svg></span>
                      <small>Copy text</small>
                    </button>
                  )}
                  {typeof navigator !== "undefined" && "share" in navigator && (
                    <button type="button" role="listitem" className="ma-sh-act" onClick={() => { void navigator.share({ title: data.title, text: data.text, url: link }).catch(() => undefined); }}>
                      <span><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="18.5" cy="12" r="1.8" /></svg></span>
                      <small>More</small>
                    </button>
                  )}
                </div>

                <ul className="ma-sh-list">
                  <li>
                    <button type="button" onClick={async () => flash((await copy(link)) ? "Link copied" : "Could not copy")}>
                      <span>Copy Link</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>
                    </button>
                  </li>
                  <li>
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      <span>Open in Browser</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
                    </a>
                  </li>
                </ul>
              </div>
              {note && <p className="ma-sh-note" role="status">{note}</p>}
            </div>
          </div>,
          host,
        )}
    </div>
  );
}
