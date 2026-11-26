// Shown while an admin page fetches its data (the layout and the menu stay on screen).
export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-md px-6 py-24 text-center text-base opacity-70">
      Loading…
    </div>
  );
}
