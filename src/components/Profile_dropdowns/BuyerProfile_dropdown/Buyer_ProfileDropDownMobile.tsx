import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SwapIcon } from "@/icons/Icon1";

interface ProfileDropDownProps {
  onLogout: () => void;
}

export const Buyer_ProfileDropDownMobile = ({ onLogout }: ProfileDropDownProps) => {
  return (
    <div className="flex flex-col gap-3 pt-2 w-full bg-[#fefefe] rounded-[4px] z-20">
      <ul className="flex flex-col">
        <li className="w-[95%] mx-auto">
          <Link
            href="/buyer-profile"
            className="block px-3 py-1 text-[12px] text-[#2b2b2b] rounded-[4px] hover:bg-[#2b2b2b] transition-all duration-200 hover:text-[#fefefe]"
          >
            Profile settings
          </Link>
        </li>
        <li className="w-[95%] mx-auto">
          <button
            onClick={onLogout}
            className="block w-full text-left px-3 py-1 text-[12px] text-[#2b2b2b] rounded-[4px] hover:bg-[#2b2b2b] transition-all duration-200 hover:text-[#FEFEFE] cursor-pointer"
          >
            Logout
          </button>
        </li>
      </ul>
      <span className="w-[100%] h-[1px] bg-[#e2e2e2]"></span>
      {/* ===== Account Switch ====== */}
      <div className="flex flex-col gap-2 px-3 pb-3">
        <div className="flex items-center justify-between cursor-pointer">
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
                Register as agent
              </span>
              <span className="block text-[10px] text-[#2b2b2b]">
                Agents account
              </span>
            </div>
          </div>
          <SwapIcon />
        </div>
        <div className="flex items-center justify-between cursor-pointer">
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
        </div>
      </div>
    </div>
  );
};
