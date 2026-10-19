"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SmartLink } from "./smart-link";

/**
 * The logo at the top centre of every page (links home), always on the screen. When a page opens, the icon opens into the white logo with the company
 * name beside the mark (and stays so). As soon as the page is scrolled the name slides into the mark and fades, the logo shrinks and the mark settles in a small glass
 * tile: the horizontal logo turns into the icon (and back when you scroll to the top). The look is in globals.css (.lm-*).
 */
export function LogoMark({ name }: { name: string }) {
  // it starts as the icon: at the top of the page the icon opens into the logo after a moment (and stays), once the page is scrolled it folds back
  const [scrolled, setScrolled] = useState(true);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    const intro = window.setTimeout(on, 500);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.clearTimeout(intro);
      window.removeEventListener("scroll", on);
    };
  }, []);

  return (
    <div className="lm" data-scrolled={scrolled} data-faded={reading && faded}>
      <SmartLink href="/" aria-label={`${name} home`}>
        <Image src="/brand/logo-white.webp" alt="" width={600} height={468} priority unoptimized className="lm-mark" />
        <Image src="/brand/logo-text-white.webp" alt={name} width={700} height={277} priority unoptimized className="lm-text" />
      </SmartLink>
    </div>
  );
}
