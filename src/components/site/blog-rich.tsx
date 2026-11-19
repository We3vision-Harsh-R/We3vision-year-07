import Link from "next/link";
import "@/styles/blog-rich.css";

// A paragraph of an article with small links: [words](/address) becomes a link to a page of this website (only an address that starts with one "/").
// Everything else stays plain text, so nothing a writer types can make an outside or script link. Used for the paragraphs of the articles (laptop and phone).
const LINK = /\[([^\]\n]{1,120})\]\((\/(?!\/)[^)\s]{0,200})\)/g;

export function RichText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <Link key={m.index} href={m[2]} className="brx-a">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
