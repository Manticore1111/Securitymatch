CREATE TYPE "public"."InvitationStatus" AS ENUM ('SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED');
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" TYPE "public"."InvitationStatus" USING CASE WHEN "status"::text = 'PENDING' THEN 'SENT'::"public"."InvitationStatus" ELSE "status"::text::"public"."InvitationStatus" END;
ALTER TABLE "public"."Invitation" ALTER COLUMN "status" SET DEFAULT 'SENT';
