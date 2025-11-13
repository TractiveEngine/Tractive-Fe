import { getLoggedInUser, getAuthToken } from "./loginAuth";

// Check if user can create products (agent/admin only)
export const hasProductCreationPermission = async (): Promise<boolean> => {
  const user = getLoggedInUser();

  if (!user) {
    console.log("No user found");
    return false;
  }

  // Fix: Handle both string and array cases
  const userRoles = Array.isArray(user.role)
    ? user.role
    : user.role
    ? [user.role]
    : [];

  // Check if user has admin or agent role
  const hasRequiredRole =
    userRoles.includes("agent") || userRoles.includes("admin");
  const agentOnboardingCompleted =
    localStorage.getItem("agentOnboardingCompleted") === "true";

  console.log("Permission check - localStorage:", {
    userRoles: userRoles,
    hasRequiredRole,
    agentOnboardingCompleted,
  });

  // For admin users, no onboarding required
  if (userRoles.includes("admin")) {
    console.log("Admin user detected - granting permission");
    return true;
  }

  // For agent users, check onboarding completion
  if (userRoles.includes("agent") && agentOnboardingCompleted) {
    console.log("Agent with completed onboarding - granting permission");
    return true;
  }

  // If no required role in localStorage, verify with backend
  if (!hasRequiredRole) {
    console.log("No required role in localStorage, checking backend...");
    return await verifyPermissionWithBackend();
  }

  // If agent role exists but onboarding not completed
  if (userRoles.includes("agent") && !agentOnboardingCompleted) {
    console.log("Agent role exists but onboarding not completed");
    return false;
  }

  return false;
};

