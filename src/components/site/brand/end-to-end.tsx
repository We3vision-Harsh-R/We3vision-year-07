"use client";

import { useEffect, useRef, useState } from "react";
import { SmartLink } from "../smart-link";
import type { TechData } from "../tech/data";
import { E2E_AUDIENCE, E2E_ECOSYSTEM, E2E_JOURNEY, E2E_OPTIONAL, E2E_PROCESS, E2E_SCOPE, E2E_STAGES_HERO, E2E_STANDARD, E2E_WHY } from "./end-to-end-data";

// END-TO-END BRAND DEVELOPMENT page ("e2e-"). The concept is a number line from 0 to N: a ruler runs through the page, every section is a mark on it, and the
// hero shows a brand being built step by step. Pure CSS motion plus one IntersectionObserver (things appear when they come into view). Laptop and desktop only.

const GROW = ["Idea", "Strategy", "Name", "Identity", "Digital", "Launch"];

export function E2EPage({ d }: { d: TechData }) {
  const root = useRef<HTMLDivElement>(null);
  const prRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const [faq, setFaq] = useState(0);
  const [step, setStep] = useState(0);
  const [lit, setLit] = useState(0);
  const heading = d.hero.heading.split("\n");

  // the hero ruler grows through six marks, again and again
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (GROW.length + 2)), 1300);
    return () => clearInterval(t);
  }, []);

  // things appear when they come into view; the process steps light up one by one
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    el.querySelectorAll(".e2e-rv").forEach((n) => io.observe(n));
    // scroll progress (0..1 over the ruler) goes into a CSS variable; one passive listener, one write per frame
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const start = window.innerHeight; // the ruler starts under the hero
        const total = r.height - start;
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - (r.top + start)) / Math.max(1, total)));
        el.style.setProperty("--p", p.toFixed(4));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const so = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.classList.toggle("is-act", e.isIntersecting)),
      { rootMargin: "-30% 0px -55% 0px" },
    );
    el.querySelectorAll(".e2e-sec").forEach((n) => so.observe(n));
    const steps: HTMLElement[] = [];
    // the process section stays on screen until every step has lit up
    const pr = prRef.current;
    let praf = 0;
    const onPin = () => {
      if (praf || !pr) return;
      praf = requestAnimationFrame(() => {
        praf = 0;
        const r = pr.getBoundingClientRect();
        const p = Math.min(0.9999, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        setLit(Math.floor(p * E2E_PROCESS.length) + 1);
      });
    };
    window.addEventListener("scroll", onPin, { passive: true });
    onPin();
    const po = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setLit((l) => Math.max(l, Number((e.target as HTMLElement).dataset.i) + 1)); }),
      { threshold: 0.6 },
    );
    steps.forEach((n) => po.observe(n));
    return () => { io.disconnect(); po.disconnect(); so.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("scroll", onPin); if (praf) cancelAnimationFrame(praf); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const cur = E2E_SCOPE[tab];

  return (
    <div className="e2e" ref={root}>
      <div className="e2e-ruler" aria-hidden="true"><i className="e2e-ruler-fill" /><b className="e2e-ruler-dot" /></div>

      {/* ------------------------------------------------------------------ 01 hero */}
      <section className="e2e-hero">
        <div className="e2e-hero-l">
          <p className="e2e-chip">End-to-End Brand Development</p>
          <h1 className="e2e-h1">{heading.map((l, i) => <span key={i}>{l}</span>)}</h1>
          <p className="e2e-sub">Complete Brand Development by We3vision Private Limited</p>
          <p className="e2e-lead">{d.hero.text}</p>
          <ul className="e2e-tags">{E2E_STAGES_HERO.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="e2e-cta">
            <SmartLink href="#contact" className="e2e-btn">Start Your Brand Journey</SmartLink>
            <SmartLink href="/portfolio" className="e2e-btn e2e-btn-g">Explore Our Work</SmartLink>
          </div>
        </div>
        <div className="e2e-hero-r" role="img" aria-label="A brand grows from zero to N: idea, strategy, name, identity, digital and launch">
          <div className="e2e-board">
            <div className="e2e-board-top"><b>0</b><i /><b>N</b></div>
            <ol className="e2e-grow">
              {GROW.map((g, i) => (
                <li key={g} className={step > i ? "is-on" : ""} style={{ "--i": i } as React.CSSProperties}>
                  <span className="e2e-grow-dot" /><span className="e2e-grow-t">{g}</span>
                  <span className="e2e-grow-bar" style={{ "--w": `${42 + ((i * 17) % 50)}%` } as React.CSSProperties} />
                </li>
              ))}
            </ol>
            <p className="e2e-board-cap">{step === 0 ? "Zero. Just an idea." : step <= GROW.length ? GROW[step - 1] : "A brand that leads."}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ 02 overview */}
      <section className="e2e-sec e2e-ov">
        <p className="e2e-mark">02</p>
        <h2 className="e2e-h2 e2e-rv">More Than a Logo.<br />A Complete Brand.</h2>
        <div className="e2e-ov-r e2e-rv">
          <p>A successful brand is built through strategy, creativity and consistency. We bring every essential branding discipline together to help businesses move from an initial idea to a complete brand identity ready for the real world.</p>
          <p>From defining your brand&apos;s position to designing its identity and preparing it for launch, we create a connected system that helps your business communicate with clarity and confidence.</p>
          <ul className="e2e-pills"><li>Strategy</li><li>Creativity</li><li>Consistency</li></ul>
        </div>
      </section>

      {/* ------------------------------------------------------------------ 03 journey */}
      <section className="e2e-sec">
        <p className="e2e-mark">03</p>
        <h2 className="e2e-h2 e2e-rv">One Journey.<br />Every Branding Need.</h2>
        <ol className="e2e-jr e2e-rv">
          {E2E_JOURNEY.map((j, i) => (
            <li key={j.n} className="e2e-rv" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <span className="e2e-jr-n">{j.n}</span>
              <h3>{j.t}</h3>
              <p>{j.d}</p>
            </li>
          ))}
        </ol>
        <p className="e2e-note e2e-rv">The actual workflow depends on the agreed scope. Not every engagement needs every deliverable.</p>
      </section>

      {/* ------------------------------------------------------------------ 04 scope */}
      <section className="e2e-sec">
        <p className="e2e-mark">04</p>
        <h2 className="e2e-h2 e2e-rv">Everything<br />Your Brand Needs.</h2>
        <div className="e2e-scope e2e-rv">
          <div className="e2e-tabs" role="tablist" aria-label="Brand development scope" aria-orientation="vertical">
            {E2E_SCOPE.map((s, i) => (
              <button key={s.k} type="button" role="tab" id={`e2e-tab-${i}`} aria-selected={tab === i} aria-controls="e2e-panel" tabIndex={tab === i ? 0 : -1}
                className={tab === i ? "is-on" : ""} onClick={() => setTab(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setTab((tab + 1) % E2E_SCOPE.length); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setTab((tab + E2E_SCOPE.length - 1) % E2E_SCOPE.length); }
                }}>
                <b>{s.k}</b><span>{s.t}</span>
              </button>
            ))}
          </div>
          <div className="e2e-panel" role="tabpanel" id="e2e-panel" aria-labelledby={`e2e-tab-${tab}`} key={cur.k}>
            <p className="e2e-panel-k">{cur.k} / K</p>
            <h3>{cur.t}</h3>
            <ul>{cur.items.map((x, i) => <li key={x} style={{ "--i": i } as React.CSSProperties}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ 05 ecosystem */}
      <section className="e2e-sec">
        <p className="e2e-mark">05</p>
        <h2 className="e2e-h2 e2e-rv">Your Complete<br />Branding Ecosystem.</h2>
        <div className="e2e-eco">
          {E2E_ECOSYSTEM.map((c, i) => (
            <SmartLink key={c.t} href={c.href} className="e2e-eco-c e2e-rv" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <span className="e2e-eco-i">{String(i + 1).padStart(2, "0")}</span>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
              <em>View service →</em>
            </SmartLink>
          ))}
        </div>
        <p className="e2e-note e2e-rv">These services work together as part of one complete branding engagement, with individual services available where appropriate.</p>
      </section>

      {/* ------------------------------------------------------------------ 06 process */}
      <section className="e2e-sec e2e-pr" ref={prRef} style={{ height: `calc(100vh + ${E2E_PROCESS.length * 42}vh)` }}>
        <div className="e2e-pr-in">
        <div className="e2e-pr-l">
          <p className="e2e-mark">06</p>
          <h2 className="e2e-h2">From First Idea<br />to Final Brand.</h2>
          <p className="e2e-note">Approvals, timelines and revisions are managed according to the project agreement.</p>
        </div>
        <ol className="e2e-pr-r" style={{ "--lit": lit / E2E_PROCESS.length } as React.CSSProperties}>
          {E2E_PROCESS.map((p, i) => (
            <li key={p} className={`e2e-ps ${lit > i ? "is-lit" : ""}`} data-i={i}>
              <span className="e2e-ps-n">{i + 1}</span>
              <span className="e2e-ps-t">{p}</span>
            </li>
          ))}
        </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------------ 07 deliverables */}
      <section className="e2e-sec">
        <p className="e2e-mark">07</p>
        <h2 className="e2e-h2 e2e-rv">Everything Organized.<br />Everything Ready.</h2>
        <p className="e2e-lead2 e2e-rv">Depending on the agreed scope, your brand handover can include the items below.</p>
        <div className="e2e-del">
          <div className="e2e-del-c e2e-rv">
            <h3>Standard deliverables</h3>
            <ul>{E2E_STANDARD.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="e2e-del-c is-opt e2e-rv" style={{ "--d": "90ms" } as React.CSSProperties}>
            <h3>Optional or separately quoted</h3>
            <ul>{E2E_OPTIONAL.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ 08 audience */}
      <section className="e2e-sec">
        <p className="e2e-mark">08</p>
        <h2 className="e2e-h2 e2e-rv">Built for Businesses<br />at Every Stage.</h2>
        <ul className="e2e-aud">
          {E2E_AUDIENCE.map((a, i) => (
            <li key={a} className="e2e-rv" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <span className="e2e-aud-n">{i === 0 ? "0" : i === E2E_AUDIENCE.length - 1 ? "N" : i}</span>
              {a}
            </li>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------------ 09 why */}
      <section className="e2e-sec">
        <p className="e2e-mark">09</p>
        <h2 className="e2e-h2 e2e-rv">Strategy Meets Design<br />Meets Technology.</h2>
        <p className="e2e-lead2 e2e-rv">At We3vision, branding goes beyond static visuals. Our capabilities across design, web and app development, 3D animation, motion graphics and immersive experiences allow us to build brand identities that work across print, digital and emerging platforms.</p>
        <ul className="e2e-why">
          {E2E_WHY.map((w, i) => <li key={w} className="e2e-rv" style={{ "--d": `${i * 60}ms` } as React.CSSProperties}><span>{String(i + 1).padStart(2, "0")}</span>{w}</li>)}
        </ul>
        <p className="e2e-note e2e-rv">One creative partner, a connected brand experience: your identity stays consistent across every touchpoint where customers discover and remember your business.</p>
      </section>

      {/* ------------------------------------------------------------------ 10 portfolio */}
      <section className="e2e-sec">
        <p className="e2e-mark">10</p>
        <h2 className="e2e-h2 e2e-rv">Ideas Turned Into<br />Brand Experiences.</h2>
        <div className="e2e-port e2e-rv">
          <p>Explore selected brand identities, visual systems, digital experiences and creative projects developed by We3vision. Branding case studies will be added here as approved client work becomes available.</p>
          <SmartLink href="/portfolio" className="e2e-btn">See our portfolio</SmartLink>
        </div>
      </section>

      {/* ------------------------------------------------------------------ 11 faq */}
      <section className="e2e-sec e2e-faq">
        <p className="e2e-mark">11</p>
        <h2 className="e2e-h2 e2e-rv">Frequently Asked<br />Questions.</h2>
        <div className="e2e-qs">
          {d.faq.map((f, i) => (
            <div key={f.question} className={`e2e-q ${faq === i ? "is-on" : ""}`}>
              <button type="button" aria-expanded={faq === i} aria-controls={`e2e-a-${i}`} onClick={() => setFaq(faq === i ? -1 : i)}>
                <span>{f.question}</span><em aria-hidden="true">{faq === i ? "−" : "+"}</em>
              </button>
              <div className="e2e-a" id={`e2e-a-${i}`} role="region"><div><p>{f.answer}</p></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ 12 final cta (the contact form is below) */}
      <section className="e2e-sec e2e-end">
        <p className="e2e-mark">12</p>
        <h2 className="e2e-h2 e2e-end-h">Your Vision.<br />One Complete Brand.</h2>
        <p className="e2e-lead2">Whether you&apos;re starting from scratch or evolving an established business, let&apos;s build a brand that reflects your vision and is ready for what&apos;s next.</p>
        <SmartLink href="#contact" className="e2e-btn">Let&apos;s Build Your Brand</SmartLink>
        <p className="e2e-note">Tell us about your business, your goals and the brand you want to create.</p>
      </section>
    </div>
  );
}
