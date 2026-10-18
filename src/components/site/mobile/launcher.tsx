"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from "react";
import { useRouter } from "next/navigation";
import { isMobileApp } from "@/lib/device";
import { APPS, DOCK, GROUP, GROUPS, SERVICES, WIDGETS, type App, type DockId, type Group, type WidgetKind } from "./launcher-data";
import { MAX_PAGES, added, defaultSaved, fit, freeNear, freeze, loadSaved, pack, persist, prune, same, sizeOf, without, type Icons, type Item, type Page, type Saved, type Slot, type Wall } from "./launcher-state";
import { Glyph } from "./glyph";
import { ShareHost, openShare } from "./app/share-sheet";
import { CalendarHost } from "./calendar-pop";
import { haptic, type Haptic } from "./haptics";
import { WIDGET_CLASS, WidgetInner, widgetLink, type Contact } from "./launcher-widgets";
import { Ic, hue } from "./launcher-ic";
import { Customize, Sheet, WallLayer, tintOf, type SheetTab } from "./launcher-sheet";

// THE LAUNCHER ("lnc-"): the home page of the website on a phone or a tablet, built like the iOS 26 home screen ("liquid glass").
// Screen 1 = Home: widgets and the company pages. Screen 2 = Services: one folder card for every group of services.
// Screen 3 = the App Library: every page of the website, in groups, searchable. More screens appear when the visitor needs them.
// Press and hold an app: a menu (open, share, edit, remove) appears. Hold on, drag, or choose "Edit Home Screen": the apps wiggle and can be dragged
// anywhere, onto another screen too; "+" adds widgets and changes the wallpaper. All of it is kept in the browser (launcher-state.ts).
// Tapping an app grows its icon to the full screen and turns into the colour of the website, then the page opens.
// The laptop site is not touched: this is a separate "app" (src/app/(m)) that a phone is sent to by src/proxy.ts.

const buzz = (kind: Haptic = "light") => haptic(kind);
const hash = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };

type Ctx = "home" | "lib" | "dock";
type Menu = { item: Item; ctx: Ctx; r: DOMRect };
type Launch = { href: string; glyph: string; off: number; solid: boolean; r: DOMRect };
type Metrics = { u: number; cols: number; side: number; W: number; gx: number; cellW: number; pitch: number; ic: number; vw: number; vh: number };
type Press = { item: Item; ctx: Ctx; sx: number; sy: number; el: HTMLElement; timer: number; long: boolean; moved: boolean; canDrag: boolean; act: boolean };
type Drag = { item: Item; draft: Page[]; w: number; h: number; x: number; y: number };
type DragRef = { ox: number; oy: number; cx: number; cy: number; edge: number; flip: number; ghost: { p: number; x: number; y: number } };

// widgets and folders: the Figma iOS 27 home screen sizes (node 544:199447). On the iPhone 17 (402 pt) a small widget is 164.67 square,
// a wide one 349.67 x 164.33, 20.33 between them, the band 1.67 wider than the icon columns. Never taller than two rows minus room
// for the name under it (so the name never touches the next row); a short screen gets slightly smaller widgets, centred.
const FIG_SQ = 164.67;
function wgeo(mt: Metrics) {
  const n = mt.cols / 2;
  const gap = 20.33 * mt.u;
  const sq = Math.min((mt.W + 1.67 * mt.u - (n - 1) * gap) / n, 2 * mt.pitch - 23 * mt.u);
  const start = (mt.W - (n * sq + (n - 1) * gap)) / 2; // from the left edge of the icon columns
  return { n, gap, sq, start };
}

function measure(): Metrics {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const wide = vw >= 700;
  const u = wide ? 1.62 : Math.min(vw / 402, 1.12); // drawn for the iPhone 17 (402 x 874 pt): icons 60 pt, side 27 pt
  const cols = wide ? 6 : 4;
  const side = wide ? vw * 0.07 : 27 * u;
  const W = vw - 2 * side;
  const ic = 60 * u;
  const gx = (W - cols * ic) / (cols - 1);
  return { u, cols, side, W, gx, cellW: ic + gx, pitch: (vh <= 700 ? 88 : 97) * u, ic, vw, vh };
}

const IconPaths = {
  open: "M7 17L17 7 M9 7h8v8",
  share: "M12 15V4 M8 8l4-4 4 4 M5 12v7h14v-7",
  edit: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M17 14v6 M14 17h6",
  minus: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8 12h8",
  plus: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M8 12h8 M12 8v8",
  widget: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M16.500 13v7 M13 16.500h7",
  wall: "M4 5h16v14H4z M4 16l5-5 4 4 3-3 4 4",
  page: "M7 3.500h10a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z M12 9v6 M9 12h6",
};
function Mi({ d }: { d: keyof typeof IconPaths }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={IconPaths[d]} /></svg>;
}

