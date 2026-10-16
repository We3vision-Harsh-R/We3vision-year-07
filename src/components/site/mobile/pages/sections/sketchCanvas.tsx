import type { MobileSection } from "../types";
import { Card, Section, Stepper } from "../../app";
import { Rich, lines } from "../../app/text";

// The drawing board is a canvas on the laptop: here the heading, the text and the steps of the brief.
export const SketchCanvasSection: MobileSection<"sketchCanvas"> = ({ data, id }) => (
  <Section id={id} chip={data.chip} title={data.heading} intro={data.text}>
    {lines(data.steps).length > 0 && (
      <Card><Stepper steps={lines(data.steps).map((s) => ({ title: s }))} /></Card>
    )}
    {data.hint && <p className="ma-cap"><Rich text={data.hint} /></p>}
  </Section>
);
