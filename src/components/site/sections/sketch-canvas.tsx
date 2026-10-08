import { GlowEdge } from "../glow-edge";
import { Reveal } from "../reveal";
import { SketchCanvas } from "../sketch-canvas";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/** "Draw a rough idea, we make it shine": the ink canvas (sketch-canvas.tsx) and three steps under it. */
export const SketchCanvasSection: SectionComponent<"sketchCanvas"> = ({ data, sectionId }) => {
  const steps = data.steps
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((l) => {
      const [title = "", text = ""] = l.split("|").map((x) => x.trim());
      return { title, text };
    });
  return (
    <section id={sectionId && sectionId !== "sketchCanvas" ? sectionId : "sketch"} className="py-24 sm:py-32">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.text} />
      <div className="sk mt-12">
        <Reveal>
          <SketchCanvas hint={data.hint} sendLabel={data.sendLabel} saveLabel={data.saveLabel} sendMessage={data.sendMessage} />
        </Reveal>
        {steps.length > 0 && (
          <ol className="sk-steps">
            {steps.map((st, i) => (
              <Reveal key={i} delay={i * 90} className="h-full">
                <li className="sk-step bglow">
                  <GlowEdge />
                  <span className="sk-step-no">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{st.title}</h3>
                  {st.text && <p>{st.text}</p>}
                </li>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};
