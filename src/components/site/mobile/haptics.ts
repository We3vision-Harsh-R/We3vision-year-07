// Touch feedback. Android phones vibrate (Vibration API). iPhones have no Vibration API, but iOS 18+ Safari gives a light tap when a switch
// (<input type="checkbox" switch>) is toggled, so a hidden one is toggled instead. It only works inside a touch, which is the case for taps and
// drags; where nothing is supported the call does nothing.
export type Haptic = "light" | "medium" | "select" | "success";

let sw: HTMLInputElement | null = null;

function ensure() {
  if (sw || typeof document === "undefined") return;
  const label = document.createElement("label");
  label.setAttribute("aria-hidden", "true");
  label.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0;pointer-events:none";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.tabIndex = -1;
  label.appendChild(input);
  document.body.appendChild(label);
  sw = input;
}

export function haptic(kind: Haptic = "light"): void {
  try {
    // only as the answer to a real tap: the browser refuses (and logs an error for) a vibration that no tap asked for, e.g. a section that opens by itself
    const ua = typeof navigator !== "undefined" ? (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation : undefined;
    if (ua && !ua.isActive) return;
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(kind === "success" ? [10, 30, 14] : kind === "medium" ? 16 : kind === "select" ? 6 : 9);
      return;
    }
    ensure();
    sw?.click();
  } catch {
    /* no touch feedback on this device */
  }
}
