"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export type BulkActionTone = "success" | "danger" | "neutral";

export interface BulkAction {
  id: string;
  label: string;
  tone: BulkActionTone;
  onClick: () => void;
}

interface BulkActionBarProps {
  selectedCount: number;
  onClear?: () => void;
  actions: BulkAction[];
  isSubmitting?: boolean;
}

const toneClasses: Record<BulkActionTone, string> = {
  success:
    "bg-[#538e53] hover:bg-[#467a46] text-[#fefefe] border border-transparent",
  danger:
    "bg-[#D32F2F] hover:bg-[#b71c1c] text-[#fefefe] border border-transparent",
  neutral:
    "bg-white hover:bg-gray-50 text-[#2b2b2b] border border-gray-300",
};

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClear,
  actions,
  isSubmitting,
}) => {
  const visible = selectedCount > 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mx-6 mt-3 px-4 py-2.5 rounded-[8px] border border-[#538e53]/30 bg-[#538e53]/5"
        >
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-montserrat font-medium text-[#2b2b2b]">
              {selectedCount} selected
            </span>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                disabled={isSubmitting}
                className="cursor-pointer text-[12px] font-montserrat text-[#538e53] hover:underline disabled:opacity-60"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                disabled={isSubmitting}
                className={`cursor-pointer px-3 py-1.5 text-[12px] font-montserrat font-medium rounded-[6px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${toneClasses[action.tone]}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
