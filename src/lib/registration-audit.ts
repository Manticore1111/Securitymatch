import { prisma } from "@/lib/prisma";

function header(request: Request, names: string[]) {
  for (const name of names) {
    const value = request.headers.get(name)?.trim();
    if (value) return value;
  }
  return null;
}

export async function recordRegistrationFailure({
  request,
  data,
  reason,
  userId,
}: {
  request: Request;
  data?: { firstName?: unknown; lastName?: unknown; email?: unknown; role?: unknown };
  reason: string;
  userId?: string;
}) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const value = (input: unknown, maxLength: number) => typeof input === "string" ? input.trim().slice(0, maxLength) || null : null;
    await prisma.registrationAttempt.create({
      data: {
        firstName: value(data?.firstName, 100),
        lastName: value(data?.lastName, 100),
        email: value(data?.email, 255)?.toLowerCase(),
        role: data?.role === "CLIENT" || data?.role === "SECURITY_PROFESSIONAL" ? data.role : undefined,
        reason: reason.slice(0, 500),
        userId,
        ipAddress: (forwardedFor || request.headers.get("x-real-ip") || null)?.slice(0, 64),
        city: header(request, ["x-vercel-ip-city", "x-geo-city"]),
        region: header(request, ["x-vercel-ip-country-region", "x-geo-region"]),
        country: header(request, ["x-vercel-ip-country", "x-geo-country"]),
        userAgent: request.headers.get("user-agent")?.slice(0, 500) || null,
      },
    });
  } catch {
    // Audit logging must never prevent the registration response.
  }
}