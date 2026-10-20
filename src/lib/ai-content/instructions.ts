import { cleanBlock, cleanLine } from "./sanitize";
import { fieldGuide } from "./schema";
import type { ContentTypeDef } from "./types";

// The owner's own instructions for the AI tools, written in Admin > AI Instructions and kept in the table Setting (key "aiInstructions"):
//  - general: facts about the company and rules for EVERY kind of content (voice, what never to say, who the readers are …)
//  - per content type: "extra": more rules for that type, and "askFirst": the information the AI must have before it writes (it asks the user
//    for what is missing). Without a saved value the built-in list of the registry entry (askFirst) is used.
// The AI reads all of it through get_content_guidelines, and the general part also when it connects (the "instructions" of the MCP server).
// Pure functions only (no database): the admin page, the MCP tools and the tests all use them.

export const INSTRUCTIONS_KEY = "aiInstructions";

export const INSTRUCTION_LIMITS = { general: 4000, extra: 3000, askFirstItems: 15, askFirstEach: 200 } as const;

export type StoredTypeInstructions = { extra?: string; askFirst?: string[] };
export type StoredInstructions = { general: string; types: Record<string, StoredTypeInstructions> };

export const EMPTY_INSTRUCTIONS: StoredInstructions = { general: "", types: {} };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Cleans what the admin typed (or what is in the database): plain text, within the limits, only the content types that exist. */
export function cleanInstructions(input: unknown, knownTypes: readonly string[]): StoredInstructions {
  const src = isRecord(input) ? input : {};
  const out: StoredInstructions = { general: cleanBlock(typeof src.general === "string" ? src.general : "").slice(0, INSTRUCTION_LIMITS.general), types: {} };
  const types = isRecord(src.types) ? src.types : {};
  for (const key of knownTypes) {
    const t = types[key];
    if (!isRecord(t)) continue;
    const entry: StoredTypeInstructions = {};
    const extra = cleanBlock(typeof t.extra === "string" ? t.extra : "").slice(0, INSTRUCTION_LIMITS.extra);
    if (extra) entry.extra = extra;
    if (Array.isArray(t.askFirst)) {
      entry.askFirst = t.askFirst
        .map((x) => cleanLine(typeof x === "string" ? x : "").slice(0, INSTRUCTION_LIMITS.askFirstEach))
        .filter(Boolean)
        .slice(0, INSTRUCTION_LIMITS.askFirstItems);
    }
    if (entry.extra !== undefined || entry.askFirst !== undefined) out.types[key] = entry;
  }
  return out;
}

/** What the AI gets for one content type: the owner's list (or the built-in one) and the owner's extra rules. */
export function resolveInstructions(def: ContentTypeDef, stored: StoredInstructions) {
  const own = stored.types[def.key];
  const custom = own?.askFirst !== undefined;
  return { askFirst: custom ? (own.askFirst as string[]) : [...def.askFirst], askFirstIsCustom: custom, extra: own?.extra ?? "" };
}

const WORKFLOW =
  "## Workflow\n1. Make sure you have the information listed above (ask the user for what is missing). 2. Draft the content. 3. Call preview_content and fix every error it lists. 4. Show the preview to the user and apply their changes. 5. Only when the user clearly says to send it, call send_to_we3vision. It then waits for approval in the admin panel; nothing goes live by itself.";

/** The text of get_content_guidelines: the owner's instructions first (they win), then the built-in rules, the fields and an example. */
export function renderGuidelines(def: ContentTypeDef, stored: StoredInstructions): string {
  const r = resolveInstructions(def, stored);
  const parts = [`# Guidelines: ${def.label}`];
  if (r.askFirst.length) {
    parts.push(
      `## Before you write: collect this information\nAsk the user for whatever of this you do not already have. Ask in ONE short message, suggest sensible defaults, do not interrogate. Never invent a missing fact.\n${r.askFirst.map((q) => `- ${q}`).join("\n")}`,
    );
  }
  if (stored.general) parts.push(`## Instructions of the website owner (for all content; they win over the built-in rules when they differ)\n${stored.general}`);
  if (r.extra) parts.push(`## Instructions of the website owner for this content type (they win over the built-in rules when they differ)\n${r.extra}`);
  parts.push(`## Built-in rules\n${def.guidelines.map((g) => `- ${g}`).join("\n")}`);
  parts.push(`## Fields\n${fieldGuide(def)}`);
  parts.push(`## Example of a valid draft\n\`\`\`json\n${JSON.stringify(def.example, null, 2)}\n\`\`\``);
  parts.push(WORKFLOW);
  return parts.join("\n\n");
}

/** What the AI is told the moment it connects (the "instructions" of the MCP server): the workflow, the general instructions of the owner. */
export function renderServerInstructions(base: string, stored: StoredInstructions): string {
  return stored.general ? `${base}\n\nInstructions of the website owner (for all content; follow them):\n${stored.general}` : base;
}
