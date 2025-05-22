import Image from "next/image";
import React from "react";

export const ImagePreviewBooking = () => {
  return (
    <div className="flex flex-col mb-4 md:flex-row gap-4 w-full">
      <div className="w-full">
        <Image
          src="/images/transporterpreview.png"
          alt="Transporter preview"
          width={979}
          height={602}
          className="object-cover"
        />
      </div>

      {/* ======= Booking Summary ========= */}
      <div className="flex flex-col gap-[2px] w-[50%] rounded-md shadow-md">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex justify-between items-center">
            <span className="text-[12px] text-[#2b2b2b] font-montserrat font-normal">
              Summary
            </span>
            <div className="flex items-center">
              <span className="bg-[#D9D9D9] rounded-[100px] w-[15px] h-[15px]"></span>
              <span className="bg-[#D9D9D9] w-[18px] h-[2px]"></span>
              <span className="bg-[#D9D9D9] rounded-[100px] w-[15px] h-[15px]"></span>
              <span className="bg-[#D9D9D9] w-[18px] h-[2px]"></span>
              <span className="bg-[#D9D9D9] rounded-[100px] w-[15px] h-[15px]"></span>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
