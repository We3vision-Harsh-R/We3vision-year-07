import Link from "next/link";
import { AiInstructionsForm, type TypeBlock } from "@/components/admin/ai-instructions-form";
import { CONTENT_TYPES } from "@/lib/ai-content/registry";
import { INSTRUCTION_LIMITS, renderGuidelines, resolveInstructions } from "@/lib/ai-content/instructions";
import { getStoredInstructions } from "@/lib/ai-content/server/instructions-store";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "AI Instructions" };

export default async function AiInstructionsPage() {
  await requireAdmin();
  const stored = await getStoredInstructions();
  const blocks: TypeBlock[] = CONTENT_TYPES.map((def) => {
    const r = resolveInstructions(def, stored);
    return {
      key: def.key,
      label: def.label,
      description: def.description,
      defaultAskFirst: [...def.askFirst],
      askFirst: r.askFirst,
      extra: r.extra,
      builtIn: [...def.guidelines],
      preview: renderGuidelines(def, stored),
    };
  });
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Instructions</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tell the AI tools what to know and ask before they write a blog article or a job post, and how it must be written. They read this automatically, every time, from every tool (Claude, ChatGPT, Cursor …): you do not paste anything into the tools. New to this? See the{" "}
          <Link href="/admin/ai-guide" className="font-medium text-brand hover:underline">
            AI Guide
          </Link>
          .
        </p>
      </div>
      <AiInstructionsForm general={stored.general} blocks={blocks} limits={INSTRUCTION_LIMITS} />
    </div>
  );
}
