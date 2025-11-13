"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ActionMenuProps } from "../../_components/ActionMenuProps";
import { ThreeDotIcon } from "../../produce-list/_components/table/ActionMenu";
import { farmerService } from "@/services/FarmerService";

export const FarmerActionMenu: React.FC<ActionMenuProps> = ({
  productId,
  activeMenu,
  setActiveMenu,
  handleEdit,
}) => {
  const isActive = activeMenu === productId;
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleReportClick = () => {
    console.log(`Navigating to report page for farmer: ${productId}`);
    setActiveMenu(null);
    router.push(`/report?farmerId=${productId}&type=farmer`);
  };

  const handleDeleteClick = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this farmer? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      console.log(`🗑️ Deleting farmer: ${productId}`);
      await farmerService.deleteFarmer(productId);

      setActiveMenu(null);

      // Trigger page refresh to update the list
      // The parent component should handle this via fetchFarmers()
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete farmer:", error);
      // Error toast is already shown by the service
    }
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
            className="absolute min-w-[140px] py-1 px-1 right-0 top-10 bg-[#fefefe] rounded-[5px] shadow-lg pointer-events-auto z-[100]"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {handleEdit && (
              <button
                onClick={() => {
                  console.log(`Edit clicked for farmer: ${productId}`);
                  handleEdit(productId);
                  setActiveMenu(null);
                }}
                className="w-full text-left px-4 py-2 text-sm font-montserrat text-[#2b2b2b] hover:bg-gray-100 rounded transition-colors"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={handleReportClick}
              className="w-full text-left px-4 py-2 text-sm font-montserrat text-[#2b2b2b] hover:bg-gray-100 rounded transition-colors"
            >
              Report
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full text-left px-4 py-2 text-sm font-montserrat text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
