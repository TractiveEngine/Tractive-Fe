import { LeadingProfileIcon } from "@/icons/Icons";
import Image from "next/image";
import React from "react";

interface CardProps {
  image: string; // Required
  timeImage: string; // Required
  crownImage: string; // Required
  time: string; // Required
  title: string; // Required
  description?: string;
  amount?: string;
  quantity?: string;
  bidingPrice?: string;
  className?: string;
  imageClass?: string;
  crownImageClass?: string;
  imageClockClass?: string;
  titleClass?: string;
  descriptionClass?: string;
  amountClass?: string;
  quantityClass?: string;
}

export default function BidingCard({
  image,
  timeImage,
  crownImage,
  time,
  title,
  description,
  amount,
  quantity,
  bidingPrice,
  className = "",
  imageClass = "",
  crownImageClass = "",
  imageClockClass = "",
  titleClass = "",
  descriptionClass = "",
  amountClass = "",
  quantityClass = "",
}: CardProps) {
  return (
    <div className={`p-4 bg-[#fefefe] rounded-lg shadow-md ${className}`}>
      {/* Image */}
      <Image
        src={image}
        alt={title}
        width={381}
        height={237}
        className={`object-cover rounded-md ${imageClass}`}
      />
      <div className="flex items-center gap-2">
        <Image
          src={timeImage}
          alt="clock"
          width={15}
          height={15}
          className={`object-cover ${imageClockClass}`}
        />
        <small className="text-[#F51919]">{time}</small>
      </div>
      {/* Title */}
      <div>
        <h2
          className={`mt-2 text-lg font-medium font-montserrat ${titleClass}`}
        >
          {title}
        </h2>
        <p
          className={`text-[#2b2b2b] font-normal font-montserrat ${descriptionClass}`}
        >
          {description}
        </p>
      </div>

      {/* Optional Fields */}

      <div className="flex items-center justify-between gap-4 mt-2">
        <p className={`text-sm text-gray-500 font-montserrat ${quantityClass}`}>
          Quantity: {quantity}
        </p>
        <p
          className={`text-[#2b2b2b] font-bold font-montserrat ${amountClass}`}
        >
          {amount}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4 mt-2">
          <span className="font-montserrat">Leading:</span>
          <div className="flex items-center flex-col">
            <Image
              src={crownImage}
              alt="crown"
              width={15}
              height={15}
              className={`object-cover ${crownImageClass}`}
            />
            <LeadingProfileIcon />
          </div>
          <p
            className={`text-sm text-gray-500 font-montserrat ${quantityClass}`}
          >
            {bidingPrice}
          </p>
        </div>

        <button
          type="button"
          className="bg-[#538e53] text-[#fefefe] font-normal text-[14px] rounded-tl-[10px] rounded-br-[10px] px-4 py-2 transition duration-200 ease-in-out"
        >
          View
        </button>
      </div>
    </div>
  );
}
