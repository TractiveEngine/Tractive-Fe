import { ProfilePicture } from "@/app/(auth)/(profiles)/_components/ProfilePicture";
import {
  CallOutlineIcon,
  DeliveryIcon,
  ProfileSettingIcon,
  SecurityIcon,
} from "@/icons/Icon1";
import { ArrowRightIcon } from "@/icons/Icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

interface OnboardingData {
  state: string;
  CAC: string;
  address: string;
  mobile: string;
  alternativeMobile: string;
  businessName: string;
  interests: string[];
}

export const AsideNav = () => {
  const pathname = usePathname();
  const onboardingData: OnboardingData | null = (() => {
    try {
      const data = localStorage.getItem("onboarding-data");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing onboarding-Data:", error);
      return null;
    }
  })();

  return (
    <div className="flex flex-col justify-center gap-4 w-[100%] pt-12 pb-4 bg-[#fefefe] shadow-md rounded-md">
      <div className=" flex flex-col items-center justify-center gap-4">
        <ProfilePicture />
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            {onboardingData?.businessName}
          </span>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            oyinjoe23@gmail.com
          </span>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <CallOutlineIcon />
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                {onboardingData?.mobile}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <CallOutlineIcon />

              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                {onboardingData?.alternativeMobile}
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
              pathname === "/profile-settings"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/profile-settings"
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
              pathname === "/security-setting"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/security-setting"
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
              pathname === "/delivery-location"
                ? "bg-[#cce5cc]"
                : "hover:bg-[#e2e2e2] "
            }`}
          >
            <Link
              href="/delivery-location"
              className="flex items-center justify-between"
            >
              <div className="flex items-center font-montserrat font-normal gap-2 text-[14px] text-[#2b2b2b]">
                <DeliveryIcon />
                Delivery Location
              </div>
              <ArrowRightIcon />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
