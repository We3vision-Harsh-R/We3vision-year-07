"use client";

import { useEffect, useRef, useState } from "react";
import { GlowEdge } from "../glow-edge";
import { IconTile } from "../icons";
import { SmartLink } from "../smart-link";

// "What we build" as a list and a stage: the services are a list on the left (a row of tabs on a phone), and the one you pick opens as a large
// panel on the right with a small live picture of what that service does (a chat that answers, a chart that predicts, an image that is scanned,
// a loop that keeps a model fresh), then when it is the right choice, the problems it solves and what you get. Nothing has to be dragged: it
// moves on by itself while it is on the screen, and stops as soon as the visitor picks one. The look is in globals.css (.sx-*).

type Card = { title: string; description: string; href?: string; fit?: string; problems?: string; outcomes?: string };
type Scene = "chat" | "chart" | "scan" | "loop" | "orbit";

const lines = (s?: string) => (s ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
const plain = (s: string) => s.replace(/\s*\n\s*/g, " ");
const sceneOf = (title: string): Scene => {
  const t = title.toLowerCase();
  if (/agent|generative|chat|assistant/.test(t)) return "chat";
  if (/machine|learning|predict|data/.test(t)) return "chart";
  if (/vision|image|video/.test(t)) return "scan";
  if (/mlops|rag|deploy|monitor/.test(t)) return "loop";
  return "orbit";
};
const AUTO_MS = 6500;

function Art({ scene, index }: { scene: Scene; index: number }) {
  if (scene === "chat")
    return (
      <div className="sx-chat">
        <p className="sx-b sx-user" style={{ "--d": "0.15s" } as React.CSSProperties}>
          Where is my order?
        </p>
        <div className="sx-slot">
          <p className="sx-b sx-bot sx-typing" aria-hidden>
            <i />
            <i />
            <i />
          </p>
          <p className="sx-b sx-bot sx-reply">I checked it for you: it is out for delivery and arrives today.</p>
        </div>
        <p className="sx-done">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
          Ticket closed, CRM updated
        </p>
      </div>
    );
  if (scene === "chart")
    return (
      <div className="sx-chart">
        <div className="sx-bars">
          {[34, 46, 40, 58, 52, 66, 74, 84].map((h, i) => (
            <span key={i} className="sx-bar" data-p={i > 4} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />
          ))}
          <svg className="sx-trend" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden>
            <path pathLength={1} d="M4 30 C 22 26, 34 22, 50 18 S 82 8, 96 4" />
          </svg>
        </div>
        <p className="sx-cap">
          <span>What happened</span>
          <span>What is likely next</span>
        </p>
      </div>
    );
  if (scene === "scan")
    return (
      <div className="sx-scan">
        <span className="sx-shape sx-s1" />
        <span className="sx-shape sx-s2" />
        <span className="sx-shape sx-s3" />
        <span className="sx-box sx-x1" style={{ "--d": "1s" } as React.CSSProperties}>
          <em>Item found</em>
        </span>
        <span className="sx-box sx-x2" style={{ "--d": "1.9s" } as React.CSSProperties}>
          <em>Check this one</em>
        </span>
        <span className="sx-sweep" aria-hidden />
      </div>
    );
  if (scene === "loop")
    return (
      <div className="sx-loop">
        <div className="sx-loop-in">
          <span className="sx-ring" aria-hidden />
          <span className="sx-core">Always up to date</span>
          <b className="sx-node sx-n1">Deploy</b>
          <b className="sx-node sx-n2">Monitor</b>
          <b className="sx-node sx-n3">Retrain</b>
          <b className="sx-node sx-n4">Your documents</b>
        </div>
      </div>
    );
  return (
    <div className="sx-orbit">
      <span className="sx-ring sx-ring-a" aria-hidden />
      <span className="sx-ring sx-ring-b" aria-hidden />
      <IconTile index={index + 1} large />
    </div>
  );
}

export function ServiceStage({ cards }: { cards: Card[] }) {
  const n = cards.length;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number, focus = false) => {
    setAuto(false);
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };

  // only while it is on the screen (and the visitor has not chosen one) it moves on by itself
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const run = auto && inView && n > 1;
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [run, active, n]);

  if (n === 0) return null;
  const cur = cards[Math.min(active, n - 1)];
  const fit = (cur.fit ?? "").trim();
  const problems = lines(cur.problems);
  const outcomes = lines(cur.outcomes);
  const scene = sceneOf(plain(cur.title));

  const onKey = (e: React.KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowRight") pick((active + 1) % n, true);
    else if (k === "ArrowUp" || k === "ArrowLeft") pick((active - 1 + n) % n, true);
    else return;
    e.preventDefault();
  };

  return (
    <div ref={rootRef} className="md sx">
      <div className="sx-list" role="tablist" aria-label="What we build" onKeyDown={onKey}>
        {cards.map((c, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`sx-tab-${i}`}
            aria-selected={i === active}
            aria-controls="sx-panel"
            tabIndex={i === active ? 0 : -1}
            className="sx-tab"
            data-on={i === active}
            data-run={run}
            onClick={() => pick(i)}
          >
            <span className="sx-tab-no">{String(i + 1).padStart(2, "0")}</span>
            <span className="sx-tab-t">
              <b>{plain(c.title)}</b>
              <i>{c.description}</i>
            </span>
            <span className="sx-tab-bar" aria-hidden />
          </button>
        ))}
      </div>

      <div key={active} id="sx-panel" role="tabpanel" aria-labelledby={`sx-tab-${active}`} className="sx-panel bglow">
        <GlowEdge />
        <div className="sx-art" data-scene={scene} aria-hidden>
          <Art scene={scene} index={active} />
        </div>
        <div className="sx-body">
          <span className="sx-pos" aria-hidden>
            {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <h3>{plain(cur.title)}</h3>
          {!fit && problems.length === 0 && outcomes.length === 0 && <p className="sx-fit">{cur.description}</p>}
          {fit && (
            <p className="sx-fit">
              <b>Right for you when</b> {fit}
            </p>
          )}
          <div className="sx-cols">
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
          </div>
          {cur.href && (
            <SmartLink href={cur.href} className="sx-more">
              Read more →
            </SmartLink>
          )}
        </div>
      </div>
    </div>
  );
}
