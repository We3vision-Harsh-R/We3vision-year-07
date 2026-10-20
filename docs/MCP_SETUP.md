# AI integration (MCP): setup and use

AI tools (Claude, Claude Code, Cursor, ChatGPT …) can write **blog articles** and **job openings** for the We3vision website through a private MCP server at

```
https://<your-site>/api/mcp
```

> Everything below can also be done without a developer, inside the admin panel: **Admin → AI Guide** explains where to do what in plain words, **AI Integrations** manages connections, tools and the on/off switch, **AI Submissions** is the approval queue.

**Nothing an AI sends goes live.** It arrives in **Admin → AI Submissions** as "Pending approval". An admin previews it, can edit it, and approves (it goes live through the normal Blog / Careers save logic) or rejects it (kept with a reason, never shown).

```
AI tool ──(OAuth sign-in or token)──► /api/mcp ──► validated against the registry ──► "Pending approval"
                                                                                         │
                                  Admin → AI Submissions: preview · edit · Approve & Publish · Reject
```

An AI tool has no tool to publish, edit or delete live content. The only writes it can do are *create a pending submission* and *upload a picture file*.

---

## 1. One-time setup on the server

1. **Apply the database migration** `prisma/migrations/20261019000000_ai_integration/migration.sql` (5 new tables: `AiConnection`, `OauthClient`, `OauthCode`, `ContentSubmission`, `SubmissionEvent`). It is not run automatically on deploy. Apply it the same way as the earlier ones (the `pg` script from `brain/07-workflow-and-tools.md`, then the row in `_prisma_migrations`). Do this **before** the new code is deployed, or the AI pages of the admin panel show an error (the rest of the admin keeps working).
2. **Environment variables** (Hostinger → Node.js app → Environment variables). No secret is needed. The ones that matter:
   | Name | Meaning |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | The public address, `https://www.we3vision.com` (already used by the sitemap). The MCP and sign-in links are built from it. It must be `https`. |
   | `AI_INTEGRATION` | `off` forces the whole integration off (MCP, tool sign-in, tokens); the admin panel cannot switch it on again. Empty = the admin panel decides (Admin → AI Integrations → "Block all AI tools" / "Allow AI tools"). |
   | `ALERT_AI` | `off` forces the WhatsApp message "new AI draft is waiting" off. Empty = the tick box in Admin → AI Integrations decides. |
3. **Deploy.** Nothing else is needed: the endpoint is a normal Next.js route (`src/app/api/mcp/route.ts`), stateless, no extra port, no WebSocket.
4. **Check the three addresses** after deploying (replace the host):
   ```bash
   curl -i https://www.we3vision.com/.well-known/oauth-protected-resource
   curl -i https://www.we3vision.com/.well-known/oauth-authorization-server
   curl -i -X POST https://www.we3vision.com/api/mcp        # must answer 401 with a WWW-Authenticate header
   ```
   The first two must answer `200` with JSON. If the hosting panel (Apache/LiteSpeed) answers `/.well-known/...` itself (it is used for SSL checks), the OAuth sign-in of Claude cannot find the server: ask Hostinger to let the Node.js app answer `/.well-known/oauth-*`, or use the token method (section 2b), which needs no discovery.
5. The rate limits (120 requests/minute per connection, 10 sends/hour, 20 uploads/hour) are kept in the memory of the Node process. That is right for one Node process (Hostinger); they reset when the app restarts.

## 2. Connect a tool

### 2a. Claude (web or desktop) and other OAuth tools: no token needed

1. In **Claude**: *Settings → Connectors → Add custom connector*. Name: `We3vision`. URL: `https://www.we3vision.com/api/mcp`.
2. Claude opens the website. Log in with your admin account (@we3vision.com). A consent screen says what the tool can do (send drafts for approval, read lists; never publish). Press **Allow**.
3. The connection appears in **Admin → AI Integrations** (type "signed in (OAuth)"). Access tokens last 1 hour and renew by themselves; a connection that is not used for 90 days ends.

ChatGPT (developer mode → *Connectors → Create*) works the same way: give the URL, choose OAuth.

### 2b. Tools that use a header (Claude Code, Cursor, scripts)

1. **Admin → AI Integrations → Create a connection.** Give it a name (for example "Claude laptop"), choose the permissions and how long it lasts, press *Create connection*.
2. Copy the **MCP URL** and the **token** (shown **once**; only a hash is stored). The page also shows ready-made commands.

