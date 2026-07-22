import { z } from "zod";

/**
 * Schema for the in-app "register as another role" modal.
 *
 * Only covers the fields the modal actually renders. `name` and `country` are
 * carried over from the user's existing profile rather than re-collected, since
 * this flow is only reachable by users who already have an account.
 */
export const addAccountModalSchema = z.object({
  role: z.enum(["agent", "transporter", "buyer"], {
    required_error: "Please select an account type",
  }),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "Local Government Area is required"),
  address: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(
      /^\+?\d+$/,
      "Phone number must contain only digits and an optional + prefix",
    ),
});

export type AddAccountModalSchemaType = z.infer<typeof addAccountModalSchema>;
