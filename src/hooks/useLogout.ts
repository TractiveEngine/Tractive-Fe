import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "@/lib/features/auth/authSlice";
import { tokenManager } from "@/lib/tokenManager";
import api from "@/lib/axios";

export const useLogout = () => {
  const dispatch = useDispatch();

  const performLogout = async () => {
    try {
      // 1. Revoke the refresh token server-side.
      //
      // Must go through `@/lib/axios` so the bearer token is attached — this
      // route answers 401 without it, leaving the session alive server-side
      // even though the client looks logged out.
      await api.post("/api/auth/logout");
    } catch (error) {
      // Client-side logout continues regardless: a failed revocation must not
      // strand the user in a signed-in UI.
      console.error("Logout API failed", error);
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
