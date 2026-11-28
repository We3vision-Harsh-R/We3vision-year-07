-- Industrial Training: a job can carry the "Industry training available" tag (CareerRole.training).
ALTER TABLE "CareerRole" ADD COLUMN IF NOT EXISTS "training" BOOLEAN NOT NULL DEFAULT false;
