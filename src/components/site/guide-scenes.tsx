"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Arm, SceneAvatar, SceneDefs, type SceneProps } from "./guide-kit";

// The scenes of the interactive guide (one per technology of the site). Every scene is a 480 x 300 drawing of the cartoon guide at
// work, plus one thing the visitor can play with. The frame (guide-scene.tsx) adds the speech bubble and makes the eyes and the head
// follow the pointer. All colours are theme colours (--g-* in globals.css).

const Glow = () => <circle cx="170" cy="128" r="140" fill="url(#gs-glow)" />;
const at = (x: number, y: number): CSSProperties => ({ transformOrigin: `${x}px ${y}px` });

// ------------------------------------------------------------------------------------------------------------ web development
export function SceneWeb({ say, bump, onAvatar }: SceneProps) {
  const [name, setName] = useState("");
  const [tick, setTick] = useState(0);
  const title = (name.trim() || "Your Brand").slice(0, 16);
  const url = (name.toLowerCase().replace(/[^a-z0-9]/g, "") || "yourbrand") + ".com";
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <g className="gs-float" fill="var(--g-a)" fontFamily="ui-monospace, monospace" fontWeight="700">
            <text x="48" y="78" fontSize="22" opacity="0.55">{"</>"}</text>
            <text x="70" y="140" fontSize="18" opacity="0.4" style={{ animationDelay: "-1.4s" }}>{"{ }"}</text>
            <text x="216" y="46" fontSize="16" opacity="0.4" style={{ animationDelay: "-2.6s" }}>{"#"}</text>
          </g>
          <SceneAvatar bump={bump} onAvatar={onAvatar} />
          {/* the arms go down to the keyboard behind the laptop; they tap when the name changes */}
          <g key={tick} className="gs-type">
            <Arm pts={[[141, 138], [116, 186], [152, 206]]} />
            <Arm pts={[[199, 138], [224, 186], [188, 206]]} />
          </g>
          <rect x="128" y="160" width="84" height="52" rx="7" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.4" />
          <circle className="gs-pulse" cx="170" cy="186" r="6" fill="var(--g-a)" />
          <rect x="116" y="211" width="108" height="6" rx="3" fill="var(--g-b)" opacity="0.7" />
          <rect x="30" y="216" width="290" height="90" rx="8" fill="url(#gs-desk)" />
          <rect x="30" y="216" width="290" height="3" fill="var(--g-a)" opacity="0.35" />
          {/* a mug with steam */}
          <rect x="62" y="196" width="16" height="20" rx="4" fill="var(--g-w)" opacity="0.9" />
          <path className="gs-steam" d="M66 192q3-6 0-10M74 192q3-6 0-10" stroke="var(--g-w)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* the browser: shows what is typed */}
          <g>
            <rect x="262" y="36" width="206" height="170" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            <circle cx="278" cy="50" r="3.4" fill="var(--g-a)" opacity="0.8" />
            <circle cx="290" cy="50" r="3.4" fill="var(--g-b)" opacity="0.8" />
            <circle cx="302" cy="50" r="3.4" fill="var(--g-w)" opacity="0.8" />
            <rect x="316" y="43" width="138" height="14" rx="7" fill="var(--g-e)" />
            <text x="385" y="53.4" textAnchor="middle" fontSize="9" fill="var(--g-w)">{url}</text>
            <text x="365" y="100" textAnchor="middle" fontSize={title.length > 11 ? 17 : 22} fontWeight="800" fill="#fff">{title}</text>
            <rect x="305" y="112" width="120" height="5" rx="2.5" fill="var(--g-a)" opacity="0.5" />
            <rect x="320" y="123" width="90" height="5" rx="2.5" fill="var(--g-a)" opacity="0.3" />
            <rect x="335" y="138" width="60" height="16" rx="8" fill="var(--g-a)" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={280 + i * 62} y="166" width="54" height="30" rx="7" fill="var(--g-b)" opacity={0.35 + i * 0.12} />
            ))}
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <label className="gs-field">
          <span>Type your business name</span>
          <input
            value={name}
            maxLength={16}
            placeholder="Your Brand"
            onChange={(e) => {
              setName(e.target.value);
              setTick((n) => n + 1);
              if (!name) say("Typing... and it is live on the screen already!");
            }}
          />
        </label>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ mobile apps