// Verify permissions with backend
const verifyPermissionWithBackend = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.log("No token found for backend verification");
      return false;
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";

    const response = await fetch(`${API_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("Backend verification failed:", response.status);
      return false;
    }

    const userData = await response.json();
    console.log("Backend user verification:", userData);

    // Fix: Handle both string and array cases from backend
    const backendRoles = Array.isArray(userData.role)
      ? userData.role
      : userData.role
      ? [userData.role]
      : userData.user?.role
      ? [userData.user.role]
      : [];

    const hasBackendPermission =
      backendRoles.includes("admin") || backendRoles.includes("agent");

    console.log("Backend permission check result:", hasBackendPermission);

    // Update localStorage if we got valid role data from backend
    if (hasBackendPermission) {
      const currentUser = getLoggedInUser();
      if (currentUser) {
        const currentRoles = Array.isArray(currentUser.role)
          ? currentUser.role
          : currentUser.role
          ? [currentUser.role]
          : [];

        const updatedRoles = [...new Set([...currentRoles, ...backendRoles])];

        const updatedSession = {
          ...currentUser,
          role: updatedRoles,
        };

        localStorage.setItem("session", JSON.stringify(updatedSession));
        console.log("Updated session with backend roles:", updatedSession);
      }
    }

    return hasBackendPermission;
  } catch (error) {
    console.error("Error verifying permissions with backend:", error);
    return false;
  }
};

// Strict permission check specifically for product creation
export const canCreateProducts = async (): Promise<boolean> => {
  const user = getLoggedInUser();

  if (!user) {
    console.log("No user session found");
    return false;
  }

  // Fix: Handle both string and array cases
  const userRoles = Array.isArray(user.role)
    ? user.role
    : user.role
    ? [user.role]
    : [];
  const userRole = typeof user.role === "string" ? user.role : user.role?.[0];

  const hasAdminRole = userRoles.includes("admin") || userRole === "admin";
  const hasAgentRole = userRoles.includes("agent") || userRole === "agent";

  console.log("Role check:", {
    userRole,
    userRoles,
    hasAdminRole,
    hasAgentRole,
    agentOnboardingCompleted: localStorage.getItem("agentOnboardingCompleted"),
  });

  // Admin users can always create products
  if (hasAdminRole) {
    console.log("Admin user can create products");
    return true;
  }

  // Agent users can create products only if onboarding is complete
  if (hasAgentRole) {
    const onboardingComplete =
      localStorage.getItem("agentOnboardingCompleted") === "true";
    console.log("Agent user onboarding status:", onboardingComplete);
    return onboardingComplete;
  }

  console.log("User does not have permission to create products");
  return false;
};

// Check if user can perform buyer-specific actions
export const hasBuyerPermissions = (): boolean => {
  const user = getLoggedInUser();
  if (!user) return false;

  const userRoles = Array.isArray(user.role)
    ? user.role
    : user.role
    ? [user.role]
    : [];
  const hasRole = userRoles.includes("buyer");
  const buyerOnboardingCompleted =
    localStorage.getItem("buyerOnboardingCompleted") === "true";

  return hasRole && buyerOnboardingCompleted;
};

// Check if user can perform transporter-specific actions
export const hasTransporterPermissions = (): boolean => {
  const user = getLoggedInUser();
  if (!user) return false;

  const userRoles = Array.isArray(user.role)
    ? user.role
    : user.role
    ? [user.role]
    : [];
  const hasRole = userRoles.includes("transporter");
  const transporterOnboardingCompleted =
    localStorage.getItem("transporterOnboardingCompleted") === "true";

  return hasRole && transporterOnboardingCompleted;
};

// Generic permission check for any role
export const hasRolePermission = (role: string): boolean => {
  const user = getLoggedInUser();
  if (!user) return false;

  const userRoles = Array.isArray(user.role)
    ? user.role
    : user.role
    ? [user.role]
    : [];

  // Admin can access all roles
  if (userRoles.includes("admin")) return true;

  const hasRole = userRoles.includes(role);

  // For admin role, no onboarding required
  if (role === "admin") return hasRole;

  const onboardingCompleted =
    localStorage.getItem(`${role}OnboardingCompleted`) === "true";

  return hasRole && onboardingCompleted;
};

// Get user's active role with completion status
export const getUserRoleWithStatus = (): {
  role: string | null;
  completed: boolean;
} => {
  const user = getLoggedInUser();

  if (!user) return { role: null, completed: false };

  const activeRole = user.activeRole || localStorage.getItem("userRole");
  if (!activeRole) return { role: null, completed: false };

  // Admin role doesn't require onboarding
  if (activeRole === "admin") {
    return { role: activeRole, completed: true };
  }

  const completed =
    localStorage.getItem(`${activeRole}OnboardingCompleted`) === "true";
  return { role: activeRole, completed };
};

// Enhanced debug function
export const debugAuth = async (): Promise<void> => {
  const token = getAuthToken();
  const user = getLoggedInUser();

  console.log("=== AUTH DEBUG ===");
  console.log("User from localStorage:", user);
  console.log("Token exists:", !!token);

  const userRoles = Array.isArray(user?.role)
    ? user.role
    : user?.role
    ? [user.role]
    : [];
  console.log("User roles:", userRoles);

  console.log("Active role:", user?.activeRole);
  console.log(
    "Agent onboarding completed:",
    localStorage.getItem("agentOnboardingCompleted")
  );
  console.log("Admin in roles:", userRoles.includes("admin"));
  console.log("Agent in roles:", userRoles.includes("agent"));

  if (token) {
    try {
      // Decode token
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Token payload:", payload);
      console.log("Token expires:", new Date(payload.exp * 1000));
      console.log("Token valid:", payload.exp > Date.now() / 1000);
    } catch (e) {
      console.error("Error decoding token:", e);
    }

    // Test product creation permission
    const canCreate = await canCreateProducts();
    console.log("Can create products:", canCreate);

    // Test backend verification
    await verifyPermissionWithBackend();
  }

  console.log("=== END DEBUG ===");
};

// Helper function to ensure user has proper permissions before showing UI
export const requiresProductCreationPermission = async (): Promise<{
  hasPermission: boolean;
  redirectTo?: string;
  message?: string;
}> => {
  const user = getLoggedInUser();

  if (!user) {
    return {
      hasPermission: false,
      redirectTo: "/login",
      message: "Please log in to continue",
    };
  }

  const userRoles = Array.isArray(user.role)
    ? user.role
    : user.role
    ? [user.role]
    : [];
  const canCreate = await canCreateProducts();

  if (canCreate) {
    return { hasPermission: true };
  }

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

  if (
    userRoles.includes("agent") &&
    localStorage.getItem("agentOnboardingCompleted") !== "true"
  ) {
    return {
      hasPermission: false,
      redirectTo: "/onboarding",
      message: "Please complete your agent onboarding first",
    };
  }

  return {
    hasPermission: false,
    redirectTo: "/register-as",
    message: "You need to be an agent or admin to create products",
  };
};
