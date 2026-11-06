"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

type Menu = { label: string; items: { label: string; href: string }[] };
type Out = { id: number; cmd: string; lines: ReactNode[] };

// THE FOOTER "CONSOLE" (redesign 2026-11-04): a small terminal in the footer that a visitor can play with. Press a command (or type it): the menus
// of the site (services, technology, company ...), hello, time, seven, coffee, clear. Every menu is a command and every answer is a list of real
// links, so it is a second way to move through the site. The window holds a live clock of Surat, and a spotlight follows the pointer over the
// whole footer. It is a plain form with a labelled field and real links; the link columns under it hold the same links without script.

export function FooterGlow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--gx", `${(e.clientX - r.left).toFixed(0)}px`);
    ref.current.style.setProperty("--gy", `${(e.clientY - r.top).toFixed(0)}px`);
  };
  return (
    <div ref={ref} className="fx-glow" onPointerMove={move}>
      {children}
    </div>
  );
}

export function FooterConsole({ menus }: { menus: Menu[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [out, setOut] = useState<Out[]>([]);
  const [text, setText] = useState("");
  const [now, setNow] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const id = useRef(0);

  // the window starts empty again on every new page (the footer stays mounted when the visitor moves from page to page; a refresh empties it anyway)
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOut([]);
    setText("");
  }

  // the clock of Surat (India, UTC+5:30)
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const iv = window.setInterval(tick, 1000);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    const el = body.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [out]);

  const names = menus.map((m) => m.label.toLowerCase());
  const links = (items: { label: string; href: string }[]) =>
    items.map((it) => (
      <a
        key={it.href + it.label}
        href={it.href}
        {...(/^https?:/.test(it.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => {
          if (/^https?:/.test(it.href)) return;
          e.preventDefault();
          router.push(it.href);
        }}
      >
        {it.label}
      </a>
    ));

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase().replace(/^\//, "");
    if (!cmd) return;
    id.current += 1;
    const k = id.current;
    if (cmd === "clear") {
      setOut([]);
      return;
    }
    let lines: ReactNode[];
    const menu = menus.find((m) => m.label.toLowerCase() === cmd);
    if (menu)
      lines = [
        <span key="h">
          {menu.label} ({menu.items.length}):
        </span>,
        <span key="l" className="fx-links">
          {links(menu.items)}
        </span>,
      ];
    else if (cmd === "help" || cmd === "?")
      lines = [
        <span key="a">Type or tap a name to see its pages: {names.join(", ")}.</span>,
        <span key="b">Just for fun: hello, time, seven, coffee. Type clear to start again.</span>,
      ];
    else if (cmd === "hello" || cmd === "hi")
      lines = [
        <span key="a">Hello! We are We3vision, a team in Surat, India. Tell us what you want to build.</span>,
        <span key="b" className="fx-links">
          {links([{ label: "Start a project", href: "/contact" }])}
        </span>,
      ];
    else if (cmd === "time") lines = [<span key="a">It is {now || "…"} in Surat right now (IST).</span>];
    else if (cmd === "seven" || cmd === "7")
      lines = [
        <span key="a">Since 2019 we have been building. This year is year 7 of We3vision.</span>,
        <span key="b" className="fx-links">
          {links([{ label: "Our story", href: "/about" }])}
        </span>,
      ];
    else if (cmd === "coffee" || cmd === "chai")
      lines = [
        <span key="a">☕ Brewing… the best ideas start over a cup of chai. Pour us yours:</span>,
        <span key="b" className="fx-links">
          {links([{ label: "Let's talk", href: "/contact" }])}
        </span>,
      ];
    else {
      const near = names.filter((n) => n.startsWith(cmd.slice(0, 2)));
      lines = [
        <span key="a">
          I do not know “{cmd}”. {near.length ? `Did you mean ${near.join(" or ")}?` : "Tap one of the buttons below, or type help."}
        </span>,
      ];
    }
    setOut((o) => [...o.slice(-5), { id: k, cmd, lines }]);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(text);
    setText("");
  };

  return (
    <div className="fx-term" role="group" aria-label="Footer console: type or press a command to find a page">
      <div className="fx-bar">
        <span aria-hidden className="fx-dots">
          <i />
          <i />
          <i />
        </span>
        <b>we3vision — surat</b>
        <time aria-label="Time in Surat">{now ? `${now.slice(0, 5)} IST` : ""}</time>
      </div>
      <div ref={body} className="fx-body" aria-live="polite">
        {out.length === 0 && (
          <div className="fx-guide">
            <p className="fx-line">
              <span>welcome.</span> This window finds any page of We3vision for you.
            </p>
            <ol>
              <li>
                <b>1</b> Tap a button below (for example <kbd>services</kbd>) and its pages appear here as links.
              </li>
              <li>
                <b>2</b> Or type the same word in the box and press <kbd>Enter</kbd>.
              </li>
              <li>
                <b>3</b> Tap a page name in the answer to open that page. Type <kbd>help</kbd> for all the words.
              </li>
            </ol>
          </div>
        )}
        {out.map((o) => (
          <div key={o.id} className="fx-out">
            <p className="fx-line">
              <span>$</span> {o.cmd}
            </p>
            {o.lines.map((l, i) => (
              <p key={i} className="fx-res">
                {l}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div className="fx-chips">
        <span className="fx-cap">Pages</span>
        {menus.map((m) => (
          <button key={m.label} type="button" onClick={() => run(m.label.toLowerCase())} title={`${m.items.length} pages`}>
            {m.label.toLowerCase()}
            <small>{m.items.length}</small>
          </button>
        ))}
        <span className="fx-cap">For fun</span>
        {["hello", "time", "seven", "coffee"].map((c) => (
          <button key={c} type="button" onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
      <form className="fx-in" onSubmit={onSubmit}>
        <label htmlFor="fx-input">$</label>
        <input id="fx-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="type a word, for example services…" autoComplete="off" autoCapitalize="off" spellCheck={false} maxLength={30} />
        <button type="submit">Run</button>
      </form>
    </div>
  );
}
