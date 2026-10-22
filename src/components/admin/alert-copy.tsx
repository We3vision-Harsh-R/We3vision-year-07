"use client";

import { useState } from "react";
import { buildAlertsReport } from "@/lib/alert-report";
import type { SiteAlert } from "@/lib/alerts";

// "Copy for AI" button of Admin > Alerts: copies a ready prompt (what happened, where, the stack trace, the tech of this website and what to
// answer) for ChatGPT / Claude / Gemini. If the browser blocks copying, the text is shown in a box to copy by hand.
type Props = { alerts: SiteAlert[]; label: string; className: string };

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CopyAlert({ alerts, label, className }: Props) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  const [text, setText] = useState("");

  async function onCopy() {
    const report = buildAlertsReport(alerts, location.origin);
    setText(report);
    const ok = await copyText(report);
    setState(ok ? "done" : "fail");
    if (ok) setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="ads-copy">
      <button type="button" className={className} onClick={onCopy} aria-live="polite">
        {state === "done" ? "Copied ✓ now paste it in your AI" : label}
      </button>
      {state === "fail" && (
        <label className="ads-copy-box">
          <span>Your browser blocked copying. Select all of this text and copy it yourself:</span>
          <textarea readOnly value={text} rows={8} onFocus={(e) => e.currentTarget.select()} />
        </label>
      )}
    </div>
  );
}
