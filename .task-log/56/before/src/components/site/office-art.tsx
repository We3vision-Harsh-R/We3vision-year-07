import type { Token } from "./office-code";
import { SECTION_NAMES } from "./office-site";

// The studio (1200 x 800) of the office scene (office-builder.tsx), seen over the shoulders of a team of three that works at ONE long table:
// a designer, a developer and a tester. We look at their backs and, in front of each of them, at the monitor with their real work:
//  - the designer builds the page in a design tool (artboard, layers, selection box, cursor),
//  - the developer types the real code (the same lines that appear on the big wall display),
//  - the tester runs the tests of the page (a list that turns green, the page on a desktop and on a phone, a console).
// The big display on the wall is the html layer of the scene. All colours are theme colours (--g-*, --c-*).

type Phase = "idle" | "coding" | "building" | "live";
export type CodeView = { lines: Token[][]; from: number; file: string; col: number };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** 0 → 1 while p goes from a to b */
const fade = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const CENTERS = [250, 600, 950];
const MW = 248;
const MH = 134;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const TK: Record<string, string> = {
  kw: "#ff7ab2",
  str: "#a6e3a1",
  com: "#6c7086",
  tag: "var(--g-a)",
  attr: "#89dceb",
  num: "#fab387",
  fn: "#89b4fa",
  sel: "#f9e2af",
  prop: "#94e2d5",
  pun: "#9399b2",
  txt: "#d9d3f0",
};

// ---------------------------------------------------------------------------------------------------------------------------------------
// the three monitors (every one is MW x MH, origin at its top left corner)
// ---------------------------------------------------------------------------------------------------------------------------------------

// the heights of the ten sections of the page as the designer draws them (on an artboard that is 120 wide)
const SEC_H = [9, 30, 9, 24, 24, 12, 22, 26, 20, 26];
const SEC_Y = SEC_H.reduce<number[]>((a, h, i) => [...a, (a[i] ?? 0) + h + 2], [0]);

function Section({ i }: { i: number }) {
  const h = SEC_H[i];
  const c = "var(--g-a)";
  switch (i) {
    case 0:
      return (
        <g>
          <rect width="120" height={h} fill="#fff" />
          <circle cx="8" cy={h / 2} r="2.8" fill={c} />
          <rect x="14" y={h / 2 - 1.2} width="16" height="2.4" rx="1.2" fill="#17122b" />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={52 + k * 14} y={h / 2 - 1} width="10" height="2" rx="1" fill="#9a93b8" />
          ))}
          <rect x="106" y={h / 2 - 2.6} width="10" height="5.2" rx="2.6" fill={c} />
        </g>
      );
    case 1:
      return (
        <g>
          <rect width="120" height={h} fill="#f6f2ff" />
          <rect x="8" y="6" width="34" height="4" rx="2" fill="#17122b" />
          <rect x="8" y="12" width="26" height="4" rx="2" fill={c} />
          <rect x="8" y="19" width="48" height="2" rx="1" fill="#9a93b8" />
          <rect x="8" y="23" width="38" height="2" rx="1" fill="#cfc9e6" />
          <rect x="8" y="27" width="16" height="5" rx="2.5" fill={c} transform="translate(0 -2)" />
          <circle cx="86" cy={h / 2} r="12" fill={c} opacity="0.85" />
          <rect x="98" y="6" width="14" height="10" rx="2" fill="#fff" stroke="#e4def8" />
        </g>
      );
    case 2:
      return (
        <g>
          <rect width="120" height={h} fill="#fff" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <circle key={k} cx={12 + k * 19} cy={h / 2} r="2.6" fill="#cfc9e6" />
          ))}
        </g>
      );
    case 3:
      return (
        <g>
          <rect width="120" height={h} fill="#fff" />
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <rect x={6 + k * 37} y="4" width="33" height={h - 8} rx="3" fill="#f4f1ff" stroke="#e4def8" />
              <rect x={9 + k * 37} y="7" width="8" height="8" rx="2.4" fill={c} opacity={0.5 + k * 0.2} />
              <rect x={9 + k * 37} y="18" width="22" height="2" rx="1" fill="#9a93b8" />
              <rect x={9 + k * 37} y="22" width="16" height="2" rx="1" fill="#cfc9e6" />
            </g>
          ))}
        </g>
      );
    case 4:
      return (
        <g>
          <rect width="120" height={h} fill="#fff" />
          <rect x="6" y="4" width="46" height={h - 8} rx="3" fill={c} opacity="0.4" />
          <rect x="60" y="6" width="40" height="3" rx="1.5" fill="#17122b" />
          <rect x="60" y="12" width="52" height="2" rx="1" fill="#9a93b8" />
          <rect x="60" y="16" width="44" height="2" rx="1" fill="#cfc9e6" />
        </g>
      );
    case 5:
      return (
        <g>
          <rect width="120" height={h} fill={c} opacity="0.9" />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={9 + k * 28} y="3.5" width="16" height="5" rx="2" fill="#fff" opacity="0.9" />
          ))}
        </g>
      );
    case 6:
      return (
        <g>
          <rect width="120" height={h} fill="#fff" />
          {[0, 1, 2, 3].map((k) => (
            <g key={k}>
              <circle cx={14 + k * 30} cy="8" r="4" fill={c} />
              <rect x={6 + k * 30} y="15" width="16" height="2" rx="1" fill="#9a93b8" />
            </g>
          ))}
        </g>
      );
    case 7:
      return (
        <g>
          <rect width="120" height={h} fill="#f6f2ff" />
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={k} x={6 + (k % 3) * 37} y={4 + Math.floor(k / 3) * 11} width="33" height="9" rx="2" fill={c} opacity={0.3 + (k % 3) * 0.2} />
          ))}
        </g>
      );
    case 8:
      return (
        <g>
          <rect width="120" height={h} fill="#fff" />
          {[0, 1].map((k) => (
            <g key={k}>
              <rect x={6 + k * 56} y="3" width="52" height={h - 6} rx="3" fill="#f4f1ff" stroke="#e4def8" />
              <rect x={10 + k * 56} y="7" width="20" height="2.4" rx="1.2" fill="#f5b942" />
              <rect x={10 + k * 56} y="12" width="40" height="2" rx="1" fill="#9a93b8" />
            </g>
          ))}
        </g>
      );
    default:
      return (
        <g>
          <rect width="120" height={h} fill="#17122b" />
          <rect x="10" y="5" width="100" height="10" rx="4" fill={c} />
          <rect x="30" y="8.4" width="44" height="3" rx="1.5" fill="#fff" opacity="0.9" />
          <rect x="10" y="19" width="26" height="2" rx="1" fill="#6f6890" />
        </g>
      );
  }
}

