"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const FRAMES = 48;

/**
 * "Press play, scrub the frames": the laptop shows an After Effects timeline with a bouncing ball. Here: a stage with the ball, a play button
 * and a playhead you drag (a range input, so it also works with a keyboard). The ball moves with transform only. `label` is the CMS tip.
 */
export function BallTimeline({ label }: { label: string }) {
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last > 1000 / 24) {
        last = now;
        setFrame((f) => (f + 1) % FRAMES);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  // two bounces over the clip: height = |sin|, squash a little at the floor
  const t = frame / FRAMES;
  const up = Math.abs(Math.sin(t * Math.PI * 2));
  const floor = 1 - up;
  const style = {
    "--p": t,
    "--y": `${-up * 150}px`,
    "--ss": 1 - up * 0.55,
    "--sx": 1 + floor * floor * 0.25,
    "--sy": 1 - floor * floor * 0.22,
  } as CSSProperties;

  return (
    <div className="mp-an-tl" style={style}>
      <div className="mp-an-stage" aria-hidden="true">
        <span className="mp-an-ball" />
        <span className="mp-an-shadow" />
      </div>
      <div className="mp-an-ctrl">
        <button type="button" className="mp-an-play" aria-label={playing ? "Pause" : "Play"} aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
          {playing ? <span className="mp-an-pause" /> : <span className="mp-an-tri" />}
        </button>
        <div className="mp-an-track">
          <div className="mp-an-keys" aria-hidden="true">
            <i style={{ left: "0%" }} />
            <i style={{ left: "25%" }} />
            <i style={{ left: "50%" }} />
            <i style={{ left: "75%" }} />
            <i style={{ left: "100%" }} />
          </div>
          <input
            type="range"
            min={0}
            max={FRAMES - 1}
            value={frame}
            aria-label={label}
            onChange={(e) => {
              setPlaying(false);
              setFrame(Number(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
}
