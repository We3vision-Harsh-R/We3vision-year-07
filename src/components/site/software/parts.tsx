"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Btn, v } from "../marketing/kit";
import { SDV_CLOUD, SDV_FOLDERS, SDV_GATES, SDV_INDUSTRIES, SDV_PHASES, SDV_STAGES, SDV_TOOLS_FLAT } from "./software-data";

// The interactive parts of the Software page ("sdv-"), version 4: a workflow run (like a CI pipeline), floating glass tools with physics, a sprint board for the
// 15 days, a cloud map that scales, a builder that assembles an app, a merge gate that can fail, a ring of industries and a command palette for the FAQ.

/* ------------------------------------------------------------------------------------------------------------------------------ the workflow, as a git history */
const GX = (i: number) => 80 + i * 157;
const GM = 84;
const HASH = ["a3f9c2e", "7b1d04c", "e82fa91", "4c60d3b", "91ae7f2", "d5b3c08", "2f7e6a4"];
const TAGS: Record<number, string> = { 5: "v1.0", 6: "v1.1" };
export function GitFlow({ k, onPick }: { k: number; onPick: (i: number) => void }) {
  const st = SDV_STAGES[k];
  const lanes = (
    <>
      <path d={`M${GX(0)} ${GM}H${GX(6)}`} />
      <path d={`M${GX(2)} ${GM}C${GX(2) + 34} ${GM},${GX(2) + 34} 26,${GX(2) + 70} 26L${GX(3) - 40} 26C${GX(3) - 6} 26,${GX(3) - 6} ${GM},${GX(3)} ${GM}`} />
      <path d={`M${GX(3)} ${GM}C${GX(3) + 34} ${GM},${GX(3) + 34} 140,${GX(3) + 70} 140L${GX(4) - 40} 140C${GX(4) - 6} 140,${GX(4) - 6} ${GM},${GX(4)} ${GM}`} />
      <circle className="mini" cx={GX(2) + 110} cy="26" r="5" /><circle className="mini" cx={GX(3) + 110} cy="140" r="5" />
    </>
  );
  return (
    <div className="sdv-gf">
      <svg className="sdv-gf-g" viewBox="0 0 1100 218" role="group" aria-label="The git history of a project, from discover to support">
        <defs><clipPath id="sdv-gf-clip"><rect x="0" y="0" width="1100" height="218" style={{ transform: `scaleX(${(GX(k) + 14) / 1100})`, transformOrigin: "0 0", transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }} /></clipPath></defs>
        <g className="sdv-gf-dim">{lanes}</g>
        <g className="sdv-gf-lit" clipPath="url(#sdv-gf-clip)">{lanes}</g>
        <g className="sdv-gf-flow" clipPath="url(#sdv-gf-clip)"><path d={`M${GX(0)} ${GM}H${GX(6)}`} /></g>
        <text className="sdv-gf-br" x={GX(2) + 78} y="14" textAnchor="middle">feature/screens</text>
        <text className="sdv-gf-br" x={GX(3) + 78} y="162" textAnchor="middle">feature/orders</text>
        <text className="sdv-gf-br main" x={GX(0)} y="58" textAnchor="start">main</text>
        {SDV_STAGES.map((s, i) => (
          <g key={s.k} className={`sdv-gf-n ${i < k ? "is-done" : ""} ${i === k ? "is-on" : ""}`} role="button" tabIndex={0} aria-label={`${s.t}: go to this commit`} onClick={() => onPick(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(i); } }}>
            {i === k && <circle className="halo" cx={GX(i)} cy={GM} r="14" />}
            <circle className="hit" cx={GX(i)} cy={GM} r="30" />
            <circle className="dot" cx={GX(i)} cy={GM} r={i === k ? 12 : 9} />
            <text className="nm" x={GX(i)} y="188" textAnchor="middle">{s.t}</text>
            <text className="hs" x={GX(i)} y="208" textAnchor="middle">{i === k ? "HEAD · " : ""}{HASH[i]}</text>
            {TAGS[i] && i <= k && <g className="tag"><rect x={GX(i) - 25} y={GM - 48} width="50" height="24" rx="12" /><text x={GX(i)} y={GM - 31} textAnchor="middle">{TAGS[i]}</text></g>}
          </g>
        ))}
      </svg>
      <div className="sdv-gf-card" key={st.k}>
        <div className="sdv-gf-top"><h3>{st.t}</h3><p>{st.line}</p></div>
        <p className="sdv-gf-cmd"><b>$</b> {st.code}<u /></p>
        <div className="sdv-gf-cols">
          <div><p className="mkt-label">What we do</p><ul>{st.do.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><p className="mkt-label">Software and tools</p><ul className="mkt-chips">{st.tools.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><p className="mkt-label">You get</p><p className="sdv-gf-get">{st.get}</p></div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ the tools: orbit, then zero gravity */
const OR = 44;
const OG_RINGS = [
  { name: "Screens", names: ["Figma", "React.js", "Next.js"], fx: 0.4, fy: 0.46, w: 0.34 },
  { name: "Logic and data", names: ["Node.js", "Python", "REST APIs", "GraphQL", "PostgreSQL", "MySQL", "MongoDB"], fx: 0.72, fy: 0.75, w: -0.2 },
  { name: "Build and ship", names: ["VS Code", "Git", "GitHub", "Docker", "AWS"], fx: 1, fy: 1, w: 0.12 },
];
type Pl = { x: number; y: number; vx: number; vy: number; s: number; th: number; ring: number; drag: boolean };
type Gm = "orbit" | "zero";
const ringOf = (n: string) => OG_RINGS.findIndex((r) => r.names.includes(n));
export function Orbs({ onPick, sel }: { onPick: (i: number) => void; sel: number }) {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLButtonElement | null)[]>([]);
  const rings = useRef<(SVGEllipseElement | null)[]>([]);
  const pls = useRef<Pl[]>([]);
  const mode = useRef<Gm>("orbit");
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const drag = useRef<{ i: number; ox: number; oy: number; sx: number; sy: number; moved: boolean; hist: { x: number; y: number; t: number }[] } | null>(null);
  const [m, setM] = useState<Gm>("orbit");

  useEffect(() => {
    const c = box.current;
    if (!c) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spot = (o: Pl, w: number, h: number) => ({ x: w / 2 + OG_RINGS[o.ring].fx * (w / 2 - OR - 8) * Math.cos(o.th), y: h / 2 + OG_RINGS[o.ring].fy * (h / 2 - OR - 8) * Math.sin(o.th) });
    const w0 = c.clientWidth;
    const h0 = c.clientHeight;
    pls.current = SDV_TOOLS_FLAT.map((t) => {
      const ring = Math.max(0, ringOf(t.n));
      const slot = OG_RINGS[ring].names.indexOf(t.n);
      const o: Pl = { x: 0, y: 0, vx: 0, vy: 0, s: 1, th: (slot / OG_RINGS[ring].names.length) * Math.PI * 2 + ring * 0.9, ring, drag: false };
      const p = spot(o, w0, h0);
      o.x = p.x; o.y = p.y;
      return o;
    });
    let sw = 0, sh = 0;
    const paint = (w: number, h: number) => {
      if (w !== sw || h !== sh) {
        sw = w; sh = h;
        rings.current.forEach((e, k) => { if (!e) return; e.setAttribute("cx", String(w / 2)); e.setAttribute("cy", String(h / 2)); e.setAttribute("rx", String(OG_RINGS[k].fx * (w / 2 - OR - 8))); e.setAttribute("ry", String(OG_RINGS[k].fy * (h / 2 - OR - 8))); });
      }
      pls.current.forEach((o, i) => {
        const el = els.current[i];
        if (!el) return;
        el.style.transform = `translate3d(${(o.x - OR).toFixed(1)}px, ${(o.y - OR).toFixed(1)}px, 0) scale(${o.s.toFixed(3)})`;
        el.style.zIndex = o.drag ? "30" : String(Math.round(o.s * 10));
      });
    };
    paint(w0, h0);
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    let on = true;
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const w = c.clientWidth;
      const h = c.clientHeight;
      const free = mode.current === "zero";
      const os = pls.current;
      for (const o of os) {
        o.th += OG_RINGS[o.ring].w * dt * (free ? 0 : 1);
        if (o.drag) { o.s += (1.12 - o.s) * Math.min(1, 10 * dt); continue; }
        if (!free) {
          const p = spot(o, w, h);
          const k = Math.min(1, 6 * dt);
          o.x += (p.x - o.x) * k; o.y += (p.y - o.y) * k;
          const depth = (Math.sin(o.th) + 1) / 2;
          o.s += (0.93 + 0.17 * depth - o.s) * Math.min(1, 8 * dt);
          continue;
        }
        o.s += (1 - o.s) * Math.min(1, 6 * dt);
        if (ptr.current) {
          const dx = o.x - ptr.current.x;
          const dy = o.y - ptr.current.y;
          const d = Math.hypot(dx, dy);
          if (d < 150 && d > 1) { const f = (1 - d / 150) * 1000 * dt; o.vx += (dx / d) * f; o.vy += (dy / d) * f; }
        }
        o.x += o.vx * dt; o.y += o.vy * dt;
        if (o.x < OR) { o.x = OR; o.vx = Math.abs(o.vx) * 0.9; }
        if (o.x > w - OR) { o.x = w - OR; o.vx = -Math.abs(o.vx) * 0.9; }
        if (o.y < OR) { o.y = OR; o.vy = Math.abs(o.vy) * 0.9; }
        if (o.y > h - OR) { o.y = h - OR; o.vy = -Math.abs(o.vy) * 0.9; }
        o.vx *= 0.9985; o.vy *= 0.9985;
        if (Math.hypot(o.vx, o.vy) < 18) { o.vx += (Math.random() - 0.5) * 12; o.vy += (Math.random() - 0.5) * 12; }
      }
      if (free) {
        for (let i = 0; i < os.length; i++) for (let j = i + 1; j < os.length; j++) {
          const a = os[i], b = os[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          if (d >= OR * 2) continue;
          dx /= d; dy /= d;
          const push = (OR * 2 - d) / 2;
          if (!a.drag) { a.x -= dx * push; a.y -= dy * push; }
          if (!b.drag) { b.x += dx * push; b.y += dy * push; }
          const rv = (b.vx - a.vx) * dx + (b.vy - a.vy) * dy;
          if (rv < 0) { a.vx += dx * rv; a.vy += dy * rv; b.vx -= dx * rv; b.vy -= dy * rv; }
        }
      }
      paint(w, h);
      if (on) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => {
      const vis = es[0].isIntersecting;
      if (vis && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(tick); }
      if (!vis) { on = false; cancelAnimationFrame(raf); }
    }, { threshold: 0.1 });
    io.observe(c);
    raf = requestAnimationFrame(tick);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  const set = (n: Gm) => {
    if (n === mode.current) return;
    const c = box.current;
    if (n === "zero" && c) {
      /* the tools leave their orbits along the way they were moving */
      const w = c.clientWidth, h = c.clientHeight;
      pls.current.forEach((o) => {
        const r = OG_RINGS[o.ring];
        const a = r.fx * (w / 2 - OR - 8), b = r.fy * (h / 2 - OR - 8);
        o.vx = -a * Math.sin(o.th) * r.w * 3.2 + (Math.random() - 0.5) * 40;
        o.vy = b * Math.cos(o.th) * r.w * 3.2 + (Math.random() - 0.5) * 40;
      });
    }
    mode.current = n; setM(n);
  };
  const shake = () => { set("zero"); pls.current.forEach((o) => { o.vx += (Math.random() - 0.5) * 1300; o.vy += (Math.random() - 0.5) * 1300; }); };

  const down = (e: RPointerEvent<HTMLButtonElement>, i: number) => {
    const o = pls.current[i];
    const r = box.current?.getBoundingClientRect();
    if (!o || !r) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    o.drag = true;
    drag.current = { i, ox: e.clientX - r.left - o.x, oy: e.clientY - r.top - o.y, sx: e.clientX, sy: e.clientY, moved: false, hist: [] };
    e.currentTarget.classList.add("is-drag");
  };
  const move = (e: RPointerEvent<HTMLButtonElement>, i: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) ptr.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    const d = drag.current;
    if (!d || d.i !== i || !r) return;
    const o = pls.current[i];
    if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 5) d.moved = true;
    o.x = Math.max(OR, Math.min(r.width - OR, e.clientX - r.left - d.ox));
    o.y = Math.max(OR, Math.min(r.height - OR, e.clientY - r.top - d.oy));
    d.hist.push({ x: o.x, y: o.y, t: e.timeStamp });
    if (d.hist.length > 6) d.hist.shift();
  };
  const up = (e: RPointerEvent<HTMLButtonElement>, i: number) => {
    const d = drag.current;
    drag.current = null;
    e.currentTarget.classList.remove("is-drag");
    const o = pls.current[i];
    if (!d || !o) return;
    o.drag = false;
    if (!d.moved) { onPick(i); return; }
    const h = d.hist;
    if (mode.current === "zero" && h.length >= 2) { const a = h[0], z = h[h.length - 1]; const dt = Math.max(0.016, (z.t - a.t) / 1000); o.vx = Math.max(-1000, Math.min(1000, (z.x - a.x) / dt)); o.vy = Math.max(-1000, Math.min(1000, (z.y - a.y) / dt)); }
  };
  const t = SDV_TOOLS_FLAT[sel];
  const g = OG_RINGS[Math.max(0, ringOf(t.n))].name;

  return (
    <div className="sdv-og">
      <div className={`sdv-og-box ${m === "zero" ? "is-free" : ""}`} ref={box} onPointerMove={(e) => { const r = box.current?.getBoundingClientRect(); if (r) ptr.current = { x: e.clientX - r.left, y: e.clientY - r.top }; }} onPointerLeave={() => { ptr.current = null; }}>
        <svg className="sdv-og-rings" aria-hidden="true">{OG_RINGS.map((r, k) => <ellipse key={r.name} ref={(el) => { rings.current[k] = el; }} />)}</svg>
        <div className="sdv-og-core" aria-hidden="true"><i /><span>Your<br />software</span></div>
        {SDV_TOOLS_FLAT.map((x, i) => (
          <button key={x.n} ref={(el) => { els.current[i] = el; }} type="button" className={`sdv-orb ${sel === i ? "is-sel" : ""}`} style={v({ "--h": x.h })} onPointerDown={(e) => down(e, i)} onPointerMove={(e) => move(e, i)} onPointerUp={(e) => up(e, i)} onPointerCancel={(e) => up(e, i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(i); } }}><span>{x.n}</span></button>
        ))}
      </div>
      <div className="sdv-og-card" key={sel} aria-live="polite"><small>{g}</small><b>{t.n}</b><p>{t.why}</p></div>
      <div className="sdv-og-ctl" role="group" aria-label="Gravity">
        <button type="button" className={m === "orbit" ? "is-on" : ""} aria-pressed={m === "orbit"} onClick={() => set("orbit")}>Gravity on</button>
        <button type="button" className={`${m === "zero" ? "is-on" : "glow"}`} aria-pressed={m === "zero"} onClick={() => set("zero")}>Zero gravity</button>
        <button type="button" onClick={shake}>Shake</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ sprint board */
const CARDS: { t: string; s: [number, number, number] }[] = [
  { t: "Agree the scope", s: [1, 2, 3] },
  { t: "Design the screens", s: [3, 4, 5] },
  { t: "Login and roles", s: [5, 6, 8] },
  { t: "Main screens", s: [5, 9, 11] },
  { t: "Reports and dashboard", s: [8, 10, 12] },
  { t: "Test everything", s: [11, 12, 13] },
  { t: "Go live", s: [13, 14, 14] },
  { t: "Train your team", s: [14, 15, 15] },
];
const COLS = ["To do", "In progress", "In review", "Done"];
export function Sprint() {
  const [day, setDay] = useState(7);
  const [play, setPlay] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  /* start by itself, once, when the board comes into view */
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      setDay(1);
      setPlay(true);
    }, { threshold: 0.55 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setDay((d) => { if (d >= 15) { setPlay(false); return 15; } return d + 1; }), 650);
    return () => clearInterval(t);
  }, [play]);
  const ph = SDV_PHASES.find((p) => day >= p.from && day <= p.to) ?? SDV_PHASES[0];
  const col = (s: [number, number, number]) => (day < s[0] ? 0 : day < s[1] ? 1 : day < s[2] ? 2 : 3);
  const done = CARDS.filter((c) => col(c.s) === 3).length;
  return (
    <div className="sdv-sp" ref={root}>
      <div className="sdv-sp-top">
        <p className="sdv-sp-price"><span>₹</span>40,000<em>in just <b>15 days</b></em></p>
        <div className="sdv-sp-day"><button type="button" className={play && day < 15 ? "is-play" : ""} onClick={() => { if (day >= 15) { setDay(1); setPlay(true); } else setPlay(!play); }}>{play && day < 15 ? "❚❚ Pause" : day >= 15 ? "↻ Play again" : "▶ Play the 15 days"}</button><b>Day {day}<small> / 15</small></b></div>
      </div>
      <input type="range" min={1} max={15} value={day} onChange={(e) => { setPlay(false); setDay(Number(e.target.value)); }} aria-label="Day of the project" />
      <p className="sdv-sp-ph" key={ph.t} aria-live="polite"><b>{ph.t}.</b> {ph.d}</p>
      <div className="sdv-board">
        {COLS.map((c, ci) => (
          <div key={c} className="sdv-bc"><p>{c}<em>{CARDS.filter((x) => col(x.s) === ci).length}</em></p>
            <ul>{CARDS.filter((x) => col(x.s) === ci).map((x) => <li key={x.t} className={`c${ci}`}>{ci === 3 ? "✓ " : ""}{x.t}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="sdv-sp-bar"><i style={{ width: `${(done / CARDS.length) * 100}%` }} /></div>
      <div className="sdv-sp-cta"><Btn href="#contact">Start your 15 days</Btn><small>One clearly agreed scope, set on day 1. A bigger system is planned in stages.</small></div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ AWS that scales */
const NODES = [
  { x: 40, y: 120, w: 128, k: "users" }, { x: 214, y: 120, w: 128, k: "cdn" }, { x: 388, y: 120, w: 128, k: "lb" }, { x: 562, y: 100, w: 150, k: "app" }, { x: 790, y: 40, w: 128, k: "db" }, { x: 790, y: 190, w: 128, k: "files" },
];
const WIRES: [number, number, number, number][] = [[168, 150, 214, 150], [342, 150, 388, 150], [516, 150, 562, 150], [712, 150, 790, 70], [712, 150, 790, 220]];
export function Cloud() {
  const [sel, setSel] = useState(3);
  const [load, setLoad] = useState(2);
  const [auto, setAuto] = useState(true);
  const servers = auto ? Math.min(5, load) : 1;
  const pressure = load / servers; // 1 = calm, 5 = overloaded
  const slow = pressure > 2.6;
  const n = SDV_CLOUD.find((c) => c.k === NODES[sel].k) ?? SDV_CLOUD[0];
  const nodeText = (k: string) => SDV_CLOUD.find((c) => c.k === k);
  return (
    <div className="sdv-cl2">
      <svg viewBox="0 0 960 300" role="group" aria-label="A typical setup on AWS">
        {WIRES.map(([x1, y1, x2, y2], i) => {
          const d = `M${x1} ${y1} L${x2} ${y2}`;
          return (
            <g key={i}>
              <path className="wire" d={d} />
              {Array.from({ length: Math.min(6, load + 1) }).map((_, p) => <circle key={p} r="4.5" className={`pkt ${slow ? "slow" : ""}`}><animateMotion dur={`${slow ? 3 : 1.6}s`} begin={`${(p * 1.6) / (load + 1)}s`} repeatCount="indefinite" path={d} /></circle>)}
            </g>
          );
        })}
        {NODES.map((nd, i) => {
          const t = nodeText(nd.k);
          const h = nd.k === "app" ? 100 : 60;
          return (
            <g key={nd.k} className={`nd ${sel === i ? "is-on" : ""}`} role="button" tabIndex={0} aria-label={t?.t} onClick={() => setSel(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(i); } }}>
              <rect x={nd.x} y={nd.y} width={nd.w} height={h} rx="14" />
              <text x={nd.x + nd.w / 2} y={nd.y + 25} textAnchor="middle" className="t1">{t?.t}</text>
              <text x={nd.x + nd.w / 2} y={nd.y + 46} textAnchor="middle" className="t2">{t?.aws}</text>
              {nd.k === "app" && Array.from({ length: servers }).map((_, s) => <rect key={s} className={`srv ${slow ? "hot" : ""}`} x={nd.x + 75 - (servers * 18) / 2 + s * 18 + 1} y={nd.y + 62} width="14" height="22" rx="3" />)}
            </g>
          );
        })}
      </svg>
      <p className="sdv-cl-why" key={sel} aria-live="polite">{n.why}</p>
      <div className="sdv-sc">
        <label><span>Visitors</span><input type="range" min={1} max={5} value={load} onChange={(e) => setLoad(Number(e.target.value))} aria-label="How many visitors" /><b>{["A few", "Some", "Busy", "Very busy", "A big day"][load - 1]}</b></label>
        <button type="button" className={auto ? "is-on" : ""} aria-pressed={auto} onClick={() => setAuto(!auto)}>{auto ? "Auto-scaling: on" : "Auto-scaling: off"}</button>
        <p className={`sdv-sc-s ${slow ? "bad" : "ok"}`}><i aria-hidden="true" />{servers} {servers === 1 ? "server" : "servers"} · {slow ? "slowing down: add servers" : "fast and calm"}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ builder */
export function Builder() {
  const [t, setT] = useState(2);
  const fo = SDV_FOLDERS[t];
  const [on, setOn] = useState<string[]>(["Leads", "Sales"]);
  const mods = fo.modules;
  const active = mods.filter((m) => on.includes(m));
  const toggle = (m: string) => setOn((o) => (o.includes(m) ? o.filter((x) => x !== m) : [...o, m]));
  const pickType = (i: number) => { setT(i); setOn(SDV_FOLDERS[i].modules.slice(0, 2)); };
  return (
    <div className="sdv-bd">
      <div className="sdv-bd-t" role="tablist" aria-label="Kind of software">{SDV_FOLDERS.map((f, i) => <button key={f.k} type="button" role="tab" aria-selected={t === i} className={t === i ? "is-on" : ""} onClick={() => pickType(i)}>{f.name.replace(/-/g, " ")}</button>)}</div>
      <div className="sdv-app" aria-label="Your software, being built (a sample)">
        <div className="sdv-app-b"><i /><i /><i /><span>yourcompany.app</span></div>
        <div className="sdv-app-c">
          <ul className="sdv-side"><li className="is-on">Home</li>{active.map((m) => <li key={m}>{m}</li>)}<li className="is-fix">Login and roles</li></ul>
          <div className="sdv-grid" key={fo.k + active.join()}>
            <div className="sdv-w sdv-w-h"><b>Good morning</b><small>{active.length} {active.length === 1 ? "module" : "modules"} switched on</small></div>
            {active.map((m, i) => (
              <div key={m} className="sdv-w" style={v({ "--i": i })}>
                <b>{m}</b>
                {i % 3 === 0 && <div className="bars">{[38, 62, 48, 80, 56].map((h, k) => <u key={k} style={{ height: `${h}%` }} />)}</div>}
                {i % 3 === 1 && <div className="rows"><u /><u /><u /></div>}
                {i % 3 === 2 && <div className="ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="14" /><circle cx="18" cy="18" r="14" className="a" /></svg></div>}
              </div>
            ))}
            {active.length === 0 && <p className="sdv-empty">Switch on a module below.</p>}
          </div>
        </div>
      </div>
      <ul className="sdv-mods" aria-label="Modules">{mods.map((m) => <li key={m}><button type="button" aria-pressed={on.includes(m)} className={on.includes(m) ? "is-on" : ""} onClick={() => toggle(m)}>{on.includes(m) ? "✓ " : "+ "}{m}</button></li>)}</ul>
      <p className="sdv-bd-n">{fo.what}</p>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ merge gate */
type GateState = "idle" | "run" | "fail" | "pass" | "deploy" | "live";
export function Merge() {
  const [bug, setBug] = useState(false);
  const [st, setSt] = useState<GateState>("idle");
  const [step, setStep] = useState(0);
  const timer = useRef<number | null>(null);
  const clear = () => { if (timer.current) window.clearInterval(timer.current); timer.current = null; };
  useEffect(() => clear, []);
  const failAt = 1;
  const run = () => {
    clear(); setSt("run"); setStep(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      if (bug && i > failAt) { clear(); setStep(failAt + 1); setSt("fail"); return; }
      setStep(i);
      if (i >= SDV_GATES.length) { clear(); setSt("pass"); }
    }, 800);
  };
  const merge = () => {
    clear(); setSt("deploy"); setStep(100);
    let p = 0;
    timer.current = window.setInterval(() => { p += 20; setStep(100 + p); if (p >= 100) { clear(); setSt("live"); } }, 450);
  };
  const reset = () => { clear(); setBug(false); setSt("idle"); setStep(0); };
  const stat = (i: number) => (st === "idle" ? "wait" : st === "fail" ? (i < failAt ? "ok" : i === failAt ? "bad" : "wait") : st === "run" ? (i < step ? "ok" : i === step ? "run" : "wait") : "ok");
  return (
    <div className="sdv-mg">
      <div className="sdv-mg-h"><b>Pull request</b><span>feature / orders-report</span>
        <em className={st === "live" ? "live" : st === "fail" ? "bad" : st === "pass" || st === "deploy" ? "ok" : ""}>{st === "live" ? "Live" : st === "deploy" ? "Deploying" : st === "pass" ? "Ready to merge" : st === "fail" ? "Blocked" : st === "run" ? "Checking" : "Open"}</em></div>
      <ul className="sdv-mg-l">{SDV_GATES.map((g, i) => <li key={g.t} className={stat(i)}><i aria-hidden="true">{stat(i) === "ok" ? "✓" : stat(i) === "bad" ? "✕" : ""}</i><span><b>{g.t}</b><small>{stat(i) === "bad" ? "orders: expected 2 items, got 3. The merge is blocked." : g.d}</small></span></li>)}</ul>
      {(st === "deploy" || st === "live") && <div className="sdv-dep"><i style={{ width: `${Math.min(100, step - 100)}%` }} /><span>{st === "live" ? "✓ Live on the server" : "Deploying…"}</span></div>}
      <div className="sdv-mg-b">
        <button type="button" disabled={st === "run" || st === "deploy" || st === "live"} onClick={() => { setBug(!bug); setSt("idle"); setStep(0); clear(); }} className={bug ? "bugon" : ""}>{bug ? "Bug added: click to fix" : "Add a bug"}</button>
        <button type="button" disabled={st === "run" || st === "deploy" || st === "live"} onClick={run}>Run the checks</button>
        <button type="button" disabled={st !== "pass"} className="go" onClick={merge}>Merge and deploy</button>
        {(st === "live" || st === "fail") && <button type="button" onClick={reset}>Start again</button>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ industries: a line of stations */
const SHORT = ["Manufacturing", "Jewellery", "Textile", "Education", "Healthcare", "Logistics", "Real estate", "Startups"];
export function Ring() {
  const [i, setI] = useState(3);
  const [st, setSt] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const hold = useRef(0);
  const vis = useRef(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => { vis.current = es[0].isIntersecting; }, { threshold: 0.35 });
    io.observe(el);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = reduce ? 0 : window.setInterval(() => { if (vis.current && Date.now() > hold.current) setSt((s) => (s + 1) % 5); }, 2400);
    return () => { io.disconnect(); if (t) window.clearInterval(t); };
  }, []);
  const ind = SDV_INDUSTRIES[i];
  const n = ind.tasks.length;
  const cur = Math.min(st, n - 1);
  const task = ind.tasks[cur];
  const pct = (cur / (n - 1)) * 100;
  const pause = (ms: number) => { hold.current = Date.now() + ms; };
  return (
    <div className="sdv-mt" ref={root} onPointerMove={() => pause(3500)}>
      <div className="sdv-mt-t" role="tablist" aria-label="Industry">
        {SDV_INDUSTRIES.map((x, k) => <button key={x.name} type="button" role="tab" aria-selected={i === k} className={i === k ? "is-on" : ""} onClick={() => { setI(k); setSt(0); pause(6000); }} title={x.name}>{SHORT[k]}</button>)}
      </div>
      <p className="sdv-mt-l" key={ind.name} role="tabpanel">{ind.name}: {ind.lead}</p>
      <div className="sdv-mt-line">
        <div className="sdv-mt-trk" aria-hidden="true"><i style={{ width: `${pct}%` }} /><u style={{ left: `${pct}%` }} /></div>
        <ol key={ind.name}>
          {ind.tasks.map((x, k) => (
            <li key={x.t} className={k === cur ? "is-on" : k < cur ? "is-done" : ""} style={v({ "--i": k })}>
              <button type="button" onClick={() => { setSt(k); pause(7000); }}><span>{k < cur ? "✓" : k + 1}</span><b>{x.t}</b></button>
            </li>
          ))}
        </ol>
      </div>
      <div className="sdv-mt-card" key={ind.name + cur} aria-live="polite"><small>Step {cur + 1} of {n}</small><b>{task.t}</b><p>{task.d}</p></div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ command palette */
export function Palette({ items }: { items: { q: string; a: string }[] }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const res = useMemo(() => { const s = q.trim().toLowerCase(); return s ? items.filter((x) => (x.q + " " + x.a).toLowerCase().includes(s)) : items; }, [q, items]);
  const cur = res[Math.min(sel, Math.max(0, res.length - 1))];
  const mark = (t: string) => {
    const s = q.trim();
    if (!s) return t;
    const k = t.toLowerCase().indexOf(s.toLowerCase());
    return k < 0 ? t : <>{t.slice(0, k)}<mark>{t.slice(k, k + s.length)}</mark>{t.slice(k + s.length)}</>;
  };
  return (
    <div className="sdv-pl" onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setSel((x) => Math.min(res.length - 1, x + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setSel((x) => Math.max(0, x - 1)); } }}>
      <label className="sdv-pl-i"><span aria-hidden="true">⌘ K</span><input value={q} onChange={(e) => { setQ(e.target.value); setSel(0); }} placeholder="Ask anything about custom software…" aria-label="Search the questions" /></label>
      <div className="sdv-pl-b">
        <ul role="listbox" aria-label="Questions">{res.length ? res.map((x, k) => <li key={x.q}><button type="button" role="option" aria-selected={k === sel} className={k === sel ? "is-on" : ""} onClick={() => setSel(k)}>{mark(x.q)}</button></li>) : <li className="none">No question found. Try another word.</li>}</ul>
        {cur && <div className="sdv-pl-a" key={cur.q}><b>{cur.q}</b><p>{cur.a}</p></div>}
      </div>
      <p className="sdv-pl-k"><kbd>↑</kbd><kbd>↓</kbd> to move · type to search</p>
    </div>
  );
}

export { Fragment };
