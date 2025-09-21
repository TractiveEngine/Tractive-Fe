import { Bag2Icon, MoneyReceive2Icon, Profile2UserIcon } from "@/icons/DashboardIcons";
import React from "react";
import { RedSmallChart, SmallChart } from "./SmallChart";

export const TransporterOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full items-center">

      <div className="flex flex-col gap-2 w-full bg-[#fefefe] p-3 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#CCE5CC4D] p-1 rounded-[100px]">
            <MoneyReceive2Icon stroke="#538e53" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Revenue
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
            $25,550,000
          </span>
          <span className="bg-[#cce5cc] text-[#2b2b2b] rounded-full px-1.5 py-0.5 text-[10px] font-montserrat">
            +25%
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
            In contrast to last week
          </span>
          <SmallChart />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full bg-[#fefefe] p-3 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#F2D8C599] p-1 rounded-[100px]">
            <Profile2UserIcon stroke="#D77F40" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Customers
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
            250
          </span>
          <span className="bg-[#cce5cc] text-[#2b2b2b] rounded-full px-1.5 py-0.5 text-[10px] font-montserrat">
            +25%
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
            In contrast to last week
          </span>
          <SmallChart />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full bg-[#fefefe] p-3 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#7912FF33] p-1 rounded-[100px]">
            <Bag2Icon stroke="#7912FF" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Fleets
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
            35
          </span>
          <span className="bg-[#EEDEDE] text-[#2b2b2b] rounded-full px-1.5 py-0.5 text-[10px] font-montserrat">
            +25%
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
            In contrast to last week
          </span>
          <RedSmallChart />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full bg-[#fefefe] p-3 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#F2D8C599] p-1 rounded-[100px]">
            <Profile2UserIcon stroke="#D77F40" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Drivers
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-montserrat text-[#2b2b2b] text-[12px] font-medium">
            550
          </span>
          <span className="bg-[#cce5cc] text-[#2b2b2b] rounded-full px-1.5 py-0.5 text-[10px] font-montserrat">
            +25%
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-montserrat text-[#2b2b2b] w-[100%] text-[10px] font-normal">
            In contrast to last week
          </span>
          <SmallChart />
        </div>
      </div>
    </div>
  );
};
