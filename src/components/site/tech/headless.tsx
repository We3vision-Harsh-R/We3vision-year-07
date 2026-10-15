"use client";

import { useEffect, useRef, useState } from "react";
import { AskAi } from "./ask-ai";
import { SmartLink } from "../smart-link";
import { oneLine, storyParts, type TechData } from "./data";
import { AppWindow, useStage } from "./stage";

// HEADLESS CMS page ("hl-"): a content studio. One entry is written once, served as JSON and shown on five channels at the same time.

type Chan = "web" | "app" | "watch" | "mail" | "voice";
const CHANNELS: { id: Chan; label: string }[] = [
  { id: "web", label: "Website" },
  { id: "app", label: "Mobile app" },
  { id: "watch", label: "Smart watch" },
  { id: "mail", label: "Email" },
  { id: "voice", label: "Voice" },
];
const COVERS = ["a", "b", "c", "d"] as const;
type Cover = (typeof COVERS)[number];
const FIRST = { title: "Our new collection is live", body: "Write it once in the CMS. Every channel gets the same words, images and links through the API.", cover: "a" as Cover };

function Studio() {
  const [title, setTitle] = useState(FIRST.title);
  const [body, setBody] = useState(FIRST.body);
  const [cover, setCover] = useState<Cover>("a");
  const [live, setLive] = useState(FIRST);
  const [mode, setMode] = useState<"rest" | "gql">("rest");
  const [on, setOn] = useState<Record<Chan, boolean>>({ web: true, app: true, watch: true, mail: false, voice: false });
  const [sending, setSending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const dirty = title !== live.title || body !== live.body || cover !== live.cover;
  const publish = () => {
    if (sending) return;
    setSending(true);
    timer.current = setTimeout(() => {
      setLive({ title, body, cover });
      setSending(false);
    }, 900);
  };
  const esc = (s: string) => JSON.stringify(s.replace(/\n/g, " ")).slice(1, -1);
  const json =
    mode === "rest"
      ? `GET /api/articles/1\n\n{\n  "id": 1,\n  "title": "${esc(title)}",\n  "body": "${esc(body)}",\n  "cover": "${cover}",\n  "status": "${dirty ? "draft" : "published"}"\n}`
      : `query {\n  article(id: 1) {\n    title\n    body\n    cover\n  }\n}\n\n{\n  "data": { "article": {\n    "title": "${esc(title)}",\n    "body": "${esc(body)}",\n    "cover": "${cover}"\n  } }\n}`;

  return (
    <div className={`hl-studio ${sending ? "is-send" : ""}`}>
      <div className="hl-pane hl-edit">
        <div className="hl-pane-bar"><i /><i /><i /><b>Content · Article</b></div>
        <label className="hl-lab">Title<input value={title} maxLength={60} onChange={(e) => setTitle(e.target.value)} /></label>
        <label className="hl-lab">Body<textarea value={body} maxLength={150} rows={4} onChange={(e) => setBody(e.target.value)} /></label>
        <div className="hl-lab">Cover
          <div className="hl-covers">
            {COVERS.map((c) => (
              <button key={c} type="button" aria-label={`Cover ${c}`} className={`hl-cov hl-cov-${c} ${cover === c ? "is-on" : ""}`} onClick={() => setCover(c)} />
            ))}
          </div>
        </div>
        <button type="button" className="hl-publish" onClick={publish} disabled={!dirty || sending}>
          {sending ? "Publishing…" : dirty ? "Publish changes" : "Everything is published"}
        </button>
      </div>

      <div className="hl-wire" aria-hidden="true"><span /><span /><span /></div>

      <div className="hl-pane hl-api">
        <div className="hl-pane-bar">
          <b>API</b>
          <span className="hl-seg">
            <button type="button" className={mode === "rest" ? "is-on" : ""} onClick={() => setMode("rest")}>REST</button>
            <button type="button" className={mode === "gql" ? "is-on" : ""} onClick={() => setMode("gql")}>GraphQL</button>
          </span>
        </div>
        <pre className="hl-code">{json}</pre>
        <p className={`hl-status ${dirty ? "is-draft" : ""}`}>{dirty ? "Draft · not sent to the channels yet" : "Published · channels are up to date"}</p>
      </div>

      <div className="hl-wire" aria-hidden="true"><span /><span /><span /></div>

      <div className="hl-pane hl-chans">
        <div className="hl-pane-bar"><b>Channels</b></div>
        <div className="hl-tabs">
          {CHANNELS.map((c) => (
            <button key={c.id} type="button" className={on[c.id] ? "is-on" : ""} onClick={() => setOn((o) => ({ ...o, [c.id]: !o[c.id] }))}>{c.label}</button>
          ))}
        </div>
        <div className="hl-views">
          {on.web && (
            <div className="hl-v hl-v-web">
              <div className={`hl-img hl-cov-${live.cover}`} />
              <h4>{live.title}</h4>
              <p>{live.body}</p>
            </div>
          )}
          {on.app && (
            <div className="hl-v hl-v-app">
              <div className={`hl-img hl-cov-${live.cover}`} />
              <h4>{live.title}</h4>
              <p>{live.body.slice(0, 54)}{live.body.length > 54 ? "…" : ""}</p>
            </div>
          )}
          {on.watch && (
            <div className="hl-v hl-v-watch"><h4>{live.title.slice(0, 26)}{live.title.length > 26 ? "…" : ""}</h4></div>
          )}
          {on.mail && (
            <div className="hl-v hl-v-mail"><small>Subject</small><h4>{live.title}</h4><p>{live.body}</p></div>
          )}
          {on.voice && (
            <div className="hl-v hl-v-voice"><span className="hl-eq"><i /><i /><i /><i /><i /></span><p>“{live.title}. {live.body}”</p></div>
          )}
          {!Object.values(on).some(Boolean) && <p className="hl-empty">Switch a channel on to see the content there.</p>}
        </div>
      </div>
    </div>
  );
}

function Model({ cards }: { cards: TechData["services"]["cards"] }) {
  const [i, setI] = useState(0);
  const c = cards[i] ?? cards[0];
  if (!c) return null;
  const name = oneLine(c.title).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return (
    <div className="hl-model">
      <ul className="hl-coll" role="tablist">
        {cards.map((x, n) => (
          <li key={x.title}>
            <button type="button" role="tab" aria-selected={n === i} className={n === i ? "is-on" : ""} onClick={() => setI(n)}>
              <span>{String(n + 1).padStart(2, "0")}</span>{oneLine(x.title)}
            </button>
          </li>
        ))}
      </ul>
      <div className="hl-entry" key={i}>
        <p className="hl-entry-top"><span>collection</span> <b>{name}</b></p>
        <h3>{oneLine(c.title)}</h3>
        <p className="hl-entry-text">{c.description}</p>
        <pre className="hl-code hl-code-s">{`{\n  "type": "${name}",\n  "status": "ready",\n  "channels": ["web", "app", "email"]\n}`}</pre>
      </div>
    </div>
  );
}

function Pipeline({ process }: { process: NonNullable<TechData["process"]> }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((x) => (x + 1) % process.items.length), 3000);
    return () => clearInterval(t);
  }, [auto, process.items.length]);
  const it = process.items[i];
  return (
    <div className="hl-pipe" onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}>
      <div className="hl-pipe-line">
        {process.items.map((p, n) => (
          <button key={p.title} type="button" className={`${n === i ? "is-on" : ""} ${n < i ? "is-done" : ""}`} onClick={() => setI(n)}>
            <i>{n + 1}</i><span>{p.title}</span>
          </button>
        ))}
        <b className="hl-pipe-fill" style={{ "--f": i / Math.max(1, process.items.length - 1) } as React.CSSProperties} />
        <em style={{ "--f": i / Math.max(1, process.items.length - 1) } as React.CSSProperties} />
      </div>
      <div className="hl-pipe-card" key={i}>
        <h4>{it.title}</h4>
        <p>{it.text}</p>
        {it.points.length > 0 && <ul>{it.points.map((p) => <li key={p}>{p}</li>)}</ul>}
      </div>
    </div>
  );
}

