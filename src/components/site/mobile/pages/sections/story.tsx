import type { MobileSection } from "../types";
import { Clamp } from "../../app";
import { Rich, paragraphs } from "../../app/text";

// Open text (no card): the first paragraph is the lead in Title 3 size but regular weight, the rest Body in the second label colour.
// *Highlights* turn the primary colour. Long stories open with "Read more".
export const StorySection: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <Clamp lines={8}>
      <div className="ma-ia-story">
        {paragraphs(data.body).map((p, i) => <p key={i}><Rich text={p} /></p>)}
      </div>
    </Clamp>
  </section>
);
