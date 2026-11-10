import type { SectionData } from "@/lib/cms/sections";
import { SmartLink } from "../smart-link";
import "@/styles/app-showcase.css";

// "App showcase" (owner's reference, 2026-11-10): a dark tablet with a menu bar, a big brand word, a gradient headline card,
// two phones drawn in CSS and two buttons. Edited in Admin > Pages. Styles: .aps-* in styles/app-showcase.css.

export function AppShowcase({ data }: { data: SectionData<"appShowcase"> }) {
  const nav = data.nav.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 5);
  const head = data.heading.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <section className="aps" aria-label={data.logo}>
      <div className="aps-tilt">
        <div className="aps-tab">
          <div className="aps-nav">
            <ul>{nav.map((n) => <li key={n}>{n}</li>)}</ul>
            {data.navButton && <SmartLink href={data.primaryHref || "#contact"} className="aps-nb">{data.navButton}</SmartLink>}
          </div>

          <div className="aps-body">
            <div className="aps-brand">
              <b>{data.logo}</b>
              <span>{data.tagline}</span>
            </div>

            <div className="aps-card">
              <h2>{head.map((h, i) => <span key={i}>{h}</span>)}</h2>
            </div>

            <div className="aps-blob" aria-hidden />
            <div className="aps-phones" aria-hidden>
              <div className="aps-ph aps-ph-a">
                <i className="aps-notch" />
                <div className="aps-av"><u /></div>
                <div className="aps-steps"><s data-on="" /><s data-on="" /><s /><s /></div>
                <div className="aps-ln" /><div className="aps-ln aps-short" />
                <div className="aps-row" /><div className="aps-row" /><div className="aps-row" /><div className="aps-row" />
              </div>
              <div className="aps-ph aps-ph-b">
                <i className="aps-notch" />
                <div className="aps-month">May</div>
                <div className="aps-cal">{Array.from({ length: 28 }, (_, i) => <s key={i} data-on={i >= 18 && i <= 20 ? "" : undefined} />)}</div>
              </div>
            </div>

            <div className="aps-side">
              <p>{data.sideLabel}</p>
              <span className="aps-pic" aria-hidden />
            </div>

            <div className="aps-btns">
              {data.primaryLabel && (
                <SmartLink href={data.primaryHref || "#contact"} className="aps-b1">
                  {data.primaryLabel}<i aria-hidden>›</i>
                </SmartLink>
              )}
              {data.secondaryLabel && (
                <SmartLink href={data.secondaryHref || "#services"} className="aps-b2">
                  {data.secondaryLabel}<i aria-hidden>↓</i>
                </SmartLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
