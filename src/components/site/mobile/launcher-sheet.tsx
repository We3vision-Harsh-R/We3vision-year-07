"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import { APPS, FONTS, PRESETS, SECTIONS, WIDGETS, type FontId, type WidgetKind } from "./launcher-data";
import { Ic } from "./launcher-ic";
import { Glyph } from "./glyph";
import type { IconStyle, Icons, Wall } from "./launcher-state";
import { WIDGET_CLASS, WidgetInner, type Contact } from "./launcher-widgets";

// The wallpaper layer, and the sheet that opens from the "+" of the edit mode: add a widget, or change the wallpaper.

const preset = (id: string) => PRESETS.find((p) => p.id === id) ?? PRESETS[0];

/** the wallpaper: three soft lights in the theme colour (moving slowly), a plain colour, or the visitor's own picture */
export function WallLayer({ wall, mini }: { wall: Wall; mini?: boolean }) {
  if (wall.kind === "photo") {
    return <div className={`lnc-wall is-photo ${mini ? "is-mini" : ""}`} style={{ backgroundImage: `url(${wall.src})` }} aria-hidden="true" />;
  }
  const p = preset(wall.id);
  const style = { "--w1": p.o[0], "--w2": p.o[1], "--w3": p.o[2], "--ws": p.s, ...(p.base ? { "--wb": p.base } : {}), ...(p.bg ? { background: p.bg } : {}) } as CSSProperties;
  return (
    <div className={`lnc-wall ${p.plain ? "is-plain" : ""} ${mini ? "is-mini" : ""}`} style={style} aria-hidden="true">
      <i /><i /><i />
    </div>
  );
}

/** a picture from the phone, made smaller (the longest side 1080 px, JPEG) so it can be kept in the browser */
async function smallPicture(file: File): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1080 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k);
  c.height = Math.round(bmp.height * k);
  c.getContext("2d")?.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  let q = 0.82;
  let url = c.toDataURL("image/jpeg", q);
  while (url.length > 700_000 && q > 0.4) { q -= 0.1; url = c.toDataURL("image/jpeg", q); }
  return url;
}

export type SheetTab = "widgets" | "apps" | "wall";

