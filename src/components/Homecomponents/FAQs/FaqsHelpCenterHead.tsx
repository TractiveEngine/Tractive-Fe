"use client";
import React from "react";
import { AgTechLiveChat } from "./FaqsAgTechLiveChat";

import { MobileAgTechLiveChat } from "./MobileFaqsAgTechLiveChat";
import { AgTechLiveChatIpad } from "./FaqsAgTechLiveChatIpad";

interface Props {
  onOpenLiveChat: () => void;
}
export const HelpCenterHead = ({ onOpenLiveChat }: Props) => {
  return (
    <div className="bg-[#fefefe] w-full">
      <div className="w-[90%] mx-auto py-10 pb-8 flex flex-col gap-[25px] justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-[1.5rem] font-montserrat font-normal text-center  bg-gradient-to-b from-[#16FF16] to-[#8E8E8E] bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-[#000000] w-[83%] text-center font-montserrat font-normal text-[12px] leading-[25px]">
            Welcome to the Agrictech Help Center! We$apos;re here to support you
            every step of the way. Find answers to your questions, explore
            helpful guides, and get the assistance you need. We$apos;re
            dedicated to ensuring your Agrictech experience is seamless and
            successful. Let$apos;s grow together!
          </p>
        </div>
        <div className="hidden md:hidden lg:block">
          <AgTechLiveChat onOpen={onOpenLiveChat} />
        </div>
        <div className="hidden md:block lg:hidden">
          <AgTechLiveChatIpad onOpen={onOpenLiveChat} />
        </div>
        <div className="block md:hidden">
          <MobileAgTechLiveChat onOpen={onOpenLiveChat} />
        </div>
      </div>
    </div>
  );
};
