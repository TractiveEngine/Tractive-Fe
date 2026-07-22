import {
  CallOutlineIcon,
  DeliveryIcon,
  ProfileSettingIcon,
  SecurityIcon,
  WalletAddIcon,
} from "../../../icons/Icon1";
import { ArrowRightIcon } from "../../../icons/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { ProfilePicture } from "../../../app/(profiles)/transporter-profile/_components/ProfilePicture";
// import { ProfilePicture } from "./app/(profiles)/agent-profile/_components/ProfilePicture";

import { useProfile } from "@/hooks/queries/useUserQueries";

export const TransporterProfile_AsideNav = () => {
  const pathname = usePathname();
  // Reads the saved profile. This used to read localStorage["onboarding-data"],
  // a key nothing ever writes — onboarding saves under `onboarding-data-${role}`
  // — so the name and phone were always blank.
  const { data: profile } = useProfile();

  return (
    <div className="flex flex-col justify-center gap-4 w-[100%] pt-12 pb-4 bg-[#fefefe] shadow-none md:shadow-md rounded-md">
      <div className=" flex flex-col items-center justify-center gap-4">
        <ProfilePicture />
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            {(profile?.name as string) || ""}
          </span>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            {(profile?.email as string) || ""}
          </span>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <CallOutlineIcon />
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                {(profile?.phone as string) || ""}
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
              pathname === "/transporter-profile"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/transporter-profile"
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
              pathname === "/transporter-profile/transporter-security-setting"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/transporter-profile/transporter-security-setting"
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
              pathname === "/transporter-profile/transporter-delivery-location"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/transporter-profile/transporter-delivery-location"
              className="flex items-center justify-between"
            >
              <div className="flex items-center font-montserrat font-normal gap-2 text-[14px] text-[#2b2b2b]">
                <DeliveryIcon />
                Delivery Location
              </div>
              <ArrowRightIcon />
            </Link>
          </li>

          <li
            className={`p-6 cursor-pointer ${
              pathname === "/transporter-profile/transporter-bank-account"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/transporter-profile/transporter-bank-account"
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
