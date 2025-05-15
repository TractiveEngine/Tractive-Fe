import { Button } from "@/components/Button";
import { InfoIcon } from "@/icons/Icons";
import React from "react";
import { ProPaymentMethod } from "./ProPaymentMethod";

export const MakeBid = () => {
  return (
    <form className="flex flex-col gap-[2px] w-[50%] rounded-md shadow-md">
      <div className="flex flex-col gap-2 bg-[#fefefe] px-4 py-8 rounded-t-[4px]">
        <label htmlFor="bid" className="text-sm font-semibold">
          Bid
        </label>
        <input
          type="text"
          //   value="$"
          id="bid"
          placeholder="$"
          className="border border-[#808080] rounded-[4px] p-2 focus:outline-none focus:ring-[1px] focus:ring-[#538e53]"
        />
      </div>
      <div className="flex flex-col items-center bg-[#fefefe] px-4 py-2 justify-center gap-1.5">
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[13px]">
          Want To Negotiate? <span className="text-[#538e53]">Chat Seller</span>
        </p>
        <span className="font-montserrat font-normal text-[#2b2b2b] text-[13px]">
          Or
        </span>
        <span className="font-montserrat font-normal text-[#538e53] text-[13px]">
          Call Seller
        </span>
      </div>
      <div className="flex items-center bg-[#fefefe] px-4 py-2 justify-start gap-1.5">
        <InfoIcon />
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[11px]">
          Note that you wil be notified once you wins the biding.
        </p>
      </div>
      <div className="flex items-center bg-[#fefefe] px-4 py-7 justify-center">
        <Button
          text="Bid"
          className="justify-center w-[100%] !py-3"
          onClick={() => {}}
        />
      </div>
          <div className="flex items-center bg-[#fefefe] px-4 py-7">
              <ProPaymentMethod />
      </div>
    </form>
  );
};
