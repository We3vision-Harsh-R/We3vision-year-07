"use client";

import { useState } from "react";

// The box of the Graphics page (the "guide" section with the scene "brandboard"): a small brand kit. The visitor writes a name, picks a colour, a
// shape and a font, and the logo, the business card, the post, the app icon and the colour chips all change together: one consistent look is
// what good branding is about. No cartoon guide. The look is in globals.css (.kit-*).

const HUES = [0, 28, -24, 44, -52];
const SHAPES = [
  { id: "circle", name: "Circle" },
  { id: "round", name: "Rounded" },
  { id: "hex", name: "Hexagon" },
] as const;
const FONTS = [
  { id: "sans", name: "Sans", css: "var(--font-poppins), Poppins, system-ui, sans-serif", weight: 600 },
  { id: "serif", name: "Serif", css: "Georgia, 'Times New Roman', serif", weight: 700 },
  { id: "mono", name: "Mono", css: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace", weight: 700 },
] as const;

const c = (h: number, l: number, a = 1, s = 92) => `hsl(calc(var(--th) + 354 + ${h}) calc(${s}% * var(--ts)) ${l}% / ${a})`;

function Mark({ shape, hue, letter, size }: { shape: (typeof SHAPES)[number]["id"]; hue: number; letter: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden className="kit-mark">
      {shape === "circle" && <circle cx="30" cy="30" r="27" fill={c(hue, 66)} />}
      {shape === "round" && <rect x="4" y="4" width="52" height="52" rx="16" fill={c(hue, 66)} />}
      {shape === "hex" && <path d="M30 3l24 14v26L30 57 6 43V17z" fill={c(hue, 66)} />}
      <text x="30" y="40" textAnchor="middle" className="kit-letter">
        {letter}
      </text>
    </svg>
  );
}

export function BrandBoard() {
  const [name, setName] = useState("Orbit");
  const [hue, setHue] = useState(0);
  const [shape, setShape] = useState<(typeof SHAPES)[number]["id"]>("round");
  const [font, setFont] = useState<(typeof FONTS)[number]["id"]>("sans");
  const f = FONTS.find((x) => x.id === font) ?? FONTS[0];
  const brand = name.trim() || "Your brand";
  const letter = brand[0].toUpperCase();
  const style = { "--kit-font": f.css, "--kit-w": f.weight } as React.CSSProperties;

  return (
    <div className="kit" style={style}>
      <div className="kit-bar">
        <span className="kit-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="kit-file">Brand kit · {brand}</span>
        <span className="kit-ok" style={{ background: c(hue, 66) }} aria-hidden />
      </div>

      <div className="kit-main">
        <div className="kit-ctl">
          <label className="kit-f">
            <span>Brand name</span>
            <input value={name} maxLength={18} onChange={(e) => setName(e.target.value)} placeholder="Your brand" />
          </label>
          <div className="kit-f">
            <span>Colour</span>
            <div className="kit-sw">
              {HUES.map((h) => (
                <button key={h} type="button" aria-label={`Colour ${h}`} data-on={hue === h} style={{ background: c(h, 66) }} onClick={() => setHue(h)} />
              ))}
            </div>
          </div>
          <div className="kit-f">
            <span>Logo shape</span>
            <div className="kit-pill">
              {SHAPES.map((s) => (
                <button key={s.id} type="button" data-on={shape === s.id} onClick={() => setShape(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
          <div className="kit-f">
            <span>Font</span>
            <div className="kit-pill">
              {FONTS.map((x) => (
                <button key={x.id} type="button" data-on={font === x.id} onClick={() => setFont(x.id)}>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="kit-board">
          <div className="kit-logo" style={{ background: `linear-gradient(135deg, ${c(hue, 22, 0.9)}, ${c(hue + 20, 10, 0.95)})` }}>
            <Mark shape={shape} hue={hue} letter={letter} size={64} />
            <b>{brand}</b>
          </div>

          <div className="kit-row">
            <div className="kit-card">
              <Mark shape={shape} hue={hue} letter={letter} size={30} />
              <b>{brand}</b>
              <small>hello@{brand.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}.com</small>
              <i style={{ background: c(hue, 66) }} aria-hidden />
            </div>
            <div className="kit-post" style={{ background: `linear-gradient(160deg, ${c(hue, 60)}, ${c(hue - 24, 34)})` }}>
              <b>{brand}</b>
              <span>New season, new look</span>
            </div>
          </div>

          <div className="kit-chips" aria-hidden>
            <span className="kit-app" style={{ background: c(hue, 14) }}>
              <Mark shape={shape} hue={hue} letter={letter} size={26} />
            </span>
            {[c(hue, 78), c(hue, 66), c(hue, 50), c(hue - 24, 34), c(hue, 14)].map((col, i) => (
              <span key={i} style={{ background: col }} />
            ))}
            <em>
              Aa <small>{f.name}</small>
            </em>
          </div>
        </div>
      </div>
    </div>
  );
}
