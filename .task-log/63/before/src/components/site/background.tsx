import { ScrollAurora } from "./scroll-aurora";
import { Starfield } from "./starfield";

/** Fixed page background: near-black violet, a soft glow at the top, the gradient lights that drift while the page is scrolled and tiny stars. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,hsl(calc(var(--th)_+_352)_calc(62.5%_*_var(--ts))_52.94%_/_0.16),transparent_70%)]" />
      <ScrollAurora />
      <Starfield />
    </div>
  );
}
