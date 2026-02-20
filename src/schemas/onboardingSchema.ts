import { z } from "zod";

// Base schema with common fields that match the form
const baseOnboardingSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^\+?\d+$/, "Phone number must contain only digits and optional + prefix"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().optional(),
  interests: z
    .array(
      z.enum(["fish", "Tubers", "Grains", "Edible", "Livestock", "Vegetable"])
    )
    .nonempty("Please select at least one interest"),
  role: z.enum(["agent", "transporter", "buyer"]),
});

// Schema for agents - all fields from base schema
export const agentOnboardingSchema = baseOnboardingSchema;

// Schema for transporters and buyers - same as agents (no additional fields needed)
export const businessOnboardingSchema = baseOnboardingSchema;

// Function to get the appropriate schema based on user role
export const getOnboardingSchema = (userRole?: string) => {
  if (userRole === "agent" || userRole === "admin") {
    return agentOnboardingSchema;
  } else if (userRole === "transporter" || userRole === "buyer") {
    return businessOnboardingSchema;
  }
  return baseOnboardingSchema; // Default to base schema
};

// Type definitions
export type AgentOnboardingSchemaType = z.infer<typeof agentOnboardingSchema>;
export type BusinessOnboardingSchemaType = z.infer<
  typeof businessOnboardingSchema
>;
export type OnboardingSchemaType =
  | AgentOnboardingSchemaType
  | BusinessOnboardingSchemaType;