**Claude Code** (terminal):
```bash
claude mcp add --transport http we3vision https://www.we3vision.com/api/mcp --header "Authorization: Bearer <TOKEN>"
claude mcp list
```
(Or without a token: `claude mcp add --transport http we3vision https://www.we3vision.com/api/mcp`, then run `/mcp` inside Claude Code and choose *Authenticate*.)

**Cursor** – `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (all projects):
```json
{
  "mcpServers": {
    "we3vision": {
      "url": "https://www.we3vision.com/api/mcp",
      "headers": { "Authorization": "Bearer <TOKEN>" }
    }
  }
}
```

**Any other MCP client** that supports *Streamable HTTP*: URL `https://www.we3vision.com/api/mcp`, header `Authorization: Bearer <TOKEN>`.

## 3. The workflow, with example prompts

> **You:** Write a blog about 3D web design trends in 2026.
>
> The AI calls `get_content_guidelines` and `list_existing_content` (to avoid a duplicate and reuse a topic label), drafts the article with exactly the fields of the admin form, and calls `preview_content`. It shows you the preview.
>
> **You:** Make the intro shorter and add two FAQ questions.
>
> **You:** Good. Send it to We3vision.
>
> The AI calls `send_to_we3vision` (only now, because you said so) and gives you the submission id and the admin link.

More prompts:
- "Create a job post for a Senior UI/UX Designer, 3–5 years, on-site in Surat. Use only the facts I gave you."
- "Show my submissions" → `list_my_submissions`.
- "What happened to the 3D article?" → `get_submission_status` (approved with the live address, or rejected with the reason you wrote).
- "Use this picture as the cover" (attach a picture) → `upload_image`, then the `cover` field.

Then in the admin panel: **AI Submissions** (the menu shows a number of waiting drafts; the owner also gets a WhatsApp alert if alerts are on).
- **Preview** is the real site page (the same components as the live page), field-by-field view, and the history (who sent / edited / approved / rejected, and when).
- **Edit in the normal form** opens the usual Blog or Job form filled with the draft. Saving keeps the change in the submission; nothing is live yet.
- **Approve & Publish** calls the same save actions as the Blog / Careers forms (address, list order, cache refresh), then tells Bing/Google (IndexNow, sitemap).
- **Save as a normal draft (hidden)** puts it in the normal Blog / Careers list, hidden, to publish later from there.
- **Reject** needs a reason; the AI tool can read it.

### The tools

| Tool | What it does | Writes? |
|---|---|---|
| `list_content_types` | Types, fields, limits, JSON Schema | no |
| `get_content_guidelines` | Voice, SEO and format rules + a valid example | no |
| `preview_content` | Validates a draft, returns the preview and errors | no |
| `send_to_we3vision` | Saves a **pending** submission (needs `user_confirmed: true`) | pending submission only |
| `list_my_submissions`, `get_submission_status` | Status of what was sent | no |
| `list_existing_content` | Existing articles / jobs, for duplicates and internal links | no |
| `upload_image` | Stores a JPG/PNG/WEBP/GIF (2 MB max) in the media library | a file |

Permissions: `content:submit` (send, upload) and `content:read` (lists, status). `list_content_types`, `get_content_guidelines` and `preview_content` need either.

> **MCP Apps UI (a preview card with a "Send" button inside the AI client)** is not built yet. The plain tool flow above works in every client: the AI shows the preview as text and asks you to confirm.

## 4. Test it

**Unit tests** (registry validation, MCP tools, OAuth flow, approval → publish):
```bash
npm test
```

**MCP Inspector** (official debugger). Make a token first (2b), then:
```bash
npx @modelcontextprotocol/inspector
```
In the page that opens: *Transport Type* = **Streamable HTTP**, *URL* = `https://www.we3vision.com/api/mcp` (or `http://localhost:1010/api/mcp` with `npm run dev`), *Authentication* → header `Authorization` = `Bearer <TOKEN>`, press **Connect**, then *Tools → List Tools* and run `list_content_types`, `preview_content`, …

Command-line form (flags can differ between Inspector versions; `npx @modelcontextprotocol/inspector --cli --help` shows them):
```bash
npx @modelcontextprotocol/inspector --cli https://www.we3vision.com/api/mcp --transport http --header "Authorization: Bearer <TOKEN>" --method tools/list
```

