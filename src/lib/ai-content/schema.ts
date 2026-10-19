import { z } from "zod";
import { cleanBlock, cleanLine, isCalendarDay, isImageLink } from "./sanitize";
import type { ContentTypeDef, DraftData, FieldDef, FieldError } from "./types";

// Everything generated from one registry entry: the zod schema (= the JSON Schema the AI sees), the cleaning and checking of a draft,
// the defaults, and the readable field guide. Nothing here knows about "blog" or "career".

const todayIso = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function leaf(f: FieldDef): z.ZodType {
  switch (f.kind) {
    case "text":
      return z.string().min(f.min ?? (f.required ? 1 : 0)).max(f.max);
    case "longtext":
    case "markup":
      return z.string().min(f.required ? 1 : 0).max(f.max);
    case "enum":
      return z.enum(f.options as [string, ...string[]]);
    case "int":
      return z.number().int().min(f.min).max(f.max);
    case "date":
      return z.string().refine(isCalendarDay, "must be a real date written yyyy-mm-dd");
    case "image":
      return z.string().refine((v) => v === "" || isImageLink(v), "must be a /media/<id> link (from upload_image) or a https:// address");
    case "list":
      return z.array(z.string().min(1).max(f.itemMax)).max(f.maxItems);
    case "qa":
      return z
        .array(z.object({ question: z.string().min(1).max(f.questionMax), answer: z.string().min(1).max(f.answerMax) }).strict())
        .max(f.maxItems);
    case "boolean":
      return z.boolean();
  }
}

/** The limits as a sentence, used in descriptions of the schema and in the field guide. */
export function limitText(f: FieldDef): string {
  switch (f.kind) {
    case "text":
      return `single line, ${f.min ? `${f.min}–` : "up to "}${f.max} characters`;
    case "longtext":
      return `plain text, up to ${f.max} characters`;
    case "markup":
      return `up to ${f.max} characters. ${f.syntax}`;
    case "enum":
      return `one of: ${f.options.map((o) => `"${o}"`).join(", ")} (default "${f.default}")`;
    case "int":
      return `whole number ${f.min}–${f.max} (default ${f.default})`;
    case "date":
      return `yyyy-mm-dd${f.default === "today" ? " (default today)" : ", or leave out"}`;
    case "image":
      return `a "/media/<id>" link from upload_image, or a https:// address; leave out for no picture`;
    case "list":
      return `list of at most ${f.maxItems} strings, each up to ${f.itemMax} characters`;
    case "qa":
      return `list of at most ${f.maxItems} {question (up to ${f.questionMax}), answer (up to ${f.answerMax})} objects`;
    case "boolean":
      return `true or false (default ${f.default})`;
  }
}

/** The zod object for one content type. Unknown keys are an error (the AI must not invent fields). */
export function buildSchema(def: ContentTypeDef) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of def.fields) {
    const base = leaf(f).describe(`${f.label}. ${f.help} [${limitText(f)}]`);
    shape[f.name] = f.required ? base : base.optional();
  }
  return z.object(shape).strict();
}

/** The JSON Schema of a content type, as shown to the AI (required fields, limits, allowed values, descriptions). */
export function jsonSchemaOf(def: ContentTypeDef) {
  const { $schema: _omit, ...schema } = z.toJSONSchema(buildSchema(def), { io: "input" }) as Record<string, unknown>;
  void _omit;
  return schema;
}

