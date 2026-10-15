"use client";

import { useEffect, useRef, useState } from "react";
import { GuideFront } from "../avatar";
import { SmartLink } from "../smart-link";
import { oneLine, plainStory, type TechData } from "./data";
import { useStage } from "./stage";

// SHOPIFY page ("shp-"): the page is a working imitation of the Shopify admin, in Shopify's own look.
// Home = welcome + Setup guide (our process). Online Store = a theme editor with a real demo storefront: add to cart, check out, and the order
// lands in Orders and in Analytics. Products = services. Customers = industries (segments). Apps = tools. Settings = why us.
// The search bar at the top is the Help search (FAQ).

type Menu = "home" | "orders" | "products" | "customers" | "analytics" | "store" | "apps" | "settings";
const MENU: { id: Menu; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "orders", label: "Orders", icon: "▤" },
  { id: "products", label: "Products", icon: "◇" },
  { id: "customers", label: "Customers", icon: "☺" },
  { id: "analytics", label: "Analytics", icon: "▥" },
  { id: "store", label: "Online Store", icon: "▣" },
  { id: "apps", label: "Apps", icon: "▦" },
  { id: "settings", label: "Settings", icon: "⚙" },
];
const GOODS = [
  { id: "shirt", name: "Linen shirt", price: 48 },
  { id: "tote", name: "Canvas tote", price: 32 },
  { id: "mug", name: "Ceramic mug", price: 18 },
  { id: "lamp", name: "Desk lamp", price: 64 },
];
const ACCENTS = ["#303030", "#008060", "#b4452a", "#5c6ac4", "#c9a227"];
type Sec = "announce" | "hero" | "grid" | "news";
const SECS: { id: Sec; label: string }[] = [
  { id: "announce", label: "Announcement bar" },
  { id: "hero", label: "Hero banner" },
  { id: "grid", label: "Featured products" },
  { id: "news", label: "Email sign-up" },
];
type Order = { no: number; who: string; items: string; total: number };
const SAMPLE: Order[] = [
  { no: 1001, who: "Sample customer", items: "Ceramic mug", total: 18 },
  { no: 1002, who: "Sample customer", items: "Linen shirt, Canvas tote", total: 80 },
];

