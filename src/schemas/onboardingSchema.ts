// schemas/onboardingSchema.ts
import { z } from "zod";

export const onboardingSchema = z.object({
  state: z.string().min(1, "State is required"),
  CAC: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  mobile: z
    .string()
    .min(11, "Mobile number must be at least 10 digits")
    .max(11, "Mobile number must not exceed 15 digits"),
  alternativeMobile: z
    .string()
    .min(11, "Alternative number must be at least 10 digits")
    .max(11, "Alternative number must not exceed 15 digits")
    .optional(),
  businessName: z.string().min(1, "Business name is required"),
  interests: z
    .array(
      z.enum(["fish", "Tubers", "Grains", "Edible", "Livestock", "Vegetable"])
    )
    .nonempty(),
});

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;
