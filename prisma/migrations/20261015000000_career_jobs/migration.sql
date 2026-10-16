-- Job openings: the position gets its own content and page; the application knows where it came from.
ALTER TABLE "CareerRole"
  ADD COLUMN "slug" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "summary" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "responsibilities" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "requirements" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "perks" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "location" TEXT NOT NULL DEFAULT 'Surat, India',
  ADD COLUMN "workType" TEXT NOT NULL DEFAULT 'Full-time',
  ADD COLUMN "workMode" TEXT NOT NULL DEFAULT 'On-site',
  ADD COLUMN "experience" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "openings" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "salary" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "closesAt" TEXT NOT NULL DEFAULT '';

UPDATE "CareerRole" SET "slug" = trim(both '-' from lower(regexp_replace("title", '[^a-zA-Z0-9]+', '-', 'g'))) WHERE "slug" = '';
UPDATE "CareerRole" SET "slug" = 'position-' || substr("id", 1, 8) WHERE "slug" = '';
UPDATE "CareerRole" r SET "slug" = r."slug" || '-' || substr(r."id", 1, 5)
  WHERE r."id" IN (SELECT "id" FROM (SELECT "id", row_number() OVER (PARTITION BY "slug" ORDER BY "createdAt", "id") AS rn FROM "CareerRole") t WHERE t.rn > 1);

CREATE UNIQUE INDEX "CareerRole_slug_key" ON "CareerRole"("slug");

ALTER TABLE "CareerApplication" ADD COLUMN "source" TEXT NOT NULL DEFAULT 'ticket';
CREATE INDEX "CareerApplication_roleId_idx" ON "CareerApplication"("roleId");
