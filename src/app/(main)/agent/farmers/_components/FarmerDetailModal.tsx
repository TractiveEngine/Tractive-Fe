"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { XModalIcon } from "../../_components/Icons/AgentIcons"; // Adjust path if needed
import { Farmer } from "@/services/FarmerService";

interface FarmerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: Farmer | null;
}

export const FarmerDetailModal: React.FC<FarmerDetailModalProps> = ({
  isOpen,
  onClose,
  farmer,
}) => {
  if (!isOpen || !farmer) return null;

  // Helper to render a detail row
  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 font-medium mb-1 sm:mb-0">
        {label}
      </span>
      <span className="text-sm text-[#2b2b2b] font-medium text-right">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 bg-[#2b2b2b94] flex items-center justify-center z-[100] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-labelledby="farmer-detail-title"
    >
      <motion.div
        className="bg-[#fefefe] rounded-lg w-full max-w-lg mx-auto relative max-h-[90vh] overflow-y-auto shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header with Profile Image */}
        <div className="bg-[#538e53] p-6 text-center relative rounded-t-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <XModalIcon className="w-6 h-6" stroke="currentColor" />
          </button>

          <div className="flex justify-center mb-3">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white">
              <Image
                src={farmer.image || "/images/farmer_modal_profile.png"}
                alt={farmer.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h2
            id="farmer-detail-title"
            className="text-xl font-bold text-white font-montserrat"
          >
            {farmer.name}
          </h2>
          <p className="text-white/80 text-sm font-montserrat mt-1">
            {farmer.businessName}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-1">
              Contact Info
            </h3>
            <DetailRow label="Phone Number" value={farmer.mobile} />
            <DetailRow label="Address" value={farmer.address} />
            <DetailRow label="State" value={farmer.state} />
            <DetailRow label="LGA" value={farmer.lga} />
            <DetailRow label="Country" value={farmer.country} />

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">
              Business Details
            </h3>
            <DetailRow label="Business Name" value={farmer.businessName} />
            <DetailRow label="NIN / CAC" value={farmer.ninOrCac} />
            <DetailRow label="Local Market" value={farmer.localMarket} />

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">
              Performance
            </h3>
            <DetailRow label="Revenue" value={farmer.revenue} />
            <DetailRow label="Orders" value={farmer.orders} />
            <DetailRow label="Date Joined" value={farmer.date} />
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};



