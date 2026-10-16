"use client";

import "@/styles/modern-base.css";
import "@/styles/modern-why.css";


import { useRef } from "react";
import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";
import { Reveal } from "../reveal";
import { VHead, plain, two, useCycle } from "./variant-kit";

// "Why We3vision" in seven more designs (the first one is why-bento.tsx), one for every service page. The reasons are a title and a text.
// The look is in globals.css (.vw-*).

type Item = { title: string; description: string };
type P = { chip: string; heading: string; intro?: string; items: Item[] };

/** 1: a grid of cards with an icon, the card that is hovered lifts and glows */
function Grid({ chip, heading, intro, items }: P) {
  return (
    <div className="md vw vw-grid">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <ul className="vw-gd-list">
        {items.map((it, i) => (
          <li key={i}>
            <Reveal delay={(i % 3) * 70}>
              <article className="vw-gd-card bglow">
                <GlowEdge />
                <IconTile index={i + 1} />
                <h3>{plain(it.title)}</h3>
                <p>{it.description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 2: a list: the number, the reason and what it means in three columns, the row that is hovered lights up */
function List({ chip, heading, intro, items }: P) {
  return (
    <div className="md vw vw-list">
      <div className="vw-ls-head">
        <VHead chip={chip} heading={heading} intro={intro} />
      </div>
      <ol className="vw-ls-rows">
        {items.map((it, i) => (
          <li key={i}>
            <span className="vw-ls-no">{two(i + 1)}</span>
            <h3>{plain(it.title)}</h3>
            <p>{it.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 3: cards in one row that can be moved with the arrows (or the scroll of the row) */
function Carousel({ chip, heading, intro, items }: P) {
  const ref = useRef<HTMLUListElement>(null);
  const go = (dir: number) => ref.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  return (
    <div className="md vw vw-car">
      <div className="vw-cr-top">
        <VHead chip={chip} heading={heading} intro={intro} />
        <div className="vw-cr-ar">
          <button type="button" aria-label="Previous" onClick={() => go(-1)}>
            ←
          </button>
          <button type="button" aria-label="Next" onClick={() => go(1)}>
            →
          </button>
        </div>
      </div>
      <ul ref={ref} className="vw-cr-row">
        {items.map((it, i) => (
          <li key={i}>
            <article className="vw-cr-card">
              <span>{two(i + 1)}</span>
              <h3>{plain(it.title)}</h3>
              <p>{it.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 4: the heading is fixed on the left, the reasons are ticked off one after the other on the right */
function Checklist({ chip, heading, intro, items }: P) {
  return (
    <div className="md vw vw-chk">
      <aside>
        <VHead chip={chip} heading={heading} intro={intro} />
      </aside>
      <ul className="vw-ck-list">
        {items.map((it, i) => (
          <li key={i}>
            <Reveal delay={40}>
              <div className="vw-ck-row">
                <span className="vw-ck-tick" aria-hidden />
                <div>
                  <h3>{plain(it.title)}</h3>
                  <p>{it.description}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 5: big tiles with a giant number behind the words */
function Tiles({ chip, heading, intro, items }: P) {
  return (
    <div className="md vw vw-tiles">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <ul className="vw-tl-grid">
        {items.map((it, i) => (
          <li key={i} data-big={i % 5 === 0}>
            <Reveal delay={(i % 3) * 60}>
              <article className="vw-tl">
                <span className="vw-tl-no" aria-hidden>
                  {two(i + 1)}
                </span>
                <h3>{plain(it.title)}</h3>
                <p>{it.description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 6: two rows of cards that slide past, one to the left and one to the right (they stop when the mouse is on them) */
function Marquee({ chip, heading, intro, items }: P) {
  const a = items.filter((_, i) => i % 2 === 0);
  const b = items.filter((_, i) => i % 2 === 1);
  const row = (list: Item[], rev: boolean) => (
    <div className="vw-mq-row" data-rev={rev}>
      <ul className="vw-mq-track">
        {[...list, ...list, ...list].map((it, i) => (
          <li key={i} aria-hidden={i >= list.length}>
            <article className="vw-mq-card">
              <h3>{plain(it.title)}</h3>
              <p>{it.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="md vw vw-mq">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vw-mq-rows">
        {row(a, false)}
        {b.length > 0 && row(b, true)}
      </div>
    </div>
  );
}

/** 7: a list of the reasons; the one that is on (hover, click or by itself) is explained in a large panel */
function Spotlight({ chip, heading, intro, items }: P) {
  const { active, pick, ref } = useCycle(items.length, 5600);
  const it = items[active];
  return (
    <div ref={ref} className="md vw vw-spot">
      <VHead chip={chip} heading={heading} intro={intro} center />
      <div className="vw-sp-grid">
        <ol className="vw-sp-list">
          {items.map((x, i) => (
            <li key={i}>
              <button type="button" data-on={i === active} onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => pick(i)}>
                <span>{two(i + 1)}</span>
                {plain(x.title)}
              </button>
            </li>
          ))}
        </ol>
        <div key={active} className="vw-sp-panel bglow">
          <GlowEdge />
          <IconTile index={active + 1} large />
          <h3>{plain(it.title)}</h3>
          <p>{it.description}</p>
        </div>
      </div>
    </div>
  );
}

/** the design of the page: 1..7 (0 is why-bento.tsx) */
export function WhyVariant({ variant, ...p }: P & { variant: number }) {
  if (p.items.length === 0) return null;
  switch (variant) {
    case 1:
      return <Grid {...p} />;
    case 2:
      return <List {...p} />;
    case 3:
      return <Carousel {...p} />;
    case 4:
      return <Checklist {...p} />;
    case 5:
      return <Tiles {...p} />;
    case 6:
      return <Marquee {...p} />;
    default:
      return <Spotlight {...p} />;
  }
}
