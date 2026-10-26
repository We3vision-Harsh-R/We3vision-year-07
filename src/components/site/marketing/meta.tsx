"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { GlassSelect } from "../glass-select";
import type { TechData } from "../tech/data";
import { Btn, EndCta, Faq, Note, Sec, useMkt, v } from "./kit";
import { MTA_BUCKETS, MTA_BUDGET_OBJ, MTA_DIRS, MTA_FAQ, MTA_FLOW, MTA_LEVELS, MTA_METRICS, MTA_OBJ, MTA_OBJ_NOTE, MTA_PREFS, MTA_SERVICES, MTA_STAGES, MTA_STAGE_NOTE, MTA_WE, MTA_WHERE } from "./meta-data";

// META MARKETING page ("mtb-"): built like a social ads manager. The hero is a small manager window (menu, the seven objectives, the campaign tree and a phone
// with the ad); every later section is a window or a post of the same family. The previews look like a feed post, a story and a reel, in the colours of the
// site. They are concepts with a made-up "Your Brand": nothing here is Meta's own interface, and nothing is live.

const PLACES = ["Feed", "Story", "Reels"] as const;
const AUDIENCES = [{ k: "New people", d: "People who have not met the brand yet" }, { k: "Interested visitors", d: "People who visited the site or watched a video" }, { k: "Past customers", d: "People who bought before, where data and consent permit" }];
const MENU = ["Campaigns", "Audiences", "Creative hub", "Events & Pixel", "Reports"];
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

function Art({ kind }: { kind: string }) {
  if (kind === "product") return (<svg viewBox="0 0 300 200" aria-hidden="true"><circle className="mta-a1" cx="150" cy="100" r="58" /><rect className="mta-a2" x="116" y="62" width="68" height="74" rx="14" /><rect className="mta-a3" x="130" y="80" width="40" height="6" rx="3" /><rect className="mta-a3" x="130" y="94" width="28" height="6" rx="3" /><ellipse className="mta-sh" cx="150" cy="160" rx="50" ry="7" /></svg>);
  if (kind === "split") return (<svg viewBox="0 0 300 200" aria-hidden="true"><rect className="mta-a2" x="14" y="26" width="130" height="148" rx="14" /><rect className="mta-a1" x="156" y="26" width="130" height="148" rx="14" /><path className="mta-st" d="M50 70l58 58M108 70l-58 58" /><path className="mta-st" d="M196 104l24 24 42-50" /></svg>);
  if (kind === "story") return (<svg viewBox="0 0 300 200" aria-hidden="true"><circle className="mta-a1" cx="86" cy="100" r="50" /><circle className="mta-a2" cx="112" cy="84" r="32" /><rect className="mta-a3" x="170" y="64" width="112" height="9" rx="4.500" /><rect className="mta-a3" x="170" y="88" width="90" height="9" rx="4.500" /><rect className="mta-a3" x="170" y="112" width="102" height="9" rx="4.500" /></svg>);
  if (kind === "offer") return (<svg viewBox="0 0 300 200" aria-hidden="true"><path className="mta-a1" d="M150 18l17 28 32-9-7 32 30 15-26 21 15 28-32-2-13 30-16-23-16 23-13-30-32 2 15-28-26-21 30-15-7-32 32 9z" /><text x="150" y="108" textAnchor="middle" className="mta-big">OFFER</text></svg>);
  return (<svg viewBox="0 0 300 200" aria-hidden="true">{[0, 1, 2].map((i) => (<g key={i}><circle className="mta-a1" cx="56" cy={52 + i * 50} r="16" /><text x="56" y={58 + i * 50} textAnchor="middle" className="mta-num">{i + 1}</text><rect className="mta-a3" x="88" y={44 + i * 50} width={150 - i * 22} height="10" rx="5" /><rect className="mta-a2" x="88" y={61 + i * 50} width={110 - i * 10} height="8" rx="4" /></g>))}</svg>);
}

const I = {
  heart: <path d="M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z" />,
  comment: <path d="M4 5h16v11H9l-5 4z" />,
  send: <path d="M21 4L3 11l7 3 3 7z M10 14l11-10" />,
  save: <path d="M6 4h12v17l-6-4-6 4z" />,
  more: <g><circle cx="5" cy="12" r="1.300" /><circle cx="12" cy="12" r="1.300" /><circle cx="19" cy="12" r="1.300" /></g>,
  music: <path d="M9 18V6l10-2v12 M9 18a2.500 2.500 0 1 1-5 0 2.500 2.500 0 0 1 5 0z M19 16a2.500 2.500 0 1 1-5 0 2.500 2.500 0 0 1 5 0z" />,
};
const Ico = ({ n }: { n: keyof typeof I }) => <svg viewBox="0 0 24 24" className="mtb-i" aria-hidden="true">{I[n]}</svg>;

