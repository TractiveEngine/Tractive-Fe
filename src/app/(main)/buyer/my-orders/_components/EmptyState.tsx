"use client";
import React from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-[#fefefe] rounded-[5px] border border-dashed border-[#e2e2e2]">
      <div className="w-12 h-12 rounded-full bg-[#f1f1f1] flex items-center justify-center mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 3h2l.9 9.2a2 2 0 0 0 2 1.8h9.2a2 2 0 0 0 2-1.6L21 6H6"
            stroke="#538E53"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="20" r="1.5" stroke="#538E53" strokeWidth="1.6" />
          <circle cx="17" cy="20" r="1.5" stroke="#538E53" strokeWidth="1.6" />
        </svg>
      </div>
      <p className="font-montserrat font-medium text-[14px] text-[#2b2b2b] mb-1">
        {title}
      </p>
      {description && (
        <p className="font-montserrat text-[12px] text-[#808080] max-w-[320px]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
