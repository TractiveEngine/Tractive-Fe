"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setCredentials,
  logout,
  setLoading,
} from "@/lib/features/auth/authSlice";
import { tokenManager } from "@/lib/tokenManager";

export default function SessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "loading") {
      dispatch(setLoading(true));
      return;
    }

    if (session?.user) {
      dispatch(
        setCredentials({
          user: {
            id: session.user.id || "",
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.image || "",
            role: session.user.role || [],
            activeRole: session.user.activeRole || null,
            token: session.user.token,
          },
        }),
      );
      tokenManager.setToken(session.user.token || null);
    } else if (status === "unauthenticated") {
      dispatch(logout());
      tokenManager.clearToken();
    }
  }, [session, status, dispatch]);

  return null;
}
