"use client";
/* eslint-disable @next/next/no-img-element -- pictures are uploads / links from the admin panel, like the kit's <Pic> */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { haptic } from "../haptics";
import { AppLink } from "./link";
import { useSheet } from "./use-sheet";

// Interactions of Apple's own apps for the phone pages (styles: apple.css, prefix "ma-ap-"). Words always come from the CMS; these only arrange them.
//   TapSheet      a row / card that opens an iOS sheet with its details (Settings, App Store "more", Contacts card)
//   SegPanels     the iOS segmented control with a sliding thumb (2 to 4 choices) and its panels
//   TodayCard     the App Store "Today" card: a tap opens the story full screen from the card itself
//   PhotoViewer   Photos: a tap on a picture opens it full screen, swipe to the next one
//   Typing        Messages: the bubbles arrive one by one, after the "typing" dots, when the chat comes into view
//   SwipeDeck     Tips / Fitness cards that swipe sideways with page dots
//   YearPicker    Photos "Years": pick a year, its card slides in

/** overlays live outside the screen (it becomes inert while a sheet is open) but inside .ma-root (the colours of the app) */
const layer = (node: ReactNode) =>
  createPortal(node, document.querySelector(".ma-root") ?? document.body);

const calm = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** an iOS sheet behind any trigger (one open at a time, like iOS) */
export function TapSheet({
  trigger,
  triggerClass,
  label,
  title,
  children,
}: {
  trigger: ReactNode;
  triggerClass?: string;
  label: string;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { shown, state, drag, grab } = useSheet(open, close);
  return (
    <>
      <button
        type="button"
        className={triggerClass}
        aria-haspopup="dialog"
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        {trigger}
      </button>
      {shown &&
        layer(
          <div
            className="ma-sheet ma-ap-over"
            data-state={state}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <button
              type="button"
              className="ma-sheet-back"
              aria-label="Close"
              tabIndex={-1}
              onClick={close}
            />
            <div
              className="ma-sheet-panel ma-ap-sheet"
              style={
                drag
                  ? {
                      transform: `translate3d(0, ${drag}px, 0)`,
                      transition: "none",
                    }
                  : undefined
              }
            >
              <div className="ma-sheet-grab" {...grab}>
                <i />
              </div>
              <div className="ma-sheet-head">
                <button
                  type="button"
                  className="ma-sheet-x"
                  onClick={close}
                  aria-label="Close"
                >
                  Done
                </button>
                <b>{title}</b>
              </div>
              <div className="ma-sheet-scroll ma-ap-sheet-b">{children}</div>
            </div>
          </div>,
        )}
    </>
  );
}

/** the iOS segmented control: the thumb slides to the picked segment, the panel crossfades; every panel stays in the page (hidden) for search engines */
export function SegPanels({
  items,
  label,
}: {
  items: { label: string; content: ReactNode }[];
  label: string;
}) {
  const [on, setOn] = useState(0);
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (e: KeyboardEvent, i: number) => {
    const next =
      e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : -1;
    if (next < 0 || next >= items.length) return;
    e.preventDefault();
    setOn(next);
    refs.current[next]?.focus();
  };
  return (
    <div className="ma-ap-segw">
      <div
        className="ma-ap-seg"
        role="tablist"
        aria-label={label}
        style={{ "--n": items.length, "--i": on } as CSSProperties}
      >
        <span className="ma-ap-thumb" aria-hidden="true" />
        {items.map((t, i) => (
          <button
            key={t.label + i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t${i}`}
            aria-selected={on === i}
            aria-controls={`${uid}-p${i}`}
            tabIndex={on === i ? 0 : -1}
            onClick={() => setOn(i)}
            onKeyDown={(e) => move(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div
          key={t.label + i}
          role="tabpanel"
          id={`${uid}-p${i}`}
          aria-labelledby={`${uid}-t${i}`}
          className="ma-ap-segp"
          hidden={on !== i}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}

/** the App Store "Today" card: the card opens into the full-screen story from where it is, the X (or Esc, or a pull down) closes it */
export function TodayCard({
  art,
  kicker,
  title,
  body,
  label,
}: {
  art: ReactNode;
  kicker?: string;
  title: ReactNode;
  body: ReactNode;
  label: string;
}) {
  const card = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{
    t: number;
    r: number;
    b: number;
    l: number;
  } | null>(null);
  const [closing, setClosing] = useState(false);
  const start = useRef<number | null>(null);
  const [pull, setPull] = useState(0);

  const show = () => {
    const r = card.current?.getBoundingClientRect();
    if (r)
      setBox({
        t: r.top,
        r: window.innerWidth - r.right,
        b: window.innerHeight - r.bottom,
        l: r.left,
      });
    setOpen(true);
  };
  const hide = useCallback(() => {
    const r = card.current?.getBoundingClientRect();
    if (r)
      setBox({
        t: r.top,
        r: window.innerWidth - r.right,
        b: window.innerHeight - r.bottom,
        l: r.left,
      });
    setClosing(true);
    window.setTimeout(
      () => {
        setOpen(false);
        setClosing(false);
        card.current?.focus({ preventScroll: true });
      },
      calm() ? 0 : 420,
    );
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const key = (e: globalThis.KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("keydown", key);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [open, hide]);

  const clip = box
    ? `inset(${box.t}px ${box.r}px ${box.b}px ${box.l}px round 26px)`
    : "inset(0 round 0)";
  return (
    <>
      <button
        ref={card}
        type="button"
        className="ma-ap-today"
        onClick={show}
        aria-haspopup="dialog"
        aria-label={label}
      >
        <span className="ma-ap-today-art">{art}</span>
        <span className="ma-ap-today-cap">
          {kicker && <span className="ma-ap-today-k">{kicker}</span>}
          <span className="ma-ap-today-t">{title}</span>
        </span>
      </button>
      {open &&
        layer(
          <div
            className={`ma-ap-story${closing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            style={
              {
                "--from": clip,
                transform: pull
                  ? `scale(${1 - Math.min(pull, 240) / 1600})`
                  : undefined,
              } as CSSProperties
            }
            onPointerDown={(e) => {
              const el = e.currentTarget.querySelector(".ma-ap-story-s");
              if (el && el.scrollTop <= 0) start.current = e.clientY;
            }}
            onPointerMove={(e) =>
              start.current !== null &&
              setPull(Math.max(0, e.clientY - start.current))
            }
            onPointerUp={() => {
              if (pull > 140) hide();
              start.current = null;
              setPull(0);
            }}
            onPointerCancel={() => {
              start.current = null;
              setPull(0);
            }}
          >
            <div className="ma-ap-story-s">
              <div className="ma-ap-story-art">{art}</div>
              <div className="ma-ap-story-b">
                {kicker && <p className="ma-ap-today-k">{kicker}</p>}
                <h2 className="ma-ap-story-t">{title}</h2>
                {body}
              </div>
            </div>
            <button
              type="button"
              className="ma-ap-story-x"
              onClick={hide}
              aria-label="Close"
              autoFocus
            >
              <i />
            </button>
          </div>,
        )}
    </>
  );
}

export type ViewerPhoto = {
  id: string;
  src: string;
  title: string;
  kicker?: string;
  href: string;
};

/** Photos: the grid opens one picture full screen; swipe (or ← →) to the next one; the bar shows "3 of 12" and opens the project */
export function PhotoViewer({
  photos,
  openLabel,
  children,
}: {
  photos: ViewerPhoto[];
  openLabel: string;
  children: (open: (i: number) => void) => ReactNode;
}) {
  const [at, setAt] = useState<number | null>(null);
  const [jump, setJump] = useState<{ i: number; n: number } | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setAt(null), []);
  const go = (i: number) => {
    const el = strip.current;
    if (!el) return;
    el.scrollTo({
      left: i * el.clientWidth,
      behavior: calm() ? "auto" : "smooth",
    });
  };
  useEffect(() => {
    if (at === null) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const key = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight")
        go(Math.min(photos.length - 1, (at ?? 0) + 1));
      if (e.key === "ArrowLeft") go(Math.max(0, (at ?? 0) - 1));
    };
    window.addEventListener("keydown", key);
    return () => {
      html.style.overflow = before;
      window.removeEventListener("keydown", key);
    };
  }, [at, close, photos.length]);
  // the viewer opens on the tapped picture
  useEffect(() => {
    const el = strip.current;
    if (jump && el) el.scrollLeft = jump.i * el.clientWidth;
  }, [jump]);
  const open = (i: number) => {
    setAt(i);
    setJump((j) => ({ i, n: (j?.n ?? 0) + 1 }));
  };
  const cur = at === null ? null : photos[at];
  return (
    <>
      {children(open)}
      {cur &&
        layer(
          <div
            className="ma-ap-viewer"
            role="dialog"
            aria-modal="true"
            aria-label={cur.title}
          >
            <div className="ma-ap-vbar">
              <button
                type="button"
                className="ma-ap-vx"
                onClick={close}
                aria-label="Close"
              >
                <i />
              </button>
              <span className="ma-ap-vcount" aria-live="polite">
                {(at ?? 0) + 1} / {photos.length}
              </span>
            </div>
            <div
              ref={strip}
              className="ma-ap-strip"
              onScroll={(e) => {
                const el = e.currentTarget;
                const i = Math.round(
                  el.scrollLeft / Math.max(1, el.clientWidth),
                );
                if (i !== at && i >= 0 && i < photos.length) setAt(i);
              }}
            >
              {photos.map((p) => (
                <figure key={p.id} className="ma-ap-frame">
                  {p.src ? (
                    <img src={p.src} alt={p.title} decoding="async" />
                  ) : (
                    <span className="ma-ap-noimg">
                      {p.title.charAt(0).toUpperCase()}
                    </span>
                  )}
                </figure>
              ))}
            </div>
            <div className="ma-ap-vinfo">
              <span>
                {cur.kicker && <small>{cur.kicker}</small>}
                <b>{cur.title}</b>
              </span>
              <AppLink href={cur.href} className="ma-ap-vopen">
                {openLabel}
              </AppLink>
            </div>
          </div>,
        )}
    </>
  );
}

/** Messages: when the chat scrolls into view the bubbles arrive one by one, each after a short "typing" moment */
export function Typing({ items, who }: { items: string[]; who: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (calm()) {
      const t = window.setTimeout(() => setN(items.length), 0);
      return () => window.clearTimeout(t);
    }
    let timer = 0;
    const step = (k: number) => {
      if (k >= items.length) {
        setTyping(false);
        return;
      }
      setTyping(true);
      timer = window.setTimeout(() => {
        setTyping(false);
        setN(k + 1);
        timer = window.setTimeout(() => step(k + 1), 260);
      }, 650);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          step(0);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [items.length]);
  return (
    <div ref={box} className="ma-ap-chat">
      {who}
      <ul className="ma-ap-bubbles">
        {items.map((t, i) => (
          <li key={i} className={i < n ? "is-in" : ""} aria-hidden={i >= n}>
            {t}
          </li>
        ))}
        {typing && (
          <li className="ma-ap-typing is-in" aria-label="typing">
            <i />
            <i />
            <i />
          </li>
        )}
      </ul>
    </div>
  );
}

/** cards that swipe sideways (Tips, Fitness) with page dots under them */
export function SwipeDeck({
  cards,
  label,
}: {
  cards: ReactNode[];
  label: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const go = (i: number) => {
    const el = row.current;
    const c = el?.children[i] as HTMLElement | undefined;
    if (el && c)
      el.scrollTo({
        left:
          c.offsetLeft -
          el.offsetLeft -
          parseFloat(getComputedStyle(el).paddingLeft || "0"),
        behavior: calm() ? "auto" : "smooth",
      });
  };
  return (
    <div
      className="ma-ap-deckw"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={row}
        className="ma-ap-deck"
        onScroll={(e) => {
          const el = e.currentTarget;
          const w =
            (el.children[0] as HTMLElement | undefined)?.offsetWidth ?? 1;
          const i = Math.round(el.scrollLeft / (w + 12));
          if (i !== at) {
            setAt(i);
            haptic("select");
          }
        }}
      >
        {cards.map((c, i) => (
          <div
            key={i}
            className="ma-ap-card"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${cards.length}`}
          >
            {c}
          </div>
        ))}
      </div>
      {cards.length > 1 && (
        <div className="ma-ap-dots">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i + 1} / ${cards.length}`}
              aria-current={i === at}
              className={i === at ? "is-on" : ""}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Photos "Years": a sideways row of years; the picked year's card slides in (swipe the card for the next year) */
export function YearPicker({
  years,
  label,
}: {
  years: { year: string; content: ReactNode }[];
  label: string;
}) {
  const [at, setAt] = useState(0);
  const [dir, setDir] = useState(1);
  const row = useRef<HTMLDivElement>(null);
  const x0 = useRef<number | null>(null);
  const pick = (i: number) => {
    const j = Math.max(0, Math.min(years.length - 1, i));
    if (j === at) return;
    setDir(j > at ? 1 : -1);
    setAt(j);
    (row.current?.children[j] as HTMLElement | undefined)?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: calm() ? "auto" : "smooth",
    });
  };
  const cur = years[at];
  if (!cur) return null;
  return (
    <div className="ma-ap-years">
      <div ref={row} className="ma-ap-yrow" role="tablist" aria-label={label}>
        {years.map((y, i) => (
          <button
            key={y.year + i}
            type="button"
            role="tab"
            aria-selected={i === at}
            className={i === at ? "is-on" : ""}
            onClick={() => pick(i)}
          >
            {y.year}
          </button>
        ))}
      </div>
      <div
        key={at}
        className="ma-ap-ycard"
        role="tabpanel"
        style={{ "--dir": dir } as CSSProperties}
        onPointerDown={(e) => (x0.current = e.clientX)}
        onPointerUp={(e) => {
          if (x0.current === null) return;
          const dx = e.clientX - x0.current;
          x0.current = null;
          if (Math.abs(dx) > 50) pick(at + (dx < 0 ? 1 : -1));
        }}
      >
        <span className="ma-ap-ybig" aria-hidden="true">
          {cur.year}
        </span>
        {cur.content}
        <span className="ma-ap-ystep">
          {at + 1} / {years.length}
        </span>
      </div>
    </div>
  );
}
