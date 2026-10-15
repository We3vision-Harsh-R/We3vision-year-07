"use client";

import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";

// KEYWORD FINDER ("kwf-"): a small puzzle. The visitor types a website, picks a kind of business and what it sells; a glass jar fills with keyword pieces for
// that business. The pieces are dragged (or clicked) out of the jar into a search box, which builds a preview of a search result and a keyword-to-page plan.
// It is a planning toy: the keywords are made from templates, no search volumes and no ranks are shown, and nothing is measured.

const CATS: { k: string; icon: string; services: string[] }[] = [
  { k: "Restaurant and food", icon: "🍽", services: ["Cloud kitchen", "Cafe", "Catering service", "Bakery", "Restaurant"] },
  { k: "Real estate", icon: "🏠", services: ["Property dealer", "Home loan advisor", "Interior designer", "Builder and developer"] },
  { k: "Health and clinic", icon: "⚕", services: ["Dental clinic", "Skin clinic", "Physiotherapy", "Eye hospital", "Diagnostic lab"] },
  { k: "Education and coaching", icon: "🎓", services: ["Coaching classes", "Online courses", "Preschool", "Skill training"] },
  { k: "Shop and e-commerce", icon: "🛍", services: ["Online clothing store", "Electronics shop", "Furniture store", "Grocery delivery"] },
  { k: "Software and IT", icon: "💻", services: ["Web development", "Mobile app development", "Software company", "Digital marketing agency"] },
  { k: "Factory and industry", icon: "🏭", services: ["Machine manufacturer", "Packaging supplier", "Steel supplier", "Textile manufacturer"] },
  { k: "Professional services", icon: "💼", services: ["Chartered accountant", "Law firm", "Insurance agent", "Business consultant"] },
  { k: "Travel and events", icon: "✈", services: ["Travel agency", "Wedding planner", "Event management", "Taxi service"] },
  { k: "Beauty and fitness", icon: "💪", services: ["Gym", "Beauty salon", "Yoga classes", "Spa"] },
];

const INTENT: Record<string, { label: string; page: string }> = {
  commercial: { label: "Buying", page: "A service page" },
  local: { label: "Local", page: "A contact page and a business profile" },
  info: { label: "Learning", page: "A guide or blog article" },
  question: { label: "Question", page: "An FAQ or help article" },
};
type Piece = { id: string; t: string; i: keyof typeof INTENT };

function makePieces(service: string, city: string): Piece[] {
  const s = service.toLowerCase();
  const c = city.trim();
  const list: [string, keyof typeof INTENT][] = [
    [`best ${s}`, "commercial"],
    [`${s} company`, "commercial"],
    [`affordable ${s}`, "commercial"],
    [`${s} reviews`, "commercial"],
    [c ? `${s} in ${c}` : `${s} near me`, "local"],
    [c ? `best ${s} in ${c}` : `top ${s} nearby`, "local"],
    [`how to choose ${s}`, "question"],
    [`what does ${s} cost`, "question"],
    [`${s} tips`, "info"],
    [`${s} checklist`, "info"],
  ];
  return list.map(([t, i], n) => ({ id: `${n}-${t}`, t, i }));
}

const brandOf = (site: string) => {
  const host = site.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0];
  const name = host.split(".")[0] || "Your Brand";
  return name.charAt(0).toUpperCase() + name.slice(1);
};
const TARGET = 5;

