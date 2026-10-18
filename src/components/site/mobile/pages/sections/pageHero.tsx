import type { ReactNode } from "react";
import type { MobileSection } from "../types";
import { AppLink, Clamp } from "../../app";
import { Lines } from "../../app/text";

/**
 * The iOS 27 page hero (shared by pageHero, wordHero and hero): no box, an eyebrow, a Large Title (34 / 600), the text in Body (17 regular) and the two
 * buttons side by side (Liquid Glass: the first filled with the tint, the second clear glass). Only the first section of a page owns the h1.
 */
export function IaHero({ h1, chip, heading, text, actions, children }: { h1: boolean; chip?: string; heading?: string; text?: string; actions?: { label?: string; href?: string }[]; children?: ReactNode }) {
  const H = h1 ? "h1" : "h2";
  const acts = (actions ?? []).flatMap((a) => (a.label && a.href ? [{ label: a.label, href: a.href }] : [])).slice(0, 2);
  return (
    <section className="ma-ia-hero">
      {chip && <p className="ma-ia-eye"><i aria-hidden="true" />{chip}</p>}
      {heading && <H className="ma-ia-title"><Lines text={heading} /></H>}
      {text && (text.length > 240 ? <Clamp lines={5}><p className="ma-ia-lead">{text}</p></Clamp> : <p className="ma-ia-lead">{text}</p>)}
      {children}
      {acts.length > 0 && (
        <div className={acts.length > 1 ? "ma-ia-btns is-two" : "ma-ia-btns"}>
          {acts.map((a, i) => (
            <AppLink key={a.label + i} href={a.href} className={i === 0 ? "ma-btn ma-btn-fill" : "ma-btn ma-ia-glass"}>
              {a.label}
            </AppLink>
          ))}
        </div>
      )}
    </section>
  );
}

export const PageHeroSection: MobileSection<"pageHero"> = ({ data, index }) => (
  <IaHero h1={index === 0} chip={data.chip} heading={data.heading} text={data.text} actions={[{ label: data.primaryLabel, href: data.primaryHref }, { label: data.secondaryLabel, href: data.secondaryHref }]} />
);
