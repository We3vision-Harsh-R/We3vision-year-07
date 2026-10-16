"use client";

import { Archivo } from "next/font/google";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";

// A giant heavy wordmark whose letters swipe (slot-machine style) from one language to the next. The word means the same
// in every language, but its letters and spelling look different. While a letter swipes it passes the matching letter of
// the first word ("Brand"), so people get an idea of what the word is. One cycle = 3 s of swiping + 1 s standing still.
const archivo = Archivo({ subsets: ["latin"], weight: "900", display: "swap" });
// letters of other scripts come from the system fonts (bold)
const FONT_STACK = `${archivo.style.fontFamily}, "Noto Sans", "Nirmala UI", "Segoe UI", "Yu Gothic", "Meiryo", "Malgun Gothic", "Microsoft YaHei", system-ui, sans-serif`;

// keep in sync with .rw-win / .rw-cell / .rw-strip in globals.css: letter height 1.12em + empty space 0.9em between letters,
// so only one letter is ever inside the window and the letters above / below it never peek in
const PITCH_EM = 1.12 + 0.9;

const SWIPE_MS = 2300; // how long one letter swipes
const STAGGER_MS = 150; // delay between letters (the last one finishes at about 3 s)
const CYCLE_MS = 4000; // 3 s swiping + 1 s still
const FIRST_MS = 1000; // the first word stands still for 1 s

type Entry = { label: string; glyphs: string[] };
type Move = { n: number; from: string[]; to: string[]; strips: string[][] };

const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const split = (word: string) => (segmenter ? Array.from(segmenter.segment(word), (s) => s.segment) : Array.from(word));

/** "English | Brand" lines -> entries (the label only names the language for the editor; it is not shown on the page). */
export function parseWords(raw: string): Entry[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [label = "", word = ""] = l.split("|").map((x) => x.trim());
      return { label, glyphs: split(word || label) };
    })
    .filter((e) => e.glyphs.length > 0);
}

// small deterministic random numbers, so the swipes look the same on every device
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function RotatingWord({ words }: { words: string }) {
  const entries = useMemo(() => parseWords(words), [words]);
  const first = entries[0];
  const pool = useMemo(() => [...new Set(entries.flatMap((e) => e.glyphs))], [entries]);
  const slots = Math.max(1, ...entries.map((e) => e.glyphs.length));
  const [move, setMove] = useState<Move | null>(null); // null = standing still on the first word
  const [go, setGo] = useState(false); // the strips are sliding
  const rootRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const widths = useRef<number[]>([]); // the width every letter slot ends with

  // a new swipe starts: every slot gets the width of the letter it shows now ...
  useLayoutEffect(() => {
    if (!move) return;
    slotRefs.current.forEach((slot, i) => {
      const cells = slot?.querySelectorAll<HTMLElement>(".rw-cell");
      if (!slot || !cells || cells.length === 0) return;
      const fromW = move.from[i] ? cells[0].getBoundingClientRect().width : 0;
      widths.current[i] = move.to[i] ? cells[cells.length - 1].getBoundingClientRect().width : 0;
      slot.style.transition = "none";
      slot.style.width = `${fromW}px`;
    });
  }, [move]);
  // ... and while it swipes the slot grows or shrinks to the width of the letter it lands on
  useEffect(() => {
    if (!go) return;
    slotRefs.current.forEach((slot, i) => {
      if (!slot) return;
      slot.style.transition = `width ${SWIPE_MS}ms cubic-bezier(0.65, 0, 0.2, 1) ${i * STAGGER_MS}ms`;
      slot.style.width = `${widths.current[i] ?? 0}px`;
    });
  }, [go]);

  useEffect(() => {
    if (!first || entries.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idx = 0;
    let n = 0;
    let timer = 0;
    let visible = true;
    const observer = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (rootRef.current) observer.observe(rootRef.current);

    const step = () => {
      timer = window.setTimeout(step, CYCLE_MS);
      if (!visible || document.hidden) return;
      const from = entries[idx].glyphs;
      idx = (idx + 1) % entries.length;
      const next = entries[idx];
      n += 1;
      // the cells of every letter's strip: where it starts, some letters of other languages, the letter of the first word
      // (the "Brand" letter at this position), more letters, and where it lands
      const strips = Array.from({ length: slots }, (_, i) => [
        from[i] ?? "",
        pool[Math.floor(rand(n * 31 + i * 7 + 1) * pool.length)],
        first.glyphs[i] ?? pool[Math.floor(rand(n * 31 + i * 7 + 3) * pool.length)],
        pool[Math.floor(rand(n * 31 + i * 7 + 4) * pool.length)],
        next.glyphs[i] ?? "",
      ]);
      setGo(false);
      setMove({ n, from, to: next.glyphs, strips });
      requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)));
    };
    timer = window.setTimeout(step, FIRST_MS);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [entries, first, pool, slots]);

  if (!first) return null;

  return (
    <div ref={rootRef} aria-hidden className="rw" style={{ fontFamily: FONT_STACK }}>
      <div className="rw-word">
        {Array.from({ length: slots }, (_, i) => {
          const cells = move ? move.strips[i] : [first.glyphs[i] ?? ""];
          return (
            <span
              key={i}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className="rw-slot"
            >
              <span className="rw-win">
                <span
                  key={move?.n ?? 0}
                  className="rw-strip"
                  style={
                    {
                      // one step = the height of a letter + the empty space between two letters of the strip
                      transform: go ? `translateY(${-(cells.length - 1) * PITCH_EM}em)` : "translateY(0)",
                      transition: go ? `transform ${SWIPE_MS}ms cubic-bezier(0.65, 0, 0.2, 1) ${i * STAGGER_MS}ms` : "none",
                    } as CSSProperties
                  }
                >
                  {cells.map((c, k) => (
                    <span key={k} className="rw-cell">
                      {c || " "}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Small live clock, e.g. "( 15:07 IN )". Shown only after the page has loaded (the server does not know your time). */
export function LiveClock({ timezone, label }: { timezone: string; label: string }) {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () => {
      try {
        setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone || undefined }).format(new Date()));
      } catch {
        setTime("--:--");
      }
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [timezone]);
  return (
    <span aria-hidden className="rw-clock">
      ( {time} {label} )
    </span>
  );
}
