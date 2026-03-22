import { useUserProfile } from "@/hooks/queries/useUserQueries";

export const usePermission = () => {
  const { data: user, isLoading } = useUserProfile();

  const getRoles = (): string[] => {
    if (!user) return [];
    // Normalize roles from various API shapes
    if (Array.isArray(user.roles)) return user.roles;
    if (Array.isArray(user.role)) return user.role;
    if (typeof user.role === "string") return [user.role];
    return [];
  };

  const hasRole = (role: string) => {
    return getRoles().includes(role);
  };

  const getActiveRole = () => user?.activeRole || null;

  const canCreateProducts = () => {
    if (!user) return false;
    const roles = getRoles();
    const activeResult = user.activeRole;
    
    // Admin always can
    if (roles.includes("admin") || activeResult === 'admin') return true;

    // Agent can if active role is agent (logic matching strict checks)
    if (roles.includes("agent") || activeResult === 'agent') return true;

    return false;
  };

  return {
    user,
    isLoading,
    hasRole,
    activeRole: getActiveRole(),
    canCreateProducts: canCreateProducts(),
    isBuyer: hasRole("buyer"),
    isTransporter: hasRole("transporter"),
    isAgent: hasRole("agent"),
    isAdmin: hasRole("admin"),
    isAuthenticated: !!user,
  };
};
