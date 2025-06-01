import { Reviews } from "@/components/Reviews";
import {
  ArrowRightIcon,
  LikeIcon,
  ReplyIcon,
  StarIcon,
  YellowStarIcon,
} from "@/icons/Icons";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";

export const OwnersInfo = () => {
  const [seeMore, setSeeMore] = useState(false);

  const handleSeeMore = () => {
    setSeeMore(!seeMore); // See More Reviews visibility
  };

  return (
    <div className="relative w-[100%] lg:w-[57%] flex flex-col gap-[10px]">
      <div className="flex flex-col gap-[12px] bg-[#fefefe] px-4 pt-2 pb-6 rounded-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[12px]">
          Transporters Information
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div>
            <Image
              src="/images/bidder2.png"
              alt="Sellers profile"
              width={45}
              height={45}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-montserrat font-normal text-[14px] text-[#2b2b2b] truncate">
                  Goddess Transport
                </span>
                <span className="w-[10px] h-[10px] rounded-[100px] bg-[#2b2b2b]"></span>
                <span className="font-montserrat font-normal text-[14px] text-[#538e53]">
                  Follow
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <YellowStarIcon />
                <StarIcon />
                <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                  4.0
                </span>
              </div>
              <small className="font-montserrat font-normal text-[11px] text-[#2b2b2b] truncate">
                700 followers
              </small>
              <small className="font-montserrat font-normal text-[11px] text-[#2b2b2b] truncate">
                Aba State
              </small>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col gap-1.5 bg-[#fefefe] px-4 pt-2 pb-6 rounded-[5px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-1.5 flex-wrap">
          <div className="relative flex items-center gap-2 flex-wrap">
            <Image
              src="/images/bidder4.png"
              alt="comment Profile"
              width={30}
              height={30}
            />
            <p className="font-montserrat font-normal text-[14px] text-[#2b2b2b]">
              Kelvin Chikezie
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <YellowStarIcon />
            <YellowStarIcon />
            <YellowStarIcon />
            <YellowStarIcon />
            <StarIcon />
          </div>
        </div>
        <div className="flex justify-between w-[100%] flex-wrap">
          <p className="font-montserrat w-[80%] font-normal text-[11px] text-[#2b2b2b]">
            Thank you mr kelvin, the corn i ordered has arrived and the are in
            good condition.
          </p>
          <span className="font-montserrat w-[20%] flex justify-end font-normal text-[11px] text-[#808080]">
            13 june, 2022
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Image
            src="/images/orderedImage.png"
            alt="Ordered Item"
            width={211}
            height={77}
          />
          <div className="flex items-center gap-[46px] truncate">
            <div className="flex items-center gap-[6px]">
              <ReplyIcon />
              <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                12 replies
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <LikeIcon />
              <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                12 Likes
              </span>
            </div>
          </div>
        </div>
        <div
          className="cursor-pointer flex text-[#538e53] items-center justify-end gap-[4px]"
          onClick={handleSeeMore}
        >
          <span className="font-montserrat font-normal text-[12px] text-[#538e53]">
            See more
          </span>
          <ArrowRightIcon stroke="#538e53" className="w-4 h-4" />
        </div>
        {/* Conditionally render Reviews component with animation */}
        {seeMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-[15.7rem] z-60"
          >
            <Reviews onClose={handleSeeMore} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
