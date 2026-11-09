"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { SectionProps } from "../sections/shared";
import { HeroBadges } from "../hero-badges";
import { ButtonLink, Chip } from "../ui";
import "@/styles/ai-hero.css";

// First screen of the AI page (owner, 2026-11-09, from a reference of an AI policy platform): the heading on top and under it a small "AI lab". On the left
// the We3vision AI core, five kinds of AI in the middle, and a fan of the real jobs they do on the right (the use cases of the old page: answering customers,
// qualifying leads, image recognition, predicting demand, fraud detection, route optimisation, recommendations, reports, updating systems). Every few seconds
// another kind of AI wakes up: its lines light up, light runs along them, its jobs glow and the panel on the right shows a sample question and answer.
// No numbers or client names are invented. Styles: .aih-* in styles/ai-hero.css (theme colours only, transform and opacity only).
type Props = SectionProps<"pageHero">;

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

const KINDS = [
  {
    name: "Chatbots & assistants",
    jobs: ["Answer customers", "Qualify leads", "AI tutors"],
    q: "What is the price of your premium plan?",
    a: "Checks your CRM and price list, answers in seconds and saves the lead.",
  },
  {
    name: "Computer vision",
    jobs: ["Image recognition", "Read documents", "Video analysis"],
    q: "What is in this photo?",
    a: "Looks at the picture, finds what matters and sends the result to your system.",
  },
  {
    name: "Predictive analytics",
    jobs: ["Predict demand", "Fraud detection", "Route optimisation"],
    q: "What will we need next month?",
    a: "Learns from your past data and shows what is most likely to come next.",
  },
  {
    name: "Recommendations",
    jobs: ["Product picks", "Content picks", "Smart offers"],
    q: "What should this customer see next?",
    a: "Matches every visitor with the products or content they are most likely to want.",
  },
  {
    name: "Automation",
    jobs: ["Write reports", "Update systems", "Data-heavy tasks"],
    q: "Prepare this week's report.",
    a: "Collects the data, writes the summary and updates your CRM or ERP.",
  },
] as const;

// where the information comes from (the tools of the flow section of the page) and which of them each kind of AI uses
const SOURCES = ["Website & apps", "Emails & chats", "CRM & sales", "Documents", "Databases", "Images & video"];
const USES = [[0, 1, 2], [3, 5], [2, 4], [0, 4], [1, 3, 4]];
// what an AI agent does with one request (the steps of the flow section of the page)
const STEPS = ["Reads and understands the request", "Checks your CRM, documents and data", "Decides the best next step", "Does the work for you"];

// geometry of the 1440 x 490 stage (px): five columns, each under its own small heading, with room between them
const COLS = [
  { n: "01", t: "Data in", x: 0 },
  { n: "02", t: "One core", x: 250 },
  { n: "03", t: "AI models", x: 500 },
  { n: "04", t: "Jobs done", x: 735 },
  { n: "05", t: "Agent at work", x: 1090 },
];
const SX = 0;
const SW = 172;
const SY = SOURCES.map((_, i) => 84 + i * 72);
const CORE = { x: 330, y: 268 };
const KX = 470; // left edge of the kind cards
const KW = 220;
const KY = [96, 182, 268, 354, 440];
const JOBS = KINDS.flatMap((k, ki) => k.jobs.map((name, j) => ({ name, ki, i: ki * 3 + j })));
const jobPos = (i: number) => {
  const t = (i - 7) / 7; // -1 .. 1 down the fan
  return { x: 775 + 50 * Math.cos(t * 1.15), y: 76 + i * 27.4 };
};
const srcWire = (si: number) => `M${SX + SW} ${SY[si]} C ${SX + SW + 60} ${SY[si]} ${CORE.x - 120} ${CORE.y} ${CORE.x - 50} ${CORE.y}`;
const coreWire = (ki: number) => `M${CORE.x + 50} ${CORE.y} C ${KX - 60} ${CORE.y} ${KX - 70} ${KY[ki]} ${KX} ${KY[ki]}`;
const jobWire = (i: number) => {
  const ki = Math.floor(i / 3);
  const p = jobPos(i);
  const x0 = KX + KW;
  return `M${x0} ${KY[ki]} C ${x0 + 50} ${KY[ki]} ${p.x - 50} ${p.y} ${p.x} ${p.y}`;
};

