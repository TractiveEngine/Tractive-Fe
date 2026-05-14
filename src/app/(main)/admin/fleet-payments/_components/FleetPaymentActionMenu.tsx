"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminActionMenuProps } from "../../_components/AdminActionMenuProps";
import { ThreeDotIcon } from "@/app/(main)/agent/produce-list/_components/table/ActionMenu";

export const FleetPaymentActionMenu: React.FC<AdminActionMenuProps> = ({
  userTypeId,
  handleApprove,
  handleDecline,
  handleRefund,
  status,
}) => {
  const [isActive, setIsActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const normalized = (status || "").toLowerCase();
  const isPending = normalized === "pending";
  const isApproved = normalized === "approved";

  if (!isPending && !isApproved) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        title="Open action menu"
        aria-label="Open action menu"
        onClick={() => setIsActive(!isActive)}
        className="bg-[#f1f1f1] rounded-full cursor-pointer p-1.5 w-[30px] h-[30px] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors duration-200"
      >
        <ThreeDotIcon />
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute min-w-[140px] right-11 -top-3 bg-[#fefefe] rounded-[7px] shadow-lg z-[100] p-1"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {isPending && handleApprove && (
              <button
                onClick={() => {
                  handleApprove(userTypeId);
                  setIsActive(false);
                }}
                className="w-full text-left px-2 py-1 text-[13px] font-montserrat text-[#2b6e2b] cursor-pointer rounded-[4px] hover:bg-green-50"
              >
                Approve
              </button>
            )}
            {isPending && handleDecline && (
              <button
                onClick={() => {
                  handleDecline(userTypeId);
                  setIsActive(false);
                }}
                className="w-full text-left px-2 py-1 text-[13px] font-montserrat text-red-600 cursor-pointer rounded-[4px] hover:bg-red-50"
              >
                Reject
              </button>
            )}
            {isApproved && handleRefund && (
              <button
                onClick={() => {
                  handleRefund(userTypeId);
                  setIsActive(false);
                }}
                className="w-full text-left px-2 py-1 text-[13px] font-montserrat text-[#2563eb] cursor-pointer rounded-[4px] hover:bg-blue-50"
              >
                Refund
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
