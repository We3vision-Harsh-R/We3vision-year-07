// One JSON-LD block (schema.org structured data) for a page. No imports on purpose: client components (the FAQ of the marketing pages) use it too.
// "<" is escaped so a text can never close the script tag.

type Node = Record<string, unknown>;

export function JsonLd({ graph }: { graph: Node[] }) {
  const json = { "@context": "https://schema.org", "@graph": graph };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />;
}

/** FAQPage of the questions that are on the page (the answers are the page's own text). Pass either {question, answer} or {q, a}. */
export function FaqJsonLd({ items, url }: { items: ({ question: string; answer: string } | { q: string; a: string })[]; url?: string }) {
  if (!items.length) return null;
  const node: Node = {
    "@type": "FAQPage",
    ...(url ? { "@id": `${url}#faq` } : {}),
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: "question" in it ? it.question : it.q,
      acceptedAnswer: { "@type": "Answer", text: "answer" in it ? it.answer : it.a },
    })),
  };
  return <JsonLd graph={[node]} />;
}
