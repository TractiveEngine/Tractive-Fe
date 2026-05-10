"use client";
import React from "react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showCheckbox?: boolean;
  showAvatar?: boolean;
  showActionMenu?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows = 6,
  showCheckbox = true,
  showAvatar = true,
  showActionMenu = true,
}) => {
  return (
    <div className="w-full overflow-x-auto px-6 pb-2">
      {/* Header strip */}
      <div className="flex items-center gap-6 py-3">
        {showCheckbox && (
          <div className="w-5 h-5 rounded bg-gray-100 animate-pulse" />
        )}
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`th-${i}`}
            className="h-3 rounded bg-gray-100 animate-pulse"
            style={{ width: `${i === 0 ? 110 : 70}px` }}
          />
        ))}
        {showActionMenu && (
          <div className="ml-auto w-6 h-3 rounded bg-gray-100 animate-pulse" />
        )}
      </div>
      <div className="h-px w-full bg-gray-100 mb-2" />

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex items-center gap-6 py-3 border-b border-gray-100"
        >
          {showCheckbox && (
            <div className="w-5 h-5 rounded bg-gray-100 animate-pulse" />
          )}
          {/* First cell: image + two stacked text bars */}
          <div className="flex items-center gap-3 min-w-[180px]">
            {showAvatar && (
              <div className="w-9 h-9 rounded-md bg-gray-100 animate-pulse shrink-0" />
            )}
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
              <div className="h-2.5 w-16 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          {/* Remaining cells: single bars of varying widths */}
          {Array.from({ length: Math.max(columns - 1, 0) }).map((_, i) => (
            <div
              key={`cell-${rowIndex}-${i}`}
              className="h-3 rounded bg-gray-100 animate-pulse"
              style={{
                width: `${[64, 80, 56, 72, 60][i % 5]}px`,
              }}
            />
          ))}
          {showActionMenu && (
            <div className="ml-auto w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};
