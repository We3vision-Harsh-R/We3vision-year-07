// The code the guide "writes" in the office scene (office-builder.tsx): three files with the brand name of the visitor in them, and a tiny
// syntax highlighter that turns a line of code into coloured tokens (tk-* classes in globals.css).

export type CodeLang = "html" | "css" | "js";
export type CodeFile = { name: string; lang: CodeLang; text: string };
export type Token = { t: string; s: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function makeFiles(brandIn: string): CodeFile[] {
  const brand = brandIn.trim() || "Your Brand";
  const b = esc(brand);
  const initial = esc(brand.charAt(0).toUpperCase());
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${b} | Official website</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="nav">
    <a class="logo" href="/"><i>${initial}</i>${b}</a>
    <nav>
      <a href="#services">Services</a>
      <a href="#about">About</a>
      <a href="#work">Work</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="cta">Get started</button>
  </header>

  <section class="hero">
    <h1>Welcome to ${b}</h1>
    <p>Ideas that move your business forward.</p>
    <a class="btn" href="#contact">Start a project</a>
  </section>

  <section id="services" class="cards">
    <article class="card">Strategy</article>
    <article class="card">Design</article>
    <article class="card">Growth</article>
  </section>

  <section id="about" class="split"></section>
  <section id="stats" class="counters"></section>
  <section id="work" class="gallery"></section>
  <section id="contact" class="cta-banner"></section>
  <footer>&copy; ${b}</footer>
  <script src="app.js"></script>
</body>
</html>`;
  const css = `:root {
  --accent: #8b5cf6;
  --ink: #17122b;
  --paper: #ffffff;
  --radius: 18px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font: 16px/1.6 "Poppins", sans-serif;
}

.nav {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 48px;
  backdrop-filter: blur(14px);
}

.logo i {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
}

.hero {
  padding: 120px 48px;
  text-align: center;
  background: radial-gradient(circle at 50% 0, var(--accent), transparent 70%);
}

.hero h1 {
  font-size: 72px;
  letter-spacing: -0.04em;
  animation: rise 0.9s ease both;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  padding: 32px;
  border-radius: var(--radius);
  transition: transform 0.3s;
}

.card:hover { transform: translateY(-6px); }

@keyframes rise {
  from { opacity: 0; transform: translateY(24px); }
}`;
  const js = `// ${brand}: small interactions
const brand = ${JSON.stringify(brand)};
const sections = document.querySelectorAll("section");

function reveal(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in");
    }
  });
}

const observer = new IntersectionObserver(reveal, {
  threshold: 0.2,
});
sections.forEach((s) => observer.observe(s));

function countUp(el, to) {
  let n = 0;
  const step = Math.max(1, Math.round(to / 60));
  const timer = setInterval(() => {
    n = Math.min(to, n + step);
    el.textContent = n.toLocaleString();
    if (n === to) clearInterval(timer);
  }, 24);
}

document.querySelectorAll("[data-count]").forEach((el) => {
  countUp(el, Number(el.dataset.count));
});

document.title = brand + " | Online";
console.log("Welcome to " + brand + ", the site is live!");`;
  return [
    { name: "index.html", lang: "html", text: html },
    { name: "styles.css", lang: "css", text: css },
    { name: "app.js", lang: "js", text: js },
  ];
}

const JS_KW = new Set(["const", "let", "var", "function", "return", "if", "else", "new", "for", "of", "in", "true", "false", "null", "await", "async", "document", "console"]);

/** One line of code → coloured tokens. */
export function tokenize(line: string, lang: CodeLang): Token[] {
  const out: Token[] = [];
  const push = (t: string, s: string) => s && out.push({ t, s });
  if (lang === "html") {
    const re = /(<!--.*?-->)|(<\/?[a-zA-Z][\w-]*)|(\/?>)|([\w:-]+)(?==)|("[^"]*")|(&\w+;)|([^<>"=\s&]+|\s+|=|&)/g;
    let m: RegExpExecArray | null;
    let inTag = false;
    while ((m = re.exec(line))) {
      if (m[1]) push("com", m[1]);
      else if (m[2]) {
        inTag = true;
        push("tag", m[2]);
      } else if (m[3]) {
        inTag = false;
        push("tag", m[3]);
      } else if (m[4] && inTag) push("attr", m[4]);
      else if (m[5]) push("str", m[5]);
      else if (m[6]) push("num", m[6]);
      else push(inTag ? "pun" : "txt", m[0]);
    }
    return out;
  }
  if (lang === "css") {
    const re = /(\/\*.*?\*\/)|(@[\w-]+|--[\w-]+|[.#]?[a-zA-Z_][\w-]*(?=[^;{}]*\{)|:root|\*)|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|rem|em|%|s|ms|vh|vw|fr)?)|("[^"]*")|([{}:;,()])|(\s+|.)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line))) {
      if (m[1]) push("com", m[1]);
      else if (m[2]) push("sel", m[2]);
      else if (m[3]) push("prop", m[3]);
      else if (m[4]) push("num", m[4]);
      else if (m[5]) push("str", m[5]);
      else if (m[6]) push("pun", m[6]);
      else push("txt", m[0]);
    }
    return out;
  }
  const re = /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|(\b[a-zA-Z_$][\w$]*\b)|([{}()[\];,.=>+\-*/<>!&|?:]+)|(\s+|.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1]) push("com", m[1]);
    else if (m[2]) push("str", m[2]);
    else if (m[3]) push("num", m[3]);
    else if (m[4]) {
      const w = m[4];
      const after = line.slice(re.lastIndex).trimStart();
      push(JS_KW.has(w) ? "kw" : after.startsWith("(") ? "fn" : "txt", w);
    } else if (m[5]) push("pun", m[5]);
    else push("txt", m[0]);
  }
  return out;
}

/** The first `n` characters of a line of tokens. */
export function cut(tokens: Token[], n: number): Token[] {
  const out: Token[] = [];
  let left = n;
  for (const k of tokens) {
    if (left <= 0) break;
    out.push(left >= k.s.length ? k : { t: k.t, s: k.s.slice(0, left) });
    left -= k.s.length;
  }
  return out;
}