export function KeywordFinder() {
  const [site, setSite] = useState("");
  const [ready, setReady] = useState(false);
  const [cat, setCat] = useState(-1);
  const [svc, setSvc] = useState(-1);
  const [city, setCity] = useState("");
  const [placed, setPlaced] = useState<string[]>([]);
  const [flying, setFlying] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const drag = useRef<{ id: string; x: number; y: number; moved: boolean } | null>(null);
  const [over, setOver] = useState(false);

  const filled = cat >= 0 && svc >= 0;
  const service = filled ? CATS[cat].services[svc] : "";
  const pieces = useMemo(() => (filled ? makePieces(service, city) : []), [filled, service, city]);
  const brand = brandOf(site);
  const placedPieces = placed.map((id) => pieces.find((p) => p.id === id)).filter((p): p is Piece => !!p);

  const pickCat = (i: number) => { setCat(i); setSvc(-1); setPlaced([]); };
  const pickSvc = (i: number) => { setSvc(i); setPlaced([]); };

  // the piece flies into the box, then it is placed
  const send = (id: string) => {
    const el = els.current[id];
    const box = boxRef.current;
    if (!el || !box || placed.includes(id) || flying.includes(id)) return;
    const a = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const base = drag.current && drag.current.id === id ? { x: drag.current.x, y: drag.current.y } : { x: 0, y: 0 };
    const dx = b.left + b.width / 2 - (a.left + a.width / 2) + base.x;
    const dy = b.top + 90 - (a.top + a.height / 2) + base.y;
    setFlying((f) => [...f, id]);
    el.style.transition = "transform 0.62s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.62s ease";
    el.style.transform = `translate(${dx}px, ${dy}px) scale(0.55)`;
    el.style.opacity = "0";
    window.setTimeout(() => {
      setPlaced((p) => (p.includes(id) ? p : [...p, id]));
      setFlying((f) => f.filter((x) => x !== id));
      el.style.transition = "none";
      el.style.transform = "";
      el.style.opacity = "";
    }, 640);
  };
  const remove = (id: string) => setPlaced((p) => p.filter((x) => x !== id));

  const onDown = (e: RPointerEvent<HTMLButtonElement>, id: string) => {
    if (placed.includes(id) || flying.includes(id)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, x: 0, y: 0, moved: false };
    (drag.current as { sx?: number; sy?: number }).sx = e.clientX;
    (drag.current as { sx?: number; sy?: number }).sy = e.clientY;
  };
  const onMove = (e: RPointerEvent<HTMLButtonElement>, id: string) => {
    const d = drag.current as ({ id: string; x: number; y: number; moved: boolean; sx?: number; sy?: number }) | null;
    if (!d || d.id !== id) return;
    d.x = e.clientX - (d.sx ?? 0);
    d.y = e.clientY - (d.sy ?? 0);
    if (Math.abs(d.x) + Math.abs(d.y) > 6) d.moved = true;
    if (!d.moved) return;
    const el = e.currentTarget;
    el.style.transition = "none";
    el.style.transform = `translate(${d.x}px, ${d.y}px) rotate(${Math.max(-8, Math.min(8, d.x / 22))}deg) scale(1.08)`;
    el.classList.add("is-drag");
    const b = boxRef.current?.getBoundingClientRect();
    setOver(!!b && e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom);
  };
  const onUp = (e: RPointerEvent<HTMLButtonElement>, id: string) => {
    const d = drag.current;
    if (!d || d.id !== id) return;
    const el = e.currentTarget;
    el.classList.remove("is-drag");
    const b = boxRef.current?.getBoundingClientRect();
    const inside = !!b && e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom;
    setOver(false);
    if (!d.moved || inside) send(id);
    else {
      el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.transform = "";
    }
    drag.current = null;
  };

  const covered = Math.min(placed.length, TARGET);
  const snippet = placedPieces.slice(0, 4);

  return (
    <div className="kwf">
      {/* step 1: the website, in a search bar */}
      <form className={`kwf-bar ${ready ? "is-ok" : ""}`} onSubmit={(e) => { e.preventDefault(); if (site.trim()) setReady(true); }}>
        <i aria-hidden="true" />
        <input value={site} onChange={(e) => { setSite(e.target.value); if (!e.target.value.trim()) setReady(false); }} placeholder="Type your website, e.g. yourbrand.com" aria-label="Your website" />
        <button type="submit" disabled={!site.trim()}>{ready ? "Change" : "Start"}</button>
      </form>

      {/* step 2 and 3: the business, then what it sells */}
      <div className={`kwf-ask ${ready ? "is-on" : ""}`} aria-hidden={!ready}>
        <div className="kwf-q">
          <p className="kwf-q-t"><b>1</b> What kind of business is it?</p>
          <div className="kwf-chips">{CATS.map((c, i) => <button key={c.k} type="button" tabIndex={ready ? 0 : -1} className={cat === i ? "is-on" : ""} aria-pressed={cat === i} onClick={() => pickCat(i)}><span aria-hidden="true">{c.icon}</span>{c.k}</button>)}</div>
        </div>
        <div className={`kwf-q ${cat >= 0 ? "is-on" : ""}`}>
          <p className="kwf-q-t"><b>2</b> What does it sell or do?</p>
          <div className="kwf-chips">{(cat >= 0 ? CATS[cat].services : []).map((s, i) => <button key={s} type="button" tabIndex={cat >= 0 ? 0 : -1} className={svc === i ? "is-on" : ""} aria-pressed={svc === i} onClick={() => pickSvc(i)}>{s}</button>)}</div>
          <label className="kwf-city"><span>City (optional)</span><input value={city} onChange={(e) => { setCity(e.target.value); setPlaced([]); }} placeholder="e.g. Surat" /></label>
        </div>
      </div>

      {/* the jar and the search box */}
      <div className={`kwf-play ${ready ? "is-on" : ""}`}>
        <div className={`kwf-jar ${filled ? "is-full" : ""}`}>
          <p className="kwf-cap">{filled ? "Keywords for your business" : "The jar is empty"}</p>
          <div className="kwf-glass">
            <div className="kwf-lid" aria-hidden="true" />
            <div className="kwf-shine" aria-hidden="true" />
            {!filled && <p className="kwf-empty">Choose the kind of business and what it sells. The jar fills with keywords.</p>}
            <div className="kwf-pieces">
              {pieces.map((p, n) => (
                <button key={p.id} ref={(el) => { els.current[p.id] = el; }} type="button" className={`kwf-piece i-${p.i} ${placed.includes(p.id) ? "is-gone" : ""}`} style={{ "--n": n, "--r": `${(n % 5) * 2 - 4}deg` } as CSSProperties}
                  onPointerDown={(e) => onDown(e, p.id)} onPointerMove={(e) => onMove(e, p.id)} onPointerUp={(e) => onUp(e, p.id)} onPointerCancel={(e) => onUp(e, p.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); send(p.id); } }} aria-label={`Add keyword: ${p.t}`}>
                  <small>{INTENT[p.i].label}</small>{p.t}
                </button>
              ))}
            </div>
          </div>
          <p className="kwf-hint">{filled ? "Drag a keyword into the search box, or click it." : ""}</p>
        </div>

        <div className="kwf-arrow" aria-hidden="true"><i /><i /><i /></div>

        <div ref={boxRef} className={`kwf-box ${over ? "is-over" : ""}`} aria-live="polite">
          <p className="kwf-cap">Your search box</p>
          <div className="kwf-field">
            <span className="kwf-lens" aria-hidden="true" />
            <div className="kwf-tags">
              {placedPieces.length === 0 && <span className="kwf-ph">Drop keywords here</span>}
              {placedPieces.map((p) => <span key={p.id} className="kwf-tag">{p.t}<button type="button" onClick={() => remove(p.id)} aria-label={`Remove ${p.t}`}>×</button></span>)}
            </div>
          </div>
          <div className="kwf-meter"><div className="kwf-meter-h"><span>Keyword coverage (a planning guide, not a rank)</span><b>{covered} / {TARGET}</b></div><div className="kwf-meter-t"><i style={{ width: `${(covered / TARGET) * 100}%` }} /></div></div>
          <div className="kwf-serp">
            <small>{ready && site.trim() ? site.trim().replace(/^https?:\/\//i, "") : "yourbrand.com"}</small>
            <b>{filled ? `${service}${city.trim() ? ` in ${city.trim()}` : ""} | ${brand}` : `Your page title | ${brand}`}</b>
            <p>{snippet.length ? <>{brand} offers {service.toLowerCase()}. People look for: {snippet.map((p, i) => <span key={p.id}>{i ? " · " : ""}<mark>{p.t}</mark></span>)}.</> : "Your search result will be written here as you add keywords."}</p>
            <u>Illustration of a search result</u>
          </div>
          {placedPieces.length > 0 && (
            <ul className="kwf-map" aria-label="Where each keyword fits">
              {placedPieces.map((p) => <li key={p.id}><b>{p.t}</b><span>{INTENT[p.i].page}</span></li>)}
            </ul>
          )}
          {placedPieces.length >= TARGET && <p className="kwf-done">Good start. These keywords now have a page each to be written for. A real plan also checks competition and search demand.</p>}
        </div>
      </div>
      <p className="kwf-note">This is a planning toy. The keywords are built from templates for your business type. It does not show search volume or your real position in search, and no tool can promise a ranking.</p>
    </div>
  );
}
