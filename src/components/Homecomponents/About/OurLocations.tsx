import React from "react";

export const OurLocations = () => {
  return (
    <div className="w-full bg-[#f1f1f1] px-4">
      <div className="w-full max-w-[1200px] mx-auto">
        <div className="w-full flex flex-col gap-4 py-8 justify-center">
          <h1 className="text-[#808080] font-montserrat font-normal text-[15px] mb-4">
            Our Location
          </h1>

          <div className="flex flex-col md:flex-row flex-wrap gap-6 md:gap-4 lg:gap-[20px]">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="flex-1 min-w-[250px] flex flex-col gap-[10px]"
              >
                <p className="text-[#000000] font-montserrat text-[12px] font-normal text-left">
                  No 24, Rumokoro outlet opposite HYR, Lagos Nigeria
                </p>
                <p className="text-[#000000] text-left font-montserrat font-normal text-[12px]">
                  Contact: +2349034145971
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
