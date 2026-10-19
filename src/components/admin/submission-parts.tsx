import type { ContentTypeDef, DraftData, FieldDef } from "@/lib/ai-content/types";
import { STATUS_LABEL, type SubmissionStatus } from "@/lib/ai-content/server/submissions";

// Small server-rendered pieces of the AI Submissions screens: the status badge and the field-by-field view of a draft.

const BADGE: Record<SubmissionStatus, string> = {
  pending_review: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-700",
  draft: "bg-sky-100 text-sky-800",
  publishing: "bg-zinc-200 text-zinc-700",
};

export function SubmissionBadge({ status }: { status: string }) {
  const s = (status in BADGE ? status : "publishing") as SubmissionStatus;
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE[s]}`}>{STATUS_LABEL[s] ?? status}</span>;
}

function Value({ field, value }: { field: FieldDef; value: unknown }) {
  if (field.kind === "boolean") return <>{value ? "Yes" : "No"}</>;
  if (field.kind === "list") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return items.length ? (
      <ul className="list-disc space-y-0.5 pl-5">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    ) : (
      <span className="text-zinc-400">(empty)</span>
    );
  }
  if (field.kind === "qa") {
    const items = Array.isArray(value) ? (value as { question: string; answer: string }[]) : [];
    return items.length ? (
      <ul className="space-y-2">
        {items.map((q, i) => (
          <li key={i}>
            <b>{q.question}</b>
            <br />
            {q.answer}
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-zinc-400">(empty)</span>
    );
  }
  const text = value === undefined || value === null || value === "" ? "" : String(value);
  if (!text) return <span className="text-zinc-400">(empty)</span>;
  return <span className={field.kind === "markup" || field.kind === "longtext" ? "block max-h-72 overflow-auto whitespace-pre-wrap" : "break-words"}>{text}</span>;
}

/** Every field of the draft with its label, exactly the fields of the admin form. */
export function FieldList({ def, data }: { def: ContentTypeDef; data: DraftData }) {
  return (
    <dl className="divide-y divide-zinc-100">
      {def.fields.map((f) => (
        <div key={f.name} className="grid gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">
            {f.label}
            {f.required && <span className="text-rose-500"> *</span>}
          </dt>
          <dd className="min-w-0 text-sm text-zinc-900">
            <Value field={f} value={data[f.name]} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
