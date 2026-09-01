CREATE TABLE "RegistrationEmailVerification" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "verificationTokenHash" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verifiedAt" TIMESTAMP(3),
    "consumedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RegistrationEmailVerification_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RegistrationEmailVerification_email_key" ON "RegistrationEmailVerification"("email");
CREATE UNIQUE INDEX "RegistrationEmailVerification_verificationTokenHash_key" ON "RegistrationEmailVerification"("verificationTokenHash");
CREATE INDEX "RegistrationEmailVerification_expiresAt_idx" ON "RegistrationEmailVerification"("expiresAt");