**Plain curl** (works everywhere):
```bash
curl -s https://www.we3vision.com/api/mcp \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## 5. Add a new content type (portfolio, case study, testimonial, event …)

The registry is the single source of truth. A new type needs **one registry entry plus three small mappings**; the MCP tools, JSON Schemas, validation, queue and previews pick it up by themselves. TypeScript refuses to compile until every mapping exists.

1. **Registry entry** – copy `src/lib/ai-content/definitions/career.ts` to `definitions/<type>.ts` and change it:
   - `key`, `label`, `description`.
   - `fields`: one object per field of the admin form: `name`, `label`, `kind` (`text`, `longtext`, `markup`, `enum`, `int`, `date`, `image`, `list`, `qa`, `boolean`), `required`, limits (`max`, `options`, …) and `help` (what the AI should write). Use the **same limits as the admin save action**.
   - `guidelines` (brand voice, SEO, formatting), `example` (a valid draft).
   - `toAdminInput(data, publish)`: the draft → the input the admin form's save action expects (`publish: false` = save hidden). `toFormValues` / `fromFormValues`: the draft ↔ the values of the admin form. `slugOf`, `livePath`, `listPath`, `preview`.
2. **Register it** in `src/lib/ai-content/registry.ts` → add it to `CONTENT_TYPES`.
3. **Three mappings** (TypeScript errors point at each one):
   - `src/lib/ai-content/server/adapters.ts` → `listExisting` (how to list what already exists, for duplicates).
   - `src/lib/ai-content/server/publish.ts` → call the admin's own server action (it returns the id and slug).
   - `src/app/(site)/preview/submission/page.tsx` → render the draft with the real public component; and `src/components/admin/submission-edit-form.tsx` → the admin form with `onSave`. The form needs the optional `onSave` prop (see `BlogForm` / `JobForm`).
4. **Test** – add the type to `registry.test.ts` (the example must validate; add a line to the "limits still match" block if the action has inline limits).

No MCP code changes: `tools.ts` builds its schemas and descriptions from `CONTENT_TYPES`.

## 6. Revoke access

- **One connection:** Admin → AI Integrations → **Revoke**. It stops working on the very next request (tokens are looked up in the database every time; nothing is cached).
- **All connections at once:** Admin → AI Integrations → **Revoke all**.
- **Block all AI tools for a while:** Admin → AI Integrations → **Block all AI tools** (the endpoint answers 503; connections stay; **Allow AI tools** turns it on again). Hard stop from the server: set `AI_INTEGRATION=off` and restart the Node app.
- **Forget a tool that signed in (Claude, Cursor …):** Admin → AI Integrations → Tools that signed in → **Remove tool**.
- **A lost token:** revoke that connection. A tool that signed in with OAuth can also be revoked here; its refresh token dies with it.
- Deleting an admin user deletes their connections. A connection whose admin is no longer a `@we3vision.com` account is refused.

## 7. Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Claude says it cannot connect / discovery fails | `/.well-known/oauth-protected-resource` does not answer 200 JSON (see 1.4). `NEXT_PUBLIC_SITE_URL` is not the real https address. |
| After "Allow" the browser does not return to the tool | The tool's return address is not allowed (only https, localhost, or an app link). Remove the connection in the tool and add it again. |
| `401` from `/api/mcp` | Wrong/revoked/expired token. Make a new connection. For OAuth tools: reconnect. |
| "This connection does not have the content:submit permission" | The connection was made with read-only permission. Create a new one with *Send drafts for approval*. |
| "Not sent: the draft has errors" | The message lists the field and the limit (for example `summary: too long (412), the limit is 300`). The AI should fix and retry. |
| "30 drafts are already waiting" | The queue limit. Approve or reject some in AI Submissions. |
| `429` / "Too many requests" | Rate limit; wait a little (sending: 10 per hour per connection). |
| The AI pages of the admin panel show an error | The migration (1.1) is not applied yet. |
| Picture rejected | Only JPG, PNG, WEBP, GIF, 2 MB at most. SVG is not accepted. |
| An approved article is not visible yet | The site refreshes the pages at once; check `/blog`. The sitemap updates within an hour. |

## 8. Security summary

- Tokens are random (256 bit), shown once, stored as SHA-256 hashes, revocable at once, scoped, with an optional end date. OAuth uses PKCE (S256), one-time codes (10 minutes), refresh tokens that rotate, and exact return-address matching. The consent screen shows where the browser will return.
- Every draft is cleaned (HTML, scripts and hidden characters are removed) and **rejected** (not silently cut) when it breaks a limit. The website never renders raw HTML; links in pictures must be `/media/<id>` or https.
- The AI has no database access and no publishing tool; only an admin who is logged in can approve, through the same actions as the admin forms. Everything is in an audit log (the history on each submission).
- Per-connection rate limits, a 3 MB request limit, a 30-draft queue limit, a cap on registered tools, a failed-token limit per address, CORS without credentials (cookies are never used on `/api/mcp`).
