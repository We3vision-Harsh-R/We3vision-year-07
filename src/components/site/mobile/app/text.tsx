import { Fragment, type ReactNode } from "react";

// Small helpers for the way the CMS stores text (the same conventions the laptop sections use):
//   *word*            a highlighted word
//   line one\nline 2  a heading of two lines
//   one per line      a list in a text box
//   Name | text       a name and its short description

/** the non-empty, trimmed lines of a text box */
export const lines = (s: unknown): string[] => (typeof s === "string" ? s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean) : []);

/** "Name | description" lines */
export const pairs = (s: unknown): { name: string; text: string }[] =>
  lines(s).map((l) => {
    const i = l.indexOf("|");
    return i < 0 ? { name: l, text: "" } : { name: l.slice(0, i).trim(), text: l.slice(i + 1).trim() };
  });

/** paragraphs separated by an empty line */
export const paragraphs = (s: unknown): string[] => (typeof s === "string" ? s.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean) : []);

/** text with *highlighted* words */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <em key={i}>{p}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

/** a heading written on two lines: the later lines take the accent colour (as the second line is brighter on the laptop) */
export function Lines({ text }: { text: string }): ReactNode {
  const l = lines(text);
  return (
    <>
      {l.map((x, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span><Rich text={x} /></span>
        </Fragment>
      ))}
    </>
  );
}

/** a heading as plain text on one line (for the small title of a bar or a list row; the *highlight* marks are dropped) */
export const oneLine = (s: unknown): string => lines(s).join(" ").replace(/\*/g, "");

/** true when the link goes to another website */
export const isExternal = (href: string) => /^https?:\/\//i.test(href);
