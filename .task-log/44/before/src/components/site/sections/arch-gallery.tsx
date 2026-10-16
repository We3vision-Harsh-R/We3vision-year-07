import { Fragment, type CSSProperties } from "react";
import { coverOf } from "@/lib/projects";
import { Img } from "../img";
import type { SectionComponent } from "./shared";

// Soft placeholder colours for a photo that has no image yet (the old site's pastel palette + violet)
const TINTS: [string, string][] = [
  ["hsl(calc(var(--th) + 76) calc(81.25% * var(--ts)) 87.45%)", "hsl(calc(var(--th) + 316) calc(66.15% * var(--ts)) 87.25%)"],
  ["hsl(calc(var(--th) + 354) calc(100% * var(--ts)) 76.47%)", "hsl(calc(var(--th) + 341.98) calc(69.4% * var(--ts)) 35.88%)"],
  ["hsl(calc(var(--th) + 40) calc(40.82% * var(--ts)) 80.78%)", "hsl(calc(var(--th) + 353.78) calc(22.69% * var(--ts)) 53.33%)"],
  ["hsl(calc(var(--th) + 316) calc(66.15% * var(--ts)) 87.25%)", "hsl(calc(var(--th) + 358.35) calc(65.38% * var(--ts)) 20.39%)"],
  ["hsl(calc(var(--th) + 358) calc(100% * var(--ts)) 92.16%)", "hsl(calc(var(--th) + 354) calc(100% * var(--ts)) 76.47%)"],
  ["hsl(calc(var(--th) + 341.98) calc(69.4% * var(--ts)) 35.88%)", "hsl(calc(var(--th) + 76) calc(81.25% * var(--ts)) 87.45%)"],
  ["hsl(calc(var(--th) + 354) calc(100% * var(--ts)) 76.47%)", "hsl(calc(var(--th) + 358) calc(100% * var(--ts)) 92.16%)"],
];

/**
 * A row of tall pill-shaped photos that slides left by itself. The list is repeated (twice for a long list, more times for a
 * short one) so the row is always longer than the screen plus one list: the loop has no seam and no empty end, even on a wide monitor.
 * Pointing at a photo stops the row and opens that photo into a rounded square as wide as three photos: the others step
 * aside and fade back, and the project's name, label and short description appear on it.
 */
export const ArchGallery: SectionComponent<"archGallery"> = ({ data, projects }) => {
  // the projects of the admin panel (Projects) of this group; without any, the photos written in the content of the section
  const mine = data.group ? (projects ?? []).filter((x) => x.group === data.group) : [];
  const items = mine.length > 0 ? mine.map((x) => ({ image: coverOf(x), title: x.title, category: x.category, text: x.summary })) : data.items;
  const copies = items.length >= 20 ? 2 : items.length >= 10 ? 3 : 4;
  const group = (hidden: boolean) => (
    <ul className="arch-group" aria-hidden={hidden || undefined}>
      {items.map((item, i) => {
        const [a, b] = TINTS[i % TINTS.length];
        return (
          <li key={i} className="arch" tabIndex={hidden ? undefined : 0} style={{ "--a": a, "--b": b } as CSSProperties}>
            {item.image ? <Img src={item.image} alt={hidden ? "" : item.title} className="arch-img" /> : null}
            {(item.title || item.text) && (
              <div className="arch-info">
                {item.category && <span className="arch-cat">{item.category}</span>}
                {item.title && <h3 className="arch-title">{item.title}</h3>}
                {item.text && <p className="arch-text">{item.text}</p>}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
  return (
    <section id="work" aria-label="Our work" className="arch-gallery">
      <div className="arch-track" style={{ "--n": items.length } as CSSProperties}>
        {Array.from({ length: copies }, (_, k) => (
          <Fragment key={k}>{group(k > 0)}</Fragment>
        ))}
      </div>
    </section>
  );
};
