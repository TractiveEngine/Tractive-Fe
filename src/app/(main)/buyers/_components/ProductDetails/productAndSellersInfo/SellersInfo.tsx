import { StarIcon, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import React from "react";

export const SellersInfo = () => {
  return (
    <div className="w-[50%] flex flex-col gap-[10px]">
      <div className="flex flex-col gap-[12px] bg-[#fefefe] px-4 pt-2 pb-6 rounded-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[12px]">
          Sellers Information
        </p>
        <div className="flex items-center gap-2">
          <div>
            <Image
              src="/images/bidder2.png"
              alt="Sellers profile"
              width={45}
              height={45}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
                  Goddess Corporation
                </span>
                <span className="w-[10px] h-[10px] rounded-[100px] bg-[#2b2b2b]"></span>
                <span className="font-montserrat font-normal text-[14px] text-[#538e53]">
                  Follow
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <StarIcon />
                <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                  4.0
                </span>
              </div>
              <small className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                700 followers
              </small>
              <small className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                Aba State
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-1.5 bg-[#fefefe] px-4 pt-2 pb-6 rounded-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <div className="relative flex items-center gap-2">
          <Image
            src="/images/bidder4.png"
            alt="comment Profile"
            width={30}
            height={30}
          />
          <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
            Kelvin Chikezie
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <YellowStarIcon />
          <YellowStarIcon />
          <YellowStarIcon />
          <YellowStarIcon />
          <StarIcon />
        </div>
      </div>
    </div>
  );
};