/** a feed post, a story or a reel (a concept, with a made-up brand) */
function Post({ head, text, cta, art, tone, place }: { head: string; text: string; cta: string; art: string; tone: number; place: number }) {
  return (
    <div className={`mtb-post p-${place}`} style={v({ "--tn": tone * 14 })}>
      {place === 1 && <div className="mtb-bars" aria-hidden="true"><i className="is-on" /><i /><i /></div>}
      <div className="mtb-ph"><span className="mtb-av" aria-hidden="true" /><span><b>Your Brand</b><small>Sponsored · concept</small></span><Ico n="more" /></div>
      <div className="mtb-media"><Art kind={art} /></div>
      {place === 2 && <div className="mtb-side" aria-hidden="true"><Ico n="heart" /><Ico n="comment" /><Ico n="send" /><Ico n="more" /></div>}
      {place === 0 && <div className="mtb-act" aria-hidden="true"><Ico n="heart" /><Ico n="comment" /><Ico n="send" /><Ico n="save" /></div>}
      <div className="mtb-cap">{place === 0 ? <><b>Your Brand</b> {text}</> : <><strong className="mtb-hl">{head}</strong><span className="mtb-ds">{text}</span></>}{place === 2 && <small><Ico n="music" /> Original audio (concept)</small>}</div>
      <div className="mtb-cta"><span>yourbrand.example</span><u>{cta} ›</u></div>
    </div>
  );
}

/** a window of the ads manager: a bar with three dots, a title and a tag */
function Win({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`mtb-win ${className}`}>
      <div className="mtb-bar"><i /><i /><i /><b>{title}</b><em>Concept</em></div>
      <div className="mtb-body">{children}</div>
    </div>
  );
}

