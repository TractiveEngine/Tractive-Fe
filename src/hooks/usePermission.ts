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

  // Mirror the strict activeRole model used by the route guards
  // (`useRoleGuard`): a permission depends on the role the user is *currently
  // acting as*, not merely on roles they happen to possess.
  const canCreateProducts = () => {
    const activeRole = getActiveRole();
    return activeRole === "admin" || activeRole === "agent";
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