export function Sheet({ tab, setTab, onClose, have, onAdd, haveApps, onToggleApp, wall, onWall, contact, say }: {
  tab: SheetTab;
  setTab: (t: SheetTab) => void;
  onClose: () => void;
  have: Set<string>;
  onAdd: (k: WidgetKind) => void;
  haveApps: Set<string>;
  onToggleApp: (id: string) => void;
  wall: Wall;
  onWall: (w: Wall) => void;
  contact: Contact | null;
  say: (m: string) => void;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    return SECTIONS.map((g) => ({ ...g, apps: g.apps.filter((id) => !t || APPS[id].label.toLowerCase().includes(t) || APPS[id].href.toLowerCase().includes(t)) })).filter((g) => g.apps.length);
  }, [q]);
  const pick = async (f?: File) => {
    if (!f) return;
    try { onWall({ kind: "photo", src: await smallPicture(f) }); } catch { say("This picture cannot be used"); }
  };
  return (
    <div className="lnc-sheet-bg" onClick={onClose}>
      <div className="lnc-sheet" role="dialog" aria-label="Customise" onClick={(e) => e.stopPropagation()}>
        <div className="lnc-sheet-h">
          <div className="lnc-seg" role="tablist">
            <button type="button" role="tab" aria-selected={tab === "widgets"} className={tab === "widgets" ? "is-on" : ""} onClick={() => setTab("widgets")}>Widgets</button>
            <button type="button" role="tab" aria-selected={tab === "apps"} className={tab === "apps" ? "is-on" : ""} onClick={() => setTab("apps")}>Apps</button>
            <button type="button" role="tab" aria-selected={tab === "wall"} className={tab === "wall" ? "is-on" : ""} onClick={() => setTab("wall")}>Wallpaper</button>
          </div>
          <button type="button" className="lnc-x" onClick={onClose} aria-label="Close">×</button>
        </div>

        {tab === "widgets" ? (
          <div className="lnc-sheet-b lnc-gal">
            {WIDGETS.map((w) => (
              <div key={w.id} className={`lnc-gal-i ${w.wide ? "is-wide" : ""}`}>
                <div className={`lnc-wid ${WIDGET_CLASS[w.id]} lnc-nolink`}><WidgetInner kind={w.id} contact={contact} /></div>
                <b>{w.label}</b>
                <small>{w.hint}</small>
                <button type="button" className="lnc-add" disabled={have.has(w.id)} onClick={() => onAdd(w.id)}>{have.has(w.id) ? "On your screen" : "Add Widget"}</button>
              </div>
            ))}
          </div>
        ) : tab === "apps" ? (
          <div className="lnc-sheet-b lnc-apps">
            <label className="lnc-search lnc-search-s">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a service or page" aria-label="Search a service or page" />
            </label>
            <p className="lnc-apps-h">Tap an icon to put it on your Home screen, tap again to take it off.</p>
            {groups.map((g) => (
              <div key={g.id} className="lnc-apps-g">
                <h4>{g.label}</h4>
                <div className="lnc-apps-grid">
                  {g.apps.map((id) => (
                    <button key={id} type="button" className={`lnc-pk ${haveApps.has(id) ? "is-on" : ""}`} onClick={() => onToggleApp(id)} aria-pressed={haveApps.has(id)}>
                      <Ic app={APPS[id]} /><span className="lnc-lb">{APPS[id].label}</span>
                      <i aria-hidden="true">{haveApps.has(id) ? "✓" : "+"}</i>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!groups.length && <p className="lnc-none">No page found</p>}
          </div>
        ) : (
          <div className="lnc-sheet-b lnc-walls">
            {PRESETS.map((p) => (
              <button key={p.id} type="button" className={`lnc-ws ${wall.kind === "preset" && wall.id === p.id ? "is-on" : ""}`} onClick={() => onWall({ kind: "preset", id: p.id })} aria-label={p.label}>
                <WallLayer wall={{ kind: "preset", id: p.id }} mini /><span>{p.label}</span>
              </button>
            ))}
            {wall.kind === "photo" && (
              <button type="button" className="lnc-ws is-on" aria-label="Your photo"><WallLayer wall={wall} mini /><span>Your photo</span></button>
            )}
            <button type="button" className="lnc-ws lnc-ws-add" onClick={() => file.current?.click()} aria-label="Choose a photo">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z M8.500 10a1.500 1.500 0 1 0 0-.01 M3 17l5-5 4 4 3-3 6 6" /></svg>
              <span>Photo</span>
            </button>
            <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
          </div>
        )}
      </div>
    </div>
  );
}

const LOOKS: { id: IconStyle; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "dark", label: "Dark" },
  { id: "clear", label: "Clear" },
  { id: "tint", label: "Tinted" },
];

/** the colour of the tint, as a CSS value (the theme colour moved by `hue` degrees) */
export const tintOf = (hue: number) => `calc(var(--lh) + ${hue})`;

/** the "Customize" panel (as on the iPhone): how all the icons look. It does not hide the screen, so the change can be seen at once */
export function Customize({ icons, onChange, font, onFont, onClose }: { icons: Icons; onChange: (i: Icons) => void; font: FontId; onFont: (f: FontId) => void; onClose: () => void }) {
  return (
    <div className="lnc-cust-bg" onClick={onClose}>
      <div className="lnc-cust" role="dialog" aria-label="Customize icons" onClick={(e) => e.stopPropagation()} style={{ "--tint": tintOf(icons.hue) } as CSSProperties}>
        <div className="lnc-cust-h"><b>Customize</b><button type="button" className="lnc-x" onClick={onClose} aria-label="Close">×</button></div>
        <div className="lnc-cust-row" role="radiogroup" aria-label="Icon style">
          {LOOKS.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={icons.style === l.id} className={`lnc-cs ${icons.style === l.id ? "is-on" : ""}`} onClick={() => onChange({ ...icons, style: l.id })}>
              <span className="lnc-cs-p">
                <span className={`lnc-pv pv-${l.id}`}><Glyph name="globe" /></span>
              </span>
              <small>{l.label}</small>
            </button>
          ))}
        </div>
        {icons.style === "tint" && (
          <label className="lnc-hue">
            <span>Colour</span>
            <input type="range" min={-180} max={180} step={1} value={icons.hue} onChange={(e) => onChange({ ...icons, hue: Number(e.target.value) })} aria-label="Tint colour" />
          </label>
        )}
        <p className="lnc-cust-l">Font</p>
        <div className="lnc-fonts" role="radiogroup" aria-label="Font">
          {FONTS.map((f) => (
            <button key={f.id} type="button" role="radio" aria-checked={font === f.id} className={`lnc-fn ${font === f.id ? "is-on" : ""}`} onClick={() => onFont(f.id)} style={{ fontFamily: `${f.css}, var(--font-poppins), sans-serif` }}>
              <b>Aa</b><small>{f.label}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
