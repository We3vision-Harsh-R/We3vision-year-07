# 28 — Admin access (RBAC): three master admins + team members (owner, 2026-11-28, tasks 167 and 168)

## The rule
- **Master admins** are fixed in the code: `admin@we3vision.com`, `harsh@we3vision.com`, `parth@we3vision.com`
  (list `MASTER_ADMINS` in `src/lib/admin-access.ts`). They open every screen and Admin access, nobody can remove them (not even each other),
  and they need nobody's permission. A database row alone can never make somebody a master admin.
- **Team members** are every other login. A master admin adds them in **Admin access → Logins → "Add a new user"** (name, e-mail, password;
  a "Make a password" button fills a random 16-character password). A new user sees only the dashboard until a master admin ticks screens for
  them in **"Who can open what"**.
- **Only `@we3vision.com` e-mail addresses** can get a login or sign in (`isCompanyEmail`, domain `ADMIN_DOMAIN`). To allow another domain,
  change that one rule on purpose (it is also used by `lib/ai-content/server/tokens.ts` and the login page text).
- A row in `AdminUser` with an e-mail of another domain cannot sign in (Admin access shows it in an amber box with a Remove button).

History: task 167 (v205) made it three fixed accounts (Admin@ and Harsh@ master, Parth@ member). Task 168 (owner asked): Parth@ became a master
admin too, and the "only three accounts" limit was replaced by "any company e-mail added by a master admin".

## How it works
- **Screens** = the menu items of `components/admin/admin-menu.ts`; each has an `area` (16 of them: projects, blog, team, settings, training, visitors,
  careers, jobs, setup, leads, alerts, ai-submissions, ai-instructions, ai-integrations, ai-guide, versions). `access` (Admin access) is `superOnly`.
- **Rights of the team members** are stored in the table `Setting`, key `admin-access`: `{ grants: { "rina@we3vision.com": ["blog", ...] } }`
  (no migration). Masters have no row (a row for a master is dropped). Pure logic + tests: `lib/admin-grants.ts` (`cleanGrants`, `resolveAccess`,
  `canOpen`), `lib/admin-grants.test.ts`. Read/write: `lib/admin-permissions.ts` (`readGrants`, `saveGrants`, `dropGrants`).
- **Session**: `getAdmin()` (lib/auth.ts) returns `{ id, email, name, isSuper, areas }`; the rights are read on every request, so a change works at the
  next click (no new login). A deleted user loses the session at once (the row is looked up by id every request).
- **Enforcement (defence in depth)**: every admin PAGE and every admin SERVER ACTION calls `requireArea("<screen>")` (not `requireAdmin()`); a screen
  that is not allowed redirects to `/admin?denied=<screen>` (the dashboard shows a yellow note). Admin access pages/actions call `requireSuperAdmin()`
  (= a master admin). `requireAdmin()` stays only for the dashboard, the layout and the upload route (a member with no screen cannot upload).
  Previews of AI drafts need `ai-submissions`; the OAuth connect page needs `ai-integrations`.
- **UI**: sidebar (`admin-nav.tsx`) and dashboard (`dashboard-view.tsx`, `app/admin/(panel)/page.tsx`) show and query only what the admin may open.
  Admin access (`/admin/access`, `access-panel.tsx`): master admins (new password), team members (new password, Remove), "Add a new user",
  the table "Who can open what" (one column per team member), the login picture.
- **Actions** (`actions/admin-access.ts`, all `requireSuperAdmin`): `createAdminUser({name,email,password})`, `setAdminPassword`, `deleteAdminUser`
  (refuses masters and yourself), `saveAdminAccess` (keeps only existing team members), `saveLoginImage`.
- **No inherited rights**: removing a login forgets its saved screens (`dropGrants`), and creating a login starts with none, so a new person with an
  old e-mail never gets the old rights.
- **Colours on the hiring board**: `listAdmins()` (lib/admin-users.ts) lists logins oldest first, so a new person gets the next colour and nobody else's
  colour changes.
- Passwords: a master can set the password of any login (recovery). A team member cannot reach the screen.

## When something goes wrong
- **Locked out / master login missing**: run `npm run db:seed` with `ADMIN_EMAIL` = one of the three master addresses and `ADMIN_PASSWORD`
  (12+ characters) in `.env` (the seed refuses any other address). Then sign in and add the others in Admin access.
- **A new screen** must get an `area` in `admin-menu.ts` AND `requireArea("<area>")` in its page and in its server actions (grep `requireAdmin` to check).
- Nothing in `proxy.ts` knows about rights (it only checks the signed cookie); the rights are checked in the pages and actions.
- **A new master admin** = add a line to `MASTER_ADMINS` (a code change + release). The login itself is still made in Admin access ("No login created yet").

## Not done / caveats
- Not tried with a real login (the admin is login-gated): checked with unit tests (`admin-grants.test.ts`, `actions/admin-access.test.ts`), tsc, eslint
  and the real components on a temporary sample-data route.
- A team member cannot change their own password (only a master can).
- A master can set another master's password (kept on purpose: recovery without anybody's help).
