import type { MobileSection } from "../types";
import { AppLink, Button, Pic, Section } from "../../app";

// The articles come from Admin > Blog (the laptop does the same); the items written in the section are only used when there is no article.
// A picture and its words under it, no box around them.
export const BlogsSection: MobileSection<"blogs"> = ({ data, id, extra }) => {
  const posts = extra.posts ?? [];
  const list =
    posts.length > 0
      ? posts.map((p) => ({ key: String(p.id), src: p.image, title: p.title, kicker: p.category, text: p.summary, href: "/blog/" + p.slug }))
      : data.items.map((p, i) => ({ key: String(i), src: p.image, title: p.title, kicker: p.category, text: "", href: p.href || "" }));
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      <div className="ma-s27 ma-s27-works">
        {list.map((p) => (
          <AppLink key={p.key} href={p.href} className="ma-s27-work">
            <Pic src={p.src || undefined} alt={p.title} ratio="3 / 2" />
            <span className="ma-s27-wb">
              {p.kicker && <small>{p.kicker}</small>}
              <b>{p.title}</b>
              {p.text && <span>{p.text}</span>}
            </span>
          </AppLink>
        ))}
      </div>
      {data.buttonLabel && data.buttonHref && (
        <div className="ma-actions">
          <Button href={data.buttonHref} variant="tinted" block>
            {data.buttonLabel}
          </Button>
        </div>
      )}
    </Section>
  );
};
