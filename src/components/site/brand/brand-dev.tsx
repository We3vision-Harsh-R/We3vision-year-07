"use client";

import { useEffect, useRef, useState } from "react";
import { Walker } from "./walker";
import { SmartLink } from "../smart-link";
import { oneLine, plainStory, type TechData } from "../tech/data";
import { CHAPTERS, LINES, MATRIX, PACKAGES, totalItems } from "./brand-data";

// BRAND DEVELOPMENT page ("bdv-"): the page is a blueprint of a brand. A technical drawing (grid, rings, dimension marks) that explains the service
// in this order: the statement (a brand is not a logo), the seven service lines as a stack of drawings, the twelve chapters of the work as one long
// horizontal scroll (every deliverable listed), the three packages as a table, the advanced branding as two moving belts, the industries, why us, FAQ.
// Motion is made with GSAP and ScrollTrigger (https://gsap.com), loaded only on this page. Built for laptop and desktop screens.

type GsapMod = typeof import("gsap");

/* ----------------------------------------------------------------------------------------------------------------------------------- drawings */

const ICONS: string[][] = [
  ["M70 28 a42 42 0 1 0 .1 0 Z", "M100 100 L138 138", "M70 12 V28 M70 112 V128 M12 70 H28 M112 70 H128", "M70 70 L88 52"],
  ["M80 20 L108 92 L80 128 L52 92 Z", "M80 92 h.1", "M80 128 V148", "M30 140 C50 110 110 150 138 110", "M26 40 h20 v20 h-20 Z"],
  ["M28 44 H112 V120 H28 Z", "M40 32 H124 V108", "M44 62 H96 M44 78 H84 M44 94 H96", "M104 118 h30 v24 h-30 Z"],
  ["M16 28 H116 V104 H16 Z", "M16 44 H116", "M28 36 h.1 M38 36 h.1", "M118 70 h30 v62 h-30 Z", "M30 60 h40 v32 h-40 Z M82 62 H100 M82 76 H96"],
  ["M80 20 L136 48 V108 L80 136 L24 108 V48 Z", "M24 48 L80 76 L136 48", "M80 76 V136", "M52 34 L108 62"],
  ["M24 36 C48 28 64 36 80 48 C96 36 112 28 136 36 V124 C112 116 96 124 80 136 C64 124 48 116 24 124 Z", "M80 48 V136", "M104 14 L118 28 M118 14 L104 28"],
  ["M28 80 a52 52 0 0 1 92 -34", "M120 46 l4 -22 M120 46 l-22 2", "M132 80 a52 52 0 0 1 -92 34", "M40 114 l-4 22 M40 114 l22 -2", "M80 60 L88 76 L106 78 L92 90 L96 108 L80 98 L64 108 L68 90 L54 78 L72 76 Z"],
];

function Icon({ n }: { n: number }) {
  return (
    <svg className="bdv-ico" viewBox="0 0 160 160" aria-hidden="true">
      {ICONS[n % ICONS.length].map((d, i) => <path key={i} pathLength="1" d={d} style={{ "--k": i } as React.CSSProperties} />)}
    </svg>
  );
}

// rounded, so that the server and the browser write exactly the same numbers
const r2 = (n: number) => Math.round(n * 100) / 100;

