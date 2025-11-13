"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons/Icons";
import React, { useState } from "react";
import { IoIosCheckmark } from "react-icons/io";

const interests = [
  "fish",
  "Tubers",
  "Grains",
  "Edible",
  "Livestock",
  "Vegetable",
];

export const FilterProduct = () => {
  const [switchSide, setSwitchSide] = useState<string>("high-to-low");
  const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedFilter((prev) => {
      const updated = prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest];
      return updated;
    });
  };

  const handleSortToggle = (direction: string) => {
    setSwitchSide(direction);
  };

  return (
    <div className="w-full bg-[#fefefe]">
      <div className="w-[90%] mx-auto py-3 flex flex-col lg:flex-row gap-8">
        <input
          type="text"
          placeholder="Search"
          className=" w-[70%] md:w-[500px] h-[2.4rem] p-2 border border-[#808080] rounded-md text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-1 focus:ring-[#538e53] focus:border-transparent text-[12px] sm:text-[14px]"
        />

        {/* Interests (Toggle Radio) */}
        <div className="w-[100%] flex flex-col md:flex-row md:items-center gap-2">
          <label className="w-[57px] text-[12px] font-montserrat font-normal text-[#808080]">
            Filter by:
          </label>
          <div className="flex w-[100%] flex-wrap gap-2">
            {interests.map((interest) => {
              const isSelected = selectedFilter.includes(interest);
              return (
                <label
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`flex items-center cursor-pointer border rounded-full px-2 py-1 min-w-[10px] h-[1.7rem] gap-1 text-[12px] font-montserrat font-normal transition-all ${
                    isSelected
                      ? "bg-[#538e53] text-[#fefefe] border-[#538e53]"
                      : "text-[#808080] border-[#808080]"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={interest}
                    checked={isSelected}
                    className="hidden"
                    onChange={() => toggleInterest(interest)}
                  />
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "bg-[#fefefe] border-[#fefefe]"
                        : "border-[#808080]"
                    }`}
                  >
                    {isSelected && (
                      <IoIosCheckmark className="w-4 h-4 text-[#538e53]" />
                    )}
                  </span>
                  <span>{interest}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 w-[100%] md:w-[25%]">
          <span className="text-[12px] font-montserrat font-normal text-[#808080]">
            Sort by:
          </span>
          <div className="flex items-center gap-2 border-[1px] border-[#808080] rounded-[5px] px-1.5 py-0.5 ">
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
