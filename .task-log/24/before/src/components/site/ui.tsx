import { SplitHeading } from "./modern/split-heading";
import { Reveal } from "./reveal";
import { SmartLink } from "./smart-link";

/** Faint full-width horizontal line (blueprint look). */
export function Rule({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`absolute left-1/2 h-px w-screen -translate-x-1/2 bg-violet/[0.08] ${className}`} />;
}

function Dot({ className }: { className: string }) {
  return <span aria-hidden className={`absolute size-[5px] rounded-full bg-white/60 ${className}`} />;
}

/** Narrow centered column with thin violet frame lines and corner dots. */
export function Frame({ children, className = "", width = "max-w-[680px]" }: { children: React.ReactNode; className?: string; width?: string }) {
  return (
    <div className={`relative mx-auto w-full ${width} ${className}`}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-violet/10" />
      <span aria-hidden className="absolute inset-y-0 right-0 w-px bg-violet/10" />
      <Rule className="top-0" />
      <Rule className="bottom-0" />
      <Dot className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
      <Dot className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
      <Dot className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <Dot className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
      {children}
    </div>
  );
}

/** Small rounded label above headings. */
export function Chip({ children, lines = false }: { children: React.ReactNode; lines?: boolean }) {
  if (lines) {
    return (
      <span className="inline-flex items-center gap-4 text-sm text-violet">
        <span aria-hidden className="h-px w-16 bg-gradient-to-r from-transparent to-violet/50 sm:w-24" />
        {children}
        <span aria-hidden className="h-px w-16 bg-gradient-to-l from-transparent to-violet/50 sm:w-24" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5 text-sm font-medium text-violet shadow-[0_0_24px_hsl(calc(var(--th)_+_354)_calc(100%_*_var(--ts))_76.47%_/_0.15)]">
      {children}
    </span>
  );
}

/** Centered section heading: chip, two-tone gradient title and intro. */
export function SectionHead({ chip, heading, intro, children, split = false }: { chip?: string; heading?: string; intro?: string; children?: React.ReactNode; split?: boolean }) {
  return (
    <Reveal className="text-center">
      {chip && <Chip>{chip}</Chip>}
      {heading &&
        (split ? (
          <SplitHeading text={heading} className="sh-center mx-auto mt-6 max-w-[900px] pb-1 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-[64px]" />
        ) : (
          <h2 className="text-vfade mx-auto mt-6 max-w-[900px] whitespace-pre-line pb-1 text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl md:text-[64px]">
            {heading}
          </h2>
        ))}
      {intro && <p className="mx-auto mt-6 max-w-[560px] text-base leading-relaxed text-orchid">{intro}</p>}
      {children && <div className="mt-8 flex justify-center">{children}</div>}
    </Reveal>
  );
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  if (!children) return null;
  const look = variant === "primary" ? "btn-primary text-void hover:brightness-110" : "border border-violet/25 bg-violet/[0.06] text-violet hover:bg-violet/15";
  return (
    <SmartLink
      href={href || "#"}
      className={`inline-flex h-12 w-full items-center justify-center rounded-lg px-6 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 sm:w-[236px] ${look}`}
    >
      {children}
    </SmartLink>
  );
}

/** Text with *starred* phrases highlighted in bright violet (plain text only, never HTML). */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-violet">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

export const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

/** Centered content width for card grids. */
export function Wide({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[960px] px-4 ${className}`}>{children}</div>;
}
