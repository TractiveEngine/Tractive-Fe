"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeDotIcon } from "../../../produce-list/_components/table/ActionMenu";
import { ActionMenuProps } from "../../../_components/ActionMenuProps";

export const DeliveredProductActionMenu: React.FC<ActionMenuProps> = ({
  productId,
  activeMenu,
  setActiveMenu,
  handleBuyerInfo,
  handleTrackOrder,
  handleCustomerCare,
}) => {
  const isActive = activeMenu === productId;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setActiveMenu]);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        title="Open action menu"
        aria-label="Open action menu"
        onClick={() => setActiveMenu(activeMenu ? null : productId)}
        className="bg-[#f1f1f1] rounded-[100px] cursor-pointer p-1.5 w-[30px] h-[30px] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors duration-200"
      >
        <ThreeDotIcon />
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute w-[8rem] py-1 px-1 -bottom-[1.5rem] right-11 bg-[#fefefe] rounded-[5px] shadow-lg pointer-events-auto z-50"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => {
                handleBuyerInfo?.(productId);
                setActiveMenu(null);
              }}
              className="w-full cursor-pointer text-left px-2 text-[12px] font-montserrat text-[#2b2b2b] hover:bg-gray-100"
            >
              Buyer Info
            </button>
            <button
              onClick={() => {
                handleTrackOrder?.(productId);
                setActiveMenu(null);
              }}
              className="w-full cursor-pointer text-left px-2 text-[12px] font-montserrat text-[#2b2b2b] hover:bg-gray-100"
            >
              Track Order
            </button>
            <button
              onClick={() => {
                handleCustomerCare?.(productId);
                setActiveMenu(null);
              }}
              className="w-full cursor-pointer text-left px-2 text-[12px] font-montserrat text-[#2b2b2b  hover:bg-gray-100"
            >
              Customer Care
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
