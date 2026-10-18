import type { MobileSection } from "../../types";
import { AppLink, Section } from "../../../app";
import { Lines } from "../../../app/text";
import { BlogBrowser, type BlogStory } from "./client";

// /blog as Apple News: a quiet masthead (Large Title, regular text), then topics you can pick, the top story and open headline rows.
// Articles from Admin > Blog (the laptop does the same); the section's own items only when there is no article. Styles: (m)/m/blog/page.css.

/** the top: a newspaper masthead */
export const BlogMasthead: MobileSection<"pageHero"> = ({ data, index }) => {
  const H = index === 0 ? "h1" : "h2";
  const acts = [
    { label: data.primaryLabel, href: data.primaryHref },
    { label: data.secondaryLabel, href: data.secondaryHref },
  ].filter((a) => a.label && a.href);
  return (
    <section className="mp-blog-mast">
      {data.chip && <p className="mp-blog-kick">{data.chip}</p>}
      <H className="mp-blog-h">
        <Lines text={data.heading} />
      </H>
      {data.text && <p className="mp-blog-t">{data.text}</p>}
      {acts.length > 0 && (
        <div className="mp-blog-acts">
          {acts.map((a, i) => (
            <AppLink key={i} href={a.href} className={i === 0 ? "ma-btn ma-btn-fill" : "ma-btn ma-btn-glass"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
    </section>
  );
};

/** the articles: topics, top story + headline rows */
export const BlogFeed: MobileSection<"blogs"> = ({ data, id, extra }) => {
  const posts = extra.posts ?? [];
  const stories: BlogStory[] =
    posts.length > 0
      ? posts.map((p) => ({ key: p.id, title: p.title, category: p.category, image: p.image, href: "/blog/" + p.slug, summary: p.summary, date: p.dateLabel }))
      : data.items.map((p, i) => ({ key: String(i), title: p.title, category: p.category, image: p.image, href: p.href }));
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      <BlogBrowser stories={stories} />
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-actions">
          <AppLink href={data.buttonHref} className="ma-btn ma-btn-tinted ma-btn-block">
            {data.buttonLabel}
          </AppLink>
        </div>
      )}
    </Section>
  );
};
