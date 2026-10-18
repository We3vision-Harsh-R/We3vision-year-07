import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";
import { oneLine } from "../../app/text";

const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 50}ms` }) as CSSProperties;

/** the strengths as an open grid: a title and a line, hairlines, two columns on a tablet */
export const StrengthsSection: MobileSection<"strengths"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ul className="ma-s27 ma-s27-grid">
      {data.items.map((x, i) => (
        <li key={i} className="ma-rvx" style={{ ...rv(i), "--o": `${(i % 4) * 22}` } as CSSProperties}>
          <i className="ma-s27-dot" aria-hidden="true" />
          <h3>{oneLine(x.title)}</h3>
          {x.description && <p>{x.description}</p>}
        </li>
      ))}
    </ul>
  </Section>
);
