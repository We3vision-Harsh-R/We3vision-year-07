import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";
import { lines, oneLine } from "../../app/text";

const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 60}ms` }) as CSSProperties;

/** the steps of the work, open on the page: a small tinted number, a title, a line, and the points as one quiet line */
export const ProcessSection: MobileSection<"process"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.intro}>
    <ol className="ma-s27 ma-s27-steps">
      {data.items.map((x, i) => {
        const pts = lines(x.points);
        return (
          <li key={i} className="ma-rvx" style={rv(i)}>
            <span className="ma-s27-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <h3>{oneLine(x.title)}</h3>
            {x.text && <p>{x.text}</p>}
            {pts.length > 0 && <p className="ma-s27-pts">{pts.join("  ·  ")}</p>}
          </li>
        );
      })}
    </ol>
  </Section>
);
