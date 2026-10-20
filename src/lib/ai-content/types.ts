// The shape of one entry of the content registry (src/lib/ai-content/registry.ts). One entry describes a content type the AI may create:
// its fields (types, limits, allowed values, help for the AI), the guidelines, and how a draft is turned into what the admin panel's own
// save action expects. The MCP tool schemas, the server-side validation and the admin preview are all generated from it.

export type DraftData = Record<string, unknown>;

type FieldBase = {
  /** key of the field in the draft (same as the field of the admin form) */
  name: string;
  /** label as written in the admin form */
  label: string;
  /** one or two sentences for the AI: what to write here */
  help: string;
  required?: boolean;
  /** shown to the AI as an example value */
  example?: unknown;
};

export type FieldDef = FieldBase &
  (
    | { kind: "text"; max: number; min?: number }
    | { kind: "longtext"; max: number }
    | { kind: "markup"; max: number; syntax: string }
    | { kind: "enum"; options: readonly string[]; default: string }
    | { kind: "int"; min: number; max: number; default: number }
    | { kind: "date"; default: "today" | "" }
    | { kind: "image" }
    | { kind: "list"; maxItems: number; itemMax: number }
    | { kind: "qa"; maxItems: number; questionMax: number; answerMax: number }
    | { kind: "boolean"; default: boolean }
  );

export type FieldError = { field: string; message: string };

export type ContentTypeDef = {
  /** the value of `content_type` in the tools */
  key: string;
  label: string;
  /** what this type is, for the AI that picks a type */
  description: string;
  fields: readonly FieldDef[];
  /** brand voice, SEO and formatting rules (plain sentences; the AI reads them with get_content_guidelines) */
  guidelines: readonly string[];
  /** the information the AI must have before it writes (it asks the user for what is missing); the owner can replace this list in Admin > AI Instructions */
  askFirst: readonly string[];
  /** the field that names the item in lists and previews */
  titleField: string;
  /** a complete, valid example draft */
  example: DraftData;
  /** where the item lives when it is live (needs the slug the admin action returned) */
  livePath: (slug: string) => string;
  /** the list page the item appears on (told to the search engines together with the item) */
  listPath: string;
  /** the draft -> the input of the admin panel's own save action. `publish` false = save hidden (a normal draft). */
  toAdminInput: (data: DraftData, publish: boolean) => Record<string, unknown>;
  /** the draft -> the values of the normal admin form (the "Edit" screen of a submission fills that form with them) */
  toFormValues: (data: DraftData) => Record<string, unknown>;
  /** the values of the normal admin form -> a draft (not yet validated: validateDraft checks it) */
  fromFormValues: (values: Record<string, unknown>) => DraftData;
  /** optional: when the picture field is empty, a branded cover is drawn by code (lib/ai-content/server/cover.tsx) while the draft is sent */
  autoCover?: { field: string; input: (data: DraftData) => { title: string; category?: string; tile?: string } };
  /** the address (slug) the item will get, worked out the same way as the admin action (before the uniqueness check) */
  slugOf: (data: DraftData) => string;
  /** a readable preview of the draft in Markdown */
  preview: (data: DraftData) => string;
};
