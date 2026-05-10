"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { BidResponse } from "@/services/bidService";
import { getAgentName } from "./bidHelpers";

interface RejectedProductBidsProps {
  bids: BidResponse[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

export const RejectedProductBids: React.FC<RejectedProductBidsProps> = ({
  bids,
  page,
  limit,
  total,
  onPageChange,
  isFetching,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, total);

  if (total === 0) {
    return (
      <div className="w-full bg-[#fefefe] rounded-[6px] shadow-sm p-10 text-center">
        <p className="font-montserrat text-[13px] text-[#808080]">
          No rejected bids.
        </p>
      </div>
    );
  }

  const sorted = [...bids].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime(),
  );
  const visible = sorted;

  return (
    <>
      <p className="font-montserrat text-[12px] text-[#808080] mb-3">
        Showing{" "}
        <span className="text-[#2b2b2b] font-medium">
          {startIndex}–{endIndex}
        </span>{" "}
        of <span className="text-[#2b2b2b] font-medium">{total}</span>
      </p>

      <div className="w-full bg-[#fefefe] shadow-sm rounded-[6px] overflow-hidden">
        {visible.map((bid, index) => {
          const updatedAgo = formatDistanceToNow(
            new Date(bid.updatedAt || bid.createdAt),
            { addSuffix: true },
          );
          return (
            <React.Fragment key={bid._id}>
              <div className="flex items-center justify-between gap-3 p-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="font-montserrat text-[12.5px] text-[#2b2b2b] truncate">
                    {bid.product.name}
                  </p>
                  <p className="font-montserrat text-[10.5px] text-[#808080] truncate">
                    ₦{bid.amount.toLocaleString()} · {getAgentName(bid)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="font-montserrat text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F8D7DA] text-[#721C24]">
                    Rejected
                  </span>
                  <span className="font-montserrat text-[10px] text-[#808080]">
                    {updatedAgo}
                  </span>
                </div>
              </div>
              {index < visible.length - 1 && (
                <div className="w-full h-[1px] bg-[#f1f1f1]" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || isFetching}
            className="px-3 py-1.5 text-[12px] font-montserrat text-[#2b2b2b] bg-[#fefefe] border border-[#e2e2e2] rounded-[4px] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
          >
            Previous
          </button>
          <span className="font-montserrat text-[12px] text-[#808080] px-2">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isFetching}
            className="px-3 py-1.5 text-[12px] font-montserrat text-[#2b2b2b] bg-[#fefefe] border border-[#e2e2e2] rounded-[4px] hover:bg-[#f5f5f5] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};
