import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SwapIcon } from "@/icons/Icon1";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Admin_ProfileDropDown = ({ onLogout }: ProfileDropDownProps) => {
  return (
    <div className="flex flex-col gap-3 absolute right-0 top-12 pt-2 w-48 bg-[#fefefe] rounded-[4px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.05)] z-20">
      <ul className="flex flex-col">
        <li className="w-[95%] mx-auto">
          <Link
            href="/agent-profile"
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
        <Link href="/buyers" className="flex items-center justify-between cursor-pointer">
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
                Register as buyer
              </span>
              <span className="block text-[10px] text-[#2b2b2b]">
                Buyers account
              </span>
            </div>
          </div>
          <SwapIcon />
        </Link>
        <Link href="/transporters" className="flex items-center justify-between cursor-pointer">
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
                Register as transporter
              </span>
              <span className="block text-[10px] text-[#2b2b2b]">
                Transporters account
              </span>
            </div>
          </div>
          <SwapIcon />
        </Link>
      </div>
    </div>
  );
};