export function MetaPage({ d }: { d: TechData }) {
  void d;
  const root = useRef<HTMLDivElement>(null);
  useMkt(root);
  const [obj, setObj] = useState(4);
  const [place, setPlace] = useState(0);
  const [aud, setAud] = useState(0);
  const [lvl, setLvl] = useState(0);
  const [dir, setDir] = useState(0);
  const [stage, setStage] = useState(0);
  const [budget, setBudget] = useState(50000);
  const [bObj, setBObj] = useState(4);
  const [months, setMonths] = useState(3);
  const [pref, setPref] = useState(0);
  const [flow, setFlow] = useState(0);
  const o = MTA_OBJ[obj];
  const dr = MTA_DIRS[dir];
  const st = MTA_STAGES[stage];
  const level = MTA_LEVELS[lvl];
  const pick = (i: number) => { setObj(i); setBObj(i); };

  const alloc = useMemo(() => {
    const a = [...MTA_BUDGET_OBJ[bObj].a];
    const move = (to: number, n: number) => { const take = Math.min(n, a[1]); a[1] -= take; a[to] += take; };
    if (pref === 1) move(0, 10);
    if (pref === 2) move(2, 10);
    if (pref === 3) move(3, 10);
    if (months <= 1) move(0, 5);
    if (months >= 4) move(2, 5);
    const sum = a.reduce((x, y) => x + y, 0);
    return a.map((x) => (x / sum) * 100);
  }, [bObj, pref, months]);

  return (
    <div className="mkt mta mtb" ref={root}>
      <div className="mkt-ruler" aria-hidden="true"><i /></div>

      {/* ------------------------------------------------------------ hero: the manager window */}
      <section className="mkt-hero mtb-hero">
        <div className="mkt-hero-l">
          <p className="mkt-chip">Meta Marketing</p>
          <h1 className="mkt-h1"><span>Turn Social Attention</span><span>Into Meaningful Action.</span></h1>
          <p className="mkt-sub">Strategic Meta Advertising for Brands That Want to Grow.</p>
          <p className="mkt-body">Bring campaign strategy, audience research, creative production and performance measurement together to build more focused advertising experiences across Facebook and Instagram.</p>
          <div className="mkt-cta"><Btn href="#contact">Plan My Campaign</Btn><Btn href="#mtb-obj" ghost>Explore Campaign Capabilities</Btn></div>
        </div>
        <div className="mkt-hero-r">
          <Win title="Ads manager · Your Brand" className="mtb-hero-win">
            <div className="mtb-hw">
              <ul className="mtb-menu" aria-label="Manager menu (concept)">{MENU.map((m, i) => <li key={m} className={i === 0 ? "is-on" : ""}><i aria-hidden="true" />{m}</li>)}</ul>
              <div className="mtb-hmain">
                <p className="mtb-h4">1 · Choose an objective</p>
                <div className="mta-pills" role="group" aria-label="Campaign objective">
                  {MTA_OBJ.map((x, i) => <button key={x.k} type="button" aria-pressed={obj === i} className={obj === i ? "is-on" : ""} onClick={() => pick(i)}>{x.short}</button>)}
                </div>
                <div className="mtb-tree">
                  <div className="mtb-node"><small>Campaign</small><b>{o.k}</b></div>
                  <div className="mtb-node is-2"><small>Ad set · audience</small>
                    <div role="group" aria-label="Audience">{AUDIENCES.map((x, i) => <button key={x.k} type="button" aria-pressed={aud === i} className={aud === i ? "is-on" : ""} onClick={() => setAud(i)} title={x.d}>{x.k}</button>)}</div>
                  </div>
                  <div className="mtb-node is-3"><small>Ad · placement</small>
                    <div role="group" aria-label="Placement">{PLACES.map((x, i) => <button key={x} type="button" aria-pressed={place === i} className={place === i ? "is-on" : ""} onClick={() => setPlace(i)}>{x}</button>)}</div>
                  </div>
                  <div className="mtb-node is-4"><small>Result</small><b>{o.event}</b></div>
                </div>
              </div>
              <div className="mtb-phone" aria-live="polite"><Post key={place + o.k} head={o.ad.head} text={AUDIENCES[aud].d} cta={o.ad.cta} art={MTA_DIRS[obj % 5].art} tone={obj} place={place} /></div>
            </div>
          </Win>
        </div>
      </section>

      {/* ------------------------------------------------------------ 02 the seven objectives: what we do */}
      <Sec n="02" q="what does a meta ads agency do for each objective" title={"Seven Objectives.\nHere Is What We Do For Each."} intro="Choose an objective. The list shows what we do, where the ad can appear, the formats, the landing page and the numbers we report. The phone shows an ad for it." id="mtb-obj">
        <Win title="Campaigns · objective" className="mtb-obj-win">
          <div className="mtb-obj">
            <ol className="mtb-camps" role="tablist" aria-label="Objectives" aria-orientation="vertical">
              {MTA_OBJ.map((x, i) => (
                <li key={x.k}><button type="button" role="tab" aria-selected={obj === i} className={obj === i ? "is-on" : ""} onClick={() => pick(i)}><b>{i + 1}</b><span>{x.k}<small>{x.short} stage</small></span><i aria-hidden="true" /></button></li>
              ))}
            </ol>
            <div className="mtb-det" role="tabpanel" key={o.k}>
              <p className="mkt-panel-k">Objective {obj + 1} / 7</p>
              <h3>{o.k}</h3>
              <p className="mtb-ex">{o.explain}</p>
              <p className="mkt-label">What we do</p>
              <ol className="mtb-steps">{MTA_WE[obj].map((x, i) => <li key={x} style={v({ "--i": i })}><b>{i + 1}</b>{x}</li>)}</ol>
              <div className="mtb-two">
                <div><p className="mkt-label">Where it can show</p><ul className="mkt-chips">{MTA_WHERE[obj].map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><p className="mkt-label">Creative formats</p><ul className="mkt-chips">{o.formats.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><p className="mkt-label">Landing experience</p><p>{o.landing}</p></div>
                <div><p className="mkt-label">We report</p><ul className="mkt-chips">{o.metrics.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <p className="mkt-note-s">{MTA_OBJ_NOTE}</p>
            </div>
            <div className="mtb-phone"><Post key={obj + "p" + place} head={o.ad.head} text={o.explain.split(".")[0] + "."} cta={o.ad.cta} art={MTA_DIRS[obj % 5].art} tone={obj} place={place} />
              <div className="mtb-seg" role="group" aria-label="Placement">{PLACES.map((x, i) => <button key={x} type="button" aria-pressed={place === i} className={place === i ? "is-on" : ""} onClick={() => setPlace(i)}>{x}</button>)}</div>
            </div>
          </div>
        </Win>
      </Sec>

      {/* ------------------------------------------------------------ 03 the structure */}
      <Sec n="03" q="how is a meta ads account organised" title={"Everything Behind\na Better Campaign."} intro="A campaign has levels. We work on every one of them: the goal, the audience and budget, the ad, and the measurement." id="mtb-svc">
        <Win title="Campaigns · structure" className="mtb-lvl-win">
          <div className="mtb-lv">
            <div className="mtb-tabs2" role="tablist" aria-label="Campaign levels">
              {MTA_LEVELS.map((l, i) => <button key={l.k} type="button" role="tab" aria-selected={lvl === i} className={lvl === i ? "is-on" : ""} onClick={() => setLvl(i)}><b>{l.k}</b><small>{l.sub}</small></button>)}
            </div>
            <div className="mtb-lvg" key={level.k} role="tabpanel">
              {level.groups.map((gi, n) => {
                const g = MTA_SERVICES[gi];
                return (
                  <div key={g.t} className="mtb-card" style={v({ "--i": n })}>
                    <h3>{g.t}</h3>
                    <ul>{g.items.map((x) => <li key={x}>{x}</li>)}</ul>
                    {g.note && <p className="mkt-note-s">{g.note}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </Win>
      </Sec>

      {/* ------------------------------------------------------------ 04 creative previewer */}
      <Sec n="04" q="what makes a good ad creative" title={"One Message.\nMultiple Creative Directions."} intro="Pick a direction and a placement. The post is a concept with original sample content, not a live ad." id="mtb-cre">
        <div className="mtb-cre mkt-rv">
          <div className="mtb-cre-l">
            <div role="group" aria-label="Creative direction" className="mta-dirs">
              {MTA_DIRS.map((x, i) => <button key={x.k} type="button" aria-pressed={dir === i} className={dir === i ? "is-on" : ""} onClick={() => setDir(i)}><b>{i + 1}</b>{x.k}</button>)}
            </div>
            <div className="mtb-seg" role="group" aria-label="Placement">{PLACES.map((x, i) => <button key={x} type="button" aria-pressed={place === i} className={place === i ? "is-on" : ""} onClick={() => setPlace(i)}>{x}</button>)}</div>
            <p className="mta-cre-t"><b>{dr.k}.</b> {dr.text}</p>
          </div>
          <div className="mtb-stage" aria-live="polite"><Post key={dr.k + place} head={dr.head} text={dr.text} cta={dr.cta} art={dr.art} tone={dr.tone} place={place} /></div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 05 funnel (pinned) */}
      <Sec n="05" q="what is a marketing funnel" title={"Connect Every Stage of\nthe Customer Journey."} id="mtb-fun" pin={{ count: 5, onChange: setStage }}>
        <Win title="Funnel · stage view" className="mtb-fun-win">
          <div className="mtb-fun">
            <ol className="mta-fun-l" aria-label="Campaign funnel">
              {MTA_STAGES.map((s, i) => (
                <li key={s.t} style={v({ "--w": 100 - i * 13 })}>
                  <button type="button" aria-pressed={stage === i} className={stage === i ? "is-on" : ""} onClick={() => setStage(i)}><b>{i + 1}</b>{s.t}</button>
                </li>
              ))}
            </ol>
            <div className="mtb-fp" key={st.t}>
              <p className="mkt-panel-k">Stage {stage + 1} / 5</p>
              <h3>{st.t}</h3>
              <div className="mtb-two">
                <div><p className="mkt-label">Campaign objective</p><p>{st.obj}</p></div>
                <div><p className="mkt-label">Creative approach</p><p>{st.creative}</p></div>
                <div><p className="mkt-label">Example CTA</p><p className="mta-cta-s">{st.cta}</p></div>
                <div><p className="mkt-label">Metrics</p><ul className="mkt-chips">{st.metrics.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
              <p className="mkt-label">Potential next step</p><p>{st.next}</p>
            </div>
          </div>
        </Win>
        <Note>{MTA_STAGE_NOTE}</Note>
      </Sec>

      {/* ------------------------------------------------------------ 06 budget planner */}
      <Sec n="06" q="how much should i spend on facebook and instagram ads" title={"Explore How a Campaign\nBudget Can Be Planned."} intro="Move the controls to see how a budget could be split. It illustrates how we think; it is not a live recommendation and not a forecast." id="mtb-bud">
        <Win title="Budget & schedule" className="mtb-bud-win">
          <div className="mtb-bud">
            <div className="mtb-form">
              <label className="mta-field"><span>Monthly budget (illustrative)</span><b>{inr(budget)}</b><input type="range" min={10000} max={500000} step={5000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} aria-label="Monthly budget" /></label>
              <div className="mta-field"><span>Objective</span><GlassSelect label="Objective" value={String(bObj)} options={MTA_BUDGET_OBJ.map((x, i) => ({ value: String(i), label: x.k }))} onChange={(v) => setBObj(Number(v))} /></div>
              <label className="mta-field"><span>Duration</span><b>{months} {months === 1 ? "month" : "months"}</b><input type="range" min={1} max={6} step={1} value={months} onChange={(e) => setMonths(Number(e.target.value))} aria-label="Duration in months" /></label>
              <div className="mta-field"><span>Preference</span><div role="group" aria-label="Allocation preference" className="mta-prefs">{MTA_PREFS.map((x, i) => <button key={x} type="button" aria-pressed={pref === i} className={pref === i ? "is-on" : ""} onClick={() => setPref(i)}>{x}</button>)}</div></div>
            </div>
            <div className="mtb-res" aria-live="polite">
              <p className="mta-total">Total for {months} {months === 1 ? "month" : "months"}: <b>{inr(budget * months)}</b></p>
              <div className="mtb-stack" aria-hidden="true">{alloc.map((a, i) => <i key={i} className={`s${i}`} style={{ width: `${a}%` }} />)}</div>
              <ul className="mtb-legend">
                {MTA_BUCKETS.map((b, i) => <li key={b.k}><i className={`s${i}`} aria-hidden="true" /><span><b>{b.k}</b><small>{b.d}</small></span><em>{alloc[i].toFixed(0)}%<small>{inr((budget * alloc[i]) / 100)} / month</small></em></li>)}
              </ul>
              <p className="mkt-note-s">Actual allocation depends on your goals, audience size, campaign data and conditions. Media spend is paid to the platform and is separate from our fee.</p>
            </div>
          </div>
        </Win>
      </Sec>

      {/* ------------------------------------------------------------ 07 workflow (pinned) */}
      <Sec n="07" q="how does a campaign get made" title={"From Campaign Brief to\nContinuous Optimization."} id="mtb-flow" pin={{ count: 8, onChange: setFlow }}>
        <div className="mta-flow mtb-flowbox">
          <ol className="mta-rail" aria-label="Campaign workflow">
            {MTA_FLOW.map((s, i) => <li key={s.t} className={`${flow === i ? "is-on" : ""} ${i <= flow ? "is-lit" : ""}`}><button type="button" aria-pressed={flow === i} onClick={() => setFlow(i)} aria-label={`Step ${i + 1}: ${s.t}`}>{i + 1}</button></li>)}
          </ol>
          <div className="mta-flow-b" aria-live="polite" key={flow}><p className="mkt-panel-k">Step {flow + 1} / 8</p><h3>{MTA_FLOW[flow].t}</h3><p>{MTA_FLOW[flow].d}</p></div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 08 reporting table */}
      <Sec n="08" q="what do the numbers in my ads report mean" title={"Understand What Your Campaign\nIs Actually Delivering."} intro="The columns we report, and how to read each. Results vary with offer, audience, budget, creative, competition and website. No sample dashboard is shown, because nothing here is live." id="mtb-rep">
        <Win title="Reports · columns" className="mtb-rep-win">
          <table className="mtb-tbl">
            <thead><tr><th>Metric</th><th>What it shows</th><th>Read it with care</th></tr></thead>
            <tbody>{MTA_METRICS.map((m, i) => <tr key={m.k} style={v({ "--i": i })}><th scope="row">{m.k}</th><td>{m.shows}</td><td>{m.care}</td></tr>)}</tbody>
          </table>
        </Win>
      </Sec>

      <Sec n="09" q="meta ads case studies" title={"Campaign Work,\nShown Honestly."} id="mtb-ev">
        <div className="mta-evid mkt-rv"><p>We publish campaign case studies only with the client&apos;s approval and verified results. None are listed here yet, and we do not use invented numbers. The posts above show how we think about creative.</p><Btn href="/portfolio" ghost>See our portfolio</Btn></div>
      </Sec>

      <Sec n="10" q="meta marketing questions" title={"Frequently Asked\nQuestions."} id="mtb-faq"><div className="mkt-rv"><Faq items={MTA_FAQ} /></div></Sec>

      <EndCta n="11" title={"Let's Build Your\nNext Campaign."} text="Tell us what you want to achieve, who you want to reach and what you are promoting. We'll help you plan the right campaign approach." button="Discuss Your Meta Campaign" />
    </div>
  );
}
