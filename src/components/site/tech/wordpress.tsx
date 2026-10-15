"use client";

import { useEffect, useRef, useState } from "react";
import { SmartLink } from "../smart-link";
import { oneLine, plainStory, type TechData } from "./data";
import { useStage } from "./stage";

// CUSTOM WORDPRESS page ("wpa-"): the whole page is a working imitation of the WordPress admin (wp-admin), in WordPress's own colours.
// Every menu item shows one part of the page: Dashboard (welcome + story), Pages (services), Appearance (themes: pick one, customise it live),
// Updates (our process), Plugins (tools), Categories (industries), Site Health (why us), and the Help tab (FAQ).

type Menu = "dash" | "pages" | "theme" | "updates" | "plugins" | "cats" | "health";
const MENU: { id: Menu; label: string; icon: string }[] = [
  { id: "dash", label: "Dashboard", icon: "▦" },
  { id: "pages", label: "Pages", icon: "❏" },
  { id: "theme", label: "Appearance", icon: "◐" },
  { id: "updates", label: "Updates", icon: "↻" },
  { id: "plugins", label: "Plugins", icon: "⚙" },
  { id: "cats", label: "Categories", icon: "☰" },
  { id: "health", label: "Site Health", icon: "♥" },
];

const THEMES = [
  { id: "biz", name: "Twenty Business", note: "A company site with a big first screen" },
  { id: "blog", name: "Journal", note: "A calm blog with a reading column" },
  { id: "folio", name: "Folio", note: "A grid for work and portfolios" },
] as const;
const COLORS = ["#2271b1", "#d63638", "#00a32a", "#8c5bd6", "#dba617"];

function Preview({ theme, color, serif, title }: { theme: string; color: string; serif: boolean; title: string }) {
  return (
    <div className={`wpa-site wpa-site-${theme}`} style={{ "--c": color, fontFamily: serif ? "Georgia, 'Times New Roman', serif" : undefined } as React.CSSProperties}>
      <div className="wpa-site-nav"><b>{title || "My Site"}</b><span>Home</span><span>About</span><span>Shop</span><span>Contact</span></div>
      {theme === "biz" && (
        <>
          <div className="wpa-site-hero"><h5>We build things that last</h5><p>A short line about what your business does.</p><i>Get in touch</i></div>
          <div className="wpa-site-cards"><u /><u /><u /></div>
        </>
      )}
      {theme === "blog" && (
        <div className="wpa-site-posts">
          {[0, 1, 2].map((n) => <div key={n}><u /><h5>A post title goes here</h5><p>The first lines of the post, easy to read.</p></div>)}
        </div>
      )}
      {theme === "folio" && <div className="wpa-site-grid">{[0, 1, 2, 3, 4, 5].map((n) => <u key={n} />)}</div>}
    </div>
  );
}