function DesignScreen({ p, brand, done }: { p: number; brand: string; done: boolean }) {
  const q = done ? 1 : p;
  const cur = Math.min(9, Math.floor(fade(q, 0, 0.92) * 10));
  const made = (i: number) => fade(q, i * 0.085, i * 0.085 + 0.07);
  const off = Math.max(0, SEC_Y[cur] - 44);
  const selY = SEC_Y[cur] - off + 17;
  const tools = ["M4 2l1 8 2-2 2 4 1.4-.7-2-4 3-.3z", "M2 3h8v6H2z", "M6 2v8M3 2h6", "M2 10l8-8 2 2-8 8H2z"];
  return (
    <g>
      <rect width={MW} height={MH} fill="#120d24" />
      <rect width={MW} height="12" fill="#1b1535" />
      {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
        <circle key={c} cx={8 + i * 7} cy="6" r="2" fill={c} />
      ))}
      <text x="34" y="8.4" fontSize="6.4" fontWeight="600" fill="#cfc9e6">
        {(brand.trim() || "Your Brand").slice(0, 16)} · Design
      </text>
      <text x={MW - 8} y="8.4" textAnchor="end" fontSize="5.6" fill="#8f87ad">
        100%
      </text>
      {/* the tools */}
      <rect y="12" width="18" height={MH - 12} fill="#15102a" />
      {tools.map((d, i) => {
        const on = !done && Math.floor(q * 14) % 4 === i;
        return (
          <g key={i} transform={`translate(3 ${18 + i * 17})`}>
            <rect width="12" height="13" rx="3" fill={on ? "var(--g-a)" : "#241c3d"} />
            <path transform="translate(0 1)" d={d} fill="none" stroke={on ? "#14092b" : "#9a93b8"} strokeWidth="1" strokeLinejoin="round" />
          </g>
        );
      })}
      {/* the canvas with the page */}
      <rect x="18" y="12" width="166" height={MH - 12} fill="#1d1736" />
      <clipPath id="ds-clip">
        <rect x="40" y="17" width="122" height={MH - 19} />
      </clipPath>
      <g clipPath="url(#ds-clip)">
        <g transform={`translate(41 ${17 - off})`} style={{ transition: "transform 0.9s cubic-bezier(0.3,0.8,0.3,1)" }}>
          <rect x="-1" y="-1" width="122" height={SEC_Y[10] + 8} fill="#fff" opacity="0.06" />
          {SEC_H.map((h, i) => (
            <g key={i} transform={`translate(0 ${SEC_Y[i]})`}>
              <rect width="120" height={h} fill="none" stroke="#6f6890" strokeDasharray="2 2" strokeWidth="0.6" opacity={fade(q, i * 0.085 - 0.06, i * 0.085) * (1 - made(i))} />
              <g style={{ opacity: made(i) }}>
                <Section i={i} />
              </g>
            </g>
          ))}
        </g>
        {/* the selection box of the section that is being drawn */}
        {!done && q > 0.01 && (
          <g style={{ transform: `translate(41px, ${selY - 0}px)`, transition: "transform 0.5s ease-out" }}>
            <rect x="-1" y="-1" width="122" height={SEC_H[cur] + 2} fill="var(--g-a)" fillOpacity="0.08" stroke="var(--g-a)" strokeWidth="1" />
            {[
              [-1, -1],
              [119, -1],
              [-1, SEC_H[cur] - 1],
              [119, SEC_H[cur] - 1],
            ].map(([x, y]) => (
              <rect key={`${x}${y}`} x={x - 1.4} y={y - 1.4} width="4.8" height="4.8" fill="#fff" stroke="var(--g-a)" strokeWidth="0.8" />
            ))}
          </g>
        )}
      </g>
      {!done && q > 0.01 && (
        <g style={{ transform: `translate(${158}px, ${Math.min(MH - 12, selY + SEC_H[cur] + 3)}px)`, transition: "transform 0.5s ease-out" }}>
          <g className="pb-cursor">
            <path d="M0 0L0 10L2.8 7.6L5 12.2L6.9 11.4L4.7 6.9L8.4 6.5Z" fill="#fff" stroke="#17122b" strokeWidth="0.7" />
          </g>
        </g>
      )}
      {/* the layers and the style of the thing that is selected */}
      <rect x="184" y="12" width={MW - 184} height={MH - 12} fill="#15102a" />
      <text x="190" y="22" fontSize="5.6" fontWeight="700" fill="#8f87ad" letterSpacing="0.5">
        LAYERS
      </text>
      {SECTION_NAMES.slice(0, 8).map((n, i) => {
        const on = !done && i === cur;
        return (
          <g key={n} style={{ opacity: fade(q, i * 0.085 - 0.04, i * 0.085 + 0.02) }} transform={`translate(0 ${26 + i * 9.4})`}>
            {on && <rect x="186" y="-5.4" width={MW - 188} height="8.4" rx="2" fill="var(--g-a)" opacity="0.3" />}
            <rect x="190" y="-3" width="4.4" height="4.4" rx="1" fill={on ? "var(--g-a)" : "#6f6890"} />
            <text x="198" y="0.8" fontSize="5.6" fill={on ? "#fff" : "#b6afd2"}>
              {n}
            </text>
          </g>
        );
      })}
      <text x="190" y="108" fontSize="5.4" fontWeight="700" fill="#8f87ad" letterSpacing="0.5">
        STYLE
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={190 + i * 12} y="112" width="9" height="9" rx="3" fill={`hsl(calc(var(--th) + ${[354, 40, 190, 76][i]}) calc(80% * var(--ts)) ${[64, 62, 58, 62][i]}%)`} stroke="#fff" strokeOpacity={i === 0 ? 0.9 : 0.15} strokeWidth="0.8" />
      ))}
      <text x="190" y="128" fontSize="5.4" fill="#b6afd2">
        Poppins · 16 / 24
      </text>
    </g>
  );
}

