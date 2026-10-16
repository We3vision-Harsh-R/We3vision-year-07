// Shared admin Tailwind class strings (kept as constants so the admin looks consistent without a component library).
export const inputClass =
  "mt-1.5 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand focus:ring-2 focus:ring-brand/20";

export const labelClass = "block text-sm font-medium text-zinc-700";

const btn = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
export const btnPrimary = `${btn} bg-brand text-white hover:bg-brand/90`;
export const btnSecondary = `${btn} border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50`;
export const btnDanger = `${btn} border border-rose-200 bg-white text-rose-600 hover:bg-rose-50`;
export const btnIcon =
  "grid size-8 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40";

export const card = "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6";
