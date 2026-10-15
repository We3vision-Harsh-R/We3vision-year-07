"use client";

import { useRef, useState } from "react";
import type { TechData } from "../tech/data";
import { Btn, EndCta, Faq, Note, Sec, Tabs, useMkt, v } from "./kit";
import { PHY_COLLATERAL, PHY_CONNECT, PHY_CONNECT_NOTE, PHY_DELIVERABLES, PHY_EVENT, PHY_FAQ, PHY_FLOW, PHY_FORMATS, PHY_JOURNEY, PHY_MEDIA, PHY_OUTDOOR, PHY_OUTDOOR_POINTS } from "./physical-data";

// PHYSICAL MARKETING page ("phy-"): a Physical Campaign Canvas. One set of original SVG pieces (billboard, poster, brochure ... box, card) is used in the hero
// canvas, the journey and the collateral studio. The page also has a media selector, a readability-by-distance slider, an event map and an offline-to-online
// connector. Every sample uses a made-up "Your Brand"; nothing is a real client project, location or price.

/** a small, original drawing of each material; classes give the theme colours */
function Piece({ k }: { k: string }) {
  const logo = (x: number, y: number, r = 9) => <circle className="phy-p1" cx={x} cy={y} r={r} />;
  const bars = (x: number, y: number, w: number, n = 3, gap = 12) => Array.from({ length: n }, (_, i) => <rect key={i} className="phy-p3" x={x} y={y + i * gap} width={w - i * (w / 5)} height="6" rx="3" />);
  switch (k) {
    case "billboard": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="188" y="150" width="10" height="90" /><rect className="phy-d" x="256" y="150" width="10" height="90" /><rect className="phy-bg" x="40" y="30" width="320" height="130" rx="8" /><rect className="phy-p2" x="52" y="42" width="296" height="106" rx="4" />{logo(86, 72, 13)}<rect className="phy-w" x="112" y="62" width="150" height="14" rx="3" /><rect className="phy-p3" x="112" y="86" width="120" height="8" rx="3" /><rect className="phy-p1" x="262" y="108" width="72" height="26" rx="13" /><rect className="phy-d" x="20" y="238" width="360" height="6" rx="3" /></svg>);
    case "poster": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="40" y="236" width="320" height="6" rx="3" /><rect className="phy-bg" x="130" y="18" width="140" height="210" rx="6" /><rect className="phy-p2" x="142" y="30" width="116" height="100" rx="4" /><circle className="phy-p1" cx="200" cy="80" r="30" />{logo(156, 46, 6)}<rect className="phy-w" x="146" y="144" width="108" height="12" rx="3" />{bars(146, 166, 86, 3, 12)}<rect className="phy-p1" x="146" y="204" width="50" height="14" rx="7" /></svg>);
    case "brochure": return (<svg viewBox="0 0 400 260" aria-hidden="true">{[0, 1, 2].map((i) => (<g key={i}><rect className={i === 1 ? "phy-p2" : "phy-bg"} x={36 + i * 112} y="40" width="108" height="180" rx="4" /></g>))}{logo(90, 80, 14)}<rect className="phy-w" x="56" y="110" width="68" height="12" rx="3" />{bars(56, 134, 64, 3, 12)}<rect className="phy-p1" x="152" y="56" width="68" height="60" rx="4" />{bars(152, 132, 66, 4, 12)}<rect className="phy-p1" x="264" y="56" width="68" height="40" rx="4" />{bars(264, 112, 66, 3, 12)}<rect className="phy-w" x="264" y="168" width="64" height="16" rx="8" /></svg>);
    case "catalogue": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="96" y="28" width="206" height="208" rx="4" /><rect className="phy-bg" x="104" y="20" width="200" height="208" rx="4" /><rect className="phy-p2" x="114" y="30" width="180" height="44" rx="3" />{logo(138, 52, 10)}<rect className="phy-w" x="158" y="46" width="100" height="12" rx="3" />{[0, 1, 2, 3].map((i) => (<g key={i}><rect className="phy-p3" x={118 + (i % 2) * 88} y={88 + Math.floor(i / 2) * 68} width="78" height="52" rx="3" /><circle className="phy-p1" cx={157 + (i % 2) * 88} cy={110 + Math.floor(i / 2) * 68} r="14" /></g>))}</svg>);
    case "retail": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="40" y="240" width="320" height="6" rx="3" /><rect className="phy-bg" x="110" y="16" width="180" height="224" rx="6" /><rect className="phy-p1" x="110" y="16" width="180" height="40" rx="6" />{logo(136, 36, 9)}<rect className="phy-w" x="154" y="30" width="100" height="12" rx="3" />{[0, 1, 2].map((r) => (<g key={r}><rect className="phy-p3" x="122" y={96 + r * 48} width="156" height="5" rx="2" />{[0, 1, 2].map((c) => (<rect key={c} className="phy-p2" x={128 + c * 50} y={66 + r * 48} width="38" height="30" rx="4" />))}</g>))}</svg>);
    case "backdrop": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="20" y="238" width="360" height="6" rx="3" /><rect className="phy-bg" x="30" y="24" width="340" height="190" rx="6" />{[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => (<circle key={r + "-" + c} className={(r + c) % 2 ? "phy-p1" : "phy-p3"} cx={64 + c * 68} cy={52 + r * 40} r="8" />)))}<rect className="phy-p2" x="164" y="176" width="72" height="62" rx="4" /></svg>);
    case "stand": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="20" y="238" width="360" height="6" rx="3" /><rect className="phy-bg" x="60" y="40" width="280" height="150" rx="4" /><rect className="phy-p2" x="72" y="52" width="256" height="70" rx="3" />{logo(104, 87, 14)}<rect className="phy-w" x="132" y="76" width="120" height="14" rx="3" /><rect className="phy-p3" x="132" y="98" width="90" height="8" rx="3" /><rect className="phy-p1" x="116" y="174" width="168" height="48" rx="6" /><rect className="phy-w" x="136" y="190" width="70" height="8" rx="3" /><path className="phy-ln" d="M130 40V16M270 40V16M130 16h140" /></svg>);
    case "merch": return (<svg viewBox="0 0 400 260" aria-hidden="true"><path className="phy-ln" d="M84 92Q84 40 128 40Q172 40 172 92" /><rect className="phy-p2" x="60" y="84" width="136" height="148" rx="8" />{logo(128, 150, 24)}<rect className="phy-w" x="96" y="190" width="64" height="9" rx="3" /><rect className="phy-bg" x="232" y="134" width="84" height="98" rx="10" /><path className="phy-ln" d="M316 158h18q16 0 16 22t-16 22h-18" /><circle className="phy-p1" cx="274" cy="182" r="16" /><rect className="phy-p3" x="244" y="146" width="60" height="6" rx="3" /></svg>);
    case "flyer": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="124" y="26" width="164" height="212" rx="4" /><rect className="phy-bg" x="116" y="18" width="164" height="212" rx="4" /><rect className="phy-p1" x="126" y="28" width="144" height="76" rx="3" />{logo(150, 54, 10)}<rect className="phy-w" x="170" y="48" width="86" height="12" rx="3" /><rect className="phy-w" x="130" y="118" width="130" height="14" rx="3" />{bars(130, 142, 110, 3, 12)}<rect className="phy-p1" x="130" y="190" width="70" height="20" rx="10" /></svg>);
    case "card": return (<svg viewBox="0 0 400 260" aria-hidden="true"><rect className="phy-d" x="60" y="64" width="220" height="130" rx="8" transform="rotate(-6 170 130)" /><rect className="phy-p1" x="76" y="50" width="220" height="130" rx="8" transform="rotate(-6 186 115)" />{logo(124, 96, 14)}<rect className="phy-bg" x="104" y="140" width="64" height="12" rx="3" transform="rotate(-6 136 146)" /><rect className="phy-bg" x="110" y="104" width="130" height="14" rx="3" transform="rotate(-6 175 111)" opacity="0" /><rect className="phy-bg" x="150" y="78" width="70" height="8" rx="3" transform="rotate(-6 185 82)" /><rect className="phy-bg" x="150" y="96" width="50" height="8" rx="3" transform="rotate(-6 175 100)" /></svg>);
    case "box": return (<svg viewBox="0 0 400 260" aria-hidden="true"><path className="phy-p2" d="M120 80l80-34 80 34v100l-80 34-80-34z" /><path className="phy-p1" d="M200 114l80-34v100l-80 34z" /><path className="phy-bg" d="M120 80l80 34 80-34-80-34z" />{logo(164, 150, 12)}<rect className="phy-w" x="150" y="176" width="40" height="8" rx="3" transform="rotate(14 170 180)" /><rect className="phy-w" x="224" y="124" width="32" height="8" rx="3" transform="rotate(-18 240 128)" opacity=".8" /></svg>);
    default: return null;
  }
}

