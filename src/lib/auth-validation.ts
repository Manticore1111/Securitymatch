import { z } from "zod";

export const roleSchema = z.enum([
  "SECURITY_PROFESSIONAL",
  "CLIENT",
  "ADMIN",
]);

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, "Vul je voornaam in."),
  lastName: z.string().trim().min(2, "Vul je achternaam in."),
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
  password: z
    .string()
    .min(12, "Gebruik minimaal 12 tekens.")
    .regex(/[A-Z]/, "Gebruik minimaal één hoofdletter.")
    .regex(/[a-z]/, "Gebruik minimaal één kleine letter.")
    .regex(/[0-9]/, "Gebruik minimaal één cijfer."),
  role: roleSchema,
  termsAccepted: z.boolean().refine((value) => value, "Je moet akkoord gaan met de platformvoorwaarden."),
  emailVerificationToken: z.string().min(32, "Bevestig eerst je e-mailadres."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Vul een geldig e-mailadres in."),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z
    .string()
    .min(12, "Gebruik minimaal 12 tekens.")
    .regex(/[A-Z]/, "Gebruik minimaal één hoofdletter.")
    .regex(/[a-z]/, "Gebruik minimaal één kleine letter.")
    .regex(/[0-9]/, "Gebruik minimaal één cijfer."),
});
