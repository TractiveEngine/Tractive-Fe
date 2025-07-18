"use client";
import React from "react";
import { motion } from "framer-motion";
import { copyToClipboard } from "@/utils/Clipboard";

interface CustomerCareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerCareModal: React.FC<CustomerCareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const customerCareNumbers = [
    { id: 1, number: "+234-800-123-4567", label: "Main Support" },
    { id: 2, number: "+234-800-765-4321", label: "Technical Support" },
    { id: 3, number: "+234-800-987-6543", label: "Billing Support" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#2b2b2b94] flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-[10px] p-6 w-[90%] max-w-[400px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-montserrat font-semibold text-[#2b2b2b]">
            Customer Care
          </h2>
          <button
            onClick={onClose}
            className="text-[#808080] hover:text-[#2b2b2b]"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          {customerCareNumbers.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-2 bg-[#f8f8f8] rounded-[4px]"
            >
              <div>
                <p className="text-sm font-montserrat text-[#2b2b2b]">
                  {contact.label}
                </p>
                <p className="text-sm font-montserrat text-[#808080]">
                  {contact.number}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(contact.number)}
                className="text-[#538e53] hover:text-[#3d6b3d]"
                title="Copy number"
                aria-label={`Copy ${contact.label} number`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-[#538e53] text-white rounded-[4px] font-montserrat text-sm hover:bg-[#3d6b3d]"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
};