"use client";
import Image from "next/image";
import React from "react";
import { BankAccounts } from "./BankAccounts";
import { useCreateFleetPayment } from "@/hooks/queries/useTransporterQueries";
import { paymentMethodMap } from "@/utils/paymentMethods";
import { useRouter } from "next/navigation";

interface AccountDetailsProps {
  fleetBidId?: string;
  paymentMethod?: string;
  locationFrom?: string;
  locationTo?: string;
}

export const AccountDetails: React.FC<AccountDetailsProps> = ({
  fleetBidId,
  paymentMethod,
  locationFrom,
  locationTo,
}) => {
  const router = useRouter();
  const { mutate: submitPayment, isPending } = useCreateFleetPayment();

  const handleConfirmPayment = () => {
    if (!fleetBidId || !paymentMethod) return;

    const note =
      locationFrom && locationTo
        ? `Payment for ${locationFrom} to ${locationTo} shipment`
        : "Fleet payment";

    submitPayment(
      {
        fleetBidId,
        paymentMethod: paymentMethodMap[paymentMethod] || paymentMethod,
        note,
      },
      {
        onSuccess: () => {
          router.push("/buyer/my-biddings");
        },
      }
    );
  };

  return (
    <div className="relative flex flex-col gap-4">
      <div className="relative flex items-center justify-center">
        <Image
          src="/images/accountVector.png"
          alt="Vector"
          width={374}
          height={249}
          className="w-[300px] h-[235]"
        />
      </div>
      <p className="absolute bottom-[17.5rem] w-[100%] mx-auto font-montserrat font-normal text-center text-[11px] px-5 text-[#2b2b2b]">
        To complete your order, kindly transfer the total amount due along with
        the item ID to one of the account numbers listed below. Thank you!
      </p>

      <BankAccounts />

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleConfirmPayment}
          disabled={isPending || !fleetBidId || !paymentMethod}
          className={`w-full h-10 rounded-tl-[6px] rounded-br-[6px] font-montserrat text-[13px] font-normal text-[#fefefe] transition duration-200 ease-in-out cursor-pointer ${
            isPending || !fleetBidId || !paymentMethod
              ? "bg-[#538e53] opacity-50 cursor-not-allowed"
              : "bg-[#538e53] hover:bg-[#3a6b3a]"
          }`}
        >
          {isPending ? "Processing..." : "I've made the transfer"}
        </button>
      </div>
    </div>
  );
};
