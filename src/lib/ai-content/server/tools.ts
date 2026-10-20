import "server-only";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { CONTENT_TYPES, CONTENT_TYPE_KEYS, buildSchema, fieldGuide, getContentType, jsonSchemaOf, validateDraft } from "../registry";
import type { ContentTypeDef } from "../types";
import { TILES } from "@/lib/blog-shared";
import { ADAPTERS } from "./adapters";
import { createCover } from "./cover";
import { storeImage } from "./images";
import { alertLater } from "@/lib/alerts";
import { getAiSettings } from "./settings";
import { MAX_PENDING, STATUSES, STATUS_LABEL, createSubmission, getOwnSubmission, listOwnSubmissions, type SubmissionStatus } from "./submissions";
import type { McpContext, Scope } from "./tokens";

// The tools of the MCP server. NOTHING here publishes, edits or deletes live content: the only write is "a new submission that waits for
// approval" (send_to_we3vision) and "a picture file" (upload_image). The list of content types, the schemas of `data` and the checks all come
// from the registry, so a new content type needs no change in this file.

export type ToolResult = {
  content: ({ type: "text"; text: string } | { type: "image"; data: string; mimeType: string })[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
};

const text = (s: string, structured?: Record<string, unknown>): ToolResult => ({ content: [{ type: "text", text: s }], ...(structured ? { structuredContent: structured } : {}) });
const fail = (s: string): ToolResult => ({ content: [{ type: "text", text: s }], isError: true });

export type Tool = {
  name: string;
  title: string;
  description: string;
  /** which scope the connection needs */
  scope: Scope | "any";
  /** the schema shown to the AI (JSON Schema) */
  shown: z.ZodType;
  /** the schema the arguments are checked with (for tools with `data`, the exact check of `data` is done by the registry, with better messages) */
  schema: z.ZodType;
  annotations: { readOnlyHint: boolean; destructiveHint: boolean; idempotentHint: boolean; openWorldHint: boolean };
  /** extra rate limit: [max calls, window in ms] per connection */
  limit?: readonly [number, number];
  run: (ctx: McpContext, args: never) => Promise<ToolResult>;
};

const typeKey = z.enum(CONTENT_TYPE_KEYS).describe(`Which kind of content: ${CONTENT_TYPES.map((t) => `"${t.key}" (${t.label})`).join(", ")}.`);

/** `data` as the AI sees it: exactly one of the schemas of the registry (anyOf). */
const shownData = (() => {
  const variants = CONTENT_TYPES.map((t) => buildSchema(t).meta({ title: t.label, description: `${t.description} Use when content_type is "${t.key}".` }));
  return (variants.length === 1 ? variants[0] : z.union(variants as unknown as [z.ZodType, z.ZodType, ...z.ZodType[]])).describe(
    "The draft. Its fields depend on content_type; use exactly the field names and limits of that content type (see list_content_types).",
  );
})();
const looseData = z.record(z.string(), z.unknown());

const typeList = CONTENT_TYPES.map((t) => `- "${t.key}": ${t.label}. ${t.description}`).join("\n");

function origin(ctx: McpContext, path: string) {
  return `${ctx.origin}${path}`;
}

function errorsText(errors: { field: string; message: string }[]) {
  return errors.map((e) => `- ${e.field}: ${e.message}`).join("\n");
}

function definitionOf(key: string): ContentTypeDef {
  const def = getContentType(key);
  if (!def) throw new Error(`Unknown content_type "${key}".`);
  return def;
}

const listContentTypes: Tool = {
  name: "list_content_types",
  title: "List content types",
  description: `Lists the kinds of content you can create for the We3vision website, with every field (name, type, required or not, length limit, allowed values, help text) and a JSON Schema for each. Call this first in a new conversation, and whenever you are unsure which fields exist. The available kinds are:\n${typeList}\nThe fields match the input fields of the We3vision admin panel exactly. This tool only reads.`,
  scope: "any",
  shown: z.object({}),
  schema: z.object({}),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  async run() {
    const types = CONTENT_TYPES.map((t) => ({ content_type: t.key, label: t.label, description: t.description, fields: t.fields.map((f) => ({ name: f.name, label: f.label, required: Boolean(f.required), help: f.help })), json_schema: jsonSchemaOf(t) }));
    const human = CONTENT_TYPES.map((t) => `## ${t.key} (${t.label})\n${t.description}\n\n${fieldGuide(t)}`).join("\n\n");
    return text(`${human}\n\nCall get_content_guidelines for the writing rules and an example before you draft.`, { content_types: types });
  },
};

const getGuidelines: Tool = {
  name: "get_content_guidelines",
  title: "Get content guidelines",
  description:
    "Returns the We3vision brand voice, SEO rules and formatting rules for one content type, plus its field guide and a complete valid example. Read it BEFORE you write a draft, and follow it. This tool only reads.",
  scope: "any",
  shown: z.object({ content_type: typeKey }),
  schema: z.object({ content_type: typeKey }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  async run(_ctx, args: { content_type: string }) {
    const def = definitionOf(args.content_type);
    const body = [
      `# Guidelines: ${def.label}`,
      def.guidelines.map((g) => `- ${g}`).join("\n"),
      `## Fields\n${fieldGuide(def)}`,
      `## Example of a valid draft\n\`\`\`json\n${JSON.stringify(def.example, null, 2)}\n\`\`\``,
      "## Workflow\n1. Draft the content. 2. Call preview_content and fix every error it lists. 3. Show the preview to the user and apply their changes. 4. Only when the user clearly says to send it, call send_to_we3vision. It then waits for approval in the admin panel; nothing goes live by itself.",
    ].join("\n\n");
    return text(body, { content_type: def.key, guidelines: def.guidelines, example: def.example });
  },
};

const previewContent: Tool = {
  name: "preview_content",
  title: "Preview a draft",
  description:
    "Checks a draft against the exact rules of the We3vision admin form (required fields, length limits, allowed values, safe text) and returns a formatted preview and the list of problems. It does NOT save or send anything. Call it after every revision, fix all listed errors, then show the preview to the user and ask for their feedback or approval to send.",
  scope: "any",
  shown: z.object({ content_type: typeKey, data: shownData }),
  schema: z.object({ content_type: typeKey, data: looseData }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  async run(_ctx, args: { content_type: string; data: Record<string, unknown> }) {
    const def = definitionOf(args.content_type);
    const r = validateDraft(def, args.data);
    if (!r.ok) {
      return text(`The draft is NOT valid yet. Fix these and call preview_content again:\n${errorsText(r.errors)}`, { valid: false, errors: r.errors });
    }
    return text(`The draft is valid. Preview (this is what the admin will see; nothing is saved):\n\n${def.preview(r.data)}\n\n---\nShow this to the user. When they confirm, call send_to_we3vision with the same content.`, { valid: true, errors: [], normalized: r.data, preview: def.preview(r.data) });
  },
};

const sendToWe3vision: Tool = {
  name: "send_to_we3vision",
  title: "Send to We3vision (for approval)",
  description:
    "Sends a finished draft to the We3vision admin panel, where it waits as \"Pending approval\". NOTHING GOES LIVE: an admin must preview, edit and approve it first. Call this ONLY after the user has seen the preview and explicitly said to send or submit it (for example \"send it\", \"submit it\", \"yes, go ahead\"). Never call it on your own, to test, or because the draft looks good to you. The draft is checked again; if it has errors the call fails and tells you what to fix. Set user_confirmed to true only when the user explicitly confirmed. Returns the submission id and the admin panel link to give to the user.",
  scope: "content:submit",
  shown: z.object({
    content_type: typeKey,
    data: shownData,
    user_confirmed: z.literal(true).describe("Must be true. Set it only if the user explicitly told you to send this draft to We3vision."),
  }),
  schema: z.object({ content_type: typeKey, data: looseData, user_confirmed: z.boolean() }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  limit: [10, 60 * 60_000],
  async run(ctx, args: { content_type: string; data: Record<string, unknown>; user_confirmed: boolean }) {
    if (args.user_confirmed !== true) {
      return fail("Not sent. user_confirmed must be true, and only after the user explicitly said to send this draft. Show the preview to the user and ask them first.");
    }
    const def = definitionOf(args.content_type);
    const r = validateDraft(def, args.data);
    if (!r.ok) return fail(`Not sent: the draft has errors. Fix these and call send_to_we3vision again:\n${errorsText(r.errors)}`);

    // an article without a picture gets a branded cover drawn by code (the Blog page shows nothing but covers)
    let coverNote = "";
    if (def.autoCover && !r.data[def.autoCover.field]) {
      const cover = await createCover(def.autoCover.input(r.data));
      if (cover.ok) {
        r.data[def.autoCover.field] = cover.url;
        coverNote = "A branded cover picture was drawn automatically (the admin can replace it).";
      } else coverNote = "No cover could be drawn; the admin can add one.";
    }
    const title = String(r.data[def.titleField] ?? "");
    const sameLive = (await ADAPTERS[def.key as keyof typeof ADAPTERS].listExisting(title, 5)).find((x) => x.title.toLowerCase() === title.toLowerCase());
    const created = await createSubmission(ctx, def, r.data);
    if ("full" in created) return fail(`Not sent: ${MAX_PENDING} drafts are already waiting for approval. Ask the user to approve or reject some in Admin > AI Submissions first.`);
    const { id, duplicate } = created;
    if (!duplicate && (await getAiSettings()).alerts) alertLater({ level: "info", kind: "ai", title: `New ${def.label.toLowerCase()} from AI is waiting: ${title.slice(0, 80)}`, detail: `Sent by ${ctx.connectionName}`, path: `/admin/ai-submissions/${id}`, notify: true });
    const link = origin(ctx, `/admin/ai-submissions/${id}`);
    const lines = [
      duplicate ? `This draft was already sent and is still waiting (submission ${id}). Nothing new was created.` : `Sent. "${title}" is now waiting for approval (submission ${id}).`,
      "It is NOT live. An admin has to preview, edit and approve it in the admin panel.",
      !duplicate ? coverNote : "",
      `Admin panel link: ${link}`,
      sameLive ? `Note for the user: ${def.label.toLowerCase()} with the same title already exists (${sameLive.url}, ${sameLive.status}). The admin will see that when reviewing.` : "",
    ].filter(Boolean);
    return text(lines.join("\n"), { submission_id: id, status: "pending_review", duplicate, admin_url: link, existing_with_same_title: sameLive ?? null });
  },
};

const generateCover: Tool = {
  name: "generate_cover_image",
  title: "Draw a cover picture",
  description:
    "Draws a branded cover picture for a blog article (title and topic on a dark violet drawing, made by code: no photo, no stock image, no external service) in the picture shape of the Blog page, stores it, and returns a \"/media/<id>\" link plus the picture itself so you and the user can see it. Use it when the user gave no picture: put the link in the `cover` field of the draft. Optional: if you leave `cover` out, the same kind of cover is drawn automatically when you send the draft. If the user gives their own picture, use upload_image instead. The same title always gives the same drawing.",
  scope: "content:submit",
  shown: z.object({
    title: z.string().min(2).max(140).describe("The title of the article (it is written on the cover)."),
    category: z.string().max(40).optional().describe("The topic label of the article, for example Design or AI/ML."),
    tile: z.enum(TILES.map((t) => t.value) as [string, ...string[]]).optional().describe("The picture shape: landscape, square, portrait (default) or tall. Use the same value as the tile of the draft."),
  }),
  schema: z.object({ title: z.string().min(2).max(140), category: z.string().max(40).optional(), tile: z.enum(TILES.map((t) => t.value) as [string, ...string[]]).optional() }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  limit: [20, 60 * 60_000],
  async run(_ctx, args: { title: string; category?: string; tile?: string }) {
    const r = await createCover(args);
    if (!r.ok) return fail(r.error);
    return {
      content: [
        { type: "text", text: `Cover drawn (${r.width} × ${r.height}). Use this as the cover field: ${r.url}` },
        { type: "image", data: Buffer.from(r.bytes).toString("base64"), mimeType: r.mime },
      ],
      structuredContent: { url: r.url, width: r.width, height: r.height },
    };
  },
};

const listMine: Tool = {
  name: "list_my_submissions",
  title: "List my submissions",
  description: "Lists the content sent through your account with its status: pending approval, approved (live), rejected (with the reason), or saved as a hidden draft. Newest first. Use it to answer \"what happened to my post?\". This tool only reads.",
  scope: "content:read",
  shown: z.object({
    status: z.enum(STATUSES).optional().describe("Only this status."),
    limit: z.number().int().min(1).max(50).optional().describe("How many (default 20)."),
  }),
  schema: z.object({ status: z.enum(STATUSES).optional(), limit: z.number().int().min(1).max(50).optional() }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  async run(ctx, args: { status?: SubmissionStatus; limit?: number }) {
    const rows = await listOwnSubmissions(ctx.adminId, args.status, args.limit ?? 20);
    if (rows.length === 0) return text("No submissions yet.", { submissions: [] });
    const lines = rows.map((r) => `- ${r.id} · ${r.contentType} · "${r.title}" · ${STATUS_LABEL[r.status as SubmissionStatus] ?? r.status} · ${r.createdAt.toISOString().slice(0, 16).replace("T", " ")}${r.rejectReason ? ` · reason: ${r.rejectReason}` : ""}`);
    return text(lines.join("\n"), { submissions: rows.map((r) => ({ id: r.id, content_type: r.contentType, title: r.title, status: r.status, reject_reason: r.rejectReason, live_url: r.entitySlug && r.status === "approved" ? origin(ctx, getContentType(r.contentType)?.livePath(r.entitySlug) ?? "") : null, created_at: r.createdAt.toISOString() })) });
  },
};

const getStatus: Tool = {
  name: "get_submission_status",
  title: "Get a submission's status",
  description: "Returns the status of one submission by its id: pending approval, approved (with the live address), rejected (with the reason the admin wrote), or saved as a hidden draft. This tool only reads.",
  scope: "content:read",
  shown: z.object({ submission_id: z.string().min(10).max(40).describe("The id returned by send_to_we3vision.") }),
  schema: z.object({ submission_id: z.string().min(10).max(40) }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  async run(ctx, args: { submission_id: string }) {
    const r = await getOwnSubmission(ctx.adminId, args.submission_id);
    if (!r) return fail("No submission with this id was found for your account.");
    const live = r.status === "approved" && r.entitySlug ? origin(ctx, getContentType(r.contentType)?.livePath(r.entitySlug) ?? "") : null;
    const out = [`"${r.title}" (${r.contentType}): ${STATUS_LABEL[r.status as SubmissionStatus] ?? r.status}.`, r.rejectReason ? `Reason: ${r.rejectReason}` : "", live ? `Live at: ${live}` : "", `Admin panel: ${origin(ctx, `/admin/ai-submissions/${r.id}`)}`].filter(Boolean);
    return text(out.join("\n"), { id: r.id, status: r.status, reject_reason: r.rejectReason, live_url: live });
  },
};

const listExisting: Tool = {
  name: "list_existing_content",
  title: "List existing website content",
  description:
    "Lists content that already exists on the website for one content type (blog articles or job openings), newest first, with address and status. Use it BEFORE drafting to avoid duplicates, to pick an existing topic label, and to find related articles for internal links. Optional `query` filters by a word in the title. This tool only reads and cannot change anything.",
  scope: "content:read",
  shown: z.object({
    content_type: typeKey,
    query: z.string().max(100).optional().describe("A word to look for in the title."),
    limit: z.number().int().min(1).max(50).optional().describe("How many (default 25)."),
  }),
  schema: z.object({ content_type: typeKey, query: z.string().max(100).optional(), limit: z.number().int().min(1).max(50).optional() }),
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  async run(ctx, args: { content_type: string; query?: string; limit?: number }) {
    const def = definitionOf(args.content_type);
    const items = await ADAPTERS[def.key as keyof typeof ADAPTERS].listExisting((args.query ?? "").trim(), args.limit ?? 25);
    if (items.length === 0) return text(`No ${def.label.toLowerCase()} found${args.query ? ` for "${args.query}"` : ""}.`, { items: [] });
    return text(items.map((i) => `- "${i.title}" · ${i.status} · ${i.url}${i.details ? ` · ${i.details}` : ""}`).join("\n"), { items: items.map((i) => ({ ...i, url: origin(ctx, i.url) })) });
  },
};

const uploadImage: Tool = {
  name: "upload_image",
  title: "Upload a picture",
  description:
    "Uploads a picture (JPG, PNG, WEBP or GIF, 2 MB at most, sent as base64) to the We3vision media library and returns a \"/media/<id>\" link. Use that link as the `cover` field of a blog draft. The file is checked by its real content, not its name. Only call this when the user gave you a picture to use; never generate or fetch pictures on your own. The picture is only a file: it appears nowhere until an approved article uses it.",
  scope: "content:submit",
  shown: z.object({
    filename: z.string().min(1).max(120).describe("File name, for example cover.webp."),
    data_base64: z.string().min(20).max(3_000_000).describe("The picture file as base64 text (no data: prefix needed)."),
  }),
  schema: z.object({ filename: z.string().min(1).max(120), data_base64: z.string().min(20).max(3_000_000) }),
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  limit: [20, 60 * 60_000],
  async run(_ctx, args: { filename: string; data_base64: string }) {
    const r = await storeImage(args.filename, args.data_base64);
    if (!r.ok) return fail(r.error);
    return text(`Uploaded. Use this as the cover field: ${r.url}`, { url: r.url, mime: r.mime, size: r.size });
  },
};

export const TOOLS: readonly Tool[] = [listContentTypes, getGuidelines, previewContent, sendToWe3vision, listMine, getStatus, listExisting, uploadImage, generateCover];

export const SERVER_INSTRUCTIONS = [
  "This server lets you prepare content for the We3vision website (blog articles, job openings). You can only create submissions: nothing goes live until a We3vision admin approves it in the admin panel.",
  "Workflow: 1) list_content_types and get_content_guidelines, 2) list_existing_content to avoid duplicates, 3) draft, 4) preview_content and fix all errors, 5) show the preview to the user and revise on their feedback, 6) call send_to_we3vision ONLY after the user explicitly confirms. Use exactly the field names and limits of the content type. Never invent facts, numbers, clients or testimonials.",
].join("\n");

export const toolJsonSchema = (t: Tool) => {
  const { $schema: _omit, ...schema } = z.toJSONSchema(t.shown, { io: "input" }) as Record<string, unknown>;
  void _omit;
  return schema;
};

/** Rate limits of one connection (a general one for every call, a stricter one for tools that write). */
export function allowCall(ctx: McpContext, tool: Tool): boolean {
  if (!rateLimit(`mcp:${ctx.connectionId}`, 120, 60_000)) return false;
  return !tool.limit || rateLimit(`mcp-${tool.name}:${ctx.connectionId}`, tool.limit[0], tool.limit[1]);
}
