"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Glyph } from "../glyph";
import { APPS, SECTIONS } from "../launcher-data";
import { IcChevron } from "./icons";
import { AppLink } from "./link";
import type { OutlineItem } from "./nav-types";
import { useSheet } from "./use-sheet";

/**
 * The "Apps" sheet = the mobile replacement of the desktop mega menu, in the look of the iOS "+" menu of Messages: a blurred, dimmed backdrop and a
 * rounded glass list that scrolls (momentum, no scroll-through). "On this page" jumps inside the screen; every other row opens another page
 * of the website as its own app. A search field filters the list.
 */
export function AppsSheet({ open, onClose, outline, currentHref, onJump }: { open: boolean; onClose: () => void; outline: OutlineItem[]; currentHref: string; onJump: (id: string) => void }) {
  const { shown, state, drag, grab } = useSheet(open, onClose);
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const hit = (s: string) => !needle || s.toLowerCase().includes(needle);
    const out = SECTIONS.map((s) => ({ id: s.id, label: s.label, apps: s.apps.map((id) => APPS[id]).filter((a) => a && (hit(a.label) || hit(s.label))) })).filter((g) => g.apps.length > 0);
    return { out, jumps: outline.filter((o) => hit(o.label)), home: hit("home screen all apps") };
  }, [q, outline]);

  if (!shown) return null;
  const empty = groups.out.length === 0 && groups.jumps.length === 0 && !groups.home;

  return (
    <div className="ma-sheet" data-state={state} role="dialog" aria-modal="true" aria-label="All apps">
      <button type="button" className="ma-sheet-back" aria-label="Close" tabIndex={-1} onClick={onClose} />
      <div className="ma-sheet-panel" style={drag ? { transform: `translate3d(0, ${drag}px, 0)`, transition: "none" } : undefined}>
        <div className="ma-sheet-grab" {...grab}>
          <i />
        </div>
        <div className="ma-sheet-head">
          <b>Apps</b>
          <button type="button" className="ma-sheet-x" onClick={onClose}>
            Done
          </button>
        </div>
        <label className="ma-sheet-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps" aria-label="Search apps" enterKeyHint="search" autoComplete="off" />
        </label>

        <div className="ma-sheet-scroll">
          {groups.jumps.length > 0 && (
            <section>
              <h3 className="ma-sheet-h">On this page</h3>
              <ul className="ma-sheet-list">
                {groups.jumps.map((o) => (
                  <li key={o.id}>
                    <button type="button" className="ma-sheet-row" onClick={() => onJump(o.id)}>
                      <span className="ma-sheet-dot" aria-hidden="true" />
                      <span className="ma-sheet-txt">
                        <b>{o.label}</b>
                      </span>
                      <IcChevron className="ma-sheet-chev" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {groups.home && (
            <section>
              <h3 className="ma-sheet-h">We3vision</h3>
              <ul className="ma-sheet-list">
                <li>
                  <AppLink href="/" className="ma-sheet-row">
                    <span className="ma-appic is-s" aria-hidden="true">
                      <Glyph name="home" />
                    </span>
                    <span className="ma-sheet-txt">
                      <b>Home screen</b>
                      <small>All apps</small>
                    </span>
                    <IcChevron className="ma-sheet-chev" />
                  </AppLink>
                </li>
              </ul>
            </section>
          )}

          {groups.out.map((g) => (
            <section key={g.id}>
              <h3 className="ma-sheet-h">{g.label}</h3>
              <ul className="ma-sheet-list">
                {g.apps.map((a) => {
                  const here = a.href === currentHref;
                  const inner = (
                    <>
                      <span className="ma-appic is-s" style={{ "--off": a.off } as CSSProperties} aria-hidden="true">
                        <Glyph name={a.glyph} />
                      </span>
                      <span className="ma-sheet-txt">
                        <b>{a.label}</b>
                        {here && <small>You are here</small>}
                      </span>
                      {here ? <span className="ma-sheet-here" aria-hidden="true" /> : <IcChevron className="ma-sheet-chev" />}
                    </>
                  );
                  return (
                    <li key={a.id}>
                      {here ? (
                        <button type="button" className="ma-sheet-row is-here" onClick={onClose}>
                          {inner}
                        </button>
                      ) : (
                        <AppLink href={a.href} className="ma-sheet-row">
                          {inner}
                        </AppLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {empty && <p className="ma-sheet-empty">No app called &ldquo;{q}&rdquo;.</p>}
        </div>
      </div>
    </div>
  );
}
