import type { MobileSection } from "../types";
import { Button, Section } from "../../app";
import { Rich } from "../../app/text";

// The rotating globe is 3D: here the places it marks are quiet capsules under the text, no box around them.
export const ReachSection: MobileSection<"reach"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading}>
    <div className="ma-s27 ma-s27-reach ma-rvx">
      {data.text && (
        <p>
          <Rich text={data.text} />
        </p>
      )}
      {data.places.length > 0 && (
        <ul className="ma-s27-places">
          {data.places.map((p, i) => (
            <li key={i}>
              <i aria-hidden="true" />
              {p.label}
            </li>
          ))}
        </ul>
      )}
      {data.buttonLabel && (
        <div className="ma-actions">
          <Button href={data.buttonHref || "#contact"} block>
            {data.buttonLabel}
          </Button>
        </div>
      )}
    </div>
  </Section>
);
