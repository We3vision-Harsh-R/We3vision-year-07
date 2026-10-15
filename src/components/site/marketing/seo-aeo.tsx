"use client";

import { useEffect, useRef, useState } from "react";
import type { TechData } from "../tech/data";
import { KeywordFinder } from "./keyword-puzzle";
import { Btn, EndCta, Faq, Note, Sec, Tabs, useMkt, v } from "./kit";
import { SXO_AUDIT, SXO_AUDIT_FIELDS, SXO_FAQ, SXO_FLOW, SXO_JOURNEY, SXO_METRICS, SXO_MODES, SXO_NODES, SXO_SERVICES, SXO_SHARED } from "./seo-data";

// SEO / AEO page ("sxo-"): a Search Visibility Lab. The hero is a diagram of how a website connects to search; then a two-mode comparison (SEO / AEO), an
// audit explorer, the service groups, a search-intent journey, a workflow, and how progress is measured. All examples are illustrations, no real data.

// the five nodes sit on a ring around the website (percent of a square, radius 38)
const POS = [-90, -18, 54, 126, 198].map((a) => [Math.round((50 + 38 * Math.cos((a * Math.PI) / 180)) * 100) / 100, Math.round((50 + 38 * Math.sin((a * Math.PI) / 180)) * 100) / 100]);
const SXO_SHORT = ["Discover", "Audit", "Research", "Strategy", "Implement", "Monitor", "Improve"];
const QUERIES = ["best accounting software for small business", "how do I choose a web agency in Surat?", "what is answer engine optimization?"];
const PILLARS = [["Be found", "Pages that search engines can reach and index"], ["Be understood", "Clear content and structure for people and machines"], ["Be chosen", "Useful answers that earn the click"]];

