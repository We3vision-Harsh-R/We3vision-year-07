// STYLE SNAPSHOT (paste into the Browser pane's javascript tool, or any DevTools console, on a page of the dev server).
// It freezes all animations at their first frame and stores one short hash per element of the computed styles (about 50 properties, plus ::before/::after).
//   await __snap("a")   first run on the ORIGINAL css (saved in localStorage for this page)
//   await __snap("b")   second run on the original css: elements whose hash differs between a and b are "noise" (JS-driven) and are ignored
//   await __snap("c")   run after a change: returns how many elements differ from a (without the noise) and the first ones
// Viewport must be the same every time (1440x900). No page text or personal data is stored: only hashes.
window.__snap = async (mode) => {
  const P = ["display","position","top","left","width","height","marginTop","marginRight","marginBottom","marginLeft","paddingTop","paddingRight","paddingBottom","paddingLeft","color","backgroundColor","backgroundImage","backgroundSize","backgroundPosition","borderTopWidth","borderTopColor","borderRightWidth","borderBottomWidth","borderLeftWidth","borderTopLeftRadius","borderTopStyle","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","textAlign","textTransform","opacity","transform","filter","backdropFilter","boxShadow","zIndex","overflowX","overflowY","flexDirection","flexWrap","justifyContent","alignItems","gap","gridTemplateColumns","visibility","cursor","animationName","animationDuration","transitionProperty","mixBlendMode","clipPath","maskImage","pointerEvents"];
  const PS = ["content","display","width","height","backgroundColor","backgroundImage","opacity","transform","position","top","left","borderTopWidth","boxShadow"];
  if (innerWidth !== 1440) return `WRONG VIEWPORT ${innerWidth}x${innerHeight}: set 1440x900 first`;
  await new Promise((r) => setTimeout(r, 3500));
  document.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = 0; } catch (e) {} });
  await new Promise((r) => setTimeout(r, 150));
  const fnv = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  const els = [...document.querySelectorAll("body *")].slice(0, 9000);
  const hashes = [], desc = [];
  for (const el of els) {
    const cs = getComputedStyle(el);
    let s = "";
    for (const p of P) s += cs[p] + "|";
    for (const pe of ["::before", "::after"]) { const c = getComputedStyle(el, pe); s += c.content === "none" || c.content === "normal" ? "-" : PS.map((p) => c[p]).join("|"); }
    hashes.push(fnv(s));
    desc.push(el.tagName.toLowerCase() + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
  }
  const key = (m) => "snap:" + m + ":" + location.pathname;
  if (mode === "a" || mode === "b") { localStorage.setItem(key(mode), hashes.join(",")); return `${location.pathname} ${mode}: ${els.length} elements stored`; }
  const a = (localStorage.getItem(key("a")) || "").split(","), b = (localStorage.getItem(key("b")) || "").split(",");
  if (a.length !== hashes.length) return `${location.pathname}: ELEMENT COUNT CHANGED ${a.length} -> ${hashes.length}`;
  const diffs = [];
  let noise = 0;
  for (let i = 0; i < hashes.length; i++) { if (a[i] !== b[i]) { noise++; continue; } if (hashes[i] !== a[i]) diffs.push(i + ":" + desc[i]); }
  return `${location.pathname}: ${diffs.length ? "DIFF " + diffs.length : "same"} of ${hashes.length} elements (noise ignored: ${noise})` + (diffs.length ? "\n  " + diffs.slice(0, 12).join("\n  ") : "");
};
