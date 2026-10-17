"use client";

import "@/styles/glass-select.css";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

// The dropdown of the laptop website, in the look of the iOS 26 pop-up menu: a button with the up-down arrows and a menu of liquid glass (blurred,
// bright rim, a check mark on the chosen row) that opens under it, or above it when there is no room. It replaces the plain <select> of the
// browser, which cannot be styled. Keyboard: arrows, Home / End, Enter, Escape. The menu is drawn in <body>, so nothing can clip it.
export type GlassOption = { value: string; label: string; group?: string };

type Pos = { left: number; top: number; width: number; maxH: number; up: boolean };

export function GlassSelect({ value, options, onChange, label, disabled, className }: { value: string; options: GlassOption[]; onChange: (v: string) => void; label: string; disabled?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const uid = useId();
  const cur = options.find((o) => o.value === value);

  const show = useCallback(() => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom - 16;
    const above = r.top - 16;
    const up = below < 240 && above > below;
    const maxH = Math.max(160, Math.min(360, up ? above : below));
    setPos({ left: Math.max(8, Math.min(r.left, window.innerWidth - Math.max(r.width, 220) - 8)), top: up ? r.top - 8 : r.bottom + 8, width: Math.max(r.width, 220), maxH, up });
    setOpen(true);
  }, []);
  const close = useCallback((focus = true) => {
    setOpen(false);
    if (focus) btn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const row = list.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? list.current?.querySelector<HTMLElement>('[role="option"]');
    row?.scrollIntoView({ block: "nearest" });
    row?.focus({ preventScroll: true });
    const away = (e: Event) => { if (!list.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) close(false); };
    const leave = (e: Event) => { if (!list.current?.contains(e.target as Node)) close(false); };
    window.addEventListener("pointerdown", away, true);
    window.addEventListener("scroll", leave, true);
    window.addEventListener("resize", leave);
    return () => {
      window.removeEventListener("pointerdown", away, true);
      window.removeEventListener("scroll", leave, true);
      window.removeEventListener("resize", leave);
    };
  }, [open, close]);

  const keys = (e: KeyboardEvent) => {
    const rows = [...(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [])];
    const at = rows.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); rows[(n + rows.length) % rows.length]?.focus(); };
    if (e.key === "Escape") { e.preventDefault(); close(); }
    else if (e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowUp") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(rows.length - 1);
    else if (e.key === "Tab") close(false);
  };

  return (
    <div className={`gsel${open ? " is-open" : ""}${className ? ` ${className}` : ""}`}>
      <button
        ref={btn}
        type="button"
        className="gsel-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${uid}-l` : undefined}
        aria-label={`${label}: ${cur?.label ?? ""}`}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={(e) => { if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) { e.preventDefault(); show(); } }}
      >
        <span className="gsel-val">{cur?.label ?? ""}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 9.500 12 5.500l4 4M8 14.500l4 4 4-4" /></svg>
      </button>
      {open && pos && typeof document !== "undefined" &&
        createPortal(
          <ul
            ref={list}
            id={`${uid}-l`}
            role="listbox"
            aria-label={label}
            className={`gsel-menu${pos.up ? " is-up" : ""}`}
            style={{ left: pos.left, width: pos.width, maxHeight: pos.maxH, ...(pos.up ? { bottom: window.innerHeight - pos.top } : { top: pos.top }) }}
            onKeyDown={keys}
            data-lenis-prevent
          >
            {options.map((o, i) => (
              <li key={o.value + i} role="presentation">
                {o.group && o.group !== options[i - 1]?.group && <span className="gsel-group">{o.group}</span>}
                <button type="button" role="option" aria-selected={o.value === value} className={`gsel-opt${o.value === value ? " is-on" : ""}`} onClick={() => { onChange(o.value); close(); }}>
                  <span>{o.label}</span>
                  {o.value === value && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.500l4.500 4.500L19 7.500" /></svg>}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
