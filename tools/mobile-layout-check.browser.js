// In-browser layout check of the mobile app pages at any width. Paste it into the console (or the browser tool) of a page of the running site
// (use `next start` for speed), then:
//
//   window.__done = false; window.__all = {};
//   (async () => { for (const W of [320, 390, 430, 744, 820, 1024]) { const r = await __chk(W, PATHS); __all[W] = Object.entries(r).filter(([, i]) => i.length); } __done = true; })();
//
// PATHS = the public paths of src/lib/mobile-ready.generated.ts (e.g. ["/", "/seo", ...]); "/" is the launcher (/m). Each page is opened in a hidden iframe
// of width W and checked for: sideways scroll of the page, elements outside the screen (not inside a scroll area), text wider than its box, and siblings
// that overlap by more than 30 %. Last run (2026-10-17): 38 pages x 6 widths, 0 problems (one 4 px word-wrap in about, fixed).
window.__chk = async (W, paths) => {
  const out = {};
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const p of paths) {
    const f = document.createElement("iframe");
    f.style.cssText = `position:fixed;left:0;top:0;width:${W}px;height:900px;border:0;opacity:0;pointer-events:none`;
    f.src = "/m" + (p === "/" ? "" : p);
    document.body.appendChild(f);
    await new Promise((r) => { f.onload = r; setTimeout(r, 8000); });
    await sleep(700);
    const d = f.contentDocument, w = f.contentWindow;
    const issues = [];
    try {
      const de = d.documentElement;
      if (de.scrollWidth > W + 1) issues.push(`page-scroll-x ${de.scrollWidth}>${W}`);
      const inScroller = (el) => { for (let a = el.parentElement; a && a !== d.body && a !== de; a = a.parentElement) { const s = w.getComputedStyle(a); if (s.overflowX !== "visible" && a.scrollWidth > a.clientWidth + 1) return true; } return false; };
      const seen = new Set();
      for (const el of d.body.querySelectorAll("*")) {
        const s = w.getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden" || s.position === "fixed" || (el.className + "").includes("-hp")) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if ((r.right > W + 2 || r.left < -2) && !inScroller(el)) {
          const key = (el.className && String(el.className).split(" ")[0]) || el.tagName;
          if (!seen.has(key)) { seen.add(key); issues.push(`out-of-view ${el.tagName.toLowerCase()}.${key} L${Math.round(r.left)} R${Math.round(r.right)}`); }
        }
        if (s.overflowX === "visible" && el.scrollWidth > el.clientWidth + 2 && el.children.length === 0 && el.textContent.trim() && s.display !== "inline") {
          const key = "txt-" + ((el.className && String(el.className).split(" ")[0]) || el.tagName);
          if (!seen.has(key)) { seen.add(key); issues.push(`text-overflow ${el.tagName.toLowerCase()}.${key.slice(4)} ${el.scrollWidth}>${el.clientWidth}`); }
        }
      }
      for (const par of d.body.querySelectorAll("*")) {
        const ps = w.getComputedStyle(par);
        if (!(ps.display.includes("grid") || ps.display.includes("flex") || ps.display === "block")) continue;
        const kids = [...par.children].filter((k) => { const s = w.getComputedStyle(k); return s.position !== "absolute" && s.position !== "fixed" && s.display !== "none" && s.display !== "contents" && s.display !== "inline" && k.tagName !== "BR" && k.tagName !== "WBR" && s.gridArea === "auto / auto / auto / auto"; });
        if (kids.length < 2 || kids.length > 40) continue;
        const rs = kids.map((k) => k.getBoundingClientRect());
        for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
          const a = rs[i], b = rs[j];
          if (a.width < 8 || a.height < 8 || b.width < 8 || b.height < 8) continue;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 6 && oy > 6) {
            const frac = (ox * oy) / Math.min(a.width * a.height, b.width * b.height);
            if (frac > 0.3) { const key = "ov-" + (par.className + "").split(" ")[0] + "-" + i; if (!seen.has(key)) { seen.add(key); issues.push(`overlap in ${(par.className + "").split(" ")[0] || par.tagName} kids ${i}/${j} ${Math.round(frac * 100)}%`); } }
          }
        }
      }
    } catch (e) { issues.push("check-error " + e.message); }
    out[p] = issues;
    f.remove();
  }
  return out;
};
