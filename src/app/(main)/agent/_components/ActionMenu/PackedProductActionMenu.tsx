"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionMenuProps } from "../ActionMenuProps";
import { ThreeDotIcon } from "../../produce-list/_components/table/ActionMenu";

export const PackedProductActionMenu: React.FC<ActionMenuProps> = ({
  productId,
  activeMenu,
  setActiveMenu,
  handleDelivered,
  handleBuyerInfo,
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

  const handleDeliveredClick = () => {
    if (handleDelivered) {
      handleDelivered(productId);
      // Menu will close after the async operation in parent component
    }
  };

  const handleBuyerInfoClick = () => {
    if (handleBuyerInfo) {
      handleBuyerInfo(productId);
      setActiveMenu(null);
    }
  };

  const handleCustomerCareClick = () => {
    if (handleCustomerCare) {
      handleCustomerCare(productId);
      setActiveMenu(null);
    }
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
            className="absolute w-[9rem] py-1 px-1 -bottom-[1.5rem] right-11 bg-[#fefefe] rounded-[5px] shadow-lg pointer-events-auto z-50"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={handleBuyerInfoClick}
              className="w-full cursor-pointer text-left px-2 py-1 text-[12px] font-montserrat text-[#2b2b2b] hover:bg-gray-100 rounded-[4px]"
            >
              Buyer Info
            </button>
            <button
              onClick={handleDeliveredClick}
              className="w-full cursor-pointer text-left px-2 py-1 text-[12px] font-montserrat text-[#2b2b2b] hover:bg-gray-100 rounded-[4px]"
            >
              Delivered
            </button>
            <button
              onClick={handleCustomerCareClick}
              className="w-full cursor-pointer text-left px-2 py-1 text-[12px] font-montserrat text-[#2b2b2b] hover:bg-gray-100 rounded-[4px]"
            >
              Customer Care
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
