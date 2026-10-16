import type { PageStatus } from "@/lib/cms/queries";

const styles: Record<PageStatus, { text: string; cls: string }> = {
  demo: { text: "Demo content", cls: "bg-zinc-100 text-zinc-600" },
  published: { text: "Published", cls: "bg-emerald-100 text-emerald-800" },
  changes: { text: "Unpublished changes", cls: "bg-amber-100 text-amber-800" },
};

export function StatusBadge({ status }: { status: PageStatus }) {
  const s = styles[status];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>{s.text}</span>;
}
