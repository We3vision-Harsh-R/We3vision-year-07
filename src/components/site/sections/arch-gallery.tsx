import type { CSSProperties } from "react";
import { Img } from "../img";
import type { SectionComponent } from "./shared";

// Soft placeholder colours for a photo that has no image yet (the old site's pastel palette + violet)
const TINTS: [string, string][] = [
  ["#f9c5c5", "#c9c9f4"],
  ["#d387ff", "#531c9b"],
  ["#e2bad2", "#8f6da3"],
  ["#c9c9f4", "#421256"],
  ["#f3d7ff", "#d387ff"],
  ["#531c9b", "#f9c5c5"],
  ["#d387ff", "#f3d7ff"],
];

/**
 * A row of tall pill-shaped photos that slides left by itself. The list is shown twice so the loop has no seam.
 * Pointing at a photo stops the row and opens that photo into a rounded square as wide as three photos: the others step
 * aside and fade back, and the project's name, label and short description appear on it.
 */
export const ArchGallery: SectionComponent<"archGallery"> = ({ data }) => {
  const group = (hidden: boolean) => (
    <ul className="arch-group" aria-hidden={hidden || undefined}>
      {data.items.map((item, i) => {
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
      <div className="arch-track" style={{ "--n": data.items.length } as CSSProperties}>
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
};
