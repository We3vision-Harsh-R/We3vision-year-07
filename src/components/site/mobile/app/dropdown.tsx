"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * The dropdown of the app, drawn like the pop-up menu of iOS 26: a rounded button that shows the chosen value with the up-down arrows, and a
 * glass menu that opens under it (the page behind blurs a little). The chosen row has a check mark. Arrow keys, Home / End, Escape and a tap
 * outside work. Use `Dropdown` for a plain choice, `PickerPanels` when every choice shows its own content.
 */
export function Dropdown({ label, options, value, onChange, placeholder }: { label?: string; options: string[]; value: number; onChange: (i: number) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const uid = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const close = (focus = true) => {
    setOpen(false);
    setLeaving(true);
    if (focus) btn.current?.focus();
  };
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setLeaving(false), 200);
    return () => window.clearTimeout(t);
  }, [leaving]);

  // when it opens: the chosen row is in view and gets the keyboard focus
  useEffect(() => {
    if (!open) return;
    const row = list.current?.querySelector<HTMLElement>(`[data-i="${Math.max(0, value)}"]`);
    row?.scrollIntoView({ block: "center" });
    row?.focus({ preventScroll: true });
  }, [open, value]);

  /** open: bring the button up the screen first, so the whole menu fits above the tab bar */
  const show = () => {
    const r = btn.current?.getBoundingClientRect();
    if (r && r.top > 130) window.scrollBy({ top: r.top - 110, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setOpen(true);
  };
  const pick = (i: number) => {
    onChange(i);
    close();
  };
  const keys = (e: KeyboardEvent) => {
    const rows = [...(list.current?.querySelectorAll<HTMLElement>("[role=option]") ?? [])];
    const at = rows.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      rows[(n + rows.length) % rows.length]?.focus();
    };
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowUp") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(rows.length - 1);
    else if (e.key === "Tab") close(false);
  };

  return (
    <div className={`ma-dd${open ? " is-open" : ""}`}>
      {label && <span className="ma-dd-label" id={`${uid}-l`}>{label}</span>}
      <button ref={btn} type="button" className="ma-dd-btn" aria-haspopup="listbox" aria-expanded={open} aria-labelledby={label ? `${uid}-l ${uid}-b` : undefined} onClick={() => (open ? close() : show())}>
        <span id={`${uid}-b`} className={`ma-dd-val${value < 0 ? " is-empty" : ""}`}>{options[value] ?? placeholder ?? ""}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 9.5 12 5.5l4 4M8 14.5l4 4 4-4" /></svg>
      </button>
      {(open || leaving) && (
        <>
          <button type="button" className={`ma-dd-back${open ? "" : " is-out"}`} tabIndex={-1} aria-label="Close menu" onClick={() => close()} />
          <ul ref={list} className={`ma-dd-menu${open ? "" : " is-out"}`} role="listbox" aria-labelledby={`${uid}-b`} onKeyDown={keys}>
            {options.map((o, i) => (
              <li key={o + i} role="presentation">
                <button type="button" role="option" data-i={i} aria-selected={i === value} className={`ma-dd-opt${i === value ? " is-on" : ""}`} onClick={() => pick(i)}>
                  <span>{o}</span>
                  {i === value && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.500" /></svg>}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/** a dropdown that switches between panels (every panel stays in the page, the inactive ones are hidden: the text is always readable by search engines) */
export function PickerPanels({ label, items }: { label?: string; items: { label: string; content: ReactNode }[] }) {
  const [on, setOn] = useState(0);
  return (
    <div>
      <Dropdown label={label} options={items.map((x) => x.label)} value={on} onChange={setOn} />
      {items.map((x, i) => (
        <div key={x.label + i} className="ma-tabpanel ma-dd-panel" hidden={on !== i}>
          {x.content}
        </div>
      ))}
    </div>
  );
}
