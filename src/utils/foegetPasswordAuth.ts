import { ForgetPasswordSchemaType } from "@/schemas/forgetPasswordSchema";
import { API_BASE_URL as API_URL } from "@/lib/config";

interface ApiResponse {
  message?: string;
  error?: string;
}

export const forgotPassword = async (
  data: ForgetPasswordSchemaType
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send reset email");
    }

    const result = await response.json();
    return {
      message: result.message || "Password reset email sent successfully",
    };
  } catch (error) {
    return { error: error.message || "An unexpected error occurred" };
  }
};
