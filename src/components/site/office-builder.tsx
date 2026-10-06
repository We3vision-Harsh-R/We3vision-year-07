"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { cut, makeFiles, tokenize, type Token } from "./office-code";
import { OfficeArt } from "./office-art";
import { BuiltSite, SECTION_NAMES } from "./office-site";

// The big office scene of the web development page: a full-screen company office. The cartoon guide (with glasses, a smart look) sits at
// its desk and, after the visitor types a brand name, writes the code of a website for 20 seconds. The code appears on the big screen
// behind it (an editor with three files and a build plan). Then the site is deployed and built on the same screen, section by section
// (always the same design with ten sections made of boxes, pictures, text lines and small animations), and the browser scrolls through
// it. After that the visitor can play: pick a colour, switch light / dark, desktop / tablet / phone, click any section to remix it, drag
// the page, look at the code again, or type another name. Everything on the screen is real HTML, scaled to the size of the screen.

const CODING_MS = 20000;
const PALETTE = [354, 46, 86, 114, 250, 291];
const DEVICES = { desktop: 1280, tablet: 820, phone: 390 } as const;
type Device = keyof typeof DEVICES;
type Phase = "idle" | "coding" | "building" | "live";
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function CodeLine({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((k, i) => (
        <span key={i} className={`tk-${k.t}`}>
          {k.s}
        </span>
      ))}
    </>
  );
}