function Orbit() {
  const [active, setActive] = useState(0);
  // it cycles through the service lines by itself
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % LINES.length), 2600);
    return () => clearInterval(t);
  }, []);
  const nodes = LINES.map((l, i) => {
    const a = (i / LINES.length) * Math.PI * 2 - Math.PI / 2;
    return { ...l, x: r2(Math.cos(a) * 170), y: r2(Math.sin(a) * 170) };
  });
  return (
    <div className="bdv-orbit-wrap">
      <svg className="bdv-orbit" viewBox="-270 -270 540 540" role="img" aria-label="The seven service lines of brand development around the brand">
        <g className="bdv-o-ring">
          <circle r="250" className="is-dash" />
          {Array.from({ length: 72 }).map((_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const l = i % 6 === 0 ? 14 : 6;
            return <line key={i} x1={r2(Math.cos(a) * 250)} y1={r2(Math.sin(a) * 250)} x2={r2(Math.cos(a) * (250 - l))} y2={r2(Math.sin(a) * (250 - l))} />;
          })}
        </g>
        <circle r="170" className="is-dash is-slow" />
        <circle r="96" />
        <path d="M-270 0 H270 M0 -270 V270" className="is-faint" />
        {nodes.map((n, i) => <line key={`l${i}`} x1="0" y1="0" x2={n.x} y2={n.y} className={`bdv-o-spoke ${active === i ? "is-on" : ""}`} />)}
        {nodes.map((n, i) => (
          <g key={n.n} className={`bdv-o-node ${active === i ? "is-on" : ""}`} transform={`translate(${n.x} ${n.y})`} onMouseEnter={() => setActive(i)} tabIndex={0} onFocus={() => setActive(i)}>
            <circle r="22" />
            <text textAnchor="middle" dy="5">{n.n}</text>
          </g>
        ))}
        <text className="bdv-o-brand" textAnchor="middle" dy="-4">BRAND</text>
        <text className="bdv-o-sub" textAnchor="middle" dy="22">{LINES[active].n} of 07</text>
      </svg>
      <p className="bdv-orbit-cap"><b>{LINES[active].title}</b><span>{LINES[active].text}</span></p>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------------------------------------------------- page */

export function BrandDevPage({ d }: { d: TechData }) {
  const root = useRef<HTMLDivElement>(null);
  const [pack, setPack] = useState(1);
  const [faqOpen, setFaqOpen] = useState(0);
  const [openInd, setOpenInd] = useState(0);
  const heading = d.hero.heading.split("\n");
  const statement = plainStory(d.story).split(/\n\n+/)[0];
  const words = statement.split(/\s+/);
  const total = totalItems();
  const belt = CHAPTERS[11].items;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let ctx: { revert: () => void } | null = null;
    let off: (() => void) | null = null;
    let dead = false;
    let stopTick: (() => void) | null = null;
    (async () => {
      const gsapMod = (await import("gsap")) as unknown as GsapMod & { default: GsapMod["gsap"] };
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (dead) return;
      const gsap = gsapMod.default ?? gsapMod.gsap;
      gsap.registerPlugin(ScrollTrigger);
      gsap.config({ force3D: true });
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.config({ limitCallbacks: true });
      const lenis = (window as unknown as { __lenis?: { on: (e: string, f: () => void) => void; off?: (e: string, f: () => void) => void } }).__lenis;
      lenis?.on("scroll", ScrollTrigger.update);
      off = () => lenis?.off?.("scroll", ScrollTrigger.update);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        // ---- hero: the headline rises line by line, the drawing draws itself, the numbers count up
        gsap.from(".bdv-h1 > span > span", { yPercent: 115, duration: 1.1, ease: "power4.out", stagger: 0.12, delay: 0.15 });
        gsap.from(".bdv-hero-fade", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.55 });
        gsap.from(".bdv-orbit-wrap", { opacity: 0, scale: 0.9, duration: 1.4, ease: "power3.out", delay: 0.3 });
        if (!reduce) gsap.to(".bdv-o-ring", { rotation: 360, duration: 140, repeat: -1, ease: "none", transformOrigin: "50% 50%" });
        el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
          const end = parseInt(n.dataset.count ?? "0", 10);
          const o = { v: 0 };
          gsap.to(o, { v: end, duration: 1.8, ease: "power2.out", delay: 0.9, onUpdate: () => { n.textContent = String(Math.round(o.v)); } });
        });

        // ---- the statement: every word lights up while you scroll
        const sw = gsap.utils.toArray<HTMLElement>(".bdv-st-w");
        gsap.set(sw, { opacity: 0.14 });
        gsap.to(sw, { opacity: 1, stagger: 0.5, ease: "none", scrollTrigger: { trigger: ".bdv-st", start: "top top", end: "+=140%", scrub: true, pin: true } });

        // ---- the service lines: a stack of drawings, every card slides over the one before
        const cards = gsap.utils.toArray<HTMLElement>(".bdv-line");
        cards.forEach((c, i) => {
          if (i < cards.length - 1) gsap.to(c, { scale: 0.95, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top 88%", end: "top 24%", scrub: true } });
        });

        // ---- the journey: twelve chapters, one long sideways scroll
        const track = el.querySelector<HTMLElement>(".bdv-track");
        const jr = el.querySelector<HTMLElement>(".bdv-jr");
        if (track && jr) {
          const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);
          const tween = gsap.to(track, { x: () => -dist(), ease: "none" });
          const bar = el.querySelector<HTMLElement>(".bdv-rail-fill");
          const road = el.querySelector<HTMLElement>(".bdv-road");
          const walker = el.querySelector<HTMLElement>(".bdv-walker");
          const dash = el.querySelector<HTMLElement>(".bdv-road-dash");
          const far = el.querySelector<HTMLElement>(".bdv-scene-far");
          const near = el.querySelector<HTMLElement>(".bdv-scene-near");
          let rw = road?.clientWidth ?? 0;
          let stopT = 0;
          ScrollTrigger.addEventListener("refresh", () => { rw = road?.clientWidth ?? 0; });
          const num = el.querySelector<HTMLElement>(".bdv-rail-n");
          const ttl = el.querySelector<HTMLElement>(".bdv-rail-t");
          const ticks = gsap.utils.toArray<HTMLElement>(".bdv-rail-ticks i");
          let shown = -1;
          ScrollTrigger.create({
            trigger: jr, start: "top top", end: () => "+=" + dist() * 1.15, pin: true, scrub: true, animation: tween, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: (self) => {
              const i = Math.min(CHAPTERS.length - 1, Math.floor(self.progress * CHAPTERS.length));
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
              if (walker) {
                walker.style.transform = `translate3d(${(self.progress * rw - 31).toFixed(1)}px, 0, 0)`;
                walker.classList.add("is-walking");
                window.clearTimeout(stopT);
                stopT = window.setTimeout(() => walker.classList.remove("is-walking"), 150);
              }
              const px = self.progress * 2600;
              if (dash) dash.style.backgroundPositionX = `${(-px).toFixed(0)}px`;
              if (near) near.style.setProperty("--sx", `${(-px * 0.7).toFixed(0)}px`);
              if (far) far.style.setProperty("--sx", `${(-px * 0.3).toFixed(0)}px`);
              // the steps get quicker when the scroll is quicker
              if (walker) walker.style.setProperty("--wd", `${Math.max(0.45, 0.95 - Math.min(Math.abs(self.getVelocity()) / 3000, 0.5)).toFixed(2)}s`);
              if (i === shown) return;
              shown = i;
              if (num) num.textContent = `${CHAPTERS[i].n} / 12`;
              if (ttl) ttl.textContent = CHAPTERS[i].title;
              ticks.forEach((t, k) => t.classList.toggle("is-on", k <= i));
            },
          });
          gsap.utils.toArray<HTMLElement>(".bdv-chap").forEach((c) => {
            gsap.from(c.querySelectorAll(".bdv-chap-num, .bdv-chap-t, .bdv-chap-lead"), { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 85%", toggleActions: "play none none none" } });
            gsap.from(c.querySelectorAll("li"), { opacity: 0, x: 24, duration: 0.5, ease: "power2.out", stagger: 0.025, scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 70%", toggleActions: "play none none none" } });
          });
        }

        // ---- the packages table
        gsap.from(".bdv-tbl tbody tr", { opacity: 0, y: 24, duration: 0.6, ease: "power2.out", stagger: 0.06, scrollTrigger: { trigger: ".bdv-tbl", start: "top 80%" } });

        // ---- the two belts of advanced branding: they run by themselves and speed up with the scroll
        const belts = gsap.utils.toArray<HTMLElement>(".bdv-belt");
        const tweens = belts.map((b, i) => gsap.fromTo(b, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 70, repeat: -1, ease: "none" }));
        let target = 1;
        let speed = 1;
        ScrollTrigger.create({ trigger: ".bdv-belts", start: "top bottom", end: "bottom top", onUpdate: (self) => { target = Math.min(4, 1 + Math.abs(self.getVelocity()) / 500); } });
        const tick = () => {
          target += (1 - target) * 0.04;
          speed += (target - speed) * 0.08;
          tweens.forEach((t) => t.timeScale(speed));
        };
        gsap.ticker.add(tick);
        stopTick = () => gsap.ticker.remove(tick);

        // ---- the rest: parts rise when they come into view
        gsap.utils.toArray<HTMLElement>(".bdv-rise").forEach((x) => gsap.from(x, { opacity: 0, y: 44, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: x, start: "top 88%" } }));
        gsap.utils.toArray<HTMLElement>(".bdv-plate").forEach((x, i) => gsap.from(x, { opacity: 0, y: 40, duration: 0.8, ease: "power3.out", delay: (i % 3) * 0.1, scrollTrigger: { trigger: x, start: "top 90%" } }));
      }, el);
    })();
    return () => {
      dead = true;
      off?.();
      stopTick?.();
      ctx?.revert();
    };
  }, []);

  const lines = LINES;
  return (
    <div className="bdv" ref={root}>
      {/* ------------------------------------------------------------- hero */}
      <section className="bdv-hero">
        <div className="bdv-hero-t">
          <p className="bdv-chip bdv-hero-fade">{d.hero.chip} · Blueprint</p>
          <h1 className="bdv-h1">{heading.map((h, i) => <span key={i}><span>{h}</span></span>)}</h1>
          <p className="bdv-lead bdv-hero-fade">{d.hero.text}</p>
          <div className="bdv-cta bdv-hero-fade">
            <SmartLink href={d.hero.primaryHref} className="bdv-btn">{d.hero.primaryLabel}</SmartLink>
            <SmartLink href="#journey" className="bdv-btn bdv-btn-g">See the 12 chapters</SmartLink>
          </div>
          <dl className="bdv-stats bdv-hero-fade">
            <div><dt>chapters of work</dt><dd><span data-count="12">12</span></dd></div>
            <div><dt>deliverables</dt><dd><span data-count={total}>{total}</span></dd></div>
            <div><dt>service lines</dt><dd><span data-count="7">7</span></dd></div>
            <div><dt>brand packages</dt><dd><span data-count="3">3</span></dd></div>
          </dl>
        </div>
        <Orbit />
      </section>

      {/* ------------------------------------------------------------- the statement */}
      <section className="bdv-st" aria-label="What brand development is">
        <p className="bdv-st-k">A brand is not just a <s>logo</s></p>
        <p className="bdv-st-p">{words.map((w, i) => <span key={i} className="bdv-st-w">{w} </span>)}</p>
      </section>

      {/* ------------------------------------------------------------- the seven service lines */}
      <section className="bdv-sec" id="services">
        <header className="bdv-head bdv-rise">
          <p className="bdv-chip">Complete service structure</p>
          <h2>{oneLine(d.services.heading)}</h2>
          <p>{d.services.intro}</p>
        </header>
        <div className="bdv-lines">
          {d.services.cards.slice(0, 7).map((c, i) => (
            <article key={c.title} className="bdv-line" style={{ "--i": i } as React.CSSProperties}>
              <div className="bdv-line-n">{lines[i]?.n ?? String(i + 1).padStart(2, "0")}</div>
              <div className="bdv-line-b">
                <p className="bdv-line-c">{lines[i]?.chapters}</p>
                <h3>{oneLine(c.title)}</h3>
                <p>{c.description}</p>
              </div>
              <Icon n={i} />
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- the twelve chapters (horizontal scroll) */}
      <section className="bdv-jr" id="journey" aria-label="The twelve chapters of brand development">
        <div className="bdv-jr-in">
          <div className="bdv-track">
            <div className="bdv-intro">
              <p className="bdv-chip">The work, chapter by chapter</p>
              <h2>Twelve Chapters.<br />Every Deliverable Listed.</h2>
              <p>Scroll sideways through everything a complete brand needs. Nothing is hidden: this is the full list of what We3vision can deliver.</p>
              <span className="bdv-arrow" aria-hidden="true">Scroll →</span>
            </div>
            {CHAPTERS.map((c) => (
              <article key={c.n} className="bdv-chap">
                <div className="bdv-chap-head">
                  <span className="bdv-chap-num" aria-hidden="true">{c.n}</span>
                  <div>
                    <h3 className="bdv-chap-t">{c.title}</h3>
                    <p className="bdv-chap-lead">{c.lead}</p>
                  </div>
                </div>
                <ul style={{ columnCount: c.items.length > 18 ? 3 : 2 }}>{c.items.map((x) => <li key={x}>{x}</li>)}</ul>
                {c.note && <p className="bdv-chap-note">{c.note}</p>}
              </article>
            ))}
          </div>
          <div className="bdv-rail" aria-hidden="true">
            <div className="bdv-rail-top"><b className="bdv-rail-n">01 / 12</b><span className="bdv-rail-t">{CHAPTERS[0].title}</span></div>
            <div className="bdv-road">
              <div className="bdv-scene bdv-scene-far" />
              <div className="bdv-scene bdv-scene-near" />
              <div className="bdv-road-dash" />
              <i className="bdv-rail-fill" />
              <div className="bdv-rail-ticks">{CHAPTERS.map((c) => <i key={c.n} />)}</div>
              <svg className="bdv-flag" viewBox="0 0 40 60"><path d="M8 58 V6" /><path d="M8 8 H34 L28 18 L34 28 H8" /></svg>
              <div className="bdv-walker"><i className="bdv-dust bdv-dust-a" /><i className="bdv-dust bdv-dust-b" /><i className="bdv-dust bdv-dust-c" /><span className="bdv-shadow" /><Walker className="bdv-walker-svg" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- the packages */}
      <section className="bdv-sec">
        <header className="bdv-head bdv-rise">
          <p className="bdv-chip">Packages</p>
          <h2>What Does A Brand Package Deliver?</h2>
          <p>Not every project needs everything. Pick a package and see what is included. The scope is then agreed in the contract.</p>
        </header>
        <div className="bdv-packs bdv-rise" role="tablist" aria-label="Brand packages">
          {PACKAGES.map((p, i) => <button key={p} type="button" role="tab" aria-selected={pack === i} className={pack === i ? "is-on" : ""} onClick={() => setPack(i)}>{p}</button>)}
        </div>
        <table className="bdv-tbl" data-pack={pack}>
          <thead><tr><th>Deliverable</th>{PACKAGES.map((p, i) => <th key={p} className={pack === i ? "is-on" : ""}>{p}</th>)}</tr></thead>
          <tbody>
            {MATRIX.map((r) => (
              <tr key={r[0]}>
                <th scope="row">{r[0]}</th>
                {[1, 2, 3].map((k) => <td key={k} className={`${pack === k - 1 ? "is-on" : ""} ${/^(Add-on|Optional)$/.test(r[k]) ? "is-soft" : ""}`}>{r[k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="bdv-fine bdv-rise">This package structure is a guide. Deliverables and revisions are written clearly in the project scope and contract.</p>
      </section>

      {/* ------------------------------------------------------------- advanced branding belts */}
      <section className="bdv-belts" aria-label="Advanced and specialised branding">
        <header className="bdv-head bdv-rise">
          <p className="bdv-chip">Chapter 12</p>
          <h2>Advanced &amp; Specialised Branding</h2>
          <p>Work that goes well beyond a regular graphic design studio: from employer branding and luxury brands to metaverse identity, motion and sound.</p>
        </header>
        {[belt.slice(0, 12), belt.slice(12)].map((row, r) => (
          <div key={r} className="bdv-belt-wrap">
            <ul className="bdv-belt">{[...row, ...row].map((x, i) => <li key={x + i}>{x}</li>)}</ul>
          </div>
        ))}
      </section>

      {/* ------------------------------------------------------------- industries */}
      {d.industries && (
        <section className="bdv-sec">
          <header className="bdv-head bdv-rise">
            <p className="bdv-chip">Every industry</p>
            <h2>{oneLine(d.industries.heading)}</h2>
            <p>{d.industries.intro}</p>
          </header>
          <ul className="bdv-ind">
            {d.industries.items.map((x, i) => (
              <li key={x.name} className={openInd === i ? "is-on" : ""} onMouseEnter={() => setOpenInd(i)}>
                <button type="button" onClick={() => setOpenInd(i)} onFocus={() => setOpenInd(i)}>
                  <i>{String(i + 1).padStart(2, "0")}</i><b>{x.name}</b><span aria-hidden="true">↗</span>
                </button>
                <p>{x.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ------------------------------------------------------------- why */}
      <section className="bdv-sec">
        <header className="bdv-head bdv-rise">
          <p className="bdv-chip">Why us</p>
          <h2>{oneLine(d.why.heading)}</h2>
        </header>
        <div className="bdv-plates">
          {d.why.items.map((w, i) => (
            <article key={w.title} className="bdv-plate">
              <i className="bdv-c bdv-c-a" /><i className="bdv-c bdv-c-b" /><i className="bdv-c bdv-c-c" /><i className="bdv-c bdv-c-d" />
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{w.title}</h3>
              <p>{w.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- faq */}
      <section className="bdv-sec bdv-faq">
        <header className="bdv-head bdv-head-l bdv-rise">
          <p className="bdv-chip">Questions</p>
          <h2>Brand Development Questions We Often Hear</h2>
        </header>
        <div className="bdv-qs">
          {d.faq.map((f, i) => (
            <div key={f.question} className={`bdv-q ${faqOpen === i ? "is-on" : ""}`}>
              <button type="button" onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} aria-expanded={faqOpen === i}><span>{String(i + 1).padStart(2, "0")}</span>{f.question}<em aria-hidden="true">{faqOpen === i ? "−" : "+"}</em></button>
              <div className="bdv-a"><p>{f.answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- related */}
      <section className="bdv-sec bdv-rel">
        <header className="bdv-head bdv-rise"><p className="bdv-chip">Continue</p><h2>Related Services</h2></header>
        <ul>
          {d.related.map((r, i) => (
            <li key={r.href}><SmartLink href={r.href}><i>{String(i + 1).padStart(2, "0")}</i><b>{oneLine(r.title)}</b><span>{r.description}</span><em aria-hidden="true">→</em></SmartLink></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
