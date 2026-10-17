"use client";

import { useEffect, useRef, useState } from "react";
import { GlassSelect } from "../glass-select";
import { SmartLink } from "../smart-link";
import { oneLine, storyParts, type TechData } from "./data";
import { AppWindow, useStage } from "./stage";

// WOOCOMMERCE page ("woo-"): the page is a shop. The hero is a working cart + checkout (quantity, coupon, shipping, payment, totals); the
// services are products you add to a "quote basket"; the process is an order tracker; why-us is the "Additional information" table of a product;
// the FAQ is the Q&A thread under a product; related services are "You may also like".

const SHIP = [
  { id: "std", label: "Standard shipping", cost: 5 },
  { id: "exp", label: "Express shipping", cost: 12 },
  { id: "pick", label: "Local pickup", cost: 0 },
];
const PAY = ["Card", "UPI", "Cash on delivery", "PayPal"];
const PAY_NOTE: Record<string, string> = {
  Card: "Pay with a credit or debit card.",
  UPI: "Pay with any UPI app.",
  "Cash on delivery": "Pay when the order arrives.",
  PayPal: "Pay with your PayPal account.",
};
const PRICE = 24;

function Checkout() {
  const [qty, setQty] = useState(1);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [msg, setMsg] = useState("");
  const [ship, setShip] = useState("std");
  const [pay, setPay] = useState("Card");
  const [order, setOrder] = useState<number | null>(null);
  const sub = qty * PRICE;
  const disc = applied ? Math.round(sub * 10) / 100 : 0;
  const shipCost = SHIP.find((s) => s.id === ship)?.cost ?? 0;
  const total = sub - disc + shipCost;
  const apply = () => {
    if (code.trim().toUpperCase() === "WELCOME10") { setApplied(true); setMsg("Coupon applied: 10% off."); }
    else { setApplied(false); setMsg("That coupon does not exist."); }
  };
  if (order) {
    return (
      <div className="woo-co woo-co-ok">
        <span className="woo-check">✓</span>
        <h3>Thank you. Your order has been received.</h3>
        <p>Order #{order} · Total ${total.toFixed(2)} · {pay}</p>
        <button type="button" onClick={() => { setOrder(null); setQty(1); setApplied(false); setCode(""); setMsg(""); }}>Place another test order</button>
      </div>
    );
  }
  return (
    <div className="woo-co">
      <div className="woo-co-head"><b>Cart</b><span>Demo checkout · nothing is charged or stored</span></div>
      <div className="woo-line">
        <i />
        <div><b>Sample product</b><span>${PRICE}.00 each</span></div>
        <div className="woo-qty"><button type="button" aria-label="Less" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button><span>{qty}</span><button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(9, q + 1))}>+</button></div>
      </div>
      <div className="woo-coupon">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code (try WELCOME10)" onKeyDown={(e) => e.key === "Enter" && apply()} />
        <button type="button" onClick={apply}>Apply</button>
      </div>
      {msg && <p className={`woo-msg ${applied ? "is-ok" : ""}`}>{msg}</p>}
      <fieldset className="woo-ship">
        <legend>Shipping</legend>
        {SHIP.map((s) => (
          <label key={s.id} className={ship === s.id ? "is-on" : ""}><input type="radio" name="woo-ship" checked={ship === s.id} onChange={() => setShip(s.id)} />{s.label}<b>{s.cost ? `$${s.cost}.00` : "Free"}</b></label>
        ))}
      </fieldset>
      <div className="woo-pay">
        {PAY.map((p) => <button key={p} type="button" className={pay === p ? "is-on" : ""} onClick={() => setPay(p)}>{p}</button>)}
      </div>
      <p className="woo-paynote">{PAY_NOTE[pay]}</p>
      <dl className="woo-tot">
        <div><dt>Subtotal</dt><dd>${sub.toFixed(2)}</dd></div>
        {applied && <div><dt>Discount</dt><dd>−${disc.toFixed(2)}</dd></div>}
        <div><dt>Shipping</dt><dd>{shipCost ? `$${shipCost}.00` : "Free"}</dd></div>
        <div className="woo-grand"><dt>Total</dt><dd>${total.toFixed(2)}</dd></div>
      </dl>
      <button type="button" className="woo-place" onClick={() => setOrder(1000 + Math.floor(Math.random() * 900))}>Place order</button>
    </div>
  );
}

