import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";
import { oneLine } from "../../app/text";

const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 50}ms` }) as CSSProperties;

/** the advantages, open: a short title and its line, a hairline between them */
export const AdvantagesSection: MobileSection<"advantages"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="ma-s27 ma-s27-rows">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={rv(i)}>
          <i className="ma-s27-tick" aria-hidden="true" />
          <div>
            <h3>{oneLine(x.title)}</h3>
            {x.description && <p>{x.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  </Section>
);
