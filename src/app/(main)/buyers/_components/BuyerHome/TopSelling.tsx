import Image from "next/image";
import React from "react";

export const TopSelling = () => {
  return (
    <div className="flex flex-col w-full rounded-lg shadow-md p-4 mt-4">
      <div className="w-[90%] flex flex-col justify-between mx-auto gap-[0.7rem] mb-4">
        <p className="text-[15px] text-[#141414] font-normal font-montserrat">
          Top Selling (this month)
        </p>
        <div className="flex items-center justify-center gap-[0.6rem] ">
          <div>
            <Image
              src="/images/tomatoes.png"
              alt="Tomatoes"
              width={258}
              height={128}
            />
          </div>
          <div>
            <Image
              src="/images/maize.png"
              alt="Maize"
              width={258}
              height={128}
            />
          </div>
          <div>
            <Image
              src="/images/Beans.png"
              alt="Beans"
              width={258}
              height={128}
            />
          </div>
          <div>
            <Image src="/images/goat.png" alt="Goat" width={258} height={128} />
          </div>
          <div>
            <Image
              src="/images/chicken.png"
              alt="Chicken"
              width={258}
              height={128}
            />
          </div>
          <div>
            <Image src="/images/fish.png" alt="Fish" width={258} height={128} />
          </div>
        </div>
      </div>
    </div>
  );
};
