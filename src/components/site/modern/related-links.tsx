import { GlowEdge } from "../glow-edge";
import { SmartLink } from "../smart-link";

type Card = { title: string; description: string; href?: string };

// The redesigned "More from We3vision" of the service pages: link cards with a big arrow that moves on hover (a plain server component).
export function RelatedLinks({ cards }: { cards: Card[] }) {
  return (
    <ul className="md md-rel">
      {cards.map((c, i) => {
        const inner = (
          <>
            <GlowEdge />
            <span className="md-rel-no" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="whitespace-pre-line">{c.title}</h3>
            <p>{c.description}</p>
            <span className="md-rel-go" aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </>
        );
        return (
          <li key={i}>
            {c.href ? (
              <SmartLink href={c.href} className="md-rel-card bglow">
                {inner}
              </SmartLink>
            ) : (
              <div className="md-rel-card bglow">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