function CodeScreen({ phase, code, brand }: { phase: Phase; code?: CodeView; brand: string }) {
  const MAXC = 56;
  const lines = code?.lines ?? [];
  const shown = lines.slice(-12);
  const first = lines.length - shown.length;
  const last = shown[shown.length - 1] ?? [];
  const lastChars = Math.min(MAXC, last.reduce((a, k) => a + k.s.length, 0));
  const building = phase === "building";
  const live = phase === "live";
  return (
    <g>
      <rect width={MW} height={MH} fill="#0f0b20" />
      <rect width={MW} height="12" fill="#1b1535" />
      {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
        <circle key={c} cx={8 + i * 7} cy="6" r="2" fill={c} />
      ))}
      <rect x="34" y="2" width="52" height="10" rx="2" fill="#0f0b20" />
      <rect x="34" y="11" width="52" height="1.4" fill="var(--g-a)" />
      <text x="40" y="8.6" fontSize="6.2" fontFamily={MONO} fill="#e7e1ff">
        {code?.file ?? "index.html"}
      </text>
      <text x={MW - 8} y="8.6" textAnchor="end" fontSize="5.6" fill="#8f87ad">
        {(brand.trim() || "your-brand").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 14)}
      </text>
      <rect x="0" y="12" width="20" height={MH - 24} fill="#0b0818" />
      {shown.length === 0 && (
        <text x="26" y="26" fontSize="6.6" fontFamily={MONO} fill="#6c7086">
          {"// waiting for a brand name…"}
        </text>
      )}
      {shown.map((ln, i) => {
        const y = 23 + i * 8.5;
        let used = 0;
        return (
          <g key={first + i}>
            <text x="16" y={y} textAnchor="end" fontSize="5.8" fontFamily={MONO} fill="#51496f">
              {first + i + 1}
            </text>
            <text x="25" y={y} fontSize="6.6" fontFamily={MONO} style={{ whiteSpace: "pre" }}>
              {ln.map((k, j) => {
                if (used >= MAXC) return null;
                const s = k.s.slice(0, MAXC - used);
                used += s.length;
                return (
                  <tspan key={j} fill={TK[k.t] ?? TK.txt}>
                    {s}
                  </tspan>
                );
              })}
            </text>
          </g>
        );
      })}
      {phase === "coding" && shown.length > 0 && <rect className="ob-caret-svg" x={25 + lastChars * 3.96} y={23 + (shown.length - 1) * 8.5 - 6} width="1.8" height="7.4" fill="var(--g-a)" />}
      <rect y={MH - 12} width={MW} height="12" fill="#08051a" />
      <text x="6" y={MH - 4} fontSize="5.8" fontFamily={MONO} fill={building || live ? "#7ee787" : "#8f87ad"}>
        {live ? `✔ ${(brand.trim() || "site").slice(0, 16)} is live` : building ? "▲ deploying…" : phase === "coding" ? `Ln ${code?.lines.length ?? 0}, Col ${(code?.col ?? 0) + 1}   UTF-8   Prettier ✔` : "$ npm run dev"}
      </text>
    </g>
  );
}

const TESTS: [string, string][] = [
  ["Layout renders", "0.4s"],
  ["Colours & contrast", "0.6s"],
  ["Every link works", "1.1s"],
  ["Speed score 98", "1.8s"],
  ["Phone view 390px", "0.9s"],
  ["Forms submit", "0.5s"],
];

