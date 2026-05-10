import axios from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const apiMessage =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) && data.errors[0]?.message) ||
      (Array.isArray(data?.errors) && typeof data.errors[0] === "string"
        ? data.errors[0]
        : null);
    if (apiMessage) return apiMessage;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
