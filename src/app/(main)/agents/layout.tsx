"use client";
import { ATNavbar } from "@/components/nav/A&TNavbar";
import { AgentAsideNav } from "@/components/nav/AgentAsideNav";
import { AgentAsideNavMobile } from "@/components/nav/AgentAsideNavMobile";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "@/utils/loginAuth";

// Custom hook to detect current breakpoint
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

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔐 Redirect unauthorized users and fetch user data
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isUserLoggedIn();
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const userData = getLoggedInUser();
        if (userData && "fullName" in userData && "email" in userData) {
          setUser({ fullName: userData.fullName, email: userData.email });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Unauthorized access. Login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/login");
  };

  const handleUserDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Define marginLeft based on breakpoint
  const marginLeft = {
    xs: "0rem",
    sm: "6rem", // Matches sm:ml-[6rem]
    lg: "12.5rem", // Matches lg:ml-50 (assuming ml-50 is 12.5rem or 200px)
  };

  return (
    <div className="flex min-h-screen bg-[#f1f1f1]">
      {/* Sidebar */}
      <AgentAsideNav />
      {/* Main Content */}
      <motion.div
        className="flex-1 flex flex-col"
        animate={{ marginLeft: marginLeft[breakpoint] }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Top Navbar */}
        <nav className="w-full">
          <ATNavbar />
        </nav>
        {/* Content Area */}
        <div className="flex flex-col">
          <AgentAsideNavMobile
            user={user}
            isDropdownOpen={isDropdownOpen}
            handleUserDropdownClick={handleUserDropdownClick}
            handleLogout={handleLogout}
          />
          <main className="flex-1 pt-[2rem] lg:pt-[4rem] overflow-y-auto">
            {children}
          </main>
        </div>
      </motion.div>
    </div>
  );
}
