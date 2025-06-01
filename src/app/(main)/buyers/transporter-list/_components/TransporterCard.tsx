"use client";
import { Button } from "@/components/Button";
import { AwardIcon, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TransporterCardProps {
  id: string;
  image: string;
  transporterName: string;
  rating: number;
  rateStatus: string;
  transporterYear: string;
  customerNumber: number;
  transporterBio: string;
}

export const TransporterCard: React.FC<TransporterCardProps> = ({
  id,
  image,
  transporterName,
  rating,
  rateStatus,
  transporterYear,
  customerNumber,
  transporterBio,
}) => {
  return (
    <div className="border-[1px] border-[#808080] w-full rounded-lg">
      <div className="flex flex-col justify-center w-full p-3 rounded-lg">
        <Image
          width={100}
          height={100}
          src={image}
          alt={transporterName}
          className="w-12 h-10 sm:w-[6rem] sm:h-12"
        />
        <div className="flex flex-col w-[100%] h-[12rem]">
          <h2 className="font-montserrat font-medium text-[13px] sm:text-[15px] text-[#2b2b2b] mt-2">
            {transporterName}
          </h2>
          <div className="flex items-center w-full gap-[7px] mb-2 flex-wrap flex-1">
            <div className="flex items-center gap-1">
              <AwardIcon />
              <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                {transporterYear} years
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#2b2b2b]"></span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <YellowStarIcon />
                <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                  {rating}
                </span>
              </div>
              <p className="font-montserrat font-normal text-[11px] text-[#2b2b2b] truncate">
                Rating <span className="truncate">{rateStatus}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[5px]">
            <div className="flex items-center bg-[#CCE5CC80] w-fit py-[2px] px-2 rounded-[100px] justify-center gap-1">
              <p className="font-montserrat font-normal text-[10px] text-[#2b2b2b]">
                All States
              </p>
            </div>
            <div className="flex items-center bg-[#F7DFFF80] w-fit py-[2px] px-2 rounded-[100px] justify-center gap-1">
              <p className="font-montserrat font-normal text-[10px] text-[#2b2b2b]">
                {customerNumber} fleets
              </p>
            </div>
          </div>
          <p className="font-montserrat mt-2 font-normal text-[11px] text-[#2b2b2b]">
            {transporterBio}
          </p>
          <Link href={`/buyers/transporter-list/${id}`}>
            <Button
              text="View"
              onClick={() => {}}
              className="mx-auto justify-center w-full sm:w-[90%] mt-3 text-[#fefefe] py-2 px-4 !rounded-[5px]"
              textClass="font-montserrat font-normal text-[12px] sm:text-[13px] text-[#fefefe]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
