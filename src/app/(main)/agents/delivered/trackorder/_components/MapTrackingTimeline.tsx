import Image from "next/image";
import React from "react";
import { TickIcon } from "../../../_components/Icons/AgentIcons";

export const MapTrackingTimeline = () => {
  return (
    <div className="w-full flex flex-col gap-[1rem] bg-[#fefefe] rounded-[10px] shadow-md">
      <Image
        src="/images/trackingMap.png"
        alt="Map"
        width={699}
        height={508}
        className="object-cover w-full h-auto"
      />

      {/* Timeline Container */}
      <div className="relative w-[90%] mx-auto h-[60px]">
        {/* Dashed Line: Picked to On Transit */}
        <div className="absolute top-[0.5rem] left-[10%] right-[13.7rem] h-[2px] border-dashed border-[1px] border-[#808080]"></div>

        {/* Dashed Line: On Transit to Delivered */}
        <div className="absolute top-[0.5rem] left-[50%] right-[4.7rem] h-[2px] border-dashed border-[1px] border-[#808080]"></div>

        {/* Status Points */}
        <div className="absolute left-0 top-0 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-4 h-4 z-10">
            <TickIcon />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
              Picked
            </span>
            <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
              20/04/2025
            </span>
          </div>
        </div>

        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-4 h-4 z-10">
            <TickIcon />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
              On Transit
            </span>
            <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
              23/04/2025
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full border-[1px] border-[#808080] text-[#fefefe] w-4 h-4 z-10">
            {/* <TickIcon /> */}
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
              Delivered
            </span>
            <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">
              EST date 26/04/2025
            </span>
          </div>
        </div>
          </div>
          
          <div className="flex items-center justify-center gap-[2rem] pb-4">
              <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">From: Umuahia, Abia State</span>
              <span className="font-montserrat font-medium text-[13px] text-[#2b2b2b]">To: Ikorodu, Lagos State</span> 
          </div>
    </div>
  );
};
