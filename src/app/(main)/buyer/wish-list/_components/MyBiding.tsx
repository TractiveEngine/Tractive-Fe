"use client";
import React, { useMemo, useState } from "react";
import { WonBidding } from "./WonBidding";
import { BiddingProduct } from "./BiddingProduct";
import {
  useCounteredBids,
  usePendingBids,
  useRejectedBids,
  useWonBids,
} from "@/hooks/queries/useBidQueries";

// The four bid states, matching the pills on /buyer/my-biddings.
type SubTab = "countered" | "pending" | "ready" | "rejected";

const PAGE_LIMIT = 20;

export const MyBiding: React.FC = () => {
  const [activeSub, setActiveSub] = useState<SubTab>("countered");

  const countered = useCounteredBids(1, PAGE_LIMIT);
  const pending = usePendingBids(1, PAGE_LIMIT);
  const rejected = useRejectedBids(1, PAGE_LIMIT);
  const won = useWonBids();

  const counteredBids = useMemo(
    () => countered.data?.bids ?? [],
    [countered.data],
  );
  const pendingBids = useMemo(() => pending.data?.bids ?? [], [pending.data]);
  const rejectedBids = useMemo(() => rejected.data?.bids ?? [], [rejected.data]);
  const wonBids = useMemo(() => won.data ?? [], [won.data]);

  const counteredTotal = countered.data?.pagination.total ?? counteredBids.length;
  const pendingTotal = pending.data?.pagination.total ?? pendingBids.length;
  const rejectedTotal = rejected.data?.pagination.total ?? rejectedBids.length;

  const pills: Array<{ id: SubTab; label: string; count: number }> = [
    { id: "countered", label: "Needs response", count: counteredTotal },
    { id: "pending", label: "Waiting", count: pendingTotal },
    { id: "ready", label: "Ready to checkout", count: wonBids.length },
    { id: "rejected", label: "Rejected", count: rejectedTotal },
  ];

  // Same colour language as the pills on /buyer/my-biddings: blue when a counter
  // needs a response, green when something is ready to check out.
  const pillTone = (id: SubTab, count: number, isActive: boolean) => {
    if (isActive) return "bg-[#538e53] text-[#fefefe] border-[#538e53]";
    if (id === "countered" && count > 0) {
      return "bg-[#e8f0fe] text-[#2563eb] border-[#bcd4fe] hover:bg-[#d9e5fd]";
    }
    if (id === "ready" && count > 0) {
      return "bg-[#eaf6ea] text-[#2a6b2a] border-[#c7e1c7] hover:bg-[#ddefdd]";
    }
    return "bg-[#fefefe] text-[#2b2b2b] border-[#e2e2e2] hover:bg-[#f5f5f5]";
  };

  const current = {
    countered: {
      bids: counteredBids,
      isLoading: countered.isLoading,
      isError: countered.isError,
      emptyText: "No bids are waiting on your response.",
    },
    pending: {
      bids: pendingBids,
      isLoading: pending.isLoading,
      isError: pending.isError,
      emptyText: "No bids are waiting on a seller response.",
    },
    ready: {
      bids: wonBids,
      isLoading: won.isLoading,
      isError: won.isError,
      emptyText: "You have no bids ready to check out.",
    },
    rejected: {
      bids: rejectedBids,
      isLoading: rejected.isLoading,
      isError: rejected.isError,
      emptyText: "No rejected bids.",
    },
  }[activeSub];

  return (
    <div>
      <WonBidding />

      {/* Filter switch — same four states as /buyer/my-biddings. */}
      <div className="w-[90%] mx-auto flex items-center gap-2 flex-wrap mt-4 mb-4">
        {pills.map((pill) => {
          const isActive = activeSub === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveSub(pill.id)}
              className={`font-montserrat text-[12px] px-3 py-1.5 rounded-full border transition cursor-pointer ${pillTone(
                pill.id,
                pill.count,
                isActive,
              )}`}
            >
              {pill.label}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] rounded-full ${
                  isActive
                    ? "bg-white/25 text-white"
                    : pill.id === "countered" && pill.count > 0
                      ? "bg-[#2563eb] text-white"
                      : pill.id === "ready" && pill.count > 0
                        ? "bg-[#538e53] text-white"
                        : "bg-[#f1f1f1] text-[#808080]"
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      <BiddingProduct
        bids={current.bids}
        isLoading={current.isLoading}
        isError={current.isError}
        emptyText={current.emptyText}
      />
    </div>
  );
};
