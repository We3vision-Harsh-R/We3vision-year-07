/** The "W" mark: a folded violet ribbon (light and dark faces), drawn in plain SVG so it stays sharp at any size. */
export function BrandGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <defs>
        <linearGradient id="brand-light" gradientUnits="userSpaceOnUse" x1="16" y1="4" x2="16" y2="28">
          <stop offset="0" stopColor="#f6dcff" />
          <stop offset="1" stopColor="#c185f2" />
        </linearGradient>
        <linearGradient id="brand-dark" gradientUnits="userSpaceOnUse" x1="16" y1="4" x2="16" y2="28">
          <stop offset="0" stopColor="#a35ee0" />
          <stop offset="1" stopColor="#5d2a8c" />
        </linearGradient>
      </defs>
      <path d="M5 7 L11 24" stroke="url(#brand-light)" />
      <path d="M11 24 L16 13" stroke="url(#brand-dark)" />
      <path d="M16 13 L21 24" stroke="url(#brand-light)" />
      <path d="M21 24 L27 7" stroke="url(#brand-dark)" />
    </svg>
  );
}

/** Glass tile holding the mark (same look as the template's logo tile: dark-to-violet gradient, thin violet edge). */
export function BrandTile({ className = "size-11" }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-[linear-gradient(180deg,rgba(211,135,255,0.45),rgba(211,135,255,0.08))] p-px shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${className}`}
    >
      <span className="grid size-full place-items-center rounded-[11px] bg-[linear-gradient(180deg,#0d0316,#341d44)]">
        <BrandGlyph className="size-[58%]" />
      </span>
    </span>
  );
}
