"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SwapIcon } from "../../../icons/Icon1";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAuthToken, getLoggedInUser } from "../../../utils/loginAuth";
import axios from "axios";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Buyer_ProfileDropDown = ({ onLogout }: ProfileDropDownProps) => {
  const router = useRouter();
  const user = getLoggedInUser();
  const availableRoles = ["agent", "buyer", "transporter"];
  const userRoles = user?.roles || [];
  // Filter out the active role from the dropdown
  const dropdownRoles = availableRoles.filter(
    (role) => role !== user?.activeRole
  );

  const handleSwitchRole = async (role: string) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Unauthorized access. Please login.", {
        duration: 3000,
        position: "top-center",
      });
      router.replace("/login");
      return;
    }

    if (!userRoles.includes(role)) {
      localStorage.setItem("pendingRole", role);
      router.push("/register-as");
      return;
    }

    const loadingToastId = toast.loading(`Switching to ${role} role...`, {
      position: "top-center",
    });

    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://tractive-be.vercel.app";
      const response = await axios.post(
        `${API_URL}/api/auth/add-account`,
        { role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to switch role.");
      }

      if (user) {
        const updatedSession = {
          ...user,
          activeRole: role,
          token: response.data.token || user.token, // Update token if provided
        };
        localStorage.setItem("session", JSON.stringify(updatedSession));
        localStorage.setItem("userRole", role); // Maintain legacy
      }

      toast.dismiss(loadingToastId);
      toast.success(`Switched to ${role} role!`, {
        duration: 2000,
        position: "top-center",
      });

      const onboardingCompleted =
        localStorage.getItem("onboardingCompleted") === "true";
      const redirectPath = onboardingCompleted ? `/${role}` : "/onboarding";
      router.push(redirectPath);
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Failed to switch role.", {
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 absolute right-0 top-12 pt-2 w-48 bg-[#fefefe] rounded-[4px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.05)] z-20">
      <ul className="flex flex-col">
        <li className="w-[95%] mx-auto">
          <Link
            href="/buyer-profile"
            className="block px-3 py-1 text-[12px] text-[#2b2b2b] rounded-[4px] hover:bg-[#538E53] hover:text-[#fefefe]"
          >
            Profile settings
          </Link>
        </li>
        <li className="w-[95%] mx-auto">
          <button
            onClick={onLogout}
            className="block w-full text-left px-3 py-1 text-[12px] text-[#2b2b2b] rounded-[4px] hover:bg-[#538E53] hover:text-[#FEFEFE] cursor-pointer"
          >
            Logout
          </button>
        </li>
      </ul>
      <span className="w-[100%] h-[1px] bg-[#e2e2e2]"></span>
      <div className="flex flex-col gap-2 px-3 pb-3">
        {dropdownRoles.map((role) => (
          <button
            key={role}
            onClick={() => handleSwitchRole(role)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <Image
                src="/images/profile_image.png"
                alt="Profile"
                width={25}
                height={25}
                className="rounded-full"
              />
              <div className="flex flex-col items-start">
                <span className="block text-[10px] text-[#2b2b2b]">
                  {role === "agent"
                    ? "Agent"
                    : role === "buyer"
                    ? "Buyer"
                    : "Transporter"}{" "}
                  {userRoles.includes(role) ? "(Switch)" : "(Add)"}
                </span>
                <span className="block text-[10px] text-[#2b2b2b]">
                  {role === "agent"
                    ? "Agents account"
                    : role === "buyer"
                    ? "Buyers account"
                    : "Transporters account"}
                </span>
              </div>
            </div>
            <SwapIcon />
          </button>
        ))}
      </div>
    </div>
  );
};
