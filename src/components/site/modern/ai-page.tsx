import type { CSSProperties } from "react";
import type { SectionData } from "@/lib/cms/sections";
import { Reveal } from "../reveal";
import { Rich, paragraphs } from "../ui";
import "@/styles/ai-page.css";

// The AI page below the hero (owner, 2026-11-09, from five references: glass cards with glow, a pill workflow, "how it works" cards with a small picture
// each, curved shapes and a slider graph with a glowing path). Server parts: the heading of a section, "What we build" and the industries.
// The process and the reasons are client parts in ai-page-client.tsx. Styles: .aip-* in styles/ai-page.css (theme colours only).

/** The head of a section: a small label with a dot, a light heading whose last line is the italic accent, and the intro on the right. */
export function AiHead({ chip, heading, intro }: { chip?: string; heading: string; intro?: string }) {
  const lines = heading.split("\n").map((l) => l.trim()).filter(Boolean);
  const last = lines.length > 1 ? lines.pop() : undefined;
  return (
    <header className="aip-head">
      <div>
        {chip && (
          <p className="aip-chip">
            <i />
            {chip}
          </p>
        )}
        <h2>
          {lines.join(" ")}
          {last && (
            <>
              {" "}
              <em>{last}</em>
            </>
          )}
        </h2>
      </div>
      {intro && <p className="aip-intro">{intro}</p>}
    </header>
  );
}

/** the small picture of each kind of AI work: a chat, a forecast, a scan and a list of live systems (drawn in CSS, no images) */
function Viz({ i }: { i: number }) {
  if (i === 0) {
    return (
      <div className="aip-viz aip-v0" aria-hidden>
        <p className="aip-bu">What is the price of the premium plan?</p>
        <p className="aip-bb">
          <i />
          <i />
          <i />
        </p>
        <p className="aip-br">
          <b />
          <b />
          <b />
        </p>
        <span className="aip-bi">Ask anything…</span>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div className="aip-viz aip-v1" aria-hidden>
        <svg viewBox="0 0 260 130" fill="none">
          <defs>
            <linearGradient id="aip-g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="hsl(calc(var(--th) + 0) calc(90% * var(--ts)) 70%)" stopOpacity="0.35" />
              <stop offset="1" stopColor="hsl(calc(var(--th) + 0) calc(90% * var(--ts)) 70%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 62, 94].map((y) => (
            <line key={y} x1="0" x2="260" y1={y} y2={y} className="aip-gl" />
          ))}
          <path className="aip-area" d="M0 108 C 30 100 50 104 80 84 S 130 70 156 52 L156 130 L0 130 Z" fill="url(#aip-g1)" />
          <path className="aip-line" pathLength="1" d="M0 108 C 30 100 50 104 80 84 S 130 70 156 52" />
          <path className="aip-fore" d="M156 52 C 186 40 214 36 260 18" />
          <circle className="aip-dot" cx="156" cy="52" r="5" />
        </svg>
        <span className="aip-vt">Next month</span>
      </div>
    );
  }
  if (i === 2) {
    return (
      <div className="aip-viz aip-v2" aria-hidden>
        <span className="aip-scan" />
        <span className="aip-obj aip-o1" />
        <span className="aip-obj aip-o2" />
        <em className="aip-tag aip-t1">Product</em>
        <em className="aip-tag aip-t2">Label</em>
        <u className="aip-c aip-c1" />
        <u className="aip-c aip-c2" />
        <u className="aip-c aip-c3" />
        <u className="aip-c aip-c4" />
      </div>
    );
  }
  return (
    <div className="aip-viz aip-v3" aria-hidden>
      {["Deploy", "Monitor", "Retrain", "Your documents"].map((t, n) => (
        <p key={t} style={{ "--n": n } as CSSProperties}>
          <i />
          {t}
          <span />
        </p>
      ))}
    </div>
  );
}

/** "What we build": the four kinds of AI work as cards, each with a small living picture, what it is, and when it is the right choice */
export function AiServices({ data }: { data: SectionData<"services"> }) {
  return (
    <section id="services" className="aip aip-sec">
      <div className="aip-wrap">
        <Reveal>
          <AiHead chip={data.chip} heading={data.heading} intro={data.intro} />
        </Reveal>
        <div className="aip-svc">
          {data.cards.map((c, i) => (
            <Reveal key={c.title} className="aip-card">
              <Viz i={i} />
              <p className="aip-n">{String(i + 1).padStart(2, "0")}</p>
              <h3>{c.title.split("\n").join(" ")}</h3>
              <p className="aip-d">{c.description}</p>
              {c.fit && (
                <p className="aip-fit">
                  <b>Good fit when</b>
                  {c.fit}
                </p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "what is AI development": the first paragraph as a large statement, the key phrases as pills, the rest of the text on the right */
export function AiStory({ body }: { body: string }) {
  const paras = paragraphs(body);
  const phrases = [...new Set(paras.flatMap((p) => [...p.matchAll(/\*([^*]+)\*/g)].map((m) => m[1].trim())))].slice(0, 8);
  return (
    <section id="about" className="aip aip-sec">
      <div className="aip-wrap">
        <Reveal>
          <p className="aip-chip">
            <i />
            What is AI development
          </p>
          <div className="aip-story">
            <p className="aip-lead">
              <Rich text={paras[0] ?? ""} />
            </p>
            <div>
              {paras.slice(1).map((p, i) => (
                <p key={i} className="aip-d">
                  <Rich text={p} />
                </p>
              ))}
              {phrases.length > 0 && (
                <ul className="aip-pills" aria-label="Key ideas">
                  {phrases.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** the tools: one glass panel with every tool as a tile */
export function AiTags({ data }: { data: SectionData<"tags"> }) {
  const items = data.items.split("\n").map((t) => t.trim()).filter(Boolean);
  return (
    <section id="tools" className="aip aip-sec">
      <div className="aip-wrap">
        <Reveal>
          <AiHead chip={data.chip} heading={data.heading} intro={data.intro} />
        </Reveal>
        <Reveal className="aip-tools">
          {items.map((t, i) => (
            <span key={t} className="aip-tool">
              <em>{String(i + 1).padStart(2, "0")}</em>
              {t}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** the industries: cards with different curved corners and a light that falls from a different side on each */
export function AiIndustries({ data }: { data: SectionData<"industries"> }) {
  return (
    <section id="industries" className="aip aip-sec">
      <div className="aip-wrap">
        <Reveal>
          <AiHead chip={data.chip} heading={data.heading} intro={data.intro} />
        </Reveal>
        <div className="aip-ind">
          {data.items.map((x, i) => (
            <Reveal key={x.name} className={`aip-i aip-i${i % 6}`}>
              <p className="aip-ix">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <b>+</b>
              </p>
              <h3>{x.name}</h3>
              <p className="aip-d">{x.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
