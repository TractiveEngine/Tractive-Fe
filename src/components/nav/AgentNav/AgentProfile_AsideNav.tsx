import {
  CallOutlineIcon,
  ProfileSettingIcon,
  SecurityIcon,
  WalletAddIcon,
} from "@/icons/Icon1";
import { ArrowRightIcon } from "@/icons/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ProfilePicture } from "@/app/(profiles)/agent-profile/_components/ProfilePicture";
import { useUserProfile } from "@/hooks/queries/useUserQueries";

export const AgentProfile_AsideNav = () => {
  const pathname = usePathname();
  const { data: user } = useUserProfile();

  return (
    <div className="flex flex-col justify-center gap-4 w-[100%] pt-12 pb-4 bg-[#fefefe] shadow-md rounded-md">
      <div className=" flex flex-col items-center justify-center gap-4">
        <ProfilePicture />
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            {user?.businessName || "Agent Business"}
          </span>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            {user?.activeRole || "Agent"}
          </span>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <CallOutlineIcon />
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                {user?.phone || "No phone"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* ===== user Details ===== */}
      <div className="flex flex-col w-[100%]">
        <ul className="flex flex-col w-[100%]">
          <li
            className={`p-6 cursor-pointer ${
              pathname === "/agent-profile"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/agent-profile"
              className="flex items-center justify-between"
            >
              <div className="flex items-center font-montserrat font-normal gap-2 text-[14px] text-[#2b2b2b]">
                <ProfileSettingIcon />
                Profile Setting
              </div>
              <ArrowRightIcon />
            </Link>
          </li>

          <li
            className={`p-6 cursor-pointer ${
              pathname === "/agent-profile/agent-security-setting"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/agent-profile/agent-security-setting"
              className="flex items-center justify-between"
            >
              <div className="flex items-center font-montserrat font-normal gap-2 text-[14px] text-[#2b2b2b]">
                <SecurityIcon />
                Security Setting
              </div>
              <ArrowRightIcon />
            </Link>
          </li>
          <li
            className={`p-6 cursor-pointer ${
              pathname === "/agent-profile/agent-bank-account"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/agent-profile/agent-bank-account"
              className="flex items-center justify-between"
            >
              <div className="flex items-center font-montserrat font-normal gap-2 text-[14px] text-[#2b2b2b]">
                <WalletAddIcon />
                Bank Account
              </div>
              <ArrowRightIcon />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
