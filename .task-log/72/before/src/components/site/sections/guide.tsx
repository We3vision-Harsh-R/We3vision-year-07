import { AfterEffects } from "../after-effects";
import { AiBuddy } from "../ai-buddy";
import { GuideScene } from "../guide-scene";
import { OfficeBuilder } from "../office-builder";
import { Reveal } from "../reveal";
import { ButtonLink, Chip } from "../ui";
import type { SectionComponent } from "./shared";

// "Meet the guide": text on one side, the interactive scene of the cartoon guide on the other (guide-scene.tsx).
export const Guide: SectionComponent<"guide"> = ({ data, sectionId }) => {
  const tips = data.tips.split("\n").map((t) => t.trim()).filter(Boolean);
  // the office scene fills the whole screen
  if (data.scene === "office") return <OfficeBuilder chip={data.chip} heading={data.heading} tips={tips} />;
  // the AI page: a chat window with the robot buddy (ai-buddy.tsx) instead of the cartoon scene
  if (data.scene === "ai") {
    return (
      <section id={sectionId && sectionId !== "guide" ? sectionId : "guide"} className="py-24 sm:py-32">
        <div className="mx-auto w-full max-w-[1040px] px-4">
          <Reveal className="text-center">
            {data.chip && <Chip>{data.chip}</Chip>}
            <h2 className="text-vfade mx-auto mt-6 max-w-[760px] whitespace-pre-line pb-1 text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">{data.heading}</h2>
            {data.text && <p className="mx-auto mt-6 max-w-[620px] text-base leading-relaxed text-orchid sm:text-lg">{data.text}</p>}
          </Reveal>
          <Reveal className="mt-12">
            <AiBuddy greeting={tips[0] ?? ""} />
          </Reveal>
        </div>
      </section>
    );
  }
  return (
    <section id={sectionId && sectionId !== "guide" ? sectionId : "guide"} className="py-24 sm:py-32">
      <div className="mx-auto w-full max-w-[1120px] px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
          <Reveal className="text-center lg:text-left">
            {data.chip && <Chip>{data.chip}</Chip>}
            <h2 className="text-vfade mt-6 whitespace-pre-line pb-1 text-[2.3rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">{data.heading}</h2>
            {data.text && <p className="mt-6 text-base leading-relaxed text-orchid sm:text-lg">{data.text}</p>}
            {data.buttonLabel && data.buttonHref && (
              <div className="mt-8 flex justify-center lg:justify-start">
                <ButtonLink href={data.buttonHref}>{data.buttonLabel}</ButtonLink>
              </div>
            )}
          </Reveal>
          <Reveal>
            {/* the Animation page: a small After Effects (the composition, the layers and the timeline) instead of the cartoon guide */}
            {data.scene === "aftereffects" ? <AfterEffects /> : <GuideScene scene={data.scene} tips={tips} />}
          </Reveal>
        </div>
      </div>
    </section>
  );
};
