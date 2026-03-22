import { getSession } from "next-auth/react";

// Check if user can create products (agent/admin only)
export const hasProductCreationPermission = async (): Promise<boolean> => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return false;
  }

  const userRoles = user.role || [];

  // Admin users, no onboarding required
  if (userRoles.includes("admin")) {
    return true;
  }

  // Agent users, no longer checking localStorage for onboarding here.
  // Rely on backend role verification or assumption that role implies qualified.
  // If onboarding status is needed, it should be in the session/user object.
  if (userRoles.includes("agent")) {
    // Assuming if they have the role in session, they are good, OR checks should be against backend/session props
    return true;
  }

  return false;
};

// Strict permission check specifically for product creation
export const canCreateProducts = async (): Promise<boolean> => {
  return hasProductCreationPermission();
};

// Check if user has specific role permissions
export const hasRolePermission = async (role: string): Promise<boolean> => {
  const session = await getSession();
  const user = session?.user;

  if (!user) return false;

  const userRoles = user.role || [];

  if (userRoles.includes("admin")) return true;
  if (role === "admin") return userRoles.includes("admin");

  return userRoles.includes(role);
};

// Get user's active role
export const getUserRoleWithStatus = async (): Promise<{
  role: string | null;
  completed: boolean;
}> => {
  const session = await getSession();
  const user = session?.user;

  if (!user || !user.activeRole) return { role: null, completed: false };

  return { role: user.activeRole, completed: true }; // Assuming active role implies completion or handled elsewhere
};

// Helper function to ensure user has proper permissions before showing UI
export const requiresProductCreationPermission = async (): Promise<{
  hasPermission: boolean;
  redirectTo?: string;
  message?: string;
}> => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return {
      hasPermission: false,
      redirectTo: "/login",
      message: "Please log in to continue",
    };
  }

  const canCreate = await canCreateProducts();

  if (canCreate) {
    return { hasPermission: true };
  }

  const userRoles = user.role || [];

  // Determine where to redirect based on user's roles
  if (userRoles.includes("buyer")) {
    return {
      hasPermission: false,
      redirectTo: "/buyer-dashboard",
      message: "You don't have permission to create products",
    };
  }

  if (userRoles.includes("transporter")) {
    return {
      hasPermission: false,
      redirectTo: "/transporter-dashboard",
      message: "You don't have permission to create products",
    };
  }

  return {
    hasPermission: false,
    redirectTo: "/register-as",
    message: "You need to be an agent or admin to create products",
  };
};
