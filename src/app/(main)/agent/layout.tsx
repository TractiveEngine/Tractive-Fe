"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import "./Table.css";
import { AgentAsideNav } from "../../../components/nav/AgentNav/AgentAsideNav";
import { AgentNavbar } from "../../../components/nav/AgentNav/AgentNavbar";
import { AgentAsideNavMobile } from "../../../components/nav/AgentNav/AgentAsideNavMobile";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useBreakpoint } from "../../../hooks/useBreakpoint";


export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const breakpoint = useBreakpoint();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use role guard for authentication and authorization
  const { isAuthorized, isLoading, session } = useRoleGuard("agent");

  const user = session?.user;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    setIsDropdownOpen(false);
  };

  const handleUserDropdownClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const marginLeft = {
    xs: "0rem",
    sm: "6rem",
    lg: "12.5rem",
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin w-6 h-6 border-2 border-[#a0dfa0] border-t-[#538e53] rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (useRoleGuard handles redirects)
  if (!isAuthorized) {
    return null;
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
            user={
              user ? { name: user.name || "", email: user.email || "" } : null
            }
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
