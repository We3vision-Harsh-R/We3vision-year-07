"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { FlowIcon } from "../flow-icons";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

const COLS = 6;

function Plus({ className }: { className: string }) {
  return <span aria-hidden className={`flow-plus ${className}`} />;
}

function Boxes({ items, base }: { items: { label: string; icon: string }[]; base: number }) {
  return (
    <ul className="flow-row" style={{ "--base": `${base}ms` } as CSSProperties}>
      {items.slice(0, COLS).map((item, i) => (
        <li key={i}>
          <div className="flow-box" style={{ "--k": i } as CSSProperties}>
            <FlowIcon name={item.icon} className="size-[22px]" />
            <span>{item.label}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The wires between a row of boxes and the core: one short line per box, a bus line, one line to the core. `down` = data flows
 *  from the boxes to the core (sources); otherwise from the core out to the boxes (actions). */
function Wires({ count, down, base }: { count: number; down: boolean; base: number }) {
  return (
    <div className={`flow-wires ${down ? "is-in" : "is-out"}`} aria-hidden style={{ "--base": `${base}ms` } as CSSProperties}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="w w-v" style={{ "--i": i, "--x": `${((i + 0.5) / COLS) * 100}%` } as CSSProperties}>
          <span className="pulse" />
        </span>
      ))}
      <span className="w w-h" style={{ "--l": `${(0.5 / COLS) * 100}%` } as CSSProperties}>
        <span className="pulse pulse-l" />
        <span className="pulse pulse-r" />
      </span>
      <span className="w w-c">
        <span className="pulse" />
      </span>
    </div>
  );
}

/**
 * Diagram "your tools -> AI core -> actions": a row of boxes on top (where the data lives), a glowing core in the middle (the
 * AI) and a row of boxes below (what it does). When it scrolls into view the boxes appear one by one, the wires draw
 * themselves and light pulses start to flow along them. Without JavaScript everything is simply shown.
 */
export const Flow: SectionComponent<"flow"> = ({ data }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.live = "false";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.live = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const n = Math.min(COLS, Math.max(data.sources.length, 1));
  const m = Math.min(COLS, Math.max(data.actions.length, 1));

  return (
    <section id="ai-flow" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1180px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
        <div ref={ref} className="flow">
          <Plus className="tl" />
          <Plus className="tr" />
          <Plus className="bl" />
          <Plus className="br" />

          <div className="flow-head">
            <span>{data.sourcesLabel}</span>
            <span>{data.sourcesNote}</span>
          </div>
          <Boxes items={data.sources} base={200} />
          <Wires count={n} down base={900} />

          <div className="flow-core">
            <Plus className="c-tl" />
            <Plus className="c-tr" />
            <Plus className="c-bl" />
            <Plus className="c-br" />
            <i aria-hidden />
            <span>{data.coreLabel}</span>
          </div>

          <Wires count={m} down={false} base={1700} />
          <Boxes items={data.actions} base={2300} />
          <div className="flow-head flow-foot">
            <span>{data.actionsLabel}</span>
            <span>{data.actionsNote}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
