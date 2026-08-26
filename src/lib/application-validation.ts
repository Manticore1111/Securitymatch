import { z } from "zod";

export const applicationSchema = z.object({
  availability: z.boolean(),
  proposedRateCents: z.coerce.number().int().min(0).max(1000000),
  message: z.string().trim().min(10, "Schrijf een bericht van minimaal 10 tekens.").max(3000),
  relevantExperience: z.string().trim().min(10, "Beschrijf je relevante ervaring.").max(3000),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "WITHDRAWN"]),
});