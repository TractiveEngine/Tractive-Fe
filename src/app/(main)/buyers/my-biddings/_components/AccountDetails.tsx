// _components/AccountDetails.tsx
"use client";
import Image from "next/image";
import React from "react";
import { BankAccounts } from "./BankAccounts";


export const AccountDetails: React.FC= () => {
  return (
    <div className="relative flex flex-col gap-4">
      <div className="relative flex items-center justify-center">
        <Image
          src="/images/accountVector.png"
          alt="Vector"
          width={374}
          height={249}
          className="w-[300px] h-[235px]"
        />
      </div>
      <p className="absolute bottom-[14.7rem] w-full mx-auto font-montserrat font-normal text-center text-[10.5px] p-3 text-[#2b2b2b]">
        To complete your order, kindly transfer the total amount due along with
        the item ID to one of the account numbers listed below. Thank you!
      </p>

      <BankAccounts />
    </div>
  );
};
