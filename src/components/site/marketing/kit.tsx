"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { SmartLink } from "../smart-link";

// Shared parts of the three marketing pages (SEO / AEO, Meta Marketing, Physical Marketing): the reveal-on-scroll, section heading, FAQ and CTA.
// Laptop and desktop only. CSS: classes "mkt-" at the end of globals.css.

/** things with the class mkt-rv appear when they come into view; the section that is on screen gets .is-act (it lights its number) */
export function useMkt(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    el.querySelectorAll(".mkt-rv").forEach((n) => io.observe(n));
    const so = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-act", e.isIntersecting)), { rootMargin: "-30% 0px -55% 0px" });
    el.querySelectorAll(".mkt-sec").forEach((n) => so.observe(n));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const total = Math.max(1, r.height - window.innerHeight);
        el.style.setProperty("--p", Math.min(1, Math.max(0, -r.top / total)).toFixed(4));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); so.disconnect(); window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [root]);
}

/** A section. With `pin` it stays on screen while the visitor scrolls through all of its steps (the step follows the scroll); the next section comes after the last step. */
export function Sec({ n, title, intro, id, children, className = "", pin, q }: { n: string; title: string; intro?: string; id?: string; children: ReactNode; className?: string; q?: string; pin?: { count: number; onChange: (i: number) => void } }) {
  const lines = title.split(NEWLINE);
  const ref = useRef<HTMLElement>(null);
  const count = pin?.count;
  const onChange = pin?.onChange;
  useEffect(() => {
    const el = ref.current;
    if (!el || !count || !onChange) return;
    let last = -1;
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(0.9999, Math.max(0, -r.top / total));
      const i = Math.floor(p * count);
      if (i !== last) { last = i; onChange(i); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => { window.removeEventListener("scroll", on); if (raf) cancelAnimationFrame(raf); };
  }, [count, onChange]);
  const body = (
    <>
      <p className="mkt-mark">{n}</p>
      {q && <p className="mkt-q-pill mkt-rv"><i aria-hidden="true" />{q}</p>}
      <h2 className="mkt-h2 mkt-rv">{lines.map((l, i) => <span key={i}>{l}</span>)}</h2>
      {intro && <p className="mkt-lead mkt-rv">{intro}</p>}
      {children}
    </>
  );
  if (pin) {
    return (
      <section ref={ref} className={`mkt-sec mkt-pinned ${className}`} id={id} style={{ height: `calc(100vh + ${pin.count * 42}vh)` }}>
        <div className="mkt-pin-in">{body}</div>
      </section>
    );
  }
  return <section className={`mkt-sec ${className}`} id={id}>{body}</section>;
}

const NEWLINE = String.fromCharCode(10);

export function Note({ children }: { children: ReactNode }) {
  return <p className="mkt-note mkt-rv">{children}</p>;
}

export function Btn({ href, children, ghost }: { href: string; children: ReactNode; ghost?: boolean }) {
  return <SmartLink href={href} className={`mkt-btn ${ghost ? "mkt-btn-g" : ""}`}>{children}</SmartLink>;
}

/** an accessible tab list (arrow keys move between the tabs); the panel is given by the caller */
export function Tabs({ items, value, onChange, label, vertical = true, className = "" }: { items: { k: string; t: string; sub?: string }[]; value: number; onChange: (i: number) => void; label: string; vertical?: boolean; className?: string }) {
  const id = useId();
  return (
    <div className={`mkt-tabs ${vertical ? "is-v" : ""} ${className}`} role="tablist" aria-label={label} aria-orientation={vertical ? "vertical" : "horizontal"}>
      {items.map((it, i) => (
        <button key={it.k + it.t} type="button" role="tab" id={`${id}-${i}`} aria-selected={value === i} tabIndex={value === i ? 0 : -1} className={value === i ? "is-on" : ""} onClick={() => onChange(i)}
          onKeyDown={(e) => {
            const next = vertical ? ["ArrowDown", "ArrowUp"] : ["ArrowRight", "ArrowLeft"];
            if (e.key === next[0]) { e.preventDefault(); onChange((value + 1) % items.length); }
            if (e.key === next[1]) { e.preventDefault(); onChange((value + items.length - 1) % items.length); }
          }}>
          <b>{it.k}</b><span>{it.t}{it.sub && <small>{it.sub}</small>}</span>
        </button>
      ))}
    </div>
  );
}

export function Faq({ items, label }: { items: { q: string; a: string }[]; label?: string }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mkt-qs">
      {label && <p className="mkt-paa">{label}</p>}
      {items.map((f, i) => (
        <div key={f.q} className={`mkt-q ${open === i ? "is-on" : ""}`}>
          <button type="button" aria-expanded={open === i} aria-controls={`mkt-a-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{f.q}</span><em aria-hidden="true">{open === i ? "−" : "+"}</em>
          </button>
          <div className="mkt-a" id={`mkt-a-${i}`} role="region"><div><p>{f.a}</p></div></div>
        </div>
      ))}
    </div>
  );
}

export function EndCta({ n, title, text, button }: { n: string; title: string; text: string; button: string }) {
  return (
    <section className="mkt-sec mkt-end">
      <p className="mkt-mark">{n}</p>
      <h2 className="mkt-h2 mkt-end-h">{title.split("\n").map((l, i) => <span key={i}>{l}</span>)}</h2>
      <p className="mkt-lead">{text}</p>
      <Btn href="#contact">{button}</Btn>
    </section>
  );
}

export const v = (o: Record<string, string | number>) => o as unknown as CSSProperties;
