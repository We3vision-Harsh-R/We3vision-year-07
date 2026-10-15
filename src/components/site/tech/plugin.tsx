"use client";

import { useEffect, useRef, useState } from "react";
import { GuideFront, GuideSide } from "../avatar";
import { SmartLink } from "../smart-link";
import { oneLine, plainStory, type TechData } from "./data";
import { AppWindow, useStage } from "./stage";

// WORDPRESS PLUGIN page ("wpp-"): a code editor. The hero is a small IDE: switch features on and the plugin's PHP files appear and change; press
// "Activate" in the preview and see what each feature does inside WordPress. Services are plugin-directory cards (install -> activate), the process
// is a git log, tools are README badges, why-us and the FAQ are the tabs of a plugin page, related services are "related plugins".

type Feat = "cpt" | "short" | "set" | "rest" | "note";
const FEATS: { id: Feat; label: string; file: string; code: string }[] = [
  { id: "cpt", label: "Custom post type", file: "includes/post-type.php", code: "add_action( 'init', function () {\n\tregister_post_type( 'portfolio', array(\n\t\t'label'    => 'Portfolio',\n\t\t'public'   => true,\n\t\t'supports' => array( 'title', 'editor', 'thumbnail' ),\n\t) );\n} );" },
  { id: "short", label: "Shortcode", file: "includes/shortcode.php", code: "add_shortcode( 'we3_hello', function () {\n\treturn '<p class=\"we3-hello\">Hello from your plugin!</p>';\n} );" },
  { id: "set", label: "Settings page", file: "includes/settings.php", code: "add_action( 'admin_menu', function () {\n\tadd_options_page( 'My Plugin', 'My Plugin', 'manage_options', 'my-plugin', 'my_plugin_page' );\n} );\n\nfunction my_plugin_page() {\n\techo '<div class=\"wrap\"><h1>My Plugin</h1></div>';\n}" },
  { id: "rest", label: "REST endpoint", file: "includes/rest.php", code: "add_action( 'rest_api_init', function () {\n\tregister_rest_route( 'we3/v1', '/hello', array(\n\t\t'methods'             => 'GET',\n\t\t'callback'            => fn() => array( 'message' => 'Hello' ),\n\t\t'permission_callback' => '__return_true',\n\t) );\n} );" },
  { id: "note", label: "Admin notice", file: "includes/notice.php", code: "add_action( 'admin_notices', function () {\n\techo '<div class=\"notice notice-success\"><p>My Plugin is active.</p></div>';\n} );" },
];
const MAIN = "plugin.php";

const mainCode = (on: Set<Feat>) =>
  `<?php\n/**\n * Plugin Name: My Custom Plugin\n * Description: A plugin built around your needs.\n * Version:     1.0.0\n * Author:      We3vision\n */\n\ndefined( 'ABSPATH' ) || exit;\n${FEATS.filter((f) => on.has(f.id)).map((f) => `\nrequire_once __DIR__ . '/${f.file}';`).join("")}${on.size === 0 ? "\n\n// Switch a feature on and it is added here." : ""}\n`;

/** a very small PHP colouring: comments, strings and a few keywords */
function Php({ code }: { code: string }) {
  const parts = code.split(/(\/\*[\s\S]*?\*\/|\/\/.*|'(?:[^'\\]|\\.)*'|\b(?:function|return|fn|require_once|defined|exit|array|true)\b)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return <span key={i}>{p}</span>;
        const cls = p.startsWith("/") ? "c" : p.startsWith("'") ? "s" : "k";
        return <span key={i} className={`wpp-${cls}`}>{p}</span>;
      })}
    </>
  );
}

