"use client";

import { useEffect, useState, useTransition } from "react";
import { saveSiteSettings } from "@/actions/settings";
import type { ActionResult } from "@/actions/types";
import { SITE_FIELDS, type SiteSettings } from "@/lib/cms/settings";
import { FieldsEditor } from "./fields-editor";
import { btnPrimary, card } from "./ui";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [value, setValue] = useState<Record<string, unknown>>(initial);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  return (
    <div className={`${card} space-y-6`}>
      <FieldsEditor
        fields={SITE_FIELDS}
        value={value}
        onChange={(next) => {
          setValue(next);
          setDirty(true);
          setResult(null);
        }}
      />
      {result && (
        <p role="status" className={`rounded-lg px-3 py-2 text-sm ${result.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>
          {result.ok ? result.message : result.error}
        </p>
      )}
      <button
        type="button"
        className={btnPrimary}
        disabled={pending || !dirty}
        onClick={() =>
          startTransition(async () => {
            const res = await saveSiteSettings(value);
            setResult(res);
            if (res.ok) setDirty(false);
          })
        }
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </div>
  );
}
