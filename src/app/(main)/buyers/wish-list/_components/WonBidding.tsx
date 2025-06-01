import Image from "next/image";
import React from "react";

export const WonBidding = () => {
  return (
    <div className="flex flex-col w-full rounded-lg mt-4">
      <div className="w-[90%] flex flex-col justify-between mx-auto gap-3 mb-4">
        <p className="text-[15px] text-[#141414] font-normal font-montserrat">
          Biddings you won
        </p>
        <div className="w-[100%] flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <div className="w-[45%] sm:w-[30%] lg:w-[15%]">
            <Image
              src="/images/checkout1.png"
              alt="Tomatoes"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[45%] sm:w-[30%] lg:w-[15%]">
            <Image
              src="/images/checkout2.png"
              alt="Maize"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[45%] sm:w-[30%] lg:w-[15%]">
            <Image
              src="/images/checkout3.png"
              alt="Beans"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[45%] sm:w-[30%] lg:w-[15%]">
            <Image
              src="/images/checkout4.png"
              alt="Goat"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[45%] sm:w-[30%] lg:w-[15%]">
            <Image
              src="/images/checkout5.png"
              alt="Chicken"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[45%] sm:w-[30%] lg:w-[15%]">
            <Image
              src="/images/checkout6.png"
              alt="Fish"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};