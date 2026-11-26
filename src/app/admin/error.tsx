"use client";

// A page of the admin panel crashed: the panel stays usable (the menu is part of the layout), only this page shows a calm message and a retry.
export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">This page could not load</h1>
      <p className="mt-3 text-base opacity-80">Something went wrong while opening it. Try again; if it keeps happening, tell the developer.</p>
      <button type="button" onClick={reset} className="mt-6 h-12 rounded-full bg-violet px-7 text-base font-semibold text-void">
        Try again
      </button>
    </div>
  );
}
