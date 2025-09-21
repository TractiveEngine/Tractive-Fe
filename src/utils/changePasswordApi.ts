import { z } from "zod";
import axios from "axios";

const apiResponseSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  data: z.any().optional(),
  token: z.string().optional(),
});

export type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (
  data: ChangePasswordData,
  token: string
): Promise<z.infer<typeof apiResponseSchema>> => {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";
    console.log("Submitting to:", `${API_URL}/api/auth/change-password`);
    console.log(
      "Payload:",
      JSON.stringify(
        { currentPassword: "[HIDDEN]", newPassword: "[HIDDEN]" },
        null,
        2
      )
    );
    console.log("Token:", token ? "Present" : "Missing");

    const response = await axios.post(
      `${API_URL}/api/auth/change-password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", JSON.stringify(response.data, null, 2));
    const validatedResponse = apiResponseSchema.parse(response.data);
    return validatedResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
        headers: error.response?.headers,
      };
      console.error("Axios error:", JSON.stringify(errorDetails, null, 2));
      throw new Error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to change password"
      );
    }
    console.error("Unexpected error:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    throw new Error("An unexpected error occurred. Please try again.");
  }
};
