import type { SeoReport } from "@/lib/blog-seo";
import { SEO_GOOD_SCORE } from "@/lib/blog-seo";
import { card } from "./ui";

// The SEO score of an AI submission (blog articles), shown to the admin who reviews it: the score and what is still weak. Look: .ads-seo-* in styles/admin-shell.css.
export function SubmissionSeo({ report }: { report: SeoReport }) {
  const open = report.checks.filter((c) => c.status !== "pass").sort((a, b) => b.max - b.points - (a.max - a.points));
  const tone = report.score >= SEO_GOOD_SCORE ? "great" : report.score >= 70 ? "good" : report.score >= 50 ? "mid" : "low";
  return (
    <section className={`${card} ads-seo`}>
      <div className="ads-seo-head">
        <div className="ads-seo-score" data-tone={tone} style={{ "--p": `${report.score}%` } as React.CSSProperties} role="img" aria-label={`SEO score ${report.score} out of 100`}>
          <span>{report.score}</span>
        </div>
        <div>
          <h2>SEO: {report.grade}</h2>
          <p>
            {report.words} words{report.keyword ? ` · keyword "${report.keyword}"` : ""}
          </p>
        </div>
      </div>
      {open.length === 0 ? (
        <p className="ads-seo-note">Every check passed.</p>
      ) : (
        <ul>
          {open.slice(0, 8).map((c) => (
            <li key={c.id} className="ads-seo-row" data-status={c.status}>
              <span className="ads-seo-mark">{c.status === "fail" ? "✕" : "!"}</span>
              <div>
                <b>{c.label}</b>
                <p>{c.fix}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="ads-seo-note">Press Edit to change the article and see this score update.</p>
    </section>
  );
}