export function ShopifyPage({ d }: { d: TechData }) {
  const menus = MENU.filter((m) => !(m.id === "customers" && !d.industries));
  const { setOuter, setInner, style: stageStyle, index: stageIndex, goto: stageGoto } = useStage(menus.length);
  const menu: Menu = menus[stageIndex]?.id ?? "home";
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [menu]);
  const steps = d.process?.items ?? [];
  const [done, setDone] = useState<Set<number>>(new Set());
  const [openStep, setOpenStep] = useState(0);
  const [orders, setOrders] = useState<Order[]>(SAMPLE);
  const [cart, setCart] = useState<string[]>([]);
  const [order, setOrder] = useState<Sec[]>(["announce", "hero", "grid", "news"]);
  const [hidden, setHidden] = useState<Set<Sec>>(new Set());
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [round, setRound] = useState(true);
  const [cols, setCols] = useState(4);
  const [placed, setPlaced] = useState<number | null>(null);
  const [prod, setProd] = useState<number | null>(null);
  const [seg, setSeg] = useState(0);
  const [q, setQ] = useState("");
  const [sOpen, setSOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const story = plainStory(d.story).split(/\n\n+/);

  const go = (m: Menu) => { setSOpen(false); stageGoto(Math.max(0, menus.findIndex((x) => x.id === m))); };
  const toggleHidden = (s: Sec) => setHidden((h) => { const x = new Set(h); if (x.has(s)) x.delete(s); else x.add(s); return x; });
  const move = (s: Sec, dir: -1 | 1) => setOrder((o) => { const i = o.indexOf(s); const j = i + dir; if (j < 0 || j >= o.length) return o; const x = [...o]; [x[i], x[j]] = [x[j], x[i]]; return x; });
  const cartItems = cart.map((id) => GOODS.find((g) => g.id === id)!).filter(Boolean);
  const cartTotal = cartItems.reduce((a, g) => a + g.price, 0);
  const checkout = () => {
    if (cartItems.length === 0) return;
    const no = 1001 + orders.length;
    setOrders((o) => [{ no, who: "You (test order)", items: cartItems.map((g) => g.name).join(", "), total: cartTotal }, ...o]);
    setCart([]);
    setPlaced(no);
  };
  const sales = orders.reduce((a, o) => a + o.total, 0);
  const perGood = GOODS.map((g) => ({ ...g, n: orders.reduce((a, o) => a + o.items.split(", ").filter((x) => x === g.name).length, 0) }));
  const maxN = Math.max(1, ...perGood.map((g) => g.n));
  const hits = q.trim() ? d.faq.filter((f) => (f.question + f.answer).toLowerCase().includes(q.toLowerCase())) : d.faq;
  const statuses = ["All", "Active"];
  const cards = d.services.cards;

  return (
    <div className="shp-wrap tpin" ref={setOuter} style={stageStyle}>
      <div className="tpin-in" ref={setInner}>
      <div className="shp">
        <header className="shp-top">
          <span className="shp-mark">S</span>
          <div className="shp-search">
            <input value={q} placeholder="Search help and questions" onFocus={() => setSOpen(true)} onChange={(e) => { setQ(e.target.value); setSOpen(true); }} aria-label="Search" />
            {sOpen && (
              <div className="shp-pop">
                <p>{q.trim() ? `Help results (${hits.length})` : "Suggested help"}</p>
                {hits.map((f) => {
                  const n = d.faq.indexOf(f);
                  return (
                    <div key={f.question} className={faqOpen === n ? "is-on" : ""}>
                      <button type="button" onClick={() => setFaqOpen(faqOpen === n ? null : n)}>{f.question}<span>{faqOpen === n ? "−" : "+"}</span></button>
                      {faqOpen === n && <em>{f.answer}</em>}
                    </div>
                  );
                })}
                {hits.length === 0 && <em>No help article matches.</em>}
                <button type="button" className="shp-close" onClick={() => setSOpen(false)}>Close</button>
              </div>
            )}
          </div>
          <span className="shp-store">{d.hero.chip} demo store</span>
        </header>
        <div className="shp-body">
          <nav className="shp-nav" aria-label="Store menu">
            {menus.map((m) => (
              <button key={m.id} type="button" className={menu === m.id ? "is-on" : ""} onClick={() => go(m.id)} disabled={m.id === "customers" && !d.industries}>
                <i>{m.icon}</i>{m.label}
                {m.id === "orders" && <b>{orders.length}</b>}
              </button>
            ))}
          </nav>
          <div className="shp-main" ref={mainRef} onClick={() => sOpen && setSOpen(false)}>
            {/* HOME */}
            <section hidden={menu !== "home"}>
              <div className="shp-banner">
                <div>
                  <h1>{oneLine(d.hero.heading)}</h1>
                  <p>{d.hero.text}</p>
                  <div className="shp-btns">
                    <SmartLink href={d.hero.primaryHref} className="shp-btn shp-btn-p">{d.hero.primaryLabel}</SmartLink>
                    <button type="button" className="shp-btn" onClick={() => go("products")}>{d.hero.secondaryLabel}</button>
                  </div>
                </div>
                <div className="shp-hero-art" aria-hidden="true"><div className="shp-bag"><span>S</span></div><div className="shp-av"><span className="shp-bubble">Hi! Let me help you set up your store.</span><GuideFront className="tav-wave" /></div></div>
              </div>
              <div className="shp-two">
                {steps.length > 0 ? (
                  <div className="shp-card">
                    <div className="shp-chead"><h3>Setup guide</h3><span>{done.size} of {steps.length} tasks complete</span></div>
                    <div className="shp-meter"><i style={{ width: `${steps.length ? (done.size / steps.length) * 100 : 0}%` }} /></div>
                    <ul className="shp-guide">
                      {steps.map((s, n) => (
                        <li key={s.title} className={openStep === n ? "is-on" : ""}>
                          <div>
                            <button type="button" className={`shp-tick ${done.has(n) ? "is-done" : ""}`} aria-label={done.has(n) ? "Mark as not done" : "Mark as done"} onClick={() => setDone((x) => { const y = new Set(x); if (y.has(n)) y.delete(n); else y.add(n); return y; })}>{done.has(n) ? "✓" : ""}</button>
                            <button type="button" className="shp-gt" onClick={() => setOpenStep(openStep === n ? -1 : n)}>{s.title}</button>
                          </div>
                          {openStep === n && <p>{s.text}{s.points.length > 0 && <small>{s.points.join(" · ")}</small>}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                  ) : (
                <div className="shp-card">
                  <div className="shp-chead"><h3>Today</h3><span>Demo store</span></div>
                  <div className="shp-today"><div><p>Total sales</p><b className="shp-count shp-usd" style={{ "--to": sales } as React.CSSProperties} aria-label={`$${sales}`} /></div><div><p>Orders</p><b className="shp-count" style={{ "--to": orders.length } as React.CSSProperties} aria-label={String(orders.length)} /></div></div>
                  <p className="shp-p">Open the theme editor, add a product to the cart and check out: the order shows up in Orders and Analytics.</p>
                  <button type="button" className="shp-btn shp-btn-p" onClick={() => go("store")}>Customize theme</button>
                </div>
                )}
                <div className="shp-card">
                  <div className="shp-chead"><h3>{d.process ? oneLine(d.process.heading) : "About this store"}</h3></div>
                  {story.map((p, n) => <p key={n} className="shp-p">{p}</p>)}
                </div>
              </div>
              {d.related.length > 0 && (
                <div className="shp-card">
                  <div className="shp-chead"><h3>More ways to grow</h3></div>
                  <ul className="shp-rel">{d.related.map((r) => <li key={r.href}><SmartLink href={r.href}>{oneLine(r.title)}</SmartLink><span>{r.description}</span></li>)}</ul>
                </div>
              )}
            </section>

            {/* ORDERS */}
            <section hidden={menu !== "orders"}>
              <h2 className="shp-h">Orders</h2>
              <p className="shp-sub">Place a test order in the <button type="button" onClick={() => go("store")}>Online Store</button> and it will appear here.</p>
              <div className="shp-card shp-flush">
                <table className="shp-table">
                  <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Payment</th><th className="r">Total</th></tr></thead>
                  <tbody>
                    {orders.map((o) => <tr key={o.no}><td><b>#{o.no}</b></td><td>{o.who}</td><td>{o.items}</td><td><span className="shp-pill">Paid</span></td><td className="r">${o.total}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>

            {/* PRODUCTS = services */}
            <section hidden={menu !== "products"} id="services">
              <h2 className="shp-h">Products <span>{oneLine(d.services.heading)}</span></h2>
              <p className="shp-sub">{d.services.intro}</p>
              <div className="shp-tabs">{statuses.map((s) => <button key={s} type="button" className={filter === s ? "is-on" : ""} onClick={() => setFilter(s)}>{s}</button>)}</div>
              <div className="shp-products">
                {cards.map((c, n) => (
                  <button key={c.title} type="button" className="shp-prod" onClick={() => setProd(n)}>
                    <span className="shp-thumb" style={{ background: `linear-gradient(135deg, hsl(${(n * 47) % 360} 55% 78%), hsl(${(n * 47 + 40) % 360} 60% 66%))` }}>{String(n + 1).padStart(2, "0")}</span>
                    <b>{oneLine(c.title)}</b>
                    <span className="shp-pill">Active</span>
                  </button>
                ))}
              </div>
              {prod !== null && cards[prod] && (
                <div className="shp-modal" role="dialog" aria-label={oneLine(cards[prod].title)} onClick={() => setProd(null)}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <h3>{oneLine(cards[prod].title)}</h3>
                    <p>{cards[prod].description}</p>
                    <div className="shp-btns">
                      <SmartLink href="#contact" className="shp-btn shp-btn-p">Ask us about this</SmartLink>
                      <button type="button" className="shp-btn" onClick={() => setProd(prod > 0 ? prod - 1 : cards.length - 1)}>‹ Previous</button>
                      <button type="button" className="shp-btn" onClick={() => setProd((prod + 1) % cards.length)}>Next ›</button>
                      <button type="button" className="shp-btn" onClick={() => setProd(null)}>Close</button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* CUSTOMERS = industries */}
            {d.industries && (
              <section hidden={menu !== "customers"}>
                <h2 className="shp-h">Customers <span>{oneLine(d.industries.heading)}</span></h2>
                <p className="shp-sub">{d.industries.intro}</p>
                <div className="shp-seg">
                  <ul>
                    {d.industries.items.map((s, n) => <li key={s.name}><button type="button" className={seg === n ? "is-on" : ""} onClick={() => setSeg(n)}><span>{s.name}</span></button></li>)}
                  </ul>
                  <div className="shp-card" key={seg}>
                    <p className="shp-eyebrow">Segment</p>
                    <h3>{d.industries.items[seg]?.name}</h3>
                    <p className="shp-p">{d.industries.items[seg]?.description}</p>
                    <SmartLink href="#contact" className="shp-btn shp-btn-p">Build a store for this</SmartLink>
                  </div>
                </div>
              </section>
            )}

            {/* ANALYTICS */}
            <section hidden={menu !== "analytics"}>
              <h2 className="shp-h">Analytics</h2>
              <div className="shp-stats">
                <div className="shp-card"><p>Total sales</p><b className="shp-count shp-usd" style={{ "--to": sales } as React.CSSProperties} aria-label={`$${sales}`} /></div>
                <div className="shp-card"><p>Orders</p><b className="shp-count" style={{ "--to": orders.length } as React.CSSProperties} aria-label={String(orders.length)} /></div>
                <div className="shp-card"><p>Average order</p><b className="shp-count shp-usd" style={{ "--to": orders.length ? Math.round(sales / orders.length) : 0 } as React.CSSProperties} aria-label="average order" /></div>
              </div>
              <div className="shp-card">
                <div className="shp-chead"><h3>Sold by product</h3></div>
                <div className="shp-bars">
                  {perGood.map((g) => <div key={g.id}><i style={{ height: `${(g.n / maxN) * 100}%` }} /><b>{g.n}</b><span>{g.name}</span></div>)}
                </div>
              </div>
            </section>

            {/* ONLINE STORE = theme editor */}
            <section hidden={menu !== "store"}>
              <h2 className="shp-h">Online Store <span>Customize theme</span></h2>
              <div className="shp-editor">
                <div className="shp-side">
                  <h4>Sections</h4>
                  <ul>
                    {order.map((s, i) => (
                      <li key={s} className={hidden.has(s) ? "is-off" : ""}>
                        <button type="button" className="shp-eye" aria-label={hidden.has(s) ? "Show section" : "Hide section"} onClick={() => toggleHidden(s)}>{hidden.has(s) ? "◌" : "●"}</button>
                        <span>{SECS.find((x) => x.id === s)?.label}</span>
                        <button type="button" aria-label="Move up" onClick={() => move(s, -1)} disabled={i === 0}>↑</button>
                        <button type="button" aria-label="Move down" onClick={() => move(s, 1)} disabled={i === order.length - 1}>↓</button>
                      </li>
                    ))}
                  </ul>
                  <h4>Theme settings</h4>
                  <div className="shp-set">Accent colour<div>{ACCENTS.map((c) => <button key={c} type="button" aria-label={`Colour ${c}`} className={accent === c ? "is-on" : ""} style={{ background: c }} onClick={() => setAccent(c)} />)}</div></div>
                  <div className="shp-set">Corners<div className="shp-sw"><button type="button" className={round ? "is-on" : ""} onClick={() => setRound(true)}>Round</button><button type="button" className={!round ? "is-on" : ""} onClick={() => setRound(false)}>Square</button></div></div>
                  <div className="shp-set">Products per row<div className="shp-sw"><button type="button" className={cols === 2 ? "is-on" : ""} onClick={() => setCols(2)}>2</button><button type="button" className={cols === 4 ? "is-on" : ""} onClick={() => setCols(4)}>4</button></div></div>
                </div>
                <div className="shp-front" style={{ "--ac": accent, "--rd": round ? "12px" : "0px" } as React.CSSProperties}>
                  <div className="shp-fhead"><b>Demo store</b><span>Catalog</span><span>About</span>
                    <button type="button" className="shp-cartbtn" onClick={() => setPlaced(null)}>Cart ({cart.length})</button>
                  </div>
                  {order.filter((s) => !hidden.has(s)).map((s) => {
                    if (s === "announce") return <div key={s} className="shp-ann">Free shipping on orders over $50</div>;
                    if (s === "hero") return <div key={s} className="shp-fhero"><h5>Made to last</h5><p>Simple things for every day.</p><i>Shop all</i></div>;
                    if (s === "grid") return (
                      <div key={s} className="shp-fgrid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                        {GOODS.map((g) => (
                          <div key={g.id}><u /><b>{g.name}</b><span>${g.price}</span><button type="button" onClick={() => { setCart((c) => [...c, g.id]); setPlaced(null); }}>Add to cart</button></div>
                        ))}
                      </div>
                    );
                    return <div key={s} className="shp-fnews"><b>Join the list</b><span>Your email</span><i>Subscribe</i></div>;
                  })}
                  <div className="shp-cart">
                    {placed ? <p className="shp-ok"><span className="shp-cheer" aria-hidden="true"><GuideFront className="tav-cheer" /></span>Order #{placed} placed. See it in <button type="button" onClick={() => go("orders")}>Orders</button> and <button type="button" onClick={() => go("analytics")}>Analytics</button>.</p> : cartItems.length === 0 ? <p>Your cart is empty. Add a product above.</p> : (
                      <>
                        <p>{cartItems.map((g) => g.name).join(", ")}</p>
                        <button type="button" onClick={checkout}>Check out · ${cartTotal}</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* APPS = tools */}
            <section hidden={menu !== "apps"}>
              <h2 className="shp-h">Apps <span>{oneLine(d.tools.heading)}</span></h2>
              <div className="shp-apps">
                {d.tools.items.map((t, n) => (
                  <div key={t} className="shp-card"><span className="shp-appic" style={{ background: `hsl(${(n * 53) % 360} 50% 42%)` }}>{t.slice(0, 1)}</span><b>{t}</b><span className="shp-pill">Installed</span></div>
                ))}
              </div>
            </section>

            {/* SETTINGS = why */}
            <section hidden={menu !== "settings"}>
              <h2 className="shp-h">Settings <span>{oneLine(d.why.heading)}</span></h2>
              {d.why.intro && <p className="shp-sub">{d.why.intro}</p>}
              <div className="shp-settings">
                {d.why.items.map((w, n) => (
                  <div key={w.title} className="shp-card"><span className="shp-sic">{String(n + 1).padStart(2, "0")}</span><div><b>{w.title}</b><p>{w.description}</p></div></div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
