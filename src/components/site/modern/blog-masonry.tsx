"use client";

import "@/styles/blog.css";



import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { tileRatio } from "@/lib/blog-shared";
import { GlowEdge } from "../glow-edge";

// The list of the blog as a masonry of pictures (the idea is the Masonry of React Bits, built here without a library): only the cover pictures are
// seen, each in its own shape (landscape, square, portrait, tall; chosen for every article in the admin panel), laid out column by column: the next
// picture goes under the shortest column. The bigger the screen, the more columns. A picture comes up from below out of a blur, one after the other;
// when the window changes size the pictures glide to their new places.
//  - The pointer INSIDE a card: that card is clear and has the border glow (it follows the pointer along the edge); all the other pictures go out of
//    focus (the frames of the cards stay sharp, so they still read as cards). The pointer between the cards: everything is clear.
//  - The pointer stays on one card for half a second: a small panel with the brief of the article opens beside it (on the right, or the left, or below,
//    wherever there is room). It stays while the pointer is on the panel, and it closes when the pointer goes to another card or away.
// The same component draws the preview in the admin panel (fixed number of columns, nothing to click, one picture marked).
// The look is in globals.css (.bm-*).

export type MasonryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  tile: string;
  href: string;
  /** shown in the panel that opens after half a second */
  summary?: string;
  dateLabel?: string;
  tags?: string[];
  minutes?: number;
};

type Props = {
  items: MasonryItem[];
  /** a fixed number of columns (the preview of the admin panel); without it the number follows the width: about one column for every 300 px */
  columns?: number;
  minColumn?: number;
  minColumns?: number;
  maxColumns?: number;
  /** the picture that is marked (the article being edited in the admin panel) */
  highlightId?: string;
  /** false: the pictures are not links and nothing opens (the preview) */
  interactive?: boolean;
  /** the words after the reading time (Admin > Pages > Blog cards) */
  readLabel?: string;
};

const OPEN_AFTER = 500;

