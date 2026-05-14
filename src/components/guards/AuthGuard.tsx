"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useUserProfile } from "@/hooks/queries/useUserQueries";

interface AuthGuardProps {
    children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/signup", "/forget-password", "/reset-password"];

function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
    const router = useRouter();
    const pathname = usePathname();

    const currentPath = pathname || "";
    const isPublic = isPublicRoute(currentPath);
    const isLoading = status === "loading" || (!isPublic && isProfileLoading);
    const isAuthenticated = status === "authenticated";

    useEffect(() => {
        // 1. Wait for everything to load (session & profile)
        if (isLoading) return;

        const currentPath = pathname || "";
        // Allow public routes that might be wrapped (unlikely in (main) layout but safe)
        if (currentPath.startsWith("/login") || currentPath.startsWith("/signup")) return;

        // 2. Auth Check
        if (!isAuthenticated || !session) {
            console.log("[AuthGuard] Not authenticated, redirecting to login");
            router.replace("/login");
            return;
        }

        // 3. Profile Loaded Check (Retry/Error handled by React Query, this is logic check)
        if (!userProfile) {
            // If authenticated but no profile from API, something is wrong.
            // However, let's assume it might still be loading or retrying.
            return;
        }

        const isRegisterAs = currentPath.startsWith("/register-as");
        const isOnboarding = currentPath.startsWith("/onboarding");
        const isAddRole = currentPath.startsWith("/add-role");

        // 4. Role Existence Check
        // If user has NO roles and NO active role, they MUST go to register-as or onboarding flow
        const hasRoles = userProfile.roles && userProfile.roles.length > 0;
        const hasActiveRole = !!userProfile.activeRole;

        if (!hasRoles && !hasActiveRole) {
            // Allow register-as, onboarding, add-role pages
            if (!isRegisterAs && !isOnboarding && !isAddRole) {
                console.log("[AuthGuard] New user with no roles, redirecting to register-as");
                router.replace("/register-as");
            }
            return;
        }

        // 5. Active Role Check
        // If user has roles but NO active role, they MUST go to switch/select role (register-as handles this view too)
        if (hasRoles && !hasActiveRole) {
            if (!isRegisterAs && !isAddRole) {
                console.log("[AuthGuard] User has roles but no active role, redirecting to register-as (selection)");
                router.replace("/register-as");
            }
            return;
        }

        // 6. Role-Based Route Guard (Specific to this implementation's structure)
        // If user has active role, ensure they are not on limited pages unexpectedly
        // (This part is often handled by specific layout guards, but global guard can enforce basics)

    }, [isLoading, isAuthenticated, session, userProfile, router, pathname]);

    // Always render public routes immediately
    if (isPublic) return <>{children}</>;

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[#fefefe]">
                <div className="flex items-center gap-2">
                    <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
                    <span className="text-[#538e53] font-montserrat">Loading...</span>
                </div>
            </div>
        );
    }

    // If not authenticated, we render nothing (effect redirects)
    if (!isAuthenticated) return null;

    return <>{children}</>;
}
