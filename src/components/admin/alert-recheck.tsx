"use client";

import { useState, useTransition } from "react";
import { recheckAlert, solveAlert } from "@/actions/alerts";
import type { AlertCheck } from "@/lib/alert-check";
import { btnSecondary } from "@/components/admin/ui";

// "Check again" of Admin > Alerts: tries the failed thing once more. If it works now, a "Solved" button appears right there; if it still
// fails, the reason is shown and the button stays. Alerts that cannot be tested from the server (attacks, errors in a visitor's browser, forms)
// show what to do and a "Mark as solved" button.
export function AlertRecheck({ id }: { id: string }) {
  const [result, setResult] = useState<AlertCheck | null>(null);
  const [pending, start] = useTransition();
  const [failed, setFailed] = useState(false);

  const check = () =>
    start(async () => {
      setFailed(false);
      try {
        setResult(await recheckAlert(id));
      } catch {
        setResult(null);
        setFailed(true);
      }
    });
  const solve = () => start(() => solveAlert(id));

  const tone = result?.state === "fixed" ? "ok" : result?.state === "still" ? "bad" : "note";
  return (
    <div className="ads-recheck">
      <div className="ads-recheck-row">
        <button type="button" className={btnSecondary} onClick={check} disabled={pending}>
          {pending ? "Checking…" : "Check again"}
        </button>
        {result && result.state !== "still" && (
          <button type="button" className="ads-solved-btn" onClick={solve} disabled={pending}>
            {result.state === "fixed" ? "✓ Solved" : "Mark as solved"}
          </button>
        )}
      </div>
      {result && (
        <p className="ads-recheck-note" data-tone={tone} role="status">
          <b>{result.state === "fixed" ? "Looks fixed. " : result.state === "still" ? "Still a problem. " : "Cannot be tested from here. "}</b>
          {result.message}
        </p>
      )}
      {failed && (
        <p className="ads-recheck-note" data-tone="bad" role="status">
          The check could not run (the connection to the server failed). Please try again.
        </p>
      )}
    </div>
  );
}
