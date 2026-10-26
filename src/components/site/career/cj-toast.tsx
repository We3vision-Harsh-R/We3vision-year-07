"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A small message that rises at the bottom of the window and goes by itself after 5 seconds: green for a success (the ticket is confirmed),
// red for an error (a field is not valid, the network failed). Used by the two application forms of the careers pages. Styles: careers.css (.cj-toast).
export type Toast = { kind: "ok" | "err"; text: string; id: number };

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef(0);
  const notify = useCallback((kind: Toast["kind"], text: string) => {
    window.clearTimeout(timer.current);
    setToast({ kind, text, id: Date.now() });
    timer.current = window.setTimeout(() => setToast(null), 5000);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return { toast, notify, close: () => setToast(null) };
}

export function ToastView({ toast, onClose }: { toast: Toast | null; onClose: () => void }) {
  if (!toast) return null;
  return (
    <div key={toast.id} className="cj-toast" data-kind={toast.kind} role={toast.kind === "err" ? "alert" : "status"} aria-live="polite">
      <span aria-hidden>{toast.kind === "ok" ? "✓" : "!"}</span>
      <p>{toast.text}</p>
      <button type="button" onClick={onClose} aria-label="Close this message">
        ×
      </button>
    </div>
  );
}
