"use client";
import { LocationIcon } from "@/icons/Icon1";
import { YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import Link from "next/link";

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
      className={`bg-[#f9f9f9] rounded-lg shadow-md w-[100%] overflow-hidden ${className}`}
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
      <Link
        href={`/buyers/transporter-list/booking-transporter/${id}`}
        className="flex flex-col gap-3"
      >
        <div className="px-2.5 pt-2">
          {/* Title */}
          <div className="flex items-center gap-3">
            <h2
              className={`text-[13px] font-medium font-montserrat ${truckNameClass}`}
            >
              {truckName}
            </h2>
            <div className="flex items-center gap-0.5">
              <YellowStarIcon />
              <span className="font-montserrat text-[12px] text-[#2b2b2b] font-normal">
                {rating}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[4px] px-2.5">
          <div className="flex items-center gap-[3px]">
            <LocationIcon />
            <p className="font-montserrat text-[10px] text-[#2b2b2b] font-medium">
              {locationFrom} to {locationTo}
            </p>
          </div>
          <span className="w-[2px] h-[1rem] bg-[#808080]"></span>
          <p className="font-montserrat text-[11px] text-[#2b2b2b] font-normal">
            Per Kg:
            <span className="font-medium"> {amountPerKg}</span>
          </p>
          <span className="w-[2px] h-[1rem] bg-[#808080]"></span>
          <p className="font-montserrat text-[11px] text-[#2b2b2b] font-normal">
            Full Load:
            <span className="font-medium"> {fullLoad}</span>
          </p>
        </div>

        <div className="w-[100%] bg-[#CCE5CCB2] gap-0.5 flex items-center justify-center p-[4px]">
          <p className="font-montserrat text-[11px] text-[#8B4513] font-normal">
            Space Remaining:
          </p>
          <span className="font-montserrat text-[11px] text-[#2b2b2b] font-normal">
            {spaceRemaining}
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-[#538e53] w-[50%] h-[2.9rem] text-[#fefefe] font-normal text-[14px] rounded-tl-[10px] rounded-br-[10px] px-4 py-2 transition duration-200 ease-in-out cursor-pointer"
          >
            Book
          </button>
        </div>
      </Link>
    </div>
  );
}
