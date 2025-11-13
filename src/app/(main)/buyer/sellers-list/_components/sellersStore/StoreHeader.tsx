"use client";
import {
  AwardIcon,
  CallIcon,
  CopyIcon,
  MessageIcon,
  ReviewIcon,
  ShoppingCartIcon,
  XIcon,
} from "@/icons/Icon1";
import { ArrowRightIcon, YellowStarIcon } from "@/icons/Icons";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Reviews } from "@/components/Reviews";

export const StoreHeader = () => {
  const [openCallLog, setOpenCallLog] = useState(false);
   const [showReviews, setShowReviews] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({
    "09034145971": false,
    "09034145972": false,
  });

  // Memoize ratings to prevent re-creation on every render
  const ratings = useMemo(
    () => [
      { stars: "5 star", count: 8, percentage: 100 },
      { stars: "4 star", count: 6, percentage: 75 },
      { stars: "3 star", count: 4, percentage: 50 },
      { stars: "2 star", count: 2, percentage: 25 },
      { stars: "1 star", count: 1, percentage: 10 },
    ],
    []
  );

  // Phone number data (replace with actual data)
  const phoneNumbers = ["09034145971", "09034145972"];

  // Initialize individual animation controls for each rating
  const control1 = useAnimation();
  const control2 = useAnimation();
  const control3 = useAnimation();
  const control4 = useAnimation();
  const control5 = useAnimation();

  // Memoize the controls array to prevent re-creation on every render
  const controls = useMemo(
    () => [control1, control2, control3, control4, control5],
    [control1, control2, control3, control4, control5]
  );

  const handleCallLog = () => {
    setOpenCallLog(!openCallLog);
  };

  const handleCopy = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedStates((prev) => ({ ...prev, [number]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [number]: false }));
    }, 2000);
  };

  useEffect(() => {
    // Start animation for each progress bar on mount
    controls.forEach((control, index) => {
      control.start({
        width: `${ratings[index].percentage}%`,
        transition: { duration: 1, ease: "easeOut" },
      });
    });
  }, [controls, ratings]);

  const handleReviewsToggle = () => {
    setShowReviews(!showReviews); // Toggle Reviews visibility
  };

  return (
    <div className="relative w-[90%] mx-auto pt-6 pb-6">
      <div className="relative flex flex-col lg:flex-row items-center gap-4 w-[100%]">
        <div className="flex items-center flex-col sm:flex-row gap-2 sm:gap-4 w-[100%] lg:w-[50%]">
          <div className="bg-[#fefefe] flex flex-col gap-2 p-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-[100%] lg:w-[17rem] h-[100px]">
            <p className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b] truncate">
              Sellers information
            </p>
            <div className="flex items-center gap-2">
              <Image
                src="/images/sellerprofile.png"
                alt="Seller Profile"
                width={40}
                height={40}
                className="object-cover sm:w-[50px] sm:h-[50px]"
              />
              <div className="flex flex-col gap-1 sm:gap-2">
                <div className="flex gap-2 sm:gap-1 xl:gap-3 flex-wrap items-center w-full">
                  <div className="flex gap-2 items-center">
                    <p className="font-montserrat font-normal text-[12px] sm:text-[14px] text-[#2b2b2b] truncate">
                      Jane Store
                    </p>
                    <Image
                      src="/images/verifiedIcon.png"
                      alt="Verified"
                      width={12}
                      height={12}
                      className="object-cover sm:w-[15px] sm:h-[15px]"
                    />
                  </div>
                  <span className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[100px] bg-[#2b2b2b]"></span>
                  <span className="font-montserrat font-normal text-[12px] sm:text-[14px] text-[#538e53]">
                    Follow
                  </span>
                </div>
                <div className="flex gap-1 items-center flex-wrap">
                  <div className="flex gap-1 items-center">
                    <YellowStarIcon />
                    <small className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b]">
                      4.0
                    </small>
                  </div>
                  <small className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b]">
                    700 followers
                  </small>
                  <small className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b]">
                    Abia state
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-[100%] sm:w-[27%] lg:w-[38%]">
            <div className="relative bg-[#fefefe] flex flex-col items-center gap-3 p-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-[50px] h-[100px] justify-center">
              <div className="flex gap-2 items-center bg-[#CCE5CC8C] p-2 rounded-[100px] cursor-pointer">
                <MessageIcon />
              </div>
              <div
                className="relative flex gap-2 items-center bg-[#CCE5CC8C] p-2 rounded-[100px] cursor-pointer"
                onClick={handleCallLog}
              >
                <CallIcon />
              </div>
              {openCallLog && (
                <motion.div
                  className="absolute -bottom-[4.5rem] left-0 bg-[#fefefe] p-4 rounded-[5px] flex flex-col items-end shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] gap-3 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="cursor-pointer" onClick={handleCallLog}>
                    <XIcon />
                  </div>
                  <div className="flex items-start gap-2 w-full">
                    {phoneNumbers.map((number) => (
                      <div
                        key={number}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => handleCopy(number)}
                      >
                        {copiedStates[number] ? (
                          <>
                            <span className="font-montserrat font-normal text-[12px] text-[#538e53]">
                              Copied!
                            </span>
                          </>
                        ) : (
                          <>
                            <CopyIcon />
                            <span className="font-montserrat font-normal text-[12px] text-[#2b2b2b]">
                              {number}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
            <div className="bg-[#538e53] flex flex-col items-center sm:items-start gap-3 p-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-[100%] sm:w-[7.6rem] h-[100px] justify-center">
              <div className="flex gap-2 items-center justify-center bg-[#fefefe] w-[35px] h-[35px] p-1 rounded-[100px]">
                <ShoppingCartIcon />
              </div>
              <p className="font-montserrat font-normal text-center text-[10px] sm:text-[11px] text-[#fefefe]">
                Total sales made (90)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-col sm:flex-row gap-2 sm:gap-4 w-[100%]">
          <div className="bg-[#fefefe] flex flex-col  items-center sm:items-start gap-3 p-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-[100%] sm:w-[8.5rem] h-[100px] justify-center">
            <div className="flex gap-2 items-center justify-center bg-[#538e53] w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] p-1 rounded-[100px]">
              <AwardIcon />
            </div>
            <p className="font-montserrat font-normal text-center text-[10px] sm:text-[11px] text-[#2b2b2b]">
              5 years of sales
            </p>
          </div>

          <div className="bg-[#fefefe] flex items-center flex-col sm:flex-row gap-3 p-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-full h-auto sm:h-[100px]">
            <div className="flex flex-col w-[100%]">
              {ratings.map((rating, index) => (
                <div
                  key={rating.stars}
                  className="flex items-center gap-1 sm:gap-2 w-full"
                >
                  <div className="flex items-center gap-1">
                    <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b] ">
                      {rating.stars}
                    </span>
                  </div>
                  <div className="flex-1 h-[4px] bg-[#e0e0e0] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#FFA500]"
                      initial={{ width: 0 }}
                      animate={controls[index]}
                    />
                  </div>
                  <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b]">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
            <span className="w-[100%] sm:w-[1px] h-[1px] sm:h-[5rem] bg-[#d2d2d2]"></span>
            <div className="flex flex-col gap-2 w-[100%] sm:w-[100%]">
              <div className="flex gap-2 items-center justify-start">
                <div className="flex gap-2 items-center justify-center bg-[#f1f1f1] w-[30px] h-[30px] sm:w-[35px] sm:h-[35px] p-1 rounded-[100px]">
                  <ReviewIcon />
                </div>
                <p className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b] truncate">
                  Reviews
                </p>
              </div>
              <div className="flex gap-2 items-center justify-between">
                <div className="flex items-center gap-6 sm:gap-10">
                  <div className="relative w-[30px] h-[30px]">
                    <Image
                      src="/images/bidder1.png"
                      alt="Bidder 1"
                      width={20}
                      height={20}
                      className="absolute left-0 z-10 sm:w-[25px] sm:h-[25px]"
                    />
                    <Image
                      src="/images/bidder2.png"
                      alt="Bidder 2"
                      width={20}
                      height={20}
                      className="absolute left-[10px] sm:left-[12px] z-20 sm:w-[25px] sm:h-[25px]"
                    />
                    <Image
                      src="/images/bidder3.png"
                      alt="Bidder 3"
                      width={20}
                      height={20}
                      className="absolute left-[20px] sm:left-[28px] z-30 sm:w-[25px] sm:h-[25px]"
                    />
                    <Image
                      src="/images/bidder4.png"
                      alt="Bidder 4"
                      width={20}
                      height={20}
                      className="absolute left-[30px] sm:left-[40px] z-40 sm:w-[25px] sm:h-[25px]"
                    />
                  </div>
                  <p className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#2b2b2b]">
                    + 25,000
                  </p>
                </div>
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={handleReviewsToggle} // Add click handler
                >
                  <span className="font-montserrat font-normal text-[10px] sm:text-[11px] text-[#538e53]">
                    See reviews
                  </span>
                  <ArrowRightIcon
                    stroke="#538e53"
                    className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Conditionally render Reviews component with animation */}
        {showReviews && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-[7.6rem] z-60"
          >
            <Reviews onClose={handleReviewsToggle} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