export function Launcher({ contact = null }: { contact?: Contact | null }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<Saved>({ ...defaultSaved(), pages: [] });
  const [cust, setCust] = useState(false);
  const [m, setM] = useState<Metrics | null>(null);
  const [rows, setRows] = useState(0);
  const [page, setPage] = useState(0);
  const [edit, setEdit] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [sheet, setSheet] = useState<SheetTab | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<{ g: Group; r: DOMRect } | null>(null);
  const [closing, setClosing] = useState(false);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [toast, setToast] = useState("");
  const [emenu, setEmenu] = useState<{ x: number; y: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [dotsOn, setDotsOn] = useState(false); // like iOS 26: the Search pill turns into the page dots for a moment when the screen changes
  const dotsTimer = useRef(0);

  const root = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const grow = useRef<HTMLDivElement>(null);
  const dragger = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const hs = useRef<(HTMLDivElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number; on: boolean; w: number; id: number; down?: boolean } | null>(null);
  const press = useRef<Press | null>(null);
  const dr = useRef<DragRef | null>(null);
  const empty = useRef(0);
  const swiped = useRef(false);
  const toastTimer = useRef(0);
  // the newest state for the window listeners (they are created once per press)
  const live = useRef({ saved, shown: saved.pages, page, edit, m, rows, drag, menu });
  useEffect(() => { live.current = { ...live.current, saved, shown, page, edit, m, rows, drag, menu }; });

  const cols = m?.cols ?? 4;
  // what is shown: the saved arrangement fitted to this screen (a short screen pushes the last items to the next screen; a taller one brings them back). Only a change made by the visitor is kept.
  const shown = useMemo(() => (rows ? fit(saved.pages, cols, rows) : saved.pages), [saved.pages, cols, rows]);
  const pages = drag ? drag.draft : shown;
  const libIndex = pages.length; // after the home screens comes the App Library
  const nPages = pages.length + 1;

  // ------------------------------------------------------------------ start up: the saved arrangement, the screen size
  useEffect(() => {
    document.documentElement.classList.add("lnc-lock");
    const t = window.setTimeout(() => { setSaved(loadSaved()); setM(measure()); setReady(true); }, 0);
    const onSize = () => setM(measure());
    window.addEventListener("resize", onSize);
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) setLaunch(null); }; // back button: the page comes from the cache
    window.addEventListener("pageshow", onShow);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onSize);
      window.removeEventListener("pageshow", onShow);
      document.documentElement.classList.remove("lnc-lock");
    };
  }, []);

  /** a change of the arrangement: kept at once */
  const update = useCallback((fn: (s: Saved) => Saved) => {
    const next = fn(live.current.saved);
    live.current.saved = next;
    setSaved(next);
    if (!persist(next)) say("Your changes cannot be kept in this browser");
  }, []);

  function say(msg: string) {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  }

  const firstPage = useRef(true);
  useEffect(() => {
    if (firstPage.current) { firstPage.current = false; return; }
    buzz("select");
    const a = window.setTimeout(() => setDotsOn(true), 0);
    window.clearTimeout(dotsTimer.current);
    dotsTimer.current = window.setTimeout(() => setDotsOn(false), 1500);
    return () => window.clearTimeout(a);
  }, [page]);

  // how many rows fit on a screen (measured), and what does not fit moves to the next screen
  useLayoutEffect(() => {
    const el = hs.current[0];
    if (!ready || !el || !m) return;
    const h = el.clientHeight;
    const boxH = m.ic + 21 * m.u;
    const r = Math.max(2, Math.floor((h - boxH) / m.pitch) + 1);
    if (r !== rows) setRows(r);
  }, [ready, m, rows, pages.length, edit]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const on = () => {
      const kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      root.current?.style.setProperty("--kb", `${kb}px`);
      if (vv.offsetTop > 0 || vv.pageTop > 0) window.scrollTo(0, 0);
    };
    vv.addEventListener("resize", on);
    vv.addEventListener("scroll", on);
    return () => { vv.removeEventListener("resize", on); vv.removeEventListener("scroll", on); };
  }, []);

  // ------------------------------------------------------------------ opening a page: the icon grows, then turns into the colour of the website
  const warm = useCallback((href: string) => {
    if (href !== "/" && isMobileApp(href)) router.prefetch(href);
  }, [router]);
  const nav = useCallback((href: string) => {
    if (isMobileApp(href) && href !== "/") router.push(href);
    else window.location.assign(href);
  }, [router]);

  const launchTo = useCallback((href: string, glyph: string, offset: number, solid: boolean, r: DOMRect) => {
    setMenu(null);
    if (href === "/") { setPage(0); setOpen(null); return; }
    warm(href);
    buzz("light");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { nav(href); return; }
    setLaunch({ href, glyph, off: offset, solid, r });
  }, [nav, warm]);

  useLayoutEffect(() => {
    if (!launch) return;
    const g = grow.current;
    if (!g) return;
    const r = launch.r;
    const ease = "cubic-bezier(0.32, 0.72, 0, 1)";
    g.animate(
      [
        { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: `${r.width * 0.26}px` },
        { left: "0px", top: "0px", width: "100vw", height: "100dvh", borderRadius: "0px" },
      ],
      { duration: 460, easing: ease, fill: "forwards" },
    );
    g.querySelector(".lnc-grow-ic")?.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.9)" }], { duration: 380, easing: "ease-in", fill: "forwards" });
    g.querySelector(".lnc-grow-bg")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 90, easing: "ease-out", fill: "forwards" });
    const t = window.setTimeout(() => nav(launch.href), 420);
    return () => window.clearTimeout(t);
  }, [launch, nav]);

  // ------------------------------------------------------------------ folders (a group of pages opens from its card or its Library tile)
  const openGroup = (g: Group, el: HTMLElement) => { setClosing(false); setMenu(null); setOpen({ g, r: el.getBoundingClientRect() }); };
  useLayoutEffect(() => {
    if (!open || closing) return;
    const p = panel.current;
    if (!p) return;
    const b = p.getBoundingClientRect();
    const dx = open.r.left + open.r.width / 2 - (b.left + b.width / 2);
    const dy = open.r.top + open.r.height / 2 - (b.top + b.height / 2);
    p.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${open.r.width / b.width}, ${open.r.height / b.height})`, opacity: 0.2 }, { transform: "none", opacity: 1 }], { duration: 520, easing: "cubic-bezier(0.32, 0.72, 0, 1)" });
  }, [open, closing]);
  const closeGroup = () => {
    const p = panel.current;
    if (!open || !p) { setOpen(null); return; }
    setClosing(true);
    const b = p.getBoundingClientRect();
    const dx = open.r.left + open.r.width / 2 - (b.left + b.width / 2);
    const dy = open.r.top + open.r.height / 2 - (b.top + b.height / 2);
    const a = p.animate([{ transform: "none", opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(${open.r.width / b.width}, ${open.r.height / b.height})`, opacity: 0 }], { duration: 360, easing: "cubic-bezier(0.5, 0, 0.75, 0)", fill: "forwards" });
    a.onfinish = () => { setOpen(null); setClosing(false); };
  };

  // ------------------------------------------------------------------ what a tap does
  const tap = (p: Press) => {
    const it = p.item;
    if (it.k === "app") {
      const app = APPS[it.id];
      const ic = (p.el.querySelector(".lnc-ic") ?? p.el) as HTMLElement;
      launchTo(app.href, app.glyph, app.off, !!app.solid, ic.getBoundingClientRect());
    } else if (it.k === "folder") {
      openGroup(GROUP[it.id], (p.el.querySelector(".lnc-fcard") ?? p.el) as HTMLElement);
    } else if (it.k === "widget") {
      const l = widgetLink(it.id as WidgetKind, contact);
      if (l && l.ext) window.open(l.href, "_blank", "noopener,noreferrer");
      else if (l) launchTo(l.href, l.glyph, 0, true, p.el.getBoundingClientRect());
    }
  };
  /** a keyboard "click" on a link (a finger or a mouse is handled by the press, see below) */
  const onLink = (e: RMouseEvent, it: Item, el: HTMLElement) => {
    if ((e.target as Element).closest("[data-act]") && !live.current.edit) return;
    e.preventDefault();
    if (e.detail === 0 && !live.current.edit) tap({ item: it, ctx: "home", sx: 0, sy: 0, el, timer: 0, long: false, moved: false, canDrag: false, act: false });
  };

  // ------------------------------------------------------------------ the menu that opens on a long press
  const shareApp = (app: App) => openShare({ title: app.label, subtitle: "We3vision", url: `${window.location.origin}${app.href}`, glyph: app.glyph, off: app.off });
  const startEdit = () => { setMenu(null); setOpen(null); setEdit(true); if (live.current.page >= homeCount()) setPage(0); };
  const homeCount = () => live.current.shown.length;
  const libIndexOf = () => live.current.shown.length;
  const endEdit = () => {
    setEdit(false);
    setCust(false);
    update((s) => ({ ...s, pages: prune(s.pages) }));
    setPage((p) => Math.min(p, live.current.shown.length));
  };
  const addPage = () => {
    const L = live.current;
    if (L.saved.pages.length >= MAX_PAGES) { say("You can have up to " + MAX_PAGES + " home screens"); return; }
    update((s) => ({ ...s, pages: [...s.pages, { items: [] }] }));
    setPage(L.saved.pages.length);
  };
  const remove = (it: Item) => { update((s) => ({ ...s, pages: without(s.pages, it) })); setMenu(null); };
  const addHome = (it: Item) => {
    const L = live.current;
    update((s) => ({ ...s, pages: added(s.pages, it, L.m?.cols ?? 4, L.rows || 5) }));
    setMenu(null);
    setOpen(null);
    say("Added to Home Screen");
  };
  const addWidget = (k: WidgetKind) => {
    const L = live.current;
    const it: Item = { k: "widget", id: k };
    const next = added(L.saved.pages, it, L.m?.cols ?? 4, L.rows || 5);
    update((s) => ({ ...s, pages: next }));
    setPage(Math.max(0, next.findIndex((p) => p.items.some((x) => same(x, it)))));
    setSheet(null);
    say("Widget added");
  };
  const toggleApp = (id: string) => {
    const it: Item = { k: "app", id };
    if (onHomeNow(it)) update((s) => ({ ...s, pages: without(s.pages, it) }));
    else { const L = live.current; update((s) => ({ ...s, pages: added(s.pages, it, L.m?.cols ?? 4, L.rows || 5) })); }
  };
  const setWall = (w: Wall) => update((s) => ({ ...s, wall: w }));
  const setIcons = (i: Icons) => update((s) => ({ ...s, icons: i }));

  const actions = (mn: Menu) => {
    const it = mn.item;
    const out: { label: string; icon: keyof typeof IconPaths; run: () => void; danger?: boolean }[] = [];
    const el = () => document.querySelector<HTMLElement>(".lnc-lift") ?? document.body;
    const home = onHomeNow(it);
    if (it.k === "app") {
      const app = APPS[it.id];
      out.push({ label: "Open", icon: "open", run: () => launchTo(app.href, app.glyph, app.off, !!app.solid, (el().querySelector(".lnc-ic") ?? el()).getBoundingClientRect()) });
      out.push({ label: "Share", icon: "share", run: () => { setMenu(null); shareApp(app); } });
      if (mn.ctx === "home") out.push({ label: "Edit Home Screen", icon: "edit", run: startEdit });
      if (mn.ctx !== "dock") out.push(home ? { label: "Remove from Home Screen", icon: "minus", danger: true, run: () => remove(it) } : { label: "Add to Home Screen", icon: "plus", run: () => addHome(it) });
    } else if (it.k === "folder") {
      out.push({ label: "Open", icon: "open", run: () => openGroup(GROUP[it.id], el()) });
      out.push({ label: "Edit Home Screen", icon: "edit", run: startEdit });
      out.push({ label: "Remove from Home Screen", icon: "minus", danger: true, run: () => remove(it) });
    } else {
      out.push({ label: "Edit Home Screen", icon: "edit", run: startEdit });
      out.push({ label: "Remove Widget", icon: "minus", danger: true, run: () => remove(it) });
    }
    return out;
  };
  const onHomeNow = (it: Item) => live.current.saved.pages.some((p) => p.items.some((x) => same(x, it)));

  // ------------------------------------------------------------------ dragging an item (edit mode)
  const putDrag = (d: Drag | null) => { live.current.drag = d; setDrag(d); };
  const ghostOf = (it: Item): Item => ({ k: "ghost", id: it.id, of: it.k as "app" | "folder" | "widget", x: it.x, y: it.y });
  /** the empty place (the ghost) stands on cell (x, y) of screen `at`; it is taken away from every other screen */
  const withGhost = (pg: Page[], at: number, x: number, y: number, it: Item): Page[] => {
    const clean = pg.map((p) => ({ ...p, items: p.items.filter((i) => i.k !== "ghost") }));
    const target = clean[at];
    if (!target) return clean;
    clean[at] = { ...target, items: [...target.items, { ...ghostOf(it), x, y }] };
    return clean;
  };

  const startDrag = (p: Press, e: PointerEvent) => {
    const L = live.current;
    const r = p.el.getBoundingClientRect();
    // every item keeps its own cell from now on, so lifting one never moves another
    const cols = L.m?.cols ?? 4;
    const draft = L.shown.map((pg) => ({ ...pg, items: freeze(pg.items, cols).map((x) => (same(x, p.item) ? ghostOf(x) : x)) }));
    let at = 0;
    let gx = 0;
    let gy = 0;
    draft.forEach((pg, i) => pg.items.forEach((x) => { if (x.k === "ghost") { at = i; gx = x.x ?? 0; gy = x.y ?? 0; } }));
    buzz("medium");
    dr.current = { ox: e.clientX - r.left, oy: e.clientY - r.top, cx: r.left, cy: r.top, edge: 0, flip: 0, ghost: { p: at, x: gx, y: gy } };
    p.moved = true;
    window.clearTimeout(p.timer);
    buzz();
    try { view.current?.setPointerCapture(e.pointerId); } catch { /* the finger is already gone */ }
    setMenu(null);
    live.current.edit = true;
    setEdit(true);
    putDrag({ item: p.item, draft, w: r.width, h: r.height, x: r.left, y: r.top });
  };

  const retarget = (x: number, y: number) => {
    const L = live.current;
    const d = L.drag;
    const g = dr.current;
    const mt = L.m;
    if (!d || !g || !mt) return;
    const at = L.page;
    const el = hs.current[at];
    if (!el || at >= d.draft.length) return;
    const rect = el.getBoundingClientRect();
    const slots = pack(d.draft[at].items.filter((i) => i.k !== "ghost"), mt.cols);
    const { w, h } = sizeOf(d.item);
    // the cell under the finger (the middle of a big item is under the finger), then the nearest free cell: items never overlap
    const rows = L.rows || 5;
    const tx = Math.max(0, Math.min(mt.cols - w, Math.round((x - rect.left) / mt.cellW - w / 2)));
    const ty = Math.max(0, Math.min(Math.max(0, rows - h), Math.round((y - rect.top) / mt.pitch - 0.5 - (h - 1) / 2 + 0.0)));
    // a small icon over another small icon: they swap places (the other icon goes to the place that was just left)
    const over = slots.find((s) => tx >= s.x && tx < s.x + s.w && ty >= s.y && ty < s.y + s.h);
    const from = g.ghost.p === at ? { x: g.ghost.x, y: g.ghost.y } : null;
    if (over && from && w === 1 && h === 1 && over.w === 1 && over.h === 1 && over.item.k === "app") {
      const swapped = d.draft.map((pg, i) => (i === at ? { ...pg, items: pg.items.map((it) => (same(it, over.item) ? { ...it, x: from.x, y: from.y } : it.k === "ghost" ? { ...it, x: over.x, y: over.y } : it)) } : pg));
      g.ghost = { p: at, x: over.x, y: over.y };
      putDrag({ ...d, draft: swapped });
      return;
    }
    const spot = freeNear(slots, mt.cols, rows, w, h, tx, ty);
    if (!spot || (g.ghost.p === at && g.ghost.x === spot.x && g.ghost.y === spot.y)) return;
    g.ghost = { p: at, x: spot.x, y: spot.y };
    putDrag({ ...d, draft: withGhost(d.draft, at, spot.x, spot.y, d.item) });
  };

  const flip = (dir: number) => {
    const L = live.current;
    const d = L.drag;
    const g = dr.current;
    if (!d || !g) return;
    let draft = d.draft;
    let np = L.page + dir;
    if (np < 0) return;
    if (np >= draft.length) {
      if (dir < 0 || draft.length >= MAX_PAGES) return;
      draft = [...draft, { items: [] }];
      np = draft.length - 1;
    }
    g.edge = 0;
    const mt = L.m;
    const { w, h } = sizeOf(d.item);
    const spot = freeNear(pack(draft[np].items.filter((i) => i.k !== "ghost"), mt?.cols ?? 4), mt?.cols ?? 4, L.rows || 5, w, h, dir > 0 ? 0 : (mt?.cols ?? 4) - w, 0) ?? { x: 0, y: 0 };
    g.ghost = { p: np, x: spot.x, y: spot.y };
    setPage(np);
    live.current.page = np;
    putDrag({ ...d, draft: withGhost(draft, np, spot.x, spot.y, d.item) });
  };

  const moveDrag = (e: PointerEvent) => {
    const g = dr.current;
    const el = dragger.current;
    const mt = live.current.m;
    if (!g || !el || !mt) return;
    g.cx = e.clientX - g.ox;
    g.cy = e.clientY - g.oy;
    el.style.transform = `translate3d(${g.cx}px, ${g.cy}px, 0) scale(1.08)`;
    const edge = e.clientX < 28 ? -1 : e.clientX > mt.vw - 28 ? 1 : 0;
    if (edge !== g.edge) {
      g.edge = edge;
      window.clearTimeout(g.flip);
      if (edge) g.flip = window.setTimeout(() => flip(edge), 560);
    }
    retarget(e.clientX, e.clientY);
  };

  const dropDrag = () => {
    const g = dr.current;
    const d = live.current.drag;
    const el = dragger.current;
    if (!g || !d) return;
    window.clearTimeout(g.flip);
    const done = () => {
      buzz("light");
      const L = live.current;
      const real = d.draft.map((pg) => ({ ...pg, items: pg.items.map((x) => (x.k === "ghost" ? { k: d.item.k, id: d.item.id, x: x.x, y: x.y } : x)) }));
      const next = fit(real, L.m?.cols ?? 4, L.rows || 5);
      update((s) => ({ ...s, pages: next }));
      putDrag(null);
      dr.current = null;
    };
    const gh = root.current?.querySelector<HTMLElement>(".lnc-t.is-ghost");
    if (el && gh) {
      const r = gh.getBoundingClientRect();
      const a = el.animate([{ transform: `translate3d(${g.cx}px, ${g.cy}px, 0) scale(1.08)` }, { transform: `translate3d(${r.left}px, ${r.top}px, 0) scale(1)` }], { duration: 200, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" });
      let over = false;
      const finish = () => { if (!over) { over = true; done(); } };
      a.onfinish = finish;
      window.setTimeout(finish, 340); // the animation may not run in a hidden tab
    } else done();
  };

  // ------------------------------------------------------------------ one press on an app, a card or a widget: tap, hold (menu) or drag
  const pmove = useRef<(e: PointerEvent) => void>(() => undefined);
  const pup = useRef<(e: PointerEvent) => void>(() => undefined);
  useEffect(() => {
    pmove.current = (e) => {
      const p = press.current;
      if (!p) return;
      if (live.current.drag) { moveDrag(e); return; }
      const dist = Math.hypot(e.clientX - p.sx, e.clientY - p.sy);
      if (p.moved) return;
      if (dist > (live.current.edit ? 6 : 10)) {
        if (p.canDrag && (live.current.edit || p.long)) startDrag(p, e);
        else { p.moved = true; window.clearTimeout(p.timer); }
      }
    };
    pup.current = (e) => {
      const p = press.current;
      press.current = null;
      window.removeEventListener("pointermove", onMoveWin);
      window.removeEventListener("pointerup", onUpWin);
      window.removeEventListener("pointercancel", onUpWin);
      if (!p) return;
      window.clearTimeout(p.timer);
      if (live.current.drag) { dropDrag(); return; }
      if (p.long || p.moved || live.current.edit || p.act || e.type === "pointercancel") return;
      tap(p);
    };
  });
  const onMoveWin = useCallback((e: PointerEvent) => pmove.current(e), []);
  const onUpWin = useCallback((e: PointerEvent) => pup.current(e), []);

  const tileDown = (e: RPointerEvent<HTMLElement>, item: Item, ctx: Ctx, canDrag: boolean) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as Element).closest(".lnc-rm")) return;
    if (!live.current.edit && (e.target as Element).closest("[data-act]")) return; // a call, a link or a field inside a widget works by itself
    const el = e.currentTarget;
    const p: Press = { item, ctx, sx: e.clientX, sy: e.clientY, el, timer: 0, long: false, moved: false, canDrag, act: !!(e.target as Element).closest("[data-act]") };
    if (item.k === "app") warm(APPS[item.id].href); // start loading the page the moment the finger touches the icon
    press.current = p;
    if (!live.current.edit) {
      p.timer = window.setTimeout(() => {
        if (press.current !== p || p.moved) return;
        p.long = true;
        buzz();
        setMenu({ item, ctx, r: el.getBoundingClientRect() });
      }, 420);
    }
    window.addEventListener("pointermove", onMoveWin);
    window.addEventListener("pointerup", onUpWin);
    window.addEventListener("pointercancel", onUpWin);
  };

  // ------------------------------------------------------------------ the swipe between the screens
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (open || launch || sheet || drag || menu) return;
    const t = e.target as Element;
    if (live.current.edit && t.closest(".lnc-t")) return;
    swipe.current = { x: e.clientX, y: e.clientY, on: false, w: view.current?.clientWidth ?? 1, id: e.pointerId };
    swiped.current = false;
    // a long press on the empty part of a home screen starts the edit mode
    if (!live.current.edit && live.current.page < homeCount() && !t.closest(".lnc-t, button, a, input")) {
      window.clearTimeout(empty.current);
      const px = e.clientX;
      const py = e.clientY;
      empty.current = window.setTimeout(() => { if (swipe.current && !swipe.current.on && !swiped.current) { buzz("medium"); startEdit(); setEmenu({ x: px, y: py }); } }, 520);
    }
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = swipe.current;
    if (!d || !track.current || live.current.drag) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.on) {
      if (Math.hypot(dx, dy) > 10) window.clearTimeout(empty.current);
      if (live.current.page === 0 && !live.current.edit && dy > 14 && dy > Math.abs(dx) * 1.5) { d.down = true; swiped.current = true; return; }
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        d.on = true;
        swiped.current = true;
        window.clearTimeout(press.current?.timer);
        try { view.current?.setPointerCapture(d.id); } catch { /* the finger is already gone */ }
        track.current.style.transition = "none";
      } else return;
    }
    const n = live.current.shown.length + 1;
    const base = -live.current.page * d.w;
    const min = -(n - 1) * d.w;
    let x = base + dx;
    if (x > 0) x = x * 0.35;
    if (x < min) x = min + (x - min) * 0.35;
    track.current.style.transform = `translate3d(${x}px, 0, 0)`;
  };
  const onUp = (e: RPointerEvent<HTMLDivElement>) => {
    window.clearTimeout(empty.current);
    const d = swipe.current;
    swipe.current = null;
    if (d && d.down && e.clientY - d.y > 80) { buzz("light"); input.current?.focus({ preventScroll: true }); setPage(libIndexOf()); return; }
    if (!d || !d.on || !track.current) return;
    const n = live.current.shown.length + 1;
    const dx = e.clientX - d.x;
    const np = Math.max(0, Math.min(n - 1, live.current.page + (dx < -d.w * 0.18 ? 1 : dx > d.w * 0.18 ? -1 : 0)));
    track.current.style.transition = "";
    track.current.style.transform = `translate3d(${(-np * 100) / n}%, 0, 0)`;
    setPage(np);
  };
  const stopClick = (e: RMouseEvent) => { if (swiped.current) { e.preventDefault(); e.stopPropagation(); swiped.current = false; } };

  // ------------------------------------------------------------------ the pieces
  const groupOf = useMemo(() => {
    const o: Record<string, string> = {};
    for (const g of GROUPS) for (const id of g.apps) if (!o[id] && g.id !== "sug" && g.id !== "new") o[id] = g.label;
    return o;
  }, []);
  const found = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return Object.values(APPS).filter((a) => a.label.toLowerCase().includes(s) || a.href.toLowerCase().includes(s)).sort((a, b) => a.label.localeCompare(b.label));
  }, [q]);

  /** what a tile shows (also used for the lifted copy in the menu and the copy that follows the finger) */
  const tileBody = (it: Item, link: boolean) => {
    if (it.k === "app") {
      const app = APPS[it.id];
      return link ? (
        <a className="lnc-app" href={app.href} draggable={false}><Ic app={app} /><span className="lnc-lb">{app.label}</span></a>
      ) : (
        <span className="lnc-app"><Ic app={app} /><span className="lnc-lb">{app.label}</span></span>
      );
    }
    if (it.k === "folder") {
      const g = GROUP[it.id];
      return (
        <span className="lnc-fcard" style={hue(g.off)}>
          <span className="lnc-ic is-c lnc-fic"><Glyph name={g.glyph} /></span>
          <span className="lnc-fprev" aria-hidden="true">{g.apps.slice(0, 4).map((id) => <span key={id} className={`lnc-ic lnc-micro ${APPS[id].solid ? "is-c" : "is-w"}`} style={hue(APPS[id].off)} />)}</span>
          <span className="lnc-fc-t"><b>{g.label}</b><small>{g.apps.length} pages</small></span>
        </span>
      );
    }
    const k = it.id as WidgetKind;
    return (
      <span className="lnc-ww">
        <div className={`lnc-wid ${WIDGET_CLASS[k]} ${widgetLink(k, contact) ? "" : "lnc-nolink"}`}><WidgetInner kind={k} contact={contact} /></div>
        <span className="lnc-wl">{WIDGETS.find((w) => w.id === k)?.label}</span>
      </span>
    );
  };

  /** the four dock icons, as on an iPhone: Phone (call us), Messages (write to us), Services (a folder of every service), Library (the App Library) */
  const dockTap = (id: DockId, el: HTMLElement) => {
    const r = (el.querySelector(".lnc-ic") ?? el).getBoundingClientRect();
    if (live.current.edit) return;
    if (id === "msg") warm("/contact");
    if (id === "lib") { setPage(libIndexOf()); return; }
    if (id === "svc") { openGroup(SERVICES, el.querySelector(".lnc-ic") as HTMLElement ?? el); return; }
    if (id === "phone" && contact?.phoneHref) { window.location.href = `tel:${contact.phoneHref}`; return; }
    launchTo("/contact", id === "phone" ? "call" : "chat", id === "phone" ? -150 : -75, true, r);
  };
  const dockButton = (id: DockId) => {
    const label = id === "phone" ? "Phone" : id === "msg" ? "Messages" : id === "svc" ? "Services" : "App Library";
    const icon =
      id === "phone" ? <span className="lnc-ic is-c" style={hue(-150)}><Glyph name="call" /></span>
      : id === "msg" ? <span className="lnc-ic is-c" style={hue(-75)}><Glyph name="chat" /></span>
      : id === "svc" ? (
        <span className="lnc-ic is-glass"><span className="lnc-mg is-9">{SERVICES.apps.slice(0, 9).map((a) => <i key={a} className="lnc-mi" style={hue(APPS[a].off)} />)}</span></span>
      ) : (
        <span className="lnc-ic is-glass"><span className="lnc-mg is-4">{["dev", "cre", "eco", "bra"].map((g) => <i key={g} className="lnc-mi" style={hue(GROUP[g].off)} />)}</span></span>
      );
    return (
      <button key={id} type="button" className="lnc-dk" aria-label={label} onClick={(e) => dockTap(id, e.currentTarget)}>
        {icon}
      </button>
    );
  };

  const box = (s: Slot, mt: Metrics) => {
    const app = s.item.k === "app" || (s.item.k === "ghost" && s.item.of === "app");
    if (app || s.h !== 2) return { x: s.x * mt.cellW, y: s.y * mt.pitch, w: mt.cellW, h: mt.ic + 21 * mt.u };
    const g = wgeo(mt);
    const span = s.w / 2;
    // one column = half a widget step, so a widget on an odd column sits between two places, as before
    return { x: mt.gx / 2 + g.start + (s.x * (g.sq + g.gap)) / 2, y: s.y * mt.pitch, w: span * g.sq + (span - 1) * g.gap, h: g.sq };
  };

  const renderTile = (s: Slot, mt: Metrics) => {
    const it = s.item;
    const b = box(s, mt);
    const style = { width: b.w, height: b.h, transform: `translate3d(${b.x}px, ${b.y}px, 0)`, "--jd": `${-(hash(it.id) % 26) / 100}s` } as CSSProperties;
    if (it.k === "ghost") return <div key={`${it.of}:${it.id}`} className="lnc-t is-ghost" style={style} />;
    return (
      <div
        key={`${it.k}:${it.id}`}
        className={`lnc-t lnc-t-${it.k}`}
        style={style}
        onPointerDown={(e) => tileDown(e, it, "home", true)}
        onClick={(e) => onLink(e, it, e.currentTarget)}
      >
        {tileBody(it, true)}
        {edit && <button type="button" className="lnc-rm" onClick={(e) => { e.stopPropagation(); remove(it); }} aria-label="Remove"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10" /></svg></button>}
      </div>
    );
  };

  const slotsOf = (pg: Page) => (m ? pack(pg.items, m.cols) : []);
  const vars = m ? ({ "--u": `${m.u}px`, "--wu": `${wgeo(m).sq / FIG_SQ}px`, "--cols": m.cols, "--side": `${m.side}px`, "--pitch": `${m.pitch}px` } as CSSProperties) : undefined;

  const menuPos = (mn: Menu) => {
    const mt = m ?? measure();
    const w = 262 * mt.u;
    const h = 52 * mt.u * actions(mn).length;
    const below = mn.r.bottom + 12 + h < mt.vh - 16;
    const left = Math.max(14, Math.min(mt.vw - w - 14, mn.r.left));
    const ox = Math.max(20, Math.min(w - 20, mn.r.left + mn.r.width / 2 - left));
    return { left, top: below ? mn.r.bottom + 12 : Math.max(14, mn.r.top - 12 - h), width: w, transformOrigin: `${ox}px ${below ? "0" : "100%"}` };
  };

  return (
    <div ref={root} className={`lnc ics-${saved.icons.style} fnt-${saved.font} ${edit ? "is-edit" : ""} ${ready ? "is-ready" : ""} ${drag ? "is-dragging" : ""}`} style={{ ...vars, "--tint": tintOf(saved.icons.hue) } as CSSProperties} role="application" aria-label="We3vision home screen">
      <WallLayer wall={saved.wall} />

      {ready && m && (
        <div className="lnc-ui">
          <div ref={view} className={`lnc-view ${launch ? "is-leaving" : ""}`} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onClickCapture={stopClick}>
            <div ref={track} className="lnc-track" style={{ width: `${nPages * 100}%`, transform: `translate3d(${(-page * 100) / nPages}%, 0, 0)` }}>
              {pages.map((pg, pi) => (
                <section key={pi} className="lnc-page lnc-home" style={{ flex: `0 0 ${100 / nPages}%`, width: `${100 / nPages}%` }} aria-label={pg.title ?? (pi === 0 ? "Home screen" : `Screen ${pi + 1}`)}>
                  {pg.title && <h2 className="lnc-ptitle">{pg.title}</h2>}
                  <div ref={(el) => { hs.current[pi] = el; }} className="lnc-hs" style={{ marginLeft: -m.gx / 2, width: m.W + m.gx }}>
                    {slotsOf(pg).map((s) => renderTile(s, m))}
                  </div>
                </section>
              ))}

              {/* ---------------------------------------------- the last screen: the App Library */}
              <section className="lnc-page lnc-lib" style={{ flex: `0 0 ${100 / nPages}%`, width: `${100 / nPages}%` }} aria-label="App Library">
                <div className="lnc-sbar">
                  <label className="lnc-search">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.500" /><path d="M16 16l4.500 4.500" /></svg>
                    <input ref={input} type="search" inputMode="search" enterKeyHint="search" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setSearching(true)} onBlur={() => setSearching(false)} placeholder="App Library" aria-label="Search the App Library" />
                    {q && <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setQ("")} aria-label="Clear">×</button>}
                  </label>
                  {(searching || q) && <button type="button" className="lnc-cancel" onMouseDown={(e) => e.preventDefault()} onClick={() => { setQ(""); input.current?.blur(); }}>Cancel</button>}
                </div>
                <div className="lnc-lib-scroll">
                  {q.trim() ? (
                    <ul className="lnc-list">
                      {found.length ? found.map((a) => {
                        const it: Item = { k: "app", id: a.id };
                        return (
                          <li key={a.id}>
                            <a href={a.href} style={hue(a.off)} draggable={false} onPointerDown={(e) => tileDown(e, it, "lib", false)} onClick={(e) => onLink(e, it, e.currentTarget)}><Ic app={a} /><span>{a.label}</span><small>{groupOf[a.id] ?? ""}</small></a>
                          </li>
                        );
                      }) : <li className="lnc-none">No page found</li>}
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

          {/* ---------------------------------------------- search, the dots and the dock (the dock stays on every home screen) */}
          <div className={`lnc-bar ${page === libIndex ? "is-lib" : ""}`}>
            <div className={`lnc-ind ${dotsOn || edit || page === libIndex ? "is-dots" : ""}`}>
            <button type="button" className="lnc-find" onClick={() => { buzz("light"); input.current?.focus({ preventScroll: true }); setPage(libIndex); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.500" /><path d="M16 16l4.500 4.500" /></svg>Search
            </button>
            <div className="lnc-dots" role="tablist" aria-label="Screens">
              {Array.from({ length: nPages }).map((_, i) => (
                <button key={i} type="button" role="tab" aria-selected={page === i} className={page === i ? "is-on" : ""} onClick={() => setPage(i)} aria-label={i === libIndex ? "App Library" : i === 0 ? "Home screen" : `Screen ${i + 1}`} />
              ))}
            </div>
            </div>
            <nav className="lnc-dock" aria-label="Main">
              {DOCK.map((id) => dockButton(id))}
            </nav>
          </div>

          {/* ---------------------------------------------- the edit mode: add (widgets, wallpaper) and Done */}
          {edit && (
            <div className="lnc-etop">
              <button type="button" className="lnc-pill" onClick={() => setSheet("widgets")} aria-label="Add a widget or change the wallpaper"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14 M5 12h14" /></svg></button>
              <button type="button" className="lnc-pill" onClick={() => setCust((c) => !c)}>Customize</button>
              <button type="button" className="lnc-pill is-done" onClick={endEdit}>Done</button>
            </div>
          )}
        </div>
      )}

      {/* the item that follows the finger */}
      {drag && (
        <div ref={dragger} className="lnc-dragger" style={{ width: drag.w, height: drag.h, transform: `translate3d(${drag.x}px, ${drag.y}px, 0) scale(1.08)` }}>
          {tileBody(drag.item, false)}
        </div>
      )}

      {/* the pop-up menu of the edit mode (long press on the wallpaper) */}
      {emenu && (
        <div className="lnc-menu" onPointerDown={() => setEmenu(null)}>
          <ul className="lnc-mn lnc-emn" style={{ left: Math.max(14, Math.min((m?.vw ?? 402) - 262 * (m?.u ?? 1) - 14, emenu.x - 40)), top: Math.max(14, Math.min((m?.vh ?? 800) - 4 * 52 * (m?.u ?? 1) - 14, emenu.y - 20)), width: 262 * (m?.u ?? 1) }} onPointerDown={(e) => e.stopPropagation()}>
            {([
              ["Add Widget", "widget", () => { setEmenu(null); setSheet("widgets"); }],
              ["Customise", "edit", () => { setEmenu(null); setCust(true); }],
              ["Edit Wallpaper", "wall", () => { setEmenu(null); setSheet("wall"); }],
              ["Add Page", "page", () => { setEmenu(null); addPage(); }],
            ] as [string, keyof typeof IconPaths, () => void][]).map(([label, icon, run]) => (
              <li key={label}><button type="button" onClick={() => { buzz("select"); run(); }}><span>{label}</span><Mi d={icon} /></button></li>
            ))}
          </ul>
        </div>
      )}

      {/* the long-press menu */}
      {menu && (() => {
        const pos = menuPos(menu);
        return (
          <div className="lnc-menu" onPointerDown={() => setMenu(null)}>
            <div className="lnc-lift" style={{ left: menu.r.left, top: menu.r.top, width: menu.r.width, height: menu.r.height }}>{tileBody(menu.item, false)}</div>
            <ul className="lnc-mn" style={pos} onPointerDown={(e) => e.stopPropagation()}>
              {actions(menu).map((a) => (
                <li key={a.label}><button type="button" className={a.danger ? "is-danger" : ""} onClick={a.run}><span>{a.label}</span><Mi d={a.icon} /></button></li>
              ))}
            </ul>
          </div>
        );
      })()}

      {/* a group of pages, opened as a folder */}
      {open && (
        <div className={`lnc-fold ${closing ? "is-closing" : ""}`} onClick={closeGroup}>
          <p className="lnc-fold-t">{open.g.label}</p>
          <div ref={panel} className="lnc-fold-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={open.g.label}>
            <div className="lnc-fold-grid">
              {open.g.apps.map((id) => {
                const it: Item = { k: "app", id };
                return <div key={id} className="lnc-dk" onPointerDown={(e) => tileDown(e, it, "lib", false)} onClick={(e) => onLink(e, it, e.currentTarget)}>{tileBody(it, true)}</div>;
              })}
            </div>
          </div>
        </div>
      )}

      {sheet && (
        <Sheet
          tab={sheet}
          setTab={setSheet}
          onClose={() => setSheet(null)}
          have={new Set(pages.flatMap((p) => p.items).filter((i) => i.k === "widget").map((i) => i.id))}
          onAdd={addWidget}
          haveApps={new Set(pages.flatMap((p) => p.items).filter((i) => i.k === "app").map((i) => i.id))}
          onToggleApp={toggleApp}
          wall={saved.wall}
          onWall={setWall}
          contact={contact}
          say={say}
        />
      )}

      {cust && <Customize icons={saved.icons} onChange={setIcons} font={saved.font} onFont={(f) => update((s) => ({ ...s, font: f }))} onClose={() => setCust(false)} />}

      <ShareHost selection={false} />
      <CalendarHost />
      {toast && <div className="lnc-toast" role="status">{toast}</div>}

      {/* the app that is opening: its icon grows to the full screen and turns into the colour of the website */}
      {launch && (
        <div ref={grow} className="lnc-grow" style={{ left: launch.r.left, top: launch.r.top, width: launch.r.width, height: launch.r.height }} aria-hidden="true">
          <span className={`lnc-ic lnc-grow-ic ${launch.solid ? "is-c" : "is-w"}`} style={hue(launch.off)}><Glyph name={launch.glyph} /></span>
          <span className="lnc-grow-bg" />
        </div>
      )}
    </div>
  );
}
