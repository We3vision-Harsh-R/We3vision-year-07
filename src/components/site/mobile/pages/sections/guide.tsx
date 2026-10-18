import type { CSSProperties } from "react";
import type { MobileSection } from "../types";
import { AppLink, Section } from "../../app";
import { Rich, lines } from "../../app/text";

// On the laptop a cartoon says the tips one after the other: here they arrive as Messages-style bubbles (no card around them), then one button.
export const GuideSection: MobileSection<"guide"> = ({ data, id }) => {
  const tips = lines(data.tips);
  return (
    <Section id={id} chip={data.chip} title={data.heading}>
      {data.text && <p className="ma-ia-body"><Rich text={data.text} /></p>}
      {tips.length > 0 && (
        <ul className="ma-ia-chat">
          {tips.map((t, i) => (
            <li key={i} className="ma-rvx" style={{ "--rv-d": `${Math.min(i, 5) * 90}ms` } as CSSProperties}>{t}</li>
          ))}
        </ul>
      )}
      {data.buttonLabel && (
        <div className="ma-ia-btns">
          <AppLink href={data.buttonHref || "#contact"} className="ma-btn ma-btn-fill">{data.buttonLabel}</AppLink>
        </div>
      )}
    </Section>
  );
};
