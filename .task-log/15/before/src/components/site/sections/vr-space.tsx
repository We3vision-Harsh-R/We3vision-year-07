import { VrSpace, type SpaceWindow } from "../metaverse/vr-space";
import type { SectionComponent } from "./shared";

/** The view inside the headset: space + three glass windows (see metaverse/vr-space.tsx). */
export const VrSpaceSection: SectionComponent<"vrSpace"> = ({ data }) => {
  const windows: SpaceWindow[] = data.windows.map((w) => ({
    eyebrow: w.eyebrow,
    title: w.title,
    text: w.text,
    image: w.image,
    cards: w.cards
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((l) => {
        const [title = "", text = ""] = l.split("|").map((x) => x.trim());
        return { title, text };
      }),
  }));
  return <VrSpace windows={windows} />;
};
