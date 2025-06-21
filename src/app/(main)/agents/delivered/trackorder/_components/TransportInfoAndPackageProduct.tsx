import { AwardIcon, StarIcon, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import React from "react";
import {
  MessageFill,
  PhoneCallFill,
} from "../../../_components/Icons/AgentIcons";

export const TransportInfoAndPackageProduct = () => {
  return (
    <div className="flex gap-2 rounded-[10px]">
      {/* Transport Information */}
      <div className="flex flex-col bg-[#fefefe] shadow-md rounded-[10px] p-4 w-full">
        <h2 className="font-montserrat font-normal text-[15px] text-[#2b2b2b]">
          Transporter Info
        </h2>
        <div className=" flex flex-col gap-2 items-center justify-center">
          <div className=" flex flex-col gap-2 items-center justify-center">
            <Image
              src="/images/profileSettingImage.png"
              alt="transporter Image"
              width={60}
              height={60}
              className="rounded-[100%] object-cover"
            />
            <span className="font-montserrat font-normal text-[15px] text-[#2b2b2b]">
              Goodness corporation
            </span>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <StarIcon />
              </div>
              <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                4.0
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <button className="border-[1px] border-[#808080] text-[#2b2b2b] font-montserrat font-medium text-[12px] px-8 py-2.5 rounded-[50px]">
                Follow
              </button>
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                700 Followers
              </span>
            </div>
            <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
              Abia State
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 p-2 bg-[#cce5cc] rounded-[100px] cursor-pointer">
                <MessageFill />
              </div>
              <div className="flex items-center justify-center w-8 h-8 p-2 bg-[#cce5cc] rounded-[100px] cursor-pointer">
                <PhoneCallFill />
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <AwardIcon />
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                5 years of transportation service
              </span>
            </div>
            <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
              Rating: Excellent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
