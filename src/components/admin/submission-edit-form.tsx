"use client";

import { saveSubmissionEdit } from "@/actions/ai-submissions";
import type { ContentTypeKey } from "@/lib/ai-content/registry";
import { BlogForm, type BlogData, type OtherPost } from "./blog-form";
import { JobForm, type JobFormValue } from "./job-form";
import { ProjectForm, type ProjectData } from "./project-form";

// The "Edit" screen of an AI submission: the NORMAL admin form of the content type, filled with the draft. Saving keeps the changes in the
// submission (it does not touch the live list); the draft is checked with the registry first. One form per registry entry.
export function SubmissionEditForm({
  submissionId,
  type,
  initial,
  others,
}: {
  submissionId: string;
  type: ContentTypeKey;
  initial: Record<string, unknown>;
  others: OtherPost[];
}) {
  const back = `/admin/ai-submissions/${submissionId}`;
  const save = async (values: unknown) => {
    const res = await saveSubmissionEdit(submissionId, values as Record<string, unknown>);
    return res;
  };
  if (type === "blog") {
    return <BlogForm initial={initial as BlogData} others={others} backHref={back} onSave={async (v) => {
      const res = await save(v);
      return { ok: res.ok, message: res.ok ? res.message : res.error };
    }} />;
  }
  if (type === "portfolio") {
    return <ProjectForm initial={initial as ProjectData} backHref={back} onSave={(v) => save(v)} />;
  }
  return <JobForm initial={initial as JobFormValue} backHref={back} onSave={(v) => save(v)} />;
}
