"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeDotIcon } from "@/app/(main)/agents/produce-list/_components/table/ActionMenu";

export interface TrackTransporterActionMenuProps {
  userTypeId: string;
  handleTBuyerInfo?: (id: string) => void;
  handleTransporterInfo?: (id: string) => void;
  handleTrackOrder?: (id: string) => void;
}

export const TrackTransporterActionMenu: React.FC<
  TrackTransporterActionMenuProps
> = ({
  userTypeId,
  handleTBuyerInfo,
  handleTransporterInfo,
  handleTrackOrder,
}) => {
  const [isActive, setIsActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        console.log("Clicked outside, closing menu");
        setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  console.log("ActionMenu Props:", {
    userTypeId,
    handleTBuyerInfo,
    handleTransporterInfo,
    handleTrackOrder,
  });

  return (
    <div className="relative" ref={menuRef}>
      <button
        title="Open action menu"
        aria-label="Open action menu"
        onClick={() => {
          console.log("Toggling menu, isActive:", !isActive);
          setIsActive(!isActive);
        }}
        className="bg-[#f1f1f1] rounded-full cursor-pointer p-1.5 w-[30px] h-[30px] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors duration-200"
      >
        <ThreeDotIcon />
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute min-w-[124px] right-14 -top-7 bg-[#fefefe] rounded-[7px] shadow-lg z-[1000]"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {handleTBuyerInfo && (
              <button
                onClick={() => {
                  console.log("Buyer Info clicked for ID:", userTypeId);
                  handleTBuyerInfo(userTypeId);
                  setIsActive(false);
                }}
                className="w-full text-left px-2 text-[13px] font-montserrat text-[#2b2b2b] cursor-pointer rounded-[4px] hover:bg-gray-100"
              >
                Buyer Info
              </button>
            )}
            {handleTransporterInfo && (
              <button
                onClick={() => {
                  console.log("Transporter Info clicked for ID:", userTypeId);
                  handleTransporterInfo(userTypeId);
                  setIsActive(false);
                }}
                className="w-full text-left px-2 text-[13px] font-montserrat text-[#2b2b2b] cursor-pointer rounded-[4px] hover:bg-gray-100"
              >
                Transporter Info
              </button>
            )}
            {handleTrackOrder && (
              <button
                onClick={() => {
                  console.log("Track Order clicked for ID:", userTypeId);
                  handleTrackOrder(userTypeId);
                  setIsActive(false);
                }}
                className="w-full text-left px-2 text-[13px] font-montserrat text-[#2b2b2b] cursor-pointer rounded-[4px] hover:bg-gray-100"
              >
                Track Order
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
