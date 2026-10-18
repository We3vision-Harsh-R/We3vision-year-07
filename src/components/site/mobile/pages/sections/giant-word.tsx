"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useCalm } from "../../app/use-calm";

/**
 * The giant word of the brand page, as on the laptop: it is the same word in other languages ("Brand", "ब्रांड", "Бренд", "Μάρκα", "ブランド", "브랜드",
 * "品牌"). Every letter is a small window with a strip of letters; the strips slide one after the other (slot-machine style) from the word that is on to
 * the next one, then it stands still for a moment. It stops while it is off screen and stands still with "reduce motion". The words are the lines
 * "Language | Word" from the CMS (the language name is not shown).
 */
const segmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const split = (w: string) => (segmenter ? Array.from(segmenter.segment(w), (s) => s.segment) : Array.from(w));
const parse = (raw: string) =>
  raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => split((l.split("|")[1] ?? l.split("|")[0]).trim()))
    .filter((g) => g.length > 0);

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const HOLD = 1500;
const SLIDE = 1500;
const STAG = 110;

export function GiantWord({ words }: { words: string }) {
  const calm = useCalm();
  const list = useMemo(() => parse(words), [words]);
  const pool = useMemo(() => [...new Set(list.flat())], [list]);
  const root = useRef<HTMLParagraphElement>(null);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"still" | "prep" | "go">("still");
  const [seen, setSeen] = useState(true);
  const n = list.length;
  const cur = list[idx] ?? [];
  const next = list[(idx + 1) % Math.max(n, 1)] ?? [];
  const slots = Math.max(cur.length, next.length);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (calm || n < 2 || !seen) return;
    let t = 0;
    if (phase === "still") t = window.setTimeout(() => setPhase("prep"), HOLD);
    else if (phase === "prep") t = window.requestAnimationFrame(() => window.requestAnimationFrame(() => setPhase("go"))) as unknown as number;
    else t = window.setTimeout(() => { setIdx((i) => (i + 1) % n); setPhase("still"); }, SLIDE + (slots - 1) * STAG + 120);
    return () => { window.clearTimeout(t); if (phase === "prep") window.cancelAnimationFrame(t); };
  }, [phase, calm, n, seen, slots]);

  if (n === 0) return null;
  const moving = phase !== "still";
  const count = moving ? slots : cur.length;
  return (
    <p ref={root} className="ma-ia-giant" aria-label={list[0].join("")}>
      {Array.from({ length: count }, (_, k) => {
        const from = cur[k] ?? "";
        const to = next[k] ?? "";
        const mid = Array.from({ length: 4 }, (_, m) => pool[Math.floor(rand(idx * 31 + k * 7 + m) * pool.length)] ?? "");
        const cells = moving ? [from, ...mid, to] : [from];
        return (
          <span key={k} className="ma-ia-gslot" aria-hidden="true">
            <span className={`ma-ia-gstrip${phase === "go" ? " is-go" : ""}`} style={{ "--n": cells.length - 1, "--d": `${k * STAG}ms` } as CSSProperties}>
              {cells.map((c, i) => <b key={i}>{c || "\u00a0"}</b>)}
            </span>
          </span>
        );
      })}
    </p>
  );
}
