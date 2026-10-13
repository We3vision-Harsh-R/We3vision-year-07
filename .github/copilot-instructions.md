# We3vision website — Copilot instructions

This is the production website + admin CMS of We3vision Private Limited (Next.js 16, React 19, Tailwind 4, Prisma 7, Supabase).
Before suggesting or editing code, read `AGENTS.md` and the `brain/` folder (`brain/README.md` index, `brain/00-START-HERE.md`,
`brain/02-rules-and-preferences.md`, `brain/05-design-system.md`).

Key rules: change only what the task names; the Home page `/` and the locked sections are not to be edited; desktop/laptop only;
Poppins; paragraphs >= 16px; never hard-code violet/pink colours (use `hsl(calc(var(--th) + N) calc(S% * var(--ts)) L%)`); new CSS goes
in `src/app/globals.css` with a new unique class prefix; do not commit, push or build unless asked; never expose secrets.
