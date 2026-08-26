import { NextResponse } from "next/server";
import { auth } from "./auth";

const dashboardForRole = {
  SECURITY_PROFESSIONAL: "/dashboard/security",
  CLIENT: "/dashboard/client",
  ADMIN: "/dashboard/admin",
} as const;

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  const user = request.auth?.user;
  if (!user) return NextResponse.redirect(new URL("/login?error=auth", request.url));

  const requiredRole = pathname.startsWith("/dashboard/security")
    ? "SECURITY_PROFESSIONAL"
    : pathname.startsWith("/dashboard/client")
      ? "CLIENT"
      : pathname.startsWith("/dashboard/admin")
        ? "ADMIN"
        : null;

  if (requiredRole && user.role !== requiredRole) {
    return NextResponse.redirect(new URL(`${dashboardForRole[user.role]}?error=forbidden`, request.url));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/dashboard/:path*"] };
