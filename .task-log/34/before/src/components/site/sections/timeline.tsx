"use client";

import { useEffect, useMemo, useRef } from "react";
import { Reveal } from "../reveal";
import { OfficeStage } from "../timeline-office";
import { BenchTop, BushTop, PersonTop, TreeTop } from "../timeline-art";
import { SectionHead, Wide } from "../ui";
import type { SectionComponent } from "./shared";

// Vertical timeline: a glowing line down the middle, years on one side and glass cards on the other (stacked on phones).
// The story walks along it, seen from above: three founders (Smit, Harsh, Vatsal) walk down the line while you scroll, Harsh in front.
// At `leaveYear` two of them drop out of the journey: each sits down on his own bench in a small garden beside the line (there is
// room for it under that year), and the centre one keeps walking. At `partnerYear` a fourth one (Parth) joins him and they walk
// on side by side. The line ends in the last screen, the office of `finalYear`: a huge year, the goal of the company and the seven
// teams at work, where the two of them walk in over the big year and sit down in their boss chairs.

const GAP = 76; // px between the three while they walk one behind the other (a figure is 66 px high)
const ZONE = 280; // height of the garden under the leave year
const BENCH_A = 74; // the benches (px under the start of the garden)
const BENCH_B = 186;
const SIDE = 60; // how far from the line the benches stand
const ABREAST = 34; // the two founders walk this far to the left / right of the line (a figure is 47 px wide)
const PHONE_GAP = 52; // on a phone the partner walks this far to the right of the line

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TONES = ["300", "352", "40", "20"]; // blazer hue offsets (left, centre, right, partner)