export function PhysicalPage({ d }: { d: TechData }) {
  void d;
  const root = useRef<HTMLDivElement>(null);
  useMkt(root);
  const [fmt, setFmt] = useState(0);
  const [media, setMedia] = useState(0);
  const [jr, setJr] = useState(0);
  const [col, setCol] = useState(0);
  const [dist, setDist] = useState(1);
  const [zone, setZone] = useState(0);
  const [conn, setConn] = useState(0);
  const [flow, setFlow] = useState(0);
  const f = PHY_FORMATS[fmt];
  const m = PHY_MEDIA[media];
  const j = PHY_JOURNEY[jr];
  const c = PHY_COLLATERAL[col];
  const o = PHY_OUTDOOR[dist];
  const z = PHY_EVENT[zone];
  const cn = PHY_CONNECT[conn];
  const utm = `?utm_source=${cn.url}&utm_medium=${cn.medium}&utm_campaign=spring-launch`;

  return (
    <div className="mkt phy" ref={root}>
      <div className="mkt-ruler" aria-hidden="true"><i /></div>

      {/* ------------------------------------------------------------ hero */}
      <section className="mkt-hero">
        <div className="mkt-hero-l">
          <p className="mkt-chip">Physical Marketing</p>
          <h1 className="mkt-h1"><span>Make Your Brand Impossible</span><span>to Ignore in the Real World.</span></h1>
          <p className="mkt-sub">Physical Marketing That Connects Brands With People.</p>
          <p className="mkt-body">From printed campaigns and outdoor advertising to event branding, retail materials and branded experiences, we help businesses bring their message into the physical world.</p>
          <div className="mkt-cta"><Btn href="#contact">Plan an Offline Campaign</Btn><Btn href="#phy-media" ghost>Explore Physical Marketing</Btn></div>
        </div>
        <div className="mkt-hero-r">
          <div className="phy-canvas" aria-label="Physical Campaign Canvas (concept)">
            <div className="phy-stage" aria-live="polite"><div key={f.k} className="phy-piece"><Piece k={f.k} /></div></div>
            <div className="phy-cap"><b>{f.t}</b><p>{f.use}</p><small>{f.read}</small></div>
            <div className="phy-pick" role="group" aria-label="Choose a format">
              {PHY_FORMATS.map((x, i) => <button key={x.k} type="button" aria-pressed={fmt === i} className={fmt === i ? "is-on" : ""} onClick={() => setFmt(i)}>{x.t}</button>)}
            </div>
            <p className="phy-illus">Concept drawings with a made-up “Your Brand”.</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 02 media selector */}
      <Sec n="02" title={"Choose the Right Way\nto Reach Your Audience."} intro="Six families of physical media. Pick one to see where it helps, what we design for it and what to plan." id="phy-media">
        <div className="phy-media mkt-rv">
          <Tabs items={PHY_MEDIA.map((x, i) => ({ k: String(i + 1), t: x.t }))} value={media} onChange={setMedia} label="Physical media" />
          <div className="mkt-panel" role="tabpanel" key={m.t}>
            <p className="mkt-panel-k">Medium {media + 1} / 6</p>
            <h3>{m.t}</h3>
            <p className="phy-what">{m.what}</p>
            <ul className="mkt-chips">{m.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="phy-cols">
              <div><p className="mkt-label">Where it can be useful</p><p>{m.where}</p></div>
              <div><p className="mkt-label">Creative deliverables</p><ul>{m.deliver.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><p className="mkt-label">Planning considerations</p><ul>{m.plan.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            <p className="mkt-label">Suitable next action</p><p>{m.next}</p>
            <p className="mkt-note-s">We design and plan. Printing, media space and installation come from production and media partners, and depend on the approved scope.</p>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 03 journey */}
      <Sec n="03" title={"Bring Your Brand Into\nYour Customer's World."} id="phy-jr" pin={{ count: 6, onChange: setJr }}>
        <div className="phy-jr mkt-rv">
          <ol className="phy-path" aria-label="Customer touchpoints">
            {PHY_JOURNEY.map((s, i) => (
              <li key={s.t} className={`${jr === i ? "is-on" : ""} ${i < jr ? "is-done" : ""}`}><button type="button" aria-pressed={jr === i} onClick={() => setJr(i)}><b>{i + 1}</b><span>{s.t}</span></button></li>
            ))}
          </ol>
          <div className="phy-jr-b" key={j.t} aria-live="polite">
            <div className="phy-jr-art"><Piece k={j.piece} /></div>
            <div className="phy-jr-t">
              <p className="mkt-panel-k">Stage {jr + 1} / 6</p><h3>{j.t}</h3>
              <p className="mkt-label">Physical touchpoint</p><p>{j.touch}</p>
              <p className="mkt-label">Its role in the journey</p><p>{j.role}</p>
              <p className="mkt-label">How engagement may be measured</p><p>{j.measure}</p>
            </div>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 04 collateral studio */}
      <Sec n="04" title={"Every Physical Detail\nShould Feel Like Your Brand."} intro="The same colours, type and message across seven materials. Switch to see how the layout adapts. The brand is a sample." id="phy-col">
        <div className="phy-col mkt-rv">
          <div className="phy-seg" role="group" aria-label="Material">
            {PHY_COLLATERAL.map((x, i) => <button key={x.k} type="button" aria-pressed={col === i} className={col === i ? "is-on" : ""} onClick={() => setCol(i)}>{x.t}</button>)}
          </div>
          <div className="phy-col-b" aria-live="polite">
            <div key={c.k} className="phy-col-art"><Piece k={c.k} /></div>
            <div className="phy-col-t"><h3>{c.t}</h3><p>{c.note}</p><ul className="mkt-chips"><li>Typography</li><li>Colour</li><li>Layout</li><li>Messaging</li></ul><p className="mkt-note-s">A concept sample, not a completed client project.</p></div>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 05 outdoor */}
      <Sec n="05" title={"Put Your Message\nWhere It Matters."} intro="Slide the viewing distance. The longer the distance, the shorter the message has to be." id="phy-out">
        <div className="phy-out mkt-rv">
          <div className="phy-sign" style={v({ "--b": dist * 1.6, "--s": 1 + dist * 0.12 })} aria-hidden="true">
            <svg viewBox="0 0 400 200"><rect className="phy-p2" x="10" y="10" width="380" height="180" rx="10" /><circle className="phy-p1" cx="60" cy="60" r="22" /><text className="phy-hl" x="100" y="72">Open this Friday</text><g className="phy-small"><text x="30" y="118">New showroom · 12 Market Road</text><text x="30" y="144">Mon–Sat, 10 am – 8 pm · Free parking</text><text x="30" y="170">yourbrand.example/visit</text></g><rect className="phy-p1" x="296" y="130" width="70" height="46" rx="6" /></svg>
          </div>
          <div className="phy-out-c">
            <label className="mta-field"><span>Viewing distance</span><b>{o.t}</b><input type="range" min={0} max={3} step={1} value={dist} onChange={(e) => setDist(Number(e.target.value))} aria-label="Viewing distance" /></label>
            <p className="phy-out-g" aria-live="polite">{o.g}</p>
            <ul className="phy-out-l">{PHY_OUTDOOR_POINTS.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <Note>This is a conceptual illustration. We show no real locations, availability or rates, because we do not hold outdoor media inventory.</Note>
      </Sec>

      {/* ------------------------------------------------------------ 06 event map */}
      <Sec n="06" title={"Turn Brand Moments\nInto Brand Memories."} intro="A conceptual event layout, not a real venue plan. Choose a zone to see how branding connects it." id="phy-evt" pin={{ count: 5, onChange: setZone }}>
        <div className="phy-evt mkt-rv">
          <svg viewBox="0 0 560 300" className="phy-map" role="group" aria-label="Conceptual event layout">
            <rect className="phy-hall" x="10" y="10" width="540" height="280" rx="14" />
            <path className="phy-walk" d="M60 150H500" />
            {PHY_EVENT.map((e, i) => {
              const x = 62 + i * 109;
              return (
                <g key={e.t} className={`phy-zone ${zone === i ? "is-on" : ""}`} tabIndex={0} role="button" aria-pressed={zone === i} aria-label={e.t} onClick={() => setZone(i)} onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); setZone(i); } }}>
                  <rect x={x - 46} y={i % 2 ? 160 : 70} width="92" height="68" rx="10" />
                  <circle cx={x} cy="150" r="9" className="phy-dot" />
                  <text x={x} y={i % 2 ? 200 : 110} textAnchor="middle">{i + 1}</text>
                  <text x={x} y={i % 2 ? 222 : 130} textAnchor="middle" className="phy-zt">{e.t.split(" ")[0]}</text>
                </g>
              );
            })}
          </svg>
          <div className="mkt-panel" key={z.t}><p className="mkt-panel-k">Zone {zone + 1} / 5</p><h3>{z.t}</h3><p>{z.d}</p><ul className="mkt-chips">{z.items.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="mkt-label">Also in scope</p><p>Event identity, booth and stall design, stage backdrops, product display systems, promotional merchandise and digital follow-up.</p></div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 07 connector */}
      <Sec n="07" title={"Connect Physical Marketing\nWith Digital Action."} intro="Choose a physical format to see the digital step that can follow it." id="phy-con">
        <div className="phy-con mkt-rv">
          <div className="phy-seg" role="group" aria-label="Physical format">
            {PHY_CONNECT.map((x, i) => <button key={x.k} type="button" aria-pressed={conn === i} className={conn === i ? "is-on" : ""} onClick={() => setConn(i)}>{x.k}</button>)}
          </div>
          <ol className="phy-chain" key={cn.k} aria-live="polite">
            {[["Physical ad", cn.k], ["QR code or short URL", cn.step], ["Landing page", cn.page], ["Inquiry or conversion", cn.conv], ["Measurement", cn.measure]].map(([t, x], i) => (
              <li key={t} style={v({ "--i": i })}><small>{i + 1}</small><b>{t}</b><span>{x}</span></li>
            ))}
          </ol>
          <div className="phy-utm"><p className="mkt-label">Example campaign tag</p><code>yourbrand.example/{cn.url}{utm}</code></div>
        </div>
        <Note>{PHY_CONNECT_NOTE}</Note>
      </Sec>

      {/* ------------------------------------------------------------ 08 workflow */}
      <Sec n="08" title={"From Concept to\nReal-World Execution."} intro="Each stage shows who delivers it. Some stages need outside production or media partners." id="phy-flow" pin={{ count: 8, onChange: setFlow }}>
        <ol className="phy-flow mkt-rv">
          {PHY_FLOW.map((s, i) => (
            <li key={s.t} className={`${flow === i ? "is-on" : ""} ${s.by !== "We3vision" ? "is-ext" : ""}`}>
              <button type="button" aria-expanded={flow === i} onClick={() => setFlow(flow === i ? -1 : i)}><b>{i + 1}</b><span>{s.t}</span><em>{s.by}</em></button>
              <div className="phy-flow-b"><div><p>{s.d}</p></div></div>
            </li>
          ))}
        </ol>
      </Sec>

      {/* ------------------------------------------------------------ 09 deliverables */}
      <Sec n="09" title={"What You Receive."} intro="Depending on the approved scope. Physical production, printing, shipping, media placement and installation depend on the scope and on vendor arrangements." id="phy-del">
        <ul className="phy-del mkt-rv">{PHY_DELIVERABLES.map((x, i) => <li key={x}><b>{String(i + 1).padStart(2, "0")}</b>{x}</li>)}</ul>
      </Sec>

      {/* ------------------------------------------------------------ 10 portfolio */}
      <Sec n="10" title={"Designed for\nthe Real World."} id="phy-ev">
        <div className="phy-ev mkt-rv"><p>We show real print, outdoor and event projects only with the client&apos;s approval. None are listed here yet. The drawings on this page are labelled concepts, and we never publish made-up locations, attendance, reach or sales results.</p><Btn href="/portfolio" ghost>See our portfolio</Btn></div>
      </Sec>

      <Sec n="11" title={"Frequently Asked\nQuestions."} id="phy-faq"><div className="mkt-rv"><Faq items={PHY_FAQ} /></div></Sec>

      <EndCta n="12" title={"Let's Take Your Brand\nBeyond the Screen."} text="Tell us about your audience, campaign goals and the physical touchpoints you want to create. We'll help you shape a campaign that connects your brand with people in the real world." button="Plan Your Physical Campaign" />
    </div>
  );
}
