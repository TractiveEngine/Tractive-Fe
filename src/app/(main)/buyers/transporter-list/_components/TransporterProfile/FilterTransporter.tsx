
"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import React, { useState } from "react";
import { LiaAngleDownSolid } from "react-icons/lia";

interface FilterTransporterProps {
  setFromState: React.Dispatch<React.SetStateAction<string>>;
  setToState: React.Dispatch<React.SetStateAction<string>>;
  fromState: string;
  toState: string;
}


export const FilterTransporter = ({
  setFromState,
  setToState,
  fromState,
  toState,
}: FilterTransporterProps) => {
  const [switchSide, setSwitchSide] = useState<string>("high-to-low");

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const handleSortToggle = (direction: string) => {
    setSwitchSide(direction);
  };

  return (
    <div className="w-full bg-[#fefefe]">
      <div className="w-[90%] mx-auto py-3 flex flex-col lg:flex-row gap-8">
        <input
          type="text"
          placeholder="Search"
          className="w-[70%] md:w-[500px] h-[2.4rem] p-2 border border-[#808080] rounded-[100px] text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-[0.5px] focus:ring-[#538e53] focus:border-transparent text-[12px] sm:text-[14px]"
        />

        {/* Route Filter */}
        <div className="w-[100%] flex flex-col md:flex-row md:items-center gap-2">
          <label className="text-[12px] font-montserrat font-normal text-[#808080]">
            Route:
          </label>
          <div className="flex items-center w-[100%] flex-wrap gap-2">
            <div className="relative w-[45%] md:w-[90px] flex items-center justify-center">
              <select
                id="from-state"
                aria-label="From State"
                value={fromState}
                onChange={(e) => setFromState(e.target.value)}
                className="appearance-none w-[45%] md:w-[90px] h-[1.7rem] p-1 border-[1px] border-[#808080] rounded-[5px] text-[#2b2b2b] text-[12px] font-montserrat font-normal focus:outline-none focus:ring-[0.5px] focus:ring-[#538e53] cursor-pointer"
              >
                <option value="" disabled>
                  State
                </option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <LiaAngleDownSolid className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#808080] text-[12px]" />
            </div>
            <span className="text-[12px] flex flex-col items-center justify-center rounded-[4px] font-montserrat font-normal bg-[#cce5ccb2] px-[11px] py-1 h-[21.5px] text-[#808080]">
              To
            </span>
            <div className="relative w-[45%] md:w-[90px]">
              <select
                id="to-state"
                aria-label="From State"
                value={toState}
                onChange={(e) => setToState(e.target.value)}
                className="appearance-none w-[45%] md:w-[90px] h-[1.7rem] p-1 border-[1px] border-[#808080] rounded-[5px] text-[#2b2b2b] text-[12px] font-montserrat font-normal focus:outline-none focus:ring-[0.5px] focus:ring-[#538e53] cursor-pointer"
              >
                <option value="" disabled>
                  State
                </option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <LiaAngleDownSolid className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#808080] text-[12px]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-[100%] md:w-[25%]">
          <span className="text-[12px] font-montserrat font-normal text-[#808080]">
            Sort by:
          </span>
          <div className="flex items-center gap-2 border-[1px] border-[#808080] rounded-[5px] px-1.5 py-0.5">
            <div className="flex flex-col justify-center">
              <ArrowUpIcon
                className={`w-3 h-3 ${
                  switchSide === "low-to-high"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() =>
                  switchSide !== "low-to-high" &&
                  handleSortToggle("low-to-high")
                }
              />
              <ArrowDownIcon
                className={`w-3 h-3 ${
                  switchSide === "high-to-low"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() =>
                  switchSide !== "high-to-low" &&
                  handleSortToggle("high-to-low")
                }
              />
            </div>
            <span className="text-[12px] font-montserrat font-normal text-[#2b2b2b]">
              {switchSide === "high-to-low" ? "High to Low" : "Low to High"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};