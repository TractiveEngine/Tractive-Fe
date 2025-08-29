"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "@/utils/loginAuth";
import { TransporterAsideNav } from "@/components/nav/TransporterNav/TransporterAsideNav";
import { TransporterAsideNavMobile } from "@/components/nav/TransporterNav/TransporterAsideNavMobile";
import { TransporterNavbar } from "@/components/nav/TransporterNav/TransporterNavbar";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
          const userData = getLoggedInUser();
          if (userData && "fullName" in userData && "email" in userData) {
            setUser({ fullName: userData.fullName, email: userData.email });
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn === false) {
      toast.error("Unauthorized access. Please login.", {
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

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-[#f1f1f1]">
      <TransporterAsideNav />
      <motion.div
        className="flex-1 flex flex-col"
        animate={{ marginLeft: marginLeft[breakpoint] }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav className="w-full">
          <TransporterNavbar />
        </nav>
        <div className="w-full flex flex-col">
          <TransporterAsideNavMobile
            user={user}
            isDropdownOpen={isDropdownOpen}
            handleUserDropdownClick={handleUserDropdownClick}
            handleLogout={handleLogout}
            closeDropdown={closeDropdown}
          />
          <main className="w-full pt-[2rem] lg:pt-[4rem]">{children}</main>
        </div>
      </motion.div>
    </div>
  );
}
