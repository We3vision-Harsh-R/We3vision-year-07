// Small CSS block parser shared by the css-split tools. It does NOT change any CSS: it only reads src/app/globals.css and cuts it into
// top-level nodes (rules, at-rules, comments stay attached to the node that follows them) so that the tools can count and move blocks.
//
// node: { kind: "rule" | "at", prelude, text, start, end, children?: node[] , trivia }
//   text  = the exact source text of the node (comments before it included), so joining all node texts gives back the file.

export function parseCss(src) {
  let i = 0;
  const n = src.length;

  // skips a comment / string / parentheses group starting at i and returns the index after it (or i if there is none)
  const skipAtom = (k) => {
    const c = src[k];
    if (c === "/" && src[k + 1] === "*") {
      const e = src.indexOf("*/", k + 2);
      return e === -1 ? n : e + 2;
    }
    if (c === '"' || c === "'") {
      let j = k + 1;
      while (j < n && src[j] !== c) j += src[j] === "\\" ? 2 : 1;
      return j + 1;
    }
    return k;
  };

  // reads statements until the closing brace of the block (or the end of the file)
  function block(base) {
    const out = [];
    while (i < n) {
      // leading trivia: whitespace and comments
      const triviaStart = i;
      for (;;) {
        while (i < n && /\s/.test(src[i])) i++;
        if (src[i] === "/" && src[i + 1] === "*") i = skipAtom(i);
        else break;
      }
      if (i >= n || src[i] === "}") {
        if (i > triviaStart && i >= n) out.push({ kind: "trivia", prelude: "", text: src.slice(triviaStart, i), start: triviaStart, end: i });
        return out;
      }
      const start = i;
      // prelude up to "{" or ";"
      let paren = 0;
      while (i < n) {
        const a = skipAtom(i);
        if (a !== i) { i = a; continue; }
        const c = src[i];
        if (c === "(") paren++;
        else if (c === ")") paren--;
        else if (paren === 0 && (c === "{" || c === ";" || c === "}")) break;
        i++;
      }
      const prelude = src.slice(start, i).trim();
      if (src[i] === ";") {
        i++;
        out.push({ kind: "stmt", prelude, text: src.slice(triviaStart, i), start: triviaStart, end: i, trivia: src.slice(triviaStart, start) });
        continue;
      }
      if (src[i] === "}") { // declaration without semicolon at the end of a block: not expected at top level
        out.push({ kind: "stmt", prelude, text: src.slice(triviaStart, i), start: triviaStart, end: i, trivia: src.slice(triviaStart, start) });
        return out;
      }
      // "{": body
      const bodyStart = i + 1;
      i++;
      const isGroup = /^@(media|supports|layer|container|scope|document)\b/i.test(prelude);
      let children;
      let bodyEnd;
      if (isGroup) {
        children = block();
        bodyEnd = i;
        i++; // closing brace
      } else {
        let depth = 1;
        while (i < n && depth > 0) {
          const a = skipAtom(i);
          if (a !== i) { i = a; continue; }
          if (src[i] === "{") depth++;
          else if (src[i] === "}") depth--;
          i++;
        }
        bodyEnd = i - 1;
      }
      out.push({
        kind: prelude.startsWith("@") ? "at" : "rule",
        prelude,
        text: src.slice(triviaStart, i),
        start: triviaStart,
        end: i,
        trivia: src.slice(triviaStart, start),
        body: src.slice(bodyStart, bodyEnd),
        children,
      });
    }
    return out;
  }
  return block();
}

/** every class name in a selector list (strings and attribute selectors are ignored) */
export function classesOf(selector) {
  const clean = selector.replace(/\[[^\]]*\]/g, "").replace(/(["'])(?:\\.|(?!\1).)*\1/g, "");
  const out = new Set();
  for (const m of clean.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) out.add(m[1]);
  return [...out];
}

/** the family of a class: everything before the first dash ("gfx-hero" -> "gfx"; "sh" -> "sh") */
export const prefixOf = (cls) => cls.replace(/^-/, "").split("-")[0];

/** flattens group at-rules (@media...) into leaf rules, remembering the wrapper chain */
export function leaves(nodes, wrappers = []) {
  const out = [];
  for (const node of nodes) {
    if (node.children) out.push(...leaves(node.children, [...wrappers, node.prelude]));
    else out.push({ ...node, wrappers });
  }
  return out;
}