export function OfficeBuilder({ chip, heading, tips }: { chip: string; heading: string; text?: string; tips: string[] }) {
  const secRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const [logs, setLogs] = useState(0);
  const [shown, setShown] = useState(0);
  const [variants, setVariants] = useState<number[]>(Array(10).fill(0));
  const [palette, setPalette] = useState(0);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [device, setDevice] = useState<Device>("desktop");
  const [view, setView] = useState<"code" | "site">("code");
  const [tour, setTour] = useState(true);
  const [tab, setTab] = useState(0);
  const [hop, setHop] = useState([0, 0, 0]);
  const [tip, setTip] = useState(0);
  const [toast, setToast] = useState("");
  const [shake, setShake] = useState(0);
  const [focus, setFocus] = useState(false);
  const [box, setBox] = useState({ w: 800, h: 450 });

  const files = useMemo(() => makeFiles(brand || name), [brand, name]);
  const lens = files.map((f) => f.text.length);
  const total = lens.reduce((a, b) => a + b, 0);
  const progress = phase === "idle" ? 0 : phase === "coding" ? clamp(typed / total) : 1;
  const slug = ((brand || name).toLowerCase().replace(/[^a-z0-9]+/g, "") || "yourbrand") + ".com";
  const tokens = useMemo(() => files.map((f) => f.text.split("\n").map((l) => tokenize(l, f.lang))), [files]);

  // which file is being typed
  let fileIdx = 0;
  let before = 0;
  for (let i = 0; i < lens.length; i++) {
    if (typed >= before + lens[i] && i < lens.length - 1) {
      before += lens[i];
      fileIdx = i + 1;
    }
  }
  const activeTab = phase === "coding" ? fileIdx : tab;

  // ---- the coding: 20 seconds, time based
  useEffect(() => {
    if (phase !== "coding") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 2500 : CODING_MS;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const p = clamp((performance.now() - t0) / dur);
      const wob = 0.004 * Math.sin(p * 50);
      setTyped(Math.floor(total * clamp(p + (p < 1 ? wob : 0))));
      if (p >= 1) {
        window.clearInterval(id);
        setTyped(total);
        setPhase("building");
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [phase, total]);

  // ---- the build: some log lines, then the sections one after the other
  useEffect(() => {
    if (phase !== "building") return;
    let n = 0;
    let id = 0;
    const t: number[] = [];
    [0, 1, 2, 3, 4].forEach((k) => t.push(window.setTimeout(() => setLogs(k + 1), 350 + k * 420)));
    t.push(
      window.setTimeout(() => {
        setView("site");
        id = window.setInterval(() => {
          n++;
          setShown(n);
          if (n >= SECTION_NAMES.length) {
            window.clearInterval(id);
            window.setTimeout(() => setPhase("live"), 900);
          }
        }, 700);
      }, 2700),
    );
    return () => {
      t.forEach((x) => window.clearTimeout(x));
      window.clearInterval(id);
    };
  }, [phase]);

  // the code view follows the last line
  useLayoutEffect(() => {
    const el = codeRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [typed, activeTab, phase]);

  // ---- when the section comes into view it glides to the top, so the office fills the whole screen, then the name field gets the focus
  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) return;
    let armed = true;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.03) {
          armed = true;
          return;
        }
        if (!armed || e.intersectionRatio < 0.18 || e.intersectionRatio > 0.97) return;
        armed = false;
        if (Math.abs(el.getBoundingClientRect().top) < 4) return;
        const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
        if (lenis) lenis.scrollTo(el, { duration: 1.25, lock: false });
        else el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.clearTimeout(t);
        t = window.setTimeout(() => {
          if (!window.matchMedia("(pointer: coarse)").matches) document.getElementById("ob-name")?.focus({ preventScroll: true });
        }, 1500);
      },
      { threshold: [0, 0.03, 0.18, 0.5, 0.97, 1] },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // ---- the size of the screen
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const designW = DEVICES[device];
  const frameW = device === "desktop" ? box.w : device === "tablet" ? Math.min(box.w * 0.72, box.h * 0.78) : Math.min(box.w * 0.34, box.h * 0.48);
  const scale = frameW / designW;
  const scaleRef = useRef(scale);
  const shownRef = useRef(0);
  const syRef = useRef(0);
  const userUntil = useRef(0);
  const drag = useRef<{ y: number; moved: boolean } | null>(null);
  const dragMoved = useRef(false);
  useEffect(() => {
    scaleRef.current = scale;
    shownRef.current = shown;
  });

  // ---- the browser scrolls: it follows the newest section, then tours the page (a drag or a click on the bar stops the tour for a while)
  const phaseRef = useRef<Phase>("idle");
  const tourRef = useRef(true);
  useEffect(() => {
    phaseRef.current = phase;
    tourRef.current = tour;
  });
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let idx = 1;
    let dwell = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const inner = innerRef.current;
      const vp = vpRef.current;
      if (!inner || !vp || !visible.current) return;
      const sc = scaleRef.current || 1;
      const vh = vp.clientHeight / sc;
      const total = inner.scrollHeight;
      const max = Math.max(0, total - vh);
      const secs = inner.querySelectorAll<HTMLElement>("[data-sec]");
      const tops = Array.from(secs, (s) => s.offsetTop);
      let target = syRef.current;
      let auto = false;
      if (phaseRef.current === "building") {
        target = clamp(tops[Math.max(0, shownRef.current - 1)] - 16, 0, max);
        auto = true;
      } else if (phaseRef.current === "live" && tourRef.current && now > userUntil.current) {
        target = clamp(tops[idx % tops.length] - 16, 0, max);
        auto = true;
        if (Math.abs(syRef.current - target) < 4) {
          dwell += dt;
          if (dwell > 2.3) {
            idx = (idx + 1) % tops.length;
            dwell = 0;
          }
        } else dwell = 0;
      }
      if (auto) syRef.current += (target - syRef.current) * (1 - Math.exp(-dt * 3));
      syRef.current = clamp(syRef.current, 0, max);
      inner.style.transform = `translateY(${(-syRef.current * sc).toFixed(1)}px) scale(${sc})`;
      const th = thumbRef.current;
      if (th) {
        const frac = clamp(vh / Math.max(vh, total));
        th.style.height = `${(frac * 100).toFixed(1)}%`;
        th.style.top = `${((max ? syRef.current / max : 0) * (1 - frac) * 100).toFixed(1)}%`;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---- look at the pointer, or at the screen while working; talk
  const talkT = useRef(0);
  const talk = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.dataset.talk = "1";
    window.clearTimeout(talkT.current);
    talkT.current = window.setTimeout(() => {
      if (el) el.dataset.talk = "0";
    }, 1500);
  }, []);
  const phaseForLook = useRef<Phase>("idle");
  useEffect(() => {
    phaseForLook.current = phase;
    const el = rootRef.current;
    if (!el) return;
    if (phase === "coding" || phase === "building") {
      el.style.setProperty("--lx", "0.9");
      el.style.setProperty("--ly", "-0.35");
    }
  }, [phase]);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      if (phaseForLook.current === "coding" || phaseForLook.current === "building") return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lx", clamp((px - (r.left + r.width * 0.21)) / (r.width * 0.5), -1, 1).toFixed(3));
      el.style.setProperty("--ly", clamp((py - (r.top + r.height * 0.42)) / (r.height * 0.5), -1, 1).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!raf && visible.current) raf = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    const id = window.setInterval(() => {
      if (visible.current) {
        if (phaseForLook.current === "idle" || phaseForLook.current === "live") {
          setTip((n) => n + 1);
          talk();
        }
      }
    }, 5200);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearInterval(id);
      window.clearTimeout(talkT.current);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [talk]);

  // ---- what the guide says
  const nm = (brand || name || "your brand").trim();
  let say = tips.length ? tips[tip % tips.length] : "Type a brand name below.";
  if (phase === "idle" && name.trim()) say = `${name.trim()}: great name! Press the button and watch me work.`;
  if (phase === "coding") {
    say =
      progress < 0.1
        ? `Kick-off for ${nm}: the designer sketches the layout, the developer sets up the project, the tester plans the checks.`
        : progress < 0.42
          ? "The designer builds every section while the developer writes index.html and the tester starts checking."
          : progress < 0.66
            ? "The developer styles it in styles.css, the designer picks colours and fonts, the tester checks the layout."
            : progress < 0.92
              ? "Animations go in now. The tester tries it on a phone and the designer polishes the details."
              : "All tests are green. One last check, then we deploy!";
  }
  if (phase === "building") say = shown ? `Live build: ${SECTION_NAMES[Math.max(0, shown - 1)]}… the team watches the big screen.` : "The developer compiles and deploys, the tester opens the live site.";
  if (phase === "live") say = [`${nm} is live! Click any section to remix it.`, "Pick another colour, or try the phone view.", "Drag the page to scroll it yourself.", "Want a different name? Type one below and rebuild."][tip % 4];

  const start = (e?: FormEvent) => {
    e?.preventDefault();
    if (phase === "coding" || phase === "building") return;
    const n = name.trim();
    if (!n) {
      setShake((s) => s + 1);
      setTip(0);
      return;
    }
    setBrand(n);
    setTyped(0);
    setLogs(0);
    setShown(0);
    setVariants(Array(10).fill(0));
    syRef.current = 0;
    setView("code");
    setTab(0);
    setPhase("coding");
    setHop([1, 1, 1].map((n, i) => hop[i] + n));
    talk();
  };
  const skip = () => {
    if (phase === "coding") {
      setTyped(total);
      setPhase("building");
    }
  };
  const flash = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast((x) => (x === t ? "" : x)), 1800);
  };
  const remix = (i: number) => {
    if (dragMoved.current) return;
    setVariants((v) => v.map((x, k) => (k === i ? (x + 1) % 3 : x)));
    flash(`Remixed: ${SECTION_NAMES[i]}`);
  };
  const busy = phase === "coding" || phase === "building";
  const q = phase === "coding" ? progress : 1;
  const pick = (a: string[], p: number) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
  const TESTS = ["layout", "colours", "links", "speed", "phone view"];
  const acts =
    phase === "idle"
      ? ["Waiting for a name", "Waiting for a name", "Waiting for a name"]
      : phase === "coding"
        ? [
            pick(["Sketching the layout", "Designing sections", "Picking colours", "Polishing details", "Handing over"], q),
            pick(["Setting up the project", "Writing index.html", "Styling in styles.css", "Adding animations", "Final commit"], q),
            q < 0.38 ? "Writing test cases" : q >= 0.95 ? "All tests passed" : `Testing: ${TESTS[Math.min(4, Math.floor(clamp((q - 0.38) / 0.57) * 5))]}`,
          ]
        : phase === "building"
          ? ["Final design review", `Deploying to ${slug}`, "Opening the live site"]
          : ["Site is live!", "Site is live!", "All green!"];
  const pct = Math.round(progress * 100);
  const file = files[activeTab] ?? files[0];
  const nTyped = phase === "coding" ? (activeTab === fileIdx ? typed - before : 0) : lens[activeTab];
  const fileTokens = tokens[activeTab] ?? [];
  const fullLines = file.text.split("\n");
  const vis: Token[][] = [];
  {
    let left = nTyped;
    for (let i = 0; i < fullLines.length && left > 0; i++) {
      vis.push(cut(fileTokens[i] ?? [], left));
      left -= fullLines[i].length + 1;
    }
  }
  const lastLine = Math.max(1, vis.length);
  const lastCol = (vis[vis.length - 1] ?? []).reduce((a, k) => a + k.s.length, 0) + 1;

  return (
    <section ref={secRef} id="guide" className="ob-sec">
      <div ref={rootRef} className="ob gs" data-phase={phase} data-talk="0" data-device={device}>
        <h2 className="sr-only">
          {chip}: {heading}
        </h2>

        <div className="ob-screenwrap" data-view={view}>
          <div className="ob-screen">
            <div className="ob-chrome">
              <i />
              <i />
              <i />
              {view === "code" ? (
                <div className="ob-tabs" role="tablist">
                  {files.map((f, i) => (
                    <button key={f.name} type="button" role="tab" aria-selected={activeTab === i} data-on={activeTab === i} disabled={phase === "coding" && i > fileIdx} onClick={() => setTab(i)}>
                      {f.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="ob-url">
                  <span>{(brand || name || "B").charAt(0).toUpperCase()}</span>
                  <b>https://{slug}</b>
                </div>
              )}
              <span className="ob-live" data-on={phase === "live"}>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6M2 12a9 9 0 0 1 8 8M2 16a5 5 0 0 1 4 4M2 20h.01" />
                </svg>
                {phase === "live" ? "LIVE" : phase === "idle" ? "WAITING" : phase === "coding" ? `CASTING · CODING ${pct}%` : "CASTING · DEPLOYING"}
              </span>
            </div>

            {/* the code editor */}
            <div className="ob-code-view" aria-hidden={view !== "code"}>
              <aside className="ob-explorer">
                <b>EXPLORER</b>
                <p>{(brand || name || "your-brand").toLowerCase().replace(/[^a-z0-9]+/g, "-")}/</p>
                {files.map((f, i) => (
                  <span key={f.name} data-on={activeTab === i} data-made={phase !== "idle" && (phase !== "coding" || i <= fileIdx)}>
                    {f.name}
                  </span>
                ))}
                <span data-made={phase !== "idle"}>assets/</span>
                <span data-made={phase === "building" || phase === "live"}>dist/</span>
              </aside>
              <div className="ob-editor">
                <div ref={codeRef} className="ob-code">
                  {phase === "idle" ? (
                    <pre>
                      <span className="tk-com">{"// Type a brand name below and press the button.\n// I will write the website for it, live, right here."}</span>
                      <span className="ob-caret" />
                    </pre>
                  ) : (
                    <pre>
                      {vis.map((ln, i) => (
                        <div key={i} className="ob-ln">
                          <span className="ob-no">{i + 1}</span>
                          <code>
                            <CodeLine tokens={ln} />
                            {i === vis.length - 1 && phase === "coding" && <span className="ob-caret" />}
                          </code>
                        </div>
                      ))}
                    </pre>
                  )}
                </div>
                <div className="ob-status">
                  <span>
                    Ln {lastLine}, Col {lastCol}
                  </span>
                  <span>{file.lang.toUpperCase()}</span>
                  <span>UTF-8</span>
                  <span className="ob-bar">
                    <i style={{ width: `${pct}%` }} />
                  </span>
                </div>
                {phase === "building" && (
                  <div className="ob-term">
                    {["✔ Compiled 3 files", "✔ Optimized images and fonts", "✔ Minified CSS and JavaScript", `▲ Deploying to ${slug}`, "✔ Live! Opening the browser…"].slice(0, logs).map((l) => (
                      <p key={l}>{l}</p>
                    ))}
                  </div>
                )}
              </div>
              <aside className="ob-plan">
                <b>BUILD PLAN</b>
                {SECTION_NAMES.map((s, i) => {
                  const done = phase === "idle" ? false : progress >= (i + 1) / 10 || phase !== "coding";
                  const now = phase === "coding" && !done && progress >= i / 10;
                  return (
                    <span key={s} data-done={done} data-now={now}>
                      <i />
                      {s}
                    </span>
                  );
                })}
              </aside>
            </div>

            {/* the browser with the site that was built */}
            <div className="ob-browser" data-device={device} aria-hidden={view !== "site"}>
              <div
                ref={vpRef}
                className="ob-viewport"
                onPointerDown={(e) => {
                  if (e.pointerType !== "mouse") return;
                  drag.current = { y: e.clientY, moved: false };
                  dragMoved.current = false;
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  const d = drag.current;
                  if (!d) return;
                  const dy = e.clientY - d.y;
                  if (Math.abs(dy) > 2) {
                    d.moved = true;
                    dragMoved.current = true;
                  }
                  d.y = e.clientY;
                  syRef.current -= dy / (scaleRef.current || 1);
                  userUntil.current = performance.now() + 7000;
                }}
                onPointerUp={() => {
                  drag.current = null;
                  window.setTimeout(() => (dragMoved.current = false), 30);
                }}
                onWheel={(e) => {
                  if (e.shiftKey) {
                    syRef.current += e.deltaY / (scaleRef.current || 1);
                    userUntil.current = performance.now() + 7000;
                  }
                }}
              >
                <div className="ob-frame" style={{ width: frameW, height: "100%" }} data-device={device}>
                  <div ref={innerRef} className="ob-inner" style={{ width: designW } as CSSProperties}>
                    <div
                      className="ws-root"
                      data-device={device}
                      style={{ "--wo": PALETTE[palette] } as CSSProperties}
                    >
                      <BuiltSite brand={brand || name} shown={shown} variants={variants} onRemix={remix} mode={mode} />
                    </div>
                  </div>
                </div>
                <span className="ob-sb" aria-hidden>
                  <span ref={thumbRef} className="ob-sb-thumb" />
                </span>
              </div>
              {toast && <p className="ob-toast">{toast}</p>}
            </div>
          </div>
        </div>

        <div className="ob-stage">
          <OfficeArt
            phase={phase}
            progress={progress}
            brand={brand || name}
            hop={hop}
            acts={acts}
            code={{ lines: vis, from: 0, file: file.name, col: lastCol }}
            onPerson={(i) => {
              setHop((h) => h.map((n, k) => (k === i ? n + 1 : n)));
              setTip((n) => n + 1);
              talk();
            }}
          />
          <p key={say} className="gs-bubble ob-bubble lg" role="status" aria-live="polite">
            <b className="ob-b-eye">
              <i /> Team talk
            </b>
            {say}
          </p>

          {phase === "live" && (
            <div className="ob-tools lg">
              <div className="ob-tg">
                <span className="ob-lab">Colour</span>
                <div className="ob-sw" role="group" aria-label="Colour of the site">
                  {PALETTE.map((o, i) => (
                    <button
                      key={o}
                      type="button"
                      aria-label={`Colour ${i + 1}`}
                      data-on={palette === i}
                      style={{ background: `linear-gradient(135deg, hsl(calc(var(--th) + ${o}) calc(88% * var(--ts)) 66%), hsl(calc(var(--th) + ${o + 36}) calc(78% * var(--ts)) 52%))` }}
                      onClick={() => {
                        setPalette(i);
                        flash("New colour");
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="ob-tg">
                <span className="ob-lab">Device</span>
                <div className="ob-seg" role="group" aria-label="Device">
                  {(["desktop", "tablet", "phone"] as Device[]).map((d) => (
                    <button key={d} type="button" data-on={device === d} onClick={() => setDevice(d)}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ob-tg">
                <span className="ob-lab">Mode</span>
                <div className="ob-seg" role="group" aria-label="Mode">
                  {(["light", "dark"] as const).map((m) => (
                    <button key={m} type="button" data-on={mode === m} onClick={() => setMode(m)}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ob-tg">
                <span className="ob-lab">Screen</span>
                <div className="ob-seg" role="group" aria-label="Screen">
                  <button type="button" data-on={view === "site"} onClick={() => setView("site")}>
                    preview
                  </button>
                  <button type="button" data-on={view === "code"} onClick={() => setView("code")}>
                    code
                  </button>
                </div>
              </div>
              <button type="button" className="ob-mini" data-on={tour} onClick={() => setTour((t) => !t)}>
                {tour ? "Auto tour: on" : "Auto tour: off"}
              </button>
            </div>
          )}
          <div className="ob-ctl">
            <form className="ob-form" onSubmit={start}>
              <div className="ob-lrow">
                <label htmlFor="ob-name">
                  <b>1</b> Your brand name
                </label>
                {phase === "coding" && (
                  <button type="button" className="ob-skip" onClick={skip}>
                    Skip the coding →
                  </button>
                )}
              </div>
              <div className="ob-pill lg" data-busy={busy} data-focus={focus} data-idle={!busy && !focus && !name} key={shake} data-shake={shake > 0}>
                <input
                  id="ob-name"
                  value={name}
                  maxLength={20}
                  disabled={busy}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Type your brand name"
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  onChange={(e) => setName(e.target.value)}
                />
                <svg className="ob-ring" viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="10" style={{ strokeDashoffset: 62.8 - 62.8 * clamp(name.length / 20) }} />
                </svg>
                <button type="submit" disabled={busy}>
                  {phase === "coding" ? `Coding… ${pct}%` : phase === "building" ? "Deploying…" : phase === "live" ? "Rebuild" : "Build my website"}
                  <i aria-hidden>→</i>
                </button>
                {busy && <span className="ob-pbar" style={{ width: `${pct}%` }} />}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
