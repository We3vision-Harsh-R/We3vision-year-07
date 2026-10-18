import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { Section } from "../../app";
import { Rich, lines } from "../../app/text";

const rv = (i: number) => ({ "--rv-d": `${Math.min(i, 6) * 60}ms` }) as CSSProperties;

// The drawing board is a canvas on the laptop: here the heading, the text and the steps of the brief as a short numbered open list.
export const SketchCanvasSection: MobileSection<"sketchCanvas"> = ({ data, id }) => {
  const steps = lines(data.steps);
  return (
    <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
      {steps.length > 0 && (
        <ol className="ma-s27 ma-s27-brief">
          {steps.map((s, i) => (
            <li key={i} className="ma-rvx" style={rv(i)}>
              <span className="ma-s27-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      )}
      {data.hint && (
        <p className="ma-s27 ma-s27-hint">
          <Rich text={data.hint} />
        </p>
      )}
    </Section>
  );
};
