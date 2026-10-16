"use client";

import { useState } from "react";

// A small panel to set the camera of the industries city by hand (it appears when "?cam" is added to the address of the page, e.g.
// http://localhost:3000/?cam). Every slider moves the camera at once, and the values are kept in this browser (localStorage), so the camera
// stays where it was put. "Copy values" puts the numbers on the clipboard, to send them to be fixed in the code for all visitors.
// Nothing here is shown to visitors.

export type Cam = {
  zoom: number; // size of the city
  pitch: number; // the angle of the camera to the floor (degrees): 90 = straight down, 0 = along the floor
  ang: number; // turn of the camera round the road (degrees): -90 = looking along the road
  lens: number; // the lens (px): small = wide angle, big = a long lens
  x: number; // where the car is, from the left (%)
  y: number; // where the car is, from the top (%)
  blur: number; // strength of the blur in the distance (0 = none)
};

const FIELDS: { k: keyof Cam; label: string; min: number; max: number; step: number; unit: string }[] = [
  { k: "zoom", label: "Zoom", min: 0.2, max: 1.6, step: 0.01, unit: "×" },
  { k: "pitch", label: "Camera angle to the floor", min: 15, max: 85, step: 1, unit: "°" },
  { k: "ang", label: "Turn round the road", min: -130, max: -50, step: 1, unit: "°" },
  { k: "lens", label: "Lens (small = wide)", min: 500, max: 6000, step: 50, unit: "px" },
  { k: "x", label: "Car: left / right", min: 25, max: 75, step: 1, unit: "%" },
  { k: "y", label: "Car: up / down", min: 30, max: 95, step: 1, unit: "%" },
  { k: "blur", label: "Blur in the distance", min: 0, max: 2.5, step: 0.05, unit: "×" },
];

export function CameraTuner({ cam, onChange, onReset }: { cam: Cam; onChange: (c: Cam) => void; onReset: () => void }) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(cam));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy these values:", JSON.stringify(cam));
    }
  };
  return (
    <div className="ct" data-lenis-prevent data-open={open}>
      <button type="button" className="ct-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <b>Camera</b>
        <span>{open ? "hide" : "show"}</span>
      </button>
      {open && (
        <div className="ct-body">
          {FIELDS.map((f) => (
            <label key={f.k} className="ct-row">
              <span>
                {f.label}
                <output>
                  {cam[f.k]}
                  {f.unit}
                </output>
              </span>
              <input type="range" min={f.min} max={f.max} step={f.step} value={cam[f.k]} onChange={(e) => onChange({ ...cam, [f.k]: Number(e.target.value) })} />
            </label>
          ))}
          <div className="ct-btns">
            <button type="button" onClick={onReset}>
              Reset
            </button>
            <button type="button" onClick={copy}>
              {copied ? "Copied" : "Copy values"}
            </button>
          </div>
          <p>The values are saved in this browser.</p>
        </div>
      )}
    </div>
  );
}
