"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BASE_HUE,
  DEFAULT_THEME,
  S_MAX,
  S_MIN,
  accentHex,
  applyTheme,
  clampS,
  hexToHsl,
  hueName,
  loadTheme,
  saveTheme,
  type Theme,
} from "@/lib/theme";

// The colour picker of the website. A first-time visitor is asked for a colour and a name; the colour then repaints the whole
// site (see lib/theme.ts), the name is shown on the custom cursor ("You" when nobody types one). A small round button in the
// corner opens the same card again later.
//
// The picker itself follows the reference video: a round swatch + a hex pill; the swatch blooms into a flower of colours (12
// big petals, 6 soft ones, a centre button) inside a ring in the chosen colour, with a curved slider at its right side.
// The colours are NOT a rainbow: every petal is the brand's own colour (same lightness and glow as our violet) in another hue,
// so every choice looks like our design.

const OUTER = Array.from({ length: 12 }, (_, i) => (BASE_HUE + 30 * i) % 360); // theme hues of the 12 big petals
const INNER = Array.from({ length: 6 }, (_, i) => (BASE_HUE + 15 + 60 * i) % 360); // ... and of the 6 soft ones
const INNER_S = 0.62;
// yellows and greens look harsher than violet at the same strength (and tint the dark surfaces olive), so their petals start a bit softer
const outerS = (ph: number) => (ph >= 40 && ph <= 170 ? 0.82 : 1);
const HUE_SHIFT = 278 - BASE_HUE; // the brand accent sits 6 degrees before the theme hue
const RING = 14; // arc of the slider, degrees on each side of the horizontal
const mod = (n: number, m: number) => ((n % m) + m) % m;
const hueDist = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const cssAccent = (h: number, s: number, l = 76.47) => `hsl(${mod(h + HUE_SHIFT, 360)} ${Math.min(100, 100 * s)}% ${l}%)`;

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
function Pencil({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 20l4.2-1 10.3-10.3a2 2 0 0 0 0-2.8l-.4-.4a2 2 0 0 0-2.8 0L5 15.8 4 20z" />
    </svg>
  );
}