function Ide() {
  const [on, setOn] = useState<Set<Feat>>(new Set(["short"]));
  const [file, setFile] = useState(MAIN);
  const [active, setActive] = useState(false);
  // the mini guide walks in, presses "Activate" for you, waves and walks out
  const [av, setAv] = useState<"off" | "in" | "press" | "out">("off");
  const [click, setClick] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const play = (first: number) => {
    timers.current.forEach(clearTimeout);
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    at(first, () => setAv("in"));
    at(first + 2300, () => { setAv("press"); setClick(true); setActive(true); });
    at(first + 2900, () => setClick(false));
    at(first + 6200, () => setAv("out"));
    at(first + 7900, () => setAv("off"));
  };
  useEffect(() => {
    const list = timers.current;
    play(900);
    return () => list.forEach(clearTimeout);
  }, []);
  const replay = () => { setActive(false); play(100); };
  const toggle = (id: Feat) => setOn((s) => { const x = new Set(s); if (x.has(id)) x.delete(id); else x.add(id); return x; });
  const files = [MAIN, ...FEATS.filter((f) => on.has(f.id)).map((f) => f.file)];
  const cur = files.includes(file) ? file : MAIN;
  const code = cur === MAIN ? mainCode(on) : `<?php\n${FEATS.find((f) => f.file === cur)?.code ?? ""}\n`;
  const has = (id: Feat) => active && on.has(id);

  return (
    <div className="wpp-ide">
      <div className="wpp-top"><i /><i /><i /><b>my-custom-plugin</b></div>
      <div className="wpp-body">
        <aside className="wpp-tree">
          <p>EXPLORER</p>
          <ul>
            <li className="wpp-dir">▾ my-custom-plugin</li>
            {files.map((f) => <li key={f}><button type="button" className={cur === f ? "is-on" : ""} onClick={() => setFile(f)}>{f}</button></li>)}
          </ul>
          <p>FEATURES</p>
          <ul className="wpp-feats">
            {FEATS.map((f) => <li key={f.id}><label><input type="checkbox" checked={on.has(f.id)} onChange={() => toggle(f.id)} />{f.label}</label></li>)}
          </ul>
        </aside>
        <div className="wpp-edit">
          <div className="wpp-tab">{cur}</div>
          <pre><Php code={code} /></pre>
        </div>
        <div className="wpp-prev">
          <div className="wpp-prev-h"><span>Plugins</span><button type="button" role="switch" aria-checked={active} className={click ? "is-click" : ""} onClick={() => setActive((a) => !a)}>{active ? "Deactivate" : "Activate"}</button></div>
          {has("note") && <div className="wpp-note">My Plugin is active.</div>}
          <div className="wpp-wp">
            <ul>
              <li>Dashboard</li><li>Posts</li>
              {has("cpt") && <li className="is-new">Portfolio</li>}
              <li>Settings{has("set") && <em>· My Plugin</em>}</li>
            </ul>
            <div className="wpp-page">
              <b>Sample page</b>
              <p>{on.has("short") ? (active ? <span className="wpp-out">Hello from your plugin!</span> : "[we3_hello]") : "Some text on a page."}</p>
              {has("rest") && <code>GET /wp-json/we3/v1/hello{"\n"}{`{ "message": "Hello" }`}</code>}
            </div>
          </div>
          <p className="wpp-hint">{active ? "The plugin is active: each feature you switched on now does its job." : "Press Activate to see what the features do."}{av === "off" && <button type="button" className="wpp-replay" onClick={replay}>↻ Watch the guide do it</button>}</p>
          {av !== "off" && (
            <div className={`wpp-av is-${av}`} aria-hidden="true">
              {av === "press" && <span className="wpp-bubble">Activating…</span>}
              {av === "press" ? <GuideFront className="wpp-av-f tav-wave" /> : <GuideSide className="wpp-av-s" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Directory({ cards }: { cards: TechData["services"]["cards"] }) {
  const [st, setSt] = useState<Record<number, "i" | "r" | "a">>({});
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const press = (n: number) => {
    const s = st[n];
    if (s === "i") return;
    if (!s) {
      setSt((x) => ({ ...x, [n]: "i" }));
      timers.current.push(setTimeout(() => setSt((x) => ({ ...x, [n]: "r" })), 1000));
    } else if (s === "r") setSt((x) => ({ ...x, [n]: "a" }));
    else setSt((x) => { const y = { ...x }; delete y[n]; return y; });
  };
  const label = (s?: string) => (s === "i" ? "Installing…" : s === "r" ? "Activate" : s === "a" ? "Active ✓" : "Install Now");
  return (
    <ul className="wpp-dir-grid">
      {cards.map((c, n) => (
        <li key={c.title} className={st[n] === "a" ? "is-act" : ""}>
          <span className="wpp-ic" style={{ background: `linear-gradient(135deg, hsl(calc(var(--th) + ${300 + n * 22}) calc(60% * var(--ts)) 58%), hsl(calc(var(--th) + ${346 + n * 9}) calc(70% * var(--ts)) 40%))` }}>{oneLine(c.title).slice(0, 1)}</span>
          <div><h3>{oneLine(c.title)}</h3><p>{c.description}</p></div>
          <button type="button" className={st[n] ? `is-${st[n]}` : ""} onClick={() => press(n)}>{label(st[n])}</button>
        </li>
      ))}
    </ul>
  );
}

const hash = (s: string) => { let h = 5381; for (const ch of s) h = (h * 33 + ch.charCodeAt(0)) >>> 0; return h.toString(16).padStart(7, "0").slice(0, 7); };

function GitLog({ process }: { process: NonNullable<TechData["process"]> }) {
  const [open, setOpen] = useState(process.items.length - 1);
  return (
    <ol className="wpp-git">
      {[...process.items].reverse().map((p, ri) => {
        const n = process.items.length - 1 - ri;
        return (
          <li key={p.title} className={open === n ? "is-on" : ""}>
            <span className="wpp-dot" />
            <button type="button" onClick={() => setOpen(open === n ? -1 : n)}><code>{hash(p.title)}</code><b>{p.title}</b><em>{n === process.items.length - 1 ? "HEAD → main" : ""}</em></button>
            {open === n && <div><p>{p.text}</p>{p.points.length > 0 && <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>}</div>}
          </li>
        );
      })}
    </ol>
  );
}

function Readme({ d }: { d: TechData }) {
  const [tab, setTab] = useState<"why" | "faq">("why");
  const [open, setOpen] = useState(0);
  return (
    <div className="wpp-readme">
      <div className="wpp-rtabs"><button type="button" className={tab === "why" ? "is-on" : ""} onClick={() => setTab("why")}>Description</button><button type="button" className={tab === "faq" ? "is-on" : ""} onClick={() => setTab("faq")}>FAQ</button><span>readme.txt</span></div>
      {tab === "why" ? (
        <div className="wpp-rbody">
          <h3>{oneLine(d.why.heading)}</h3>
          {d.why.intro && <p className="wpp-rintro">{d.why.intro}</p>}
          <ul>{d.why.items.map((w) => <li key={w.title}><b>{w.title}</b><span>{w.description}</span></li>)}</ul>
        </div>
      ) : (
        <div className="wpp-rbody wpp-faq">
          {d.faq.map((f, n) => (
            <div key={f.question} className={open === n ? "is-on" : ""}>
              <button type="button" onClick={() => setOpen(open === n ? -1 : n)}>= {f.question} =</button>
              {open === n && <p>{f.answer}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PluginPage({ d }: { d: TechData }) {
  const story = plainStory(d.story).split(/\n\n+/);
  const tabs = [
    { id: "ide", label: "plugin.php" },
    { id: "doc", label: "README.md" },
    { id: "dir", label: "plugin-directory/" },
    ...(d.process ? [{ id: "git", label: "git log" }] : []),
    { id: "badges", label: "badges.md" },
    { id: "page", label: "readme.txt" },
    { id: "rel", label: "related-plugins/" },
  ];
  const { setOuter, setInner, style: stageStyle, index: stageIndex, goto: stageGoto } = useStage(tabs.length);
  const cur = tabs[stageIndex]?.id ?? "ide";
  const to = (id: string) => stageGoto(Math.max(0, tabs.findIndex((t) => t.id === id)));
  return (
    <div className="wpp tpin" ref={setOuter} style={stageStyle}>
      <div className="tpin-in" ref={setInner}>
        <AppWindow p="wpp" title="my-custom-plugin · editor" tabs={tabs.map((t) => t.label)} index={stageIndex} onPick={stageGoto}>
          {cur === "ide" && (
            <div className="wpp-pn wpp-hero">
              <div className="wpp-hero-t">
                <p className="wpp-chip">{d.hero.chip}</p>
                <h1>{d.hero.heading}</h1>
                <p>{d.hero.text}</p>
                <div className="wpp-cta">
                  <SmartLink href={d.hero.primaryHref} className="wpp-btn">{d.hero.primaryLabel}</SmartLink>
                  <button type="button" className="wpp-btn wpp-btn-g" onClick={() => to("dir")}>{d.hero.secondaryLabel}</button>
                </div>
              </div>
              <Ide />
            </div>
          )}
          {cur === "doc" && (
            <div className="wpp-pn wpp-doc">
              <pre>
                <span className="wpp-c">{"/**\n * Plugin Name: "}</span><span className="wpp-s">{oneLine(d.hero.heading)}</span>
                <span className="wpp-c">{"\n * Description: "}</span>{story[0]}
                {story[1] && <><span className="wpp-c">{"\n *\n * "}</span>{story[1]}</>}
                <span className="wpp-c">{"\n */"}</span>
              </pre>
            </div>
          )}
          {cur === "dir" && (<div className="wpp-pn"><p className="wpp-eyebrow">Plugin directory</p><h2>{d.services.heading}</h2><p className="wpp-sub">{d.services.intro}</p><Directory cards={d.services.cards} /></div>)}
          {cur === "git" && d.process && (<div className="wpp-pn"><p className="wpp-eyebrow">git log --graph</p><h2>{d.process.heading}</h2><p className="wpp-sub">{d.process.intro}</p><GitLog process={d.process} /></div>)}
          {cur === "badges" && (
            <div className="wpp-pn"><p className="wpp-eyebrow">README badges</p><h2>{d.tools.heading}</h2>
              <ul className="wpp-badges">{d.tools.items.map((t, n) => <li key={t}><span>{t}</span><b style={{ background: `hsl(calc(var(--th) + ${300 + n * 17}) calc(55% * var(--ts)) 42%)` }}>in use</b></li>)}</ul>
            </div>
          )}
          {cur === "page" && (<div className="wpp-pn"><p className="wpp-eyebrow">Plugin page</p><h2>{oneLine(d.why.heading)}</h2><Readme d={d} /></div>)}
          {cur === "rel" && (
            <div className="wpp-pn"><p className="wpp-eyebrow">Related plugins</p>
              <ul className="wpp-rel">{d.related.map((r) => <li key={r.href}><SmartLink href={r.href}><b>{oneLine(r.title)}</b><span>{r.description}</span><em>More Details</em></SmartLink></li>)}</ul>
            </div>
          )}
        </AppWindow>
      </div>
    </div>
  );
}