export function SeoAeoPage({ d }: { d: TechData }) {
  void d;
  const root = useRef<HTMLDivElement>(null);
  useMkt(root);
  const [node, setNode] = useState(0);
  const [qi, setQi] = useState(0);
  const [auto, setAuto] = useState(true);
  const jrRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setInterval(() => setQi((q) => (q + 1) % QUERIES.length), 4200);
    return () => clearInterval(t);
  }, []);
  const [mode, setMode] = useState(0);
  const [audit, setAudit] = useState(0);
  const [svc, setSvc] = useState(0);
  const [stage, setStage] = useState(0);
  const [flow, setFlow] = useState(0);
  useEffect(() => {
    const el = jrRef.current;
    if (!el || !auto) return;
    let seen = false;
    const io = new IntersectionObserver((es) => { seen = es[0].isIntersecting; }, { threshold: 0.5 });
    io.observe(el);
    const t = setInterval(() => { if (seen) setStage((x) => (x + 1) % SXO_JOURNEY.length); }, 3600);
    return () => { clearInterval(t); io.disconnect(); };
  }, [auto]);
  const m = SXO_MODES[mode];
  const a = SXO_AUDIT[audit];
  const j = SXO_JOURNEY[stage];

  return (
    <div className="mkt sxo" ref={root}>
      <div className="mkt-ruler" aria-hidden="true"><i /></div>

      {/* ------------------------------------------------------------ hero */}
      <section className="mkt-hero">
        <div className="mkt-hero-l">
          <p className="mkt-chip">SEO &amp; AEO</p>
          <h1 className="mkt-h1"><span>Be Found Where</span><span>Your Customers Search.</span></h1>
          <p className="mkt-sub">SEO &amp; AEO That Connect Visibility With Growth.</p>
          <div className="sxo-bar" aria-hidden="true"><i /><span key={qi} className="sxo-type">{QUERIES[qi]}</span><u /></div>
          <p className="mkt-body">Build a stronger search presence through technical SEO, useful content, keyword strategy and answer-focused optimization. We help businesses improve how their websites are discovered, understood and presented across relevant search experiences.</p>
          <div className="mkt-cta"><Btn href="#contact">Request an SEO Audit</Btn><Btn href="#sxo-audit" ghost>Explore Our SEO Approach</Btn></div>
          <ul className="sxo-pil">{PILLARS.map(([t, d], i) => <li key={t}><b>{i + 1}</b><span><strong>{t}</strong>{d}</span></li>)}</ul>
        </div>
      </section>

        <div className="sxo-labband">
          <div className="sxo-stage">
            <div className="sxo-orb" role="group" aria-label="Search Visibility Lab: a website connected to search engines, queries, content, structured information and AI answers">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <g className="sxo-ring sxo-ring-a"><circle cx="50" cy="50" r="38" /></g>
                <g className="sxo-ring sxo-ring-b"><circle cx="50" cy="50" r="25" /></g>
                <g className="sxo-ring sxo-ring-c"><circle cx="50" cy="50" r="13" /></g>
                {POS.map(([x, y], i) => (
                  <g key={i}>
                    <line className={`sxo-link ${node === i ? "is-on" : ""}`} x1="50" y1="50" x2={x} y2={y} />
                    <circle className="sxo-dot" r="0.9"><animateMotion dur={`${3 + i * 0.4}s`} repeatCount="indefinite" path={`M50 50 L${x} ${y}`} /></circle>
                  </g>
                ))}
              </svg>
              <div className="sxo-core"><b>Your</b><b>website</b></div>
              {SXO_NODES.map((n, i) => (
                <button key={n.k} type="button" className={`sxo-node ${node === i ? "is-on" : ""}`} style={{ left: `${POS[i][0]}%`, top: `${POS[i][1]}%` }} aria-pressed={node === i}
                  onClick={() => setNode(i)} onMouseEnter={() => setNode(i)} onFocus={() => setNode(i)}><i>{i + 1}</i>{n.t}</button>
              ))}
            </div>
            <div className="sxo-cap" aria-live="polite" key={node}><b>{SXO_NODES[node].t}</b><p>{SXO_NODES[node].d}</p></div>
            <p className="sxo-illus">Illustration of how the parts connect. It is not live data.</p>
          </div>
        </div>

      {/* ------------------------------------------------------------ 02 landscape */}
      <Sec n="02" title={"Search Is Evolving.\nYour Visibility Strategy Should Too."} intro="Two ways of looking at the same goal: being found, and being understood well enough to be useful." id="sxo-land" q="seo vs aeo: what is the difference">
        <div className="sxo-mode mkt-rv">
          <div className="sxo-switch" role="tablist" aria-label="Choose SEO or AEO">
            {SXO_MODES.map((x, i) => (
              <button key={x.k} type="button" role="tab" aria-selected={mode === i} className={mode === i ? "is-on" : ""} onClick={() => setMode(i)}><b>{x.k}</b>{x.t}</button>
            ))}
          </div>
          <div className="sxo-mode-body" key={m.k}>
            <div className="sxo-mode-l">
              <p className="mkt-label">What it is</p>
              <p className="sxo-def">{m.def}</p>
              <p className="mkt-label">Typical optimization methods</p>
              <ul className="mkt-chips">{m.methods.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="sxo-mode-r">
              <p className="mkt-label">Example query</p>
              <div className="sxo-query"><i aria-hidden="true" />{m.query}</div>
              <p className="sxo-shape">{m.shape}</p>
              <div className={`sxo-result ${m.k === "AEO" ? "is-ans" : ""}`}>
                <b>{m.sample.title}</b><small>{m.sample.url}</small><p>{m.sample.text}</p>
                <span>Concept example</span>
              </div>
            </div>
          </div>
          <div className="sxo-overlap">
            <p className="mkt-label">Where they overlap</p>
            <ul>{SXO_SHARED.map((x) => <li key={x}>{x}</li>)}</ul>
            <p>SEO and AEO are not separate disciplines. The same helpful, well-structured page serves both.</p>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 03 keyword finder */}
      <Sec n="03" q="how do i find keywords for my website" title={"Find the Keywords\nYour Customers Use."} intro="A small puzzle. Type your website, tell us the kind of business and what it sells. The jar fills with keywords. Drag them into the search box to plan your pages." id="sxo-kw">
        <div className="mkt-rv"><KeywordFinder /></div>
      </Sec>

      {/* ------------------------------------------------------------ 03 audit explorer */}
      <Sec n="04" title={"Discover What May Be Holding\nYour Website Back."} intro="Pick an area to see what a professional audit looks at. This is educational: no scores or errors are shown because nothing has been crawled." id="sxo-audit" q="why is my website not showing up in search" pin={{ count: 8, onChange: setAudit }}>
        <div className="sxo-sg mkt-rv">
          <div className="sxo-sg-l">
            <div className="sxo-sg-bar" aria-hidden="true"><i /><span key={a.k} className="sxo-sg-q">{a.t.toLowerCase()} audit</span><u /></div>
            <Tabs items={SXO_AUDIT.map((x) => ({ k: x.k, t: x.t }))} value={audit} onChange={setAudit} label="Audit categories" className="sxo-sug" />
          </div>
          <div className="sxo-sg-r" role="tabpanel" key={a.k}>
            <div className="sxo-ans">
              <small>Featured answer · Audit area {a.k} / 08</small>
              <b>{a.t}</b>
              <p>{a.means}</p>
            </div>
            <div className="sxo-cards">
              {SXO_AUDIT_FIELDS.filter(([f]) => f !== "means").map(([f, label], i) => (
                <div key={f} className={`sxo-card f-${f}`} style={v({ "--i": i })}>
                  <h4><b>{i + 1}</b>{label}</h4>
                  <ul>{(a[f] as string[]).map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="sxo-sg-foot"><span>Educational checklist. Nothing has been crawled, so no scores or errors are shown.</span><Btn href="#contact">Request a Website Audit</Btn></div>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 04 capabilities */}
      <Sec n="05" title={"Build Your Organic\nSearch Foundation."} intro="Seven areas of work. Open one to see what it covers." id="sxo-svc" q="what does an seo service include">
        <div className="sxo-svc mkt-rv">
          {SXO_SERVICES.map((s, i) => (
            <div key={s.t} className={`sxo-svc-r ${svc === i ? "is-on" : ""}`}>
              <button type="button" aria-expanded={svc === i} onClick={() => setSvc(svc === i ? -1 : i)}>
                <span className="sxo-svc-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="sxo-svc-t"><small>we3vision.com › seo › {s.t.toLowerCase().replace(/[^a-z]+/g, "-")}</small><b>{s.t}</b><span>{s.items.slice(0, 3).join(" · ")} …</span></span>
                <em aria-hidden="true">{svc === i ? "−" : "+"}</em>
              </button>
              <div className="sxo-svc-b"><div>
                <ul className="mkt-chips">{s.items.map((x) => <li key={x}>{x}</li>)}</ul>
                {s.note && <p className="mkt-note-s">{s.note}</p>}
              </div></div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 05 journey */}
      <Sec n="06" title={"Turn Search Intent Into Useful\nLanding Experiences."} intro="The same person searches differently at each stage. Watch it play, or choose a stage to see the intent, the content and the page that fits. The examples are illustrative; no search volumes are shown." id="sxo-jr" q="how do customers search before they buy">
        <div className="sxo-jr mkt-rv" ref={jrRef} onMouseEnter={() => setAuto(false)}>
          <ol className="sxo-path" aria-label="Customer search journey" style={v({ "--k": stage, "--n": SXO_JOURNEY.length })}>
            <i className="sxo-path-fill" aria-hidden="true" />
            <i className="sxo-path-token" aria-hidden="true" />
            {SXO_JOURNEY.map((s, i) => (
              <li key={s.t} className={`${stage === i ? "is-on" : ""} ${i < stage ? "is-done" : ""}`}>
                <button type="button" aria-pressed={stage === i} onClick={() => { setAuto(false); setStage(i); }}><b>{i + 1}</b><span>{s.t}</span></button>
              </li>
            ))}
          </ol>
          <div className="sxo-jr-body" key={j.t} aria-live="polite">
            <div><p className="mkt-label">Example user intent</p><p className="sxo-q">{j.intent}</p></div>
            <div><p className="mkt-label">Content format</p><p>{j.format}</p></div>
            <div><p className="mkt-label">Potential target page</p><p>{j.page}</p></div>
            <div><p className="mkt-label">Suitable CTA</p><p className="sxo-cta-s">{j.cta}</p></div>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 06 workflow */}
      <Sec n="07" title={"A Clear Process.\nMeasurable Work."} id="sxo-flow" q="how does an seo project work" pin={{ count: 7, onChange: setFlow }}>
        <div className="sxo-pl mkt-rv" style={v({ "--sk": flow, "--sn": SXO_FLOW.length })}>
          <ol className="sxo-pl-line" aria-label="SEO project stages">
            <i className="sxo-pl-fill" aria-hidden="true" />
            <i className="sxo-pl-bot" aria-hidden="true" />
            {SXO_FLOW.map((st, i) => (
              <li key={st.t} className={`${flow === i ? "is-on" : ""} ${i < flow ? "is-done" : ""}`}>
                <button type="button" aria-pressed={flow === i} onClick={() => setFlow(i)}><b>{i + 1}</b><span>{SXO_SHORT[i]}</span></button>
              </li>
            ))}
          </ol>
          <div className="sxo-pl-card" key={flow} aria-live="polite">
            <div className="sxo-pl-ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="44" className="sxo-pl-arc" style={{ strokeDashoffset: 276.5 * (1 - (flow + 1) / SXO_FLOW.length) }} /></svg><b>{flow + 1}</b><small>of {SXO_FLOW.length}</small></div>
            <h3>{SXO_FLOW[flow].t}</h3>
            <p>{SXO_FLOW[flow].d}</p>
            <p className="sxo-pl-by"><em>You receive</em>{SXO_FLOW[flow].by}</p>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 07 measurement */}
      <Sec n="08" title={"Measure What\nMatters."} intro="When tracking is connected, these are the signals we may follow. Activity is not the same as business results, so we keep them apart. This diagram explains; it is not a performance report." id="sxo-meas" q="how do you measure seo progress">
        <div className="sxo-meas mkt-rv">
          {SXO_METRICS.map((t, i) => (
            <div key={t.tier} className="sxo-tier" style={v({ "--i": i })}>
              <p className="sxo-tier-n">{i + 1}</p>
              <h3>{t.tier}</h3>
              <p className="sxo-tier-s">{t.sub}</p>
              <ul>{t.items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
        <Note>More activity does not always mean more business. We report both, and we say clearly when something cannot be measured.</Note>
      </Sec>

      {/* ------------------------------------------------------------ 08 evidence */}
      <Sec n="09" title={"Strategy Supported\nby Evidence."} id="sxo-ev" q="seo case studies">
        <div className="sxo-ev mkt-rv">
          <p>We show real SEO case studies only with approved client data and verified metrics. None are published on this page yet, and we do not use made-up numbers or conceptual results in their place.</p>
          <ul>
            <li><b>Method first</b>Every recommendation is tied to evidence from your own site and search data.</li>
            <li><b>Plain reporting</b>What changed, what we think caused it, and what we will do next.</li>
            <li><b>No ranking promises</b>We commit to careful work and honest reports.</li>
          </ul>
          <Btn href="/portfolio" ghost>See our portfolio</Btn>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 09 faq */}
      <Sec n="10" title={"Frequently Asked\nQuestions."} id="sxo-faq" q="seo and aeo questions"><div className="mkt-rv"><Faq items={SXO_FAQ} label="People also ask" /></div></Sec>

      {/* ------------------------------------------------------------ 10 cta */}
      <EndCta n="11" title={"Let's Make Your Website\nEasier to Discover."} text="Tell us about your website, your audience and your growth goals. We'll help you identify the right SEO and AEO priorities for your business." button="Discuss Your SEO Strategy" />
    </div>
  );
}
