import type { SectionComponent } from "./shared";

/**
 * The black of the 3D scenes dissolves into the normal page: a band that is black at the top and clear at the bottom, with a blur that
 * is strongest where it is black and gets weaker layer by layer (see .ve in globals.css). The next section scrolls in under its lower half,
 * so it comes out of the dark, out of the blur, onto the background of the page.
 */
export const VrEmerge: SectionComponent<"vrEmerge"> = () => (
  <div className="ve" aria-hidden>
    <span className="ve-black" />
    <span className="ve-blur">
      {[1.4, 1.9, 2.4, 2.8, 3.3, 3.8].map((b, i) => (
        <i key={i} style={{ "--k": i + 1, "--b": b } as React.CSSProperties} />
      ))}
    </span>
  </div>
);
