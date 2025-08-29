
import React from "react";
import { EyeIcon, Profile2User } from "../../_components/icons/AdminIcons";
import { RedSmallChart, SmallChart } from "../../_components/SmallChart";

export const AllUserOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full items-center">
      <div className="flex flex-col gap-2 w-full bg-[#fefefe] px-1.5 py-1.5 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#e2e2e2] p-1 rounded-[100px]">
            <Profile2User stroke="#2b2b2b" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            All users
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

      <div className="flex flex-col gap-2 w-full bg-[#fefefe] px-1.5 py-1.5 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#CCE5CC80] p-1 rounded-[100px]">
            <Profile2User stroke="#538e53" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Active Users
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

      <div className="flex flex-col gap-2 w-full bg-[#fefefe] px-1.5 py-1.5 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#F2D8C599] p-1 rounded-[100px]">
            <Profile2User stroke="#D77F40" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Inactive users
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

      <div className="flex flex-col gap-2 w-full bg-[#fefefe] px-1.5 py-1.5 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#7912FF33] p-1 rounded-[100px]">
            <EyeIcon stroke="#9747FF" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Visitors
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
          <RedSmallChart />
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full bg-[#fefefe] px-1.5 py-1.5 rounded-[4px] shadow-md">
        <div className="flex items-center gap-1">
          <div className="bg-[#D0B83A33] p-1 rounded-[100px]">
            <Profile2User stroke="#D6B611" />
          </div>
          <p className="font-montserrat text-[#2b2b2b] text-[12px] font-normal">
            Active Users
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
    </div>
  );
};
