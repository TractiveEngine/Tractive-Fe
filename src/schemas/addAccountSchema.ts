import { z } from "zod";

export const addAccountSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number must not exceed 15 digits"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
});

export type AddAccountSchemaType = z.infer<typeof addAccountSchema>;