function TestScreen({ p, done }: { p: number; done: boolean }) {
  const q = done ? 1 : p;
  const start = (i: number) => 0.34 + i * 0.1;
  const state = (i: number) => (q >= start(i) + 0.09 ? "pass" : q >= start(i) ? "run" : "wait");
  const passed = TESTS.filter((_, i) => state(i) === "pass").length;
  const log = TESTS.map((t, i) => [t, i] as const).filter(([, i]) => state(i) === "pass").slice(-3);
  const scan = !done && q > 0.3;
  return (
    <g>
      <rect width={MW} height={MH} fill="#0e1424" />
      <rect width={MW} height="12" fill="#17203a" />
      {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
        <circle key={c} cx={8 + i * 7} cy="6" r="2" fill={c} />
      ))}
      <text x="34" y="8.4" fontSize="6.4" fontWeight="700" fill="#cfd9ff">
        ▶ Test runner
      </text>
      <text x={MW - 8} y="8.4" textAnchor="end" fontSize="6.4" fontWeight="700" fill={passed === TESTS.length ? "#28c840" : "#cfd9ff"}>
        {passed}/{TESTS.length} passed
      </text>
      {TESTS.map(([name, time], i) => {
        const st = state(i);
        const failing = i === 3 && q >= start(i) && q < start(i) + 0.045;
        return (
          <g key={name} transform={`translate(6 ${17 + i * 12.6})`}>
            <rect width="140" height="10.6" rx="3" fill={st === "run" ? "#243256" : "#1a2440"} />
            {st === "pass" && !failing && (
              <>
                <circle cx="7" cy="5.3" r="3.4" fill="#28c840" />
                <path d="M5.2 5.4l1.4 1.5 2.6-3" fill="none" stroke="#06220d" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
            {failing && <circle cx="7" cy="5.3" r="3.4" fill="#ff5f57" />}
            {st === "run" && !failing && <circle className="ob-spin-svg" cx="7" cy="5.3" r="3.1" fill="none" stroke="var(--g-a)" strokeWidth="1.3" strokeDasharray="5 4" />}
            {st === "wait" && <circle cx="7" cy="5.3" r="3.1" fill="none" stroke="#51496f" strokeWidth="1" />}
            <text x="15" y="7.6" fontSize="6.2" fill={st === "wait" ? "#7d86a8" : "#e4eaff"}>
              {name}
            </text>
            <text x="134" y="7.6" textAnchor="end" fontSize="5.6" fontFamily={MONO} fill="#7d86a8">
              {st === "pass" ? time : ""}
            </text>
          </g>
        );
      })}
      {/* the page on a desktop and on a phone, scanned by the test */}
      <g transform="translate(154 17)">
        <rect width="88" height="54" rx="3" fill="#fff" opacity="0.95" />
        <rect x="3" y="3" width="82" height="5" rx="2" fill="#eceaf6" />
        <rect x="3" y="11" width="82" height="16" rx="2" fill="var(--g-a)" opacity="0.32" />
        {[0, 1, 2].map((k) => (
          <rect key={k} x={3 + k * 28} y="30" width="26" height="20" rx="2" fill="#f4f1ff" />
        ))}
        {scan && <rect className="ob-scan" x="0" y="0" width="88" height="3" fill="#28c840" opacity="0.7" />}
        <g transform="translate(60 40)">
          <rect width="24" height="40" rx="5" fill="#0a0716" stroke="#fff" strokeOpacity="0.5" />
          <rect x="2" y="4" width="20" height="32" rx="2.4" fill="#fff" opacity="0.92" />
          <rect x="4" y="6" width="16" height="9" rx="1.6" fill="var(--g-a)" opacity="0.4" />
          <rect x="4" y="17" width="16" height="6" rx="1.4" fill="#f4f1ff" />
          <rect x="4" y="25" width="16" height="6" rx="1.4" fill="#f4f1ff" />
        </g>
      </g>
      <g style={{ opacity: fade(q, 0.92, 1) }} transform="translate(154 90)">
        <rect width="38" height="12" rx="6" fill="#28c840" />
        <text x="19" y="8.6" textAnchor="middle" fontSize="6.4" fontWeight="800" fill="#06220d">
          ALL PASS
        </text>
      </g>
      {/* the console */}
      <rect y="94" width="146" height={MH - 94} fill="#0a0e1a" />
      {log.map(([[name, time]], j) => (
        <text key={name} x="6" y={103 + j * 8.4} fontSize="5.8" fontFamily={MONO} fill="#7ee787">
          ✔ {name} ({time})
        </text>
      ))}
      {log.length === 0 && (
        <text x="6" y="103" fontSize="5.8" fontFamily={MONO} fill="#7d86a8">
          $ npm test -- --watch
        </text>
      )}
      <rect x="6" y={MH - 8} width="134" height="2.6" rx="1.3" fill="#1a2440" />
      <rect x="6" y={MH - 8} width={134 * fade(q, 0.3, 1)} height="2.6" rx="1.3" fill="#28c840" />
    </g>
  );
}

