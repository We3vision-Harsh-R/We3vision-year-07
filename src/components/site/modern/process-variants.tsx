"use client";

import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";
import { VHead, lines, two, useCycle } from "./variant-kit";

// "How we work" in seven more designs (the first one is process-rail.tsx), one for every service page, so that no two pages show their steps the
// same way. All of them get the same steps: a title, a text and (when there are) points. The look is in globals.css (.vp-*).

type Step = { title: string; text: string; points?: string };
type P = { chip: string; heading: string; intro?: string; items: Step[] };

const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");

function Points({ s }: { s: Step }) {
  const pts = lines(s.points);
  if (!pts.length) return null;
  return (
    <ul className="vp-pts">
      {pts.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** 1: a row of numbered steps on a line that fills, the open step is read in a panel under it */
function Stepper({ chip, heading, intro, items }: P) {
  const n = items.length;
  const { active, pick, ref, run } = useCycle(n, 5600);
  const s = items[active];
  return (
    <div ref={ref} className="md vp vp-stepper">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <ol className="vp-st-track" style={{ "--n": n, "--i": active } as React.CSSProperties}>
        <span className="vp-st-line" aria-hidden>
          <i data-run={run} />
        </span>
        {items.map((it, i) => (
          <li key={i} data-on={i === active} data-done={i < active}>
            <button type="button" onClick={() => pick(i)} aria-label={`Step ${i + 1}: ${plain(it.title)}`}>
              <span>{two(i + 1)}</span>
            </button>
            <b>{plain(it.title)}</b>
          </li>
        ))}
      </ol>
      <div key={active} className="vp-st-panel bglow">
        <GlowEdge />
        <span className="vp-st-no">Step {two(active + 1)}</span>
        <h3>{plain(s.title)}</h3>
        <p>{s.text}</p>
        <Points s={s} />
      </div>
    </div>
  );
}

/** 2: a line in the middle, the steps come out of it to the left and to the right, one after the other */
function Zigzag({ chip, heading, intro, items }: P) {
  return (
    <div className="md vp vp-zz">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <ol className="vp-zz-list">
        {items.map((it, i) => (
          <li key={i} data-side={i % 2 ? "r" : "l"}>
            <span className="vp-zz-dot" aria-hidden>
              {two(i + 1)}
            </span>
            <Reveal delay={60}>
              <article className="vp-zz-card bglow">
                <GlowEdge />
                <h3>{plain(it.title)}</h3>
                <p>{it.text}</p>
                <Points s={it} />
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 3: the steps go down like a staircase, every one a step to the right of the one before it */
function Stairs({ chip, heading, intro, items }: P) {
  const n = items.length;
  return (
    <div className="md vp vp-stairs" style={{ "--n": n } as React.CSSProperties}>
      <VHead chip={chip} heading={heading} intro={intro} />
      <ol className="vp-ss-list">
        {items.map((it, i) => (
          <li key={i} style={{ "--i": i } as React.CSSProperties}>
            <Reveal delay={40}>
              <article className="vp-ss-card bglow">
                <GlowEdge />
                <span className="vp-ss-no" aria-hidden>
                  {two(i + 1)}
                </span>
                <div>
                  <h3>{plain(it.title)}</h3>
                  <p>{it.text}</p>
                  <Points s={it} />
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 4: big rows with the number and the name; the open one shows its text and its points side by side */
function Rows({ chip, heading, intro, items }: P) {
  const { active, pick, ref } = useCycle(items.length, 6200);
  return (
    <div ref={ref} className="md vp vp-rows">
      <aside>
        <VHead chip={chip} heading={heading} intro={intro} />
      </aside>
      <ol className="vp-rw-list">
        {items.map((it, i) => (
          <li key={i} data-on={i === active}>
            <button type="button" aria-expanded={i === active} onClick={() => pick(i)}>
              <span className="vp-rw-no">{two(i + 1)}</span>
              <span className="vp-rw-t">{plain(it.title)}</span>
              <span className="vp-rw-plus" aria-hidden />
            </button>
            <div className="vp-rw-body" data-open={i === active}>
              <div className="vp-rw-in">
                <p>{it.text}</p>
                <Points s={it} />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 5: the steps are the points of a ring; the open one is explained next to it */
function Ring({ chip, heading, intro, items }: P) {
  const n = items.length;
  const { active, pick, ref } = useCycle(n, 4800);
  const s = items[active];
  return (
    <div ref={ref} className="md vp vp-ring">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vp-rg-grid">
        <div className="vp-rg-wheel" role="tablist" aria-label={chip}>
          <span className="vp-rg-orbit" aria-hidden />
          <span className="vp-rg-core" aria-hidden>
            <b>{two(active + 1)}</b>
            <small>of {two(n)}</small>
          </span>
          {items.map((it, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                data-on={i === active}
                data-done={i < active}
                aria-label={plain(it.title)}
                style={{ left: `${50 + Math.cos(a) * 42}%`, top: `${50 + Math.sin(a) * 42}%` }}
                onClick={() => pick(i)}
              >
                {two(i + 1)}
              </button>
            );
          })}
        </div>
        <div key={active} className="vp-rg-panel bglow" role="tabpanel">
          <GlowEdge />
          <h3>{plain(s.title)}</h3>
          <p>{s.text}</p>
          <Points s={s} />
        </div>
      </div>
    </div>
  );
}

/** 6: a list of steps on the left with a bar that fills, the open step as a large panel on the right */
function TabsSteps({ chip, heading, intro, items }: P) {
  const n = items.length;
  const { active, pick, ref, run } = useCycle(n, 6000);
  const s = items[active];
  return (
    <div ref={ref} className="md vp vp-tabs">
      <div className="vp-tb-side">
        <VHead chip={chip} heading={heading} intro={intro} />
        <ol className="vp-tb-list" role="tablist" aria-label={chip}>
          {items.map((it, i) => (
            <li key={i}>
              <button type="button" role="tab" aria-selected={i === active} data-on={i === active} onClick={() => pick(i)}>
                <span>{two(i + 1)}</span>
                {plain(it.title)}
                <i aria-hidden data-run={run && i === active} />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div key={active} className="vp-tb-panel bglow" role="tabpanel">
        <GlowEdge />
        <span className="vp-tb-mark" aria-hidden>
          {two(active + 1)}
        </span>
        <h3>{plain(s.title)}</h3>
        <p>{s.text}</p>
        <Points s={s} />
      </div>
    </div>
  );
}

/** 7: a board: a pipeline of the steps on top, under it a column for every step with its points as cards */
function Board({ chip, heading, intro, items }: P) {
  return (
    <div className="md vp vp-board">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <ol className="vp-bd-pipe" aria-hidden>
        {items.map((it, i) => (
          <li key={i}>{plain(it.title)}</li>
        ))}
      </ol>
      <div className="vp-bd-cols" style={{ "--n": items.length } as React.CSSProperties}>
        {items.map((it, i) => (
          <Reveal key={i} delay={(i % 3) * 70}>
            <section className="vp-bd-col">
              <header>
                <span>{two(i + 1)}</span>
                <h3>{plain(it.title)}</h3>
              </header>
              <p>{it.text}</p>
              {lines(it.points).length > 0 && (
                <ul className="vp-bd-cards">
                  {lines(it.points).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
              <div className="vp-bd-bar" aria-hidden>
                <i style={{ width: `${Math.round(((i + 1) / items.length) * 100)}%` }} />
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** the design of the page: 1..7 (0 is the rail, process-rail.tsx) */
export function ProcessVariant({ variant, ...p }: P & { variant: number }) {
  if (p.items.length === 0) return null;
  switch (variant) {
    case 1:
      return <Stepper {...p} />;
    case 2:
      return <Zigzag {...p} />;
    case 3:
      return <Stairs {...p} />;
    case 4:
      return <Rows {...p} />;
    case 5:
      return <Ring {...p} />;
    case 6:
      return <TabsSteps {...p} />;
    default:
      return <Board {...p} />;
  }
}
