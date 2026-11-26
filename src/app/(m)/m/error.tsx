"use client";

// A phone page crashed while it was being drawn: a calm message and a retry, never a blank screen (the phone twin of (site)/error.tsx).
export default function PhoneError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main role="alert" style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
      <div>
        <h1 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 600 }}>This page could not load.</h1>
        <p style={{ margin: "0 0 24px", fontSize: 16, lineHeight: 1.6, opacity: 0.8 }}>It is on our side, not yours. Try again, or go back to the home page.</p>
        <button type="button" onClick={reset} style={{ height: 52, padding: "0 28px", border: 0, borderRadius: 999, background: "#a855f7", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          Try again
        </button>
      </div>
    </main>
  );
}
