// _components/BidsCheckout.tsx
"use client";
import React, { useState } from "react";
import { WarningIcon, XIcon } from "@/icons/Icon1";
import { Button } from "@/components/Button";
import { AccountDetails } from "./AccountDetails";
import { DeliveryDetailsAndPaymentMethod } from "./DeliveryDetailsAndPaymentMethod";
import { PaymentMethod } from "./PaymentMethod";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface BidsCheckoutProps {
  totalPrice: number;
  hasSelection: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#2b2b2bd4] flex items-center justify-center z-50"
      onClick={onClose} // Close on backdrop click
    >
      <div
        className="bg-[#fefefe] rounded-[8px] w-[90%] max-w-[400px] max-h-[90vh] overflow-y-auto relative z-60"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#2b2b2b] font-montserrat text-[16px] font-medium cursor-pointer z-70"
          title="Close"
          aria-label="Close"
        >
          <XIcon />
        </button>
        {children}
      </div>
    </div>
  );
};

export const BidsCheckout: React.FC<BidsCheckoutProps> = ({
  totalPrice,
  hasSelection,
}) => {
  const [isAccountDetailsOpen, setIsAccountDetailsOpen] =
    useState<boolean>(false);
  const [isDeliveryDetailsOpen, setIsDeliveryDetailsOpen] =
    useState<boolean>(false);

  const handleCheckoutClick = () => {
    if (hasSelection) {
      setIsDeliveryDetailsOpen(true);
    }
  };

  const handleContinueFromDeliveryDetails = () => {
    setIsDeliveryDetailsOpen(false);
    setIsAccountDetailsOpen(true);
  };

  return (
    <div className="w-full md:w-[50%] bg-[#fefefe] h-fit shadow-md my-8 rounded-[5px] mx-auto">
      <p className="font-montserrat font-normal text-[15px] text-[#2b2b2b] p-4">
        Summary
      </p>
      <div className="w-full border-t border-dashed border-[#808080]"></div>

      <div className="flex items-center justify-between w-full p-4">
        <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
          Total
        </span>
        <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
          ${totalPrice.toLocaleString()}
        </span>
      </div>
      <div className="w-full h-[1px] bg-[#808080]"></div>
      <div className="flex items-center gap-2 w-full p-4">
        <WarningIcon />
        <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
          Note that delivery fee is not included.
        </span>
      </div>
      <div className="w-full h-[1px] bg-[#808080]"></div>

      <Button
        text="Checkout"
        onClick={handleCheckoutClick}
        className="justify-center !rounded-[4px] my-4 w-[80%] mx-auto"
        disabled={!hasSelection}
      />

      <Modal
        isOpen={isDeliveryDetailsOpen}
        onClose={() => setIsDeliveryDetailsOpen(false)}
      >
        <DeliveryDetailsAndPaymentMethod
          totalPrice={totalPrice}
          onContinue={handleContinueFromDeliveryDetails}
        />
      </Modal>
      <Modal
        isOpen={isAccountDetailsOpen}
        onClose={() => setIsAccountDetailsOpen(false)}
      >
        <AccountDetails />
      </Modal>
      <PaymentMethod />
    </div>
  );
};
