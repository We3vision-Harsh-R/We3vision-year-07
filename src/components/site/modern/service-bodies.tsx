"use client";

import type { KeyboardEvent } from "react";
import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";
import { SmartLink } from "../smart-link";

// The bodies of "What we build" for the service pages that do not have the first two designs (the stage and the canvas in service-stage.tsx):
// a phone, a pipeline, a timeline of layers, a palette and a search result page. The pinned scroll, the zoom and the open box all stay in
// ServiceStage; these only show the open box in their own way. The look is in globals.css (.vz-*).

export type StageCard = { title: string; description: string; href?: string; fit?: string; problems?: string; outcomes?: string };
export type BodyKind = "phone" | "pipeline" | "layers" | "palette" | "serp";

type B = {
  cards: StageCard[];
  active: number;
  pick: (i: number, focus?: boolean) => void;
  setTab: (i: number, el: HTMLButtonElement | null) => void;
  pinned: boolean;
  onKey: (e: KeyboardEvent) => void;
};

const lines = (s?: string) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");
const two = (n: number) => String(n).padStart(2, "0");
const slug = (s: string) => plain(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** the button of a box: the same ids and keys as the other designs, so the scroll and the keyboard work the same way */
const tab = (b: B, i: number) => ({
  ref: (el: HTMLButtonElement | null) => b.setTab(i, el),
  role: "tab" as const,
  id: `sx-tab-${i}`,
  "aria-selected": i === b.active,
  "aria-controls": "sx-panel",
  tabIndex: i === b.active ? 0 : -1,
  onClick: () => b.pick(i),
});
const panel = (b: B) => ({ id: "sx-panel", role: "tabpanel" as const, "aria-labelledby": `sx-tab-${b.active}` });

/** when it is right for you, the problems and what you get (or just the text when the card has no points) */
function Points({ c }: { c: StageCard }) {
  const fit = (c.fit ?? "").trim();
  const problems = lines(c.problems);
  const outcomes = lines(c.outcomes);
  return (
    <div className="vz-pts">
      {fit && (
        <div>
          <h4>Right for you when</h4>
          <p>{fit}</p>
        </div>
      )}
      {problems.length > 0 && (
        <div>
          <h4>Problems it solves</h4>
          <ul>
            {problems.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      {outcomes.length > 0 && (
        <div>
          <h4>What you get</h4>
          <ul>
            {outcomes.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      {!fit && problems.length === 0 && outcomes.length === 0 && (
        <div>
          <p>{c.description}</p>
        </div>
      )}
    </div>
  );
}
const More = ({ c }: { c: StageCard }) =>
  c.href ? (
    <SmartLink href={c.href} className="sx-more">
      Read more →
    </SmartLink>
  ) : null;

/** a phone: the open box is the screen of the app, the boxes are the icons of its tab bar; the points are beside it */
function Phone(b: B) {
  const { cards, active } = b;
  const cur = cards[active];
  return (
    <div className="md vz vz-ph" data-pin={b.pinned}>
      <div className="vz-ph-phone">
        <i className="vz-ph-notch" aria-hidden />
        <div key={active} className="vz-ph-screen" aria-hidden>
          <span className="vz-ph-time">9:41</span>
          <IconTile index={active} large />
          <h4>{plain(cur.title)}</h4>
          <p>{cur.description}</p>
          <span className="vz-ph-btn">Open</span>
        </div>
        <div className="vz-ph-bar" role="tablist" aria-label="What we build" onKeyDown={b.onKey}>
          {cards.map((c, i) => (
            <button key={i} type="button" {...tab(b, i)} className="vz-ph-tab" data-on={i === active} aria-label={plain(c.title)}>
              <IconTile index={i} />
            </button>
          ))}
        </div>
      </div>
      <div key={active} {...panel(b)} className="vz-ph-panel">
        <span className="vz-pos">
          {two(active + 1)} / {two(cards.length)}
        </span>
        <h3>{plain(cur.title)}</h3>
        <Points c={cur} />
        <More c={cur} />
      </div>
    </div>
  );
}

/** a pipeline: the boxes are the stages in a row (the ones before the open one are done), the open one is a card under it */
function Pipeline(b: B) {
  const { cards, active } = b;
  const cur = cards[active];
  return (
    <div className="md vz vz-pl" data-pin={b.pinned}>
      <div className="vz-pl-row" role="tablist" aria-label="What we build" onKeyDown={b.onKey}>
        {cards.map((c, i) => (
          <button key={i} type="button" {...tab(b, i)} className="vz-pl-st" data-on={i === active} data-done={i < active}>
            <span className="vz-pl-no">{two(i + 1)}</span>
            <b>{plain(c.title)}</b>
          </button>
        ))}
      </div>
      <div key={active} {...panel(b)} className="vz-pl-card bglow">
        <GlowEdge />
        <div className="vz-pl-h">
          <span className="vz-pl-chip">
            Stage {active + 1} of {cards.length}
          </span>
          <h3>{plain(cur.title)}</h3>
          <p>{cur.description}</p>
          <More c={cur} />
        </div>
        <Points c={cur} />
      </div>
    </div>
  );
}

/** a timeline of layers (like in an editing program): every box is a layer with its bar, the playhead stands on the open one */
function Layers(b: B) {
  const { cards, active } = b;
  const cur = cards[active];
  const n = cards.length;
  return (
    <div className="md vz vz-ly" data-pin={b.pinned}>
      <div className="vz-ly-top" aria-hidden>
        <span>
          00:{two(active + 1)}:12
        </span>
        <i />
        <span>{n} layers</span>
      </div>
      <div className="vz-ly-rows" role="tablist" aria-label="What we build" onKeyDown={b.onKey} style={{ "--p": (active + 0.5) / n } as React.CSSProperties}>
        {cards.map((c, i) => (
          <div key={i} className="vz-ly-row" data-on={i === active}>
            <button type="button" {...tab(b, i)} className="vz-ly-name" data-on={i === active}>
              <span className="vz-ly-eye" aria-hidden />
              <span className="vz-ly-no">{two(i + 1)}</span>
              <b>{plain(c.title)}</b>
            </button>
            <div className="vz-ly-lane" aria-hidden>
              <span className="vz-ly-bar" style={{ "--s": `${(i * 17) % 38}%`, "--w": `${34 + ((i * 23) % 40)}%` } as React.CSSProperties} />
            </div>
          </div>
        ))}
        <i className="vz-ly-head" aria-hidden />
      </div>
      <div key={active} {...panel(b)} className="vz-ly-panel">
        <div className="vz-ly-ph">
          <h3>{plain(cur.title)}</h3>
          <p>{cur.description}</p>
          <More c={cur} />
        </div>
        <Points c={cur} />
      </div>
    </div>
  );
}

/** a palette: the boxes are colour swatches in a list, the open one is a large poster in its colour */
function Palette(b: B) {
  const { cards, active } = b;
  const cur = cards[active];
  const hue = (i: number) => `calc(var(--th) + ${(354 + i * 37) % 360})`;
  return (
    <div className="md vz vz-pa" data-pin={b.pinned}>
      <div className="vz-pa-list" role="tablist" aria-label="What we build" onKeyDown={b.onKey}>
        {cards.map((c, i) => (
          <button key={i} type="button" {...tab(b, i)} className="vz-pa-sw" data-on={i === active} style={{ "--h": hue(i) } as React.CSSProperties}>
            <i aria-hidden />
            <span>
              <small>No. {two(i + 1)}</small>
              <b>{plain(c.title)}</b>
            </span>
          </button>
        ))}
      </div>
      <div key={active} {...panel(b)} className="vz-pa-poster bglow" style={{ "--h": hue(active) } as React.CSSProperties}>
        <GlowEdge />
        <span className="vz-pa-no" aria-hidden>
          {two(active + 1)}
        </span>
        <div className="vz-pa-in">
          <h3>{plain(cur.title)}</h3>
          <p>{cur.description}</p>
          <Points c={cur} />
          <More c={cur} />
        </div>
      </div>
    </div>
  );
}

/** a search result page: every box is a result, the open one is the large one with the points in it */
function Serp(b: B) {
  const { cards, active } = b;
  return (
    <div className="md vz vz-sp" data-pin={b.pinned}>
      <div className="vz-sp-bar" aria-hidden>
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <span>we3vision.com</span>
        <em>{cards.length} results</em>
      </div>
      <div className="vz-sp-list" role="tablist" aria-label="What we build" onKeyDown={b.onKey}>
        {cards.map((c, i) => (
          <div key={i} className="vz-sp-res" data-on={i === active}>
            <button type="button" {...tab(b, i)} className="vz-sp-btn">
              <span className="vz-sp-pos">{i + 1}</span>
              <span className="vz-sp-main">
                <small>we3vision.com › services › {slug(c.title)}</small>
                <b>{plain(c.title)}</b>
              </span>
            </button>
            {i === active && (
              <div key={active} {...panel(b)} className="vz-sp-snip">
                <p>{c.description}</p>
                <Points c={c} />
                <More c={c} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StageBody({ kind, ...b }: B & { kind: BodyKind }) {
  if (b.cards.length === 0) return null;
  switch (kind) {
    case "phone":
      return <Phone {...b} />;
    case "pipeline":
      return <Pipeline {...b} />;
    case "layers":
      return <Layers {...b} />;
    case "palette":
      return <Palette {...b} />;
    default:
      return <Serp {...b} />;
  }
}
