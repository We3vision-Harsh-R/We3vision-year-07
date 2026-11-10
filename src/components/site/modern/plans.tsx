import type { CSSProperties } from "react";
import type { SectionData } from "@/lib/cms/sections";
import { Reveal } from "../reveal";
import { SmartLink } from "../smart-link";
import "@/styles/plans.css";

// The "Plans & pricing" section (owner, 2026-11-10): works on any service page and is edited in Admin > Pages.
// Two looks from the owner's references: pinned notes (coloured notes with a pin, slightly tilted) and pricing cards (glass with a soft glow).
// Styles: .pln-* in styles/plans.css (theme colours only, laptop and phone).

type Plan = SectionData<"plans">["plans"][number];

/** a features line that starts with "- " is shown as not included */
function Features({ text }: { text: string }) {
  const rows = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <ul className="pln-f">
      {rows.map((r) => {
        const off = r.startsWith("- ");
        return (
          <li key={r} data-off={off ? "" : undefined}>
            <i aria-hidden />
            {off ? r.slice(2) : r}
          </li>
        );
      })}
    </ul>
  );
}

function Price({ p }: { p: Plan }) {
  return (
    <p className="pln-p">
      {p.priceNote && <small>{p.priceNote}</small>}
      <b>{p.price}</b>
      {p.period && <span>{p.period}</span>}
    </p>
  );
}

export function Plans({ data }: { data: SectionData<"plans"> }) {
  const lines = data.heading.split("\n").map((l) => l.trim()).filter(Boolean);
  const last = lines.length > 1 ? lines.pop() : undefined;
  const plans = data.plans.filter((p) => p.name);
  return (
    <section id="plans" className="pln" data-look={data.look}>
      <div className="pln-wrap">
        <Reveal className="pln-head">
          {data.chip && (
            <p className="pln-chip">
              <i />
              {data.chip}
            </p>
          )}
          <h2>
            {lines.join(" ")}
            {last && (
              <>
                {" "}
                <em>{last}</em>
              </>
            )}
          </h2>
          {data.intro && <p className="pln-intro">{data.intro}</p>}
        </Reveal>
        <div className="pln-grid" data-n={plans.length}>
          {data.look === "notes" && (
            <svg className="pln-path" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden>
              <path d="M170 120 C 330 60 360 230 500 250 S 700 120 830 150" />
            </svg>
          )}
          {plans.map((p, i) => (
            <Reveal key={p.name + i} className="pln-c">
              <article className="pln-card" data-hot={p.badge ? "" : undefined} style={{ "--i": i } as CSSProperties}>
                {data.look === "notes" && <span className="pln-pin" aria-hidden />}
                <div className="pln-note">
                  <header>
                    <span className="pln-no">{String(i + 1).padStart(2, "0")}</span>
                    {p.badge && <em className="pln-badge">{p.badge}</em>}
                  </header>
                  <h3>{p.name}</h3>
                  {p.tag && <p className="pln-tag">{p.tag}</p>}
                  <Price p={p} />
                  {p.summary && <p className="pln-sum">{p.summary}</p>}
                  <Features text={p.features} />
                  {p.delivery && <p className="pln-dl">{p.delivery}</p>}
                  {p.buttonLabel && (
                    <SmartLink href={p.buttonHref || "#contact"} className="pln-btn">
                      {p.buttonLabel}
                      <span aria-hidden>→</span>
                    </SmartLink>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        {data.note && <p className="pln-note-b">{data.note}</p>}
      </div>
    </section>
  );
}
