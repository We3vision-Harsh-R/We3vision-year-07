"use client";

import { useState } from "react";
import { GlowEdge } from "../glow-edge";
import { SectionHead } from "../ui";

// The device wall of the Metaverse page (it takes the place of the tools cloud): one glass card per device or platform, each with a little
// drawing of the device. The filter on top lights the cards that fit AR, VR, XR or MR and dims the others. Pointing at a card (or tapping
// it, or focusing it with the keyboard) tilts it towards the pointer and opens "what we build for this device"; on a touch screen all the
// texts are open. Under the wall a strip with the technology we work with. The look is in globals.css (.vd-*).

type Item = { name: string; kind: string; realities: string; text: string; tags: string };

const lines = (t: string) => (t || "").split("\n").map((l) => l.trim()).filter(Boolean);
const FILTERS = ["ALL", "AR", "VR", "XR", "MR"];

// the drawings (seen from the front, in the colours of the theme)
function Cube({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="vda-float">
      <polygon points="0,-14 13,-7 0,0 -13,-7" className="vda-cube-t" />
      <polygon points="-13,-7 0,0 0,15 -13,8" className="vda-cube-l" />
      <polygon points="13,-7 0,0 0,15 13,8" className="vda-cube-r" />
    </g>
  );
}
function ArtHeadset() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden>
      <path d="M12 46h18M170 46h18" className="vda-strap" />
      <path d="M30 40q0-18 18-18h104q18 0 18 18v22q0 16-16 16h-26q-8 0-12-7l-4-7q-4-7-12 0l-4 7q-4 7-12 7H46q-16 0-16-16z" className="vda-body" />
      <circle cx="72" cy="54" r="16" className="vda-lens" />
      <circle cx="128" cy="54" r="16" className="vda-lens" />
      <circle cx="72" cy="54" r="7" className="vda-pulse" />
      <circle cx="128" cy="54" r="7" className="vda-pulse" />
    </svg>
  );
}
function ArtSpatial() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden>
      <path d="M14 56q-4 0-4 10M186 56q4 0 4 10" className="vda-strap" />
      <path d="M20 54q0-28 80-28t80 28q0 22-34 25q-46 6-92 0q-34-3-34-25z" className="vda-body" />
      <path d="M32 52q0-16 68-16t68 16" className="vda-glass" />
      <circle cx="100" cy="82" r="3" className="vda-pulse" />
      <Cube x={100} y={14} s={0.8} />
    </svg>
  );
}
function ArtGlasses() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden>
      <path d="M24 46q0-16 14-16h124q14 0 14 16v8q0 14-14 14H38q-14 0-14-14z" className="vda-body" />
      <rect x="38" y="40" width="124" height="20" rx="9" className="vda-glass" />
      <path d="M24 50H10M176 50h14" className="vda-strap" />
      <Cube x={100} y={86} s={0.8} />
      <path d="M72 60l-10 14M128 60l10 14" className="vda-beam" />
    </svg>
  );
}
function ArtPhone() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden>
      <rect x="74" y="6" width="52" height="98" rx="10" className="vda-body" />
      <rect x="80" y="16" width="40" height="76" rx="4" className="vda-glass" />
      <ellipse cx="100" cy="78" rx="16" ry="5" className="vda-ring" />
      <Cube x={100} y={58} s={0.9} />
      <path d="M52 36q-14 18 0 36M148 36q14 18 0 36M40 30q-22 25 0 50M160 30q22 25 0 50" className="vda-beam" />
    </svg>
  );
}
function ArtBrowser() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden>
      <rect x="22" y="12" width="156" height="88" rx="9" className="vda-body" />
      <path d="M22 30h156" className="vda-line" />
      <circle cx="34" cy="21" r="2.6" className="vda-pulse" />
      <circle cx="44" cy="21" r="2.6" className="vda-pulse" />
      <circle cx="54" cy="21" r="2.6" className="vda-pulse" />
      <rect x="70" y="16" width="92" height="10" rx="5" className="vda-glass" />
      <ellipse cx="100" cy="68" rx="38" ry="11" className="vda-ring" />
      <Cube x={100} y={58} s={1.1} />
    </svg>
  );
}
function ArtEngine() {
  return (
    <svg viewBox="0 0 200 110" aria-hidden>
      <path d="M30 96L100 70l70 26M30 82L100 58l70 24M100 70V20" className="vda-line" />
      <path d="M100 70l44 14M100 70L56 84" className="vda-beam" />
      <path d="M144 84l-6-1M144 84l-3 5" className="vda-beam" />
      <circle cx="100" cy="20" r="3.4" className="vda-pulse" />
      <circle cx="144" cy="84" r="3.4" className="vda-pulse" />
      <circle cx="56" cy="84" r="3.4" className="vda-pulse" />
      <Cube x={100} y={58} s={1.15} />
    </svg>
  );
}
const ARTS = [ArtHeadset, ArtSpatial, ArtGlasses, ArtPhone, ArtBrowser, ArtEngine];

export function VrDevices({ id, chip, heading, intro, items, toolsLabel, tools }: { id?: string; chip: string; heading: string; intro: string; items: Item[]; toolsLabel: string; tools: string }) {
  const [filter, setFilter] = useState("ALL");
  const [open, setOpen] = useState(-1);
  const techs = lines(tools);

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
  };
  const flat = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <section id={id || "devices"} className="vd px-4 py-24 sm:py-32" aria-label={heading.replace(/\n/g, " ")}>
      <SectionHead chip={chip} heading={heading} intro={intro} />
      <div className="vd-filter" role="group" aria-label="Show the devices that fit">
        {FILTERS.map((f) => (
          <button key={f} type="button" className="vd-fbtn" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "ALL" ? "All" : f}
          </button>
        ))}
      </div>
      <ul className="vd-wall">
        {items.map((it, i) => {
          const Art = ARTS[i % ARTS.length];
          const fits = (it.realities || "").toUpperCase().split(/\s+/).filter(Boolean);
          const match = filter === "ALL" || fits.includes(filter);
          return (
            <li
              key={i}
              className="vd-card bglow"
              data-dim={!match}
              data-open={open === i}
              style={{ "--i": i } as React.CSSProperties}
              tabIndex={0}
              onPointerMove={tilt}
              onPointerLeave={flat}
              onClick={() => setOpen(open === i ? -1 : i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(open === i ? -1 : i))}
            >
              <GlowEdge />
              <div className="vd-art">
                <Art />
              </div>
              <div className="vd-meta">
                <span className="vd-kind">{it.kind}</span>
                <span className="vd-fits">
                  {fits.map((f) => (
                    <b key={f} data-on={filter === f}>
                      {f}
                    </b>
                  ))}
                </span>
              </div>
              <h3 className="vd-name">{it.name}</h3>
              <div className="vd-more">
                <div>
                  <p>{it.text}</p>
                  <ul className="vd-tags">
                    {lines(it.tags).map((t, k) => (
                      <li key={k}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {techs.length > 0 && (
        <div className="vd-tech">
          <p>{toolsLabel}</p>
          <ul>
            {techs.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
