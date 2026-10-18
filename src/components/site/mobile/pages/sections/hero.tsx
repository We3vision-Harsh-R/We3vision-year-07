import type { MobileSection } from "../types";
import { AppLink, IcChevron } from "../../app";
import { Lines, oneLine, pairs } from "../../app/text";
import { IaHero } from "./pageHero";

// The home hero scene (a glowing ball that breaks into particles) is 3D: here it is its words, then the service cards as an open list
// (a title, a line and the sub-services under a hairline; no boxes).
export const HeroSection: MobileSection<"hero"> = ({ data, id }) => (
  <>
    {data.title && <h1 className="ma-sr">{data.title}</h1>}
    <IaHero h1={false} heading={[data.above, data.mark, data.below].filter(Boolean).join("\n")} />
    {data.cards.length > 0 && (
      <section id={id} className="ma-sec">
        <ul className="ma-ia-cards">
          {data.cards.map((c, i) => {
            const subs = pairs(c.subs);
            return (
              <li key={i} className="ma-rvx">
                {c.href ? (
                  <AppLink href={c.href} className="ma-ia-cardh"><h3><Lines text={c.title} /></h3><IcChevron /></AppLink>
                ) : (
                  <h3 className="ma-ia-cardh"><Lines text={c.title} /></h3>
                )}
                {c.summary && <p className="ma-ia-body">{c.summary}</p>}
                {subs.length > 0 && (
                  <dl className="ma-ia-defs" aria-label={oneLine(c.title)}>
                    {subs.map((s, n) => (
                      <div key={n}><dt>{s.name}</dt>{s.text && <dd>{s.text}</dd>}</div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    )}
  </>
);
