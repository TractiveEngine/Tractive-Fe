"use client";
import React from "react";

export type TransportStatus =
  | "not_moved"
  | "in_transit"
  | "delivered"
  | "pending"
  | "parked"
  | string;

interface StatusBadgeProps {
  status: TransportStatus;
  className?: string;
}

const STATUS_MAP: Record<
  string,
  { label: string; classes: string }
> = {
  not_moved: {
    label: "Fleet Not Moved",
    classes: "bg-[#f0f0f0] text-[#2b2b2b] border border-[#e2e2e2]",
  },
  pending: {
    label: "Fleet Not Moved",
    classes: "bg-[#f0f0f0] text-[#2b2b2b] border border-[#e2e2e2]",
  },
  parked: {
    label: "Fleet Not Moved",
    classes: "bg-[#f0f0f0] text-[#2b2b2b] border border-[#e2e2e2]",
  },
  in_transit: {
    label: "In Transit",
    classes: "bg-[#fff3cd] text-[#856404] border border-[#ffe69c]",
  },
  delivered: {
    label: "Delivered",
    classes: "bg-[#d4edda] text-[#155724] border border-[#b7dfc1]",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const key = (status || "").toLowerCase();
  const resolved = STATUS_MAP[key] ?? {
    label: status ? status.replace(/_/g, " ") : "Unknown",
    classes: "bg-[#f0f0f0] text-[#2b2b2b] border border-[#e2e2e2]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-[4px] font-montserrat font-medium text-[11px] leading-none ${resolved.classes} ${className}`}
    >
      {resolved.label}
    </span>
  );
};
