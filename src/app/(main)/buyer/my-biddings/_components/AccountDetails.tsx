// _components/AccountDetails.tsx
"use client";
import Image from "next/image";
import React from "react";
import { BankAccounts } from "./BankAccounts";
import { Button } from "@/components/Button";
import { IoArrowBack } from "react-icons/io5";

const BouncingDots = () => (
  <span className="inline-flex items-center gap-[3px] ml-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-[5px] h-[5px] bg-current rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.6s" }}
      />
    ))}
  </span>
);

interface AccountDetailsProps {
  onBack: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  onBack,
  onConfirm,
  isConfirming,
}) => {
  return (
    <div className="flex flex-col gap-3 pt-3">
      {/* Back button */}
      <div className="px-4">
        <button
          onClick={onBack}
          disabled={isConfirming}
          className="flex items-center gap-1 text-[#538e53] font-montserrat text-[12px] font-medium cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoArrowBack size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Image */}
      <div className="flex items-center justify-center">
        <Image
          src="/images/accountVector.png"
          alt="Vector"
          width={374}
          height={249}
          className="w-[240px] h-[180px] object-contain"
        />
      </div>

      {/* Instruction text */}
      <p className="font-montserrat font-normal text-center text-[11px] px-5 text-[#2b2b2b]">
        To complete your order, kindly transfer the total amount due along with
        the item ID to one of the account numbers listed below. Thank you!
      </p>

      {/* Bank accounts */}
      <BankAccounts />

      {/* Confirm button */}
      <div className="px-4 pb-4">
        <Button
          text={
            isConfirming ? (
              <span className="flex items-center">
                Processing<BouncingDots />
              </span>
            ) : (
              "I've made the transfer"
            )
          }
          onClick={onConfirm}
          className="justify-center w-full"
          disabled={isConfirming}
        />
      </div>
    </div>
  );
};
