"use client";
import { LocationIcon } from "@/icons/Icon1";
import { YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProps {
  id: string;
  image: string; // Required
  truckName: string; // Required
  amountPerKg?: string;
  locationFrom?: string;
  locationTo?: string;
  fullLoad?: string;
  rating?: string;
  spaceRemaining?: string;
  className?: string;
  imageClass?: string;
  truckNameClass?: string;
}

export default function TruckCard({
  id,
  image,
  truckName,
  amountPerKg,
  fullLoad,
  locationFrom,
  locationTo,
  rating,
  spaceRemaining,
  className = "",
  imageClass = "",
  truckNameClass = "",
}: CardProps) {

  return (
    <div
      className={`bg-[#fefefe] rounded-lg shadow-md w-[100%] overflow-hidden ${className}`}
    >
      {/* Image with Icon */}
      <div className="relative">
        <Image
          src={image}
          alt={truckName}
          width={381}
          height={237}
          className={`w-[100%] object-cover rounded-md ${imageClass}`}
        />
      </div>
      <Link href={`/buyers/product/${id}`}>
        <div className="p-4">
          {/* Title */}
          <div>
            <h2
              className={`mt-2 text-[13px] font-medium font-montserrat ${truckNameClass}`}
            >
              {truckName}
            </h2>
            <div>
              <YellowStarIcon />
              <span className="font-montserrat text-[12px] text-[#2b2b2b] font-normal">
                {rating}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[4px] p-4">
          <div className="flex items-center gap-[4px]">
            <LocationIcon />
            <p className="font-montserrat text-[12px] text-[#2b2b2b] font-medium">
              {locationFrom} to {locationTo}
            </p>
          </div>
          <span className="w-[2px] h-[2rem] bg-[#808080]"></span>
          <p className="font-montserrat text-[12px] text-[#2b2b2b] font-normal">
            Per Kg:
            <span className="font-medium">{amountPerKg}</span>
          </p>
          <span className="w-[2px] h-[2rem] bg-[#808080]"></span>
          <p className="font-montserrat text-[12px] text-[#2b2b2b] font-normal">
            Full Load:
            <span className="font-medium">{fullLoad}</span>
          </p>
        </div>

        <div className="w-[100%] bg-[#CCE5CCB2] gap-0.5 flex items-center justify-center p-[5px]">
          <p className="font-montserrat text-[13px] text-[#2b2b2b] font-normal">
            Full Load:
          </p>
          <span className=" text-[#2b2b2b]">{spaceRemaining}</span>
        </div>
        <button
          type="button"
          className="bg-[#538e53] w-[50%] h-[2.9rem] text-[#fefefe] font-normal text-[14px] rounded-tl-[10px] rounded-br-[10px] px-4 py-2 transition duration-200 ease-in-out"
        >
          Book
        </button>
      </Link>
    </div>
  );
}
