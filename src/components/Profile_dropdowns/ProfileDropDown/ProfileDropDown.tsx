"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { getAuthToken, getLoggedInUser } from "../../../utils/loginAuth";
import { SwapIcon } from "../../../icons/Icon1";

interface ProfileDropDownProps {
  onLogout: () => void;
  currentRole?: "agent" | "buyer" | "transporter";
}

type UserRole = "agent" | "buyer" | "transporter";

interface RoleConfig {
  name: string;
  displayName: string;
  accountLabel: string;
  profilePath: string;
}

const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  agent: {
    name: "agent",
    displayName: "Agent",
    accountLabel: "Agents account",
    profilePath: "/agent-profile",
  },
  buyer: {
    name: "buyer",
    displayName: "Buyer",
    accountLabel: "Buyers account", 
    profilePath: "/buyer-profile",
  },
  transporter: {
    name: "transporter",
    displayName: "Transporter",
    accountLabel: "Transporters account",
    profilePath: "/transporter-profile",
  },
};

export const ProfileDropDown = ({ onLogout, currentRole }: ProfileDropDownProps) => {
  const router = useRouter();
  const user = getLoggedInUser();
  const userRoles = user?.role || [];
  const activeRole = currentRole || user?.activeRole;

  // Debug logging
  console.log("ProfileDropDown received handleLogout:", typeof onLogout);
  console.log("handleLogout function:", onLogout);

  
  // Get all roles except the currently active one
  const availableRoles: UserRole[] = ["agent", "buyer", "transporter"];
  const dropdownRoles = availableRoles.filter((role) => role !== activeRole);

  const handleSwitchRole = async (role: UserRole) => {
    let token = getAuthToken();
    
    // Try to get fresh token from user session if initial token is invalid
    if (!token && user?.token) {
      token = user.token;
      localStorage.setItem("authToken", token);
    }
    
    if (!token) {
      toast.error("Your session has expired. Please login again.", {
        duration: 3000,
        position: "top-center",
      });
      // Clear all auth data
      localStorage.removeItem("session");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      router.replace("/login");
      return;
    }

    // If user doesn't have this role, redirect to register-as page
    if (!userRoles.includes(role)) {
      toast.info(`Setting up your ${ROLE_CONFIGS[role].displayName} account...`, {
        duration: 2000,
        position: "top-center",
      });
      localStorage.setItem("pendingRole", role);
      // No need for separate onboarding token - use existing auth token
      router.push("/register-as");
      return;
    }

    // If user already has this role, switch to it
    const loadingToastId = toast.loading(`Switching to ${ROLE_CONFIGS[role].displayName} role...`, {
      position: "top-center",
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";
      
      console.log("Making role switch request with token:", token?.substring(0, 20) + "...");
      
      const response = await axios.post(
        `${API_URL}/api/auth/add-account`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("Role switch response:", response.data);

      if (!response.data.success && !response.data.message?.includes("updated")) {
        throw new Error(response.data.error || response.data.message || "Failed to switch role.");
      }

      // Update user session with new token if provided
      if (user) {
        const updatedSession = {
          ...user,
          activeRole: role,
          token: response.data.token || token, // Use new token if provided, fallback to current
        };
        localStorage.setItem("session", JSON.stringify(updatedSession));
        localStorage.setItem("userRole", role);
        
        // Update auth token if new one provided
        if (response.data.token) {
          localStorage.setItem("authToken", response.data.token);
        }
      }

      toast.dismiss(loadingToastId);
      toast.success(`Switched to ${ROLE_CONFIGS[role].displayName} role!`, {
        duration: 2000,
        position: "top-center",
      });

      // Check if onboarding is completed for this specific role
      const roleOnboardingCompleted = localStorage.getItem(`onboardingCompleted-${role}`) === "true";
      const redirectPath = roleOnboardingCompleted ? `/${role}` : "/onboarding";
      
      console.log(`Redirecting to: ${redirectPath} (onboarding completed: ${roleOnboardingCompleted})`);
      router.push(redirectPath);
      
    } catch (error: any) {
      console.error("Role switch error:", error);
      toast.dismiss(loadingToastId);
      
      // Handle specific error cases
      let errorMessage = "Failed to switch role.";
      
      if (error.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        // Clear auth data and redirect to login
        localStorage.removeItem("session");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        setTimeout(() => {
          router.replace("/login");
        }, 1000);
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to access this role.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const getRoleStatus = (role: UserRole): "switch" | "add" => {
    return userRoles.includes(role) ? "switch" : "add";
  };

  const getRoleDisplayText = (role: UserRole): string => {
    const status = getRoleStatus(role);
    const config = ROLE_CONFIGS[role];
    return `${config.displayName} (${status === "switch" ? "Switch" : "Add"})`;
  };

  // Get the profile path for the current active role
  const currentProfilePath = activeRole ? ROLE_CONFIGS[activeRole as UserRole].profilePath : "/profile";

  return (
    <div className="flex flex-col gap-3 absolute right-0 top-12 pt-2 w-48 bg-[#fefefe] rounded-[4px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.05)] z-20">
      <ul className="flex flex-col">
        <li className="w-[95%] mx-auto">
          <Link
            href={currentProfilePath}
            className="block px-3 py-1 text-[12px] text-[#2b2b2b] rounded-[4px] hover:bg-[#538E53] hover:text-[#fefefe] transition-colors"
          >
            Profile settings
          </Link>
        </li>
        <li className="w-[95%] mx-auto">
          <button
            onClick={onLogout}
            className="block w-full text-left px-3 py-1 text-[12px] text-[#2b2b2b] rounded-[4px] hover:bg-[#538E53] hover:text-[#FEFEFE] cursor-pointer transition-colors"
          >
            Logout
          </button>
        </li>
      </ul>
      
      <span className="w-[100%] h-[1px] bg-[#e2e2e2]"></span>
      
      <div className="flex flex-col gap-2 px-3 pb-3">
        {dropdownRoles.map((role) => {
          const config = ROLE_CONFIGS[role];
          const status = getRoleStatus(role);
          
          return (
            <button
              key={role}
              onClick={() => handleSwitchRole(role)}
              className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#f5f5f5] transition-colors"
              title={`${status === "switch" ? "Switch to" : "Add"} ${config.displayName} account`}
            >
              <div className="flex items-center gap-1">
                <Image
                  src="/images/profile_image.png"
                  alt={`${config.displayName} Profile`}
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="block text-[10px] text-[#2b2b2b] font-medium">
                    {getRoleDisplayText(role)}
                  </span>
                  <span className="block text-[10px] text-[#666666]">
                    {config.accountLabel}
                  </span>
                </div>
              </div>
              <SwapIcon />
            </button>
          );
        })}
        
        {dropdownRoles.length === 0 && (
          <div className="text-[10px] text-[#666666] text-center py-2">
            All available roles are active
          </div>
        )}
      </div>
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-3 pb-2 text-[9px] text-[#999] border-t border-[#e2e2e2] pt-2">
          <div>Active: {activeRole || 'none'}</div>
          <div>Roles: {userRoles.join(', ') || 'none'}</div>
        </div>
      )}
    </div>
  );
};

// Export individual role-specific components for backward compatibility
export const Agent_ProfileDropDown = (props: ProfileDropDownProps) => (
  <ProfileDropDown {...props} currentRole="agent" />
);

export const Buyer_ProfileDropDown = (props: ProfileDropDownProps) => (
  <ProfileDropDown {...props} currentRole="buyer" />
);

export const Transporter_ProfileDropDown = (props: ProfileDropDownProps) => (
  <ProfileDropDown {...props} currentRole="transporter" />
);

// Make ProfileDropDown the default export
export default ProfileDropDown;