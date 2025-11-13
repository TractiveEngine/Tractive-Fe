"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation variants for dropdown
const dropdownVariants = {
  hidden: { opacity: 0, scaleY: 0, transformOrigin: "top" },
  visible: { opacity: 1, scaleY: 1, transition: { duration: 0.2 } },
};

interface ActionMenuProps {
  productId: string;
  status: string;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleToggleStatus: (id: string) => void; // Renamed from handleSetAvailable
  handleTracking: (id: string) => void;
}

export const ThreeDotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="7"
      height="18"
      viewBox="0 0 7 21"
      fill="none"
    >
      <path
        d="M1.5 17.5C1.5 18.6 2.4 19.5 3.5 19.5C4.6 19.5 5.5 18.6 5.5 17.5C5.5 16.4 4.6 15.5 3.5 15.5C2.4 15.5 1.5 16.4 1.5 17.5ZM1.5 3.5C1.5 4.6 2.4 5.5 3.5 5.5C4.6 5.5 5.5 4.6 5.5 3.5C5.5 2.4 4.6 1.5 3.5 1.5C2.4 1.5 1.5 2.4 1.5 3.5ZM1.5 10.5C1.5 11.6 2.4 12.5 3.5 12.5C4.6 12.5 5.5 11.6 5.5 10.5C5.5 9.4 4.6 8.5 3.5 8.5C2.4 8.5 1.5 9.4 1.5 10.5Z"
        stroke="#2B2B2B"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const ActionMenu: React.FC<ActionMenuProps> = ({
  productId,
  status,
  activeMenu,
  setActiveMenu,
  handleEdit,
  handleDelete,
  handleToggleStatus,
  handleTracking,
}) => {
  const isOpen = activeMenu === productId;

  return (
    <>
      <button
        title="Open action menu"
        aria-label="Open action menu"
        onClick={() => setActiveMenu(isOpen ? null : productId)}
        className="bg-[#f1f1f1] rounded-[100px] cursor-pointer p-1.5 w-[30px] h-[30px] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors duration-200"
      >
        <ThreeDotIcon />
      </button>
      {isOpen && (
        <motion.div
          className="absolute w-[6.8rem] py-1 px-1 bottom-[0rem] right-16 bg-[#fefefe] rounded-[5px] shadow-lg pointer-events-auto"
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
        >
          {status === "On transit" ? (
            <button
              onClick={() => {
                handleTracking(productId);
                setActiveMenu(null);
              }}
              className="block cursor-pointer w-full text-left px-2.5 text-[12px] font-montserrat text-[#2b2b2b] rounded-[4px] hover:bg-gray-100"
            >
              Tracking
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  handleToggleStatus(productId);
                  setActiveMenu(null);
                }}
                className="block cursor-pointer w-full text-left px-2.5 text-[12px] font-montserrat text-[#2b2b2b] rounded-[4px] hover:bg-gray-100"
              >
                {status === "Available" ? "Maintenance" : "Available"}
              </button>
              <button
                onClick={() => {
                  handleEdit(productId);
                  setActiveMenu(null);
                }}
                className="block cursor-pointer w-full text-left px-2.5 text-[12px] font-montserrat text-[#2b2b2b] rounded-[4px] hover:bg-gray-100"
              >
                Edit fleet
              </button>
              <button
                onClick={() => {
                  handleDelete(productId);
                  setActiveMenu(null);
                }}
                className="block cursor-pointer w-full text-left px-2.5 text-[12px] font-montserrat text-[#2b2b2b] rounded-[4px] hover:bg-gray-100"
              >
                Delete fleet
              </button>
            </>
          )}
        </motion.div>
      )}
    </>
  );
};