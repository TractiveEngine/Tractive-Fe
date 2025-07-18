"use client";
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-[#2b2b2b94] flex items-center justify-center z-[200]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-[#fefefe] rounded-[10px] shadow-md w-[90%] max-w-[400px] p-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[16px] font-montserrat font-medium text-[#2b2b2b]">
              Support Contact
            </h2>
            <button
              onClick={onClose}
              className="text-[#808080] hover:text-[#2b2b2b] text-[14px] font-montserrat"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-4 text-[12px] font-montserrat text-[#2b2b2b]">
            <p>
              <span className="font-medium">Phone:</span>{" "}
              <a
                href="tel:+2341234567890"
                className="text-[#538e53] hover:underline"
              >
                +234 123 456 7890
              </a>
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:support@example.com"
                className="text-[#538e53] hover:underline"
              >
                support@example.com
              </a>
            </p>
            <p>
              <span className="font-medium">Live Chat:</span>{" "}
              <Link
                href="/support/chat"
                className="text-[#538e53] hover:underline"
              >
                Start Live Chat
              </Link>
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-[#538e53] text-[#fefefe] text-[12px] font-montserrat py-2 rounded-[4px] hover:bg-[#467746] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
