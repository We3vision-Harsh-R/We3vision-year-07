import type { MobileSection } from "../types";
import { Gallery, PicCard, Section } from "../../app";
import { lines } from "../../app/text";

export const VrSpaceSection: MobileSection<"vrSpace"> = ({ data, id }) => (
  <Section id={id}>
    <Gallery label="Spaces">
      {data.windows.map((w, i) => (
        <PicCard key={i} src={w.image} alt={w.title} ratio="4 / 5" kicker={w.eyebrow} title={w.title} text={w.text} points={lines(w.cards)} />
      ))}
    </Gallery>
  </Section>
);
