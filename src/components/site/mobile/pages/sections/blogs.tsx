import type { MobileSection } from "../types";
import { Button, PicCard, Section } from "../../app";

// The articles come from Admin > Blog (the laptop does the same); the items written in the section are only used when there is no article.
export const BlogsSection: MobileSection<"blogs"> = ({ data, id, extra }) => {
  const posts = extra.posts ?? [];
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      <div className="ma-stack ma-grid2">
        {posts.length > 0
          ? posts.map((p) => <PicCard key={p.id} src={p.image} alt={p.title} ratio="3 / 2" kicker={p.category} title={p.title} text={p.summary} href={"/blog/" + p.slug} />)
          : data.items.map((p, i) => <PicCard key={i} src={p.image} alt={p.title} ratio="3 / 2" kicker={p.category} title={p.title} href={p.href} />)}
      </div>
      {data.buttonLabel && data.buttonHref && <div className="ma-actions"><Button href={data.buttonHref} variant="tinted" block>{data.buttonLabel}</Button></div>}
    </Section>
  );
};
