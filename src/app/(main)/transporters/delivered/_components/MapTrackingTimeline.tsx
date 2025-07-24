import Image from "next/image";
import React from "react";
import "../TrackOrder.css"; // Ensure this CSS file is imported for styles
import { TickIcon } from "../../_components/Icons/TransporterIcons";

export const MapTrackingTimeline = () => {
  return (
    <div className="w-full h-fit flex flex-col gap-4 bg-[#fefefe] rounded-[10px] shadow-md">
      <Image
        src="/images/trackingMap.png"
        alt="Map"
        width={699}
        height={508}
        className="object-cover w-full h-auto max-h-[400px] sm:max-h-[500px]"
      />
      <div className="relative w-[100%] mx-auto h-[50px] sm:h-[60px]">
        <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_m1 border-dashed border-[1px] border-[#808080]"></div>
        <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_m2 border-dashed border-[1px] border-[#808080]"></div>
        <div className="absolute left-[3%] Picked_Date top-0 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-3 h-3 sm:w-4 sm:h-4 z-10">
            <TickIcon />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
              Picked
            </span>
            <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
              20/04/2025
            </span>
          </div>
        </div>
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#538e53] text-[#fefefe] w-3 h-3 sm:w-4 sm:h-4 z-10">
            <TickIcon />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
              On Transit
            </span>
            <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
              23/04/2025
            </span>
          </div>
        </div>
        <div className="absolute right-[2%] deliveredEST_Date top-0 flex flex-col gap-1 justify-center items-center">
          <div className="flex items-center p-[3px] justify-center rounded-full bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe] w-3 h-3 sm:w-4 sm:h-4 z-10"></div>
          <div className="flex flex-col items-center">
            <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
              Delivered
            </span>
            <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
              EST date 26/04/2025
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 pb-4">
        <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
          From: Umuahia, Abia State
        </span>
        <span className="font-montserrat font-medium text-[10px] sm:text-[11px] text-[#2b2b2b]">
          To: Ikorodu, Lagos State
        </span>
      </div>
    </div>
  );
};
