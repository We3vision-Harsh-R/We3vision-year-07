# Prompt: build the same "AI tools create content, admin approves" system in another website

**How to use:** open the chat of the other project (AIRC), and paste everything under the line `=== PROMPT START ===` down to `=== PROMPT END ===`. The new chat reads the finished system of the We3vision website from this computer, asks you a few questions, and builds the same thing for your other site, part by part. At the first step it will ask permission to read the folder of the We3vision project: say yes.

The reference system is in the We3vision repository (already deployed at 07.we3vision.com):
`D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07`

=== PROMPT START ===

# Task: build a private, secure MCP integration for this project (AIRC), the same way it was built for the We3vision website

I want AI tools (Claude, Claude Code, ChatGPT, Cursor …) to create content for **this website** through **my own MCP server**. Content must NEVER go live directly: it goes to an **approval queue in my admin panel**, and only after I approve it there does it go live. I will also write, in the admin panel, the instructions the AI tools must follow (what to ask me first, how to write).

A finished, working, tested version of exactly this system already exists in another project of mine. **Use it as the reference implementation: read it, copy its architecture and its lessons, adapt it to this project. Do not invent a new design.**

- Reference repo (read-only for you, never edit it): `D:\zz Loom\We3vision Private Limited\We3vision Website - 2026\We3vision-year-07`. Ask me to grant access to that folder if you cannot read it.
- Read first, in this order: `docs/MCP_SETUP.md` (manual: flow, tools, how to add a content type, troubleshooting), `brain/20-ai-integration.md` (where everything is, rules, what is not verified), then the code listed in the file map below.