function Hub({ why }: { why: TechData["why"] }) {
  const [i, setI] = useState(0);
  const n = why.items.length;
  const cur = why.items[i];
  const [paused, setPaused] = useState(false);
  // moves on by itself every 2.5 seconds; stops while the pointer is on it
  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 2500);
    return () => clearInterval(t);
  }, [paused, n]);
  return (
    <div className="hl-hub" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hl-hub-ring">
        <svg viewBox="-100 -100 200 200" aria-hidden="true">
          {why.items.map((_, k) => {
            const a = (k / n) * Math.PI * 2 - Math.PI / 2;
            return <line key={k} x1="0" y1="0" x2={Math.cos(a) * 80} y2={Math.sin(a) * 80} className={k === i ? "is-on" : ""} />;
          })}
        </svg>
        <span className="hl-hub-core">CMS</span>
        {why.items.map((w, k) => {
          const a = (k / n) * Math.PI * 2 - Math.PI / 2;
          return (
            <button key={w.title} type="button" aria-label={w.title} className={`hl-node ${k === i ? "is-on" : ""}`} style={{ left: `${50 + Math.cos(a) * 40}%`, top: `${50 + Math.sin(a) * 40}%` }} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)}>
              {String(k + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>
      <div className="hl-hub-text" key={i}>
        <p className="hl-kicker">benefit {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
        <h3>{cur.title}</h3>
        <p>{cur.description}</p>
        <ul>{why.items.map((w, k) => <li key={w.title}><button type="button" className={k === i ? "is-on" : ""} onClick={() => setI(k)}>{w.title}</button></li>)}</ul>
      </div>
    </div>
  );
}

function Table({ ind }: { ind: NonNullable<TechData["industries"]> }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(0);
  const rows = ind.items.map((x, n) => ({ ...x, n })).filter((x) => x.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="hl-table">
      <label className="hl-filter"><span>filter</span><input value={q} placeholder="type an industry…" onChange={(e) => setQ(e.target.value)} /><b>{rows.length} rows</b></label>
      <div className="hl-rows">
        {rows.map((r) => (
          <div key={r.name} className={`hl-row ${open === r.n ? "is-on" : ""}`}>
            <button type="button" onClick={() => setOpen(open === r.n ? -1 : r.n)}><i>{String(r.n + 1).padStart(2, "0")}</i><b>{r.name}</b><u>{open === r.n ? "−" : "+"}</u></button>
            {open === r.n && <p>{r.description}</p>}
          </div>
        ))}
        {rows.length === 0 && <p className="hl-empty">No rows match.</p>}
      </div>
    </div>
  );
}

function Console({ faq }: { faq: TechData["faq"] }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(0);
  const a = faq[i]?.answer ?? "";
  useEffect(() => {
    const t = setInterval(() => setShown((s) => (s >= a.length ? s : Math.min(a.length, s + 4))), 18);
    return () => clearInterval(t);
  }, [a]);
  const pick = (n: number) => { setI(n); setShown(0); };
  const done = shown >= a.length;
  return (
    <div className="hl-gql">
      <ul>
        {faq.map((f, n) => (
          <li key={f.question}><button type="button" className={n === i ? "is-on" : ""} onClick={() => pick(n)}><code>faq[{n}]</code>{f.question}</button></li>
        ))}
      </ul>
      <div className="hl-gql-out">
        <p className="hl-gql-q">{`query { faq(id: ${i}) { answer } }`}</p>
        <pre className="hl-code">{`{\n  "data": {\n    "answer": "${a.slice(0, shown)}${done ? '"\n  }\n}' : "▍"}`}</pre>
      </div>
    </div>
  );
}

export function HeadlessPage({ d }: { d: TechData }) {
  const parts = storyParts(d.story);
  const tabs = [
    { id: "overview", label: "overview" },
    { id: "studio", label: "studio" },
    { id: "model", label: "content-model" },
    ...(d.process ? [{ id: "pipe", label: "lifecycle" }] : []),
    { id: "routes", label: "routes" },
    { id: "benefits", label: "benefits" },
    ...(d.industries ? [{ id: "ind", label: "industries" }] : []),
    { id: "faq", label: "graphql" },
    { id: "refs", label: "references" },
  ];
  const { setOuter, setInner, style: stageStyle, index: stageIndex, goto: stageGoto } = useStage(tabs.length);
  const cur = tabs[stageIndex]?.id ?? "overview";
  const to = (id: string) => stageGoto(Math.max(0, tabs.findIndex((t) => t.id === id)));
  return (
    <div className="hl tpin" ref={setOuter} style={stageStyle}>
      <div className="tpin-in" ref={setInner}>
        <AppWindow p="hl" title="cms-studio" tabs={tabs.map((t) => "/" + t.label)} index={stageIndex} onPick={stageGoto}>
          {cur === "overview" && (
            <div className="hl-pn hl-ov">
              <p className="hl-chip">{d.hero.chip}</p>
              <h1>{d.hero.heading}</h1>
              <p className="hl-ov-t">{d.hero.text}</p>
              <div className="hl-cta">
                <SmartLink href={d.hero.primaryHref} className="hl-btn">{d.hero.primaryLabel}</SmartLink>
                <button type="button" className="hl-btn hl-btn-g" onClick={() => to("model")}>{d.hero.secondaryLabel}</button>
              </div>
              <div className="hl-story">
                {parts.map((p, n) => (
                  <p key={n} className={n === 0 ? "hl-big" : "hl-small"}>{p.map((x, k) => (x.em ? <mark key={k}>{x.text}</mark> : <span key={k}>{x.text}</span>))}</p>
                ))}
              </div>
            </div>
          )}
          {cur === "studio" && (<div className="hl-pn"><p className="hl-kicker">/studio</p><h2>{"Write It Once, Show It Everywhere"}</h2><Studio /></div>)}
          {cur === "model" && (<div className="hl-pn"><p className="hl-kicker">/content-model</p><h2>{d.services.heading}</h2><p className="hl-lead">{d.services.intro}</p><Model cards={d.services.cards} /></div>)}
          {cur === "pipe" && d.process && (<div className="hl-pn"><p className="hl-kicker">/request-lifecycle</p><h2>{d.process.heading}</h2><p className="hl-lead">{d.process.intro}</p><Pipeline process={d.process} /></div>)}
          {cur === "routes" && (
            <div className="hl-pn"><p className="hl-kicker">/routes</p><h2>{d.tools.heading}</h2>
              <div className="hl-routes">{d.tools.items.map((t, n) => (<div key={t} style={{ "--i": n } as React.CSSProperties}><b>GET</b><span>/{t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}</span><em>200</em></div>))}</div>
            </div>
          )}
          {cur === "benefits" && (<div className="hl-pn"><p className="hl-kicker">/benefits</p><h2>{d.why.heading}</h2><Hub why={d.why} /></div>)}
          {cur === "ind" && d.industries && (<div className="hl-pn"><p className="hl-kicker">/industries</p><h2>{d.industries.heading}</h2><p className="hl-lead">{d.industries.intro}</p><Table ind={d.industries} /></div>)}
          {cur === "faq" && (<div className="hl-pn"><p className="hl-kicker">/graphql</p><h2>{"Questions We Often Hear"}</h2><Console faq={d.faq} /></div>)}
          {cur === "refs" && (
            <div className="hl-pn hl-rel"><p className="hl-kicker">/references</p>
              <div>{d.related.map((r) => (<SmartLink key={r.href} href={r.href} className="hl-ref"><small>reference →</small><b>{oneLine(r.title)}</b><span>{r.description}</span></SmartLink>))}</div>
              <AskAi d={d} />
            </div>
          )}
        </AppWindow>
      </div>
    </div>
  );
}
