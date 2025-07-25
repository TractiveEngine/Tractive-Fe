"use client";
import Image from "next/image";
import { StarIcon, YellowStarIcon } from "@/icons/Icons";
import "../../TrackOrder.css"; // Ensure this CSS file is imported for styles
import {
  TickIcon,
} from "../../../_components/Icons/TransporterIcons";
import { TabTitlesProps } from "../TabTitles";

export const OnTransitOrderTracking = ({
  isPicked,
  isOnTransit,
  isDelivered,
  onDeliveredClick,
}: TabTitlesProps) => {
  return (
    <div className="w-full flex flex-col gap-4 bg-[#fefefe] p-3 sm:p-4 rounded-[10px] h-fit">
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-3 border-[2px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
          <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Image
                  src="/images/GIGM.png"
                  alt="GIGM Logo"
                  width={50}
                  height={35}
                  className="object-cover w-10 h-7 sm:w-12 sm:h-8"
                />
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[11px] sm:text-[12px] text-[#2b2b2b]">
                    GIGM Transport Company
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <YellowStarIcon />
                      <YellowStarIcon />
                      <YellowStarIcon />
                      <YellowStarIcon />
                      <StarIcon />
                    </div>
                    <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                      4.0
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onDeliveredClick}
                className="cursor-pointer flex items-center gap-[7px] px-4 sm:px-6 py-2 opacity-[0.9] bg-[#538e53] text-[#f9f9f9] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors hover:bg-[#467a46]"
                aria-label="Delivered"
              >
                Delivered
              </button>
            </div>
          </div>
          {/* Timeline Container */}
          <div className="relative w-[100%] mx-auto h-[40px] sm:h-[50px]">
            <div className="absolute top-[0.5rem] left-[10%] right-[55%] h-[2px] timeline_dashed_line_1 border-dashed border-[1px] border-[#808080]"></div>
            <div className="absolute top-[0.5rem] left-[45%] right-[10%] h-[2px] timeline_dashed_line_2 border-dashed border-[1px] border-[#808080]"></div>
            <div className="absolute left-[5%] top-0 flex flex-col gap-1 justify-center items-center">
              <div
                className={`flex items-center p-[3px] justify-center rounded-full ${
                  isPicked
                    ? "bg-[#538e53] text-[#fefefe]"
                    : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
                } w-3 h-3 sm:w-4 sm:h-4 z-10`}
              >
                {isPicked && <TickIcon />}
              </div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                Picked
              </span>
            </div>
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col gap-1 justify-center items-center">
              <div
                className={`flex items-center p-[3px] justify-center rounded-full ${
                  isOnTransit
                    ? "bg-[#538e53] text-[#fefefe]"
                    : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
                } w-3 h-3 sm:w-4 sm:h-4 z-10`}
              >
                {isOnTransit && <TickIcon />}
              </div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                On Transit
              </span>
            </div>
            <div className="absolute right-[5%] top-0 flex flex-col gap-1 justify-center items-center">
              <div
                className={`flex items-center p-[3px] justify-center rounded-full ${
                  isDelivered
                    ? "bg-[#538e53] text-[#fefefe]"
                    : "bg-[#fefefe] border-[1px] border-[#808080] text-[#fefefe]"
                } w-3 h-3 sm:w-4 sm:h-4 z-10`}
              >
                {isDelivered && <TickIcon />}
              </div>
              <span className="font-montserrat font-medium text-[10px] sm:text-[12px] text-[#2b2b2b]">
                Delivered
              </span>
            </div>
          </div>
          <div className="flex flex-col border-[1px] p-3 sm:p-4 rounded-[10px] border-[#538e53]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
                  <Image
                    src="/images/Trucker.png"
                    alt="Trucker Image"
                    width={40}
                    height={40}
                    className="object-cover w-8 h-8 sm:w-10 sm:h-10"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    Mack4567
                  </span>
                  <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    IOT: 5677666655
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 p-2 bg-[#CCE5CC] rounded-[4px]">
                  <Image
                    src="/images/foodTracked.png"
                    alt="product Image"
                    width={50}
                    height={30}
                    className="object-cover w-10 h-6 sm:w-12 sm:h-8"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    Tomatoes
                  </span>
                  <p className="font-montserrat font-medium text-[12px] text-[#2b2b2b]">
                    ID: 2964532561
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
