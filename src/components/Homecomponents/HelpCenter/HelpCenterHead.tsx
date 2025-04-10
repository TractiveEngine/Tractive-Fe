import React from "react";
import { AgTechLiveChat } from "./AgTechLiveChat";

export const HelpCenterHead = () => {
  return (
    <div className="bg-[#f1f1f1] w-full">
      <div className="w-[100%] max-w-[1200px] mx-auto py-10 pb-16 flex flex-col gap-[25px] justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-[1.5rem] font-montserrat font-normal text-center  bg-gradient-to-b from-[#16FF16] to-[#8E8E8E] bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-[#000000] w-[83%] text-center font-montserrat font-normal text-[12px] leading-[25px]">
            Welcome to the Agrictech Help Center! We're here to support you
            every step of the way. Find answers to your questions, explore
            helpful guides, and get the assistance you need. We're dedicated to
            ensuring your Agrictech experience is seamless and successful. Let's
            grow together!
          </p>
              </div>
              <AgTechLiveChat />
      </div>
    </div>
  );
};