/** The colour picker widget (swatch + hex, flower, slider). Calls onChange for every change, so the page repaints live. */
function ColorPicker({ h, s, onChange }: { h: number; s: number; onChange: (h: number, s: number) => void }) {
  const [open, setOpen] = useState(true);
  const [hexText, setHexText] = useState(() => accentHex(h, s));
  const [editing, setEditing] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const hex = accentHex(h, s);
  const shown = editing ? hexText : hex;
  const v = (S_MAX - clampS(s)) / (S_MAX - S_MIN); // slider position 0 (vivid) .. 1 (soft)

  const knobAngle = (-RING + 2 * RING * v) * (Math.PI / 180);
  const AR = 158; // radius of the slider arc around the middle of the flower
  const kx = 150 + AR * Math.cos(knobAngle);
  const ky = 150 + AR * Math.sin(knobAngle);

  const pickPetal = (ph: number, ps: number) => onChange(ph, ps);

  const onSlide = useCallback(
    (e: React.PointerEvent) => {
      const el = stageRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const sc = r.width / 330 || 1;
      const ang = (Math.atan2(e.clientY - (r.top + 150 * sc), e.clientX - (r.left + 150 * sc)) * 180) / Math.PI;
      const t = Math.min(1, Math.max(0, (ang + RING) / (2 * RING)));
      onChange(h, S_MAX - t * (S_MAX - S_MIN));
    },
    [h, onChange],
  );

  const commitHex = (text: string) => {
    const c = hexToHsl(text.startsWith("#") ? text : `#${text}`);
    if (c) onChange(mod(c.h - HUE_SHIFT, 360), clampS(c.s / 100 || 1));
  };

  const nearest = useMemo(() => {
    let best: { kind: "o" | "i"; i: number; d: number } = { kind: "o", i: 0, d: 999 };
    OUTER.forEach((ph, i) => {
      const d = hueDist(ph, h) + Math.abs(s - outerS(ph)) * 60;
      if (d < best.d) best = { kind: "o", i, d };
    });
    INNER.forEach((ph, i) => {
      const d = hueDist(ph, h) + Math.abs(s - INNER_S) * 60;
      if (d < best.d) best = { kind: "i", i, d };
    });
    return best.d < 22 ? best : null;
  }, [h, s]);

  const petal = (kind: "o" | "i", i: number, ph: number, ps: number, r: number, size: number, idx: number) => {
    const a = ((-90 + (kind === "o" ? 30 : 60) * i + (kind === "i" ? 15 : 0)) * Math.PI) / 180;
    const sel = nearest?.kind === kind && nearest.i === i;
    return (
      <button
        key={`${kind}${i}`}
        type="button"
        className="tp-petal"
        data-sel={sel}
        aria-label={`${hueName(mod(ph + HUE_SHIFT, 360))}${kind === "i" ? ", soft" : ""}`}
        aria-pressed={sel}
        tabIndex={open ? 0 : -1}
        onClick={() => pickPetal(ph, ps)}
        style={{
          left: 150 + r * Math.cos(a) - size / 2,
          top: 150 + r * Math.sin(a) - size / 2,
          width: size,
          height: size,
          background: kind === "o" ? cssAccent(ph, ps, 66) : cssAccent(ph, 0.7, 86),
          animationDelay: `${60 + idx * 28}ms`,
        }}
      />
    );
  };

  return (
    <div className="tp-picker" style={{ "--pc": cssAccent(h, s) } as React.CSSProperties}>
      {/* closed: the swatch and the hex; the swatch blooms into the flower */}
      <div className="tp-row" data-open={open} aria-hidden={open}>
        <button type="button" className="tp-swatch" aria-label="Open the colour wheel" tabIndex={open ? -1 : 0} onClick={() => setOpen(true)} />
        <label className="tp-hex">
          <input
            value={shown}
            maxLength={7}
            spellCheck={false}
            aria-label="Colour as a hex code"
            tabIndex={open ? -1 : 0}
            onFocus={() => {
              setEditing(true);
              setHexText(hex);
            }}
            onChange={(e) => {
              setHexText(e.target.value.toUpperCase());
              if (/^#?[0-9a-fA-F]{6}$/.test(e.target.value)) commitHex(e.target.value);
            }}
            onBlur={() => {
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          <span className="tp-hex-ico" aria-hidden>
            {editing ? <Check className="size-4" /> : <Pencil className="size-3.5" />}
          </span>
        </label>
      </div>

      <div ref={stageRef} className="tp-stage" data-open={open} aria-hidden={!open}>
        <div className="tp-disc" />
        {OUTER.map((ph, i) => petal("o", i, ph, outerS(ph), 92, 56, i))}
        {INNER.map((ph, i) => petal("i", i, ph, INNER_S, 46, 52, 12 + i))}
        <button type="button" className="tp-centre" aria-label="Done with the wheel" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
          <Check className="size-5" />
        </button>

        <svg className="tp-arc" viewBox="0 0 330 300" aria-hidden>
          <defs>
            <linearGradient id="tp-arc-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={cssAccent(h, S_MAX, 84)} />
              <stop offset="0.5" stopColor={cssAccent(h, 0.8, 62)} />
              <stop offset="1" stopColor={cssAccent(h, S_MIN, 34)} />
            </linearGradient>
          </defs>
          <path
            d={`M ${150 + AR * Math.cos((-RING * Math.PI) / 180)} ${150 + AR * Math.sin((-RING * Math.PI) / 180)} A ${AR} ${AR} 0 0 1 ${150 + AR * Math.cos((RING * Math.PI) / 180)} ${150 + AR * Math.sin((RING * Math.PI) / 180)}`}
            fill="none"
            stroke="url(#tp-arc-g)"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>
        <div
          className="tp-knob"
          role="slider"
          aria-label="Colour strength"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((1 - v) * 100)}
          tabIndex={open ? 0 : -1}
          style={{ left: kx - 14, top: ky - 14 }}
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            onSlide(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons) onSlide(e);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(h, clampS(s + 0.05));
            if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(h, clampS(s - 0.05));
          }}
        />
      </div>
    </div>
  );
}

