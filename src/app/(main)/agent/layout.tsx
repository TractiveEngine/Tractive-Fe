"use client";
import { AgentAsideNav } from "@/components/nav/AgentNav/AgentAsideNav";
import { AgentAsideNavMobile } from "@/components/nav/AgentNav/AgentAsideNavMobile";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "@/utils/loginAuth";
import { AgentNavbar } from "@/components/nav/AgentNav/AgentNavbar";
import { debugAuth, requiresProductCreationPermission, canCreateProducts } from "@/utils/userRoleAuth";

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"xs" | "sm" | "lg">("xs");

  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth >= 1024) {
        setBreakpoint("lg");
      } else if (window.innerWidth >= 640) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("xs");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
};

// Routes that should skip agent permission checks
const EXCLUDED_ROUTES = [
  "/onboarding-success",
  "/onboarding",
  "/buyer-dashboard",
  "/transporter-dashboard",
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const breakpoint = useBreakpoint();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if current route should skip permission checks
  const shouldCheckPermission = !EXCLUDED_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    const checkLoginStatusAndPermissions = async () => {
      try {
        console.log("=== AGENT LAYOUT INIT ===");
        console.log("Current path:", pathname);
        console.log("Should check permission:", shouldCheckPermission);

        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
          console.log("User not logged in");
          setIsChecking(false);
          return;
        }

        const userData = getLoggedInUser();
        console.log("User data from localStorage:", userData);

        if (userData && "name" in userData && "email" in userData) {
          setUser({ name: userData.name, email: userData.email });

          // Only check permissions if required for this route
          if (shouldCheckPermission) {
            console.log("Checking product creation permissions...");
            
            const permissionResult = await requiresProductCreationPermission();
            console.log("Permission check result:", permissionResult);

            if (permissionResult.hasPermission) {
              console.log("Permission granted - user can access agent dashboard");
              setHasPermission(true);
            } else {
              console.log("Permission denied:", permissionResult.message);
              setHasPermission(false);

              // Show appropriate message
              toast.error(permissionResult.message || "Access denied", {
                duration: 4000,
                position: "top-center",
              });

              // Redirect to appropriate dashboard
              if (permissionResult.redirectTo) {
                console.log("Redirecting to:", permissionResult.redirectTo);
                router.replace(permissionResult.redirectTo);
              }
            }
          } else {
            console.log("Skipping permission check for route:", pathname);
            setHasPermission(true);
          }
        } else {
          console.log("Invalid user data");
          setUser(null);
          setIsLoggedIn(false);
          setHasPermission(false);
        }
      } catch (error) {
        console.error("Error in AgentLayout:", error);
        setIsLoggedIn(false);
        setUser(null);
        setHasPermission(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkLoginStatusAndPermissions();
  }, [router, pathname, shouldCheckPermission]);

  useEffect(() => {
    if (isLoggedIn === false) {
      toast.error("Unauthorized access. Please login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  // Debug effect
  useEffect(() => {
    if (isLoggedIn && process.env.NODE_ENV === "development") {
      debugAuth();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    router.push("/login");
    setUser(null);
    setHasPermission(false);
    setIsDropdownOpen(false);
  };

  const handleUserDropdownClick = () => {
    console.log("Toggling profile dropdown");
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    console.log("Closing profile dropdown");
    setIsDropdownOpen(false);
  };

  const marginLeft = {
    xs: "0rem",
    sm: "6rem",
    lg: "12.5rem",
  };

  // Show loading state
  if (isChecking) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
          <span>Checking permissions...</span>
        </div>
      </div>
    );
  }

  // Don't render anything if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Only check permission if required for this route
  if (shouldCheckPermission && !hasPermission) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#a0dfa0] border-t-[#538e53] rounded-full mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-700">
            Access Denied
          </h2>
          <p className="text-gray-500 mb-4">
            You need agent or admin permissions to access this page.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/register-as")}
              className="bg-[#538e53] text-white px-4 py-2 rounded hover:bg-[#4a7a4a]"
            >
              Become an Agent
            </button>
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={() => debugAuth()}
                className="text-blue-500 underline"
              >
                Debug Auth
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For onboarding success page, don't show agent navigation
  if (pathname?.startsWith("/onboarding-success")) {
    return (
      <div className="min-h-screen bg-[#f1f1f1]">
        <main>{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f1f1f1]">
      <AgentAsideNav />
      <motion.div
        className="flex-1 flex flex-col"
        animate={{ marginLeft: marginLeft[breakpoint] }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav className="w-full">
          <AgentNavbar onLogout={handleLogout} />
        </nav>
        <div className="flex flex-col">
          <AgentAsideNavMobile
            user={user}
            isDropdownOpen={isDropdownOpen}
            handleUserDropdownClick={handleUserDropdownClick}
            handleLogout={handleLogout}
            closeDropdown={closeDropdown}
          />
          <main className="pt-[2rem] lg:pt-[4rem]">{children}</main>
        </div>
      </motion.div>
    </div>
  );
}