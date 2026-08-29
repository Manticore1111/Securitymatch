-- Add fields required by the current authentication and registration flows.
ALTER TABLE "public"."User"
ADD COLUMN "username" TEXT,
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" TEXT;

CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");
