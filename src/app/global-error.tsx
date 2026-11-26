"use client";

// The last safety net: shown only when the ROOT of an app crashes (a layout, not a page; a page crash is caught by the error.tsx of its own area:
// (site)/error.tsx, (m)/m/error.tsx, admin/error.tsx). It replaces the whole document, so it brings its own <html> and <body> and no site CSS.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#05030a", color: "#f3eefb", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ margin: "0 0 12px", fontSize: 24, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ margin: "0 0 24px", fontSize: 16, lineHeight: 1.6, opacity: 0.8 }}>It is on our side, not yours. Please try again.</p>
          <button type="button" onClick={reset} style={{ height: 48, padding: "0 28px", border: 0, borderRadius: 999, background: "#a855f7", color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