function Monitor({ cx, kind, p, brand, phase, code }: { cx: number; kind: 0 | 1 | 2; p: number; brand: string; phase: Phase; code?: CodeView }) {
  const done = phase === "building" || phase === "live";
  return (
    <g transform={`translate(${cx - MW / 2} 376)`}>
      <ellipse cx={MW / 2} cy="170" rx="74" ry="7" fill="#000" opacity="0.4" />
      <rect x={MW / 2 - 9} y={MH + 4} width="18" height="30" rx="3" fill="url(#ob-metal)" />
      <rect x={MW / 2 - 40} y={MH + 28} width="80" height="8" rx="4" fill="#241b32" />
      <rect x="-7" y="-7" width={MW + 14} height={MH + 14} rx="11" fill="#07040f" stroke="var(--g-a)" strokeOpacity="0.5" />
      <svg x="0" y="0" width={MW} height={MH} viewBox={`0 0 ${MW} ${MH}`} overflow="hidden">
        {kind === 0 && <DesignScreen p={p} brand={brand} done={done} />}
        {kind === 1 && <CodeScreen phase={phase} code={code} brand={brand} />}
        {kind === 2 && <TestScreen p={p} done={done} />}
        <path d={`M0 0H${MW}V34L0 84Z`} fill="#fff" opacity="0.035" />
      </svg>
      <circle cx={MW / 2} cy={MH + 3.4} r="1.3" fill="var(--g-a)" />
    </g>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// the board with the tasks (they walk from "to do" to "done" while the team works)
// ---------------------------------------------------------------------------------------------------------------------------------------

const TASKS: [string, number, number, string][] = [
  ["Layout", 0.02, 0.36, "var(--g-a)"],
  ["Styles", 0.12, 0.64, "#f5b942"],
  ["Code", 0.18, 0.92, "#89b4fa"],
  ["Tests", 0.4, 0.97, "#28c840"],
  ["Deploy", 1.01, 2, "#ff7ab2"],
];

function Board({ phase, p }: { phase: Phase; p: number }) {
  // 0 = to do, 1 = doing, 2 = done
  const cols = TASKS.map(([, a, b], i) => {
    if (phase === "idle") return 0;
    if (phase === "live") return 2;
    if (phase === "building") return i === 4 ? 1 : 2;
    return p >= b ? 2 : p >= a ? 1 : 0;
  });
  const slot: number[] = [];
  const count = [0, 0, 0];
  cols.forEach((c, i) => {
    slot[i] = count[c]++;
  });
  return (
    <g transform="translate(22 156)">
      <rect width="196" height="168" rx="12" fill="#0d0820" fillOpacity="0.62" stroke="#fff" strokeOpacity="0.14" />
      <text x="10" y="15" fontSize="8" fontWeight="700" fill="#fff" opacity="0.9">
        Sprint board
      </text>
      {["TO DO", "DOING", "DONE"].map((t, i) => (
        <g key={t}>
          <rect x={7 + i * 62} y="23" width="58" height="139" rx="6" fill="#fff" opacity="0.04" />
          <text x={12 + i * 62} y="34" fontSize="6.6" fontWeight="700" fill={["#b6afd2", "#f5b942", "#28c840"][i]} letterSpacing="0.6">
            {t}
          </text>
        </g>
      ))}
      {TASKS.map(([name, , , color], i) => (
        <g key={name} className="pb-card" style={{ transform: `translate(${10 + cols[i] * 62}px, ${40 + slot[i] * 24}px)` }}>
          <rect width="52" height="20" rx="4" fill="#1d1736" stroke="#fff" strokeOpacity="0.14" />
          <rect width="3.4" height="20" rx="1.7" fill={color} />
          <text x="9" y="9" fontSize="6.4" fontWeight="600" fill="#fff">
            {name}
          </text>
          <rect x="9" y="13" width={cols[i] === 2 ? 36 : cols[i] === 1 ? 22 : 12} height="2.4" rx="1.2" fill={color} opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// the people, seen from behind (origin: the middle of the head; the shoulders are at y = 62)
// ---------------------------------------------------------------------------------------------------------------------------------------

const LABELS = ["DESIGN", "DEV", "QA"];

function Person({ kind, cx, hop, onClick }: { kind: 0 | 1 | 2; cx: number; hop: number; onClick: () => void }) {
  const shirt = ["var(--c-shirt)", "hsl(calc(var(--th) - 36) calc(34% * var(--ts)) 26%)", "hsl(calc(var(--th) + 96) calc(62% * var(--ts)) 54%)"][kind];
  const shirtD = ["var(--c-shirt-d)", "hsl(calc(var(--th) - 36) calc(34% * var(--ts)) 15%)", "hsl(calc(var(--th) + 96) calc(62% * var(--ts)) 38%)"][kind];
  const hair = ["url(#pb-hair0)", "url(#pb-hair1)", "url(#pb-hair2)"][kind];
  const torso = "M-84 280L-86 150C-88 96 -56 70 -22 62L22 62C56 70 88 96 86 150L84 280Z";
  return (
    <g key={hop} className={`pb pb-${kind}${hop ? " pb-hop" : ""}`} transform={`translate(${cx} 640)`} onClick={onClick} style={{ cursor: "pointer" }}>
      {/* the chair: back, headrest and arm rests */}
      <rect x="-104" y="38" width="208" height="250" rx="46" fill="url(#pb-chair)" />
      <rect x="-40" y="22" width="80" height="34" rx="16" fill="url(#pb-chair)" />
      <path d="M-92 70Q-102 150 -96 262M92 70Q102 150 96 262" fill="none" stroke="var(--g-a)" strokeOpacity="0.3" strokeWidth="3" />
      <g className="pb-body">
        {/* the arms (elbows to the sides) */}
        <g className="pb-elbow pb-elbow-l">
          <ellipse cx="-88" cy="176" rx="27" ry="48" fill={shirt} transform="rotate(10 -88 176)" />
          <ellipse cx="-88" cy="176" rx="27" ry="48" fill="url(#pb-fold)" transform="rotate(10 -88 176)" />
          <path d="M-112 206Q-88 220 -66 208" fill="none" stroke={shirtD} strokeWidth="5" strokeLinecap="round" transform="rotate(10 -88 176)" />
        </g>
        <g className="pb-elbow pb-elbow-r">
          <ellipse cx="88" cy="176" rx="27" ry="48" fill={shirt} transform="rotate(-10 88 176)" />
          <ellipse cx="88" cy="176" rx="27" ry="48" fill="url(#pb-fold)" transform="rotate(-10 88 176)" />
          <path d="M66 208Q88 220 112 206" fill="none" stroke={shirtD} strokeWidth="5" strokeLinecap="round" transform="rotate(-10 88 176)" />
        </g>
        {/* the arms in the air when the site is live */}
        <g className="pb-cheer">
          <g className="pb-up pb-up-l" style={{ transformOrigin: "-70px 98px" }}>
            <rect x="-90" y="-20" width="34" height="120" rx="17" fill={shirt} />
            <rect x="-90" y="-20" width="34" height="120" rx="17" fill="url(#pb-fold)" />
            <circle cx="-73" cy="-26" r="17" fill="url(#pb-skin)" />
          </g>
          <g className="pb-up pb-up-r" style={{ transformOrigin: "70px 98px" }}>
            <rect x="56" y="-20" width="34" height="120" rx="17" fill={shirt} />
            <rect x="56" y="-20" width="34" height="120" rx="17" fill="url(#pb-fold)" />
            <circle cx="73" cy="-26" r="17" fill="url(#pb-skin)" />
          </g>
        </g>
        {/* the neck and the torso */}
        <rect x="-18" y="30" width="36" height="46" rx="15" fill="url(#pb-skin)" />
        <path d="M-20 52Q0 66 20 52L20 66Q0 78 -20 66Z" fill="#000" opacity="0.16" />
        <path d={torso} fill={shirt} />
        <path d="M-84 280L-86 150C-88 96 -56 70 -22 62L-8 62C-40 100 -48 180 -44 280Z" fill="#000" opacity="0.2" />
        <path d="M22 62C56 70 88 96 86 150L84 280L52 280C56 180 48 100 12 62Z" fill="#fff" opacity="0.08" />
        <path d={torso} fill="url(#pb-rim)" />
        <path d="M0 64V280" stroke={shirtD} strokeWidth="3" opacity="0.6" />
        <path d="M-60 112Q-40 124 -34 150M60 112Q40 124 34 150M-70 190Q-50 200 -46 232M70 190Q50 200 46 232" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="3" strokeLinecap="round" />
        {kind === 0 && <path d="M-26 62Q0 84 26 62" fill="none" stroke={shirtD} strokeWidth="9" strokeLinecap="round" />}
        {kind === 1 && (
          <g>
            <ellipse cx="0" cy="76" rx="64" ry="27" fill={shirtD} />
            <path d="M-64 76Q0 116 64 76" fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M-14 94V150M14 94V150" stroke="#cfc9dc" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </g>
        )}
        {kind === 2 && (
          <g>
            <path d="M-26 62L0 92L26 62" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="6" strokeLinejoin="round" />
            <path d="M-10 70V150M10 70V150" stroke="var(--c-lan)" strokeWidth="3.4" strokeLinecap="round" />
          </g>
        )}
        {/* the company print on the back */}
        <g opacity="0.95">
          <circle cx="0" cy="168" r="15" fill="#fff" fillOpacity="0.16" stroke="#fff" strokeOpacity="0.45" />
          <text x="0" y="175" textAnchor="middle" fontSize="19" fontWeight="800" fill="#fff" fillOpacity="0.9">
            W
          </text>
          <text x="0" y="208" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="4" fill="#fff" fillOpacity="0.78">
            {LABELS[kind]}
          </text>
          <text x="0" y="224" textAnchor="middle" fontSize="8" fontWeight="600" letterSpacing="2" fill="#fff" fillOpacity="0.5">
            WE3VISION
          </text>
        </g>
        {/* the head, seen from behind */}
        <g className="pb-head">
          <ellipse cx="-52" cy="12" rx="9" ry="14" fill="url(#pb-skin)" />
          <ellipse cx="52" cy="12" rx="9" ry="14" fill="url(#pb-skin)" />
          <ellipse cx="-52" cy="14" rx="4" ry="8" fill="#b9715b" opacity="0.4" />
          <ellipse cx="52" cy="14" rx="4" ry="8" fill="#b9715b" opacity="0.4" />
          <path d="M-34 34Q0 70 34 34L24 54Q0 72 -24 54Z" fill="url(#pb-skin)" />
          <ellipse cx="0" cy="0" rx="53" ry="57" fill={hair} />
          <path d="M-30 -34Q0 -56 30 -34M-40 -10Q0 -34 40 -10M-34 18Q0 -6 34 18M-14 -50Q-4 -20 -16 24M14 -50Q4 -20 16 24" fill="none" stroke="#fff" strokeOpacity="0.1" strokeWidth="3" strokeLinecap="round" />
          <path d="M-8 -58Q-30 -30 -26 10M10 -58Q34 -30 28 12" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="0" cy="0" rx="53" ry="57" fill="url(#pb-rimh)" />
          <path d="M-46 -30Q-30 -58 0 -58Q30 -58 46 -30" fill="none" stroke="var(--g-a)" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" />
          {kind === 0 && (
            <g>
              <circle cx="0" cy="-64" r="23" fill={hair} />
              <path d="M-14 -76Q0 -66 14 -76M-18 -62Q0 -50 18 -62" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="2.4" strokeLinecap="round" />
              <circle cx="0" cy="-64" r="23" fill="none" stroke="var(--g-a)" strokeOpacity="0.5" strokeWidth="2.4" />
              <rect x="-27" y="-48" width="54" height="9" rx="4.5" fill="var(--g-a)" />
              <path d="M-54 8Q-58 -62 0 -64Q58 -62 54 8" fill="none" stroke="#241a30" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="-55" cy="12" rx="13" ry="23" fill="url(#pb-cup)" />
              <ellipse cx="55" cy="12" rx="13" ry="23" fill="url(#pb-cup)" />
              <ellipse cx="-55" cy="12" rx="6" ry="13" fill="#000" opacity="0.18" />
              <ellipse cx="55" cy="12" rx="6" ry="13" fill="#000" opacity="0.18" />
              <rect x="38" y="-4" width="5" height="34" rx="2.5" fill="var(--g-w)" transform="rotate(-18 40 10)" />
            </g>
          )}
          {kind === 1 && (
            <g>
              <path d="M-48 -34L-38 -66L-24 -42L-12 -72L0 -44L12 -72L24 -42L38 -66L48 -34Z" fill={hair} />
              <path d="M-54 8Q-58 -60 0 -62Q58 -60 54 8" fill="none" stroke="#241a30" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="-55" cy="12" rx="13" ry="22" fill="#241a30" stroke="var(--g-a)" strokeOpacity="0.6" />
              <ellipse cx="55" cy="12" rx="13" ry="22" fill="#241a30" stroke="var(--g-a)" strokeOpacity="0.6" />
              <ellipse cx="-55" cy="12" rx="6" ry="12" fill="var(--g-a)" opacity="0.18" />
              <ellipse cx="55" cy="12" rx="6" ry="12" fill="var(--g-a)" opacity="0.18" />
              <path d="M58 30Q76 52 98 52" fill="none" stroke="#241a30" strokeWidth="4" strokeLinecap="round" />
              <circle cx="100" cy="52" r="5" fill="var(--g-a)" />
            </g>
          )}
          {kind === 2 && (
            <g>
              <path d="M-56 -2Q-58 -64 0 -68Q58 -64 56 -2Q0 14 -56 -2Z" fill="url(#pb-cap)" />
              <path d="M-56 -2Q0 14 56 -2" fill="none" stroke="#000" strokeOpacity="0.3" strokeWidth="3" />
              <path d="M-20 -62Q0 -70 20 -62" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
              <path d="M0 -66V0M-30 -60Q-34 -30 -38 -4M30 -60Q34 -30 38 -4" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="2" />
              <rect x="-22" y="2" width="44" height="14" rx="7" fill="#17101f" />
              <rect x="-6" y="5" width="12" height="8" rx="2" fill="#cfc9dc" />
              <circle cx="0" cy="-66" r="4" fill="#fff" opacity="0.7" />
            </g>
          )}
        </g>
      </g>
    </g>
  );
}

const ROLE = ["Designer", "Developer", "Tester"];

export function OfficeArt({
  phase,
  progress,
  brand,
  hop,
  acts,
  code,
  onPerson,
}: {
  phase: Phase;
  progress: number;
  brand: string;
  hop: number[];
  acts: string[];
  code?: CodeView;
  onPerson: (i: number) => void;
}) {
  const on = phase !== "idle";
  const beamX = [360, 600, 840];
  return (
    <svg className="ob-svg ch" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="ob-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="hsl(calc(var(--th) + 347) calc(40% * var(--ts)) 13%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 347) calc(44% * var(--ts)) 7%)" />
        </linearGradient>
        <linearGradient id="ob-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="hsl(calc(var(--th) + 330) calc(26% * var(--ts)) 34%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 330) calc(26% * var(--ts)) 19%)" />
        </linearGradient>
        <linearGradient id="ob-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2f4d" />
          <stop offset="1" stopColor="#1b1426" />
        </linearGradient>
        <radialGradient id="ob-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--g-a)" stopOpacity="0.34" />
          <stop offset="1" stopColor="var(--g-a)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ob-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="pb-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6c4a4" />
          <stop offset="1" stopColor="#d99b7e" />
        </linearGradient>
        <linearGradient id="pb-chair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a2f4d" />
          <stop offset="1" stopColor="#17101f" />
        </linearGradient>
        <linearGradient id="pb-hair0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6a4561" />
          <stop offset="1" stopColor="#241322" />
        </linearGradient>
        <linearGradient id="pb-hair1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#363459" />
          <stop offset="1" stopColor="#100d22" />
        </linearGradient>
        <linearGradient id="pb-hair2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7b5238" />
          <stop offset="1" stopColor="#2a180e" />
        </linearGradient>
        <linearGradient id="pb-cup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--g-a)" />
          <stop offset="1" stopColor="var(--g-b)" />
        </linearGradient>
        <linearGradient id="pb-cap" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(calc(var(--th) + 256) calc(52% * var(--ts)) 46%)" />
          <stop offset="1" stopColor="hsl(calc(var(--th) + 256) calc(52% * var(--ts)) 28%)" />
        </linearGradient>
        <linearGradient id="pb-fold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="pb-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--g-a)" stopOpacity="0.4" />
          <stop offset="0.38" stopColor="var(--g-a)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pb-rimh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--g-a)" stopOpacity="0.32" />
          <stop offset="0.5" stopColor="var(--g-a)" stopOpacity="0" />
        </linearGradient>
        <filter id="ob-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {/* the room */}
      <rect width="1200" height="800" fill="url(#ob-wall)" />
      <path d="M260 0L120 360H1080L940 0Z" fill="#fff" opacity="0.025" />
      <ellipse cx="600" cy="190" rx="600" ry="290" fill="url(#ob-light)" />
      <rect x="40" y="0" width="1120" height="4" rx="2" fill="var(--g-w)" opacity="0.5" />

      {/* the wall: a clock, a picture and a shelf with books and a plant */}
      <g transform="translate(1100 76)">
        <circle r="38" fill="#0d0820" stroke="var(--g-a)" strokeOpacity="0.5" strokeWidth="2.4" />
        {[...Array(12)].map((_, i) => (
          <rect key={i} x="-1" y="-33" width="2" height={i % 3 ? 3 : 6} fill="#fff" opacity="0.6" transform={`rotate(${i * 30})`} />
        ))}
        <path d="M0 0V-20" stroke="#fff" strokeWidth="3" strokeLinecap="round" transform="rotate(35)" />
        <path d="M0 0V-28" stroke="#fff" strokeWidth="2" strokeLinecap="round" transform="rotate(210)" />
        <g className="ob-secs">
          <path d="M0 6V-30" stroke="var(--g-a)" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <circle r="3" fill="var(--g-a)" />
      </g>
      <g transform="translate(1020 134)">
        <rect width="82" height="64" rx="6" fill="#0d0820" stroke="#fff" strokeOpacity="0.18" strokeWidth="2" />
        <rect x="6" y="6" width="70" height="52" rx="3" fill="url(#pb-cup)" opacity="0.35" />
        <circle cx="26" cy="26" r="9" fill="var(--g-w)" opacity="0.85" />
        <path d="M6 58L30 36L46 48L62 30L76 46V58Z" fill="var(--g-a)" opacity="0.7" />
      </g>
      <g transform="translate(1040 252)">
        <rect x="-10" width="150" height="6" rx="3" fill="url(#ob-top)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={i * 12} y={-30 + (i % 2) * 6} width="10" height={30 - (i % 2) * 6} rx="2" fill={["var(--g-a)", "#f5b942", "#89b4fa", "var(--g-b)", "#28c840"][i]} opacity="0.85" />
        ))}
        <g transform="translate(96 0)">
          <path d="M0 0L-6 -20H24L18 0Z" fill="#241b32" stroke="var(--g-b)" strokeOpacity="0.7" />
          <path d="M9 -20q-4 -28 18 -42M9 -20q12 -26 0 -50M9 -20q-18 -22 -34 -34" stroke="var(--g-g)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* the sprint board */}
      <Board phase={phase} p={progress} />

      {/* the big display on the wall (the screen is the html layer on top) */}
      <rect x="238" y="18" width="736" height="322" rx="22" fill="#000" opacity="0.5" filter="url(#ob-soft)" />
      <rect x="232" y="8" width="736" height="322" rx="20" fill="#08040f" stroke="var(--g-a)" strokeOpacity="0.45" strokeWidth="2" />
      <circle cx="600" cy="321" r="2.4" fill="var(--g-a)" />
      {/* the cast lines from the three monitors to the display */}
      <g className="ob-beam" data-on={on}>
        {CENTERS.map((c, i) => (
          <g key={c}>
            <path d={`M${c + 70} 366C${c + 70} 352 ${beamX[i]} 350 ${beamX[i]} 334`} fill="none" stroke="var(--g-a)" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="3 8" />
            <circle className="gs-pulse" cx={beamX[i]} cy="332" r="3.6" fill="var(--g-a)" />
          </g>
        ))}
      </g>

      {/* who is who, and what they do right now */}
      {CENTERS.map((c, i) => (
        <g key={c} className="pb-tag" data-on={on} transform={`translate(${c - 124} 336)`}>
          <rect width="182" height="31" rx="10" fill="#0d0820" fillOpacity="0.78" stroke="#fff" strokeOpacity="0.2" />
          <circle cx="13" cy="12" r="3.8" fill={["var(--g-a)", "#89b4fa", "#28c840"][i]} className="gs-pulse" />
          <text x="23" y="15.6" fontSize="12.4" fontWeight="700" fill="#fff">
            {ROLE[i]}
          </text>
          <text x="11" y="26.2" fontSize="9.6" fill="#d9d3f0">
            {acts[i]}
          </text>
        </g>
      ))}

      {/* the table (one long table for the three) */}
      <path d="M60 500H1140L1190 590H10Z" fill="url(#ob-top)" />
      <path d="M60 500H1140" stroke="var(--g-a)" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M10 590H1190V608H10Z" fill="#000" opacity="0.4" />
      <ellipse cx="600" cy="540" rx="540" ry="24" fill="var(--g-a)" opacity="0.1" />
      {CENTERS.map((c, i) => (
        <Monitor key={c} cx={c} kind={i as 0 | 1 | 2} p={progress} brand={brand} phase={phase} code={code} />
      ))}
      {/* keyboards and a few things on the table */}
      {CENTERS.map((c) => (
        <g key={c}>
          <rect x={c - 56} y="554" width="112" height="13" rx="4" fill="#241b32" stroke="var(--g-a)" strokeOpacity="0.4" />
          {[...Array(11)].map((_, i) => (
            <rect key={i} className="ob-key" x={c - 50 + i * 9.4} y="558" width="6.4" height="3.6" rx="1.2" fill="var(--g-a)" opacity="0.6" style={{ animationDelay: `${(i * 0.17 + c / 400) % 1.1}s` }} />
          ))}
        </g>
      ))}
      <g>
        <rect x="402" y="526" width="26" height="26" rx="6" fill="var(--g-w)" />
        <path d="M428 532q11 0 11 9t-11 9" fill="none" stroke="var(--g-w)" strokeWidth="4" />
        <path className="gs-steam" d="M410 520q3-7 0-12M420 520q3-7 0-12" stroke="var(--g-w)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      </g>
      <g>
        <rect x="748" y="528" width="54" height="22" rx="3" fill="var(--g-w)" opacity="0.9" transform="rotate(-6 775 539)" />
        <rect x="1090" y="516" width="34" height="30" rx="7" fill="var(--g-d)" stroke="var(--g-b)" strokeOpacity="0.7" />
        <path d="M1107 516q-3-34 20-56M1107 516q14-28 2-50M1107 516q-18-24 -42-36" stroke="var(--g-g)" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M70 548V506Q70 490 92 488" fill="none" stroke="#3a2f4d" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="96" cy="490" rx="18" ry="7" fill="var(--g-w)" opacity="0.85" />
        <ellipse cx="64" cy="550" rx="20" ry="5" fill="#241b32" />
      </g>

      {/* the team */}
      {CENTERS.map((c, i) => (
        <Person key={c} kind={i as 0 | 1 | 2} cx={c} hop={hop[i]} onClick={() => onPerson(i)} />
      ))}
      <rect y="660" width="1200" height="140" fill="url(#ob-fade)" pointerEvents="none" />
    </svg>
  );
}
