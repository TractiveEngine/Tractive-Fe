import { z } from "zod";

// Base schema with common fields
const baseOnboardingSchema = z.object({
  villageOrLocalMarket: z.string().min(1, "Village or local market is required"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must not exceed 11 digits")
    .regex(/^\d{11}$/, "Phone number must be 11 digits"),
  interests: z
    .array(
      z.enum(["fish", "Tubers", "Grains", "Edible", "Livestock", "Vegetable"])
    )
    .nonempty("Please select at least one interest"),
  role: z.enum(["agent", "transporter", "buyer"]),
});

// Schema for agents (businessName and nin optional)
export const agentOnboardingSchema = baseOnboardingSchema.extend({
  businessName: z.string().optional(),
  nin: z
    .string()
    .min(11, "NIN must be at least 11 digits")
    .max(11, "NIN must not exceed 11 digits")
    .optional()
    .or(z.literal("")),
});

// Schema for transporters and buyers (businessName and nin required)
export const businessOnboardingSchema = baseOnboardingSchema.extend({
  businessName: z.string().min(1, "Business name is required for your role"),
  nin: z
    .string()
    .min(11, "NIN must be at least 11 digits")
    .max(11, "NIN must not exceed 11 digits"),
});

// Function to get the appropriate schema based on user role
export const getOnboardingSchema = (userRole: string | null) => {
  if (userRole === "agent" || userRole === "admin") {
    return agentOnboardingSchema;
  } else if (userRole === "transporter" || userRole === "buyer") {
    return businessOnboardingSchema;
  }
  return businessOnboardingSchema; // Default to business schema
};

// Type definitions
export type AgentOnboardingSchemaType = z.infer<typeof agentOnboardingSchema>;
export type BusinessOnboardingSchemaType = z.infer<
  typeof businessOnboardingSchema
>;
export type OnboardingSchemaType =
  | AgentOnboardingSchemaType
  | BusinessOnboardingSchemaType;