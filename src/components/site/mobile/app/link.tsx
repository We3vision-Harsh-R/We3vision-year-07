import Link from "next/link";
import type { ReactNode } from "react";
import { MOBILE_READY } from "@/lib/device";
import { isExternal } from "./text";

/**
 * A link inside an app screen.
 *  - another website  : new tab
 *  - mailto / tel / #anchor : a plain link
 *  - "/" or "/#services"    : back to the launcher (the home screen of the app)
 *  - a page that is an app screen : client navigation (no prefetch: a phone should not download a dozen screens it may never open)
 *  - anything else (articles, projects, jobs: laptop pages for now) : a plain link, which loads that page whole
 */
export function AppLink({ href, className, children, label }: { href: string; className?: string; children: ReactNode; label?: string }) {
  if (!href) return <span className={className}>{children}</span>;
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    );
  }
  if (/^(mailto:|tel:|#)/i.test(href)) {
    return (
      <a href={href} className={className} aria-label={label}>
        {children}
      </a>
    );
  }
  const path = href.split(/[?#]/)[0] || "/";
  const target = path === "/" ? "/" : path.replace(/\/+$/, "");
  if (MOBILE_READY.has(target)) {
    return (
      <Link href={target === "/" ? "/" : href} prefetch={false} className={className} aria-label={label}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} aria-label={label}>
      {children}
    </a>
  );
}
