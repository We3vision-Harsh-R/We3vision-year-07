"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { TechData } from "../tech/data";
import { Btn, EndCta, Sec, useMkt, v } from "../marketing/kit";
import { SDV_FILES, SDV_STAGES, type FileDef } from "./software-data";
import { Builder, Cloud, GitFlow, Merge, Orbs, Palette, Ring, Sprint } from "./parts";

// SOFTWARE DEVELOPMENT page ("sdv-"): everything is centred, and every section is a piece of a developer's world that you can use. VS Code (open files, run
// the tests), Git (a history you walk through by scrolling and by clicking), a zero-gravity toolbox (the tools float; drag, throw or push them; turn gravity on and
// they fall), AWS (a cloud map: send traffic, add servers), a project wizard (npx create ...), a pull request whose checks turn green. Laptop and desktop only.

const KW = /\b(const|await|async|function|return|export|import|from|new|SELECT|FROM|WHERE|CREATE|TABLE|INTEGER|TEXT|PRIMARY|KEY|NOT|NULL|if)\b|("[^"]*"|`[^`]*`)|(\/\/.*|-- .*)/g;
function Hl({ line }: { line: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(KW.source, "g");
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(<Fragment key={last}>{line.slice(last, m.index)}</Fragment>);
    out.push(<b key={m.index} className={m[1] ? "k" : m[2] ? "s" : "c"}>{m[0]}</b>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(<Fragment key={last}>{line.slice(last)}</Fragment>);
  return <>{out}</>;
}

/* ------------------------------------------------------------------------------------------------------------------------------ VS Code */
function VsCode() {
  const [open, setOpen] = useState<string[]>(["orders.service.ts"]);
  const [cur, setCur] = useState("orders.service.ts");
  const [ran, setRan] = useState(0); // how many terminal lines are shown
  const timer = useRef<number | null>(null);
  const f: FileDef = SDV_FILES.find((x) => x.n === cur) ?? SDV_FILES[0];
  const lines = ["$ npm test", "  orders ........ passed", "  customers ..... passed", "  reports ....... passed", "✓ all tests passed", "$ git commit -m \"orders: add report\"", "✓ committed on main"];
  const run = () => {
    if (timer.current) window.clearInterval(timer.current);
    setRan(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setRan(i);
      if (i >= lines.length && timer.current) window.clearInterval(timer.current);
    }, 520);
  };
  useEffect(() => {
    const t = window.setTimeout(run, 1600);
    return () => { window.clearTimeout(t); if (timer.current) window.clearInterval(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const openFile = (n: string) => { setCur(n); setOpen((o) => (o.includes(n) ? o : [...o, n])); };
  const close = (n: string) => { const rest = open.filter((x) => x !== n); if (rest.length === 0) return; setOpen(rest); if (cur === n) setCur(rest[rest.length - 1]); };
  return (
    <div className="sdv-vs" role="group" aria-label="A code editor you can use (a sample)">
      <div className="sdv-vs-t"><i /><i /><i /><span>your-software — Visual Studio Code</span></div>
      <div className="sdv-vs-b">
        <ul className="sdv-act" aria-hidden="true"><li className="is-on" /><li /><li /><li /></ul>
        <div className="sdv-exp"><p>EXPLORER</p><ul role="tablist" aria-label="Files">{SDV_FILES.map((x) => <li key={x.n}><button type="button" role="tab" aria-selected={cur === x.n} className={cur === x.n ? "is-on" : ""} onClick={() => openFile(x.n)}><i aria-hidden="true">{x.ico}</i>{x.n}</button></li>)}</ul></div>
        <div className="sdv-ed">
          <div className="sdv-tabs">{open.map((n) => <span key={n} className={cur === n ? "is-on" : ""}><button type="button" onClick={() => setCur(n)}>{n}</button>{open.length > 1 && <u role="button" aria-label={`Close ${n}`} onClick={() => close(n)}>×</u>}</span>)}</div>
          <pre className="sdv-code" key={f.n}><code>{f.lines.map((ln, i) => <span key={i} className="l" style={v({ "--i": i })}><em>{i + 1}</em><Hl line={ln} /></span>)}</code></pre>
        </div>
      </div>
      <div className="sdv-tm">
        <div className="sdv-tm-h"><b>TERMINAL</b><button type="button" onClick={run}>▶ Run the tests</button></div>
        <div className="sdv-tm-b" aria-live="polite">{lines.slice(0, ran).map((l, i) => <p key={i} className={l.startsWith("✓") ? "ok" : ""}>{l}</p>)}{ran < lines.length && <p className="cur">▌</p>}</div>
      </div>
      <div className="sdv-st"><span>⎇ main</span><span className={ran >= lines.length ? "ok" : ""}>{ran >= lines.length ? "✓ checks passed" : "○ running"}</span><span>{f.lang}</span></div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------------------------------------ Git */
export function SoftwarePage({ d }: { d: TechData }) {
  const root = useRef<HTMLDivElement>(null);
  useMkt(root);
  const [stage, setStage] = useState(0);
  const [tool, setTool] = useState(1);
  const goStage = (i: number) => {
    const s = document.getElementById("sdv-flow");
    if (!s) return;
    const top = s.getBoundingClientRect().top + window.scrollY;
    const total = s.getBoundingClientRect().height - window.innerHeight;
    const y = top + (total * (i + 0.5)) / SDV_STAGES.length;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 0.9 }); else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="mkt sdv" ref={root}>
      {/* hero: VS Code */}
      <section className="mkt-hero sdv-hero">
        <p className="mkt-chip">Software Development</p>
        <h1 className="mkt-h1"><span>Software, built</span><span>the way it ships.</span></h1>
        <p className="mkt-body">{d.hero.text || "We build custom software around the way your team really works: simple to use, secure and ready to grow."}</p>
        <div className="mkt-cta"><Btn href="#contact">Get a free quote</Btn><Btn href="#sdv-flow" ghost>See how we work</Btn></div>
        <VsCode />
      </section>

      {/* the workflow, as a pipeline run */}
      <Sec n="02" title={"The Software Development\nWorkflow."} id="sdv-flow" pin={{ count: SDV_STAGES.length, onChange: setStage }}>
        <GitFlow k={stage} onPick={goStage} />
      </Sec>

      {/* the 15-day offer, as a sprint board */}
      <Sec n="03" title={"Custom Software.\nIn 15 Days."} intro="Play the 15 days, or slide through them. Watch the work move across the board." id="sdv-days">
        <div className="mkt-rv"><Sprint /></div>
      </Sec>

      {/* the tools, floating */}
      <Sec n="04" title={"The Software We Build With,\nin Zero Gravity."} intro="Gravity keeps the tools in orbit around your software. Switch it off, then drag, throw or push them. Click one to see what it is for." id="sdv-tools">
        <div className="mkt-rv"><Orbs onPick={setTool} sel={tool} /></div>
      </Sec>

      {/* where it runs */}
      <Sec n="05" title={"Where It Runs.\nOn AWS."} intro="A typical setup. Click a part to see what it does. Change the number of visitors and watch the servers." id="sdv-cloud">
        <div className="mkt-rv"><Cloud /></div>
      </Sec>

      {/* what we build */}
      <Sec n="06" title={"Build It,\nPiece by Piece."} intro="Pick a kind of software, then switch modules on. Your app takes shape." id="sdv-build">
        <div className="mkt-rv"><Builder /></div>
      </Sec>

      {/* industries */}
      <Sec n="07" title={"Which Software,\nFor Which Work."} intro="Choose your industry. See the work that the software does for it." id="sdv-ind">
        <div className="mkt-rv"><Ring /></div>
      </Sec>

      {/* how a change ships */}
      <Sec n="08" title={"How a Change\nShips."} intro="Add a bug and see the checks stop it. Fix it and ship." id="sdv-ship">
        <div className="mkt-rv"><Merge /></div>
      </Sec>

      {d.faq.length > 0 && <Sec n="09" title={"Questions,\nAnswered."} id="sdv-faq"><div className="mkt-rv"><Palette items={d.faq.map((f) => ({ q: f.question, a: f.answer }))} /></div></Sec>}

      <EndCta n="10" title={"Ready To Build\nYour Software?"} text="Tell us how your team works today and where it slows down. We will suggest what to build and how to start." button="Get a free quote" />
    </div>
  );
}
