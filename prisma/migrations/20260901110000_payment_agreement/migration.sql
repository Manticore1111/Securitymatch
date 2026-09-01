-- Create payment agreement audit fields
ALTER TABLE "Payment" ADD COLUMN "agreementAcceptedAt" TIMESTAMP(3);
ALTER TABLE "Payment" ADD COLUMN "agreementVersion" TEXT;
