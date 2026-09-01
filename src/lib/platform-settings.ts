import { prisma } from "@/lib/prisma";

export const defaultPlatformCommissionPercent = 10;
export const introductoryPlatformCommissionPercent = 5;
const platformCommissionKey = "platform_commission_percent";

export async function getPlatformCommissionPercent() {
  const setting = await prisma.platformSetting.upsert({
    where: { key: platformCommissionKey },
    update: {},
    create: {
      key: platformCommissionKey,
      value: defaultPlatformCommissionPercent,
      description: "Platformcommissie voor Stripe Connect-betalingen",
    },
  });
  const percent = Number(setting.value);

  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error("Ongeldige platformcommissie.");
  }

  return percent;
}
