-- CreateTable
CREATE TABLE "RegistrationAttempt" (
    "id" UUID NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "role" "UserRole",
    "reason" TEXT NOT NULL,
    "ipAddress" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "RegistrationAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistrationAttempt_createdAt_idx" ON "RegistrationAttempt"("createdAt");
CREATE INDEX "RegistrationAttempt_email_createdAt_idx" ON "RegistrationAttempt"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "RegistrationAttempt" ADD CONSTRAINT "RegistrationAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
