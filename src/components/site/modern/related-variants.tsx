import "@/styles/modern-base.css";
import "@/styles/modern-related.css";
import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";
import { SmartLink } from "../smart-link";

// "More from We3vision" in six more designs (the first one is related-links.tsx), one for every service page. The cards are a title, a text
// and a link. The look is in globals.css (.vl-*).

type Card = { title: string; description: string; href?: string };
type P = { cards: Card[] };

const two = (n: number) => String(n).padStart(2, "0");
const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");

function Item({ c, className, children }: { c: Card; className: string; children: React.ReactNode }) {
  return c.href ? (
    <SmartLink href={c.href} className={className}>
      {children}
    </SmartLink>
  ) : (
    <div className={className}>{children}</div>
  );
}
const Arrow = () => (
  <span className="vl-go" aria-hidden>
    <svg viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
);

/** 1: big rows (a magazine contents list): the number, the name and the text, the arrow moves out on hover */
function Rows({ cards }: P) {
  return (
    <ul className="md vl vl-rows">
      {cards.map((c, i) => (
        <li key={i}>
          <Item c={c} className="vl-row">
            <span className="vl-no">{two(i + 1)}</span>
            <h3>{plain(c.title)}</h3>
            <p>{c.description}</p>
            <Arrow />
          </Item>
        </li>
      ))}
    </ul>
  );
}

/** 2: a deck of cards that lie on each other and fan out when the mouse comes to them */
function Deck({ cards }: P) {
  return (
    <ul className="md vl vl-deck" style={{ "--n": cards.length } as React.CSSProperties}>
      {cards.map((c, i) => (
        <li key={i} style={{ "--i": i } as React.CSSProperties}>
          <Item c={c} className="vl-dk bglow">
            <GlowEdge />
            <IconTile index={i + 1} />
            <h3>{plain(c.title)}</h3>
            <p>{c.description}</p>
            <Arrow />
          </Item>
        </li>
      ))}
    </ul>
  );
}

/** 3: the links as pills that move slowly past (they stop when the mouse is on them) */
function Marquee({ cards }: P) {
  const all = [...cards, ...cards, ...cards];
  return (
    <div className="md vl vl-mq">
      <ul className="vl-mq-track">
        {all.map((c, i) => (
          <li key={i} aria-hidden={i >= cards.length}>
            <Item c={c} className="vl-mq-pill">
              <IconTile index={(i % cards.length) + 1} />
              <span>
                <b>{plain(c.title)}</b>
                <small>{c.description}</small>
              </span>
            </Item>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 4: large tiles with a colour field and the arrow in a corner */
function Tiles({ cards }: P) {
  return (
    <ul className="md vl vl-tiles">
      {cards.map((c, i) => (
        <li key={i} data-k={i % 4}>
          <Item c={c} className="vl-tile">
            <span className="vl-no">{two(i + 1)}</span>
            <h3>{plain(c.title)}</h3>
            <p>{c.description}</p>
            <Arrow />
          </Item>
        </li>
      ))}
    </ul>
  );
}

/** 5: chips of different sizes, the text comes out under the one that is hovered */
function Cloud({ cards }: P) {
  return (
    <ul className="md vl vl-cloud">
      {cards.map((c, i) => (
        <li key={i} data-k={i % 3}>
          <Item c={c} className="vl-chip">
            <b>{plain(c.title)}</b>
            <small>{c.description}</small>
          </Item>
        </li>
      ))}
    </ul>
  );
}

/** 6: a strip of panels: the one that is hovered opens wide and shows its text, the others are slim */
function Strip({ cards }: P) {
  return (
    <ul className="md vl vl-strip">
      {cards.map((c, i) => (
        <li key={i}>
          <Item c={c} className="vl-sp">
            <span className="vl-no">{two(i + 1)}</span>
            <h3>{plain(c.title)}</h3>
            <p>{c.description}</p>
            <Arrow />
          </Item>
        </li>
      ))}
    </ul>
  );
}

/** the design of the page: 1..6 (0 is related-links.tsx) */
export function RelatedVariant({ variant, cards }: { variant: number; cards: Card[] }) {
  switch (variant) {
    case 1:
      return <Rows cards={cards} />;
    case 2:
      return <Deck cards={cards} />;
    case 3:
      return <Marquee cards={cards} />;
    case 4:
      return <Tiles cards={cards} />;
    case 5:
      return <Cloud cards={cards} />;
    default:
      return <Strip cards={cards} />;
  }
}