export const Timeline: SectionComponent<"timeline"> = ({ data }) => {
  const names = useMemo(() => {
    const l = (data.names || "").split("\n").map((x) => x.trim()).filter(Boolean);
    return [l[0] || "Smit", l[1] || "Harsh", l[2] || "Vatsal"];
  }, [data.names]);
  const partner = (data.partnerName || "").trim() || "Parth";
  const teams = useMemo(() => (data.teams || "").split("\n").map((x) => x.trim()).filter(Boolean), [data.teams]);
  const n = data.items.length;
  const leave = useMemo(() => {
    const i = data.items.findIndex((x) => x.year.trim() === (data.leaveYear || "").trim());
    return i >= 0 && i < n - 1 ? i : Math.min(2, Math.max(0, n - 2));
  }, [data.items, data.leaveYear, n]);
  const joinAt = useMemo(() => {
    const i = data.items.findIndex((x) => x.year.trim() === (data.partnerYear || "").trim());
    return i > leave ? i : Math.min(n - 1, leave + 2);
  }, [data.items, data.partnerYear, leave, n]);

  const sectionRef = useRef<HTMLElement>(null);
  const olRef = useRef<HTMLOListElement>(null);
  const personRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    const section = sectionRef.current;
    const ol = olRef.current;
    if (!section || !ol || n < 2) return;
    const end = section.querySelector<HTMLElement>(".tl-end");
    const stage = section.querySelector<HTMLElement>(".tl-stage");
    const office = section.querySelector<HTMLElement>(".of");
    const stagePersons = Array.from(section.querySelectorAll<HTMLElement>("[data-sp]"));
    const world = ol.querySelector<HTMLElement>(".tl-world");
    const dots = Array.from(ol.querySelectorAll<HTMLElement>("[data-dot]"));
    const garden = Array.from(ol.querySelectorAll<HTMLElement>("[data-garden]"));
    if (!world || dots.length < 2 || !end || !stage || !office) return;
    let ys: number[] = [];
    let lineX = 0;
    let zoneTop = 0; // y where the garden starts (under the leave year)
    let wide = true;
    let joinSide = 1; // which side of the line he waits on: the one without the year text
    let raf = 0;
    let idleT = 0;
    let lastY = -1;
    let lastS = -1;

    const measure = () => {
      const or = ol.getBoundingClientRect();
      ys = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return r.top - or.top + r.height / 2;
      });
      const d0 = dots[0].getBoundingClientRect();
      lineX = d0.left - or.left + d0.width / 2;
      wide = window.innerWidth >= 640;
      const jp0 = dots[joinAt].closest("li")?.querySelector("p");
      joinSide = wide && jp0 && jp0.getBoundingClientRect().left > d0.left ? -1 : 1;
      const li = dots[leave].closest("li");
      const lb = li ? li.getBoundingClientRect().bottom - or.top : ys[leave] + 200;
      zoneTop = lb - ZONE + 30;
      // put the garden in its place (the benches and the trees are placed here, the CSS only colours them)
      garden.forEach((el) => {
        const kind = el.dataset.k;
        const ox = parseFloat(el.dataset.x || "0");
        const oy = parseFloat(el.dataset.y || "0");
        // on phones everything stands on the right of the line; the back of a bench is always on its outer side
        const x = wide ? ox : kind === "lawn" ? 150 : Math.abs(ox);
        el.style.top = `${(zoneTop + oy).toFixed(1)}px`;
        el.style.left = `${(lineX + x).toFixed(1)}px`;
        if (kind === "bench") el.classList.toggle("tl-flip", wide ? ox > 0 : true);
      });
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const or = ol.getBoundingClientRect();
      const er = end.getBoundingClientRect();
      const pinned = er.top <= 0;
      // the centre walker stays near the middle of the screen while the page scrolls past (also on the stretch of line that
      // leads to the last screen); once the last screen is pinned, the walk goes on inside it
      const gy = Math.max(ys[0], vh * 0.52 - or.top);
      const seatA = zoneTop + BENCH_A;
      const seatB = zoneTop + BENCH_B;
      const moving = Math.abs(gy - lastY) > 0.2;
      lastY = gy;

      // the partner joins at his year: from the moment the centre one has crossed it, they go on side by side
      const jp = clamp((gy - ys[joinAt]) / 110);
      const jpe = ease(jp);
      const dx = wide ? ABREAST : 0;

      const poses: { y: number; x: number; face: string; pose: string; wave: boolean; show: boolean; a?: number; tag?: string }[] = [];
      // 0 Smit, 1 Harsh, 2 Vatsal: Harsh walks in front, Vatsal and Smit follow him
      [Math.min(gy - 2 * GAP, seatA), gy, Math.min(gy - GAP, seatB)].forEach((y, i) => {
        const seat = i === 0 ? seatA : i === 2 ? seatB : null;
        const sat = seat !== null && y >= seat - 0.5;
        let x = i === 1 ? lineX - dx * jpe : lineX;
        let face = "down";
        if (seat !== null) {
          const side = wide ? (i === 0 ? -SIDE : SIDE) : SIDE; // wide: Smit on the left bench, Vatsal on the right one
          const near = clamp((y - (seat - 56)) / 56);
          x = lerp(lineX, lineX + side, ease(near));
          if (near > 0.02) face = side < 0 ? "left" : "right";
          if (sat) face = side < 0 ? "right" : "left"; // sitting, he looks back at the line
        }
        // the two who follow him come in out of a blur at the start of the line; once seated they wave after him
        const a = i === 1 ? 1 : clamp((y - (ys[0] - 24)) / 56);
        const wave = sat && gy - (seat as number) < 420;
        poses.push({ y, x, face, pose: sat ? "sit" : moving ? "walk" : "idle", wave, show: true, a, tag: i === 2 ? "r" : "l" });
      });
      // 3 the partner: he stands at his year from the start, waves when the centre one comes near and, once that one has
      // crossed him, goes on with him side by side
      const py = ys[joinAt];
      const near = gy > py - 150 && gy < py + 20;
      poses.push({
        // coming over from the far side he drops back for a moment so that they do not walk through each other
        y: Math.max(py, gy) - (joinSide < 0 ? 30 * Math.sin(Math.PI * jpe) : 0),
        x: lerp(lineX + (wide ? 56 : PHONE_GAP) * joinSide, lineX + (wide ? ABREAST : PHONE_GAP), jpe),
        face: jp > 0.5 ? "down" : joinSide < 0 ? "right" : "left",
        pose: jp > 0 && moving ? "walk" : "idle",
        wave: near,
        show: true,
        // his name stands on the side away from the one he waits for
        tag: jp < 0.5 && joinSide < 0 ? "l" : "r",
      });
      // on a phone there is no room beside the line for the name of the one who walks on the line
      if (!wide) {
        poses.forEach((p, i) => {
          p.tag = i === 1 && jp > 0.1 ? "none" : "r";
        });
      }

      poses.forEach((p, i) => {
        const el = personRefs.current[i];
        if (!el) return;
        el.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
        if (el.dataset.pose !== p.pose) el.dataset.pose = p.pose;
        if (el.dataset.face !== p.face) el.dataset.face = p.face;
        const wv = p.wave ? "true" : "false";
        if (el.dataset.wave !== wv) el.dataset.wave = wv;
        if (p.tag && el.dataset.tag !== p.tag) el.dataset.tag = p.tag;
        // the two walkers who go on are taken over by the last screen once it is pinned
        el.style.visibility = p.show && !(pinned && (i === 1 || i === 3)) ? "visible" : "hidden";
        // the newcomer comes in out of a blur
        const al = p.a ?? 1;
        el.style.opacity = al.toFixed(3);
        el.style.filter = al < 0.999 ? `blur(${((1 - al) * 9).toFixed(1)}px)` : "";
      });

      // the garden appears when the first of them gets near it
      const g = clamp((gy - (zoneTop - 260)) / 240);
      garden.forEach((el) => el.style.setProperty("--g", g.toFixed(3)));

      // the last screen: the two founders walk over the big year to the end of the line and sit down in their boss chairs
      const H = stage.clientHeight || vh;
      const W = stage.clientWidth || window.innerWidth;
      const u = parseFloat(getComputedStyle(office).getPropertyValue("--u")) || 1;
      const s = er.top <= 0 ? clamp(-er.top / Math.max(1, er.height - vh)) : 0;
      const sp = clamp(s / 0.3);
      const cx = W / 2;
      const cy = H * (W / H < 0.9 ? 0.62 : 0.58);
      const olLeft = or.left;
      const starts = [olLeft + lineX - dx, olLeft + lineX + (wide ? ABREAST : PHONE_GAP)];
      const finals = [cx - 38 * u, cx + 38 * u];
      const stageMoving = Math.abs(s - lastS) > 0.0004;
      lastS = s;
      stagePersons.forEach((el, k) => {
        const x = lerp(starts[k], finals[k], ease(sp));
        const y = lerp(vh * 0.52, cy, ease(sp));
        el.style.visibility = er.top <= 0 ? "visible" : "hidden";
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        const sat = sp >= 1;
        const pose = sat ? "sit" : stageMoving || sp < 1 ? "walk" : "idle";
        if (el.dataset.pose !== pose) el.dataset.pose = pose;
        // seated, they wave at the people of the office for a moment
        const wv = sat && s > 0.6 && s < 0.85 ? "true" : "false";
        if (el.dataset.wave !== wv) el.dataset.wave = wv;
      });

      window.clearTimeout(idleT);
      idleT = window.setTimeout(() => {
        personRefs.current.forEach((el) => {
          if (el && el.dataset.pose === "walk") el.dataset.pose = "idle";
        });
        stagePersons.forEach((el) => {
          if (el.dataset.pose === "walk" && lastS >= 0.3) el.dataset.pose = "sit";
          else if (el.dataset.pose === "walk" && lastS <= 0) el.dataset.pose = "idle";
        });
      }, 150);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(ol);
    document.fonts.ready.then(onResize, onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(idleT);
    };
  }, [n, leave, joinAt]);

  const people = [names[0], names[1], names[2], partner];

  return (
    <section id="journey" ref={sectionRef} className="pt-24 sm:pt-32">
      <Wide>
        <SectionHead chip={data.chip} heading={data.heading} />
        <ol ref={olRef} className="tl-ol relative mx-auto mt-16 max-w-[880px] pb-24">
          <span aria-hidden className="absolute bottom-0 left-[17px] top-0 w-px bg-gradient-to-b from-transparent via-violet/35 to-violet/35 sm:left-1/2" />
          {data.items.map((item, i) => {
            const right = i % 2 === 0; // desktop: even items on the right, odd on the left
            return (
              <li
                key={i}
                className="relative grid grid-cols-[36px_1fr] gap-x-4 pb-10 last:pb-0 sm:grid-cols-[1fr_36px_1fr] sm:gap-x-6"
                style={i === leave ? { paddingBottom: ZONE } : undefined}
              >
                <Reveal className={`col-start-2 sm:row-start-1 ${right ? "sm:col-start-3" : "sm:col-start-1 sm:text-right"}`}>
                  <p className="text-vfade pb-1 text-[2.4rem] font-semibold leading-none tracking-[-0.04em] sm:text-5xl">{item.year}</p>
                  <div className="card-glass mt-3 rounded-[19px] border border-violet/[0.12] p-5 text-base leading-relaxed text-orchid backdrop-blur-md">{item.text}</div>
                </Reveal>
                <span
                  aria-hidden
                  data-dot=""
                  className="absolute left-[11px] top-3 size-3.5 rounded-full bg-violet shadow-[0_0_0_5px_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.18),0_0_22px_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.7)] sm:static sm:col-start-2 sm:row-start-1 sm:mx-auto sm:mt-3"
                />
              </li>
            );
          })}

          {/* the walk, seen from above: the garden under the leave year and the walkers */}
          <div className="tl-world" aria-hidden>
            <span data-garden="" data-k="lawn" data-x="0" data-y="0" className="tl-lawn" />
            <span data-garden="" data-k="tree" data-x="-170" data-y="40" className="tl-g tl-g-tree">
              <TreeTop tone={0} />
            </span>
            <span data-garden="" data-k="tree" data-x="178" data-y="190" className="tl-g tl-g-tree">
              <TreeTop tone={1} />
            </span>
            <span data-garden="" data-k="bush" data-x="-120" data-y="220" className="tl-g tl-g-bush">
              <BushTop />
            </span>
            <span data-garden="" data-k="bush" data-x="130" data-y="30" className="tl-g tl-g-bush">
              <BushTop />
            </span>
            <span data-garden="" data-k="bench" data-x={-SIDE - 2} data-y={BENCH_A} className="tl-g tl-g-bench">
              <BenchTop />
            </span>
            <span data-garden="" data-k="bench" data-x={SIDE + 2} data-y={BENCH_B} className="tl-g tl-g-bench">
              <BenchTop />
            </span>
            {people.map((name, i) => (
              <div
                key={i}
                ref={(el) => void (personRefs.current[i] = el)}
                className="tl-p"
                data-tag={i >= 2 ? "r" : "l"}
                data-pose="idle"
                data-face="down"
                data-wave="false"
                style={{ "--tone": TONES[i], visibility: i === 3 ? "hidden" : undefined } as React.CSSProperties}
              >
                <span className="tl-tag">{name}</span>
                <PersonTop />
              </div>
            ))}
          </div>
        </ol>
      </Wide>

      {/* the last screen: the office of the final year */}
      <div className="tl-end">
        <div className="tl-stage">
          <OfficeStage teams={teams} finalYear={data.finalYear || "2027"} goalTitle={data.goalTitle} goalText={data.goalText} names={[names[1], partner]} />
        </div>
      </div>
      <span className="sr-only">{`${names[0]}, ${names[1]} and ${names[2]} walk the journey together; ${names[0]} and ${names[2]} stop after ${data.items[leave]?.year}; ${partner} joins ${names[1]} in ${data.items[joinAt]?.year}. The journey ends in ${data.finalYear || "2027"}. ${data.goalTitle} ${data.goalText} Our teams: ${teams.join(", ")}.`}</span>
    </section>
  );
};