function Shop({ d }: { d: TechData }) {
  const [basket, setBasket] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<"default" | "az">("default");
  const cards = d.services.cards.map((c, n) => ({ ...c, n }));
  const list = sort === "az" ? [...cards].sort((a, b) => oneLine(a.title).localeCompare(oneLine(b.title))) : cards;
  const toggle = (n: number) => setBasket((b) => (b.includes(n) ? b.filter((x) => x !== n) : [...b, n]));
  return (
    <>
      <div className="woo-bar">
        <p>Showing all {cards.length} results</p>
        <GlassSelect className="woo-sort" label="Sort" value={sort} options={[{ value: "default", label: "Default sorting" }, { value: "az", label: "Sort by name: A to Z" }]} onChange={(v) => setSort(v as "default" | "az")} />
        <button type="button" className="woo-basketbtn" onClick={() => setOpen((o) => !o)}>Quote basket <b>{basket.length}</b></button>
      </div>
      {open && (
        <div className="woo-basket">
          <h4>Your quote basket</h4>
          {basket.length === 0 ? <p>Nothing here yet. Add a service with “Add to quote”.</p> : (
            <>
              <ul>{basket.map((n) => <li key={n}>{oneLine(d.services.cards[n].title)}<button type="button" onClick={() => toggle(n)} aria-label="Remove">×</button></li>)}</ul>
              <SmartLink href="#contact" className="woo-place woo-place-l">Request a quote for {basket.length} {basket.length === 1 ? "service" : "services"}</SmartLink>
            </>
          )}
        </div>
      )}
      <ul className="woo-grid">
        {list.map((c) => (
          <li key={c.n} className={basket.includes(c.n) ? "is-in" : ""}>
            <div className="woo-img" style={{ background: `linear-gradient(135deg, hsl(calc(var(--th) + ${300 + (c.n * 23) % 120}) calc(60% * var(--ts)) 60%), hsl(calc(var(--th) + ${346 + (c.n * 17) % 40}) calc(70% * var(--ts)) 46%))` }}><span>{String(c.n + 1).padStart(2, "0")}</span></div>
            <h3>{oneLine(c.title)}</h3>
            <p>{c.description}</p>
            <button type="button" onClick={() => toggle(c.n)}>{basket.includes(c.n) ? "✓ Added to quote" : "Add to quote"}</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Tracker({ process }: { process: NonNullable<TechData["process"]> }) {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setI((x) => (x + 1) % process.items.length), 3800);
    return () => clearInterval(t);
  }, [auto, process.items.length]);
  const n = process.items.length;
  const it = process.items[i];
  return (
    <div className="woo-track" ref={ref} onMouseEnter={() => setAuto(false)}>
      <div className="woo-rail">
        <span className="woo-rail-fill" style={{ width: `${(i / Math.max(1, n - 1)) * 100}%` }} />
        <span className="woo-van" style={{ left: `${(i / Math.max(1, n - 1)) * 100}%` }}>🚚</span>
        {process.items.map((p, k) => <button key={p.title} type="button" className={`${k <= i ? "is-done" : ""} ${k === i ? "is-on" : ""}`} style={{ left: `${(k / Math.max(1, n - 1)) * 100}%` }} onClick={() => { setI(k); setAuto(false); }} aria-label={p.title}>{k + 1}</button>)}
      </div>
      <div className="woo-status" key={i}>
        <small>Order status · step {i + 1} of {n}</small>
        <h4>{it.title}</h4>
        <p>{it.text}</p>
        {it.points.length > 0 && <ul>{it.points.map((p) => <li key={p}>{p}</li>)}</ul>}
      </div>
    </div>
  );
}

function Qa({ faq }: { faq: TechData["faq"] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="woo-qa">
      {faq.map((f, n) => (
        <div key={f.question} className={open === n ? "is-on" : ""}>
          <button type="button" onClick={() => setOpen(open === n ? -1 : n)}><span>Q</span>{f.question}</button>
          {open === n && <p><span>A</span>{f.answer}</p>}
        </div>
      ))}
    </div>
  );
}

export function WoocommercePage({ d }: { d: TechData }) {
  const parts = storyParts(d.story);
  const [tab, setTab] = useState(0);
  const tabs = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop" },
    ...(d.process ? [{ id: "track", label: "Order tracking" }] : []),
    { id: "about", label: "Description" },
    { id: "info", label: "Additional info" },
    { id: "qa", label: "Questions" },
    { id: "more", label: "You may also like" },
  ];
  const { setOuter, setInner, style: stageStyle, index: stageIndex, goto: stageGoto } = useStage(tabs.length);
  const cur = tabs[stageIndex]?.id ?? "home";
  const to = (id: string) => stageGoto(Math.max(0, tabs.findIndex((t) => t.id === id)));
  return (
    <div className="woo tpin" ref={setOuter} style={stageStyle}>
      <div className="tpin-in" ref={setInner}>
        <AppWindow p="woo" title="shop.we3vision.demo" tabs={tabs.map((t) => t.label)} index={stageIndex} onPick={stageGoto}>
          {cur === "home" && (
            <div className="woo-pn woo-hero">
              <div className="woo-hero-l">
                <p className="woo-crumb">Home / Shop / <b>{d.hero.chip}</b></p>
                <h1>{d.hero.heading}</h1>
                <p className="woo-hero-t">{d.hero.text}</p>
                <div className="woo-hero-b">
                  <SmartLink href={d.hero.primaryHref} className="woo-place woo-place-l">{d.hero.primaryLabel}</SmartLink>
                  <button type="button" className="woo-ghost" onClick={() => to("shop")}>{d.hero.secondaryLabel}</button>
                </div>
                <ul className="woo-badges"><li>Open source</li><li>Secure payments</li><li>Shipping options</li></ul>
              </div>
              <Checkout />
            </div>
          )}
          {cur === "shop" && (
            <div className="woo-pn"><p className="woo-eyebrow">Shop</p><h2>{d.services.heading}</h2><p className="woo-lead">{d.services.intro}</p><Shop d={d} /></div>
          )}
          {cur === "track" && d.process && (
            <div className="woo-pn"><p className="woo-eyebrow">Track your order</p><h2>{d.process.heading}</h2><p className="woo-lead">{d.process.intro}</p><Tracker process={d.process} /></div>
          )}
          {cur === "about" && (
            <div className="woo-pn">
              <div className="woo-tabs"><button type="button" className={tab === 0 ? "is-on" : ""} onClick={() => setTab(0)}>Description</button><button type="button" className={tab === 1 ? "is-on" : ""} onClick={() => setTab(1)}>Tech stack</button></div>
              {tab === 0 ? (
                <div className="woo-descbody">{parts.map((p, n) => <p key={n}>{p.map((x, k) => (x.em ? <mark key={k}>{x.text}</mark> : <span key={k}>{x.text}</span>))}</p>)}</div>
              ) : (
                <div className="woo-descbody"><h3>{oneLine(d.tools.heading)}</h3><ul className="woo-chips">{d.tools.items.map((t) => <li key={t}>{t}</li>)}</ul></div>
              )}
            </div>
          )}
          {cur === "info" && (
            <div className="woo-pn"><p className="woo-eyebrow">Additional information</p><h2>{d.why.heading}</h2>
              <table className="woo-spec"><tbody>{d.why.items.map((w) => <tr key={w.title}><th>{w.title}</th><td>{w.description}</td></tr>)}</tbody></table>
            </div>
          )}
          {cur === "qa" && (<div className="woo-pn"><p className="woo-eyebrow">Customer questions</p><h2>{"Questions We Often Hear"}</h2><Qa faq={d.faq} /></div>)}
          {cur === "more" && (
            <div className="woo-pn"><p className="woo-eyebrow">You may also like</p>
              <ul className="woo-like">
                {d.related.map((r) => (<li key={r.href}><SmartLink href={r.href}><i /><b>{oneLine(r.title)}</b><span>{r.description}</span><em>View service →</em></SmartLink></li>))}
              </ul>
            </div>
          )}
        </AppWindow>
      </div>
    </div>
  );
}