/** Cleans the text of the known fields (no HTML, no hidden characters). Wrong types are left alone: the schema reports them. */
function clean(def: ContentTypeDef, input: unknown): unknown {
  if (!isRecord(input)) return input;
  const out: Record<string, unknown> = { ...input };
  for (const f of def.fields) {
    const v = out[f.name];
    if (v === undefined || v === null) {
      delete out[f.name];
      continue;
    }
    switch (f.kind) {
      case "text":
      case "date":
      case "image":
        if (typeof v === "string") out[f.name] = cleanLine(v);
        break;
      case "longtext":
      case "markup":
        if (typeof v === "string") out[f.name] = cleanBlock(v);
        break;
      case "list":
        if (Array.isArray(v)) out[f.name] = v.map((x) => (typeof x === "string" ? cleanLine(x) : x)).filter((x) => x !== "");
        break;
      case "qa":
        if (Array.isArray(v))
          out[f.name] = v.map((x) => (isRecord(x) ? { ...x, question: typeof x.question === "string" ? cleanLine(x.question) : x.question, answer: typeof x.answer === "string" ? cleanLine(x.answer) : x.answer } : x));
        break;
    }
    // an empty date or picture means "not given": the default applies
    if (out[f.name] === "" && (f.kind === "date" || f.kind === "image")) delete out[f.name];
  }
  return out;
}

function lengthAt(input: unknown, path: readonly PropertyKey[]): number | null {
  let cur: unknown = input;
  for (const p of path) {
    if (cur === null || typeof cur !== "object") return null;
    cur = (cur as Record<PropertyKey, unknown>)[p];
  }
  return typeof cur === "string" || Array.isArray(cur) ? cur.length : null;
}

function describePath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((s, p) => (typeof p === "number" ? `${s}[${p + 1}]` : s ? `${s}.${String(p)}` : String(p)), "") || "(draft)";
}

/** Zod issues -> short messages an AI can act on ("summary: too long, 412 characters, the limit is 300"). */
function explain(issues: readonly z.core.$ZodIssue[], input: unknown): FieldError[] {
  return issues.map((i) => {
    const field = describePath(i.path);
    const got = lengthAt(input, i.path);
    switch (i.code) {
      case "too_big":
        return { field, message: got === null ? `too big, the limit is ${String(i.maximum)}` : `too long (${got}), the limit is ${String(i.maximum)}` };
      case "too_small":
        return { field, message: got === 0 || got === null ? "is required and must not be empty" : `too short (${got}), the minimum is ${String(i.minimum)}` };
      case "invalid_value":
        return { field, message: `must be one of: ${i.values.map((v) => JSON.stringify(v)).join(", ")}` };
      case "unrecognized_keys":
        return { field: field === "(draft)" ? i.keys.join(", ") : field, message: `unknown field${i.keys.length > 1 ? "s" : ""} ${i.keys.join(", ")}: use only the fields of this content type` };
      case "invalid_type":
        return { field, message: i.input === undefined ? "is required" : `has the wrong type, expected ${i.expected}` };
      default:
        return { field, message: i.message };
    }
  });
}

export type DraftResult = { ok: true; data: DraftData } | { ok: false; errors: FieldError[] };

/** Cleans, checks and completes (defaults) a draft. Never throws. This is the only way a draft gets into the system. */
export function validateDraft(def: ContentTypeDef, input: unknown): DraftResult {
  const cleaned = clean(def, input);
  const parsed = buildSchema(def).safeParse(cleaned);
  if (!parsed.success) return { ok: false, errors: explain(parsed.error.issues, cleaned) };
  const data: DraftData = { ...(parsed.data as DraftData) };
  for (const f of def.fields) {
    if (data[f.name] !== undefined) continue;
    switch (f.kind) {
      case "enum":
      case "int":
      case "boolean":
        data[f.name] = f.default;
        break;
      case "date":
        data[f.name] = f.default === "today" ? todayIso() : "";
        break;
      case "list":
      case "qa":
        data[f.name] = [];
        break;
      case "text":
      case "longtext":
      case "markup":
      case "image":
        data[f.name] = "";
        break;
    }
  }
  return { ok: true, data };
}

/** The field guide of a type in Markdown (for get_content_guidelines and for the admin panel). */
export function fieldGuide(def: ContentTypeDef): string {
  const rows = def.fields.map((f) => `- **${f.name}**${f.required ? " (required)" : ""}: ${f.label}. ${f.help} _${limitText(f)}._`);
  return rows.join("\n");
}
