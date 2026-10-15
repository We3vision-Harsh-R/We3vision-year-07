"use client";

import { useEffect, useRef, useState } from "react";
import { SmartLink } from "../smart-link";
import { oneLine, storyParts, type TechData } from "./data";
import { AppWindow, useStage } from "./stage";

// SHOPIFY APP page ("sha-"): a developer's workbench. The hero is a small app builder: pick a store event, pick what the app does, run a test event
// and read the webhook log. Services are extension cards in a swipe rail, tools are an `npm install`, why-us is a test run, industries are flip
// tiles, the FAQ is a support chat, and related services are "next steps".

const TRIGGERS = [
  { id: "order", label: "Order created", topic: "orders/create" },
  { id: "stock", label: "Inventory is low", topic: "inventory_levels/update" },
  { id: "signup", label: "Customer signs up", topic: "customers/create" },
  { id: "cart", label: "Cart is abandoned", topic: "checkouts/update" },
];
const ACTIONS = [
  { id: "sms", label: "Send an SMS", log: "sms.send → delivered" },
  { id: "erp", label: "Update stock in the ERP", log: "erp.sync → stock updated" },
  { id: "tag", label: "Tag the customer", log: "customer.tag → tagged" },
  { id: "team", label: "Notify the team", log: "team.notify → message sent" },
  { id: "crm", label: "Add to the CRM", log: "crm.upsert → contact saved" },
];

function Builder() {
  const [trig, setTrig] = useState("order");
  const [acts, setActs] = useState<Set<string>>(new Set(["sms", "tag"]));
  const [step, setStep] = useState(-1); // -1 idle, 0 trigger, 1 app, 2.. actions
  const [logs, setLogs] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const [running, setBusy] = useState(false);
  const chosen = ACTIONS.filter((a) => acts.has(a.id));
  const t = TRIGGERS.find((x) => x.id === trig)!;

  const run = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLogs([]);
    setBusy(true);
    const lines = [`POST /webhooks/${t.topic}   200`, "hmac verified · app server received the event", ...chosen.map((a) => a.log), "done · 0 errors"];
    lines.forEach((line, i) => {
      timers.current.push(setTimeout(() => { setStep(i < 2 + chosen.length ? i : 99); setLogs((l) => [...l, line]); }, 450 + i * 650));
    });
    timers.current.push(setTimeout(() => { setStep(-1); setBusy(false); }, 450 + lines.length * 650 + 300));
  };
  const flip = (id: string) => setActs((s) => { const x = new Set(s); if (x.has(id)) x.delete(id); else x.add(id); return x; });

  return (
    <div className="sha-builder">
      <div className="sha-bar"><i /><i /><i /><b>app-builder · workbench</b><button type="button" onClick={run} disabled={running || chosen.length === 0}>{running ? "Running…" : "▶ Send test event"}</button></div>
      <div className="sha-canvas">
        <div className={`sha-col ${step === 0 ? "is-lit" : ""}`}>
          <p>1 · When this happens</p>
          {TRIGGERS.map((x) => <button key={x.id} type="button" className={trig === x.id ? "is-on" : ""} onClick={() => setTrig(x.id)}>{x.label}</button>)}
        </div>
        <div className={`sha-link ${step >= 0 ? "is-go" : ""}`}><span /></div>
        <div className={`sha-app ${step === 1 ? "is-lit" : ""}`}>
          <p>2 · Your app</p>
          <b>my-store-app</b>
          <small>receives the webhook, checks it and runs your actions</small>
        </div>
        <div className={`sha-link ${step >= 1 ? "is-go" : ""}`}><span /></div>
        <div className="sha-col">
          <p>3 · Then do this</p>
          {ACTIONS.map((a) => {
            const idx = chosen.findIndex((c) => c.id === a.id);
            return <button key={a.id} type="button" className={`${acts.has(a.id) ? "is-on" : ""} ${idx >= 0 && step === 2 + idx ? "is-lit" : ""}`} onClick={() => flip(a.id)}>{a.label}<u>{acts.has(a.id) ? "on" : "off"}</u></button>;
          })}
        </div>
      </div>
      <pre className="sha-log">{logs.length === 0 ? "$ waiting for a test event…\n  choose an event, choose actions, press “Send test event”." : logs.map((l) => `✓ ${l}`).join("\n")}</pre>
    </div>
  );
}

