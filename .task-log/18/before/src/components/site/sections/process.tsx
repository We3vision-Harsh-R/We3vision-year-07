import { ProcessFloor } from "../process-floor";
import { ProcessRail } from "../modern/process-rail";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/**
 * The steps of the work. Service pages ("modern" skin): a column that counts the steps stays on the left while the step cards pass by on a
 * line that is drawn while you scroll. Home, About and the others ("classic"): walked along a path on a 3D floor.
 */
export const Process: SectionComponent<"process"> = ({ data, skin }) =>
  skin === "modern" ? (
    <section id="process" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1180px] px-4">
        <ProcessRail chip={data.chip} heading={data.heading} intro={data.intro} items={data.items} />
      </div>
    </section>
  ) : (
    <section id="process" className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1240px] px-4">
        <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
      </div>
      <div className="mt-16">
        <ProcessFloor items={data.items} />
      </div>
    </section>
  );
