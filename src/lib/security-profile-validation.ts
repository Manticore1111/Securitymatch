import { z } from "zod";

export const specializationOptions = [
  "Objectbeveiliging",
  "Evenementenbeveiliging",
  "Horecabeveiliging",
  "Winkelsurveillance",
  "Bouwplaatsbeveiliging",
  "Toegangscontrole",
  "Nachtbeveiliging",
  "Mobiele surveillance",
  "Receptiebeveiliging",
] as const;

export const securityProfileSchema = z.object({
  firstName: z.string().trim().min(2, "Vul je voornaam in.").max(80),
  lastName: z.string().trim().min(2, "Vul je achternaam in.").max(80),
  avatarUrl: z.string().trim().url("Gebruik een geldige foto-URL.").or(z.literal("")),
  bio: z.string().trim().min(20, "Geef een duidelijke introductie van minimaal 20 tekens.").max(500, "Je introductie mag maximaal 500 tekens bevatten."),
  city: z.string().trim().min(2, "Vul je woonplaats in.").max(100),
  workArea: z.string().trim().min(2, "Vul je werkgebied in.").max(160),
  hourlyRateCents: z.coerce.number().int().min(0).max(1000000),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  specializations: z.array(z.enum(specializationOptions)).min(1, "Kies minimaal één specialisatie."),
  languages: z.array(z.string().trim().min(2).max(40)).max(10),
  driverLicense: z.string().trim().max(20),
  ownTransport: z.boolean(),
  availability: z.string().trim().min(5, "Beschrijf wanneer je beschikbaar bent.").max(300),
});

export type SecurityProfileInput = z.infer<typeof securityProfileSchema>;
