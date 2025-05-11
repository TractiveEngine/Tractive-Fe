"use client";
import { LeadingProfileIcon, WishIcon } from "@/icons/Icons";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface CardProps {
  id: string;
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
  id,
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
  // State to manage hover for tooltip
  const [isHovered, setIsHovered] = useState(false);

  // Function to truncate description to 4 words with "..." prefix
  const truncateDescription = (text?: string) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > 4 ? `${words.slice(0, 4).join(" ")}...` : text;
  };

  // Tooltip animation variants
  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 0 },
    visible: { opacity: 1, scale: 1, y: -10 },
    exit: { opacity: 0, scale: 0.8, y: 0 },
  };

  return (
    <div
      className={`bg-[#fefefe] rounded-lg shadow-md w-[100%] overflow-hidden ${className}`}
    >
      {/* Image with Icon */}
      <div className="relative">
        <Image
          src={image}
          alt={title}
          width={381}
          height={237}
          className={`w-[100%] object-cover rounded-md ${imageClass}`}
        />
        <WishIcon title={title} />
      </div>
      <Link href={`/buyers/product/${id}`}>
        <div className="p-4">
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
              className={`mt-2 text-[15px] font-medium font-montserrat ${titleClass}`}
            >
              {title}
            </h2>
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <p
                className={`text-[#2b2b2b] text-[12px] font-normal font-montserrat ${descriptionClass}`}
              >
                {truncateDescription(description)}
              </p>
              <AnimatePresence>
                {isHovered && description && (
                  <motion.div
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-0 -translate-y-full bg-[#f1f1f1] text-[#2b2b2b] text-sm font-montserrat rounded-md px-3 py-2 shadow-lg z-10 whitespace-nowrap"
                  >
                    {description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Optional Fields */}

          <div className="flex items-center justify-between gap-4 mt-2">
            <p
              className={`text-[13px] text-gray-500 font-montserrat ${quantityClass}`}
            >
              Quantity: {quantity}
            </p>
            <p
              className={`text-[#2b2b2b] text-[13px] font-semibold font-montserrat ${amountClass}`}
            >
              {amount}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pl-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="font-montserrat text-[13px] text-[#2b2b2b] font-normal">
              Leading:
            </span>
            <div className="flex items-center flex-col">
              <Image
                src={crownImage}
                alt="crown"
                width={14}
                height={14}
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
            className="bg-[#538e53] w-[50%] h-[2.9rem] text-[#fefefe] font-normal text-[14px] rounded-tl-[10px] rounded-br-[10px] px-4 py-2 transition duration-200 ease-in-out"
          >
            View
          </button>
        </div>
      </Link>
    </div>
  );
}
