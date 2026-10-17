import type { MobileSection } from "../types";
import { Card, Clamp } from "../../app";
import { Rich, paragraphs } from "../../app/text";

export const StorySection: MobileSection<"story"> = ({ data, id }) => (
  <section id={id} className="ma-sec">
    <Card>
      <Clamp lines={7}>
        <div className="ma-prose">
          {paragraphs(data.body).map((p, i) => <p key={i}><Rich text={p} /></p>)}
        </div>
      </Clamp>
    </Card>
  </section>
);
