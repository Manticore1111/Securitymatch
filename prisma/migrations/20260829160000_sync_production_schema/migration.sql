-- Synchronize fields and enum values used by the current application.
ALTER TYPE "public"."DocumentStatus" ADD VALUE 'APPROVED';
ALTER TYPE "public"."JobStatus" ADD VALUE 'ASSIGNED';

BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');
ALTER TABLE "public"."Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Payment" ALTER COLUMN "status" TYPE "public"."PaymentStatus_new" USING ("status"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "public"."Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

ALTER TABLE "public"."Document" ADD COLUMN "rejectionReason" TEXT;
ALTER TABLE "public"."Invoice"
  ADD COLUMN "clientId" UUID NOT NULL,
  ADD COLUMN "commissionCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "hourlyRateCents" INTEGER NOT NULL,
  ADD COLUMN "hours" DECIMAL(8,2) NOT NULL,
  ADD COLUMN "professionalId" UUID NOT NULL,
  ADD COLUMN "vatCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."Job"
  ADD COLUMN "budgetCents" INTEGER,
  ADD COLUMN "certificates" TEXT,
  ADD COLUMN "city" TEXT NOT NULL,
  ADD COLUMN "driverLicense" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "experience" TEXT,
  ADD COLUMN "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "negotiable" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "ownTransport" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "postalCode" TEXT NOT NULL,
  ADD COLUMN "securityCount" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "specializations" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "street" TEXT NOT NULL;
ALTER TABLE "public"."JobApplication"
  ADD COLUMN "availability" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "relevantExperience" TEXT;
ALTER TABLE "public"."Payment"
  ADD COLUMN "checkoutSessionId" TEXT,
  ADD COLUMN "platformFeeCents" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "professionalAmountCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "public"."Review" ADD COLUMN "dimensions" JSONB;
ALTER TABLE "public"."SecurityProfile"
  ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "stripeAccountId" TEXT;

CREATE UNIQUE INDEX "Payment_checkoutSessionId_key" ON "public"."Payment"("checkoutSessionId");
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
