-- AlterEnum
ALTER TYPE "public"."JobStatus" ADD VALUE 'CONFIRMED';

-- AlterTable
ALTER TABLE "public"."ClientProfile" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "kvkNumber" TEXT;
