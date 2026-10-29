# 20 — AI integration (MCP server + approval queue) — task 115

AI tools (Claude, Claude Code, Cursor, ChatGPT …) create **blog articles**, **job openings** and **portfolio projects / case studies** (type `portfolio` = the Projects of the admin panel, `definitions/portfolio.ts`, published with `createProject`, preview `components/site/project-article.tsx`) through a private MCP server at `/api/mcp`.
**Nothing goes live by itself**: a draft arrives in Admin > AI Submissions as "Pending approval"; an admin previews, edits, approves or rejects it.
User manual (setup per client, prompts, Inspector commands, troubleshooting): `docs/MCP_SETUP.md`. Built on branch `claude/we3vision-mcp-integration-8b949d`
in 4 commits (registry, MCP server, OAuth + AI Integrations, approval queue) + security/docs.

## Where things are
| Part | Files |
|---|---|
| Registry (single source of truth) | `src/lib/ai-content/registry.ts` (list `CONTENT_TYPES`), `definitions/blog.ts`, `definitions/career.ts`, `types.ts` (entry shape), `schema.ts` (zod schema, JSON Schema, `validateDraft`, defaults, readable errors), `sanitize.ts` (no HTML/hidden chars, safe image links, slug), `preview-data.ts` (draft -> `BlogEntry` / `JobView`) |
| MCP server | `src/app/api/mcp/route.ts` (auth, CORS, kill switch) -> `server/mcp.ts` (low-level SDK `Server` + `WebStandardStreamableHTTPServerTransport`, stateless, JSON responses) -> `server/tools.ts` (8 tools, schemas generated from the registry) |
| DB side per type | `server/adapters.ts` (`listExisting`), `server/publish.ts` (calls `createBlogPost` / `saveJob`), `server/submissions.ts`, `server/images.ts` (`upload_image`) |
| Auth | `server/tokens.ts` (hashed bearer tokens, scopes), `server/oauth.ts` (DCR, code + PKCE S256, rotating refresh, revoke), routes `src/app/.well-known/oauth-*`, `src/app/api/oauth/{register,token,revoke}`, consent screen `src/app/admin/connect` + `components/admin/consent-card.tsx` |
| Admin | `/admin/ai-integrations` (create token, copy URL, revoke), `/admin/ai-submissions` (+ `[id]`, `[id]/edit`), actions `src/actions/ai-integrations.ts`, `src/actions/ai-submissions.ts`, preview page `src/app/(site)/preview/submission` |
| DB | models `AiConnection`, `OauthClient`, `OauthCode`, `ContentSubmission`, `SubmissionEvent`; migration `prisma/migrations/20261019000000_ai_integration` (**written, NOT applied by the assistant**) |
| Tests | `npm test` (vitest): registry, MCP tools, OAuth flow, approval -> publish, safe-next. `src/test/fake-db.ts` = in-memory Prisma stand-in (no real DB was used) |

## Rules to keep
- The AI has **no tool that publishes, edits or deletes live content**. The only writes: a `pending_review` submission and a picture file.
- A new content type = one registry entry + `adapters.ts` + `publish.ts` + preview render + edit form (TypeScript forces all of them). Steps: `docs/MCP_SETUP.md` section 5.
- Registry limits must equal the limits inside the admin actions (`actions/blog.ts`, `actions/jobs.ts`); a test (`registry.test.ts`, "limits still match") reads the actions and fails when they drift.
- Approval always runs the SAME actions as the admin forms (slug, order, cache refresh), then pings the search engines.
- `BlogForm` / `JobForm` got an optional `onSave` prop (used by the submission "Edit" screen). Without it they behave exactly as before.
- Admin login now returns to the page that asked for it (`?next=`, only local paths: `lib/safe-next.ts`); changed `proxy.ts`, `actions/auth.ts`, login page/screen (default unchanged).
- Everything is manageable in the admin panel (owner's wish, 2026-10-20): Admin > AI Guide (`/admin/ai-guide`, instructions: where to do what, connect each tool, prompts, fields of each type read from the registry, approve/reject, stop access, troubleshooting), AI Integrations (allow/block switch + WhatsApp-alert tick box stored in table Setting key `aiIntegration` via `server/settings.ts`, create token, Revoke, Revoke all, Tools that signed in -> Remove tool), AI Submissions (queue, Delete this record for finished ones). `AI_INTEGRATION=off` / `ALERT_AI=off` in the environment still win over the panel. Limits: 120 calls/min and 10 sends/h per connection, 30 waiting drafts per admin, 3 MB body, 2 MB picture, 2000 registered tools.
- The admin layout counts pending drafts with `countPending()` which swallows errors, so the admin panel works even before the migration.

## AI Instructions (2026-10-20, owner: "the AI must get our info/method for a blog or job and write by it")
- Admin > AI Instructions (`/admin/ai-instructions`, `components/admin/ai-instructions-form.tsx`, action `actions/ai-instructions.ts`): general instructions + per type `askFirst` (information the AI must collect from the user first) + `extra` rules. Stored in table Setting key `aiInstructions`. Pure logic in `src/lib/ai-content/instructions.ts` (clean, resolve, render); DB in `server/instructions-store.ts`. Defaults: `askFirst` in every registry definition (required by the type).
- Served to the AI in 3 places: the MCP server "instructions" at connect (general part), `get_content_guidelines` (ask-first list, owner rules before built-in rules, they win), `list_content_types` (ask-first per type). Limits: general 4000, extra 3000, 15 points x 200 chars.
- Honest limit: this is guidance, the AI cannot be forced to ask; the form (fields, limits, enums) and the approval step are what is enforced.

## Cover pictures (2026-10-20, owner: "the blog needs an image too")
- The Blog page shows ONLY covers, so an AI article without `cover` gets one drawn by code: `server/cover.tsx` (`next/og` ImageResponse = Satori, default Geist font, PNG in the exact size of the tile shape, dark violet + glows as background layers + rings + dot grid seeded by the title, topic chip, title at the bottom, "We3vision"). Stored in table Media (name `ai-cover-<title>.png`). Rule kept: art is drawn with code, no paid image tool, no downloads.
- Registry-driven: a type opts in with `autoCover` in its definition (only `blog` does). `send_to_we3vision` draws it when the field is empty; tool `generate_cover_image` shows it first (returns an MCP image block). Own picture: `upload_image` or any https link as before. Colours are the default violet (a picture cannot follow the visitor's theme).

## Not done / not verified (be honest)
- **Never run against a real database or a real AI client.** All 96 tests use the in-memory fake; the migration SQL is generated by `prisma migrate diff` but untried. The admin screens and the site preview were type-checked and built, **not opened in a browser** (no DB here).
- **MCP Apps UI** (preview card with a "Send" button inside the AI client) is **not built**: it cannot be tested without a supporting host. The text flow with an explicit `user_confirmed` is the working path.
- Hostinger may answer `/.well-known/*` itself; check with the curl lines in `docs/MCP_SETUP.md` 1.4. The token method does not need it.
- Rate limits are in memory (single Node process).
