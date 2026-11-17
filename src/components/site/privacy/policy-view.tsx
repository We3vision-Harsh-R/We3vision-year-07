"use client";

import { Fragment, useMemo, useState } from "react";
import { SmartLink } from "@/components/site/smart-link";
import type { Ui } from "@/lib/privacy/i18n/types";
import type { Section } from "@/lib/privacy/regions";
import "@/styles/privacy.css";

// One privacy policy page: the heading, the tags of the countries (the active one is lit), a search box that filters the sections of the policy and
// marks the words found, a contents list and the sections. The search runs in the browser on the text of this page only.
export type PolicyTag = { href: string; tag: string; code: string; on: boolean };
export type PolicyVariant = {
  code: string; // "en", "de" ...
  label: string; // the name of the language in itself
  dir?: "rtl";
  ui: Ui;
  title: string;
  intro: string;
  laws: string[];
  sections: Section[];
};
type Props = { version: string; updated: string; tags: PolicyTag[]; variants: PolicyVariant[] };

const fmt = (t: string, v: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Marked({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${esc(q)})`, "ig"));
  return (
    <>
      {parts.map((p, i) => (p.toLowerCase() === q.toLowerCase() ? <mark key={i}>{p}</mark> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

const flat = (s: Section) => [s.title, ...(s.paras ?? []), ...(s.list ?? []), s.note ?? ""].join(" ").toLowerCase();

export function PolicyView({ version, updated, tags, variants }: Props) {
  const [lang, setLang] = useState("en");
  const [query, setQuery] = useState("");
  const v = variants.find((x) => x.code === lang) ?? variants[0];
  const { ui, sections } = v;
  const q = query.trim();
  const shown = useMemo(() => (q ? sections.filter((s) => flat(s).includes(q.toLowerCase())) : sections), [q, sections]);
  const index = (id: string) => sections.findIndex((s) => s.id === id) + 1;

  return (
    <article className="pvp">
      <header className="pvp-head">
        <p className="pvp-chip">{ui.legal}</p>
        <h1>{v.title}</h1>
        <p className="pvp-meta">{fmt(ui.meta, { v: version, d: updated })}</p>
        <nav className="pvp-tags" aria-label={ui.tagsAria}>
          {tags.map((t) => (
            <SmartLink key={t.href} href={t.href} className="pvp-tag" aria-current={t.on ? "page" : undefined} data-on={t.on ? "" : undefined}>
              <i>{t.code}</i>
              {t.tag}
            </SmartLink>
          ))}
        </nav>
        <p className="pvp-intro" dir={v.dir}>
          {v.intro}
        </p>
        <div className="pvp-search" role="search" dir={v.dir}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.placeholder} aria-label={ui.searchAria} />
          {q && (
            <button type="button" onClick={() => setQuery("")} aria-label={ui.clear}>
              {ui.clear}
            </button>
          )}
        </div>
        <p className="pvp-count" aria-live="polite" dir={v.dir}>
          {q ? (shown.length ? fmt(ui.match, { n: shown.length, t: sections.length, q }) : fmt(ui.none, { q })) : fmt(ui.count, { t: sections.length })}
        </p>
      </header>

      {variants.length > 1 && (
        <div className="pvp-lang" role="group" aria-label={ui.langAria}>
          {variants.map((x) => (
            <button key={x.code} type="button" lang={x.code} data-on={x.code === v.code ? "" : undefined} aria-pressed={x.code === v.code} onClick={() => setLang(x.code)}>
              {x.label}
            </button>
          ))}
        </div>
      )}
      {ui.binding && (
        <p className="pvp-bind" dir={v.dir}>
          {ui.binding}
        </p>
      )}

      <div className="pvp-body" dir={v.dir} lang={v.code}>
        <aside className="pvp-toc" aria-label={ui.contents}>
          <p>{ui.contents}</p>
          <ol>
            {shown.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <i>{String(index(s.id)).padStart(2, "0")}</i>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="pvp-main">
          {!q && v.laws.length > 0 && (
            <section className="pvp-laws" aria-label={ui.laws}>
              <h2>{ui.laws}</h2>
              <ul>
                {v.laws.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </section>
          )}
          {shown.map((s) => (
            <section key={s.id} id={s.id} className="pvp-sec">
              <h2>
                <i>{String(index(s.id)).padStart(2, "0")}</i>
                <Marked text={s.title} q={q} />
              </h2>
              {s.paras?.map((p, i) => (
                <p key={i}>
                  <Marked text={p} q={q} />
                </p>
              ))}
              {s.list && (
                <ul>
                  {s.list.map((l, i) => (
                    <li key={i}>
                      <Marked text={l} q={q} />
                    </li>
                  ))}
                </ul>
              )}
              {s.note && (
                <p className="pvp-note">
                  <Marked text={s.note} q={q} />
                </p>
              )}
            </section>
          ))}
          <p className="pvp-end">{ui.end}</p>
        </div>
      </div>
    </article>
  );
}
