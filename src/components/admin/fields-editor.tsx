"use client";

import { emptyValue, type Field } from "@/lib/cms/fields";
import { btnIcon, btnSecondary, inputClass, labelClass } from "./ui";

type Value = Record<string, unknown>;

/** Renders an editor form for any list of field definitions (sections and site settings both use it). */
export function FieldsEditor({ fields, value, onChange }: { fields: Field[]; value: Value; onChange: (next: Value) => void }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FieldControl key={field.key} field={field} value={value[field.key]} onChange={(v) => onChange({ ...value, [field.key]: v })} />
      ))}
    </div>
  );
}

function FieldControl({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.kind) {
    case "text":
    case "url":
      return (
        <label className={labelClass}>
          {field.label}
          <input
            type="text"
            value={typeof value === "string" ? value : ""}
            maxLength={field.kind === "text" ? (field.max ?? 200) : 500}
            placeholder={field.kind === "url" ? (field.hint ?? "/page, #section or https://…") : undefined}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
          {field.hint && <span className="mt-1 block text-xs font-normal text-zinc-400">{field.hint}</span>}
        </label>
      );
    case "textarea":
      return (
        <label className={labelClass}>
          {field.label}
          <textarea
            rows={4}
            value={typeof value === "string" ? value : ""}
            maxLength={field.max ?? 2000}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} resize-y`}
          />
          {field.hint && <span className="mt-1 block text-xs font-normal text-zinc-400">{field.hint}</span>}
        </label>
      );
    case "group":
      return (
        <fieldset className="rounded-xl border border-zinc-200 p-4">
          <legend className="px-2 text-sm font-semibold text-zinc-800">{field.label}</legend>
          <FieldsEditor fields={field.fields} value={(value as Value) ?? {}} onChange={onChange} />
        </fieldset>
      );
    case "list":
      return <ListControl field={field} items={Array.isArray(value) ? (value as Value[]) : []} onChange={onChange} />;
  }
}

function ListControl({ field, items, onChange }: { field: Extract<Field, { kind: "list" }>; items: Value[]; onChange: (v: Value[]) => void }) {
  const max = field.max ?? 12;
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-zinc-800">
        {field.label} <span className="font-normal text-zinc-400">({items.length}/{max})</span>
      </p>
      <div className="mt-2 space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                {field.itemLabel} {i + 1}
              </span>
              <div className="flex gap-1.5">
                <button type="button" className={btnIcon} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className={btnIcon} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button type="button" className={`${btnIcon} hover:!bg-rose-50 hover:!text-rose-600`} onClick={() => onChange(items.filter((_, n) => n !== i))} aria-label={`Remove ${field.itemLabel}`}>
                  ✕
                </button>
              </div>
            </div>
            <FieldsEditor fields={field.fields} value={item} onChange={(next) => onChange(items.map((old, n) => (n === i ? next : old)))} />
          </div>
        ))}
      </div>
      <button type="button" className={`${btnSecondary} mt-3`} disabled={items.length >= max} onClick={() => onChange([...items, emptyValue(field.fields)])}>
        + Add {field.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