/** The card: the picker, the name field and the buttons. */
function ThemeCard({ first, saved, onDone, onCancel }: { first: boolean; saved: Theme | null; onDone: (t: Theme) => void; onCancel: () => void }) {
  const start = saved ?? DEFAULT_THEME;
  const [h, setH] = useState(start.h);
  const [s, setS] = useState(start.s);
  const [name, setName] = useState(start.name);
  const touched = useRef(false);

  const change = useCallback((nh: number, ns: number) => {
    touched.current = true;
    setH(nh);
    setS(ns);
    applyTheme(nh, ns); // the page behind repaints at once
  }, []);

  const done = () => onDone({ h, s, name: name.trim().slice(0, 16), done: true });
  const skip = () => {
    applyTheme(DEFAULT_THEME.h, DEFAULT_THEME.s, "");
    onDone({ ...DEFAULT_THEME, done: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") (first ? skip : onCancel)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first]);

  return (
    <div className="tp-card" role="dialog" aria-modal="true" aria-labelledby="tp-title">
      <span className="tp-chip">{first ? "Welcome" : "Your colour"}</span>
      <h2 id="tp-title" className="tp-title">
        Make this website <em>yours</em>
      </h2>
      <p className="tp-sub">Pick a colour. The whole site changes with it, and it stays that way next time you visit.</p>

      <ColorPicker h={h} s={s} onChange={change} />

      <label className="tp-name">
        <span>What should we call you?</span>
        <input
          value={name}
          maxLength={16}
          placeholder="You"
          autoComplete="given-name"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") done();
          }}
        />
        <small>It is shown next to your cursor.</small>
      </label>

      <div className="tp-actions">
        <button type="button" className="tp-go btn-primary text-void" onClick={done}>
          {first ? "Continue" : "Save"}
        </button>
        <button type="button" className="tp-skip" onClick={first ? skip : onCancel}>
          {first ? "Skip" : "Cancel"}
        </button>
      </div>
    </div>
  );
}

/** Mounted once in the site layout: asks a first-time visitor, and holds the small button that reopens the card. */
export function ThemeProvider() {
  const [open, setOpen] = useState(false);
  const [first, setFirst] = useState(false);
  const [saved, setSaved] = useState<Theme | null>(null);
  const [accent, setAccent] = useState(DEFAULT_THEME.h);
  const [sat, setSat] = useState(1);
  const revert = useRef<Theme>(DEFAULT_THEME);

  // from now on a change of colour animates (see html.theme-anim in globals.css)
  useEffect(() => {
    const root = document.documentElement;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("theme-anim")));
    return () => {
      cancelAnimationFrame(id);
      // leaving the public site (for example to the admin panel): the admin keeps its own colours
      root.classList.remove("theme-anim", "tp-open");
      root.style.removeProperty("--th");
      root.style.removeProperty("--ts");
    };
  }, []);

  // restore the saved colour (the page script has usually done it already) and ask first-time visitors
  useEffect(() => {
    const t = loadTheme();
    if (t) {
      applyTheme(t.h, t.s, t.name);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaved(t);
      setAccent(t.h);
      setSat(t.s);
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem("we3.theme.seen") === "1";
    } catch {
      // ignore
    }
    if (seen) return;
    const timer = window.setTimeout(() => {
      setFirst(true);
      setOpen(true);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, []);

  // the corner button shows the colour that is on the page now
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ h: number; s: number }>).detail;
      if (d) {
        setAccent(d.h);
        setSat(d.s);
      }
    };
    window.addEventListener("we3-theme", on);
    return () => window.removeEventListener("we3-theme", on);
  }, []);

  const close = () => {
    setOpen(false);
    document.documentElement.classList.remove("tp-open");
  };
  const done = (t: Theme) => {
    saveTheme(t);
    setSaved(t);
    try {
      sessionStorage.setItem("we3.theme.seen", "1");
    } catch {
      // ignore
    }
    applyTheme(t.h, t.s, t.name); // tells the cursor the name
    close();
  };
  const cancel = () => {
    const r = revert.current;
    applyTheme(r.h, r.s, r.name);
    close();
  };

  useEffect(() => {
    if (open) document.documentElement.classList.add("tp-open");
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="tp-fab"
        aria-label="Change the colour of this website"
        title="Change colour"
        style={{ "--pc": cssAccent(accent, sat) } as React.CSSProperties}
        onClick={() => {
          revert.current = saved ?? { ...DEFAULT_THEME, h: accent, s: sat };
          setFirst(false);
          setOpen(true);
        }}
      >
        <span aria-hidden />
      </button>
      {open && (
        <div className="tp-overlay" data-first={first}>
          <ThemeCard first={first} saved={first ? null : saved} onDone={done} onCancel={cancel} />
        </div>
      )}
    </>
  );
}
