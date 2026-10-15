"use client";

import { useMemo, useRef, useState } from "react";
import type { TechData } from "../tech/data";
import { Btn, EndCta, Faq, Note, Sec, Tabs, useMkt, v } from "./kit";
import { MTA_BUCKETS, MTA_BUDGET_OBJ, MTA_DIRS, MTA_FAQ, MTA_FLOW, MTA_METRICS, MTA_OBJ, MTA_OBJ_NOTE, MTA_PREFS, MTA_SERVICES, MTA_STAGES, MTA_STAGE_NOTE } from "./meta-data";

// META MARKETING page ("mta-"): a Campaign Creative Studio. The hero is a small studio (objective, audience, ad, landing page, result event) that reacts to
// the objective that is chosen; then the objective selector, a creative previewer, a funnel, a budget planner and a campaign workflow. Concept examples only.

const AUDIENCES = [{ k: "New people", d: "People who have not met the brand yet" }, { k: "Interested visitors", d: "People who visited the site or watched a video" }, { k: "Past customers", d: "People who bought before, where data and consent permit" }];

function Art({ kind }: { kind: string }) {
  if (kind === "product") return (<svg viewBox="0 0 300 170" aria-hidden="true"><circle className="mta-a1" cx="150" cy="85" r="52" /><rect className="mta-a2" x="118" y="52" width="64" height="66" rx="14" /><rect className="mta-a3" x="132" y="68" width="36" height="6" rx="3" /><rect className="mta-a3" x="132" y="82" width="26" height="6" rx="3" /><ellipse className="mta-sh" cx="150" cy="140" rx="46" ry="7" /></svg>);
  if (kind === "split") return (<svg viewBox="0 0 300 170" aria-hidden="true"><rect className="mta-a2" x="14" y="20" width="130" height="130" rx="14" /><rect className="mta-a1" x="156" y="20" width="130" height="130" rx="14" /><path className="mta-st" d="M52 58l54 54M106 58l-54 54" /><path className="mta-st" d="M196 90l22 22 40-46" /></svg>);
  if (kind === "story") return (<svg viewBox="0 0 300 170" aria-hidden="true"><circle className="mta-a1" cx="82" cy="85" r="46" /><circle className="mta-a2" cx="106" cy="70" r="30" /><rect className="mta-a3" x="168" y="52" width="104" height="8" rx="4" /><rect className="mta-a3" x="168" y="74" width="84" height="8" rx="4" /><rect className="mta-a3" x="168" y="96" width="96" height="8" rx="4" /></svg>);
  if (kind === "offer") return (<svg viewBox="0 0 300 170" aria-hidden="true"><path className="mta-a1" d="M150 14l16 26 30-8-6 30 28 14-24 20 14 26-30-2-12 28-16-22-16 22-12-28-30 2 14-26-24-20 28-14-6-30 30 8z" /><text x="150" y="96" textAnchor="middle" className="mta-big">OFFER</text></svg>);
  return (<svg viewBox="0 0 300 170" aria-hidden="true">{[0, 1, 2].map((i) => (<g key={i}><circle className="mta-a1" cx="56" cy={44 + i * 44} r="15" /><text x="56" y={50 + i * 44} textAnchor="middle" className="mta-num">{i + 1}</text><rect className="mta-a3" x="86" y={36 + i * 44} width={150 - i * 22} height="9" rx="4.5" /><rect className="mta-a2" x="86" y={52 + i * 44} width={110 - i * 10} height="7" rx="3.5" /></g>))}</svg>);
}

