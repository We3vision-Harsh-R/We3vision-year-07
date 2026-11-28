# 28 — Admin access (RBAC): three accounts, two master admins (owner, 2026-11-28, task 167)

## The rule
The admin panel has **exactly three logins**. Nobody else can sign in, be created or be listed; a leftover row of another e-mail in the
table `AdminUser` is ignored everywhere (Admin access shows it in an amber "cannot sign in" box with a Remove button).

| Account | Role | Opens |
|---|---|---|
| `admin@we3vision.com` | **Master admin** | every screen + Admin access; cannot be removed by anybody |
| `harsh@we3vision.com` | **Master admin** | every screen + Admin access; cannot be removed by anybody |
| `parth@we3vision.com` | Team member | only the screens a master admin ticked for him; the dashboard is open to all |

(The owner wrote "harsh@w3vision.com" once; taken as a typo of `harsh@we3vision.com`.) The list lives in ONE place:
`src/lib/admin-access.ts` (`ADMIN_ACCOUNTS`, `master: true/false`). To add a person or change a role, edit that list on purpose.

## How it works
- **Screens** = the menu items of `components/admin/admin-menu.ts`; each has an `area` (16 of them: projects, blog, team, settings, training, visitors,
  careers, jobs, setup, leads, alerts, ai-submissions, ai-instructions, ai-integrations, ai-guide, versions). `access` (Admin access) is `superOnly`.
- **Rights of the team member** are stored in the table `Setting`, key `admin-access`: `{ grants: { "parth@we3vision.com": ["blog", ...] } }`
  (no migration). Masters have no row. Pure logic + tests: `lib/admin-grants.ts` (`cleanGrants`, `resolveAccess`, `canOpen`), `lib/admin-grants.test.ts`.
- **Session**: `getAdmin()` (lib/auth.ts) returns `{ id, email, name, isSuper, areas }`; the rights are read on every request, so a change works at the
  next click (no new login). Only the three e-mails pass (`isAllowedAccount`), also at the login form (`actions/auth.ts`) and in the seed.
- **Enforcement (defence in depth)**: every admin PAGE and every admin SERVER ACTION calls `requireArea("<screen>")` (not `requireAdmin()`); a screen
  that is not allowed redirects to `/admin?denied=<screen>` (the dashboard shows a yellow note). Admin access pages/actions call `requireSuperAdmin()`
  (= a master admin). `requireAdmin()` stays only for the dashboard, the layout and the upload route (a member with no screen cannot upload).
  Previews of AI drafts need `ai-submissions`; the OAuth connect page needs `ai-integrations`.
- **UI**: sidebar (`admin-nav.tsx`) and dashboard (`dashboard-view.tsx`, `app/admin/(panel)/page.tsx`) show and query only what the admin may open.
  Admin access (`/admin/access`, `access-panel.tsx`): the three accounts (create a missing login, new password, remove Parth), the table "Who can open
  what", the login picture.
- **Nobody can remove a master**: `deleteAdminUser` refuses Admin@ and Harsh@ (and yourself); the UI hides Remove for them. Passwords: a master can set
  any password (recovery), a team member cannot reach the screen.

## When something goes wrong
- **Locked out / account missing**: run `npm run db:seed` with `ADMIN_EMAIL` = one of the three addresses and `ADMIN_PASSWORD` (12+ characters) in `.env`
  (the seed refuses any other address). Then sign in and use Admin access to create the other logins.
- **A new screen** must get an `area` in `admin-menu.ts` AND `requireArea("<area>")` in its page and in its server actions (grep `requireAdmin` to check).
- Nothing in `proxy.ts` knows about rights (it only checks the signed cookie); the rights are checked in the pages and actions.

## Not done / caveats
- Not tried with a real login (the admin is login-gated): checked with unit tests, tsc, eslint and the real components on a temporary sample-data route.
- A team member cannot change his own password (only a master can).
