"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionMenuProps } from "../../_components/ActionMenuProps";
import { ThreeDotIcon } from "../../produce-list/_components/table/ActionMenu";

export const FarmerActionMenu: React.FC<ActionMenuProps> = ({
  productId,
  activeMenu,
  setActiveMenu,
  handleEdit,
  handleReport,
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
        onClick={() => setActiveMenu(isActive ? null : productId)}
        className="bg-[#f1f1f1] rounded-full cursor-pointer p-1.5 w-[30px] h-[30px] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors duration-200"
      >
        <ThreeDotIcon />
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute min-w-[120px] py-1 px-1 right-0 top-10 bg-[#fefefe] rounded-[5px] shadow-lg pointer-events-auto z-[100]"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {handleEdit && (
              <button
                onClick={() => {
                  handleEdit(productId);
                  setActiveMenu(null);
                }}
                className="w-full text-left px-4 py-2 text-sm font-montserrat text-[#2b2b2b] hover:bg-gray-100"
              >
                Edit Profile
              </button>
            )}
            {handleReport && (
              <button
                onClick={() => {
                  handleReport(productId);
                  setActiveMenu(null);
                }}
                className="w-full text-left px-4 py-2 text-sm font-montserrat text-[#2b2b2b] hover:bg-gray-100"
              >
                Report
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};