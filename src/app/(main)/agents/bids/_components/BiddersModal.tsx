
"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bidder } from "@/utils/BidsData";

interface BiddersModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidders: Bidder[];
  itemName: string;
}

export const BiddersModal: React.FC<BiddersModalProps> = ({
  isOpen,
  onClose,
  bidders,
  itemName,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#2b2b2b94] bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-[10px] p-6 w-[90%] max-w-[400px] shadow-md"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-montserrat font-medium text-[#2b2b2b] mb-4">
              Bidders for {itemName}
            </h3>
            <ul className="space-y-2">
              {bidders.slice(0, 4).map((bidder) => (
                <li
                  key={bidder.id}
                  className="flex justify-between text-[14px] font-montserrat font-normal text-[#2b2b2b]"
                >
                  <span>{bidder.name}</span>
                  <span>${bidder.bidAmount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-[#538e53] text-white rounded-[4px] text-[14px] font-montserrat font-medium hover:bg-[#476d47]"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};