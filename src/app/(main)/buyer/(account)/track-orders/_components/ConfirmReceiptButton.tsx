"use client";
import React, { useState } from "react";
import { useConfirmOrderReceipt } from "@/hooks/queries/useOrderQueries";

interface Props {
  orderId: string;
  /**
   * True when the backend already records this order as receipt-confirmed
   * (receiptConfirmed / receiptConfirmedAt). Keeps the confirmed state after a
   * refresh so the buyer can't confirm the same order twice.
   */
  alreadyConfirmed?: boolean;
}

/**
 * Shown on delivered orders: lets the buyer confirm they received the
 * package. Uses a two-step inline confirmation instead of a modal.
 */
export const ConfirmReceiptButton: React.FC<Props> = ({
  orderId,
  alreadyConfirmed = false,
}) => {
  const [confirming, setConfirming] = useState(false);
  const { mutate, isPending, isSuccess } = useConfirmOrderReceipt();

  if (alreadyConfirmed || isSuccess) {
    return (
      <div className="bg-[#eaf3ea] rounded-[10px] p-3 text-center font-montserrat text-[12px] font-medium text-[#538e53]">
        Receipt confirmed — thank you!
      </div>
    );
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="w-full bg-[#538e53] text-[#fefefe] rounded-[10px] py-2.5 font-montserrat text-[13px] font-medium hover:bg-[#467a46] transition-colors cursor-pointer"
      >
        Confirm receipt
      </button>
    );
  }

  return (
    <div className="bg-[#fefefe] rounded-[10px] shadow-md p-3 flex flex-col gap-2">
      <p className="font-montserrat text-[12px] text-[#2b2b2b] text-center">
        Confirm you have received this order? This lets the transporter know
        the delivery is complete.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="flex-1 border border-[#e2e2e2] text-[#2b2b2b] rounded-[10px] py-2 font-montserrat text-[12px] font-medium hover:bg-[#f5f5f5] transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => mutate(orderId)}
          disabled={isPending}
          className="flex-1 bg-[#538e53] text-[#fefefe] rounded-[10px] py-2 font-montserrat text-[12px] font-medium hover:bg-[#467a46] transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Confirming..." : "Yes, I received it"}
        </button>
      </div>
    </div>
  );
};
