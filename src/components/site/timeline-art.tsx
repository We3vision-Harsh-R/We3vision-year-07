// Artwork of the timeline (sections/timeline.tsx), everything seen from ABOVE: the people (the cartoon guide of the site), the park
// benches and the trees of the garden. All colours come from CSS classes (.tl-*, see globals.css) that follow the visitor's theme.
import { GuideTop } from "./avatar";

/** The guide of the site seen from above, facing down (the rigged figure of avatar.tsx): feet and hands step while it walks, the head
 *  turns, the hands type at a table (see .ch-top in globals.css). */
export function PersonTop({ seated = false, girl = false }: { seated?: boolean; girl?: boolean } = {}) {
  return (
    <span className={seated ? "tl-pt tl-seat" : "tl-pt"} aria-hidden>
      <GuideTop girl={girl} />
    </span>
  );
}

/** A park bench seen from above (34 x 76): the seat, the backrest along the outer edge and two armrests. The back is on the left. */
export function BenchTop() {
  return (
    <svg viewBox="0 0 34 76" className="tl-bench" fill="none" aria-hidden>
      <rect x="0" y="0" width="34" height="76" rx="6" className="tl-wood-d" />
      <rect x="1.5" y="2" width="8" height="72" rx="3" className="tl-wood-b" />
      <rect x="11" y="2" width="21" height="72" rx="4" className="tl-wood" />
      <path d="M11 20h21M11 38h21M11 56h21" className="tl-plank" />
      <rect x="11" y="0.5" width="21" height="6" rx="3" className="tl-wood-l" />
      <rect x="11" y="69.5" width="21" height="6" rx="3" className="tl-wood-l" />
    </svg>
  );
}

/** A tree crown seen from above (80 x 80). */
export function TreeTop({ tone = 0 }: { tone?: number }) {
  return (
    <svg viewBox="0 0 80 80" className="tl-tree" data-tone={tone} fill="none" aria-hidden>
      <circle cx="40" cy="42" r="37" fill="#000" fillOpacity="0.25" />
      <circle cx="40" cy="38" r="36" className="tl-crown-d" />
      <circle cx="26" cy="46" r="20" className="tl-crown" />
      <circle cx="54" cy="44" r="21" className="tl-crown" />
      <circle cx="40" cy="26" r="21" className="tl-crown-l" />
      <circle cx="31" cy="22" r="8" className="tl-crown-hi" />
      <circle cx="52" cy="50" r="2.2" className="tl-flower" />
      <circle cx="28" cy="52" r="2" className="tl-flower" />
      <circle cx="46" cy="34" r="2" className="tl-flower-b" />
      <circle cx="36" cy="58" r="1.8" className="tl-flower-b" />
    </svg>
  );
}

/** A round bush seen from above (44 x 44). */
export function BushTop() {
  return (
    <svg viewBox="0 0 44 44" className="tl-bush" fill="none" aria-hidden>
      <circle cx="22" cy="24" r="20" fill="#000" fillOpacity="0.22" />
      <circle cx="22" cy="22" r="19" className="tl-crown-d" />
      <circle cx="16" cy="25" r="11" className="tl-crown" />
      <circle cx="28" cy="20" r="12" className="tl-crown-l" />
      <circle cx="21" cy="12" r="2" className="tl-flower" />
      <circle cx="30" cy="29" r="1.8" className="tl-flower-b" />
      <circle cx="12" cy="18" r="1.6" className="tl-flower" />
    </svg>
  );
}
