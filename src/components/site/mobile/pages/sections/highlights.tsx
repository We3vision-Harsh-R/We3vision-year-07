import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";

// The CMS figures, open: a large number and its label, two per row, hairlines between rows (no tiles).
export const HighlightsSection: MobileSection<"highlights"> = ({ data, id }) => (
  <Section id={id} chip={data.chip}>
    {data.items.length > 0 && (
      <dl className="ma-ia-figs">
        {data.items.map((s, i) => (
          <div key={i} className="ma-rvx" style={{ "--rv-d": `${Math.min(i, 4) * 70}ms` } as CSSProperties}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    )}
  </Section>
);