export function SceneMobile({ say, bump, onAvatar }: SceneProps) {
  const [screen, setScreen] = useState(0);
  const go = (n: number) => {
    setScreen(n);
    say(["Home: everything one tap away.", "Chat: talk to your customers.", "Pay: checkout in seconds."][n]);
  };
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} hide="lr" crop={140} />
          <Arm className="gs-wag" style={at(141, 138)} pts={[[141, 138], [110, 172], [100, 124]]} />
          {/* the phone */}
          <g onClick={() => go((screen + 1) % 3)} style={{ cursor: "pointer" }}>
            <rect x="262" y="58" width="104" height="184" rx="20" fill="var(--g-e)" stroke="var(--g-a)" strokeOpacity="0.6" strokeWidth="2" />
            <rect x="270" y="68" width="88" height="164" rx="13" fill="var(--g-d)" />
            <rect x="298" y="62" width="32" height="5" rx="2.5" fill="var(--g-d)" />
            {screen === 0 && (
              <g>
                <text x="314" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">Home</text>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} className="gs-pop" x={278 + (i % 3) * 27} y={102 + Math.floor(i / 3) * 34} width="22" height="26" rx="7" fill={i % 2 ? "var(--g-a)" : "var(--g-b)"} style={{ animationDelay: `${i * 0.06}s` }} />
                ))}
                <rect x="278" y="176" width="72" height="40" rx="9" fill="var(--g-b)" opacity="0.4" />
              </g>
            )}
            {screen === 1 && (
              <g>
                <text x="314" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">Chat</text>
                <rect className="gs-pop" x="278" y="102" width="52" height="20" rx="9" fill="var(--g-b)" opacity="0.7" />
                <rect className="gs-pop" x="296" y="130" width="54" height="20" rx="9" fill="var(--g-a)" style={{ animationDelay: "0.12s" }} />
                <rect className="gs-pop" x="278" y="158" width="44" height="20" rx="9" fill="var(--g-b)" opacity="0.7" style={{ animationDelay: "0.24s" }} />
                <rect x="278" y="206" width="72" height="16" rx="8" fill="var(--g-e)" />
              </g>
            )}
            {screen === 2 && (
              <g>
                <text x="314" y="90" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">Pay</text>
                <rect className="gs-pop" x="278" y="102" width="72" height="44" rx="9" fill="var(--g-a)" />
                <rect x="284" y="130" width="30" height="4" rx="2" fill="var(--g-e)" opacity="0.6" />
                <rect x="278" y="160" width="72" height="8" rx="4" fill="var(--g-b)" opacity="0.4" />
                <rect x="278" y="196" width="72" height="22" rx="11" fill="var(--g-a)" />
                <text x="314" y="211" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--g-e)">Pay now</text>
              </g>
            )}
          </g>
          {/* the hand that holds the phone */}
          <Arm pts={[[199, 138], [232, 190], [262, 196]]} />
          {/* apps that float around */}
          {[
            [404, 78, "M0 6q-8-7-4-12q4-3 4 2q0-5 4-2q4 5-4 12z"],
            [432, 150, "M-6-2h12l-2 8h-8zM-3-5q3-4 6 0"],
            [396, 214, "M0-7q5 0 5 6l2 5h-14l2-5q0-6 5-6zM-2 8q2 3 4 0"],
          ].map(([x, y, d], i) => (
            <g key={i} className="gs-float" style={{ animationDelay: `${-i * 1.3}s` }}>
              <circle cx={x as number} cy={y as number} r="21" fill="var(--g-d)" stroke="var(--g-a)" strokeOpacity="0.5" />
              <path transform={`translate(${x} ${y})`} d={d as string} fill="var(--g-a)" />
            </g>
          ))}
        </svg>
      </div>
      <div className="gs-controls">
        <div className="gs-chips" role="group" aria-label="App screens">
          {["Home", "Chat", "Pay"].map((t, i) => (
            <button key={t} type="button" className="gs-chip" data-on={screen === i} onClick={() => go(i)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ metaverse
export function SceneMetaverse({ say, bump, onAvatar }: SceneProps) {
  const [world, setWorld] = useState(0);
  const [flash, setFlash] = useState(0);
  const worlds = ["Showroom", "Arena", "Campus"];
  const go = (n: number) => {
    setWorld(n);
    setFlash((f) => f + 1);
    say(`Teleported to the ${worlds[n]}!`);
  };
  return (
    <>
      <div className="gs-stage" data-tilt="">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden style={{ "--wh": world * 64 } as CSSProperties}>
          <SceneDefs />
          <circle cx="170" cy="128" r="150" fill="url(#gs-glow)" />
          {/* the floor of the virtual world */}
          <g className="gs-grid" stroke="var(--wa)" strokeOpacity="0.35" fill="none">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={"h" + i} d={`M${-20 + i * 6} ${246 + i * 10}H${500 - i * 6}`} />
            ))}
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
              <path key={"v" + i} d={`M${170 + i * 22} 240L${170 + i * 70} 310`} />
            ))}
          </g>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} className="gs-ring" cx="170" cy="232" rx={70 + i * 24} ry={14 + i * 5} fill="none" stroke="var(--wa)" strokeWidth="2" style={{ animationDelay: `${-i * 0.9}s` }} />
          ))}
          <g className="gs-orbit" style={at(170, 130)}>
            <g transform="translate(330 130)"><path d="M0-14L14-6V8L0 16L-14 8V-6Z" fill="var(--g-d)" stroke="var(--wa)" strokeWidth="2" /><path d="M0-14L0 2L14-6M0 2L-14-6" stroke="var(--wa)" strokeWidth="1.4" fill="none" /></g>
            <circle cx="170" cy="-20" r="10" fill="var(--wa)" opacity="0.8" />
            <g transform="translate(10 150)"><rect x="-12" y="-12" width="24" height="24" rx="5" fill="var(--g-d)" stroke="var(--wa)" strokeWidth="2" transform="rotate(20)" /></g>
          </g>
          <SceneAvatar bump={bump} onAvatar={onAvatar} headset hide="lr" />
          {/* the hands with the controllers */}
          <g className="gs-wag" style={at(141, 138)}>
            <Arm pts={[[141, 138], [106, 150], [92, 108]]} />
            <g transform="translate(92 108) rotate(-14)"><rect x="-4.5" y="-24" width="9" height="30" rx="4.5" fill="var(--g-e)" stroke="var(--wa)" strokeWidth="1.6" /><circle cx="0" cy="-24" r="4" fill="var(--wa)" /></g>
          </g>
          <g className="gs-wag" style={{ ...at(199, 138), animationDelay: "-0.3s" }}>
            <Arm pts={[[199, 138], [234, 150], [248, 108]]} />
            <g transform="translate(248 108) rotate(14)"><rect x="-4.5" y="-24" width="9" height="30" rx="4.5" fill="var(--g-e)" stroke="var(--wa)" strokeWidth="1.6" /><circle cx="0" cy="-24" r="4" fill="var(--wa)" /></g>
          </g>
          {/* a portal */}
          <g onClick={() => go((world + 1) % 3)} style={{ cursor: "pointer" }}>
            <ellipse className="gs-portal" cx="400" cy="150" rx="40" ry="66" fill="var(--wa)" fillOpacity="0.15" stroke="var(--wa)" strokeWidth="3" />
            <ellipse cx="400" cy="150" rx="26" ry="48" fill="var(--wa)" fillOpacity="0.2" />
            <text x="400" y="154" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{worlds[(world + 1) % 3]}</text>
          </g>
        </svg>
        <span key={flash} className="gs-flash" aria-hidden />
      </div>
      <div className="gs-controls">
        <div className="gs-chips" role="group" aria-label="Worlds">
          {worlds.map((t, i) => (
            <button key={t} type="button" className="gs-chip" data-on={world === i} onClick={() => go(i)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ UI/UX design
export function SceneUiux({ say, bump, onAvatar }: SceneProps) {
  const [ui, setUi] = useState(false);
  const flip = (v: boolean) => {
    setUi(v);
    say(v ? "Wireframe done: now the colours and type." : "First the wireframe: structure before beauty.");
  };
  const f = (c: string) => (ui ? c : "none");
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} hide="lr" crop={140} />
          {/* the tablet */}
          <g transform="rotate(-4 170 210)">
            <rect x="116" y="170" width="108" height="72" rx="9" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.55" strokeWidth="1.6" />
            <circle cx="170" cy="177" r="2" fill="var(--g-a)" opacity="0.7" />
            <circle className="gs-pulse" cx="170" cy="208" r="7" fill="var(--g-a)" opacity="0.8" />
          </g>
          <Arm pts={[[141, 138], [112, 178], [122, 206]]} />
          <Arm pts={[[199, 138], [230, 176], [220, 204]]} />
          {/* a pen that draws in the air */}
          <g className="gs-float"><rect x="238" y="126" width="6" height="34" rx="3" fill="var(--g-w)" transform="rotate(30 241 143)" /><path className="gs-draw" d="M232 96q14-18 28 0t28 0" stroke="var(--g-a)" strokeWidth="2.4" fill="none" strokeLinecap="round" /></g>
          {/* the screen being designed: wireframe or finished */}
          <g>
            <rect x="290" y="30" width="176" height="186" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            <g className="gs-wire" data-ui={ui}>
              <rect x="304" y="44" width="148" height="16" rx="6" fill={f("var(--g-b)")} stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.6} strokeDasharray="3 3" />
              <rect x="304" y="68" width="148" height="56" rx="8" fill={f("var(--g-a)")} fillOpacity="0.55" stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.6} strokeDasharray="3 3" />
              <path d="M304 68L452 124M452 68L304 124" stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.35} />
              <rect x="304" y="134" width="100" height="7" rx="3.5" fill={f("#fff")} fillOpacity="0.85" stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.6} strokeDasharray="3 3" />
              <rect x="304" y="148" width="72" height="7" rx="3.5" fill={f("var(--g-w)")} fillOpacity="0.7" stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.6} strokeDasharray="3 3" />
              <rect x="388" y="146" width="64" height="20" rx="10" fill={f("var(--g-a)")} stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.6} strokeDasharray="3 3" />
              {[0, 1, 2].map((i) => (
                <rect key={i} x={304 + i * 52} y="176" width="44" height="28" rx="7" fill={f("var(--g-b)")} fillOpacity={0.5 + i * 0.15} stroke="var(--g-a)" strokeOpacity={ui ? 0 : 0.6} strokeDasharray="3 3" />
              ))}
            </g>
          </g>
          {/* colour dots */}
          {[354, 40, 76, 190].map((o, i) => (
            <circle key={o} className="gs-float" cx={296 + i * 18} cy="232" r="6" fill={`hsl(calc(var(--th) + ${o}) calc(80% * var(--ts)) 68%)`} style={{ animationDelay: `${-i * 0.7}s` }} />
          ))}
        </svg>
      </div>
      <div className="gs-controls">
        <div className="gs-chips" role="group" aria-label="Design stage">
          <button type="button" className="gs-chip" data-on={!ui} onClick={() => flip(false)}>Wireframe</button>
          <button type="button" className="gs-chip" data-on={ui} onClick={() => flip(true)}>Final design</button>
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ CRM
type Deal = { id: number; name: string; col: number };
const DEALS: Deal[] = [
  { id: 0, name: "Acme Co.", col: 0 },
  { id: 1, name: "Bright Ltd", col: 0 },
  { id: 2, name: "Nova Shop", col: 1 },
  { id: 3, name: "Orbit Labs", col: 1 },
  { id: 4, name: "Kite Studio", col: 2 },
];
export function SceneCrm({ say, bump, onAvatar }: SceneProps) {
  const [deals, setDeals] = useState(DEALS);
  const [burst, setBurst] = useState(0);
  const won = deals.filter((d) => d.col === 2).length;
  const advance = (id: number) => {
    setDeals((ds) => ds.map((d) => (d.id === id ? { ...d, col: (d.col + 1) % 3 } : d)));
    const d = deals.find((x) => x.id === id);
    if (d && d.col === 1) {
      setBurst((b) => b + 1);
      say(`${d.name} is won! 🎉`);
    }
  };
  const rows = [0, 0, 0];
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} hide="r" />
          <Arm pts={[[199, 138], [230, 152], [262, 128]]} />
          <g>
            <rect x="262" y="26" width="208" height="226" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            {["Lead", "Proposal", "Won"].map((t, i) => (
              <g key={t}>
                <text x={298 + i * 68} y="46" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--g-w)">{t}</text>
                <rect x={272 + i * 68} y="54" width="60" height="190" rx="8" fill="var(--g-e)" opacity="0.6" />
              </g>
            ))}
            {deals.map((d) => {
              const idx = rows[d.col]++;
              return (
                <g key={d.id} className="gs-card" style={{ transform: `translate(${272 + d.col * 68 + 3}px, ${60 + idx * 44}px)`, cursor: "pointer" }} onClick={() => advance(d.id)}>
                  <rect width="54" height="38" rx="7" fill={d.col === 2 ? "var(--g-a)" : "var(--g-b)"} opacity={d.col === 2 ? 0.95 : 0.7} />
                  <text x="27" y="17" textAnchor="middle" fontSize="7.5" fontWeight="700" fill={d.col === 2 ? "var(--g-e)" : "#fff"}>{d.name}</text>
                  <rect x="9" y="25" width="36" height="4" rx="2" fill={d.col === 2 ? "var(--g-e)" : "#fff"} opacity="0.5" />
                </g>
              );
            })}
          </g>
          <g key={burst} className={burst ? "gs-burst" : ""}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <circle key={i} cx="400" cy="150" r="3.4" fill={i % 2 ? "var(--g-a)" : "var(--g-w)"} style={{ "--a": `${i * 45}deg` } as CSSProperties} />
            ))}
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <p className="gs-readout">
          Deals won: <b>{won}</b> <span>· tap a deal to move it on</span>
        </p>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ 2D/3D animation