export function AiHero({ data, site }: Pick<Props, "data" | "site">) {
  const [on, setOn] = useState(0);
  const [hold, setHold] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(true);

  // wake the next kind of AI every few seconds (stops when the stage is off screen, when the pointer rests on a kind, or with "reduce motion")
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (hold || !seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setOn((v) => (v + 1) % KINDS.length), 6400);
    return () => clearInterval(t);
  }, [hold, seen]);

  const kind = KINDS[on];
  return (
    <section id="top" className="phz-hero aih-root relative flex min-h-screen flex-col items-center px-4 pb-28 pt-32 text-center">
      <div className="aih-bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <HeroBadges badges={site.badges} />
      <div className="relative mx-auto w-full max-w-[1200px]">
        {data.chip && (
          <div className="animate-rise" style={rise(100)}>
            <Chip>{data.chip}</Chip>
          </div>
        )}
        {/* one line that tells what the picture below shows; the heading of the page stays in the page for search engines and screen readers */}
        <h1 className="aih-h1 animate-rise" style={rise(250)}>
          <span className="sr-only">{data.heading.replace(/\n/g, " ")}. </span>
          Five kinds of AI, <em>one core</em>, real work done for you
        </h1>
        <div className="animate-rise mt-7 flex flex-wrap items-center justify-center gap-5" style={rise(450)}>
          <ButtonLink href={data.primaryHref}>{data.primaryLabel}</ButtonLink>
          <ButtonLink href={data.secondaryHref} variant="ghost">
            {data.secondaryLabel}
          </ButtonLink>
        </div>
      </div>

      <div className="aih animate-rise" style={rise(650)} ref={root} aria-hidden data-pause-off>
        <div className="aih-stage" data-hold={hold ? "" : undefined}>
          {/* the heading of each column, with a hairline over it */}
          {COLS.map((c) => (
            <p key={c.n} className="aih-col" style={{ left: c.x, width: c.n === "05" ? 350 : undefined }}>
              <b>{c.n}.</b> {c.t}
            </p>
          ))}
          {/* far away, out of focus: soft lights behind the picture */}
          <i className="aih-bokeh aih-bk1" />
          <i className="aih-bokeh aih-bk2" />
          <i className="aih-bokeh aih-bk3" />
          {/* the lines */}
          <svg className="aih-wires" viewBox="0 0 1440 490" fill="none">
            {SOURCES.map((n, si) => (
              <path key={n} d={srcWire(si)} className={USES[on].includes(si) ? "on" : undefined} />
            ))}
            {KINDS.map((k, ki) => (
              <path key={k.name} d={coreWire(ki)} className={ki === on ? "on" : undefined} />
            ))}
            {JOBS.map((j) => (
              <path key={j.i} d={jobWire(j.i)} className={j.ki === on ? "on" : undefined} />
            ))}
          </svg>

          {/* light that runs along the lines */}
          {SOURCES.map((n, si) => (
            <span key={`${n}${USES[on].includes(si)}`} className={`aih-dot${USES[on].includes(si) ? " aih-dot-hot" : ""}`} style={{ offsetPath: `path("${srcWire(si)}")`, "--d": `${si * 0.37}s`, "--t": "2.2s" } as CSSProperties} />
          ))}
          {KINDS.map((k, ki) => (
            <span key={k.name} className="aih-dot" style={{ offsetPath: `path("${coreWire(ki)}")`, "--d": `${ki * 0.55}s`, "--t": "2.8s" } as CSSProperties} />
          ))}
          {JOBS.filter((j) => j.ki === on).map((j, n) => (
            <span key={`${on}-${j.i}`} className="aih-dot aih-dot-hot" style={{ offsetPath: `path("${jobWire(j.i)}")`, "--d": `${n * 0.28}s`, "--t": "1.7s" } as CSSProperties} />
          ))}

          {/* where the information comes from */}
          {SOURCES.map((n, si) => (
            <span key={n} className={`aih-src${USES[on].includes(si) ? " on" : ""}`} style={{ left: SX, top: SY[si] - 16, width: SW }}>
              <i />
              {n}
            </span>
          ))}

          {/* the core */}
          <div className="aih-core" style={{ left: CORE.x, top: CORE.y }}>
            <i className="aih-r1" />
            <i className="aih-r2" />
            <i className="aih-r3" />
            <i className="aih-rip" key={`r${on}`} />
            <b />
            <span>
              AI
              <small>Using {USES[on].map((u) => SOURCES[u].split(" ")[0]).join(", ")}</small>
            </span>
          </div>

          {/* the kinds of AI */}
          {KINDS.map((k, ki) => (
            <button
              key={k.name}
              type="button"
              tabIndex={-1}
              className={`aih-kind${ki === on ? " on" : ""}`}
              style={{ left: KX, top: KY[ki] - 27, width: KW }}
              onMouseEnter={() => {
                setOn(ki);
                setHold(true);
              }}
              onMouseLeave={() => setHold(false)}>
              <em>{String(ki + 1).padStart(2, "0")}</em>
              {k.name}
            </button>
          ))}

          {/* the jobs */}
          {JOBS.map((j) => {
            const p = jobPos(j.i);
            return (
              <span key={j.i} className={`aih-job${j.ki === on ? " on" : ""}`} style={{ left: p.x, top: p.y - 13 }}>
                <i />
                {j.name}
              </span>
            );
          })}

          {/* the panel: a sample question and answer of the kind of AI that is awake */}
          <div className="aih-panel" key={on}>
            <p className="aih-pk">
              <i /> {kind.name}
              <span>Live</span>
            </p>
            <p className="aih-pq">
              <span>{kind.q}</span>
            </p>
            <ol className="aih-steps">
              {STEPS.map((t, n) => (
                <li key={t} style={{ "--n": n } as CSSProperties}>
                  <i />
                  {t}
                </li>
              ))}
            </ol>
            <p className="aih-pa">{kind.a}</p>
            <div className="aih-ask">
              Ask a question…
              <b />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