## The flow I want (same as the reference)
1. Admin panel → **AI Integrations**: copy the MCP URL, create a token for tools that use a header, see/revoke connections, switch all AI tools on/off.
2. I paste the MCP URL into an AI tool and connect it (OAuth sign-in with my admin account; tools that use headers use a token).
3. I ask the AI: "Write a blog about …" / "Create a job post for …" (use the content types of THIS project, see Step 0).
4. The AI first reads the **instructions** from the website (what to ask me, the owner's rules), asks me what is missing, then writes content with **exactly the fields, limits and allowed values of my admin forms**, shows me a preview, and I ask for changes.
5. When I clearly say "send it", the AI calls `send_to_<project>`; the item arrives in the admin panel as **Pending approval**.
6. In **AI Submissions** I preview it (rendered with the real public components), see every field, edit it (the normal admin form, prefilled), **Approve & Publish** (same save logic and cache refresh as my normal admin), save as hidden draft, or **Reject** with a reason. Full audit log.
7. **AI Instructions** page: general instructions, plus for every content type the list "information the AI must collect from the user first" and my extra rules. **AI Guide** page: plain-words instructions for me (where to do what, how to connect each tool, example prompts, stop access, troubleshooting).

## Step 0: understand THIS project first (before writing any code)
Explore and report to me, then **stop and wait for my "go ahead"**:
- Framework, backend, database/ORM, hosting, how deploys happen, how env variables are set.
- How admin authentication works today (and whether there is an admin panel at all; if not, tell me and propose the smallest one).
- Every content model that could be created by AI (blog, jobs/careers, case studies, products, testimonials, events …): every field, type, required/optional, validation, enums, and how an item becomes "live" (status flag, publishedAt, cache revalidation, sitemap).
- Where pictures are stored and served.
- Ask me which content types the AI should create (start with 1–3), the brand voice/facts for the first "AI Instructions", and the exact project name to use in names (tool name `send_to_<project>`, server name, texts).
- Conflicts between this plan and the code: **stop and ask**, never guess. Reuse the existing patterns, styling, components and auth. Do not add a second framework or duplicate auth.
- If the stack differs from the reference (Next.js 16 + Prisma 7 + Postgres + zod 4), keep the same architecture and translate it; say what you changed.

## Architecture to copy (from the reference)
**One registry drives everything.** Each content type is ONE registry entry: fields (kind, required, max, enum, default, AI help text), guidelines, `askFirst` (default list of information to collect), example, preview, `slugOf`, `livePath`, `toAdminInput(draft, publish)` (draft → the input of the admin's own save action), `toFormValues` / `fromFormValues` (draft ↔ admin form values), optional `autoCover`. From it are generated: the zod schema and JSON Schema of the MCP tools, server-side validation with AI-friendly errors ("summary: too long (412), the limit is 300"), sanitising, previews. Adding a type later = one registry entry + three small mappings (list existing items, publisher that calls the admin's own save action, preview renderer + edit form). TypeScript must refuse to compile if a mapping is missing (`Record<ContentTypeKey, …>`).

**File map of the reference (adapt, do not blindly copy content-specific parts):**
- Registry: `src/lib/ai-content/{registry.ts, types.ts, schema.ts, sanitize.ts, instructions.ts, preview-data.ts, definitions/*.ts}`
- MCP server (stateless Streamable HTTP, `@modelcontextprotocol/sdk`, low-level `Server` + `WebStandardStreamableHTTPServerTransport`, JSON responses): `src/app/api/mcp/route.ts`, `src/lib/ai-content/server/{mcp.ts, tools.ts, http.ts}`
- Per-type DB side: `server/{adapters.ts, publish.ts, submissions.ts, images.ts, cover.tsx, settings.ts, instructions-store.ts}`
- Auth: `server/{tokens.ts, oauth.ts}`, `src/app/.well-known/oauth-*`, `src/app/api/oauth/{register,token,revoke}`, consent screen `src/app/admin/connect` + `components/admin/consent-card.tsx`, `src/lib/safe-next.ts` (+ the `?next=` return in the admin login, proxy and login action)
- Admin: `src/app/admin/(panel)/{ai-integrations,ai-submissions,ai-instructions,ai-guide}`, `src/actions/{ai-integrations,ai-submissions,ai-instructions}.ts`, `components/admin/{ai-integrations,ai-instructions-form,submission-*}.tsx`, preview route `src/app/(site)/preview/submission`
- DB: models `AiConnection, OauthClient, OauthCode, ContentSubmission, SubmissionEvent` (`prisma/schema.prisma`, migration `20261019000000_ai_integration`; RLS on, no policies, if this project uses Supabase)
- Tests: `vitest.config.ts`, `src/test/{fake-db.ts, server-only.ts}`, `*.test.ts` next to the code (registry, MCP tools, OAuth flow, approval → publish, instructions)

**MCP tools** (names can be adjusted; write very clear descriptions, the AI chooses tools by them): `list_content_types`, `get_content_guidelines` (ask-first list + owner's instructions + built-in rules + fields + example), `preview_content` (validates, never saves), `send_to_<project>` (validates again, saves `pending_review`, needs `user_confirmed: true`, description says: ONLY after the user explicitly confirms), `list_my_submissions`, `get_submission_status`, `list_existing_content` (duplicates, internal links), `upload_image`, and, if the content has pictures, `generate_cover_image` (picture drawn by code with `next/og`; no paid image service, no stock photos, no downloads). **No tool may publish, edit or delete live content.**

**Auth:** OAuth 2.1 (dynamic client registration, authorization code + PKCE S256, public clients only, one-time codes, rotating refresh tokens, exact redirect-URI match, revoke endpoint, discovery documents `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server`) AND personal access tokens. Tokens random 256-bit, shown once, stored as SHA-256 hashes, scopes `content:submit` / `content:read`, optional expiry, revoke works at once (look up the database on every request, no caching). Only admin accounts can authorize. The consent screen shows where the browser will return.

**Security (must-have):** server-side validation of everything; sanitise HTML/scripts/hidden characters; safe unique slugs through the admin's own action; per-connection rate limits, 3 MB body limit, 2 MB pictures checked by magic bytes (no SVG), cap of waiting drafts per admin, cap of registered OAuth clients; kill switch (env `AI_INTEGRATION=off` plus an on/off switch in the admin panel, env wins); alert to the owner on a new draft; no secrets in code (env only, `.env.example` with comments); audit log; error messages the AI can act on; nothing from the AI side touches the database directly.

## Lessons from the reference build (avoid these mistakes)
1. **CSP `form-action 'self'`** blocks a form post that redirects back to the AI tool's callback: the consent screen must use a server action that returns the URL and then `window.location.assign(url)`.
2. The **proxy/middleware matcher must not intercept `/api/*` or `/.well-known/*`**; some hosts answer `/.well-known/*` themselves: test the live URLs with curl after deploying (the token method does not need discovery).
3. The **admin login must return to the page that asked** (`?next=`), accepting only local paths (`/…`, never `//`, backslash, CR/LF).
4. The admin layout's "pending" badge count must **swallow database errors** so the admin panel keeps working before the migration is applied.
5. Use the **low-level MCP `Server`** with JSON Schemas generated from the registry (`z.toJSONSchema(schema, { io: "input" })`), build a fresh server per request (stateless), `enableJsonResponse: true`. Validate `data` yourself per content type to give precise errors; show the AI the `anyOf` of all types.
6. Keep **registry limits equal to the admin actions' limits** and add a test that reads the action source and fails when they drift.
7. Approval must call the **same server actions as the admin forms** (so slug, order, cache refresh, sitemap ping are identical); hold the submission in a transient `publishing` status so a double click cannot publish twice. Extra optional `onSave` prop on the existing admin forms for the "Edit" screen (backwards compatible).
8. **ChatGPT connector setup:** OAuth with dynamic client registration works; the "Token URL" field must stay the discovered `/api/oauth/token` address (the owner once pasted a token there, which broke it). Never paste a token into any URL field; if a token appears in a chat, revoke it.
9. `vitest@3` (vitest 5 has a peer conflict with `@types/node@20`); an in-memory fake Prisma for tests; `server-only` aliased to an empty module in vitest; reset in-memory rate limits between tests.
10. **Cover pictures** with `next/og`: glows must be background layers of the whole canvas (a glow in its own box shows a visible rectangle edge in Satori); default font only (no downloads); colours cannot follow a CSS theme.
11. Instructions can only guide the AI (it cannot be forced to ask questions); what is enforced is the form (fields, limits, enums) and the approval step. Say this honestly in the docs.
12. Migrations: write the SQL (`prisma migrate diff --from-schema old --to-schema new --script`), **do not apply it to the live database without asking me**; when I agree, apply it in one transaction and register it in `_prisma_migrations`.

## Working rules
- Small steps; **commit after each completed part**; after each part tell me what was done, what was verified, what was NOT verified, and what I need to test. Parts: 1 registry + validation + tests; 2 MCP server; 3 OAuth + tokens + AI Integrations page; 4 approval queue (AI Submissions); 5 AI Instructions + AI Guide + covers (if pictures matter); 6 security review, docs (`docs/MCP_SETUP.md` with per-client setup for Claude web/desktop, Claude Code, Cursor, ChatGPT, MCP Inspector commands, how to add a content type, revoke, troubleshooting), deployment notes.
- Work on a branch; ask me before merging to the main branch, before applying a migration to a live database, before installing packages, and before pushing (a push may deploy).
- Never print or store secrets (passwords, tokens, `.env` values) in chat, code, docs or commits.
- Run typecheck, lint, tests and a production build before saying a part is done; test the built server end to end with a temporary connection and delete it afterwards. Never claim something works that you did not run.
- Reply to me in simple Gujarati-English (romanized Gujarati mixed with English), short and concrete.

Begin with Step 0 now. Do not write code until I say "go ahead".

=== PROMPT END ===
