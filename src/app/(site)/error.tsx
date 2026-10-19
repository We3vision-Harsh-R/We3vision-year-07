"use client";

import { NotFoundView } from "@/components/site/not-found-view";

// Shown inside the site layout when a page crashes while it is being drawn: a calm message and a retry, never a blank screen.
export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <NotFoundView code="Oops" chip="Something went wrong" title="This page could not load." text="It is on our side, not yours. Try again, or go back to the home page.">
      <button type="button" className="nf-btn nf-btn-ghost" onClick={reset}>
        Try again
      </button>
    </NotFoundView>
  );
}
