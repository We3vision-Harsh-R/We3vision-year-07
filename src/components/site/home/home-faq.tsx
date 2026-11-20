import type { CSSProperties } from "react";
import { SmartLink } from "@/components/site/smart-link";
import { FaqToggle } from "./faq-toggle";
import { homeFaq } from "@/lib/seo/home-faq";
import type { SiteSettings } from "@/lib/cms/settings";
import "@/styles/home-faq.css";

// The questions people ask about We3vision (home page, before the contact form). Every answer is plain server text (on a laptop all open, on a phone folded until the question is tapped, faq-toggle.tsx; so
// visitors, search engines and AI assistants read it the same way), each question is a heading, each answer starts with the answer itself and ends
// with a link to the page that explains it. The same list is the FAQPage data of the home page (lib/seo/home-faq.ts). CSS prefix: hfq-.

export function HomeFaq({ site }: { site: SiteSettings }) {
  const faq = homeFaq(site);
  return (
    <section className="hfq" id="faq" aria-labelledby="hfq-t">
      <div className="hb2-wrap hfq-grid">
        <div className="hfq-side" data-r>
          <p className="hb2-m-k">Questions</p>
          <h2 id="hfq-t" className="hb2-m-h">
            Questions people <em>ask us</em>
          </h2>
          <p className="hfq-lede">Short, direct answers about what We3vision builds, where we work and how to reach us.</p>
          <SmartLink href="/contact" className="hb2-m-btn">
            Ask us something else
          </SmartLink>
        </div>
        <FaqToggle>
          {faq.map((f, i) => (
            <article key={f.question} className="hfq-item" data-open="false" data-r style={{ "--d": `${(i % 3) * 70}ms` } as CSSProperties}>
              <span className="hfq-n" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="hfq-body">
                <h3>
                  <button type="button" className="hfq-q" aria-expanded="false">
                    {f.question}
                  </button>
                </h3>
                <div className="hfq-a">
                  <div className="hfq-a-in">
                    <p>{f.answer}</p>
                    <SmartLink href={f.href} className="hfq-more">
                      {f.link} <span aria-hidden>→</span>
                    </SmartLink>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </FaqToggle>
      </div>
    </section>
  );
}
