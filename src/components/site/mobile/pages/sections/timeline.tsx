import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";
import { Rich, lines } from "../../app/text";

const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 60}ms` }) as CSSProperties;

/** the years as a thin thread: a tinted year and its line; then the names as one line, and the goal under a hairline */
export const TimelineSection: MobileSection<"timeline"> = ({ data, id }) => {
  const names = lines(data.names);
  const teams = lines(data.teams);
  const all = data.partnerName ? [...names, data.partnerName + " · " + data.partnerYear] : names;
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      <ol className="ma-s27 ma-s27-years">
        {data.items.map((x, i) => (
          <li key={i} className="ma-rvx" style={rv(i)}>
            <span className="ma-s27-yr">{x.year}</span>
            <p>{x.text}</p>
          </li>
        ))}
      </ol>
      {all.length > 0 && (
        <p className="ma-s27 ma-s27-line ma-s27-after ma-rvx">
          {all.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </p>
      )}
      {(data.goalTitle || data.goalText) && (
        <div className="ma-s27 ma-s27-goal ma-rvx">
          {data.goalTitle && <h3>{data.goalTitle}</h3>}
          {data.goalText && (
            <p>
              <Rich text={data.goalText} />
            </p>
          )}
          {teams.length > 0 && (
            <p className="ma-s27-line ma-s27-small">
              {teams.map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </p>
          )}
        </div>
      )}
    </Section>
  );
};
