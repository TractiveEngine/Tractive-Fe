"use client"
import { AgTechCustomerService } from '@/components/Homecomponents/AgTechCustomerService';
import { CustomerRepresentativeChatBox } from '@/components/Homecomponents/CustomerRepresentativeChatBox';
import { FAQs } from '@/components/Homecomponents/FAQs/FAQs';
import { HelpCenterHead } from '@/components/Homecomponents/FAQs/FaqsHelpCenterHead';
import { LiveChatAndHotLine } from '@/components/Homecomponents/FAQs/FaqsLiveChatAndHotLine';
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

export default function Faqs() {
  const [showModal, setShowModal] = useState(false);
  const [showRepChatModal, setShowRepChatModal] = useState(false);

  const handleCloseAll = () => {
    setShowModal(false);
    setShowRepChatModal(false);
  };
  
  return (
    <div className="w-full bg-[#fefefe]">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.4 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:right-16 md:left-auto md:translate-x-0 h-[490px] w-[90%] md:w-[499px] bg-[#fefefe] shadow-xl rounded-[16.5px] z-50"
          >
            <AgTechCustomerService
              onClose={handleCloseAll}
              onChatWithRep={() => {
                setShowRepChatModal(true);
                setShowModal(false);
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
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:right-16 md:left-auto md:translate-x-0 h-[490px] w-[90%] md:w-[499px] bg-[#fefefe] shadow-xl rounded-[16.5px] z-50"
          >
            <CustomerRepresentativeChatBox onClose={handleCloseAll} />
          </motion.div>
        )}
      </AnimatePresence>

      <HelpCenterHead onOpenLiveChat={() => setShowModal(true)} />
      <LiveChatAndHotLine onOpen={() => setShowModal(true)} />
      <FAQs />
    </div>
  );
}
