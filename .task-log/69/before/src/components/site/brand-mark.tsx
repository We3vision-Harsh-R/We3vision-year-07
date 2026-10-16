import Image from "next/image";

/** The We3vision mark (the real logo, /public/brand/logo-mark.webp). It keeps its own colours on every theme. */
export function BrandGlyph({ className = "", white = false }: { className?: string; white?: boolean }) {
  return white ? (
    <Image src="/brand/logo-white.webp" alt="" width={600} height={468} className={`object-contain ${className}`} />
  ) : (
    <Image src="/brand/logo-mark.webp" alt="" width={480} height={395} className={`object-contain ${className}`} />
  );
}

/** Glass tile holding the mark (same look as the template's logo tile: dark-to-violet gradient, thin violet edge). */
export function BrandTile({ className = "size-11", white = false }: { className?: string; white?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-[linear-gradient(180deg,hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.45),hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.08))] p-px shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${className}`}
    >
      <span className="grid size-full place-items-center rounded-[11px] bg-[linear-gradient(180deg,hsl(calc(var(--th)_+_347.58)_calc(76%_*_var(--ts))_4.9%),hsl(calc(var(--th)_+_351.38)_calc(40.21%_*_var(--ts))_19.02%))]">
        <BrandGlyph white={white} className="size-[76%]" />
      </span>
    </span>
  );
}
