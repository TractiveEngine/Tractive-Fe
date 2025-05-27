import Image from "next/image";
import React from "react";

export const PaymentMethod = () => {
  return (
    <div className="flex flex-col gap-3 w-[100%] px-6 ">
      <p className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
        Payment method
      </p>
      <div className="flex justify-between w-[100%]">
        <div className="flex flex-col justify-center">
          <div>
            <Image src="/images/card.png" alt="Card" width={32} height={32} />
          </div>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            Card
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <div>
            <Image
              src="/images/deposit.png"
              alt="Card"
              width={32}
              height={32}
            />
          </div>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            Deposit
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <div>
            <Image
              src="/images/Transfer.png"
              alt="Card"
              width={32}
              height={32}
            />
          </div>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            Transfer
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <div>
            <Image src="/images/cheque.png" alt="Card" width={32} height={32} />
          </div>
          <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
            Cheque
          </span>
        </div>
      </div>
    </div>
  );
};
