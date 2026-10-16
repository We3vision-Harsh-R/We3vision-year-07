"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APPS, DOCK, GROUPS, HOME_APPS, type App, type Group } from "./launcher-data";
import { Glyph } from "./glyph";

// THE LAUNCHER ("lnc-"): the home page of the website on a phone or a tablet, built like the iOS 26 home screen ("liquid glass").
// Page 1 = the home screen: two widgets, eight apps in a 4-column grid, the Search pill, the page dots and a dock of four. It does not scroll.
// Swipe left = page 2, the App Library: Suggestions, Recently Added and the groups of pages; a group opens as a folder. Tapping an app grows its icon to the
// full screen, then the page opens. The desktop version is not touched: this is hidden from 1024px up (CSS).

const hue = (n: number) => ({ "--off": n }) as CSSProperties;

function Ic({ app, mini }: { app: App; mini?: boolean }) {
  return <span className={`lnc-ic ${app.solid ? "is-c" : "is-w"} ${mini ? "lnc-mini" : ""}`} style={hue(app.off)}><Glyph name={app.glyph} /></span>;
}

/** a clock value that updates on its own, every `ms` milliseconds (only the component that uses it re-renders) */
function useNow(ms: number) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const t0 = window.setTimeout(() => setNow(new Date()), 0);
    const t = window.setInterval(() => setNow(new Date()), ms);
    return () => { window.clearTimeout(t0); window.clearInterval(t); };
  }, [ms]);
  return now;
}

