import { prisma } from "@/lib/prisma";

function firstHeader(request: Request | undefined, names: string[]) {
  for (const name of names) {
    const value = request?.headers.get(name)?.trim();
    if (value) return value;
  }
  return null;
}

export async function recordLoginAttempt({
  request,
  identifier,
  userId,
  successful,
}: {
  request?: Request;
  identifier: string;
  userId?: string;
  successful: boolean;
}) {
  try {
    const forwardedFor = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    await prisma.loginAttempt.create({
      data: {
        identifier: identifier.slice(0, 255),
        userId,
        successful,
        ipAddress: (forwardedFor || request?.headers.get("x-real-ip") || null)?.slice(0, 64),
        city: firstHeader(request, ["x-vercel-ip-city", "x-geo-city"]),
        region: firstHeader(request, ["x-vercel-ip-country-region", "x-geo-region"]),
        country: firstHeader(request, ["x-vercel-ip-country", "x-geo-country"]),
        userAgent: request?.headers.get("user-agent")?.slice(0, 500) || null,
      },
    });
  } catch {
    // Login auditing must not make authentication unavailable.
  }
}