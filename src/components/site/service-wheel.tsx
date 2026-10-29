"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { SERVICE_GROUPS } from "../../lib/site-menu";
import { SmartLink } from "./smart-link";

// The service wheel of phone + tablet (owner 2026-10-29, after a genre picker of a phone app): every service on an arc at the right edge. The list
// scrolls up and down and snaps; the one in the middle is lit, the others slide away along the arc and fade. Tap the lit one (or the button) to open it,
// tap another one to bring it to the middle. It opens from the Services tab and from the big menu. Looks: styles/nav-bar.css (sw-).
const ITEM = 64; // px, the height of one row (the same number is in the CSS)
const R = 420; // px, the radius of the arc

const GLYPH: Record<string, string> = {
  Development: "M9 8 5 12l4 4M15 8l4 4-4 4M13 6l-2 12",
  Creatives: "M4 20l4-1 11-11-3-3L5 16zM14 7l3 3",
  "E-commerce": "M4 5h2l2 10h9l2-7H7M10 19.5h.01M17 19.5h.01",
  Branding: "M12 4l2.4 5 5.4.7-4 3.8 1 5.4-4.8-2.6-4.8 2.6 1-5.4-4-3.8 5.4-.7z",
  Marketing: "M4 13v-2l12-5v12L4 13zM8 14l1 5h3l-1-4.5M19 9.5v5",
};

type Row = { label: string; href: string; group: string };

export function ServiceWheel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rows = useMemo<Row[]>(() => {
    const seen = new Set<string>();
    return SERVICE_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))).filter((r) => !seen.has(r.href) && !!seen.add(r.href));
  }, []);
  const path = usePathname();
  const [sel, setSel] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  const raf = useRef(0);

  // put every row on the arc: its distance from the middle decides the shift to the right, the size and the brightness
  const place = () => {
    const el = list.current;
    if (!el) return;
    const f = el.scrollTop / ITEM;
    const lis = el.children;
    for (let i = 0; i < lis.length; i++) {
      const li = lis[i] as HTMLElement;
      const d = (i - f) * ITEM;
      const a = Math.min(Math.abs(d), R - 1);
      li.style.setProperty("--x", `${(R - Math.sqrt(R * R - a * a)).toFixed(1)}px`);
      li.style.setProperty("--k", `${Math.max(0.86, 1 - Math.abs(d) / 1300).toFixed(3)}`);
      li.style.setProperty("--o", `${Math.max(0.28, 1 - Math.abs(d) / 330).toFixed(3)}`);
    }
    setSel(Math.min(rows.length - 1, Math.max(0, Math.round(f))));
  };
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(place);
  };
  const go = (i: number) => list.current?.scrollTo({ top: i * ITEM, behavior: "smooth" });

  // when it opens the row of the page you are on is in the middle (the first one on any other page)
  useEffect(() => {
    if (!open) return;
    const i = Math.max(
      0,
      rows.findIndex((r) => r.href === path),
    );
    const el = list.current;
    if (el) el.scrollTop = i * ITEM;
    place();
    const now = () => Math.round((list.current?.scrollTop ?? 0) / ITEM);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") go(Math.min(rows.length - 1, now() + 1));
      if (e.key === "ArrowUp") go(Math.max(0, now() - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const cur = rows[sel];
  return createPortal(
    <div className="sw" data-open={open}>
      <div className="sw-back" onClick={onClose} aria-hidden />
      <div className="sw-panel" role="dialog" aria-label="Our services" inert={!open} data-lenis-prevent>
        <header className="sw-head">
          <h2>Our services</h2>
          <p key={cur.group}>{cur.group}</p>
        </header>
        <span className="sw-arc" aria-hidden />
        <span className="sw-mark" aria-hidden />
        <ul className="sw-list" ref={list} onScroll={onScroll}>
          {rows.map((r, i) => (
            <li key={r.href} className="sw-li" data-on={i === sel}>
              <SmartLink
                href={r.href}
                tabIndex={i === sel ? 0 : -1}
                onClick={(e) => {
                  if (i !== sel) {
                    e.preventDefault();
                    go(i);
                  } else onClose();
                }}>
                <span className="sw-t">{r.label}</span>
                <span className="sw-ic">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d={GLYPH[r.group]} />
                  </svg>
                </span>
              </SmartLink>
            </li>
          ))}
        </ul>
        <SmartLink href={cur.href} onClick={onClose} className="sw-go">
          Open {cur.label}
        </SmartLink>
      </div>
    </div>,
    document.body,
  );
}
