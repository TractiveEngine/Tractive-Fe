import { ReviewIcon } from "@/icons/Icon1";
import { StarIcon, YellowStarIcon } from "@/icons/Icons";
import { useAnimation, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useMemo } from "react";

export const Reviews = () => {
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
  useEffect(() => {
    // Start animation for each progress bar on mount
    controls.forEach((control, index) => {
      control.start({
        width: `${ratings[index].percentage}%`,
        transition: { duration: 1, ease: "easeOut" },
      });
    });
  }, [controls, ratings]);

  return (
    <div className="bg-[#fefefe] flex items-center w-full sm:w-[500px] px-6 py-6 flex-col sm:flex-row gap-3 rounded-[7px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] ">
      <div className="flex items-center w-full flex-col sm:flex-row gap-3">
        <div className="flex flex-col w-[100%] bg-[#f1f1f1] p-3">
          <div className="flex items-center gap-[4px]">
            <div className="flex items-center gap-1.5">
              <YellowStarIcon />
              <YellowStarIcon />
              <YellowStarIcon />
              <YellowStarIcon />
              <StarIcon />
            </div>
            <span className="font-montserrat font-normal text-[11px] text-[#2b2b2b] ">
              4.0
            </span>
          </div>
          <span className="w-full h-[1px] bg-[#fefefe] mt-3"></span>
          <div className="flex flex-col w-[100%] bg-[#f1f1f1] p-3">
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
        </div>

        <div className="flex flex-col gap-2 w-[100%] sm:w-[100%] bg-[#f1f1f1] p-4">
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
          </div>
        </div>
      </div>
    </div>
  );
};
