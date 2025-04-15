"use client";
import React, { useState } from "react";
import { AgTechLiveChat } from "./AgTechLiveChat";

import { motion, AnimatePresence } from "framer-motion";
import { AgTechCustomerService } from "../AgTechCustomerService";
import { CustomerRepresentativeChatBox } from "../CustomerRepresentativeChatBox";
import { MobileAgTechLiveChat } from "./MobileAgTechLiveChat";
import { AgTechLiveChatIpad } from "./AgTechLiveChatIpad";

export const HelpCenterHead = () => {
  const [showModal, setShowModal] = useState(false);

  const [showRepChatModal, setShowRepChatModal] = useState(false);

  const handleCloseAll = () => {
    setShowModal(false);
    setShowRepChatModal(false);
  };

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
        <div className="hidden md:hidden lg:block">
          <AgTechLiveChat onOpen={() => setShowModal(true)} />
        </div>
        <div className="hidden md:block lg:hidden">
          <AgTechLiveChatIpad onOpen={() => setShowModal(true)} />
        </div>

        {/* Mobile only */}
        <div className="block md:hidden">
          <MobileAgTechLiveChat onOpen={() => setShowModal(true)} />
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.4 }}
              className="absolute rounded-[16.5px] -bottom-13 right-0 left-0 md:right-16 h-[490px] w-[90%] mx-auto md:mx-0 md:w-[499px] bg-[#fefefe] shadow-xl z-50"
            >
              <AgTechCustomerService
                onClose={handleCloseAll}
                onChatWithRep={() => {
                  setShowRepChatModal(true);
                }}
              />
            </motion.div>
          )}

          {showRepChatModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.4 }}
              className="absolute -bottom-13 right-0 left-0 md:right-16  md:h-[490px] md:w-[499px] rounded-[16.5px] shadow-xl z-50"
            >
              <CustomerRepresentativeChatBox onClose={handleCloseAll} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