function Ad({ head, text, cta, art, tone, story }: { head: string; text: string; cta: string; art: string; tone: number; story?: boolean }) {
  return (
    <div className={`mta-ad ${story ? "is-story" : ""}`} style={v({ "--tn": tone * 14 })}>
      <div className="mta-ad-top"><i aria-hidden="true" /><span><b>Your Brand</b><small>Sponsored · concept</small></span></div>
      <div className="mta-ad-art"><Art kind={art} /></div>
      <div className="mta-ad-copy"><b>{head}</b><p>{text}</p></div>
      <div className="mta-ad-cta"><span>yourbrand.example</span><u>{cta}</u></div>
    </div>
  );
}

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function MetaPage({ d }: { d: TechData }) {
  void d;
  const root = useRef<HTMLDivElement>(null);
  useMkt(root);
  const [obj, setObj] = useState(4);
  const [aud, setAud] = useState(0);
  const [svc, setSvc] = useState<number[]>([]);
  const [dir, setDir] = useState(0);
  const [story, setStory] = useState(false);
  const [stage, setStage] = useState(0);
  const [budget, setBudget] = useState(50000);
  const [bObj, setBObj] = useState(4);
  const [months, setMonths] = useState(3);
  const [pref, setPref] = useState(0);
  const [flow, setFlow] = useState(0);
  const [metric, setMetric] = useState(0);
  const o = MTA_OBJ[obj];
  const dr = MTA_DIRS[dir];
  const st = MTA_STAGES[stage];

  // the illustrative budget split: a base split per objective, nudged by the preference and the length; it always adds up to 100
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
    <div className="mkt mta" ref={root}>
      <div className="mkt-ruler" aria-hidden="true"><i /></div>

      {/* ------------------------------------------------------------ hero */}
      <section className="mkt-hero">
        <div className="mkt-hero-l">
          <p className="mkt-chip">Meta Marketing</p>
          <h1 className="mkt-h1"><span>Turn Social Attention</span><span>Into Meaningful Action.</span></h1>
          <p className="mkt-sub">Strategic Meta Advertising for Brands That Want to Grow.</p>
          <p className="mkt-body">Bring campaign strategy, audience research, creative production and performance measurement together to build more focused advertising experiences across Facebook and Instagram.</p>
          <div className="mkt-cta"><Btn href="#contact">Plan My Campaign</Btn><Btn href="#mta-svc" ghost>Explore Campaign Capabilities</Btn></div>
        </div>
        <div className="mkt-hero-r">
          <div className="mta-studio" aria-label="Campaign Creative Studio (concept)">
            <p className="mta-studio-t">Campaign Creative Studio <small>concept</small></p>
            <div className="mta-pills" role="group" aria-label="Campaign objective">
              {MTA_OBJ.map((x, i) => <button key={x.k} type="button" aria-pressed={obj === i} className={obj === i ? "is-on" : ""} onClick={() => { setObj(i); setBObj(i); }}>{x.short}</button>)}
            </div>
            <div className="mta-chain">
              <div className="mta-step"><small>1 · Objective</small><b>{o.k}</b></div>
              <div className="mta-step mta-aud"><small>2 · Audience</small>
                <div role="group" aria-label="Audience segment">{AUDIENCES.map((x, i) => <button key={x.k} type="button" aria-pressed={aud === i} className={aud === i ? "is-on" : ""} onClick={() => setAud(i)} title={x.d}>{x.k}</button>)}</div>
              </div>
              <div className="mta-step mta-ad-s"><small>3 · Ad</small><Ad head={o.ad.head} text={AUDIENCES[aud].d} cta={o.ad.cta} art={MTA_DIRS[obj % 5].art} tone={obj} /></div>
              <div className="mta-step"><small>4 · Landing page</small><b>{o.landing}</b></div>
              <div className="mta-step mta-ev"><small>5 · Result event</small><b>{o.event}</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 02 objectives */}
      <Sec n="02" title={"Start With the Right\nCampaign Objective."} intro="Choose an objective. The explanation, formats, landing page, metrics and set-up notes change with it, and so does the studio above." id="mta-obj">
        <div className="mta-obj mkt-rv">
          <Tabs items={MTA_OBJ.map((x, i) => ({ k: String(i + 1), t: x.k }))} value={obj} onChange={(i) => { setObj(i); setBObj(i); }} label="Campaign objectives" />
          <div className="mkt-panel" role="tabpanel" key={o.k}>
            <p className="mkt-panel-k">Objective {obj + 1} / 7</p>
            <h3>{o.k}</h3>
            <p className="mta-explain">{o.explain}</p>
            <div className="mta-cols">
              <div><p className="mkt-label">Recommended creative formats</p><ul>{o.formats.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><p className="mkt-label">Likely landing experience</p><ul><li>{o.landing}</li></ul></div>
              <div><p className="mkt-label">Relevant metrics</p><ul>{o.metrics.map((x) => <li key={x}>{x}</li>)}</ul></div>
              <div><p className="mkt-label">Set-up considerations</p><ul>{o.setup.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            <p className="mkt-note-s">{MTA_OBJ_NOTE} The right objective comes from your goal, not only from your industry.</p>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 03 services */}
      <Sec n="03" title={"Everything Behind\na Better Campaign."} intro="Eight areas of work. Open any card to see everything inside it." id="mta-svc">
        <div className="mta-svc mkt-rv">
          {MTA_SERVICES.map((s, i) => {
            const open = svc.includes(i);
            const shown = open ? s.items : s.items.slice(0, 4);
            return (
              <div key={s.t} className={`mta-card ${open ? "is-on" : ""}`}>
                <p className="mta-card-n">{String(i + 1).padStart(2, "0")}</p>
                <h3>{s.t}</h3>
                <ul>{shown.map((x) => <li key={x}>{x}</li>)}</ul>
                {open && s.note && <p className="mkt-note-s">{s.note}</p>}
                {s.items.length > 4 && <button type="button" aria-expanded={open} onClick={() => setSvc(open ? svc.filter((x) => x !== i) : [...svc, i])}>{open ? "Show less" : `+ ${s.items.length - 4} more`}</button>}
              </div>
            );
          })}
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 04 creative previewer */}
      <Sec n="04" title={"One Message.\nMultiple Creative Directions."} intro="Pick a direction and a format. The ad below is a concept with original sample content, not a live Meta ad." id="mta-cre">
        <div className="mta-cre mkt-rv">
          <div className="mta-cre-l">
            <div role="group" aria-label="Creative direction" className="mta-dirs">
              {MTA_DIRS.map((x, i) => <button key={x.k} type="button" aria-pressed={dir === i} className={dir === i ? "is-on" : ""} onClick={() => setDir(i)}><b>{i + 1}</b>{x.k}</button>)}
            </div>
            <div role="group" aria-label="Ad format" className="mta-fmt">
              <button type="button" aria-pressed={!story} className={!story ? "is-on" : ""} onClick={() => setStory(false)}>Feed</button>
              <button type="button" aria-pressed={story} className={story ? "is-on" : ""} onClick={() => setStory(true)}>Story / Reel</button>
            </div>
            <p className="mta-cre-t"><b>{dr.k}.</b> {dr.text}</p>
          </div>
          <div className="mta-cre-r" aria-live="polite"><Ad key={dr.k + story} head={dr.head} text={dr.text} cta={dr.cta} art={dr.art} tone={dr.tone} story={story} /></div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 05 funnel */}
      <Sec n="05" title={"Connect Every Stage of\nthe Customer Journey."} id="mta-fun" pin={{ count: 5, onChange: setStage }}>
        <div className="mta-fun mkt-rv">
          <ol className="mta-fun-l" aria-label="Campaign funnel">
            {MTA_STAGES.map((s, i) => (
              <li key={s.t} style={v({ "--w": 100 - i * 13 })}>
                <button type="button" aria-pressed={stage === i} className={stage === i ? "is-on" : ""} onClick={() => setStage(i)}><b>{i + 1}</b>{s.t}</button>
              </li>
            ))}
          </ol>
          <div className="mkt-panel" key={st.t}>
            <p className="mkt-panel-k">Stage {stage + 1} / 5</p>
            <h3>{st.t}</h3>
            <div className="mta-cols mta-cols2">
              <div><p className="mkt-label">Campaign objective</p><p>{st.obj}</p></div>
              <div><p className="mkt-label">Creative approach</p><p>{st.creative}</p></div>
              <div><p className="mkt-label">Example CTA</p><p className="mta-cta-s">{st.cta}</p></div>
              <div><p className="mkt-label">Metrics</p><ul>{st.metrics.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </div>
            <p className="mkt-label">Potential next step</p><p>{st.next}</p>
          </div>
        </div>
        <Note>{MTA_STAGE_NOTE}</Note>
      </Sec>

      {/* ------------------------------------------------------------ 06 budget planner */}
      <Sec n="06" title={"Explore How a Campaign\nBudget Can Be Planned."} intro="Move the controls to see how a budget could be split. It is an illustration of how we think about it, not a live Meta recommendation and not a forecast of results." id="mta-bud">
        <div className="mta-bud mkt-rv">
          <div className="mta-bud-in">
            <label className="mta-field"><span>Illustrative monthly budget</span><b>{inr(budget)}</b>
              <input type="range" min={10000} max={500000} step={5000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} aria-label="Monthly budget" />
            </label>
            <label className="mta-field"><span>Primary objective</span>
              <select value={bObj} onChange={(e) => setBObj(Number(e.target.value))}>{MTA_BUDGET_OBJ.map((x, i) => <option key={x.k} value={i}>{x.k}</option>)}</select>
            </label>
            <label className="mta-field"><span>Campaign duration</span><b>{months} {months === 1 ? "month" : "months"}</b>
              <input type="range" min={1} max={6} step={1} value={months} onChange={(e) => setMonths(Number(e.target.value))} aria-label="Duration in months" />
            </label>
            <div className="mta-field"><span>Allocation preference</span>
              <div role="group" aria-label="Allocation preference" className="mta-prefs">{MTA_PREFS.map((x, i) => <button key={x} type="button" aria-pressed={pref === i} className={pref === i ? "is-on" : ""} onClick={() => setPref(i)}>{x}</button>)}</div>
            </div>
          </div>
          <div className="mta-bud-out" aria-live="polite">
            <p className="mta-total">Over {months} {months === 1 ? "month" : "months"}: <b>{inr(budget * months)}</b></p>
            {MTA_BUCKETS.map((b, i) => (
              <div key={b.k} className="mta-bar">
                <div className="mta-bar-h"><span>{b.k}</span><b>{alloc[i].toFixed(0)}% · {inr((budget * alloc[i]) / 100)} / month</b></div>
                <div className="mta-bar-t"><i style={{ width: `${alloc[i]}%` }} /></div>
                <small>{b.d}</small>
              </div>
            ))}
            <p className="mkt-note-s">Actual allocation depends on your goals, audience size, campaign data and operating conditions. Media spend is paid to the platform and is separate from our fee.</p>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 07 process */}
      <Sec n="07" title={"From Campaign Brief to\nContinuous Optimization."} id="mta-flow" pin={{ count: 8, onChange: setFlow }}>
        <div className="mta-flow mkt-rv">
          <ol className="mta-rail" aria-label="Campaign workflow">
            {MTA_FLOW.map((s, i) => (
              <li key={s.t} className={`${flow === i ? "is-on" : ""} ${i <= flow ? "is-lit" : ""}`}>
                <button type="button" aria-pressed={flow === i} onClick={() => setFlow(i)} aria-label={`Step ${i + 1}: ${s.t}`}>{i + 1}</button>
              </li>
            ))}
          </ol>
          <div className="mta-flow-b" aria-live="polite" key={flow}><p className="mkt-panel-k">Step {flow + 1} / 8</p><h3>{MTA_FLOW[flow].t}</h3><p>{MTA_FLOW[flow].d}</p>
            <div className="mta-flow-nav"><button type="button" onClick={() => setFlow(Math.max(0, flow - 1))} disabled={flow === 0}>← Previous</button><button type="button" onClick={() => setFlow(Math.min(MTA_FLOW.length - 1, flow + 1))} disabled={flow === MTA_FLOW.length - 1}>Next →</button></div>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 08 reporting */}
      <Sec n="08" title={"Understand What Your Campaign\nIs Actually Delivering."} intro="The numbers we report, and how to read each one. Results vary with offer, audience, budget, creative, competition and website experience. No sample dashboard is shown, because nothing here is live." id="mta-rep">
        <div className="mta-rep mkt-rv">
          <ul className="mta-rep-l" aria-label="Metrics">
            {MTA_METRICS.map((m, i) => <li key={m.k}><button type="button" aria-pressed={metric === i} className={metric === i ? "is-on" : ""} onClick={() => setMetric(i)}>{m.k}</button></li>)}
          </ul>
          <div className="mkt-panel" key={metric}><p className="mkt-panel-k">Metric {metric + 1} / 9</p><h3>{MTA_METRICS[metric].k}</h3>
            <p className="mkt-label">What it shows</p><p>{MTA_METRICS[metric].shows}</p>
            <p className="mkt-label">Read it with care</p><p>{MTA_METRICS[metric].care}</p>
          </div>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 09 case studies */}
      <Sec n="09" title={"Campaign Work,\nShown Honestly."} id="mta-ev">
        <div className="mta-evid mkt-rv">
          <p>We publish campaign case studies only with the client&apos;s approval and verified results. None are listed here yet, and we do not use invented performance numbers. The creative concepts above show how we think about ads.</p>
          <Btn href="/portfolio" ghost>See our portfolio</Btn>
        </div>
      </Sec>

      {/* ------------------------------------------------------------ 10 faq */}
      <Sec n="10" title={"Frequently Asked\nQuestions."} id="mta-faq"><div className="mkt-rv"><Faq items={MTA_FAQ} /></div></Sec>

      <EndCta n="11" title={"Let's Build Your\nNext Campaign."} text="Tell us what you want to achieve, who you want to reach and what you are promoting. We'll help you plan the right campaign approach." button="Discuss Your Meta Campaign" />
    </div>
  );
}
