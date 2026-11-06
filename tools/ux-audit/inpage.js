// Runs INSIDE the page (run.mjs evaluates `(<this file>)(CFG)`). Scrolls the page and judges every text WHILE IT IS ON SCREEN (scroll-revealed
// text is only readable then), then judges buttons / fields / images. Returns { inv, hits, perf, meta }.
//   inv  = the counts (buttons, links, images, headings, words ...)       hits = { RULE_ID: { n, items: [{ el, txt, d }] } }
// Rule ids and their meaning live in rules.mjs. CFG = { phone, minTarget, minLabel, minPara, css }.
async (CFG) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const hits = {};
  function path(e) {
    const p = [];
    for (let x = e; x && x !== document.body && p.length < 3; x = x.parentElement) {
      let s = x.tagName.toLowerCase();
      if (x.id) s += "#" + x.id;
      const c = typeof x.className === "string" ? x.className.trim().split(/\s+/).filter((k) => k && !/^(lg|md|sm|xl|hover|focus|group):/.test(k)).slice(0, 3).join(".") : "";
      p.unshift(c ? s + "." + c : s);
    }
    return p.join(" > ");
  }
  const hit = (rule, el, d, txt) => {
    const h = (hits[rule] ??= { n: 0, items: [] });
    h.n++;
    if (h.items.length < 40) h.items.push({ el: el ? path(el) : "", txt: (txt ?? (el && el.textContent) ?? "").trim().replace(/\s+/g, " ").slice(0, 40), d: d ?? "" });
  };
  // ---- fixes: for the text / size problems the page also reports a CSS rule that would cure it (tools/ux-audit/fixgen.mjs turns them into a stylesheet) ----
  const TW = /^(text|bg|border|rounded|flex|grid|gap|space|items|justify|font|leading|tracking|opacity|min|max|mt|mb|ml|mr|mx|my|px|py|pt|pb|pl|pr|top|left|right|bottom|inset|overflow|animate|transition|duration|ease|shadow|ring|outline|cursor|select|pointer|object|aspect|order|col|row|self|shrink|grow|basis|sr|w|h|z|p|m|size|line|whitespace|break|underline|uppercase|lowercase|capitalize|truncate|from|to|via|backdrop|blur|drop|scale|rotate|translate|skew|origin|will|content|place|auto|fill|stroke|list|table|columns|divide|decoration|indent|align|float|clear|isolate|mix|is|has|bglow|card|inline|block|hidden|absolute|relative|fixed|sticky|static|not|btn)(-|$)/;
  const own2 = (x) => [...x.classList].filter((c) => /^[a-z][a-z0-9]*-[a-z0-9-]+$/i.test(c) && !TW.test(c)).slice(0, 2);
  // a selector for e: its own project classes, or the nearest classed ancestor (max 4 up) and the exact tag chain below it; "" when there is none
  const cssSel = (e) => {
    const c = own2(e);
    if (c.length) return e.tagName.toLowerCase() + "." + c.join(".");
    const chain = [e.tagName.toLowerCase()];
    for (let x = e.parentElement, i = 0; x && x !== document.body && i < 4; x = x.parentElement, i++) {
      const k = own2(x);
      if (k.length) return x.tagName.toLowerCase() + "." + k.join(".") + " > " + chain.join(" > ");
      chain.unshift(x.tagName.toLowerCase());
    }
    return "";
  };
  const fixes = [], fixSeen = new Set(), manual = [];
  const fix = (rule, e, css, demand, p) => {
    const sel = cssSel(e);
    if (!sel || !e.matches(sel)) { if (manual.length < 60) manual.push({ r: rule, el: path(e), c: css || "hit area" }); return; }
    const k = rule + "|" + sel + "|" + css + "|" + JSON.stringify(p ?? "");
    if (fixSeen.has(k)) return;
    fixSeen.add(k);
    if (fixes.length < 600) fixes.push({ r: rule, s: sel, c: css, m: Math.round(demand * 100) / 100, ...(p ? { p } : {}) });
  };
  // the box a finger / mouse can hit: the element plus an invisible ::after / ::before that sticks out of it (position: absolute inside a positioned element)
  const hitBox = (e, r) => {
    let l = r.left, t = r.top, rt = r.right, b = r.bottom;
    const cs = getComputedStyle(e);
    if (cs.position !== "static") for (const ps of ["::after", "::before"]) {
      const p = getComputedStyle(e, ps);
      if (p.content === "none" || p.position !== "absolute") continue;
      const pl = parseFloat(p.left), pt = parseFloat(p.top), pw = parseFloat(p.width), ph = parseFloat(p.height);
      if ([pl, pt, pw, ph].some(Number.isNaN)) continue;
      const x0 = r.left + (parseFloat(cs.borderLeftWidth) || 0) + pl, y0 = r.top + (parseFloat(cs.borderTopWidth) || 0) + pt;
      l = Math.min(l, x0); t = Math.min(t, y0); rt = Math.max(rt, x0 + pw); b = Math.max(b, y0 + ph);
    }
    return { w: rt - l, h: b - t };
  };
  const toHsl = ({ r, g, b }) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, sat = 0; if (d) { sat = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return { h, s: sat * 100, l: l * 100 }; };
  const fromHsl = (h, sat, l) => { sat /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = sat * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255, a: 1 }; };

  // on the page at all (not display:none / hidden / aria-hidden / zero size). Opacity is NOT looked at: a text that has not been revealed yet is still there.
  // the clipped-away container (the "sr-only" pattern: 1px, overflow hidden / clip) that hides e from a sighted visitor, or null
  const tiny = (e) => {
    for (let x = e, i = 0; x && x !== document.body && i < 8; x = x.parentElement, i++) {
      const c = getComputedStyle(x);
      if (c.overflow !== "visible" || c.clip !== "auto" || c.clipPath !== "none") { const k = x.getBoundingClientRect(); if (k.width <= 2 || k.height <= 2) return x; }
    }
    return null;
  };
  const shown = (e) => {
    if (e.checkVisibility && !e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true })) return false;
    for (let x = e; x; x = x.parentElement) if (x.getAttribute("aria-hidden") === "true" || x.hidden || x.inert) return false;
    const r = e.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && !tiny(e);
  };
  const words = (s) => (s.trim().match(/\S+/g) || []).length;
  const opacityOf = (e) => { let o = 1; for (let x = e; x && x !== document.documentElement; x = x.parentElement) o *= +getComputedStyle(x).opacity; return o; };
  const fixedAnc = (e) => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) if (getComputedStyle(x).position === "fixed") return true; return false; };
  // fixed page furniture (menu pill, logo, a background) is not content; a fixed box that fills the screen is a pinned scene (that IS content; an aria-hidden background is skipped by shown())
  const furniture = (e) => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const c = getComputedStyle(x); if (c.position === "fixed") { const r = x.getBoundingClientRect(); return r.width * r.height < innerWidth * innerHeight * 0.5; } } return false; };
  const stuckOrFixed = (e) => { for (let x = e; x && x !== document.documentElement; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === "fixed" || p === "sticky") return true; } return false; };

  // the faces of a flip card (backface-visibility: hidden) lie on top of each other on purpose
  const backHidden = (e) => { for (let x = e; x && x !== document.body; x = x.parentElement) if (getComputedStyle(x).backfaceVisibility === "hidden") return true; return false; };

  // ---- colours (contrast) ----
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  // the colour behind a text: semi-transparent layers up to the first opaque one; null when a picture / gradient is behind
  const behind = (e) => {
    const layers = [];
    for (let x = e; x; x = x.parentElement) {
      const c = getComputedStyle(x);
      if (c.backgroundImage !== "none") return null;
      const b = parse(c.backgroundColor);
      if (b && b.a > 0) { layers.push(b); if (b.a >= 1) break; }
    }
    let base = layers.length && layers[layers.length - 1].a >= 1 ? layers.pop() : null;
    if (!base) { const rb = parse(getComputedStyle(document.documentElement).backgroundColor); base = rb && rb.a > 0 ? { ...rb, a: 1 } : null; }
    if (!base) return null;
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  };

  // ---- wait for the page to settle, measure the load ----
  { let last = -1, same = 0; for (let i = 0; i < 40 && same < 5; i++) { await sleep(300); const n = document.getElementsByTagName("*").length; same = n === last ? same + 1 : 0; last = n; } }
  const perf = { lcp: 0, cls: 0, dcl: 0, load: 0, kb: 0, bigImg: [] };
  try {
    const nav = performance.getEntriesByType("navigation")[0];
    perf.dcl = Math.round(nav.domContentLoadedEventEnd); perf.load = Math.round(nav.loadEventEnd);
    await new Promise((res) => { try { new PerformanceObserver((l) => { const e = l.getEntries().pop(); if (e) perf.lcp = Math.round(e.startTime); res(); }).observe({ type: "largest-contentful-paint", buffered: true }); } catch { res(); } setTimeout(res, 500); });
    perf.kb = Math.round(performance.getEntriesByType("resource").reduce((s, r) => s + (r.transferSize || 0), 0) / 1024);
    perf.bigImg = performance.getEntriesByType("resource").filter((r) => r.initiatorType === "img" && r.encodedBodySize > 500 * 1024).map((r) => r.name.split("/").pop().slice(0, 50) + " " + Math.round(r.encodedBodySize / 1024) + "KB");
  } catch {}
  let cls = 0, worst = { v: 0, el: "" };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) { cls += e.value; if (e.value > worst.v) { const n = e.sources && e.sources[0] && e.sources[0].node; worst = { v: e.value, el: n && n.nodeType === 1 ? path(n) : "" }; } } }).observe({ type: "layout-shift", buffered: true }); } catch {}

  const W = innerWidth, VH = innerHeight;
  const PLACE = /lorem ipsum|dummy text|\bTODO\b|\bTBD\b|carousel \d|project \d{2}\b|a short description of the project|undefined|\[object|\bNaN\b/i;
  const SKIPTAG = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "OPTION", "CODE", "PRE", "TEXTAREA", "TITLE"]);
  const inv2 = { headings: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 }, paragraphs: 0, words: 0, chars: 0, longestPara: 0 };
  const done = new Set(), seenText = {}, overlapSeen = new Set(), lowC = [];
  const blank = [];

  // the contrast of a text now, or null when it passes / cannot be measured (a picture behind it, invisible)
  function contrastFail(e) {
    const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize), fg = parse(cs.color), bgc = behind(e), op = opacityOf(e);
    if (!fg || !bgc || op <= 0.05) return null;
    const f = over({ ...fg, a: fg.a * op }, bgc), l1 = lum(f), l2 = lum(bgc), ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const need = fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700) ? 3 : 4.5;
    return ratio < need ? { ratio, need } : null;
  }

  // a colour for e that passes: the text colour's hue, lightness moved away from the background until it passes (theme hue rule: hue written as var(--th) + offset)
  function colourFix(e, need) {
    const cs = getComputedStyle(e), fg = parse(cs.color), bgc = behind(e), op = opacityOf(e);
    if (!fg || !bgc) return null;
    const { h, s, l } = toHsl(fg), th = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--th")) || 0, dark = lum(bgc) < 0.35;
    for (let L = Math.round(l); dark ? L <= 98 : L >= 2; L += dark ? 1 : -1) {
      const c = fromHsl(h, s, L), f = over({ ...c, a: op }, bgc), l1 = lum(f), l2 = lum(bgc);
      if ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) >= need + 0.25) {
        const val = s < 6 ? `hsl(0 0% ${L}%)` : `hsl(calc(var(--th) + ${Math.round(((h - th) % 360 + 360) % 360 * 10) / 10}) calc(${Math.round(s)}% * var(--ts)) ${L}%)`;
        return { css: "color:" + val, demand: Math.abs(L - l) };
      }
    }
    return null;
  }

  // judge one text element (called while it is in the window)
  function analyze(e, late) {
    const ownNodes = [...e.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!ownNodes.length || !shown(e) || e.closest("svg, code, pre, [class*='code' i], [class*='mock' i]")) return;
    const cs = getComputedStyle(e), fs = parseFloat(cs.fontSize);
    if (!fs) return;
    const own = ownNodes.map((n) => n.textContent).join(" ").trim().replace(/\s+/g, " ");
    const wc = words(own), r = e.getBoundingClientRect();
    inv2.words += wc; inv2.chars += own.length;
    if (/^H[1-6]$/.test(e.tagName)) inv2.headings[e.tagName.toLowerCase()]++;
    const para = wc >= 5; // five words or more is something to read, less is a label / number / chip
    if (para) { inv2.paragraphs++; inv2.longestPara = Math.max(inv2.longestPara, wc); }
    if (para && fs < CFG.minPara) { hit("UI10", e, `${fs}px body text (min ${CFG.minPara})`, own); fix("UI10", e, `font-size:${CFG.minPara}px`, CFG.minPara - fs); }
    else if (!para && fs < CFG.minLabel) { hit("UI11", e, `${fs}px label (min ${CFG.minLabel})`, own); fix("UI11", e, `font-size:${CFG.minLabel}px`, CFG.minLabel - fs); }
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    if (!/poppins/i.test(fam) && !/mono|courier|consolas|icon|symbol|emoji/i.test(fam)) hit("UI12", e, `font is ${fam}, not Poppins`, own);
    const lh = parseFloat(cs.lineHeight) || fs * 1.2, lines = Math.round(r.height / lh);
    if (para && !/^H[1-6]$/.test(e.tagName) && fs < 28 && lines >= 2 && lh / fs < 1.3) { hit("UI13", e, `line-height ${(lh / fs).toFixed(2)} (< 1.3)`, own); fix("UI13", e, "line-height:1.5", 1.5 - lh / fs); }
    if (para && wc >= 20 && r.width / (fs * 0.5) > 100) { hit("UI14", e, `~${Math.round(r.width / (fs * 0.5))} characters per line (> 100)`, own); fix("UI14", e, "max-inline-size:72ch" + (cs.textAlign === "center" ? ";margin-inline:auto" : ""), 1); }
    if (para && wc > 80) hit("CX03", e, `one paragraph of ${wc} words (hard to scan)`, own);
    if (cs.textAlign === "justify" && para) hit("UI15", e, "justified text (uneven gaps)", own);
    if (cs.textTransform === "uppercase" && wc > 6) { hit("UI16", e, `${wc} words in ALL CAPS`, own); fix("UI16", e, "text-transform:none", 1); }
    if (fs < 18 && +cs.fontWeight <= 200) hit("UI17", e, `thin text (weight ${cs.fontWeight}) at ${fs}px`, own);
    if (PLACE.test(own)) hit("CX04", e, "placeholder / unfinished text", own);
    if (wc >= 4) (seenText[own.toLowerCase()] ??= []).push(e);
    // orphan: a heading / paragraph whose last line is a single short word
    if (/^H[1-6]$|^P$/.test(e.tagName) && lines >= 2 && lines <= 6 && cs.textWrap !== "balance" && cs.textWrap !== "pretty") {
      const rg = document.createRange(); rg.selectNodeContents(e);
      const rows = {};
      for (const q of rg.getClientRects()) { if (q.width <= 1) continue; const k = Math.round(q.top / 4), o = rows[k]; rows[k] = o ? { l: Math.min(o.l, q.left), r: Math.max(o.r, q.right) } : { l: q.left, r: q.right }; }
      const widths = Object.keys(rows).map(Number).sort((a, b) => a - b).map((k) => rows[k].r - rows[k].l);
      const lastTxt = own.split(" ").pop();
      if (widths.length >= 2 && widths[widths.length - 1] < Math.max(...widths) * 0.2 && lastTxt.length < 9) hit("UI18", e, `last line is one short word "${lastTxt}"`, own);
    }
    if (late) return;
    // contrast (index numbers like "01" are decorative; a text that is invisible on purpose is skipped)
    if (!(own.length <= 3 && /^[\d\s/.·-]+$/.test(own)) && contrastFail(e)) lowC.push({ e, own });
    // text cut off by its own box
    if (e.scrollHeight > e.clientHeight + 3 && /hidden|clip/.test(cs.overflowY) && !/^\d/.test(cs.webkitLineClamp || "") && cs.display !== "inline" && e.clientHeight > 0 && !/-webkit-box/.test(cs.display)) hit("UI19", e, `text cut off (${e.scrollHeight} > ${e.clientHeight}px)`, own);
  }

  // one look at the window at scroll position y: judge new texts, find text on top of text, note a blank screen
  function scan(y, late) {
    const hosts = new Set();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode()); ) if (n.parentElement && !SKIPTAG.has(n.parentElement.tagName) && n.textContent.trim()) hosts.add(n.parentElement);
    const inView = [];
    let any = false; // something on this screen that is not fixed page furniture (a pinned scene counts)
    for (const e of hosts) {
      const r = e.getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < VH && r.right > 0 && r.left < W;
      if (!late && !visible) continue;
      if (late && done.has(e)) continue;
      if (!done.has(e)) { done.add(e); analyze(e, late); }
      if (visible && shown(e) && opacityOf(e) > 0.05 && !backHidden(e)) { if (!furniture(e)) any = true; if (!stuckOrFixed(e)) inView.push({ e, r }); }
    }
    if (late) return;
    // text over text, in this window
    const boxes = inView.map((o) => ({ e: o.e, q: [...o.e.getClientRects()].filter((q) => q.width > 1 && q.height > 1) })).filter((o) => o.q.length);
    const clip = (e, q) => { let l = q.left, t = q.top, r = q.right, b = q.bottom; for (let x = e.parentElement; x && x !== document.documentElement; x = x.parentElement) { const c = getComputedStyle(x); if (/(hidden|clip|auto|scroll)/.test(c.overflowX + c.overflowY)) { const k = x.getBoundingClientRect(); l = Math.max(l, k.left); t = Math.max(t, k.top); r = Math.min(r, k.right); b = Math.min(b, k.bottom); } } return r - l > 1 && b - t > 1 ? { l, t, r, b } : null; };
    const cut = boxes.map((o) => ({ e: o.e, q: o.q.map((q) => clip(o.e, q)).filter(Boolean) })).filter((o) => o.q.length);
    for (let i = 0; i < cut.length && i < 400; i++) for (let j = i + 1; j < cut.length && j < 400; j++) {
      const a = cut[i], b = cut[j];
      if (a.e.contains(b.e) || b.e.contains(a.e) || overlapSeen.has(a.e) || overlapSeen.has(b.e)) continue;
      let h = false;
      for (const p of a.q) for (const q of b.q) { const ww = Math.min(p.r, q.r) - Math.max(p.l, q.l), hh = Math.min(p.b, q.b) - Math.max(p.t, q.t); if (ww > 2 && hh > 2 && (ww * hh) / Math.min((p.r - p.l) * (p.b - p.t), (q.r - q.l) * (q.b - q.t)) >= 0.25) h = true; }
      if (h) { overlapSeen.add(a.e); overlapSeen.add(b.e); hit("LAY05", a.e, `overlaps "${b.e.textContent.trim().slice(0, 28)}" [${path(b.e)}] at scroll ${y}px`, a.e.textContent); }
    }
    // a screen with nothing in it (no text, no picture, nothing that is not fixed)
    if (!any) for (const m of document.querySelectorAll("img, video, canvas, svg, iframe, button, input")) { const r = m.getBoundingClientRect(); if (r.width >= 40 && r.height >= 40 && r.bottom > 0 && r.top < VH && !furniture(m) && opacityOf(m) > 0.05 && shown(m)) { any = true; break; } }
    if (!any) blank.push(y);
  }

  // ---- scroll through the page: lazy sections load, reveals play, every text is judged on screen ----
  const step = Math.round(VH * 0.8);
  let maxY = 0;
  for (let y = 0; y <= Math.max(0, document.documentElement.scrollHeight - VH) + step - 1; y += step) {
    window.scrollTo(0, y); await sleep(380);
    maxY = Math.max(maxY, y);
    scan(Math.round(scrollY), false);
    // a text that was still fading in is not a contrast failure: look again after the reveal
    if (lowC.length) { await sleep(900); for (const { e, own } of lowC.splice(0)) { const c = contrastFail(e); if (c) { hit("A11Y10", e, `contrast ${c.ratio.toFixed(2)}:1 (need ${c.need})`, own); const cf = colourFix(e, c.need); if (cf) fix("A11Y10", e, cf.css, cf.demand); else if (manual.length < 60) manual.push({ r: "A11Y10", el: path(e), c: "no colour passes on this background" }); } } }
    if (y > 60 * step) break;
  }
  document.getAnimations().forEach((a) => { try { if (a.effect && a.effect.getTiming().iterations !== Infinity) a.finish(); } catch {} });
  scan(0, true); // anything never on screen (carousels, clipped lists): counted, not judged for colour
  for (const [k, l] of Object.entries(seenText)) if (l.length >= 4) hit("CX05", l[0], `same text ${l.length} times on this page`, k);
  { let run = 0, from = 0; for (let i = 0; i <= blank.length; i++) { if (i < blank.length && (run === 0 || blank[i] - blank[i - 1] <= step + 5)) { if (run === 0) from = blank[i]; run++; } else { if (run >= 2) hit("LAY06", null, `blank screen(s) from y=${from} to y=${blank[i - 1]} (${run} screens with nothing in them)`); run = i < blank.length ? 1 : 0; from = blank[i]; } } }
  window.scrollTo(0, 0); await sleep(500);
  perf.cls = Math.round(cls * 1000) / 1000;

  const DH = document.documentElement.scrollHeight;
  const meta = { title: document.title, lang: document.documentElement.lang, docH: DH, tallVh: Math.round((DH / VH) * 10) / 10 };
  const all = [...document.querySelectorAll("body *")].slice(0, 20000);

  // ---- page-level rules (SEO / a11y / semantic) ----
  const q1 = (s) => document.querySelector(s)?.getAttribute("content") ?? "";
  if (!document.title || document.title.length < 20) hit("SEO01", null, `title ${document.title.length} chars`, document.title);
  else if (document.title.length > 60) hit("SEO02", null, `title ${document.title.length} chars (> 60)`, document.title);
  const desc = q1('meta[name="description"]');
  if (!desc) hit("SEO03", null, "no meta description"); else if (desc.length < 70 || desc.length > 160) hit("SEO04", null, `description ${desc.length} chars (70-160)`, desc);
  if (!document.querySelector('link[rel="canonical"]')) hit("SEO05", null, "no canonical link");
  if (!q1('meta[property="og:image"]')) hit("SEO06", null, "no og:image");
  if (!document.documentElement.lang) hit("A11Y01", null, "<html> has no lang");
  const vp = q1('meta[name="viewport"]');
  if (!vp) hit("MOB01", null, "no viewport meta"); else if (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?(\D|$)/i.test(vp)) hit("A11Y02", null, "zoom is blocked: " + vp);
  const h1s = [...document.querySelectorAll("h1")].filter(shown);
  if (h1s.length === 0) hit("SEM01", null, "no visible <h1>"); else if (h1s.length > 1) hit("SEM02", h1s[1], `${h1s.length} visible <h1>`);
  if (document.querySelectorAll("main").length !== 1) hit("SEM03", null, `${document.querySelectorAll("main").length} <main> landmarks`);
  if (!document.querySelector("nav, [role=navigation]")) hit("SEM04", null, "no <nav> landmark");
  if (![...document.querySelectorAll("a[href^='#']")].some((a) => /skip|skp/i.test(a.className + a.textContent))) hit("A11Y03", null, "no skip-to-content link");
  { let prev = 0; for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) { if (!shown(h)) continue; const l = +h.tagName[1]; if (!h.textContent.trim()) hit("SEM05", h, "empty heading"); else if (prev && l > prev + 1) hit("SEM06", h, `h${prev} -> h${l} (level skipped)`); prev = l; } }
  { const ids = {}; for (const e of document.querySelectorAll("[id]")) (ids[e.id] ??= []).push(e); for (const [id, l] of Object.entries(ids)) if (l.length > 1) hit("SEM07", l[1], `id "${id}" used ${l.length} times`); }
  for (const f of document.querySelectorAll("iframe")) if (shown(f) && !f.title && !f.getAttribute("aria-label")) hit("A11Y04", f, "iframe has no title");
  for (const e of document.querySelectorAll("[tabindex]")) if (+e.getAttribute("tabindex") > 0) hit("A11Y05", e, "tabindex > 0");
  for (const e of document.querySelectorAll('[aria-hidden="true"]')) { const f = e.matches("a[href],button,input,select,textarea,[tabindex]") ? e : e.querySelector("a[href],button,input,select,textarea,[tabindex]:not([tabindex='-1'])"); if (f && f.getAttribute("tabindex") !== "-1" && getComputedStyle(f).display !== "none") hit("A11Y06", f, "focusable inside aria-hidden"); }
  for (const v of document.querySelectorAll("video")) if (shown(v) && v.autoplay && !v.muted) hit("A11Y07", v, "autoplay video with sound");

  // ---- interactive elements ----
  const IX = "a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [role=switch], [role=menuitem], summary";
  { const boxes = new Map(); for (const e of document.querySelectorAll(IX)) { if (e.tabIndex < 0 || e.disabled || getComputedStyle(e).display === "none") continue; const t = tiny(e); if (t) boxes.set(t, (boxes.get(t) ?? 0) + 1); } for (const [t, n] of boxes) if (n >= 1) hit("A11Y14", t, `${n} link/button tab stop(s) inside a box the visitor cannot see (keyboard focus disappears)`); }
  const ix = [...document.querySelectorAll(IX)].filter(shown);
  const nameOf = (e) => (e.getAttribute("aria-label") || (e.getAttribute("aria-labelledby") && [...e.getAttribute("aria-labelledby").split(" ")].map((i) => document.getElementById(i)?.textContent || "").join(" ")) || e.innerText || e.textContent || e.title || e.value || e.querySelector("img[alt]")?.alt || e.querySelector("svg title")?.textContent || "").trim().replace(/\s+/g, " ");
  const btnLabels = [], linkNames = {}, aboveFold = [];
  const inv = { buttons: 0, buttonLinks: 0, links: 0, linksExternal: 0, inputs: 0, forms: document.forms.length };
  for (const e of ix) {
    const tag = e.tagName.toLowerCase(), type = (e.getAttribute("type") || "").toLowerCase(), role = e.getAttribute("role");
    const isField = ["input", "select", "textarea"].includes(tag) && !["button", "submit", "reset", "image"].includes(type);
    const cs = getComputedStyle(e), r = e.getBoundingClientRect();
    const isBtn = tag === "button" || ["button", "submit", "reset"].includes(type) || role === "button" || role === "switch" || role === "tab";
    const bg = cs.backgroundColor, hasBg = bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    const looksBtn = tag === "a" && ((hasBg || cs.backgroundImage !== "none" || parseFloat(cs.borderTopWidth) >= 1) && parseFloat(cs.paddingLeft) >= 10 && r.height >= 28);
    const name = nameOf(e);
    if (isField) inv.inputs++; else if (isBtn) inv.buttons++; else if (looksBtn) inv.buttonLinks++; else if (tag === "a") { inv.links++; if (e.host && e.host !== location.host) inv.linksExternal++; }
    if (isBtn || looksBtn) btnLabels.push({ label: name.slice(0, 50), words: words(name), chars: name.length, kind: isBtn ? "button" : "link-button", y: Math.round(r.top + scrollY) });
    if (!isField && !name) hit("UX01", e, "button/link has no accessible name");
    if (isField) continue;
    const inline = tag === "a" && cs.display === "inline" && e.closest("p, li, span, h1, h2, h3, h4, h5, h6, dd, td") && words(e.parentElement?.textContent || "") > words(name) + 3;
    const hb = hitBox(e, r), N = CFG.minTarget;
    if (!inline && Math.min(hb.w, hb.h) < N - 0.6 && !(e.offsetHeight >= N && e.offsetWidth >= N)) { // (a picker row that a 3D transform shrinks is a full-size row)
      hit("UX02", e, `${Math.round(hb.w)}x${Math.round(hb.h)}px (min ${N})`, name);
      const free = ["::after", "::before"].find((ps) => getComputedStyle(e, ps).content === "none");
      if (Math.min(hb.w, hb.h) < N / 2) { if (manual.length < 60) manual.push({ r: "UX02", el: path(e), c: `tiny target ${Math.round(hb.w)}x${Math.round(hb.h)}px: needs a bigger hit area by hand` }); }
      else if (!free || cs.overflowX !== "visible" || cs.overflowY !== "visible") { if (manual.length < 60) manual.push({ r: "UX02", el: path(e), c: `${Math.round(hb.w)}x${Math.round(hb.h)}px: no free ::after or the element clips its content` }); }
      else fix("UX02", e, "", N - Math.min(hb.w, hb.h), { ps: free, dx: N > hb.w ? Math.ceil((N - hb.w) / 2) + 1 : 0, dy: N > hb.h ? Math.ceil((N - hb.h) / 2) + 1 : 0, rel: cs.position === "static" });
    }
    if (tag === "a") {
      const h = e.getAttribute("href") || "";
      if (h === "#" || /^javascript:/i.test(h)) hit("UX03", e, `href="${h}" goes nowhere`, name);
      if (/^(click here|read more|learn more|more|here|link|view|go|details|know more|explore)$/i.test(name)) (linkNames[name.toLowerCase()] ??= []).push(e);
      if (e.target === "_blank" && !/noopener/.test(e.rel)) hit("UX04", e, "target=_blank without rel=noopener", name);
    }
    if (words(name) > 7 && (isBtn || looksBtn) && e.children.length < 2 && !e.hasAttribute("aria-expanded") && !e.hasAttribute("aria-controls") && role !== "tab" && !e.closest("[role=tablist], h2, h3, h4, summary")) hit("UX05", e, `button label ${words(name)} words`, name);
    const up = e.parentElement?.closest("a[href], button");
    if (up && up !== e) hit("UX06", e, "interactive inside interactive", name);
    if (e.scrollWidth > e.clientWidth + 3 && /hidden|clip/.test(cs.overflowX) && e.clientWidth > 0) hit("UX07", e, `label clipped (${e.scrollWidth} > ${e.clientWidth})`, name);
    if (r.top < VH && r.bottom > 0 && (isBtn || looksBtn) && !e.closest("nav, header, footer, [class*='menu'], [class*='nav'], [class*='tp-']")) aboveFold.push(e); // a fixed bottom call-to-action bar counts
  }
  for (const [n, l] of Object.entries(linkNames)) { if (l.length > 1 && new Set(l.map((e) => e.href)).size > 1) hit("UX08", l[0], `"${n}" is the label of ${l.length} different links`, n); else hit("UX08", l[0], `vague link label "${n}"`, n); }
  if (!aboveFold.length) hit("CX01", null, "no button / call to action in the first screen"); else if (aboveFold.length > 6) hit("CX02", aboveFold[0], `${aboveFold.length} buttons in the first screen (choice overload)`);
  if (CFG.phone) {
    // crowded touch targets: two small targets closer than 8px
    const t = ix.filter((e) => !["input", "select", "textarea"].includes(e.tagName.toLowerCase())).map((e) => { const r = e.getBoundingClientRect(), hb = hitBox(e, r); return { e, r, hb }; }).filter((o) => Math.min(o.hb.w, o.hb.h) < 44 && o.r.width > 0).slice(0, 400);
    for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) {
      const a = t[i], b = t[j];
      if (a.e.contains(b.e) || b.e.contains(a.e) || Math.abs(a.r.top - b.r.top) > 300) continue;
      const dx = Math.max(a.r.left - b.r.right, b.r.left - a.r.right, 0), dy = Math.max(a.r.top - b.r.bottom, b.r.top - a.r.bottom, 0);
      if (Math.hypot(dx, dy) < 8) { hit("MOB02", a.e, "touch target < 8px from the next one", nameOf(a.e)); break; }
    }
  }

  // ---- forms ----
  for (const e of document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]), textarea, select")) {
    if (!shown(e)) continue;
    const labelled = e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || e.title || (e.id && document.querySelector(`label[for="${CSS.escape(e.id)}"]`)) || e.closest("label");
    if (!labelled) hit(e.placeholder ? "FORM01" : "FORM02", e, e.placeholder ? `only a placeholder: "${e.placeholder}"` : "field has no label at all", e.placeholder);
    const hint = (e.name + " " + e.placeholder + " " + e.id + " " + (e.getAttribute("aria-label") || "")).toLowerCase(), type = (e.type || "").toLowerCase();
    if (/e-?mail/.test(hint) && type !== "email") hit("FORM03", e, `looks like an e-mail field but type="${type}"`, e.placeholder);
    if (/phone|mobile|whatsapp|contact no/.test(hint) && type !== "tel") hit("FORM03", e, `looks like a phone field but type="${type}"`, e.placeholder);
    if (/name|e-?mail|phone|mobile/.test(hint) && !e.autocomplete) hit("FORM04", e, "no autocomplete attribute", e.placeholder);
    if (CFG.phone && parseFloat(getComputedStyle(e).fontSize) < 16) hit("MOB03", e, `field text ${getComputedStyle(e).fontSize} (< 16px: iPhone zooms the page on focus)`, e.placeholder);
  }
  for (const f of document.forms) if (shown(f) && !f.querySelector("[type=submit], button:not([type=button])")) hit("FORM05", f, "form has no submit button");

  // ---- images / media ----
  const dpr = devicePixelRatio || 1;
  let nImg = 0;
  for (const im of document.images) {
    if (!shown(im)) continue;
    nImg++;
    const r = im.getBoundingClientRect();
    if (!im.hasAttribute("alt")) hit("A11Y08", im, "image has no alt attribute", im.getAttribute("src")?.split("/").pop());
    else if (/\.(png|jpe?g|webp|svg|gif|avif)$|^(img|image|dsc|screenshot)[-_ ]?\d*$/i.test(im.alt)) hit("A11Y09", im, `alt looks like a file name: "${im.alt}"`);
    if (im.complete && im.naturalWidth === 0 && im.getAttribute("src")) hit("UI01", im, "image did not load", im.getAttribute("src")?.slice(0, 60));
    if (im.naturalWidth && r.width >= 80) {
      if (r.width * dpr > im.naturalWidth * 1.3 && !/\.svg(\?|$)/i.test(im.currentSrc)) hit("UI02", im, `shown ${Math.round(r.width * dpr)}px wide, file is ${im.naturalWidth}px (blurry)`);
      if (Math.abs(im.naturalWidth / im.naturalHeight / (r.width / r.height) - 1) > 0.08 && getComputedStyle(im).objectFit === "fill") hit("UI03", im, `stretched: file ${im.naturalWidth}x${im.naturalHeight}, shown ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }
  for (const b of perf.bigImg.slice(0, 10)) hit("PERF04", null, "image over 500KB: " + b);
  if (perf.lcp > 4000) hit("PERF01", null, `LCP ${perf.lcp} ms (> 4000)`); else if (perf.lcp > 2500) hit("PERF02", null, `LCP ${perf.lcp} ms (> 2500)`);
  if (perf.cls > 0.1) hit("PERF03", null, `layout shift ${perf.cls} (> 0.1); the biggest jump: ${worst.el || "unknown"}`);
  if (perf.kb > 4096) hit("PERF05", null, `${perf.kb} KB downloaded on load (> 4 MB)`);

  // ---- layout ----
  const sw = document.documentElement.scrollWidth;
  const clipped = (e) => { for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const c = getComputedStyle(x); if (/(hidden|clip|auto|scroll)/.test(c.overflowX)) return true; if (c.position === "fixed") return false; } return false; };
  if (sw > W + 1) {
    hit("LAY01", null, `page is ${sw}px wide in a ${W}px window (sideways scroll)`);
    let n = 0; for (const e of all) { const r = e.getBoundingClientRect(); if (r.right > W + 2 && r.width > 0 && !clipped(e) && getComputedStyle(e).position !== "fixed" && shown(e) && n++ < 12) hit("LAY02", e, `sticks out: right edge at ${Math.round(r.right)}px`); }
  }
  // fixed pieces: how much of the screen they cover, and which buttons they hide
  const fixed = all.filter((e) => { const c = getComputedStyle(e); return c.position === "fixed" && c.pointerEvents !== "none" && shown(e) && opacityOf(e) > 0.05; }).map((e) => ({ e, r: e.getBoundingClientRect() })).filter((o) => o.r.width * o.r.height > 400);
  for (const o of fixed) { const area = (Math.min(o.r.right, W) - Math.max(o.r.left, 0)) * (Math.min(o.r.bottom, VH) - Math.max(o.r.top, 0)); if (area > W * VH * (CFG.phone ? 0.2 : 0.25)) hit("LAY03", o.e, `fixed element covers ${Math.round((area / (W * VH)) * 100)}% of the screen`); }
  const spots = [...new Set([0, 1].map((f) => Math.round(f * Math.max(0, DH - VH))))];
  const guarded = [...document.querySelectorAll("a[href], button, input, textarea, select")].filter((e) => shown(e) && !fixed.some((o) => o.e.contains(e)) && !stuckOrFixed(e));
  const coveredSeen = new Set();
  for (const y of spots) {
    window.scrollTo(0, y); await sleep(250);
    for (const o of fixed) {
      const fr = o.e.getBoundingClientRect();
      for (const e of guarded) {
        if (coveredSeen.has(e)) continue;
        const r = e.getBoundingClientRect();
        if (r.bottom < 0 || r.top > VH || opacityOf(e) < 0.05) continue;
        const w = Math.min(r.right, fr.right) - Math.max(r.left, fr.left), h = Math.min(r.bottom, fr.bottom) - Math.max(r.top, fr.top);
        if (w > 4 && h > 4 && (w * h) / (r.width * r.height) > 0.4) { coveredSeen.add(e); hit("LAY04", e, `button / field is under the fixed "${path(o.e).split(" > ").pop()}" at scroll ${y}px`, nameOf(e)); }
      }
    }
  }
  window.scrollTo(0, 0);

  // ---- site-wide CSS facts (run once per viewport) ----
  if (CFG.css) {
    const f = { focusVisible: 0, outlineNone: 0, reduced: 0, transAll: 0, vh100: 0, smooth: 0 };
    const walk = (rules) => { for (const r of rules) { try { if (r.cssRules && !r.selectorText) { if (/prefers-reduced-motion/.test(r.conditionText || r.media?.mediaText || "")) f.reduced++; walk(r.cssRules); continue; } if (!r.selectorText) continue; const s = r.style; if (/:focus-visible/.test(r.selectorText)) f.focusVisible++; if ((s.outlineStyle === "none" || s.outline === "none" || s.outline === "0" || s.outlineWidth === "0px") && !/:focus-visible/.test(r.selectorText)) f.outlineNone++; if (/(^|,)\s*all\b/.test(s.transition)) f.transAll++; if (/100vh/.test(s.height + s.minHeight)) f.vh100++; if (s.scrollBehavior === "smooth") f.smooth++; } catch {} } };
    for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch {} }
    if (!f.focusVisible) hit("A11Y11", null, "no :focus-visible style anywhere"); if (!f.reduced) hit("A11Y12", null, "no prefers-reduced-motion rule anywhere");
    if (f.outlineNone > 5) hit("A11Y13", null, `${f.outlineNone} rules remove the outline (check each has a focus style)`);
    if (f.transAll > 3) hit("PERF06", null, `${f.transAll} rules use "transition: all"`);
    if (CFG.phone && f.vh100) hit("MOB04", null, `${f.vh100} rules use height: 100vh (use 100svh/dvh: the iPhone address bar covers the bottom)`);
    meta.css = f;
  }

  // ---- inventory ----
  const labelCount = {};
  for (const b of btnLabels) labelCount[b.label.toLowerCase()] = (labelCount[b.label.toLowerCase()] ?? 0) + 1;
  Object.assign(inv, inv2, {
    listItems: document.querySelectorAll("li").length, images: nImg, svg: [...document.querySelectorAll("svg")].filter(shown).length, canvas: [...document.querySelectorAll("canvas")].filter(shown).length,
    video: [...document.querySelectorAll("video")].filter(shown).length, iframes: [...document.querySelectorAll("iframe")].filter(shown).length,
    buttonLabels: btnLabels.slice(0, 80), buttonWords: btnLabels.reduce((s, b) => s + b.words, 0), buttonChars: btnLabels.reduce((s, b) => s + b.chars, 0),
    duplicateButtonLabels: Object.entries(labelCount).filter(([, n]) => n > 2).map(([l, n]) => l + " x" + n),
    avgWordsPerPara: inv2.paragraphs ? Math.round(inv2.words / inv2.paragraphs) : 0,
  });
  return { inv, hits, perf, meta, fixes, manual };
}
