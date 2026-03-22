"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { SwapIcon } from "../../../icons/Icon1";
import { useSwitchRole } from "@/hooks/queries/useUserQueries";

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

export const ProfileDropDown = ({
  onLogout,
  currentRole,
}: ProfileDropDownProps) => {
  const router = useRouter();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { data: session, update } = useSession();
  const switchRoleMutation = useSwitchRole();

  const user = session?.user;
  const activeRole = currentRole || user?.activeRole;

  // Get all roles except the currently active one
  const allRoles: UserRole[] = ["agent", "buyer", "transporter"];
  const dropdownRoles = allRoles.filter((role) => role !== activeRole);

  const handleSwitchRole = async (role: UserRole) => {
    // Check if role is available (created) using session data
    // session.user.role is the array of created roles
    const isAvailable = user?.role?.includes(role);

    if (!isAvailable) {
      toast.info(`Creating your ${ROLE_CONFIGS[role].displayName} account...`);
      router.push(`/add-role?role=${role}`);
      return;
    }

    // Role exists, switch to it
    const loadingToastId = toast.loading(
      `Switching to ${ROLE_CONFIGS[role].displayName} role...`,
    );

    try {
      await switchRoleMutation.mutateAsync({ activeRole: role });

      // Update session to reflect the new active role immediately
      await update({
        activeRole: role,
      });

      toast.dismiss(loadingToastId);
      toast.success(`Switched to ${ROLE_CONFIGS[role].displayName} role!`);

      // Redirect
      router.push(`/${role}`);
    } catch (error: any) {
      console.error("Role switch error:", error);
      toast.dismiss(loadingToastId);
      toast.error(error.message || "Failed to switch role.");
    }
  };



  // Get the profile path for the current active role
  const currentProfilePath =
    activeRole && ROLE_CONFIGS[activeRole as UserRole]
      ? ROLE_CONFIGS[activeRole as UserRole].profilePath
      : "/profile";

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
          // Only show roles that the user HAS created
          if (!user?.role?.includes(role)) return null;

          const config = ROLE_CONFIGS[role];

          return (
            <button
              key={role}
              onClick={() => handleSwitchRole(role)}
              className="flex items-center justify-between cursor-pointer p-1 rounded hover:bg-[#f5f5f5] transition-colors w-full"
              title={`Switch to ${config.displayName} account`}
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
                  <span className="block text-[10px] text-[#2b2b2b] font-medium text-left">
                    {config.displayName}
                  </span>
                  <span className="block text-[10px] text-[#666666] text-left">
                    {config.accountLabel}
                  </span>
                </div>
              </div>
              <SwapIcon />
            </button>
          );
        })}

        {dropdownRoles.filter(r => user?.role?.includes(r)).length === 0 && (
           <div className="text-[10px] text-[#666666] text-center py-2 italic hidden">
            No other accounts
          </div>
        )}

        {/* Add New Account Button */}
        <div className="mt-2 pt-2 border-t border-[#e2e2e2]">
           <Link
            href="/account/add"
            className="flex items-center gap-2 w-full p-1 rounded hover:bg-[#f5f5f5] transition-colors text-left"
          >
             <div className="flex items-center justify-center w-[25px] h-[25px] rounded-full border border-dashed border-[#538E53] text-[#538E53]">
               <span className="text-lg leading-none mb-[2px]">+</span>
             </div>
             <span className="text-[11px] font-medium text-[#538E53]">
               Add New Account
             </span>
          </Link>
        </div>
      </div>

      {/* Debug info if needed, or remove */}
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
