import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth-validation-extra";
import { recordLoginAttempt } from "@/lib/login-audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          await recordLoginAttempt({ request, identifier: "ongeldige invoer", successful: false });
          return null;
        }

        const identifier = parsed.data.email.toLowerCase();
        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { username: identifier }] },
        });
        if (!user?.passwordHash || user.status !== "ACTIVE") {
          await recordLoginAttempt({ request, identifier, successful: false });
          return null;
        }
        if (!user.emailVerifiedAt && process.env.EMAIL_VERIFICATION_REQUIRED !== "false") {
          await recordLoginAttempt({ request, identifier, userId: user.id, successful: false });
          return null;
        }
        if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
          await recordLoginAttempt({ request, identifier, userId: user.id, successful: false });
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        await recordLoginAttempt({ request, identifier, userId: user.id, successful: true });

        return { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email, role: user.role };
      },
    }),
  ],
});
