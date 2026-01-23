import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { tokenManager } from "./tokenManager";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  // 1. Try to get token from memory first (fastest)
  let token = tokenManager.getToken();

  // 2. Fallback to session if memory is empty (race condition on load)
  if (!token) {
    const session = await getSession();
    token = session?.accessToken || session?.user?.token || null;
    if (token) {
      tokenManager.setToken(token);
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await tokenManager.getRefreshTokenHelper(async () => {
          // Call backend to refresh token (assumes HttpOnly cookie is present)
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            {
              withCredentials: true, // Important for cookies
            },
          );

          return res.data?.token || res.data?.accessToken || null;
        });

        if (newToken) {
          tokenManager.setToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        tokenManager.clearToken();
        await signOut({ redirect: true, callbackUrl: "/login" });
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors gracefully
    if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  },
);

export default api;
