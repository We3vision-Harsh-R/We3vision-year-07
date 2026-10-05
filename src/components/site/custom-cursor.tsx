"use client";

import { useEffect, useRef } from "react";

// Same structure as the template's cursor: one 8px box centred on the mouse that holds
//  - a soft violet glow (56px circle, blurred, colour-dodge),
//  - the arrow (26px) OR the pointing hand (24px) when over something clickable,
//  - the "You" tag (gradient border) 16px right/below the pointer.
const CLICKABLE = 'a[href], button:not(:disabled), [role="button"], [role="tab"], summary, label[for], select';

/** Custom mouse cursor. Only on devices with a real mouse; elsewhere the normal cursor is untouched. */
export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    // Smooth follow: time-based easing, so it feels the same on 60 Hz and 144 Hz screens.
    const FOLLOW_MS = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 45;
    let x = 0; // real mouse position
    let y = 0;
    let cx = 0; // cursor position
    let cy = 0;
    let last = 0;
    let frame = 0;
    let visible = false;

    const loop = (now: number) => {
      const dt = Math.min(now - (last || now), 64);
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_MS);
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      // the 8px box is centred on the pointer (hence -4)
      root.style.transform = `translate3d(${(cx - 4).toFixed(2)}px, ${(cy - 4).toFixed(2)}px, 0)`;
      if (Math.abs(x - cx) < 0.05 && Math.abs(y - cy) < 0.05) {
        frame = 0; // it has caught up with the mouse: sleep until the mouse moves again
        last = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true; // appear right at the mouse instead of flying in from the corner
        cx = x;
        cy = y;
        root.dataset.visible = "true";
      }
      root.dataset.mode = (e.target as Element | null)?.closest(CLICKABLE) ? "pointer" : "default";
      wake();
    };
    const onLeave = () => {
      visible = false;
      delete root.dataset.visible;
    };
    const onDown = () => (root.dataset.down = "true");
    const onUp = () => delete root.dataset.down;

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const swap = "transition-[opacity,transform] duration-200 ease-out";

  return (
    <div
      ref={rootRef}
      data-mode="default"
      aria-hidden
      className="group pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 opacity-0 transition-opacity duration-200 data-[visible=true]:opacity-100"
    >
      {/* Glow behind the cursor */}
      {/* (a plain soft gradient: a blurred, blended circle that follows the mouse makes the whole page repaint on every move) */}
      <div
        className="absolute -left-24 -top-24 size-52 rounded-full opacity-70"
        style={{ background: "radial-gradient(closest-side, rgba(211,135,255,0.34), rgba(211,135,255,0.12) 55%, transparent)" }}
      />

      {/* Default cursor: arrow */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        className={`absolute left-0 top-0 z-[1] origin-top-left scale-75 opacity-0 ${swap} group-data-[mode=default]:scale-100 group-data-[mode=default]:opacity-100 group-data-[down=true]:!scale-90`}
      >
        <path
          d="M23.596 10.789c.812-.316 1.218-.474 1.332-.697a.658.658 0 0 0-.008-.614c-.12-.22-.53-.368-1.35-.662L2.655 1.308c-.671-.24-1.007-.361-1.226-.285a.658.658 0 0 0-.406.406c-.076.22.044.555.285 1.226L8.816 23.57c.294.82.442 1.23.662 1.35.19.104.42.107.614.008.223-.114.38-.52.697-1.332l3.418-8.79c.061-.159.092-.238.14-.305a.659.659 0 0 1 .154-.154 1.41 1.41 0 0 1 .305-.14l8.79-3.418Z"
          fill="url(#cursor-arrow-fill)"
          stroke="url(#cursor-arrow-stroke)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="cursor-arrow-fill" x1="13" y1="1" x2="13" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#180B23" />
            <stop offset=".755" stopColor="#392149" />
          </linearGradient>
          <linearGradient id="cursor-arrow-stroke" x1="13" y1="1" x2="13" y2="25" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8353A1" />
            <stop offset="1" stopColor="#341D45" />
          </linearGradient>
        </defs>
      </svg>

      {/* Over links and buttons: pointing hand */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute left-0 top-0 z-[1] origin-top-left scale-75 opacity-0 ${swap} group-data-[mode=pointer]:scale-100 group-data-[mode=pointer]:opacity-100 group-data-[down=true]:!scale-90`}
      >
        <g clipPath="url(#cursor-hand-clip)">
          <path
            d="M11.195 21c-1.39-.294-4.541-1.32-6.024-3.082C3.317 15.717 1 13.956 1 13.075c0-.88.463-3.522 3.244-1.761 1.122.71 1.741 1.227 2.06 1.584-1.28-3.09-3.333-8.41-2.987-9.069.463-.88 2.317-3.082 3.244-.88.741 1.76 1.236 3.375 1.39 3.962.773-.587 2.503-1.409 3.244 0 .332.63.49.99.55 1.182.664-1.016 2.094-2.321 3.157-.301.464.44 3.244-.88 3.708.88.463 1.761 1.39 4.403 1.39 5.724 0 1.32-.463 3.082-1.854 3.962-1.112.705-5.097 2.055-6.95 2.642Z"
            fill="url(#cursor-hand-fill)"
          />
          <path
            d="m19.462 8.537-.058-.218a2.443 2.443 0 0 0-3.782-1.349 2.444 2.444 0 0 0-3.64-.86 2.527 2.527 0 0 0-2.788-1.118 2.4 2.4 0 0 0-.796.384l-.758-2.83A2.443 2.443 0 0 0 4.652.82a2.443 2.443 0 0 0-1.726 2.99l1.86 6.94c-.554-.416-1.173-.742-1.812-.824-.713-.092-1.38.12-1.93.615-1.012.91-1.11 2.474-.22 3.488l4.516 5.14c.126.141 3.133 3.428 6.725 2.466l4.19-1.123c3.304-.885 5.268-4.307 4.378-7.63l-1.168-4.344h-.003ZM15.834 18.94l-4.19 1.122c-2.587.694-5.006-1.885-5.094-1.98l-4.504-5.127a.852.852 0 0 1 .085-1.205c.197-.178.393-.243.635-.212.962.123 2.273 1.609 2.873 2.516l.456.692 1.221-.839-2.818-10.52a.814.814 0 0 1 1.57-.42l2.429 9.06.014-.003 1.557-.417.014-.004-1.066-3.98c-.118-.44.168-.944.599-1.06.446-.12.936.143 1.048.562l.421 1.57.73 2.724 1.571-.42-.73-2.724a.814.814 0 0 1 1.572-.421l.463 1.728.463 1.729 1.571-.421-.463-1.729a.814.814 0 0 1 1.572-.42l.3 1.123.004-.001.925 3.44c.658 2.455-.79 4.984-3.228 5.637Z"
            fill="url(#cursor-hand-stroke)"
          />
        </g>
        <defs>
          <linearGradient id="cursor-hand-fill" x1="10.5" y1="2" x2="10.5" y2="27.164" gradientUnits="userSpaceOnUse">
            <stop stopColor="#180B23" />
            <stop offset=".755" stopColor="#392149" />
          </linearGradient>
          <linearGradient id="cursor-hand-stroke" x1="7.041" y1=".18" x2="12.741" y2="21.453" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8353A1" />
            <stop offset="1" stopColor="#341D45" />
          </linearGradient>
          <clipPath id="cursor-hand-clip">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </svg>

      {/* The "You" tag */}
      <div className="absolute left-5 top-5 z-[1] overflow-hidden rounded-md bg-[linear-gradient(180deg,#8353a1,#341d44)] p-px">
        <div className="rounded-[5px] bg-[linear-gradient(180deg,#0d0316,#341d44)] px-1.5 py-1">
          <p className="whitespace-pre font-[family-name:var(--font-inter)] text-sm font-semibold leading-[18px] text-violet">You</p>
        </div>
      </div>
    </div>
  );
}
