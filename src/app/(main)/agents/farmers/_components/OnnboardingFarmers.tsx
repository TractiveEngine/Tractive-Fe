import React from "react";
import { motion } from "framer-motion";

interface AddToStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingFarmers: React.FC<AddToStoreProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-[#2b2b2b94] bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-[4px] w-full max-w-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h2 className="text-[17px] font-montserrat text-[#2b2b2b] mb-4">
          Onboard Farmer
        </h2>
        <p className="text-[13px] font-montserrat text-[#2b2b2b] mb-4">
          Placeholder for onboarding form content.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#538e53] text-[#f9f9f9] rounded-[4px] hover:bg-[#467a46]"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};