export function SceneAnimation({ say, bump, onAvatar }: SceneProps) {
  const [t, setT] = useState(0);
  const [play, setPlay] = useState(true);
  useEffect(() => {
    if (!play) return;
    const id = window.setInterval(() => setT((v) => (v + 1.5) % 100), 40);
    return () => window.clearInterval(id);
  }, [play]);
  const hop = Math.abs(Math.sin((t / 100) * Math.PI * 3));
  const x = 290 + (t / 100) * 150;
  const y = 176 - hop * 84;
  const sq = 1 - hop;
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} hide="r" />
          <Arm pts={[[199, 138], [230, 150], [262, 118]]} />
          {/* the clapper board */}
          <g className="gs-clap" style={at(36, 238)}>
            <rect x="36" y="238" width="62" height="42" rx="5" fill="var(--g-d)" stroke="var(--g-a)" strokeOpacity="0.6" />
            <path d="M36 230l62-12v14l-62 12z" fill="var(--g-a)" opacity="0.85" />
          </g>
          <g>
            <rect x="270" y="30" width="196" height="206" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            <ellipse cx={x} cy="198" rx={12 + hop * -4 + 4} ry="3" fill="#000" opacity="0.35" />
            <ellipse cx={x} cy={y} rx={14 + sq * 4} ry={14 - sq * 4} fill="var(--g-a)" />
            <ellipse cx={x - 4} cy={y - 4} rx="4" ry="3" fill="#fff" opacity="0.5" />
            <path d="M284 200H452" stroke="var(--g-b)" strokeOpacity="0.5" />
            {/* the timeline */}
            <rect x="284" y="212" width="168" height="12" rx="6" fill="var(--g-e)" />
            {[0, 20, 40, 60, 80, 100].map((k) => (
              <path key={k} d={`M${290 + k * 1.56} 218l3 3-3 3-3-3z`} fill="var(--g-w)" opacity="0.8" />
            ))}
            <rect x={284 + (t / 100) * 156} y="208" width="4" height="20" rx="2" fill="var(--g-a)" />
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <div className="gs-scrub">
          <button
            type="button"
            className="gs-chip"
            onClick={() => {
              setPlay((p) => !p);
              say(play ? "Paused. Drag the slider to scrub the frames." : "Rolling!");
            }}
          >
            {play ? "Pause" : "Play"}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(t)}
            aria-label="Timeline"
            onChange={(e) => {
              setPlay(false);
              setT(Number(e.target.value));
            }}
          />
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ 3D modeling
export function SceneModeling({ say, bump, onAvatar }: SceneProps) {
  const [rot, setRot] = useState({ x: -22, y: 30 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [spin, setSpin] = useState(true);
  useEffect(() => {
    if (!spin) return;
    const id = window.setInterval(() => setRot((r) => ({ ...r, y: r.y + 0.9 })), 30);
    return () => window.clearInterval(id);
  }, [spin]);
  const faces = [
    "translateZ(54px)",
    "rotateY(180deg) translateZ(54px)",
    "rotateY(90deg) translateZ(54px)",
    "rotateY(-90deg) translateZ(54px)",
    "rotateX(90deg) translateZ(54px)",
    "rotateX(-90deg) translateZ(54px)",
  ];
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} hide="r" />
          <Arm pts={[[199, 138], [232, 152], [266, 138]]} />
          <g className="gs-float"><rect x="266" y="112" width="5" height="32" rx="2.5" fill="var(--g-w)" transform="rotate(-40 268 128)" /></g>
          <ellipse cx="380" cy="238" rx="64" ry="12" fill="var(--g-a)" opacity="0.25" />
        </svg>
        <div
          className="gs-cube-wrap"
          onPointerDown={(e) => {
            drag.current = { x: e.clientX, y: e.clientY };
            setSpin(false);
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.x;
            const dy = e.clientY - drag.current.y;
            drag.current = { x: e.clientX, y: e.clientY };
            setRot((r) => ({ x: r.x - dy * 0.6, y: r.y + dx * 0.6 }));
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
        >
          <div className="gs-cube" style={{ transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
            {faces.map((tr, i) => (
              <span key={i} className="gs-face" style={{ transform: tr }} />
            ))}
          </div>
        </div>
      </div>
      <div className="gs-controls">
        <div className="gs-chips">
          <button
            type="button"
            className="gs-chip"
            data-on={spin}
            onClick={() => {
              setSpin((s) => !s);
              say(spin ? "Hold it still... now drag to look from any side." : "Turntable on: a good way to show a product.");
            }}
          >
            Turntable
          </button>
          <span className="gs-readout">Drag the model to turn it</span>
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ graphics / branding
const SWATCHES = [354, 40, 76, 150, 200, 300];
export function SceneGraphics({ say, bump, onAvatar }: SceneProps) {
  const [tone, setTone] = useState(0);
  const [turn, setTurn] = useState(0);
  const off = SWATCHES[tone];
  const c = (l: number, s = 82) => `hsl(calc(var(--th) + ${off}) calc(${s}% * var(--ts)) ${l}%)`;
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} tone={352 + off - 354} hide="r" />
          <Arm className="gs-wag" style={at(199, 138)} pts={[[199, 138], [236, 142], [262, 112]]} />
          <g transform="translate(262 112) rotate(-35)"><rect x="-2.6" y="-30" width="5.2" height="34" rx="2.6" fill="var(--g-w)" /><path d="M-2.6-30q2.6-9 5.2 0z" fill={c(60)} /></g>
          <g>
            <rect x="276" y="40" width="190" height="196" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            <g key={turn} className="gs-spinshape" style={at(371, 130)}>
              <circle cx="371" cy="106" r="34" fill={c(66)} />
              <path d="M371 130l36 60h-72z" fill={c(52)} />
              <rect x="340" y="150" width="30" height="30" rx="8" fill={c(80, 70)} transform="rotate(14 355 165)" />
            </g>
            <text x="371" y="214" textAnchor="middle" fontSize="13" fontWeight="800" fill={c(78)}>Your logo</text>
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <div className="gs-swatches" role="group" aria-label="Brand colour">
          {SWATCHES.map((o, i) => (
            <button
              key={o}
              type="button"
              aria-label={`Colour ${i + 1}`}
              className="gs-swatch"
              data-on={tone === i}
              style={{ background: `hsl(calc(var(--th) + ${o}) calc(82% * var(--ts)) 66%)` }}
              onClick={() => {
                setTone(i);
                setTurn((n) => n + 1);
                say("Same shapes, new brand colour. Even I changed my shirt!");
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ SEO
export function SceneSeo({ say, bump, onAvatar }: SceneProps) {
  const [rank, setRank] = useState(6);
  const results = ["Competitor A", "Competitor B", "Competitor C", "Competitor D", "Competitor E", "Competitor F"];
  const list = results.slice(0, 5);
  list.splice(rank - 1, 0, "Your website");
  const optimise = () => {
    setRank((r) => {
      const n = Math.max(1, r - 2);
      say(n === 1 ? "Number one on Google!" : `Climbing: now #${n}`);
      return n;
    });
  };
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} hide="r" />
          <Arm pts={[[199, 138], [226, 154], [246, 130]]} />
          <g>
            <circle cx="262" cy="108" r="22" fill="var(--g-a)" fillOpacity="0.15" stroke="var(--g-w)" strokeWidth="3.4" />
            <path d="M247 124L238 134" stroke="var(--g-w)" strokeWidth="4" strokeLinecap="round" />
            <path d="M252 98q6-6 14-2" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          </g>
          <g>
            <rect x="298" y="26" width="170" height="214" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            <rect x="310" y="38" width="146" height="16" rx="8" fill="var(--g-e)" />
            <text x="322" y="49.4" fontSize="8.5" fill="var(--g-w)">best company near you</text>
            {list.map((name, i) => (
              <g key={name} className="gs-row" style={{ transform: `translate(310px, ${62 + i * 25}px)` }}>
                <rect width="146" height="21" rx="7" fill={name === "Your website" ? "var(--g-a)" : "var(--g-b)"} opacity={name === "Your website" ? 0.95 : 0.3} />
                <text x="8" y="14" fontSize="9" fontWeight="700" fill={name === "Your website" ? "var(--g-e)" : "#fff"}>{`#${i + 1}  ${name}`}</text>
              </g>
            ))}
            {[0, 1, 2, 3, 4].map((i) => {
              const h = 6 + (6 - rank) * 2.6 + i * 1.8;
              return <rect key={i} className="gs-bar" x={318 + i * 28} y={234 - h} width="18" height={h} rx="3" fill="var(--g-a)" opacity={0.4 + i * 0.12} />;
            })}
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <button type="button" className="gs-chip" data-on="true" onClick={optimise} disabled={rank === 1}>
          {rank === 1 ? "You are #1" : "Optimise my site"}
        </button>
        <span className="gs-readout">
          Rank: <b>#{rank}</b>
        </span>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ AI
const AI_QA = [
  ["What can AI automate?", "Answering customers, sorting leads, reading images, writing reports and predicting demand."],
  ["How long does a bot take?", "Simple bots can be done in 2–3 weeks. Complex models take 1–3 months."],
  ["Can it use my data?", "Yes. It can connect to your website, CRM, documents and databases."],
];
export function SceneAi({ say, bump, onAvatar }: SceneProps) {
  const [q, setQ] = useState(-1);
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} />
          {/* the robot buddy: its eyes follow the pointer too */}
          <g className="gs-float">
            <path d="M370 60V44" stroke="var(--g-a)" strokeWidth="3" strokeLinecap="round" />
            <circle className="gs-pulse" cx="370" cy="40" r="6" fill="var(--g-a)" />
            <rect x="326" y="60" width="88" height="70" rx="22" fill="url(#gs-panel)" stroke="var(--g-a)" strokeWidth="2" />
            <rect x="338" y="74" width="64" height="38" rx="14" fill="var(--g-e)" />
            <g className="gs-robot-eyes">
              <circle cx="356" cy="92" r="7" fill="var(--g-a)" />
              <circle cx="384" cy="92" r="7" fill="var(--g-a)" />
              <circle cx="357.4" cy="90.4" r="2.2" fill="#fff" />
              <circle cx="385.4" cy="90.4" r="2.2" fill="#fff" />
            </g>
            <path d="M360 118q10 6 20 0" stroke="var(--g-a)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <rect x="338" y="136" width="64" height="54" rx="16" fill="url(#gs-panel)" stroke="var(--g-a)" strokeWidth="2" />
            <circle cx="370" cy="163" r="9" fill="var(--g-b)" opacity="0.6" />
            <rect x="308" y="142" width="14" height="40" rx="7" fill="var(--g-d)" stroke="var(--g-a)" strokeOpacity="0.6" />
            <rect x="418" y="142" width="14" height="40" rx="7" fill="var(--g-d)" stroke="var(--g-a)" strokeOpacity="0.6" />
          </g>
          {q >= 0 && (
            <g className="gs-pop">
              <rect x="240" y="196" width="226" height="56" rx="14" fill="var(--g-a)" />
              <foreignObject x="248" y="200" width="210" height="48">
                <p className="gs-ai-answer">{AI_QA[q][1]}</p>
              </foreignObject>
            </g>
          )}
        </svg>
      </div>
      <div className="gs-controls">
        <div className="gs-chips" role="group" aria-label="Ask the robot">
          {AI_QA.map(([question], i) => (
            <button
              key={question}
              type="button"
              className="gs-chip"
              data-on={q === i}
              onClick={() => {
                setQ(i);
                say("Ask the robot buddy: it answers like our AI does.");
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ brand
export function SceneBrand({ say, bump, onAvatar }: SceneProps) {
  const [i, setI] = useState(0);
  const marks = [
    <g key={0}><circle cx="371" cy="110" r="32" fill="var(--g-a)" /><circle cx="371" cy="110" r="14" fill="var(--g-e)" /></g>,
    <g key={1}><path d="M371 76l34 58h-68z" fill="var(--g-a)" /><path d="M371 96l16 28h-32z" fill="var(--g-e)" /></g>,
    <g key={2}><rect x="339" y="78" width="64" height="64" rx="18" fill="var(--g-a)" /><path d="M355 96l16 28 16-28" stroke="var(--g-e)" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>,
    <g key={3}><path d="M371 76q34 0 34 34t-34 34q-34 0-34-34t34-34z" fill="var(--g-a)" /><path d="M351 110h40M371 90v40" stroke="var(--g-e)" strokeWidth="7" strokeLinecap="round" /></g>,
  ];
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} hide="r" />
          <Arm className="gs-wag" style={at(199, 138)} pts={[[199, 138], [232, 146], [262, 112]]} />
          <g>
            <rect x="276" y="36" width="190" height="210" rx="14" fill="url(#gs-panel)" stroke="var(--g-a)" strokeOpacity="0.45" />
            <g key={i} className="gs-pop" style={at(371, 110)}>{marks[i]}</g>
            <text x="371" y="176" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">Your Brand</text>
            <text x="371" y="192" textAnchor="middle" fontSize="8" letterSpacing="3" fill="var(--g-w)">TAGLINE GOES HERE</text>
            {[0, 1, 2, 3].map((k) => (
              <circle key={k} cx={331 + k * 20} cy="218" r="7" fill={["var(--g-a)", "var(--g-b)", "var(--g-w)", "var(--g-d)"][k]} stroke="var(--g-a)" strokeOpacity="0.4" />
            ))}
            <text x="440" y="222" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--g-w)">Aa</text>
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <button
          type="button"
          className="gs-chip"
          data-on="true"
          onClick={() => {
            setI((n) => (n + 1) % marks.length);
            say("A new idea for your logo. Which one feels like you?");
          }}
        >
          New logo idea
        </button>
      </div>
    </>
  );
}

// ------------------------------------------------------------------------------------------------------------ hello (about)
export function SceneHello({ say, bump, onAvatar }: SceneProps) {
  const [hi, setHi] = useState(0);
  return (
    <>
      <div className="gs-stage">
        <svg className="gs-svg ch" viewBox="0 0 480 300" aria-hidden>
          <SceneDefs />
          <Glow />
          <SceneAvatar bump={bump} onAvatar={onAvatar} crop={150} hide="r" />
          <Arm className="gs-wag" style={at(199, 138)} pts={[[199, 138], [240, 126], [262, 84]]} />
          {[
            ["Surat, India", 330, 84],
            ["Since 2019", 372, 150],
            ["Web · AI · Metaverse", 330, 214],
          ].map(([t, x, y], k) => (
            <g key={t as string} className="gs-float" style={{ animationDelay: `${-k * 1.2}s` }}>
              <rect x={(x as number) - 66} y={(y as number) - 15} width="132" height="30" rx="15" fill="var(--g-d)" stroke="var(--g-a)" strokeOpacity="0.55" />
              <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{t}</text>
            </g>
          ))}
          <g key={hi} className={hi ? "gs-burst" : ""}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <circle key={i} cx="262" cy="84" r="3.6" fill={i % 2 ? "var(--g-a)" : "var(--g-w)"} style={{ "--a": `${i * 36}deg` } as CSSProperties} />
            ))}
          </g>
        </svg>
      </div>
      <div className="gs-controls">
        <button
          type="button"
          className="gs-chip"
          data-on="true"
          onClick={() => {
            setHi((n) => n + 1);
            say("High five! ✋ Welcome to We3vision.");
          }}
        >
          High five
        </button>
      </div>
    </>
  );
}

export const SCENES: Record<string, (p: SceneProps) => React.JSX.Element> = {
  web: SceneWeb,
  mobile: SceneMobile,
  metaverse: SceneMetaverse,
  uiux: SceneUiux,
  crm: SceneCrm,
  animation: SceneAnimation,
  modeling: SceneModeling,
  graphics: SceneGraphics,
  seo: SceneSeo,
  ai: SceneAi,
  brand: SceneBrand,
  hello: SceneHello,
};
