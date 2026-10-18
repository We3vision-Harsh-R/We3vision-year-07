import type { MobileSection } from "../types";
import { AppLink, Section } from "../../app";
import { Rich, pairs } from "../../app/text";

// The large sentence is the section title, the paragraph open text, the list an open numbered list with hairlines (no boxes).
export const BrandBoardSection: MobileSection<"brandBoard"> = ({ data, id }) => {
  const pts = pairs(data.points);
  return (
    <Section id={id} chip={data.chip} title={data.lead}>
      {data.body && <p className="ma-ia-body"><Rich text={data.body} /></p>}
      {pts.length > 0 && (
        <>
          {data.listIntro && <p className="ma-ia-lab">{data.listIntro}</p>}
          <ol className="ma-ia-num">
            {pts.map((p, i) => (
              <li key={i} className="ma-rvx">
                <span className="ma-ia-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <b>{p.name}</b>
                  {p.text && <small>{p.text}</small>}
                </span>
              </li>
            ))}
          </ol>
        </>
      )}
      {data.ctaLabel && (
        <div className="ma-ia-btns">
          <AppLink href={data.ctaHref || "#contact"} className="ma-btn ma-btn-fill">{data.ctaLabel}</AppLink>
        </div>
      )}
      {data.note && <p className="ma-ia-foot">{data.note}</p>}
    </Section>
  );
};
