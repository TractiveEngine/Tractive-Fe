import Image from "next/image";
import React from "react";

export const TransporterRecommendation = () => {
  return (
    <div className="flex flex-col w-full rounded-lg mt-4">
      <div className="w-[90%] flex flex-col justify-between mx-auto gap-3 mb-4">
        <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#141414] font-normal font-montserrat">
          Recommendation (based on your location)
        </p>
        <div className="w-full grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-4">
          <div className="w-[100%]">
            <Image
              src="/images/monsterTruck.png"
              alt="Tomatoes"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[100%]">
            <Image
              src="/images/monsterTruck.png"
              alt="Maize"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[100%]">
            <Image
              src="/images/monsterTruck.png"
              alt="Beans"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[100%]">
            <Image
              src="/images/monsterTruck.png"
              alt="Goat"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[100%]">
            <Image
              src="/images/monsterTruck.png"
              alt="Chicken"
              width={258}
              height={128}
              className="w-full h-auto rounded-md aspect-[2/1] object-cover"
            />
          </div>
          <div className="w-[100%]">
            <Image
              src="/images/monsterTruck.png"
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