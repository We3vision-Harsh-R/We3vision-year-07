import { blogType } from "./definitions/blog";
import { careerType } from "./definitions/career";
import { portfolioType } from "./definitions/portfolio";
import type { ContentTypeDef } from "./types";

// THE CONTENT REGISTRY. Every content type the AI may create is one entry here. Everything else (the MCP tools and their JSON Schemas, the
// server-side validation, the previews, the approval queue) is generated from these entries. See docs/MCP_SETUP.md, "Add a new content type".

export const CONTENT_TYPES = [blogType, careerType, portfolioType] as const satisfies readonly ContentTypeDef[];

export type ContentTypeKey = (typeof CONTENT_TYPES)[number]["key"];
export const CONTENT_TYPE_KEYS = CONTENT_TYPES.map((t) => t.key) as [ContentTypeKey, ...ContentTypeKey[]];

export function getContentType(key: string): ContentTypeDef | undefined {
  return CONTENT_TYPES.find((t) => t.key === key);
}

export { buildSchema, fieldGuide, jsonSchemaOf, validateDraft } from "./schema";
export type { ContentTypeDef, DraftData, FieldDef, FieldError } from "./types";
