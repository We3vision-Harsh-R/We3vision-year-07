/* eslint-disable @next/next/no-img-element -- article pictures are links from the admin panel (Blog), like the kit's <Pic> */
import type { MobileSection } from "../../types";
import { AppLink, Clamp, Section } from "../../../app";
import { Lines } from "../../../app/text";

// /blog as a "News" app: a masthead, the newest article as the top story, the others as headline rows with a picture on the right.
// Articles from Admin > Blog (the laptop does the same); the section's own items only when there is no article. Styles: (m)/m/blog/page.css.

type Story = { key: string; title: string; category: string; image: string; href: string; summary?: string; date?: string };

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
            <AppLink key={i} href={a.href} className={i === 0 ? "ma-btn ma-btn-fill" : "ma-btn ma-btn-plain"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
    </section>
  );
};

/** the articles: top story + headline rows */
export const BlogFeed: MobileSection<"blogs"> = ({ data, id, extra }) => {
  const posts = extra.posts ?? [];
  const stories: Story[] =
    posts.length > 0
      ? posts.map((p) => ({ key: p.id, title: p.title, category: p.category, image: p.image, href: "/blog/" + p.slug, summary: p.summary, date: p.dateLabel }))
      : data.items.map((p, i) => ({ key: String(i), title: p.title, category: p.category, image: p.image, href: p.href }));
  const [top, ...rest] = stories;
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      {top && (
        <AppLink href={top.href} className="mp-blog-top">
          <span className="mp-blog-pic">{top.image ? <img src={top.image} alt={top.title} loading="lazy" decoding="async" /> : null}</span>
          <span className="mp-blog-tb">
            {top.category && <span className="mp-blog-cat">{top.category}</span>}
            <b>{top.title}</b>
            {top.summary && <span className="mp-blog-sum">{top.summary}</span>}
            {top.date && <span className="mp-blog-date">{top.date}</span>}
          </span>
        </AppLink>
      )}
      {rest.length > 0 && (
        <Clamp max="700px" slack={120} fade="110px" more={`Show all ${stories.length} articles`} less="Show fewer" className="ma-collapse">
        <ul className="mp-blog-list">
          {rest.map((s) => (
            <li key={s.key}>
              <AppLink href={s.href} className="mp-blog-row">
                <span className="mp-blog-rb">
                  {s.category && <span className="mp-blog-cat">{s.category}</span>}
                  <b>{s.title}</b>
                  {s.date && <span className="mp-blog-date">{s.date}</span>}
                </span>
                <span className="mp-blog-th">{s.image ? <img src={s.image} alt="" loading="lazy" decoding="async" /> : null}</span>
              </AppLink>
            </li>
          ))}
        </ul>
        </Clamp>
      )}
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