function Rail({ cards }: { cards: TechData["services"]["cards"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const go = (n: number) => {
    const el = ref.current;
    if (!el) return;
    const k = Math.max(0, Math.min(cards.length - 1, n));
    const child = el.children[k] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setI(k);
  };
  return (
    <div className="sha-rail-wrap">
      <div className="sha-rail" ref={ref}>
        {cards.map((c, n) => (
          <article key={c.title} className={n === i ? "is-on" : ""} onClick={() => go(n)}>
            <small>extension {String(n + 1).padStart(2, "0")}</small>
            <h3>{oneLine(c.title)}</h3>
            <p>{c.description}</p>
          </article>
        ))}
      </div>
      <div className="sha-rail-ctl">
        <button type="button" onClick={() => go(i - 1)} aria-label="Previous">←</button>
        <span>{i + 1} / {cards.length}</span>
        <button type="button" onClick={() => go(i + 1)} aria-label="Next">→</button>
      </div>
    </div>
  );
}

function Install({ tools }: { tools: string[] }) {
  const [n, setN] = useState(0);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setN((x) => { if (x >= tools.length) { setOn(false); return x; } return x + 1; }), 300);
    return () => clearInterval(t);
  }, [on, tools.length]);
  return (
    <div className="sha-npm">
      <div className="sha-bar"><i /><i /><i /><b>terminal</b><button type="button" onClick={() => { setN(0); setOn(true); }} disabled={on}>{n >= tools.length && n > 0 ? "↻ Install again" : "$ npm install"}</button></div>
      <pre>{n === 0 && !on ? "$ ready" : `$ npm install\n${tools.slice(0, n).map((t) => `  + ${t}`).join("\n")}${on ? "\n  …" : `\n\nadded ${n} packages`}`}</pre>
    </div>
  );
}

