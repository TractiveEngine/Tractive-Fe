import Image from "next/image";
import React from "react";

export const MTF = () => {
  return (
    <div className="w-full pb-4">
      <div className="w-[90%] mx-auto my-4 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Market Access */}
        <div className="flex flex-col justify-center gap-[4px] bg-[#BEDDAE33] rounded-[2px] py-[13px] px-[16px] h-[150px]">
          <div className="flex gap-[8px] items-start">
            <div className="w-[47px] h-[32px] rounded-[2.753px] bg-[#4caf5033] flex items-center justify-center">
              <Image
                src="/images/marketImg.png"
                alt="Market Access"
                width={26.156}
                height={26.156}
              />
            </div>
            <p className="text-black font-montserrat font-normal text-[19px] md:text-[21px] lg-text-[18px]">
              Market Access
            </p>
          </div>
          <p className="font-montserrat font-normal text-[13px] md:text-[14px] lg:text-[12.5px] text-[#2b2b2b]">
            Sell your produce with ease. Connect directly with buyers and
            receive competitive offers. Expand your market reach and increase
            profits.
          </p>
        </div>

        {/* Transportation Made Simple */}
        <div className="flex flex-col justify-center gap-[4px] bg-[#c5cef233] rounded-[2px] py-[13px] px-[16px] h-[150px]">
          <div className="flex gap-[8px] items-start">
            <div className="w-[47px] h-[32px] rounded-[2.753px] bg-[#8e9ee54d] flex items-center justify-center">
              <Image
                src="/images/transportation.png"
                alt="Transportation"
                width={26.156}
                height={26.156}
              />
            </div>
            <p className="text-black font-montserrat font-normal text-[19px] md:text-[21px] lg-text-[18px]">
              Transportation Made Simple
            </p>
          </div>
          <p className="font-montserrat font-normal text-[13px] md:text-[14px] lg:text-[12.5px] text-[#000000]">
            Secure reliable transport for your goods effortlessly. Our platform
            connects you with trusted transporters for safe and timely
            deliveries.
          </p>
        </div>

        {/* Future for Transporters */}
        <div className="flex flex-col justify-center gap-[4px] bg-[#ffe7ac33] rounded-[2px] py-[13px] px-[16px] h-[150px]">
          <div className="flex gap-[8px] items-start">
            <div className="w-[47px] h-[32px] rounded-[2.753px] bg-[#ffd15c4d] flex items-center justify-center">
              <Image
                src="/images/futureTransporters.png"
                alt="Future Transporters"
                width={26.156}
                height={26.156}
              />
            </div>
            <p className="text-black font-montserrat font-normal text-[19px] md:text-[21px] lg-text-[18px]">
              Future for Transporters
            </p>
          </div>
          <p className="font-montserrat font-normal text-[13px] md:text-[14px] lg:text-[12.5px] text-[#000000]">
            Connect with farmers and buyers, and drive the future of efficient
            and sustainable logistic.
          </p>
        </div>
      </div>
      <hr className="text-[#e2e2e2]" />
    </div>
  );
};
