import { z } from "zod";

export const clientProfileSchema = z.object({
  firstName: z.string().trim().min(2, "Vul de voornaam in.").max(80),
  lastName: z.string().trim().min(2, "Vul de achternaam in.").max(80),
  email: z.string().trim().email("Vul een geldig e-mailadres in."),
  phone: z.string().trim().max(30),
  organizationName: z.string().trim().min(2, "Vul de bedrijfsnaam in.").max(160),
  kvkNumber: z.string().trim().min(5, "Vul het KvK-nummer in.").max(30),
  website: z.string().trim().url("Gebruik een geldige website-URL.").or(z.literal("")),
  description: z.string().trim().min(20, "Geef een duidelijke bedrijfsomschrijving.").max(1000),
  address: z.string().trim().min(5, "Vul het bedrijfsadres in.").max(200),
  city: z.string().trim().min(2, "Vul de vestigingsplaats in.").max(100),
});

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Vul een titel in.").max(160),
  description: z.string().trim().min(10, "Geef een duidelijke omschrijving.").max(5000),
  category: z.string().trim().min(2, "Kies een type beveiliging.").max(100),
  location: z.string().trim().min(2, "Vul de locatie in.").max(260),
  street: z.string().trim().min(2, "Vul de straat in.").max(160),
  postalCode: z.string().trim().min(4, "Vul de postcode in.").max(20),
  city: z.string().trim().min(2, "Vul de plaats in.").max(100),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  securityCount: z.coerce.number().int().min(1).max(100),
  hourlyRateCents: z.coerce.number().int().min(0).max(1000000),
  budgetCents: z.coerce.number().int().min(0).max(100000000).nullable(),
  negotiable: z.coerce.boolean(),
  experience: z.string().trim().max(1000),
  certificates: z.string().trim().max(1000),
  driverLicense: z.coerce.boolean(),
  ownTransport: z.coerce.boolean(),
  languages: z.array(z.string().trim().min(1).max(60)).max(20),
  specializations: z.array(z.string().trim().min(1).max(100)).max(20),
  status: z.enum(["DRAFT", "PUBLISHED", "RESPONSES_RECEIVED", "FILLED", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
}).refine((value) => value.endAt > value.startAt, { message: "De eindtijd moet na de starttijd liggen.", path: ["endAt"] });

export type ClientProfileInput = z.infer<typeof clientProfileSchema>;
export type JobInput = z.infer<typeof jobSchema>;