/** Site Health: the checks run one by one and turn green, then the ring fills. */
function Health({ d }: { d: TechData }) {
  const n = d.why.items.length;
  const [done, setDone] = useState(0);
  const [open, setOpen] = useState(-1);
  useEffect(() => {
    const t = setInterval(() => setDone((x) => { if (x >= n) { clearInterval(t); return x; } return x + 1; }), 700);
    return () => clearInterval(t);
  }, [n]);
  const pct = n ? Math.round((done / n) * 100) : 0;
  return (
    <section>
      <h2 className="wpa-title">Site Health <span>{oneLine(d.why.heading)}</span></h2>
      <div className="wpa-score">
        <div className="wpa-ring" style={{ "--pc": `${pct}%` } as React.CSSProperties}><b>{done >= n ? "Good" : `${pct}%`}</b></div>
        <p>{done >= n ? d.why.intro || "Your site’s health is looking good. These are the things a custom build gets right." : `Running health checks… ${done} of ${n} done`}</p>
      </div>
      <ul className="wpa-checks">
        {d.why.items.map((w, k) => (
          <li key={w.title} className={`${open === k ? "is-on" : ""} ${k < done ? "is-ok" : k === done ? "is-run" : ""}`}>
            <button type="button" onClick={() => k < done && setOpen(open === k ? -1 : k)}><span>{w.title}</span><em>{k < done ? "Good" : k === done ? "Checking…" : "Waiting"}</em><u>{k < done ? (open === k ? "▴" : "▾") : ""}</u></button>
            {open === k && k < done && <p>{w.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function WordpressPage({ d }: { d: TechData }) {
  const menus = MENU.filter((m) => !(m.id === "updates" && !d.process) && !(m.id === "cats" && !d.industries));
  const { setOuter, setInner, style: stageStyle, index: stageIndex, goto: stageGoto } = useStage(menus.length);
  const menu: Menu = menus[stageIndex]?.id ?? "dash";
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [menu]);
  const [help, setHelp] = useState(false);
  const [helpTab, setHelpTab] = useState(0);
  // dashboard
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [drafts, setDrafts] = useState<{ t: string; b: string }[]>([]);
  // pages
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const [edit, setEdit] = useState(0);
  // theme
  const [theme, setTheme] = useState<string>("biz");
  const [color, setColor] = useState(COLORS[0]);
  const [serif, setSerif] = useState(false);
  const [siteTitle, setSiteTitle] = useState("My Site");
  // updates
  const steps = d.process?.items ?? [];
  const [prog, setProg] = useState(0); // steps done
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  const runUpdate = () => {
    if (running || steps.length === 0) return;
    setProg(0);
    setRunning(true);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setProg(n);
      if (n >= steps.length && timer.current) { clearInterval(timer.current); setRunning(false); }
    }, 900);
  };
  // plugins
  const [active, setActive] = useState<Set<string>>(new Set(d.tools.items.slice(0, 3)));
  // categories
  const [cat, setCat] = useState(0);

  const cards = d.services.cards.map((c, n) => ({ ...c, n })).filter((c) => oneLine(c.title).toLowerCase().includes(q.toLowerCase()));
  const toggleSet = <T,>(s: Set<T>, v: T) => { const x = new Set(s); if (x.has(v)) x.delete(v); else x.add(v); return x; };
  const story = plainStory(d.story).split(/\n\n+/);
  const go = (m: Menu) => stageGoto(Math.max(0, menus.findIndex((x) => x.id === m)));
  const faq = d.faq;

  return (
    <div className="wpa-wrap tpin" ref={setOuter} style={stageStyle}>
      <div className="tpin-in" ref={setInner}>
      <div className="wpa">
        <header className="wpa-bar">
          <span className="wpa-logo">W</span>
          <span>{d.hero.chip} · We3vision</span>
          <span className="wpa-new">+ New</span>
          <button type="button" className="wpa-helpbtn" onClick={() => setHelp((h) => !h)} aria-expanded={help}>Help ▾</button>
          <span className="wpa-howdy">Howdy, You</span>
        </header>
        <div className="wpa-body">
          <nav className="wpa-side" aria-label="Admin menu">
            {menus.map((m) => (
              <button key={m.id} type="button" className={menu === m.id ? "is-on" : ""} onClick={() => go(m.id)} disabled={m.id === "updates" && steps.length === 0 ? true : m.id === "cats" && !d.industries}>
                <i>{m.icon}</i>{m.label}
                {m.id === "updates" && steps.length > 0 && <b>{steps.length}</b>}
              </button>
            ))}
          </nav>
          <div className="wpa-main" ref={mainRef}>
            {help && (
              <div className="wpa-help">
                <ul>{faq.map((f, n) => <li key={f.question}><button type="button" className={helpTab === n ? "is-on" : ""} onClick={() => setHelpTab(n)}>{f.question}</button></li>)}</ul>
                <div><h4>{faq[helpTab]?.question}</h4><p>{faq[helpTab]?.answer}</p></div>
              </div>
            )}

            {/* DASHBOARD */}
            <section hidden={menu !== "dash"}>
              <h2 className="wpa-title">Dashboard</h2>
              <div className="wpa-welcome">
                <div>
                  <h1>{oneLine(d.hero.heading)}</h1>
                  <p>{d.hero.text}</p>
                  <div className="wpa-wbtn">
                    <SmartLink href={d.hero.primaryHref} className="wpa-btn">{d.hero.primaryLabel}</SmartLink>
                    <button type="button" className="wpa-btn wpa-btn-s" onClick={() => go("pages")}>{d.hero.secondaryLabel}</button>
                  </div>
                </div>
                <div className="wpa-wcol">
                  <h3>Next steps</h3>
                  <button type="button" onClick={() => go("theme")}>✎ Try a theme on your site</button>
                  <button type="button" onClick={() => go("plugins")}>⚙ See the plugins and tools</button>
                  <button type="button" onClick={() => go("health")}>♥ Check the health of your site</button>
                </div>
              </div>
              <div className="wpa-grid">
                <div className="wpa-box">
                  <h3>At a Glance</h3>
                  <ul className="wpa-glance">
                    <li><b>{d.services.cards.length}</b> services</li>
                    {steps.length > 0 && <li><b>{steps.length}</b> steps in our process</li>}
                    {d.industries && <li><b>{d.industries.items.length}</b> industries</li>}
                    <li><b>{d.why.items.length}</b> benefits</li>
                  </ul>
                  <p className="wpa-foot">WordPress running the <a>{d.hero.chip}</a> theme.</p>
                </div>
                <div className="wpa-box">
                  <h3>Quick Draft</h3>
                  <input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Title" />
                  <textarea value={draftBody} onChange={(e) => setDraftBody(e.target.value)} placeholder="What’s on your mind?" rows={3} />
                  <button type="button" className="wpa-btn" disabled={!draftTitle.trim()} onClick={() => { setDrafts((x) => [{ t: draftTitle.trim(), b: draftBody.trim() }, ...x]); setDraftTitle(""); setDraftBody(""); }}>Save Draft</button>
                  {drafts.length > 0 && <ul className="wpa-drafts">{drafts.map((x, n) => <li key={n}><b>{x.t}</b><span>Draft</span>{x.b && <p>{x.b}</p>}</li>)}</ul>}
                </div>
                <div className="wpa-box wpa-wide">
                  <h3>WordPress Events and News</h3>
                  {story.map((p, n) => <p key={n} className="wpa-news">{p}</p>)}
                </div>
                {d.related.length > 0 && (
                  <div className="wpa-box wpa-wide">
                    <h3>More From We3vision</h3>
                    <ul className="wpa-rel">{d.related.map((r) => <li key={r.href}><SmartLink href={r.href}>{oneLine(r.title)}</SmartLink><span>{r.description}</span></li>)}</ul>
                  </div>
                )}
              </div>
            </section>

            {/* PAGES */}
            <section hidden={menu !== "pages"} id="services">
              <h2 className="wpa-title">Pages <span>{d.services.heading.replace(/\n/g, " ")}</span></h2>
              <p className="wpa-intro">{d.services.intro}</p>
              <div className="wpa-tools">
                <span>All ({d.services.cards.length})</span><span>| Published ({d.services.cards.length})</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Pages" />
              </div>
              <div className="wpa-split">
                <table className="wpa-table">
                  <thead><tr><th><input type="checkbox" aria-label="Select all" checked={picked.size === cards.length && cards.length > 0} onChange={(e) => setPicked(e.target.checked ? new Set(cards.map((c) => c.n)) : new Set())} /></th><th>Title</th><th>Author</th><th>Date</th></tr></thead>
                  <tbody>
                    {cards.map((c) => (
                      <tr key={c.n} className={edit === c.n ? "is-on" : ""}>
                        <td><input type="checkbox" aria-label={`Select ${oneLine(c.title)}`} checked={picked.has(c.n)} onChange={() => setPicked((s) => toggleSet(s, c.n))} /></td>
                        <td><button type="button" onClick={() => setEdit(c.n)}>{oneLine(c.title)}</button><small>Edit | Quick Edit | View</small></td>
                        <td>We3vision</td><td>Published</td>
                      </tr>
                    ))}
                    {cards.length === 0 && <tr><td colSpan={4}>No pages found.</td></tr>}
                  </tbody>
                </table>
                <aside className="wpa-quick">
                  <h3>Quick Edit</h3>
                  <p className="wpa-q-t">{oneLine(d.services.cards[edit]?.title ?? "")}</p>
                  <p>{d.services.cards[edit]?.description}</p>
                  <SmartLink href="#contact" className="wpa-btn">Ask us about this</SmartLink>
                  {picked.size > 0 && <p className="wpa-picked">{picked.size} selected · <a onClick={() => setPicked(new Set())}>clear</a></p>}
                </aside>
              </div>
            </section>

            {/* APPEARANCE */}
            <section hidden={menu !== "theme"}>
              <h2 className="wpa-title">Themes <span>pick one, then customise it</span></h2>
              <div className="wpa-themes">
                {THEMES.map((t) => (
                  <button key={t.id} type="button" className={`wpa-theme ${theme === t.id ? "is-on" : ""}`} onClick={() => setTheme(t.id)}>
                    <div className="wpa-thumb"><Preview theme={t.id} color={color} serif={serif} title={siteTitle} /></div>
                    <b>{theme === t.id ? "Active: " : ""}{t.name}</b>
                    <span>{t.note}</span>
                  </button>
                ))}
              </div>
              <div className="wpa-custom">
                <div className="wpa-panel">
                  <h3>Customize</h3>
                  <label>Site title<input value={siteTitle} maxLength={24} onChange={(e) => setSiteTitle(e.target.value)} /></label>
                  <div className="wpa-lab">Accent colour
                    <div>{COLORS.map((c) => <button key={c} type="button" aria-label={`Colour ${c}`} className={color === c ? "is-on" : ""} style={{ background: c }} onClick={() => setColor(c)} />)}</div>
                  </div>
                  <div className="wpa-lab">Font
                    <div className="wpa-seg"><button type="button" className={!serif ? "is-on" : ""} onClick={() => setSerif(false)}>Sans</button><button type="button" className={serif ? "is-on" : ""} onClick={() => setSerif(true)}>Serif</button></div>
                  </div>
                  <p>This is what a custom theme does: your brand, your layout, your colours.</p>
                </div>
                <div className="wpa-live"><Preview theme={theme} color={color} serif={serif} title={siteTitle} /></div>
              </div>
            </section>

            {/* UPDATES */}
            <section hidden={menu !== "updates"}>
              <h2 className="wpa-title">Updates <span>{d.process ? oneLine(d.process.heading) : ""}</span></h2>
              <p className="wpa-intro">{d.process?.intro}</p>
              <button type="button" className="wpa-btn" onClick={runUpdate} disabled={running}>{running ? "Building your site…" : prog >= steps.length && steps.length > 0 ? "Run again" : "Update now"}</button>
              <ol className="wpa-steps">
                {steps.map((s, n) => (
                  <li key={s.title} className={n < prog ? "is-done" : n === prog && running ? "is-run" : ""}>
                    <span>{n < prog ? "✓" : n + 1}</span>
                    <div><b>{s.title}</b><p>{s.text}</p>{s.points.length > 0 && <small>{s.points.join(" · ")}</small>}<div className="wpa-pbar"><i style={{ width: n < prog ? "100%" : n === prog && running ? "55%" : "0%" }} /></div></div>
                  </li>
                ))}
              </ol>
              {prog >= steps.length && steps.length > 0 && <p className="wpa-ok">Your site is up to date. <SmartLink href="#contact">Start your own →</SmartLink></p>}
            </section>

            {/* PLUGINS */}
            <section hidden={menu !== "plugins"}>
              <h2 className="wpa-title">Plugins <span>{d.tools.heading.replace(/\n/g, " ")}</span></h2>
              <div className="wpa-tools"><span>All ({d.tools.items.length})</span><span>| Active ({active.size})</span></div>
              <table className="wpa-table wpa-plugins">
                <tbody>
                  {d.tools.items.map((t) => (
                    <tr key={t} className={active.has(t) ? "is-on" : ""}>
                      <td><b>{t}</b><small>{active.has(t) ? "Deactivate" : "Activate"}</small></td>
                      <td><button type="button" role="switch" aria-checked={active.has(t)} className="wpa-switch" onClick={() => setActive((s) => toggleSet(s, t))}><i /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* CATEGORIES */}
            {d.industries && (
              <section hidden={menu !== "cats"}>
                <h2 className="wpa-title">Categories <span>{oneLine(d.industries.heading)}</span></h2>
                <p className="wpa-intro">{d.industries.intro}</p>
                <div className="wpa-split">
                  <table className="wpa-table">
                    <thead><tr><th>Name</th><th>Description</th><th>Count</th></tr></thead>
                    <tbody>
                      {d.industries.items.map((c, n) => (
                        <tr key={c.name} className={cat === n ? "is-on" : ""} onClick={() => setCat(n)}>
                          <td><button type="button">{c.name}</button></td>
                          <td>{cat === n ? c.description : c.description.slice(0, 48) + (c.description.length > 48 ? "…" : "")}</td>
                          <td>{n + 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* SITE HEALTH: mounted only while it is open, so the check runs every time you come to it */}
            {menu === "health" && <Health d={d} />}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
