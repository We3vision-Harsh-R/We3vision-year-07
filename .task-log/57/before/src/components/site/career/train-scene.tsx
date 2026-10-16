"use client";

import { useEffect, useRef, useState } from "react";
import { PersonTop } from "../timeline-art";

// The railway station of the Careers page seen from above: a track that runs from the top to the bottom of the box, a platform at its side
// and a train that comes in from the top (out of a blur) and stops with its engine at four fifths of the height. Two boxes use it:
//   origin       the ticket office. Only the track is there until the visitor has chosen a city, a current status and a destination, then the
//                train arrives. "You" (the passenger) stands on the platform and walks a step closer to the first coach with every answer,
//                gets into the coach when the seat is booked and sits down; when the passenger details are in, the train leaves.
//   destination  Surat Junction: the train arrives, the passenger gets out and walks to the office of We3vision.
// There is no train anywhere on the page until the visitor has chosen. The look is in globals.css (.cj-*).

const COACH_W = 58;
const ENGINE_L = 138;
const COACH_L = 176;
const GAP = 6;
const COACHES = 3;
const TRAIN_L = ENGINE_L + COACHES * (COACH_L + GAP);

type Props = {
  mode: "origin" | "destination";
  /** is the train at the platform? */
  trainIn: boolean;
  /** the train has left (down and out of the box) */
  gone?: boolean;
  /** is the passenger there at all? */
  passenger: boolean;
  /** origin: how many steps the passenger has taken and how many there are */
  step?: number;
  steps?: number;
  /** origin: sits in the first coach. destination: is in the train until `getOut` */
  seated: boolean;
  /** destination: the passenger gets out and walks to the office */
  getOut?: boolean;
  /** the sign on the platform */
  sign: string;
};

export function TrainScene({ mode, trainIn, gone = false, passenger, step = 0, steps = 7, seated, getOut = false, sign }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [dim, setDim] = useState({ W: 360, H: 720 });
  const [inOffice, setInOffice] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width > 20 && r.height > 20) setDim((d) => (Math.abs(d.W - r.width) < 1 && Math.abs(d.H - r.height) < 1 ? d : { W: r.width, H: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // destination: the passenger gets out of the coach (to the platform) and then walks to the office
  useEffect(() => {
    if (!getOut) return;
    const t = window.setTimeout(() => setInOffice(true), 1500);
    return () => {
      window.clearTimeout(t);
      setInOffice(false);
    };
  }, [getOut]);
  const leg: "seat" | "door" | "office" = !getOut ? "seat" : inOffice ? "office" : "door";

  const { W, H } = dim;
  const trackX = W * 0.66;
  const frontY = H * 0.8; // where the nose of the engine stops
  const top = gone ? H + 80 : trainIn ? frontY - TRAIN_L : -TRAIN_L - 80;
  // the first coach (behind the engine): its top and the middle of its door
  const coach1Y = TRAIN_L - ENGINE_L - GAP - COACH_L;
  const doorY = top + coach1Y + COACH_L / 2;
  const seatY = top + coach1Y + 30 + 2 * 30; // the third row of seats
  const seatX = trackX - 13;
  const platformR = trackX - COACH_W / 2 - 8;
  const doorX = platformR - 14;

  // the passenger
  const start = { x: W * 0.15, y: H * 0.9 };
  const t = steps > 0 ? Math.min(1, step / steps) : 0;
  const walkX = start.x + (doorX - start.x) * t;
  const walkY = start.y + (doorY - start.y) * t;
  const office = { x: W * 0.24, y: H * 0.37 };

  let px = walkX;
  let py = walkY;
  let moving = false;
  let rot = Math.atan2(doorY - start.y, doorX - start.x) * (180 / Math.PI) - 90;
  if (mode === "origin") {
    if (seated) {
      px = seatX;
      py = seatY;
      rot = -90;
    } else moving = step > 0;
  } else if (leg === "seat") {
    px = seatX;
    py = seatY;
    rot = -90;
  } else if (leg === "door") {
    px = doorX;
    py = doorY;
    rot = 90;
    moving = true;
  } else {
    px = office.x;
    py = office.y;
    rot = Math.atan2(office.y - doorY, office.x - doorX) * (180 / Math.PI) - 90;
    moving = true;
  }
  // inside the train the passenger goes with it; on the platform the passenger walks on its own
  const withTrain = (mode === "origin" && seated) || (mode === "destination" && leg === "seat");
  const show = passenger && (mode === "origin" || trainIn || leg !== "seat");

  return (
    <div ref={ref} className="cj-scene" data-mode={mode} data-train={trainIn} aria-hidden>
      <div className="cj-ballast" style={{ left: trackX - 44, width: 88 }} />
      <div className="cj-sleepers" style={{ left: trackX - 36, width: 72 }} />
      <i className="cj-rail" style={{ left: trackX - 21 }} />
      <i className="cj-rail" style={{ left: trackX + 19 }} />

      {/* the platform, its roof, benches and the sign */}
      <div className="cj-platform" style={{ left: W * 0.04, width: platformR - W * 0.04 }}>
        <span className="cj-edge" />
      </div>
      <div className="cj-canopy" style={{ left: W * 0.08, top: H * 0.5, width: platformR - W * 0.12, height: H * 0.26 }}>
        <i />
        <i />
        <i />
        <i />
      </div>
      <span className="cj-bench" style={{ left: W * 0.1, top: H * 0.58 }} />
      <span className="cj-bench" style={{ left: W * 0.1, top: H * 0.66 }} />
      <div className="cj-sign" style={{ left: W * 0.06, top: H * 0.78 }}>
        {sign}
      </div>
      {mode === "destination" && (
        <div className="cj-office" style={{ left: W * 0.07, top: H * 0.06, width: platformR - W * 0.1, height: H * 0.31 }}>
          <b>WE3VISION</b>
          <span>Head office</span>
          <i className="cj-door" />
        </div>
      )}

      {/* the train: the engine is at the bottom (it comes first), the coaches follow above it */}
      <div className="cj-train" data-gone={gone} data-in={trainIn} style={{ left: trackX - COACH_W / 2, height: TRAIN_L, transform: `translateY(${top}px)` }}>
        {Array.from({ length: COACHES }, (_, i) => {
          const n = COACHES - i; // from the top: coach 3, 2, 1
          return (
            <div key={n} className="cj-coach" data-first={n === 1} style={{ top: i * (COACH_L + GAP), height: COACH_L }}>
              <span className="cj-roof" />
              <span className="cj-win cj-win-l" />
              <span className="cj-win cj-win-r" />
              <span className="cj-door-mark" />
              {n === 1 && (
                <span className="cj-seats">
                  {Array.from({ length: 10 }, (_, k) => (
                    <i key={k} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
        <div className="cj-engine" style={{ top: TRAIN_L - ENGINE_L, height: ENGINE_L }}>
          <span className="cj-cab" />
          <span className="cj-nose" />
          <em>W3V</em>
        </div>
        <i className="cj-light" style={{ top: TRAIN_L - 4 }} />
      </div>

      {/* the passenger: "You" */}
      {show && (
        <div
          className="of-walker cj-av"
          data-pose={moving ? "walk" : "idle"}
          data-sync={withTrain}
          style={{ "--tone": 352, transform: `translate(${px}px, ${py}px)` } as React.CSSProperties}
        >
          <div className="of-walker-in" style={{ transform: `rotate(${rot}deg)` }}>
            <PersonTop seated={seated && (mode === "origin" || leg === "seat")} />
          </div>
          <span className="cj-you">You</span>
        </div>
      )}
    </div>
  );
}
