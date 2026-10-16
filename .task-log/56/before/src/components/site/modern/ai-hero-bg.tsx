// The background of the first screen of the AI page: only an elegant, slowly moving gradient (three soft lights that drift and a very slow sweep of
// light). No pictures, no lines: nothing to load, only transform moves. The look is in globals.css (.ab-*). With less motion it stands still.
export function AiHeroBg() {
  return (
    <div className="ab" aria-hidden>
      <i className="ab-l ab-l1" />
      <i className="ab-l ab-l2" />
      <i className="ab-l ab-l3" />
      <i className="ab-sweep" />
    </div>
  );
}
