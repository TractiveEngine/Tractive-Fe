import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { logout } from "@/lib/features/auth/authSlice";
import { tokenManager } from "@/lib/tokenManager";
import { API_BASE_URL } from "@/lib/config";

export const useLogout = () => {
  const dispatch = useDispatch();

  const performLogout = async () => {
    try {
      // 1. Call Backend Logout (to revoke refresh token/cookies)
      // We use the raw axios instance or fetch to avoid interceptor loops if needed,
      // but using the standard one is fine as long as we handle errors.
      await axios.post(
        `${API_BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.error("Logout API failed", error);
      // We continue to client-side logout anyway
    }

    // 2. Clear Client State
    tokenManager.clearToken();
    dispatch(logout());

    // 3. Trigger NextAuth SignOut (clears session cookie & redirects)
    await signOut({ callbackUrl: "/login" });
    toast.success("Logged out successfully");
  };

  return { performLogout };
};
