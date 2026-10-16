type IconProps = { className?: string };

const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const Sparkle = ({ className }: IconProps) => (
  <svg {...base} className={className} fill="currentColor" stroke="none">
    <path d="M12 2.5c.7 5.2 2.8 7.3 8 8-5.2.7-7.3 2.8-8 8-.7-5.200-2.800-7.300-8-8 5.200-.7 7.300-2.800 8-8z" />
  </svg>
);

export const Cross = ({ className }: IconProps) => (
  <svg {...base} className={className} strokeWidth="2.8">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Asterisk = ({ className }: IconProps) => (
  <svg {...base} className={className} strokeWidth="2.4">
    <path d="M12 3v18M4.200 7.500l15.600 9M19.800 7.500l-15.600 9" />
  </svg>
);

export const Diamonds = ({ className }: IconProps) => (
  <svg {...base} className={className} fill="currentColor" stroke="none">
    <path d="M12 3l3 3-3 3-3-3zM6 9l3 3-3 3-3-3zM18 9l3 3-3 3-3-3zM12 15l3 3-3 3-3-3z" />
  </svg>
);

export const Ring = ({ className }: IconProps) => (
  <svg {...base} className={className} strokeWidth="3">
    <circle cx="12" cy="12" r="6.500" />
    <circle cx="12" cy="12" r="1.200" fill="currentColor" />
  </svg>
);

export const Bolt = ({ className }: IconProps) => (
  <svg {...base} className={className} fill="currentColor" stroke="none">
    <path d="M13.500 2L5 13.500h6L10 22l9-12h-6.200z" />
  </svg>
);

export const ICONS = [Sparkle, Cross, Diamonds, Asterisk, Ring, Bolt];

/** A small violet glass tile with one of the icons above (picked by position so neighbouring cards differ). */
export function IconTile({ index = 0, large = false }: { index?: number; large?: boolean }) {
  const Icon = ICONS[index % ICONS.length];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl border border-violet/20 bg-[linear-gradient(180deg,hsl(calc(var(--th)_+_347.91)_calc(58.02%_*_var(--ts))_15.88%),hsl(calc(var(--th)_+_346.97)_calc(58.49%_*_var(--ts))_10.39%))] shadow-[inset_0_1px_0_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.2),0_8px_24px_rgba(0,0,0,0.3)] ${
        large ? "size-14" : "size-11"
      }`}
    >
      <Icon className={`text-violet ${large ? "size-6" : "size-5"}`} />
    </span>
  );
}

const line = { ...base, strokeWidth: "1.8" } as const;

/** Outline icon for an industry, chosen from its name. */
export function IndustryIcon({ name, className }: { name: string; className?: string }) {
  const n = name.toLowerCase();
  if (/health|medic|care/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M12 20.500s-8-4.700-8-10.500a4.500 4.500 0 018-2.800A4.500 4.500 0 0120 10c0 5.800-8 10.500-8 10.500z" />
        <path d="M12 8.500v5M9.500 11h5" />
      </svg>
    );
  if (/educat|school|learn/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M3 9l9-4.500L21 9l-9 4.500L3 9z" />
        <path d="M7 11.500V16c0 1.400 2.200 2.800 5 2.800s5-1.400 5-2.800v-4.500M21 9v5" />
      </svg>
    );
  if (/construct|real estate|build/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M5 21V6l7-3 7 3v15M3 21h18" />
        <path d="M9 9.500h1.500M13.500 9.500H15M9 13h1.500M13.500 13H15M10.500 21v-4h3v4" />
      </svg>
    );
  if (/commerce|shop|retail|store/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M3 4h2.200l2 10.200a1.500 1.500 0 001.500 1.200h8.200a1.500 1.500 0 001.500-1.100L20 8H6.200" />
        <circle cx="9.500" cy="19" r="1.300" />
        <circle cx="17" cy="19" r="1.300" />
      </svg>
    );
  if (/gam|entertain|play/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M7 8h10a4 4 0 014 4v2.500a3 3 0 01-5.200 2L14.500 15h-5l-1.300 1.500A3 3 0 013 14.500V12a4 4 0 014-4z" />
        <path d="M8 10.500v3M6.500 12h3M15.500 11.500h.01M17.500 13.500h.01" />
      </svg>
    );
  if (/market|brand|advert|promo/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M4 10.500v3l11 4.500V6L4 10.500z" />
        <path d="M18 9c1.300.6 2 1.700 2 3s-.7 2.400-2 3M7 15.500l1 4h2.500l-1-3.500" />
      </svg>
    );
  if (/financ|insur|bank/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M3 9l9-5 9 5M5 9v8M9.500 9v8M14.500 9v8M19 9v8M3 20h18" />
      </svg>
    );
  if (/logist|transport|deliver|shipping/.test(n))
    return (
      <svg {...line} className={className}>
        <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
        <circle cx="7" cy="18" r="1.800" />
        <circle cx="17" cy="18" r="1.800" />
      </svg>
    );
  if (/corporate|enterprise|business|company/.test(n))
    return (
      <svg {...line} className={className}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V5.500A1.500 1.500 0 0110.500 4h3A1.500 1.500 0 0115 5.500V7M3 13h18" />
      </svg>
    );
  return <Sparkle className={className} />;
}
