"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminActionMenuProps } from "../../_components/AdminActionMenuProps";
import { ThreeDotIcon } from "../../../agent/produce-list/_components/table/ActionMenu";

// `handleSuspended` is the REMOVE action — it PATCHes the user to status
// "removed". The name is legacy; see AllUserType.tsx.
export const UserActionMenu: React.FC<AdminActionMenuProps> = ({
  userTypeId,
  handleViewProfile,
  handleToggleStatus,
  handleSuspended,
  status,
}) => {
  const [isActive, setIsActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsActive(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsActive]);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  // Items previously had no vertical padding, so they sat flush against each
  // other and were hard to hit. py-2 + a gap gives each one its own target.
  const itemBase =
    "w-full text-left px-2.5 py-2 text-[13px] font-montserrat cursor-pointer rounded-[4px] transition-colors";
  const itemClass = `${itemBase} text-[#2b2b2b] hover:bg-gray-100`;

  const isRemoved = status?.toLowerCase() === "removed";

  return (
    <div className="relative" ref={menuRef}>
      <button
        title="Open action menu"
        aria-label="Open action menu"
        onClick={() => setIsActive(isActive ? null : userTypeId)}
        className="bg-[#f1f1f1] rounded-full cursor-pointer p-1.5 w-[30px] h-[30px] flex items-center justify-center hover:bg-[#e0e0e0] transition-colors duration-200"
      >
        <ThreeDotIcon />
      </button>
      <AnimatePresence>
        {isActive !== null && (
          <motion.div
            className="absolute min-w-[150px] right-11 -top-3 bg-[#fefefe] rounded-[7px] shadow-lg z-[100] p-1.5 flex flex-col gap-0.5"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {handleViewProfile && (
              <button
                onClick={() => {
                  handleViewProfile(userTypeId);
                  setIsActive(null);
                }}
                className={itemClass}
              >
                View Profile
              </button>
            )}
            {handleToggleStatus && (
              <button
                onClick={() => {
                  handleToggleStatus(userTypeId);
                  setIsActive(null);
                }}
                className={itemClass}
              >
                {isRemoved
                  ? "Reactivate"
                  : status === "Active"
                    ? "Suspend"
                    : "Activate"}
              </button>
            )}
            {/* Remove is destructive and irreversible from this menu, so it is
                separated by a rule and tinted red. Hidden for already-removed
                users — Reactivate is the only sensible action there. */}
            {handleSuspended && !isRemoved && (
              <>
                <span className="my-0.5 h-px bg-gray-100" />
                <button
                  onClick={() => {
                    handleSuspended(userTypeId);
                    setIsActive(null);
                  }}
                  className={`${itemBase} text-[#D32F2F] hover:bg-red-50`}
                >
                  Remove
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
