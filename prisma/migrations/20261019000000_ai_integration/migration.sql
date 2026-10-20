-- CreateTable
CREATE TABLE "AiConnection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'token',
    "adminId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tokenHint" TEXT NOT NULL DEFAULT '',
    "refreshHash" TEXT,
    "accessExpiresAt" TIMESTAMP(3),
    "scopes" TEXT NOT NULL DEFAULT 'content:submit content:read',
    "clientId" TEXT NOT NULL DEFAULT '',
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "redirectUris" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OauthClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OauthCode" (
    "codeHash" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "redirectUri" TEXT NOT NULL,
    "codeChallenge" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OauthCode_pkey" PRIMARY KEY ("codeHash")
);

-- CreateTable
CREATE TABLE "ContentSubmission" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "connectionId" TEXT,
    "connectionName" TEXT NOT NULL DEFAULT '',
    "reviewedBy" TEXT NOT NULL DEFAULT '',
    "reviewedAt" TIMESTAMP(3),
    "rejectReason" TEXT NOT NULL DEFAULT '',
    "entityId" TEXT NOT NULL DEFAULT '',
    "entitySlug" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionEvent" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiConnection_tokenHash_key" ON "AiConnection"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "AiConnection_refreshHash_key" ON "AiConnection"("refreshHash");

-- CreateIndex
CREATE INDEX "AiConnection_adminId_idx" ON "AiConnection"("adminId");

-- CreateIndex
CREATE INDEX "OauthCode_expiresAt_idx" ON "OauthCode"("expiresAt");

-- CreateIndex
CREATE INDEX "ContentSubmission_status_createdAt_idx" ON "ContentSubmission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContentSubmission_connectionId_idx" ON "ContentSubmission"("connectionId");

-- CreateIndex
CREATE INDEX "SubmissionEvent_submissionId_at_idx" ON "SubmissionEvent"("submissionId", "at");

-- AddForeignKey
ALTER TABLE "AiConnection" ADD CONSTRAINT "AiConnection_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSubmission" ADD CONSTRAINT "ContentSubmission_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "AiConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionEvent" ADD CONSTRAINT "SubmissionEvent_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ContentSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row level security on, no policies: the Supabase public API cannot read these tables, only this server can (same as every other table).
ALTER TABLE "AiConnection" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OauthClient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OauthCode" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SubmissionEvent" ENABLE ROW LEVEL SECURITY;
