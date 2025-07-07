import { Button } from "@/components/Button";
import { InfoIcon } from "@/icons/Icons";
import React from "react";
import { ProPaymentMethod } from "./ProPaymentMethod";
import Link from "next/link";

export const MakeBid = () => {
  return (
    <form className="flex flex-col gap-[2px] w-[100%] lg:w-[50%] rounded-md shadow-md">
      <div className="flex flex-col gap-2 bg-[#fefefe] px-4 py-8 rounded-t-[4px]">
        <label
          htmlFor="bid"
          className="font-montserrat text-[13px] md:text-[14px] font-normal"
        >
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
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[12px] md:text-[13px]">
          Want To Negotiate? <span className="text-[#538e53]">Chat Seller</span>
        </p>
        <span className="font-montserrat font-normal text-[#2b2b2b] text-[12px] md:text-[13px]]">
          Or
        </span>
        <span className="font-montserrat font-normal text-[#538e53] text-[12px] md:text-[13px]">
          Call Seller
        </span>
      </div>
      <div className="flex items-center bg-[#fefefe] px-4 py-2 justify-start gap-1.5">
        <InfoIcon />
        <p className="font-montserrat font-normal text-[#2b2b2b] text-[10px] sm:text-[11px] md:text-[12px]">
          Note that you wil be notified once you wins the biding.
        </p>
      </div>
      <div className="flex items-center bg-[#fefefe] px-4 py-7 justify-center">
        <Link
          href="/buyers/my-biddings"
          className="bg-[#538e53] w-[100%] text-[#fefefe] flex justify-center font-montserrat font-normal text-[13px] md:text-[14px] px-4 py-3 rounded-md hover:bg-[#3f7a3f] transition duration-300"
        >
          Bid
        </Link>
      </div>
      <div className="flex items-center bg-[#fefefe] px-4 py-7">
        <ProPaymentMethod />
      </div>
    </form>
  );
};
