import { z } from "zod";

export const SignupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupFormData = z.infer<typeof SignupSchema>;