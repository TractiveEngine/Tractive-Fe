"use client";
import React, { useState } from "react";
import {
  useBuyerFleetBids,
  useRespondToFleetBid,
} from "@/hooks/queries/useTransporterQueries";
import { FleetBidResponse } from "@/services/negotiationService";
import { FleetBidPaymentModal } from "./FleetBidPaymentModal";

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-[#FFF3CD]", text: "text-[#856404]", label: "Pending" },
  accepted: { bg: "bg-[#D4EDDA]", text: "text-[#155724]", label: "Accepted" },
  countered: { bg: "bg-[#CCE5FF]", text: "text-[#004085]", label: "Countered" },
  rejected: { bg: "bg-[#F8D7DA]", text: "text-[#721C24]", label: "Rejected" },
};

export const MyFleetBids: React.FC = () => {
  const { data: bids, isLoading } = useBuyerFleetBids();
  const { mutate: respondToBid, isPending: isResponding } = useRespondToFleetBid();
  const [payingBid, setPayingBid] = useState<FleetBidResponse | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="w-6 h-6 border-3 border-[#538e53] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fleetBids = bids || [];

  if (fleetBids.length === 0) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <p className="font-montserrat text-[13px] text-[#808080]">
          No fleet bids yet.
        </p>
      </div>
    );
  }

  const getFleetId = (bid: FleetBidResponse) =>
    typeof bid.fleet === "object" ? bid.fleet._id : bid.fleet;

  const getFleetName = (bid: FleetBidResponse) =>
    typeof bid.fleet === "object" ? bid.fleet.fleetName : "Fleet";

  const getFleetRoute = (bid: FleetBidResponse) => {
    if (typeof bid.fleet === "object" && bid.fleet.route) {
      return `${bid.fleet.route.fromState} → ${bid.fleet.route.toState}`;
    }
    return null;
  };

  const handleRespond = (bid: FleetBidResponse, action: "accept" | "reject") => {
    respondToBid({
      fleetId: getFleetId(bid),
      bidId: bid._id,
      payload: { action },
    });
  };

  return (
    <>
      <div className="w-full flex flex-col gap-3">
        {fleetBids.map((bid) => {
          const status = statusStyles[bid.status] || statusStyles.pending;
          const route = getFleetRoute(bid);

          return (
            <div
              key={bid._id}
              className="bg-[#fefefe] rounded-[6px] shadow-sm border border-[#e2e2e2] p-4 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="font-montserrat text-[13px] sm:text-[14px] font-medium text-[#2b2b2b]">
                    {getFleetName(bid)}
                  </p>
                  {route && (
                    <p className="font-montserrat text-[10px] sm:text-[11px] text-[#808080]">
                      {route}
                    </p>
                  )}
                </div>
                <span
                  className={`${status.bg} ${status.text} font-montserrat text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-full`}
                >
                  {status.label}
                </span>
              </div>

              {/* Bid Details */}
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080]">
                  Your Bid:{" "}
                  <span className="text-[#2b2b2b] font-medium">
                    ₦{bid.amount.toLocaleString()}
                  </span>
                </p>
                {bid.counterAmount && (
                  <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080]">
                    Counter:{" "}
                    <span className="text-[#2b2b2b] font-medium">
                      ₦{bid.counterAmount.toLocaleString()}
                    </span>
                  </p>
                )}
                <p className="font-montserrat text-[10px] sm:text-[11px] text-[#808080]">
                  {new Date(bid.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Message */}
              {bid.message && (
                <p className="font-montserrat text-[11px] text-[#808080] italic">
                  &quot;{bid.message}&quot;
                </p>
              )}
              {bid.transporterMessage && (
                <p className="font-montserrat text-[11px] text-[#004085] italic">
                  Transporter: &quot;{bid.transporterMessage}&quot;
                </p>
              )}

              {/* Actions */}
              {bid.status === "countered" && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleRespond(bid, "accept")}
                    disabled={isResponding}
                    className="flex-1 h-9 bg-[#538e53] hover:bg-[#3a6b3a] text-[#fefefe] font-montserrat text-[12px] rounded-[4px] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRespond(bid, "reject")}
                    disabled={isResponding}
                    className="flex-1 h-9 border border-[#d32f2f] text-[#d32f2f] hover:bg-[#fde8e8] font-montserrat text-[12px] rounded-[4px] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
              )}

              {bid.status === "accepted" && (
                <button
                  type="button"
                  onClick={() => setPayingBid(bid)}
                  className="w-full h-9 bg-[#538e53] hover:bg-[#3a6b3a] text-[#fefefe] font-montserrat text-[12px] rounded-[4px] transition cursor-pointer"
                >
                  Pay Now
                </button>
              )}
            </div>
          );
        })}
      </div>

      {payingBid && (
        <FleetBidPaymentModal
          isOpen={!!payingBid}
          onClose={() => setPayingBid(null)}
          bid={payingBid}
        />
      )}
    </>
  );
};
