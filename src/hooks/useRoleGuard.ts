import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UserRole = "agent" | "buyer" | "transporter" | "admin";

interface UseRoleGuardReturn {
  isAuthorized: boolean;
  isLoading: boolean;
  session: any;
}

/**
 * Hook for role-based route protection
 *
 * Ensures that:
 * 1. User is authenticated
 * 2. User has an active role
 * 3. User's active role matches the required role for the route
 *
 * @param requiredRole - The role required to access the route
 * @returns Object with authorization status and loading state
 */
export function useRoleGuard(requiredRole: UserRole): UseRoleGuardReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    // Wait for session to load
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated || !session) {
      console.log(
        `[useRoleGuard] User not authenticated, redirecting to login`,
      );
      toast.error("Please log in to continue", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    const activeRole = session.user?.activeRole;
    const userRoles = session.user?.role || [];

    console.log(
      `[useRoleGuard] Required: ${requiredRole}, Active: ${activeRole}, All roles:`,
      userRoles,
    );

    // No active role - redirect to role selection
    if (!activeRole) {
      console.log(`[useRoleGuard] No active role, redirecting to register-as`);
      toast.info("Please select a role to continue", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/register-as");
      return;
    }

    // Active role doesn't match required role - redirect to their dashboard or register-as
    if (activeRole !== requiredRole) {
      console.log(
        `[useRoleGuard] Role mismatch. Required: ${requiredRole}, Active: ${activeRole}`,
      );

      // If they have the required role but it's not active, suggest switching
      if (userRoles.includes(requiredRole)) {
        toast.error(
          `Please switch to your ${requiredRole} account to access this page`,
          {
            duration: 4000,
            position: "top-center",
          },
        );
        router.replace(`/${activeRole}`);
      } else {
        // They don't have this role at all
        toast.error(`You need a ${requiredRole} account to access this page`, {
          duration: 4000,
          position: "top-center",
        });
        router.replace("/register-as");
      }
      return;
    }

    // All checks passed
    console.log(
      `[useRoleGuard] ✓ Authorization successful for ${requiredRole}`,
    );
  }, [isLoading, isAuthenticated, session, requiredRole, router]);

  const isAuthorized =
    isAuthenticated && session?.user?.activeRole === requiredRole;

  return {
    isAuthorized,
    isLoading,
    session,
  };
}