export function BlogMasonry({ items, columns, minColumn = 300, minColumns = 3, maxColumns = 6, highlightId, interactive = true, readLabel = "min read" }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [settled, setSettled] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [onPanel, setOnPanel] = useState(false);
  const hideT = useRef(0);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    setWidth(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  // the pictures glide to new places only after they have come in (not from the corner at the first layout)
  useEffect(() => {
    if (!width || settled) return;
    const t = window.setTimeout(() => setSettled(true), 900 + items.length * 50);
    return () => window.clearTimeout(t);
  }, [width, settled, items.length]);

  // half a second on one card: its panel opens
  useEffect(() => {
    if (!interactive || !hoverId) return;
    const t = window.setTimeout(() => setOpenId(hoverId), OPEN_AFTER);
    return () => window.clearTimeout(t);
  }, [hoverId, interactive]);
  useEffect(() => () => window.clearTimeout(hideT.current), []);

  const enterCard = (id: string) => {
    window.clearTimeout(hideT.current);
    setHoverId(id);
    setOpenId((cur) => (cur === id ? cur : null)); // another card: the panel of the last one closes
  };
  const leaveCard = () => {
    setHoverId(null);
    window.clearTimeout(hideT.current);
    // a moment to cross the little gap to the panel; between the cards (or away) the panel closes
    hideT.current = window.setTimeout(() => setOpenId(null), 220);
  };

  const cols = columns ?? Math.max(minColumns, Math.min(maxColumns, Math.floor(width / minColumn) || 1));

  const { cells, height } = useMemo(() => {
    if (!width) return { cells: [] as { x: number; y: number; w: number; h: number }[], height: 0 };
    const colW = width / cols;
    const heights = new Array(cols).fill(0) as number[];
    const out = items.map((it) => {
      const col = heights.indexOf(Math.min(...heights));
      const h = Math.round(colW * tileRatio(it.tile));
      const cell = { x: Math.round(colW * col), y: heights[col], w: Math.round(colW), h };
      heights[col] += h;
      return cell;
    });
    return { cells: out, height: Math.max(0, ...heights) };
  }, [items, width, cols]);

  // the card that is in focus: the one under the pointer, or the one whose panel the pointer is on
  const focusId = hoverId ?? (onPanel ? openId : null);

  // the panel has the SAME size and shape as the card it belongs to, and stands next to it: on the right (in the place of the next column), else on
  // the left, else below it (or above it, at the bottom of the wall)
  const panel = useMemo(() => {
    if (!openId) return null;
    const i = items.findIndex((x) => x.id === openId);
    const c = cells[i];
    if (i < 0 || !c) return null;
    const GAP = 14;
    const fx = c.x + 7; // the card itself (the cell has 7 px round it)
    const fy = c.y + 7;
    const fw = c.w - 14;
    const fh = c.h - 14;
    const base = { w: fw, h: fh, item: items[i] };
    if (fx + fw + GAP + fw <= width) return { ...base, left: fx + fw + GAP, top: fy, side: "right" as const };
    if (fx - GAP - fw >= 0) return { ...base, left: fx - GAP - fw, top: fy, side: "left" as const };
    const below = fy + fh + GAP + fh <= height + 40;
    return { ...base, left: fx, top: below ? fy + fh + GAP : Math.max(0, fy - GAP - fh), side: below ? ("below" as const) : ("above" as const) };
  }, [openId, items, cells, width, height]);

  return (
    <div ref={boxRef} className="bm" data-settled={settled} data-active={focusId ? "true" : "false"} style={{ height }}>
      {items.map((it, i) => {
        const c = cells[i];
        const style = c
          ? ({ transform: `translate(${c.x}px, ${c.y}px)`, width: c.w, height: c.h, "--i": i } as React.CSSProperties)
          : ({ "--i": i, opacity: 0 } as React.CSSProperties);
        const frame = (
          <span
            className="bm-frame bglow"
            data-hl={highlightId === it.id}
            onPointerEnter={interactive ? () => enterCard(it.id) : undefined}
            onPointerLeave={interactive ? leaveCard : undefined}
          >
            <GlowEdge />
            <span className="bm-card">
              {it.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt="" className="bm-img" loading="lazy" decoding="async" />
              ) : (
                <span className="bm-empty">No picture yet</span>
              )}
              <span className="bm-cap">
                {it.category && <span className="bm-chip">{it.category}</span>}
                <span className="bm-title">{it.title}</span>
              </span>
            </span>
          </span>
        );
        const on = focusId === it.id;
        return interactive ? (
          <Link key={it.id} href={it.href} className="bm-item" style={style} aria-label={it.title} data-on={on}>
            {frame}
          </Link>
        ) : (
          <div key={it.id} className="bm-item" style={style}>
            {frame}
          </div>
        );
      })}

      {interactive && panel && (
        <aside
          className="bm-info"
          data-side={panel.side}
          data-short={panel.h < 300}
          style={{ left: panel.left, top: panel.top, width: panel.w, height: panel.h }}
          onPointerEnter={() => {
            window.clearTimeout(hideT.current);
            setOnPanel(true);
          }}
          onPointerLeave={() => {
            setOnPanel(false);
            setOpenId(null);
          }}
          aria-label={`About: ${panel.item.title}`}
        >
          {panel.item.category && <span className="bm-info-chip">{panel.item.category}</span>}
          <h3>{panel.item.title}</h3>
          <p className="bm-info-meta">
            {panel.item.dateLabel}
            {panel.item.dateLabel && panel.item.minutes ? " · " : ""}
            {panel.item.minutes ? `${panel.item.minutes} ${readLabel}`.trim() : ""}
          </p>
          {panel.item.summary && <p className="bm-info-text">{panel.item.summary}</p>}
          {panel.item.tags && panel.item.tags.length > 0 && (
            <ul className="bm-info-tags" aria-label="Topics">
              {panel.item.tags.slice(0, 4).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <Link href={panel.item.href} className="bm-info-go">
            Read the article →
          </Link>
        </aside>
      )}
    </div>
  );
}
