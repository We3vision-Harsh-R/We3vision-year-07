import type { MobileSection } from "../types";
import { Card, GroupedList, ListRow, Section } from "../../app";
import { Lines, pairs } from "../../app/text";
import { HeroBlock } from "../blocks";

// The home hero scene (a glowing ball that breaks into particles) is 3D: here it is its words, then the service cards as lists.
export const HeroSection: MobileSection<"hero"> = ({ data, id }) => (
  <>
    {data.title && <h1 className="ma-sr">{data.title}</h1>}
    <HeroBlock index={1} heading={[data.above, data.mark, data.below].filter(Boolean).join("\n")} />
    <Section id={id}>
      <div className="ma-stack ma-grid2">
        {data.cards.map((c, i) => (
          <Card key={i} href={c.href || undefined}>
            <h3><Lines text={c.title} /></h3>
            {c.summary && <p>{c.summary}</p>}
            {pairs(c.subs).length > 0 && (
              <div className="ma-gap">
                <GroupedList>
                  {pairs(c.subs).map((s, n) => <ListRow key={n} title={s.name} text={s.text} />)}
                </GroupedList>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Section>
  </>
);
