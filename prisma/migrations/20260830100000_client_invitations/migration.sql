CREATE TABLE "public"."Invitation" (
    "id" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "professionalId" UUID NOT NULL,
    "message" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Invitation_jobId_professionalId_key" ON "public"."Invitation"("jobId", "professionalId");
CREATE INDEX "Invitation_clientId_status_idx" ON "public"."Invitation"("clientId", "status");
CREATE INDEX "Invitation_professionalId_status_idx" ON "public"."Invitation"("professionalId", "status");
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;