# Member accounts, public blog submission, profile tracking and admin RBAC (design)

Date: 2026-10-23. Owner request (romanized Gujarati) in one message; decisions taken in chat on 2026-10-22/23. Parts 3 + 4 (blog SEO checker, AI blog instructions) are already built (task 117) and are only reused here.

## Goal
Anyone can make a **member account with a mobile number (OTP)**, write a **technology blog** on We3vision under their own name, see its status, and follow their **career applications** in a profile. Admins review everything in the admin panel. Members never get any admin access. Separately, admin users get **roles and permissions (RBAC)**.

## Decisions (owner)
- A blog can only be sent by a logged-in member (account compulsory). No guest posting.
- Sign-up: first name, last name, mobile number, password, OTP by SMS. Login: mobile + password.
- OTP provider: no permanent free production OTP service exists in India (only test credits, DLT registration needed for live). Built behind `lib/sms.ts`; until the owner picks a provider, **dev: OTP printed in the server log; production: sign-up is switched off** (never an OTP bypass).
- Database migration for the new tables/columns is applied to the live DB by script after the owner's OK (same way as earlier migrations: never `prisma migrate deploy`, see brain/09).
- Deleting an account removes personal data (mobile, password, name on the account) but published blogs stay (author name stays as printed).
- Topics are technology only. Topic "ideas" are shown as ideas, never as "trending" (no trend data exists).

## Phases (each ends with tsc + eslint + vitest + `next build`, then push)
- **A. Accounts**: tables `Member`, `OtpCode`; sign-up / login / forgot password / logout; SMS adapter; cookie `w3_member`; rate limits.
- **B. Public blog submission**: `/blog/write`, tech-topic list, SEO panel + topic ideas, author fields, slug `<title>-by-<first>-<last>-we3vision`, approval in the existing AI Submissions queue (source = member).
- **C. Profile + menu**: `/account` (my blogs, my applications with stage, settings, delete account); "My Account" in the Explore column of the mega menu; link applications by `memberId` and by verified phone.
- **D. Admin**: Admin > Members (list, block, their blogs), then RBAC (roles, permission matrix, per-user overrides, audit log, `requirePermission`).

## Data model (one migration `20261023000000_members`)
```
Member      id, phone (unique, +91XXXXXXXXXX), firstName, lastName, passwordHash, phoneVerifiedAt,
            status ("active"|"blocked"), createdAt, lastLoginAt, deletedAt?
OtpCode     id, phone, codeHash, purpose ("signup"|"reset"), expiresAt, attempts, usedAt?, createdAt, ip
BlogPost    + authorId String?  (Member id, no FK so a deleted member keeps the post), authorName String @default("")
ContentSubmission + memberId String?, source String @default("ai")  ("ai" | "member"); connectionName holds the author label
CareerApplication + memberId String? (index)
```
Admin roles and the audit log live in table `Setting` (keys `adminRoles`, `auditLog`): no migration for part D.

## Accounts (A)
- Phone normalised to E.164, default country India (+91, 10 digits starting 6-9). Other countries are not accepted in the first version.
- Password: min 10 chars, bcrypt (cost 12), no hint of which part was wrong on login.
- OTP: 6 digits, 5 minutes, stored as SHA-256 + pepper (`SESSION_SECRET`), 5 wrong tries kill the code. Limits: 3 sends per phone per hour, 10 per IP per day, 1 per 45 s. Same answer for "known" and "unknown" phone where possible.
- Session: JWT cookie `w3_member` (httpOnly, sameSite lax, 30 days), password fingerprint inside (a password change logs out other devices), blocked/deleted members are rejected on every request. `proxy.ts` and `requireAdmin` know nothing about it.
- Consent checkbox (privacy notice) at sign-up. Honeypot field on the forms.
- `lib/sms.ts`: `sendOtp(phone, code)`; providers `console` (dev), `2factor`, `msg91` chosen by `SMS_PROVIDER` (+ keys in env, never in code). Provider errors raise an alert.

## Public blog (B)
- `/blog/write` and `/account/blogs/[id]/edit`: title, topic (select from `TECH_TOPICS`), summary, article (same light markup), tags, FAQ, cover (optional upload of an image, members only, 2 MB; empty = branded cover drawn by code as for AI posts).
- Tech filter: `lib/blog-topics.ts` has the topic list and a tech-word dictionary; an article with too few tech words is refused with a clear message (the admin review is the final check).
- The SEO panel (`blog-seo.ts`) runs live in the form with a public look; submit needs no minimum score but the panel shows what to fix. Topic ideas per topic are static suggestions.
- Submit creates a `ContentSubmission` (type blog, source member, memberId, status pending_review). Limits: 3 per day, 5 waiting per member. Content is cleaned with `ai-content/sanitize`.
- Approve (admin) publishes through the normal `createBlogPost` with `authorId/authorName` and slug `<title>-by-<first>-<last>-we3vision` (80 chars max for the title part, unique suffix when taken). The article page prints "By <name>" and Article JSON-LD uses `Person` for members, `Organization` for We3vision posts.
- The admin queue shows the author, a masked mobile (+91 98XXXXX210), the SEO score and the usual Edit / Approve / Reject (reason is shown to the member).

## Profile (C)
- `/account` (login needed, else `/account/login`): Overview, My blogs (Pending / Live with link / Rejected with reason, edit and resubmit), My applications, Settings (name, password, delete account).
- My applications: job title, date, current stage on a timeline from the hiring pipeline (`PIPELINE` in `hiring-shared.ts`: New, Contacted, Shortlisted, Interview, Offer sent, Hired, On hold, Not now). Never shown: HR notes, rating, tags, assignee, interview place. Interview date/time is shown only when HR set one.
- Link: an application made while logged in gets `memberId`; at sign-up the verified phone claims earlier applications with the same normalised phone.
- Mega menu: `EXPLORE_LINKS` gets "My Account" (`/account`).

## Admin (D)
- Admin > Members: list (name, masked phone, status, joined, blogs, applications), block / unblock, open the member's submissions.
- RBAC: permissions catalog (module x action), built-in roles Owner / Editor / HR / Support / AI Reviewer / Viewer, custom roles, per-user allow/deny overrides, "who can do what" screen, audit log (login, role change, publish, delete, token, approve), `requirePermission("blog.edit")` at the top of every admin page and action, menu and dashboard filtered, 403 page. Every existing admin becomes Owner on first run; the last Owner cannot be removed.

## Security and privacy
- Members and admins are separate tables and cookies; no code path turns a member into an admin.
- All forms: server-side validation, rate limits, honeypot, no HTML in blog text (the existing markup parser), uploads restricted to member + image type + size.
- Personal data: mobile and names only; DPDP notice; delete account; OTP codes older than 1 day are removed when a new one is made.
- Alerts (`raiseAlert`) for SMS provider failures and for floods.

## Testing
vitest for: phone normalisation, OTP rules (expiry, tries, limits), slug rule, tech filter, permissions resolution, member/admin separation. `tsc`, eslint, `next build`. Browser check of sign-up/login/profile in dev (OTP from the log). Not testable here: a real SMS provider, a real phone.

## Not in this version
Social login, e-mail verification, comments, member avatars, paid/featured posts, mobile (phone) app pages for the new screens (desktop only, owner rule), foreign phone numbers.
