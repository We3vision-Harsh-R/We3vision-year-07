"use client";

import { useEffect, useRef, useState } from "react";

// "Learn graphic design": five short lessons with a little toy in each, so that a visitor who has never heard of kerning or CMYK understands what a
// graphic designer actually does. It also carries the words people search for (graphic design, logo design, typography, colour theory, vector,
// raster, Adobe Illustrator, Photoshop, InDesign, CMYK, RGB, print-ready, branding, layout ...).

const TABS = ["What is it?", "The elements", "The principles", "Vector or pixels?", "Where it is used"];

/* ---------------------------------------------------------------------------------------------------------------------------------- lesson 1 */

function Lesson1() {
  const [designed, setDesigned] = useState(false);
  return (
    <div className="gfx-ls gfx-l1">
      <div className="gfx-ls-text">
        <h3>Graphic design is visual communication</h3>
        <p>Graphic design means using shapes, colours, pictures and letters to carry a message to a person. A <b>logo</b> says who you are, a <b>poster</b> says what is happening, a <b>package</b> says what is inside and a <b>website</b> shows how to find your way. The designer decides what people see first, what they feel and what they do next.</p>
        <p>The same words look very different once a designer works on them. Press the button and see it.</p>
        <button type="button" className="gfx-toggle" onClick={() => setDesigned((d) => !d)} aria-pressed={designed}>
          <span>{designed ? "Show the plain text" : "Design it"}</span>
        </button>
      </div>
      <div className={`gfx-demo gfx-poster ${designed ? "is-designed" : ""}`} aria-live="polite">
        <div className="gfx-poster-shape" />
        <div className="gfx-poster-ring" />
        <p className="gfx-poster-kicker">Grand opening</p>
        <p className="gfx-poster-title">Fresh Coffee Corner</p>
        <p className="gfx-poster-text">Join us this Saturday. Free tasting for everyone.</p>
        <p className="gfx-poster-btn">Visit us</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------------------------------------------- lesson 2 */

const ELEMENTS = [
  { id: "line", name: "Line", text: "Lines guide the eye, divide space and give direction. A thin line feels elegant, a thick one feels strong." },
  { id: "shape", name: "Shape", text: "Circles feel friendly, squares feel stable and triangles feel dynamic. Shapes give a design its structure." },
  { id: "colour", name: "Colour", text: "Colour sets the mood and makes a brand recognisable. Designers use colour theory to choose palettes that work together." },
  { id: "type", name: "Typography", text: "Typography is the art of arranging letters. The right font and size make text easy to read and give it a personality." },
  { id: "space", name: "Space", text: "Empty space (white space) lets a design breathe. It makes important things stand out and the whole layout calmer." },
  { id: "image", name: "Image", text: "Photos and illustrations show things that words cannot. A good picture creates a feeling in a second." },
] as const;

function Lesson2() {
  const [on, setOn] = useState<Set<string>>(new Set());
  const [cur, setCur] = useState<string>("line");
  const flip = (id: string) => {
    setCur(id);
    setOn((s) => { const x = new Set(s); if (x.has(id)) x.delete(id); else x.add(id); return x; });
  };
  const has = (id: string) => on.has(id);
  const c = ELEMENTS.find((e) => e.id === cur)!;
  return (
    <div className="gfx-ls gfx-l2">
      <div className="gfx-ls-text">
        <h3>Six elements build every design</h3>
        <p>Click an element to add it to the poster. A designer mixes these six ingredients, in different amounts, in every logo, brochure and web page.</p>
        <div className="gfx-chips" role="group" aria-label="Design elements">
          {ELEMENTS.map((e) => <button key={e.id} type="button" className={has(e.id) ? "is-on" : ""} aria-pressed={has(e.id)} onClick={() => flip(e.id)}>{e.name}</button>)}
        </div>
        <p className="gfx-ls-note"><b>{c.name}.</b> {c.text}</p>
      </div>
      <div className="gfx-demo">
        <svg viewBox="0 0 300 400" className="gfx-el" role="img" aria-label="A poster that gets built from the design elements">
          <defs>
            <linearGradient id="gfx-el-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="hsl(calc(var(--th) + 354) calc(90% * var(--ts)) 62%)" />
              <stop offset="1" stopColor="hsl(calc(var(--th) + 326) calc(90% * var(--ts)) 52%)" />
            </linearGradient>
          </defs>
          <rect width="300" height="400" fill={has("colour") ? "url(#gfx-el-bg)" : "hsl(0 0% 82%)"} className="gfx-el-bg" />
          {has("space") && <rect x="22" y="22" width="256" height="356" fill="none" stroke="#fff" strokeOpacity=".7" strokeDasharray="5 5" />}
          {has("shape") && <><circle cx="215" cy="110" r="62" fill={has("colour") ? "hsl(calc(var(--th) + 127) calc(95% * var(--ts)) 68%)" : "hsl(0 0% 64%)"} /><rect x="46" y="236" width="70" height="70" fill={has("colour") ? "hsl(calc(var(--th) + 300) calc(80% * var(--ts)) 78%)" : "hsl(0 0% 70%)"} transform="rotate(-8 80 270)" /></>}
          {has("image") && <g transform="translate(40 60)"><rect width="130" height="100" rx="4" fill="#fff" /><path d="M0 100 L40 50 L68 78 L92 38 L130 100 Z" fill={has("colour") ? "hsl(calc(var(--th) + 212) calc(50% * var(--ts)) 46%)" : "hsl(0 0% 56%)"} /><circle cx="100" cy="24" r="12" fill={has("colour") ? "hsl(calc(var(--th) + 127) 95% 66%)" : "hsl(0 0% 70%)"} /></g>}
          {has("line") && <><path d="M40 200 H260" stroke="#fff" strokeWidth="4" strokeLinecap="round" /><path d="M40 214 H150" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".8" /></>}
          {has("type") ? (
            <g fill="#fff" fontFamily="Poppins, sans-serif">
              <text x="40" y="256" fontSize="44" fontWeight="700">Design</text>
              <text x="40" y="290" fontSize="18" fontWeight="500">for people</text>
              <text x="40" y="340" fontSize="12">Shapes, colour, type and space</text>
            </g>
          ) : (
            <g fill="hsl(0 0% 62%)"><rect x="40" y="244" width="150" height="16" rx="3" /><rect x="40" y="274" width="100" height="10" rx="3" /><rect x="40" y="330" width="170" height="8" rx="3" /></g>
          )}
        </svg>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------------------------------------------- lesson 3 */

const PRINCIPLES = [
  { id: "hierarchy", name: "Hierarchy", text: "Make the most important thing the biggest and boldest. The eye then knows where to start." },
  { id: "contrast", name: "Contrast", text: "Place light against dark, big against small. Contrast makes text readable and calls attention to what matters." },
  { id: "alignment", name: "Alignment", text: "Line things up on one invisible grid. Aligned layouts look tidy, professional and are easy to scan." },
  { id: "balance", name: "Balance", text: "Spread visual weight so that no side feels too heavy. A big picture on one side balances a block of text on the other." },
  { id: "repetition", name: "Repetition", text: "Repeat colours, fonts and shapes. Repetition ties pages together and makes a brand recognisable." },
  { id: "space", name: "Proximity and space", text: "Put related things close together and give unrelated things room. Space shows what belongs together." },
] as const;

function Mini({ k, good }: { k: string; good: boolean }) {
  const ink = "hsl(calc(var(--th) + 338) calc(30% * var(--ts)) 18%)";
  const acc = "hsl(calc(var(--th) + 354) calc(80% * var(--ts)) 56%)";
  const soft = "hsl(calc(var(--th) + 354) calc(20% * var(--ts)) 78%)";
  const line = (x: number, y: number, w: number, o = 1) => <rect x={x} y={y} width={w} height="6" rx="3" fill={ink} opacity={o} />;
  const bg = <rect width="240" height="170" rx="8" fill="#fff" />;
  if (k === "hierarchy")
    return good ? (
      <svg viewBox="0 0 240 170">{bg}<rect x="20" y="20" width="150" height="22" rx="4" fill={ink} /><rect x="20" y="52" width="100" height="10" rx="3" fill={soft} />{line(20, 80, 190, 0.5)}{line(20, 92, 170, 0.5)}{line(20, 104, 180, 0.5)}<rect x="20" y="126" width="64" height="26" rx="13" fill={acc} /></svg>
    ) : (
      <svg viewBox="0 0 240 170">{bg}<rect x="20" y="20" width="150" height="12" rx="3" fill={ink} /><rect x="20" y="42" width="150" height="12" rx="3" fill={ink} /><rect x="20" y="64" width="150" height="12" rx="3" fill={ink} /><rect x="20" y="86" width="150" height="12" rx="3" fill={ink} /><rect x="20" y="108" width="150" height="12" rx="3" fill={ink} /></svg>
    );
  if (k === "contrast")
    return good ? (
      <svg viewBox="0 0 240 170"><rect width="240" height="170" rx="8" fill="hsl(calc(var(--th) + 338) calc(40% * var(--ts)) 14%)" /><rect x="20" y="24" width="140" height="20" rx="4" fill="#fff" /><rect x="20" y="62" width="180" height="6" rx="3" fill="#fff" opacity=".65" /><rect x="20" y="76" width="150" height="6" rx="3" fill="#fff" opacity=".65" /><rect x="20" y="116" width="70" height="28" rx="14" fill={acc} /></svg>
    ) : (
      <svg viewBox="0 0 240 170"><rect width="240" height="170" rx="8" fill="hsl(0 0% 88%)" /><rect x="20" y="24" width="140" height="20" rx="4" fill="hsl(0 0% 80%)" /><rect x="20" y="62" width="180" height="6" rx="3" fill="hsl(0 0% 78%)" /><rect x="20" y="76" width="150" height="6" rx="3" fill="hsl(0 0% 78%)" /><rect x="20" y="116" width="70" height="28" rx="14" fill="hsl(0 0% 80%)" /></svg>
    );
  if (k === "alignment")
    return good ? (
      <svg viewBox="0 0 240 170">{bg}<path d="M24 10 V160" stroke={soft} strokeDasharray="3 4" /><rect x="24" y="20" width="120" height="16" rx="4" fill={ink} />{line(24, 52, 180, 0.5)}{line(24, 66, 150, 0.5)}<rect x="24" y="84" width="96" height="48" rx="4" fill={soft} /><rect x="24" y="142" width="56" height="18" rx="9" fill={acc} /></svg>
    ) : (
      <svg viewBox="0 0 240 170">{bg}<rect x="40" y="20" width="120" height="16" rx="4" fill={ink} />{line(22, 52, 180, 0.5)}{line(70, 66, 150, 0.5)}<rect x="110" y="84" width="96" height="48" rx="4" fill={soft} /><rect x="30" y="142" width="56" height="18" rx="9" fill={acc} /></svg>
    );
  if (k === "balance")
    return good ? (
      <svg viewBox="0 0 240 170">{bg}<rect x="20" y="24" width="90" height="14" rx="4" fill={ink} />{line(20, 52, 90, 0.5)}{line(20, 64, 76, 0.5)}{line(20, 76, 84, 0.5)}<rect x="20" y="110" width="52" height="22" rx="11" fill={acc} /><rect x="130" y="24" width="90" height="108" rx="6" fill={soft} /><circle cx="175" cy="62" r="16" fill={acc} opacity=".8" /></svg>
    ) : (
      <svg viewBox="0 0 240 170">{bg}<rect x="16" y="22" width="100" height="14" rx="4" fill={ink} />{line(16, 50, 100, 0.5)}<rect x="16" y="68" width="100" height="62" rx="6" fill={soft} /><circle cx="46" cy="90" r="16" fill={acc} opacity=".8" /><rect x="16" y="140" width="52" height="18" rx="9" fill={acc} /></svg>
    );
  if (k === "repetition")
    return good ? (
      <svg viewBox="0 0 240 170">{bg}{[0, 1, 2].map((i) => <g key={i}><rect x={16 + i * 74} y="30" width="64" height="110" rx="8" fill={soft} /><circle cx={48 + i * 74} cy="62" r="14" fill={acc} /><rect x={26 + i * 74} y="90" width="44" height="7" rx="3" fill={ink} /><rect x={26 + i * 74} y="104" width="34" height="6" rx="3" fill={ink} opacity=".5" /></g>)}</svg>
    ) : (
      <svg viewBox="0 0 240 170">{bg}<rect x="16" y="30" width="64" height="110" rx="14" fill={soft} /><circle cx="48" cy="62" r="14" fill={acc} /><rect x="92" y="38" width="64" height="94" rx="2" fill={acc} opacity=".35" /><rect x="102" y="86" width="40" height="7" fill={ink} /><rect x="168" y="30" width="56" height="110" rx="28" fill="hsl(calc(var(--th) + 127) 80% 76%)" /><rect x="176" y="100" width="40" height="7" rx="3" fill={ink} /></svg>
    );
  return good ? (
    <svg viewBox="0 0 240 170">{bg}<rect x="30" y="20" width="110" height="14" rx="4" fill={ink} />{line(30, 42, 140, 0.5)}{line(30, 54, 120, 0.5)}<rect x="30" y="76" width="140" height="1.5" fill={soft} /><rect x="30" y="98" width="70" height="40" rx="5" fill={soft} /><rect x="30" y="148" width="50" height="14" rx="7" fill={acc} /></svg>
  ) : (
    <svg viewBox="0 0 240 170">{bg}<rect x="8" y="8" width="110" height="14" rx="4" fill={ink} />{line(8, 24, 224, 0.5)}{line(8, 34, 224, 0.5)}{line(8, 44, 200, 0.5)}<rect x="8" y="54" width="224" height="50" rx="2" fill={soft} /><rect x="8" y="108" width="50" height="14" rx="7" fill={acc} />{line(8, 128, 224, 0.5)}{line(8, 138, 210, 0.5)}{line(8, 148, 224, 0.5)}</svg>
  );
}

function Lesson3() {
  const [i, setI] = useState(0);
  const [good, setGood] = useState(true);
  const p = PRINCIPLES[i];
  return (
    <div className="gfx-ls gfx-l3">
      <div className="gfx-ls-text">
        <h3>Principles: the rules designers follow</h3>
        <p>Colour and shapes are only the ingredients. Principles tell the designer how to arrange them. Pick a principle and switch it off and on.</p>
        <div className="gfx-chips" role="tablist" aria-label="Design principles">
          {PRINCIPLES.map((x, n) => <button key={x.id} type="button" role="tab" aria-selected={i === n} className={i === n ? "is-on" : ""} onClick={() => setI(n)}>{x.name}</button>)}
        </div>
        <p className="gfx-ls-note"><b>{p.name}.</b> {p.text}</p>
        <button type="button" className="gfx-toggle" onClick={() => setGood((g) => !g)} aria-pressed={good}><span>{good ? "Switch the principle off" : "Switch the principle on"}</span></button>
      </div>
      <div className="gfx-demo gfx-mini" data-good={good}>
        <Mini k={p.id} good={good} />
        <p className="gfx-mini-cap">{good ? `With ${p.name.toLowerCase()}` : `Without ${p.name.toLowerCase()}`}</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------------------------------------------- lesson 4 */

function Lesson4() {
  const [z, setZ] = useState(1);
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current?.getContext("2d");
    if (!c) return;
    const th = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--th")) || 284;
    c.clearRect(0, 0, 24, 24);
    c.fillStyle = `hsl(${th + 354} 85% 60%)`;
    for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) if ((x - 12) ** 2 + (y - 12) ** 2 <= 100) c.fillRect(x, y, 1, 1);
    c.fillStyle = "#fff";
    for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) if (Math.abs(x - 12) + Math.abs(y - 12) < 6) c.fillRect(x, y, 1, 1);
  }, []);
  return (
    <div className="gfx-ls gfx-l4">
      <div className="gfx-ls-text">
        <h3>Vector or pixels?</h3>
        <p><b>Vector</b> graphics are made of mathematical lines and curves, so they stay sharp at any size. This is what <b>Adobe Illustrator</b> makes: logos, icons and illustrations. <b>Raster</b> images are made of tiny pixels, like a photo. This is what <b>Adobe Photoshop</b> edits. <b>Adobe InDesign</b> arranges both into brochures, magazines and catalogues.</p>
        <label className="gfx-zoom">Zoom <input type="range" min="1" max="8" step="0.1" value={z} onChange={(e) => setZ(parseFloat(e.target.value))} /><b>{Math.round(z * 100)}%</b></label>
        <p className="gfx-ls-note"><b>RGB and CMYK.</b> Screens mix light (RGB) and can show glowing, vivid colours. Printers mix ink (CMYK), so some bright screen colours look duller on paper. That is why designers prepare separate files for screen and for print.</p>
        <div className="gfx-rgbcmyk" aria-hidden="true">
          {[[354, "RGB"], [127, "RGB"], [212, "RGB"]].map(([o], n) => (
            <span key={n}><i style={{ background: `hsl(calc(var(--th) + ${o}) calc(100% * var(--ts)) 55%)` }} /><i style={{ background: `hsl(calc(var(--th) + ${o}) calc(55% * var(--ts)) 48%)` }} /></span>
          ))}
          <small>screen (RGB) · print (CMYK)</small>
        </div>
      </div>
      <div className="gfx-demo gfx-vr">
        <figure>
          <div className="gfx-vr-box"><svg viewBox="0 0 24 24" style={{ transform: `scale(${z})` }}><circle cx="12" cy="12" r="10" fill="hsl(calc(var(--th) + 354) calc(85% * var(--ts)) 60%)" /><path d="M12 6 L13.8 10.4 L18.5 10.7 L14.9 13.7 L16 18.2 L12 15.7 L8 18.2 L9.1 13.7 L5.5 10.7 L10.2 10.4 Z" fill="#fff" /></svg></div>
          <figcaption>Vector<small>sharp at every size</small></figcaption>
        </figure>
        <figure>
          <div className="gfx-vr-box"><canvas ref={cv} width="24" height="24" style={{ transform: `scale(${z})` }} /></div>
          <figcaption>Raster<small>pixels appear when you enlarge</small></figcaption>
        </figure>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------------------------------------------- lesson 5 */

const USES = [
  { n: "Brand identity", t: "Logo, colours, fonts and rules that make a business recognisable." },
  { n: "Marketing and advertising", t: "Social media posts, banners, posters and ads that carry one clear message." },
  { n: "Packaging", t: "Boxes, pouches and labels that sell a product on the shelf." },
  { n: "Print and editorial", t: "Brochures, catalogues, magazines, books and stationery." },
  { n: "Web and app (UI/UX)", t: "Screens, buttons and layouts that people can use without thinking." },
  { n: "Illustration and icons", t: "Drawn pictures and symbols that explain ideas." },
  { n: "Motion graphics", t: "Moving titles, animated logos and explainer videos." },
];
function Lesson5() {
  return (
    <div className="gfx-ls gfx-l5">
      <div className="gfx-ls-text">
        <h3>Where you meet graphic design every day</h3>
        <p>From the logo on your phone to the label on your bottle, a designer made it. These are the main kinds of graphic design, and We3vision works in all of them.</p>
      </div>
      <ul className="gfx-uses">
        {USES.map((u, i) => <li key={u.n} style={{ "--o": (i * 47) % 150 } as React.CSSProperties}><b>{u.n}</b><span>{u.t}</span></li>)}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------------------------------------------- the section */

export function Learn() {
  const [tab, setTab] = useState(0);
  return (
    <div className="gfx-learn">
      <div className="gfx-learn-tabs" role="tablist" aria-label="Graphic design lessons">
        {TABS.map((t, i) => <button key={t} type="button" role="tab" aria-selected={tab === i} className={tab === i ? "is-on" : ""} onClick={() => setTab(i)}><span>{i + 1}</span>{t}</button>)}
      </div>
      <div className="gfx-learn-body" key={tab}>
        {tab === 0 && <Lesson1 />}
        {tab === 1 && <Lesson2 />}
        {tab === 2 && <Lesson3 />}
        {tab === 3 && <Lesson4 />}
        {tab === 4 && <Lesson5 />}
      </div>
    </div>
  );
}
