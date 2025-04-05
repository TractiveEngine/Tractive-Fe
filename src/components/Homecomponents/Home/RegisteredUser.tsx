import Image from "next/image";
import React from "react";

export const RegisteredUser = () => {
  return (
    <div className="w-full bg-[#538e53]">
      <div className="w-[90%] mx-auto py-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Cards Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-6 lg:gap-12">
          {/* Farmers */}
          <div className="flex items-center gap-2.5">
            <div className="w-[77px] h-[57px] bg-[#fefefe] flex items-center justify-center rounded-[4px]">
              <Image
                src="/images/farmer.png"
                alt="Farmers"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <h1 className="text-[#f9f9f9] text-[2rem] md:text-[1.75rem] font-montserrat">
                10,000
              </h1>
              <p className="text-[#f9f9f9] text-[1.25rem] md:text-[1rem] font-montserrat font-normal">
                Farmers
              </p>
            </div>
          </div>

          {/* Transporters */}
          <div className="flex items-center gap-2.5">
            <div className="w-[77px] h-[57px] bg-[#fefefe] flex items-center justify-center rounded-[4px]">
              <Image
                src="/images/transporters.png"
                alt="Transporters"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <h1 className="text-[#f9f9f9] text-[2rem] md:text-[1.75rem] font-montserrat">
                10,000
              </h1>
              <p className="text-[#f9f9f9] text-[1.25rem] md:text-[1rem] font-montserrat font-normal">
                Transporters
              </p>
            </div>
          </div>

          {/* Buyers */}
          <div className="flex items-center gap-2.5">
            <div className="w-[77px] h-[57px] bg-[#fefefe] flex items-center justify-center rounded-[4px]">
              <Image
                src="/images/buyer.png"
                alt="Buyer"
                width={32}
                height={32}
              />
            </div>
            <div className="flex flex-col justify-center gap-0.5">
              <h1 className="text-[#f9f9f9] text-[2rem] md:text-[1.75rem] font-montserrat">
                10,000
              </h1>
              <p className="text-[#f9f9f9] text-[1.25rem] md:text-[1rem] font-montserrat font-normal">
                Buyers
              </p>
            </div>
          </div>
        </div>

        {/* Registered Users Text */}
        <p className="text-[#f9f9f9] font-montserrat font-light text-[2rem] sm:text-[2.5rem] lg:text-[3rem] text-center lg:text-right">
          1 Million Registered Users
        </p>
      </div>
    </div>
  );
};
