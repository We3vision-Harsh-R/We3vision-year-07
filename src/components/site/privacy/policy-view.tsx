"use client";

import { Fragment, useMemo, useState } from "react";
import { SmartLink } from "@/components/site/smart-link";
import type { Section } from "@/lib/privacy/regions";
import "@/styles/privacy.css";

// One privacy policy page: the heading, the tags of the countries (the active one is lit), a search box that filters the sections of the policy and
// marks the words found, a contents list and the sections. The search runs in the browser on the text of this page only.
export type PolicyTag = { href: string; tag: string; code: string; on: boolean };
type Props = {
  title: string;
  intro: string;
  updated: string;
  version: string;
  tags: PolicyTag[];
  laws: string[];
  sections: Section[];
};

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

export function PolicyView({ title, intro, updated, version, tags, laws, sections }: Props) {
  const [query, setQuery] = useState("");
  const q = query.trim();
  const shown = useMemo(() => (q ? sections.filter((s) => flat(s).includes(q.toLowerCase())) : sections), [q, sections]);
  const index = (id: string) => sections.findIndex((s) => s.id === id) + 1;

  return (
    <article className="pvp">
      <header className="pvp-head">
        <p className="pvp-chip">Legal</p>
        <h1>{title}</h1>
        <p className="pvp-meta">
          We3vision Private Limited · Version {version} · Last updated {updated}
        </p>
        <nav className="pvp-tags" aria-label="Privacy policy by country">
          {tags.map((t) => (
            <SmartLink key={t.href} href={t.href} className="pvp-tag" aria-current={t.on ? "page" : undefined} data-on={t.on ? "" : undefined}>
              <i>{t.code}</i>
              {t.tag}
            </SmartLink>
          ))}
        </nav>
        <p className="pvp-intro">{intro}</p>
        <div className="pvp-search" role="search">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this policy: data, cookies, GDPR, breach, delete…" aria-label="Search this privacy policy" />
          {q && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear the search">
              Clear
            </button>
          )}
        </div>
        <p className="pvp-count" aria-live="polite">
          {q ? (shown.length ? `${shown.length} of ${sections.length} sections match “${q}”` : `Nothing found for “${q}”. Try another word.`) : `${sections.length} sections`}
        </p>
      </header>

      <div className="pvp-body">
        <aside className="pvp-toc" aria-label="Contents">
          <p>Contents</p>
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
          {!q && laws.length > 0 && (
            <section className="pvp-laws" aria-label="Laws this page follows">
              <h2>Laws this page follows</h2>
              <ul>
                {laws.map((l) => (
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
          <p className="pvp-end">
            This policy explains how we work. It is not legal advice. For a project with special legal needs, we sign the contract and data processing agreement that your lawyer asks for.
          </p>
        </div>
      </div>
    </article>
  );
}