/** the analog clock widget: the hands move on every frame (the second hand sweeps), without re-rendering anything */
function ClockWidget() {
  const now = useNow(30000);
  const hr = useRef<SVGGElement>(null);
  const mn = useRef<SVGGElement>(null);
  const sc = useRef<SVGGElement>(null);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const d = new Date();
      const s = d.getSeconds() + d.getMilliseconds() / 1000;
      const m = d.getMinutes() + s / 60;
      const h = (d.getHours() % 12) + m / 60;
      if (hr.current) hr.current.style.transform = `rotate(${h * 30}deg)`;
      if (mn.current) mn.current.style.transform = `rotate(${m * 6}deg)`;
      if (sc.current) sc.current.style.transform = `rotate(${s * 6}deg)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  const day = now ? now.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase() : "THU";
  const num = now ? now.getDate() : 15;
  return (
    <div className="lnc-wid lnc-clock" aria-label="Clock">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => <rect key={i} x="49" y="5" width={i % 3 === 0 ? 2.4 : 1.4} height={i % 3 === 0 ? 7 : 4.5} rx="0.8" transform={`rotate(${i * 30} 50 50)`} className="lnc-tick" />)}
        <g ref={hr} className="lnc-hand"><rect x="48.200" y="26" width="3.600" height="26" rx="1.800" /></g>
        <g ref={mn} className="lnc-hand"><rect x="48.800" y="14" width="2.400" height="38" rx="1.200" /></g>
        <g ref={sc} className="lnc-hand lnc-s"><rect x="49.500" y="12" width="1" height="42" rx="0.500" /></g>
        <circle cx="50" cy="50" r="3.200" className="lnc-pin" />
      </svg>
      <span className="lnc-clock-d"><small>{day}</small><b>{num}</b></span>
    </div>
  );
}

function Launcher() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<{ g: Group; r: DOMRect } | null>(null);
  const [closing, setClosing] = useState(false);
  const [launch, setLaunch] = useState<{ app: App; r: DOMRect } | null>(null);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const grow = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const drag = useRef<{ x: number; y: number; on: boolean; w: number; id: number; down?: boolean } | null>(null);
  const moved = useRef(false);

  // a phone has no scrolling page behind it: lock the page while the launcher is on screen
  useEffect(() => {
    document.documentElement.classList.add("lnc-lock");
    return () => document.documentElement.classList.remove("lnc-lock");
  }, []);

  // the swipe between the two pages
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (open || launch) return;
    drag.current = { x: e.clientX, y: e.clientY, on: false, w: view.current?.clientWidth ?? 1, id: e.pointerId };
    moved.current = false;
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.on) {
      if (page === 0 && dy > 14 && dy > Math.abs(dx) * 1.5) { d.down = true; moved.current = true; return; }
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        d.on = true;
        moved.current = true;
        view.current?.setPointerCapture(d.id);
        track.current.style.transition = "none";
      } else return;
    }
    const base = page === 1 ? -d.w : 0;
    let x = base + dx;
    if (x > 0) x = x * 0.35;
    if (x < -d.w) x = -d.w + (x + d.w) * 0.35;
    track.current.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (d && d.down && e.clientY - d.y > 80) { setPage(1); window.setTimeout(() => input.current?.focus(), 450); window.setTimeout(() => { moved.current = false; }, 60); return; }
    if (d && d.down) { window.setTimeout(() => { moved.current = false; }, 60); return; }
    if (!d || !d.on || !track.current) return;
    const dx = e.clientX - d.x;
    track.current.style.transition = "";
    track.current.style.transform = "";
    setPage(dx < -d.w * 0.18 ? 1 : dx > d.w * 0.18 ? 0 : page);
    window.setTimeout(() => { moved.current = false; }, 60);
  };
  const stopClick = (e: RMouseEvent) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } };

  // an app opens: its icon grows to fill the screen, then the page loads
  const go = (e: RMouseEvent<HTMLAnchorElement>, app: App) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || moved.current) return;
    e.preventDefault();
    const el = (e.currentTarget.querySelector(".lnc-ic") ?? e.currentTarget) as HTMLElement;
    setLaunch({ app, r: el.getBoundingClientRect() });
  };
  useLayoutEffect(() => {
    if (!launch) return;
    const el = grow.current;
    if (!el) return;
    const r = launch.r;
    const a = el.animate(
      [
        { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: `${r.width * 0.23}px` },
        { left: "0px", top: "0px", width: "100vw", height: "100dvh", borderRadius: "0px" },
      ],
      { duration: 440, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" },
    );
    router.prefetch(launch.app.href);
    const t = window.setTimeout(() => router.push(launch.app.href), 380);
    a.onfinish = () => undefined;
    return () => window.clearTimeout(t);
  }, [launch, router]);

  // a group opens as a folder: it grows out of its tile
  const openGroup = (g: Group, el: HTMLElement) => { setClosing(false); setOpen({ g, r: el.getBoundingClientRect() }); };
  useLayoutEffect(() => {
    if (!open || closing) return;
    const p = panel.current;
    if (!p) return;
    const b = p.getBoundingClientRect();
    const dx = open.r.left + open.r.width / 2 - (b.left + b.width / 2);
    const dy = open.r.top + open.r.height / 2 - (b.top + b.height / 2);
    p.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${open.r.width / b.width}, ${open.r.height / b.height})`, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 560, easing: "cubic-bezier(0.32, 0.72, 0, 1)" });
  }, [open, closing]);
  const closeGroup = () => {
    const p = panel.current;
    if (!open || !p) { setOpen(null); return; }
    setClosing(true);
    const b = p.getBoundingClientRect();
    const dx = open.r.left + open.r.width / 2 - (b.left + b.width / 2);
    const dy = open.r.top + open.r.height / 2 - (b.top + b.height / 2);
    const a = p.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${open.r.width / b.width}, ${open.r.height / b.height})`, opacity: 0 }], { duration: 400, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" });
    a.onfinish = () => { setOpen(null); setClosing(false); };
  };

  const groupOf = useMemo(() => {
    const m: Record<string, string> = {};
    for (const g of GROUPS) for (const id of g.apps) if (!m[id] && g.id !== "sug" && g.id !== "new") m[id] = g.label;
    return m;
  }, []);
  const found = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return Object.values(APPS).filter((a) => a.label.toLowerCase().includes(s) || a.href.toLowerCase().includes(s)).sort((a, b) => a.label.localeCompare(b.label));
  }, [q]);

  const AppLink = ({ app }: { app: App }) => (
    <Link href={app.href} className="lnc-app" style={hue(app.off)} onClick={(e) => go(e, app)}>
      <Ic app={app} /><span className="lnc-lb">{app.label}</span>
    </Link>
  );

  return (
    <div className="lnc" role="application" aria-label="We3vision home screen">
      <div className="lnc-wall" aria-hidden="true"><i /><i /><i /></div>

      <div ref={view} className={`lnc-view ${launch ? "is-leaving" : ""}`} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClickCapture={stopClick}>
        <div ref={track} className="lnc-track" data-page={page}>
          {/* ------------------------------------------------ page 1: the home screen */}
          <section className="lnc-page lnc-home" aria-label="Home screen">
            <div className="lnc-widgets">
              <ClockWidget />
              <Link href="/contact" className="lnc-wid lnc-pitch" onClick={(e) => go(e, APPS.contact)}>
                <Image src="/brand/logo-white.webp" alt="" width={600} height={468} unoptimized />
                <b>Have an idea?<br />Let&apos;s build it.</b>
                <span>Start a project</span>
              </Link>
              <div className="lnc-wid lnc-quick" aria-label="Popular services">
                <small>Popular</small>
                <div>{["web", "app", "ai", "seo"].map((id) => <Link key={id} href={APPS[id].href} className="lnc-q" style={hue(APPS[id].off)} onClick={(e) => go(e, APPS[id])}><Ic app={APPS[id]} mini /></Link>)}</div>
              </div>
            </div>
            <div className="lnc-grid">{HOME_APPS.map((id) => <AppLink key={id} app={APPS[id]} />)}</div>
            <div className="lnc-fill" />
            <button type="button" className="lnc-find" onClick={() => { setPage(1); window.setTimeout(() => input.current?.focus(), 450); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.500" /><path d="M16 16l4.500 4.500" /></svg>Search
            </button>
            <div className="lnc-dots" role="tablist" aria-label="Screens">
              <button type="button" role="tab" aria-selected={page === 0} className={page === 0 ? "is-on" : ""} onClick={() => setPage(0)} aria-label="Home screen" />
              <button type="button" role="tab" aria-selected={page === 1} className={page === 1 ? "is-on" : ""} onClick={() => setPage(1)} aria-label="App Library" />
            </div>
            <nav className="lnc-dock" aria-label="Main pages">
              {DOCK.map((id) => id === "services" ? (
                <button key={id} type="button" className="lnc-app" style={hue(0)} onClick={() => setPage(1)}>
                  <span className="lnc-ic is-c" style={hue(300)}><Glyph name="services" /></span><span className="lnc-lb">Services</span>
                </button>
              ) : <AppLink key={id} app={APPS[id]} />)}
            </nav>
          </section>

          {/* ------------------------------------------------ page 2: the App Library */}
          <section className="lnc-page lnc-lib" aria-label="App Library">
            <label className="lnc-search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.500" /><path d="M16 16l4.500 4.500" /></svg>
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="App Library" aria-label="Search the App Library" />
              {q && <button type="button" onClick={() => setQ("")} aria-label="Clear">×</button>}
            </label>
            <div className="lnc-lib-scroll">
              {q.trim() ? (
                <ul className="lnc-list">
                  {found.length ? found.map((a) => (
                    <li key={a.id}><Link href={a.href} style={hue(a.off)} onClick={(e) => go(e, a)}><Ic app={a} /><span>{a.label}</span><small>{groupOf[a.id] ?? ""}</small></Link></li>
                  )) : <li className="lnc-none">No page found</li>}
                </ul>
              ) : (
                <div className="lnc-groups">
                  {GROUPS.map((g) => (
                    <div key={g.id} className="lnc-group">
                      <button type="button" className="lnc-tile" onClick={(e) => openGroup(g, e.currentTarget)} aria-label={`Open ${g.label}`}>
                        {g.apps.slice(0, 3).map((id) => <Ic key={id} app={APPS[id]} mini />)}
                        {g.apps.length > 4 ? (
                          <span className="lnc-cluster">{g.apps.slice(3, 7).map((id) => <span key={id} className={`lnc-ic lnc-micro ${APPS[id].solid ? "is-c" : "is-w"}`} style={hue(APPS[id].off)} />)}</span>
                        ) : g.apps[3] ? <Ic app={APPS[g.apps[3]]} mini /> : <span />}
                      </button>
                      <span className="lnc-gl">{g.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* the folder */}
      {open && (
        <div className={`lnc-fold ${closing ? "is-closing" : ""}`} onClick={closeGroup}>
          <p className="lnc-fold-t">{open.g.label}</p>
          <div ref={panel} className="lnc-fold-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={open.g.label}>
            <div className="lnc-fold-grid">{open.g.apps.map((id) => <AppLink key={id} app={APPS[id]} />)}</div>
          </div>
        </div>
      )}

      {/* the app that is opening */}
      {launch && (
        <div ref={grow} className="lnc-grow" style={{ ...hue(launch.app.off), left: launch.r.left, top: launch.r.top, width: launch.r.width, height: launch.r.height }} aria-hidden="true">
          <Glyph name={launch.app.glyph} />
        </div>
      )}
    </div>
  );
}

/** the launcher shows only on the home page (and only on a phone or a tablet: the CSS hides it from 1024px up) */
export function MobileLauncher() {
  const path = usePathname();
  if (path !== "/") return null;
  return <Launcher />;
}
