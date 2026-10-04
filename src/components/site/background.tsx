import { Starfield } from "./starfield";

/** Fixed page background: near-black violet, a soft glow at the top and tiny stars. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(150,60,210,0.16),transparent_70%)]" />
      <Starfield />
    </div>
  );
}