function Tests({ why }: { why: TechData["why"] }) {
  const [ran, setRan] = useState(why.items.length);
  const [open, setOpen] = useState(-1);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setRan((x) => { if (x >= why.items.length) { setRunning(false); return x; } return x + 1; }), 380);
    return () => clearInterval(t);
  }, [running, why.items.length]);
  return (
    <div className="sha-tests">
      <div className="sha-bar"><i /><i /><i /><b>we3vision.test.js</b><button type="button" onClick={() => { setRan(0); setOpen(-1); setRunning(true); }} disabled={running}>{running ? "Running…" : "↻ Run tests"}</button></div>
      <p className="sha-pass">{ran >= why.items.length ? <><b>PASS</b> {why.items.length} tests passed</> : <><b className="w">RUNS</b> {ran} / {why.items.length}</>}</p>
      <ul>
        {why.items.map((w, n) => n < ran && (
          <li key={w.title} className={open === n ? "is-on" : ""}>
            <button type="button" onClick={() => setOpen(open === n ? -1 : n)}><span>✓</span>{w.title}</button>
            {open === n && <p>{w.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Support({ faq }: { faq: TechData["faq"] }) {
  const [asked, setAsked] = useState<number[]>([0]);
  const end = useRef<HTMLDivElement>(null);
  const ask = (n: number) => { setAsked((a) => (a.includes(n) ? a : [...a, n])); };
  useEffect(() => { const el = end.current?.parentElement; if (el) el.scrollTop = el.scrollHeight; }, [asked]);
  return (
    <div className="sha-chat">
      <div className="sha-bar"><i /><i /><i /><b>support · ask a question</b></div>
      <div className="sha-thread">
        {asked.map((n) => (
          <div key={n}><p className="sha-me">{faq[n]?.question}</p><p className="sha-bot">{faq[n]?.answer}</p></div>
        ))}
        <div ref={end} />
      </div>
      <div className="sha-quick">{faq.map((f, n) => !asked.includes(n) && <button key={f.question} type="button" onClick={() => ask(n)}>{f.question}</button>)}</div>
    </div>
  );
}

export function ShopappPage({ d }: { d: TechData }) {
  const parts = storyParts(d.story);
  const tabs = [
    { id: "builder", label: "app-builder" },
    { id: "readme", label: "README.md" },
    { id: "ext", label: "extensions/" },
    { id: "pkg", label: "package.json" },
    { id: "tests", label: "tests/" },
    ...(d.industries ? [{ id: "cat", label: "categories/" }] : []),
    { id: "support", label: "support/" },
    { id: "next", label: "next-steps" },
  ];
  const { setOuter, setInner, style: stageStyle, index: stageIndex, goto: stageGoto } = useStage(tabs.length);
  const cur = tabs[stageIndex]?.id ?? "builder";
  const to = (id: string) => stageGoto(Math.max(0, tabs.findIndex((t) => t.id === id)));
  return (
    <div className="sha tpin" ref={setOuter} style={stageStyle}>
      <div className="tpin-in" ref={setInner}>
        <AppWindow p="sha" title="shopify app · workbench" tabs={tabs.map((t) => t.label)} index={stageIndex} onPick={stageGoto}>
          {cur === "builder" && (
            <div className="sha-pn sha-hero">
              <div className="sha-hero-t">
                <p className="sha-chip">{d.hero.chip}</p>
                <h1>{d.hero.heading}</h1>
                <p>{d.hero.text}</p>
                <div className="sha-cta">
                  <SmartLink href={d.hero.primaryHref} className="sha-btn">{d.hero.primaryLabel}</SmartLink>
                  <button type="button" className="sha-btn sha-btn-g" onClick={() => to("ext")}>{d.hero.secondaryLabel}</button>
                </div>
              </div>
              <Builder />
            </div>
          )}
          {cur === "readme" && (
            <div className="sha-pn"><p className="sha-file">README.md</p>
              <div className="sha-readme-b">{parts.map((p, n) => <p key={n} className={n === 0 ? "sha-lead" : ""}>{p.map((x, k) => (x.em ? <code key={k}>{x.text}</code> : <span key={k}>{x.text}</span>))}</p>)}</div>
            </div>
          )}
          {cur === "ext" && (<div className="sha-pn"><p className="sha-file">extensions/</p><h2>{d.services.heading}</h2><p className="sha-sub">{d.services.intro}</p><Rail cards={d.services.cards} /></div>)}
          {cur === "pkg" && (<div className="sha-pn"><p className="sha-file">package.json</p><h2>{d.tools.heading}</h2><Install tools={d.tools.items} /></div>)}
          {cur === "tests" && (<div className="sha-pn"><p className="sha-file">tests/</p><h2>{d.why.heading}</h2><Tests why={d.why} /></div>)}
          {cur === "cat" && d.industries && (
            <div className="sha-pn"><p className="sha-file">categories/</p><h2>{d.industries.heading}</h2><p className="sha-sub">{d.industries.intro}</p>
              <ul className="sha-flip">
                {d.industries.items.map((x, n) => (
                  <li key={x.name} tabIndex={0}>
                    <div><span>{String(n + 1).padStart(2, "0")}</span><b>{x.name}</b><small>hover to read</small></div>
                    <div><p>{x.description}</p></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {cur === "support" && (<div className="sha-pn"><p className="sha-file">support/</p><h2>{"Questions We Often Hear"}</h2><Support faq={d.faq} /></div>)}
          {cur === "next" && (
            <div className="sha-pn"><p className="sha-file">next-steps.md</p>
              <ul className="sha-next">{d.related.map((r, n) => <li key={r.href}><SmartLink href={r.href}><span>{n + 1}</span><b>{oneLine(r.title)}</b><em>{r.description}</em><u>→</u></SmartLink></li>)}</ul>
            </div>
          )}
        </AppWindow>
      </div>
    </div>
  );
}
