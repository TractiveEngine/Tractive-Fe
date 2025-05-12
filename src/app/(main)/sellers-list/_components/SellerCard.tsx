"use client";
import { Button } from "@/components/Button";
import { AwardIcon, YellowStarIcon } from "@/icons/Icons";
import React from "react";

interface SellerCardProps {
  image: string;
  sellerName: string;
  rating: number;
  rateStatus: string;
  sellerYear: string;
  customerNumber: number;
  sellerBio: string;
}

export const SellerCard = ({
  image,
  sellerName,
  rating,
  rateStatus,
  sellerYear,
  customerNumber,
  sellerBio,
}: SellerCardProps) => {
  return (
    <div className="border-[1px] border-[#808080] w-[23.999%] rounded-lg">
      <div className="flex flex-col justify-center w-full p-4 rounded-lg">
        <img src={image} alt={sellerName} className="w-12 h-12 rounded-full" />
        <h2 className="font-montserrat font-medium text-[17px] text-[#2b2b2b]">
          {sellerName}
        </h2>
        <div className="flex items-center gap-[0.5rem] mb-2">
          <div className="flex items-center gap-[4px]">
            <AwardIcon />
            <span className="font-montserrat font-normal text-[12px] text-[#2b2b2b]">
              {sellerYear} years
            </span>
          </div>
          <span className="w-[10px] h-[10px] rounded-[100px] bg-[#2b2b2b]"></span>
          <div className=" flex items-center gap-[10px]">
            <div className="flex items-center gap-[3px]">
              <YellowStarIcon />
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                {rating}
              </span>
            </div>
            <p className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
              Rating <span>{rateStatus}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center bg-[#F7DFFF80] w-[60%] py-1.5 px-4 rounded-[100px] justify-center gap-[4px]">
          <p className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            {customerNumber} customers
          </p>
        </div>
        <p className="font-montserrat mt-2 font-normal text-[13px] text-[#2b2b2b]">
          {sellerBio}
        </p>
        <Button
          text="View"
          onClick={() => {}}
          className=" mx-auto justify-center w-[90%] mt-[0.7rem] text-[#fefefe] py-3 px-4 !rounded-[100px]"
          textClass="font-montserrat font-normal text-[14px] text-[#fefefe]"
        />
      </div>
    </div>
  );
};
