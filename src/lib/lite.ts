// LIGHT MODE (one switch for weak laptops): <html data-lite="1"> turns off the expensive effects (backdrop blur, text glow, endless background loops,
// snow, custom cursor, smooth-scroll lib); the CSS is the `lt-` block at the end of globals.css. Same design otherwise.
// Set BEFORE the first paint by LITE_BOOT (low CPU cores / memory, data saver, reduced motion) or later when frames are measured to be slow.
// Owner override: localStorage "we3.lite" = "1" (always light) or "0" (never light). A measured slow device is remembered for the tab session only.
export const LITE_BOOT = `(function(){try{var n=navigator,c=n.connection||{},s=localStorage.getItem("we3.lite")||sessionStorage.getItem("we3.lite");if(s==="1"||(s!=="0"&&((n.hardwareConcurrency||8)<=4||(n.deviceMemory||8)<=4||c.saveData||matchMedia("(prefers-reduced-motion: reduce)").matches)))document.documentElement.dataset.lite="1"}catch(e){}})();`;

export const isLite = () => typeof document !== "undefined" && document.documentElement.dataset.lite === "1";

/** After 4 s of calm, times 60 frames; median frame over 40 ms (< 25 fps) = a weak device: switch light mode on and call `onLite`. Returns a cancel function. */
export function sniffSlow(onLite: () => void) {
  if (isLite()) return () => {};
  let raf = 0;
  let last = 0;
  const dts: number[] = [];
  const frame = (now: number) => {
    const dt = now - last;
    if (last && dt < 500) dts.push(dt); // a hidden tab leaves a huge gap: ignore it
    last = now;
    if (dts.length < 60) return void (raf = requestAnimationFrame(frame));
    if (dts.sort((a, b) => a - b)[30] > 40) {
      document.documentElement.dataset.lite = "1";
      try {
        sessionStorage.setItem("we3.lite", "1");
      } catch {}
      onLite();
    }
  };
  const t = window.setTimeout(() => (raf = requestAnimationFrame(frame)), 4000);
  return () => {
    clearTimeout(t);
    cancelAnimationFrame(raf);
  };
}

/** a hidden tab: html[data-hid="1"] pauses every CSS animation (globals.css `lt-`) */
export function watchHidden() {
  const set = () => (document.documentElement.dataset.hid = document.hidden ? "1" : "0");
  document.addEventListener("visibilitychange", set);
  return () => document.removeEventListener("visibilitychange", set);
}
