// schemas/forgetPasswordSchema.ts
import { z } from "zod";

export const forgetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ForgetPasswordSchemaType = z.infer<typeof forgetPasswordSchema>;
