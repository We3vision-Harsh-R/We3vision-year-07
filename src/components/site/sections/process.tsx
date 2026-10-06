import { ProcessFloor } from "../process-floor";
import { SectionHead } from "../ui";
import type { SectionComponent } from "./shared";

/** The steps of the work: walked along a path on a 3D floor while the page scrolls (a clear vertical list on a phone). */
export const Process: SectionComponent<"process"> = ({ data }) => (
  <section id="process" className="py-24 sm:py-32">
    <div className="mx-auto w-full max-w-[1240px] px-4">
      <SectionHead chip={data.chip} heading={data.heading} intro={data.intro} />
    </div>
    <div className="mt-16">
      <ProcessFloor items={data.items} />
    </div>
  </section>
);
