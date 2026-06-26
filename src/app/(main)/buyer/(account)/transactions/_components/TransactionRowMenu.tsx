"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeDotIcon } from "@/app/(main)/transporter/fleet-list/_components/table/ActionMenu";
import { LiveChatModal } from "./LiveChatModal";
import { ReceiptModal } from "./ReceiptModal";
import type { BuyerTransactionRow } from "./transactionsData";

interface Props {
  row: BuyerTransactionRow;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
}

export const TransactionRowMenu: React.FC<Props> = ({
  row,
  activeMenu,
  setActiveMenu,
}) => {
  const isActive = activeMenu === row.id;
  const menuRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setActiveMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        title="Open action menu"
        aria-label="Open action menu"
        onClick={(e) => {
          e.stopPropagation();
          setActiveMenu(isActive ? null : row.id);
        }}
        className="bg-[#f1f1f1] rounded-full cursor-pointer p-1.5 w-[28px] h-[28px] flex items-center justify-center hover:bg-[#e0e0e0]"
      >
        <ThreeDotIcon />
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute w-[10rem] py-1 px-1 right-8 top-0 bg-[#fefefe] rounded-[6px] shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(null);
                setIsReceiptOpen(true);
              }}
              className="w-full text-left px-3 py-1.5 text-[11.5px] font-montserrat text-[#2b2b2b] hover:bg-gray-100 cursor-pointer"
            >
              View receipt
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(null);
                setIsChatOpen(true);
              }}
              className="w-full text-left px-3 py-1.5 text-[11.5px] font-montserrat text-[#2b2b2b] hover:bg-gray-100 cursor-pointer"
            >
              Contact seller
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LiveChatModal
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <ReceiptModal
        open={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={row}
      />
    </div>
  );
};
