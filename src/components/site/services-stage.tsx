"use client";

import "@/styles/home-services.css";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ICONS } from "./icons";
import { ACCENTS, oneLine, parseSubs, type ServiceCard } from "./service-data";
import { SmartLink } from "./smart-link";

// THE SERVICES OF THE HOME PAGE ON A LAPTOP (owner 2026-10-31: "the walking on the road is too heavy; redesign the whole section, fully animated, for an
// AI / ML and web development company"). It replaces the pinned scroll track with the walking guide: one calm stage that stays in the normal page flow.
//   left   a list of the services (number, name); the chosen one shows a thin progress line and the stage follows it, one after the other, every
//          SECONDS seconds (it stops while the pointer is on the stage, while the section is off screen and with "reduce motion")
//   right  the stage: a small animated drawing of the service (pure CSS / SVG, only transform and opacity move), its words, its four parts and the button
// The phone and tablet keep the swipe cards of services-rail.tsx (home-mobile.css shows one or the other). Styles: styles/home-services.css (prefix sv-).
const SECONDS = 7;
const pad = (n: number) => String(n).padStart(2, "0");

/** which drawing a service gets: found from its title (the texts come from the admin panel) */
function kindOf(title: string) {
  const t = title.toLowerCase();
  if (/\bai\b|\bml\b|machine|intelligen/.test(t)) return "ai";
  if (/metaverse|\bvr\b|\bar\b|3d/.test(t)) return "meta";
  if (/mobile|\bapp\b/.test(t)) return "app";
  if (/\bui\b|\bux\b|ui\/ux/.test(t)) return "ux";
  if (/crm|erp|software/.test(t)) return "crm";
  if (/brand|graphic/.test(t)) return "brand";
  return "web";
}

// the nodes of the small neural network (x, y) in three layers; the lines run between neighbouring layers
const NET: [number, number][][] = [
  [[44, 46], [44, 100], [44, 154]],
  [[150, 28], [150, 78], [150, 128], [150, 172]],
  [[256, 62], [256, 138]],
];

