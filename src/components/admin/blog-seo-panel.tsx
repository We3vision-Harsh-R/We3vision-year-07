"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { SEO_GOOD_SCORE, type SeoCheck, type SeoGroup, analyzeBlog } from "@/lib/blog-seo";
import { parseFaq, parseTags } from "@/lib/blog-shared";
import { card, inputClass, labelClass } from "./ui";

// The SEO check of the blog editor (Admin > Blog, and the Edit screen of an AI submission): a score from 0 to 100 while you write, the problems
// with what to do about each, and a box for the focus keyword. The rules are in lib/blog-seo.ts. Look: styles/admin-shell.css (.ads-seo-*).
type Props = { title: string; summary: string; content: string; tags: string; faq: string; cover: string };

const GROUPS: SeoGroup[] = ["Title", "Description", "Structure", "Keyword", "Readability", "Extras"];
const MARK = { pass: "✓", warn: "!", fail: "✕" } as const;

function Row({ c }: { c: SeoCheck }) {
  return (
    <li className="ads-seo-row" data-status={c.status}>
      <span className="ads-seo-mark" aria-label={c.status === "pass" ? "Good" : c.status === "warn" ? "Can be better" : "Needs a fix"}>
        {MARK[c.status]}
      </span>
      <div>
        <b>{c.label}</b>
        {c.status !== "pass" && (
          <p>
            {c.problem} <span className="ads-seo-fix">Do this: {c.fix}</span>
          </p>
        )}
      </div>
    </li>
  );
}

export function BlogSeoPanel({ title, summary, content, tags, faq, cover }: Props) {
  const [keyword, setKeyword] = useState("");
  const input = useDeferredValue({ title, summary, content, tags, faq, cover, keyword });
  const report = useMemo(() => analyzeBlog({ title: input.title, summary: input.summary, content: input.content, tags: parseTags(input.tags), faq: parseFaq(input.faq), cover: input.cover, keyword: input.keyword }), [input]);

  const todo = report.checks.filter((c) => c.status !== "pass");
  const done = report.checks.filter((c) => c.status === "pass");
  const tone = report.score >= SEO_GOOD_SCORE ? "great" : report.score >= 70 ? "good" : report.score >= 50 ? "mid" : "low";

  return (
    <section className={`${card} ads-seo`} aria-label="SEO check">
      <div className="ads-seo-head">
        <div className="ads-seo-score" data-tone={tone} style={{ "--p": `${report.score}%` } as React.CSSProperties} role="img" aria-label={`SEO score ${report.score} out of 100`}>
          <span>{report.score}</span>
        </div>
        <div>
          <h2>SEO check: {report.grade}</h2>
          <p>
            {report.words} words · {todo.length ? `${todo.length} thing${todo.length > 1 ? "s" : ""} to improve` : "nothing left to fix"}. Aim for {SEO_GOOD_SCORE}+ before you publish.
          </p>
        </div>
      </div>

      <label className={`${labelClass} block max-w-md`}>
        Focus keyword (the phrase people should find this article with)
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} className={inputClass} placeholder={report.keywordSource === "tag" ? `Using the first tag: ${report.keyword}` : "e.g. 3D web design"} maxLength={80} />
        <span className="mt-1 block text-sm font-normal text-zinc-400">
          {report.keywordSource === "none" ? "Type one, or add a tag: the keyword checks need it." : report.keywordSource === "tag" ? "Empty = the first tag is used." : "Used for the checks below. It is not saved with the article."}
        </span>
      </label>

      {todo.length > 0 && (
        <div className="ads-seo-groups">
          {GROUPS.map((g) => {
            const rows = todo.filter((c) => c.group === g);
            return rows.length ? (
              <div key={g}>
                <h3>{g}</h3>
                <ul>
                  {rows.map((c) => (
                    <Row key={c.id} c={c} />
                  ))}
                </ul>
              </div>
            ) : null;
          })}
        </div>
      )}

      <details className="ads-seo-done">
        <summary>
          {done.length} check{done.length === 1 ? "" : "s"} passed
        </summary>
        <ul>
          {done.map((c) => (
            <Row key={c.id} c={c} />
          ))}
        </ul>
      </details>

      <p className="ads-seo-note">This checks the article itself (title, description, structure, keyword, readability). It cannot see Google rankings or how many people search for a phrase.</p>
    </section>
  );
}
