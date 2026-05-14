"use client";
import React from "react";

interface Props {
  cards?: number;
}

export const OrderListSkeleton: React.FC<Props> = ({ cards = 3 }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={`order-skeleton-${i}`}
          className="bg-[#fefefe] rounded-[10px] p-3 sm:p-4 border border-[#e2e2e2]"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-[44px] h-[36px] rounded-[4px] bg-gray-100 animate-pulse" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
                <div className="h-2.5 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-16 rounded-[4px] bg-gray-100 animate-pulse" />
          </div>

          <div className="flex items-center justify-between mb-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex flex-col items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-2 w-10 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#f7f7f7] rounded-[6px] p-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-8 h-5 rounded-[4px] bg-gray-100 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-2.5 w-16 rounded bg-gray-100 animate-pulse" />
                <div className="h-2 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
            <div className="w-px h-8 bg-[#e2e2e2]" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-[4px] bg-gray-100 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-2.5 w-16 rounded bg-gray-100 animate-pulse" />
                <div className="h-2 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TrackingDetailSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[#fefefe] rounded-[10px] shadow-md overflow-hidden">
        <div className="w-full h-[260px] sm:h-[320px] bg-gray-100 animate-pulse" />
        <div className="flex items-center justify-between px-6 py-4 gap-2">
          <div className="flex flex-col gap-1.5 items-center">
            <div className="w-4 h-4 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-2.5 w-12 rounded bg-gray-100 animate-pulse" />
            <div className="h-2 w-16 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1.5 items-center">
            <div className="w-4 h-4 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-2.5 w-12 rounded bg-gray-100 animate-pulse" />
            <div className="h-2 w-16 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="flex flex-col gap-1.5 items-center">
            <div className="w-4 h-4 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-2.5 w-12 rounded bg-gray-100 animate-pulse" />
            <div className="h-2 w-16 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#fefefe] rounded-[10px] shadow-md p-4 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
          <div className="h-2.5 w-20 rounded bg-gray-100 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-2.5 w-24 rounded bg-gray-100 animate-pulse" />
          <div className="h-2.5 w-20 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="bg-[#fefefe] rounded-[10px] shadow-md p-4 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-2 py-1">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-[4px] bg-gray-100 animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                  <div className="h-2.5 w-24 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
              <div className="h-2.5 w-16 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
