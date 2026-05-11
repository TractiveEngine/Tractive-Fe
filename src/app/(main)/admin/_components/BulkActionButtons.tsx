"use client";

import React from "react";
import { BulkAction } from "./BulkActionBar";

interface BulkActionButtonsProps {
  actions: BulkAction[];
  disabled?: boolean;
}

const toneClasses: Record<BulkAction["tone"], string> = {
  success:
    "bg-[#538e53] hover:bg-[#467a46] text-[#f9f9f9] border border-transparent",
  danger:
    "bg-[#fefefe] hover:bg-red-50 text-[#D32F2F] border border-[#D32F2F]",
  neutral:
    "bg-white hover:bg-gray-50 text-[#2b2b2b] border border-gray-300",
};

export const BulkActionButtons: React.FC<BulkActionButtonsProps> = ({
  actions,
  disabled,
}) => {
  if (actions.length === 0) return null;
  return (
    <div className="flex items-center gap-2 justify-end">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          disabled={disabled}
          className={`cursor-pointer flex items-center gap-[7px] px-4 sm:px-6 py-2 opacity-[0.92] text-[12px] sm:text-[13px] lg:text-[14px] font-normal rounded-[4px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${toneClasses[action.tone]}`}
          aria-label={action.label}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};
