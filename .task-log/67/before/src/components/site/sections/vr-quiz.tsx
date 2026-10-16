import { VrQuiz } from "../metaverse/vr-quiz";
import type { SectionComponent } from "./shared";

/** The quiz "which reality fits your idea" (see metaverse/vr-quiz.tsx). */
export const VrQuizSection: SectionComponent<"vrQuiz"> = ({ data, sectionId }) => <VrQuiz id={sectionId} {...data} />;
