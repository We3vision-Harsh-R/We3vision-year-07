"use client";

import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { AppLink } from "../../../app";
import { IcArrow } from "../../../app/icons";
import { useSheet } from "../../../app/use-sheet";
import { Glyph } from "../../../glyph";

/**
 * The services as tiles (the Apple way: a few big, quiet tiles instead of paragraphs). Each tile is an app-style icon and a name; a tap opens the
 * full text in an iOS bottom sheet (description, who it is for, problems it solves, what you get). All the text is also in the page for search
 * engines and screen readers (a hidden copy), only the sheet shows it to the eye.
 */
export type Service = { title: string; description: string; fit?: string; problems?: string[]; outcomes?: string[]; href?: string };

/** a picture for a service, found from its name (the order of the services in the admin panel does not matter) */
function glyphOf(title: string, i: number): string {
  const t = title.toLowerCase();
  if (/wordpress|woo/.test(t)) return "wp";
  if (/shopify/.test(t)) return "bag";
  if (/headless|cms/.test(t)) return "layers";
  if (/commerce|store|shop/.test(t)) return "cart";
  if (/portal|dashboard|booking/.test(t)) return "layout";
  if (/domain|hosting|ssl|server/.test(t)) return "globe";
  return ["code", "chip", "rocket", "star", "compass", "puzzle"][i % 6];
}
const HUES = [0, 46, 92, -46, -92, 138];

function Body({ s }: { s: Service }) {
  return (
    <>
      <p className="mp-wd-sd-d">{s.description}</p>
      {s.fit && (
        <>
          <p className="mp-wd-lab">Right for you when</p>
          <p className="mp-wd-sd-t">{s.fit}</p>
        </>
      )}
      {s.problems && s.problems.length > 0 && (
        <>
          <p className="mp-wd-lab">Problems it solves</p>
          <ul className="ma-pts">{s.problems.map((p, x) => <li key={x}>{p}</li>)}</ul>
        </>
      )}
      {s.outcomes && s.outcomes.length > 0 && (
        <>
          <p className="mp-wd-lab">What you get</p>
          <ul className="ma-pts">{s.outcomes.map((p, x) => <li key={x}>{p}</li>)}</ul>
        </>
      )}
    </>
  );
}

export function ServiceTiles({ items, more }: { items: Service[]; more: string }) {
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const close = useCallback(() => setOpen(false), []);
  const { shown, state, drag, grab } = useSheet(open, close);
  const s = items[cur];
  const hue = { "--off": HUES[cur % HUES.length] } as React.CSSProperties;

  return (
    <div className="mp-wd-tiles-w">
      <ul className="mp-wd-tiles">
        {items.map((it, k) => (
          <li key={k}>
            <button type="button" className="mp-wd-tile2" aria-haspopup="dialog" onClick={() => { setCur(k); setHost(document.querySelector<HTMLElement>(".ma-root")); setOpen(true); }}>
              <span className="ma-appic" style={{ "--off": HUES[k % HUES.length] } as React.CSSProperties} aria-hidden="true">
                <Glyph name={glyphOf(it.title, k)} />
              </span>
              <span className="mp-wd-tile2-t">{it.title}</span>
              <span className="mp-wd-tile2-c" aria-hidden="true">+</span>
            </button>
          </li>
        ))}
      </ul>

      {/* the same words for search engines and screen readers */}
      <div className="ma-sr" aria-hidden="true">
        {items.map((it, k) => (
          <section key={k}>
            <h3>{it.title}</h3>
            <Body s={it} />
          </section>
        ))}
      </div>

      {shown && s && host &&
        createPortal(
          <div className="ma-sheet" data-state={state} role="dialog" aria-modal="true" aria-label={s.title}>
            <button type="button" className="ma-sheet-back" aria-label="Close" tabIndex={-1} onClick={close} />
            <div className="ma-sheet-panel" style={drag ? { transform: `translate3d(0, ${drag}px, 0)`, transition: "none" } : undefined}>
              <div className="ma-sheet-grab" {...grab}>
                <i />
              </div>
              <div className="ma-sheet-head">
                <b>Service</b>
                <button type="button" className="ma-sheet-x" onClick={close}>Done</button>
              </div>
              <div className="ma-sheet-scroll mp-wd-sd">
                <div className="mp-wd-sd-top">
                  <span className="ma-appic" style={hue} aria-hidden="true"><Glyph name={glyphOf(s.title, cur)} /></span>
                  <h3>{s.title}</h3>
                </div>
                <Body s={s} />
                {s.href && (
                  <AppLink href={s.href} className="mp-wd-ex-more">
                    {more}
                    <IcArrow />
                  </AppLink>
                )}
              </div>
            </div>
          </div>,
          host,
        )}
    </div>
  );
}