function Scene({ kind }: { kind: string }) {
  if (kind === "ai") {
    const lines: string[] = [];
    for (let l = 0; l < NET.length - 1; l++) for (const a of NET[l]) for (const b of NET[l + 1]) lines.push(`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`);
    const sigs = [lines[1], lines[6], lines[10], lines[13], lines[17], lines[21]].filter(Boolean);
    return (
      <svg className="sv-sc sv-ai" viewBox="0 0 300 200" aria-hidden>
        {lines.map((d, i) => (
          <path key={i} d={d} className="sv-ai-l" />
        ))}
        {NET.flat().map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" className="sv-ai-n" style={{ "--k": i } as CSSProperties} />
        ))}
        {sigs.map((d, i) => (
          <circle key={i} r="3.4" className="sv-ai-s" style={{ offsetPath: `path("${d}")`, "--k": i } as CSSProperties} />
        ))}
      </svg>
    );
  }
  if (kind === "web") {
    return (
      <div className="sv-sc sv-web" aria-hidden>
        <div className="sv-w-bar">
          <i />
          <i />
          <i />
        </div>
        <div className="sv-w-body">
          <b className="sv-w-nav" style={{ "--k": 0 } as CSSProperties} />
          <b className="sv-w-hero" style={{ "--k": 1 } as CSSProperties} />
          <b className="sv-w-c" style={{ "--k": 2 } as CSSProperties} />
          <b className="sv-w-c" style={{ "--k": 3 } as CSSProperties} />
          <b className="sv-w-c" style={{ "--k": 4 } as CSSProperties} />
        </div>
        <u className="sv-w-cur" />
      </div>
    );
  }
  if (kind === "app") {
    return (
      <div className="sv-sc sv-app" aria-hidden>
        <div className="sv-ph">
          <b className="sv-ph-top" />
          {[0, 1, 2].map((k) => (
            <i key={k} className="sv-ph-card" style={{ "--k": k } as CSSProperties} />
          ))}
          <b className="sv-ph-tab" />
        </div>
        <span className="sv-ap-chip is-a">Push sent</span>
        <span className="sv-ap-chip is-b">+ 2.4k installs</span>
      </div>
    );
  }
  if (kind === "meta") {
    return (
      <div className="sv-sc sv-meta" aria-hidden>
        <div className="sv-cube">
          {["f", "b", "r", "l", "t", "d"].map((f) => (
            <i key={f} className={`sv-cf is-${f}`} />
          ))}
        </div>
        <i className="sv-ring" />
        <i className="sv-ring is-2" />
      </div>
    );
  }
  if (kind === "ux") {
    return (
      <div className="sv-sc sv-ux" aria-hidden>
        <div className="sv-ux-stack">
          {[0, 1, 2].map((k) => (
            <i key={k} className="sv-ux-l" style={{ "--k": k } as CSSProperties}>
              <b />
              <b />
              <b />
            </i>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "crm") {
    return (
      <div className="sv-sc sv-crm" aria-hidden>
        {["Lead", "Talk", "Offer", "Won"].map((n, i) => (
          <div key={n} className="sv-crm-c">
            <span>{n}</span>
            <i style={{ "--h": `${[78, 62, 44, 30][i]}%` } as CSSProperties} />
          </div>
        ))}
        {[0, 1, 2].map((k) => (
          <b key={k} className="sv-crm-d" style={{ "--k": k } as CSSProperties} />
        ))}
      </div>
    );
  }
  // brand
  return (
    <div className="sv-sc sv-brand" aria-hidden>
      <i className="sv-br-a" />
      <i className="sv-br-b" />
      <i className="sv-br-c" />
      <div className="sv-br-sw">
        {[0, 1, 2, 3, 4].map((k) => (
          <b key={k} style={{ "--k": k } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}

export function ServicesStage({ cards }: { cards: ServiceCard[] }) {
  const n = cards.length;
  const [at, setAt] = useState(0);
  const [seen, setSeen] = useState(false); // the section is on the screen
  const [held, setHeld] = useState(false); // the pointer is on the stage
  const [still, setStill] = useState(false); // reduce motion
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const next = useCallback(() => setAt((a) => (a + 1) % Math.max(1, n)), [n]);
  const auto = seen && !held && !still && n > 1;
  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(next, SECONDS * 1000);
    return () => window.clearTimeout(t);
  }, [auto, at, next]);

  if (n === 0) return null;
  const card = cards[at] ?? cards[0];
  const title = oneLine(card.title);
  const subs = parseSubs(card.subs);
  const kind = kindOf(title);
  const Icon = ICONS[at % ICONS.length];

  return (
    <section ref={root} className="sv" data-play={seen && !still} aria-labelledby="sv-t" style={{ "--ac": ACCENTS[at % ACCENTS.length] } as CSSProperties}>
      <div className="sv-in">
        <header className="sv-head">
          <p className="sv-eyebrow">What we build</p>
          <h2 id="sv-t">
            AI, software and websites, <span>built to ship.</span>
          </h2>
        </header>

        <div className="sv-grid">
          <div className="sv-list" role="tablist" aria-label="Our services" aria-orientation="vertical">
            {cards.map((c, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                id={`sv-tab-${i}`}
                aria-selected={i === at}
                aria-controls="sv-stage"
                className="sv-row"
                style={{ "--ac": ACCENTS[i % ACCENTS.length] } as CSSProperties}
                onClick={() => setAt(i)}>
                <i>{pad(i + 1)}</i>
                <span>{oneLine(c.title)}</span>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M9 6l6 6-6 6" />
                </svg>
                {i === at && <u className="sv-prog" key={`${at}-${auto}`} data-run={auto} />}
              </button>
            ))}
          </div>

          <div id="sv-stage" className="sv-stage" role="tabpanel" aria-labelledby={`sv-tab-${at}`} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
            <i className="sv-glow" aria-hidden />
            <div className="sv-art" key={`a${at}`}>
              <Scene kind={kind} />
            </div>
            <div className="sv-body" key={`b${at}`}>
              <div className="sv-copy">
                <span className="sv-ico" aria-hidden>
                  <Icon className="size-5" />
                </span>
                <h3>{title}</h3>
                {card.summary && <p>{card.summary}</p>}
                {card.href && (
                  <SmartLink href={card.href} className="sv-go">
                    <span>Explore {title}</span>
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </SmartLink>
                )}
              </div>
              {subs.length > 0 && (
                <ul className="sv-subs">
                  {subs.map((s, j) => (
                    <li key={j} style={{ "--k": j } as CSSProperties}>
                      <i>{pad(j + 1)}</i>
                      <b>{s.name}</b>
                      {s.desc && <p>{s.desc}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
