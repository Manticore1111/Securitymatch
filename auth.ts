import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth-validation-extra";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const identifier = parsed.data.email.toLowerCase();
        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { username: identifier }] },
        });
        if (!user?.passwordHash || user.status !== "ACTIVE") return null;
        if (!user.emailVerifiedAt && process.env.EMAIL_VERIFICATION_REQUIRED !== "false") return null;
        if (!(await verifyPassword(parsed.data.password, user.passwordHash))) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email, role: user.role };
      },
    }),
  ],
});
