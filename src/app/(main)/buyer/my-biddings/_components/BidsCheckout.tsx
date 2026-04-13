// _components/BidsCheckout.tsx
"use client";
import React, { useState } from "react";
import { WarningIcon, XIcon } from "@/icons/Icon1";
import { Button } from "@/components/Button";
import { AccountDetails } from "./AccountDetails";
import { DeliveryDetailsAndPaymentMethod } from "./DeliveryDetailsAndPaymentMethod";
import { PaymentMethod } from "./PaymentMethod";
import { useCreateOrder } from "@/hooks/queries/useOrderQueries";
import { useCreateTransaction } from "@/hooks/queries/useTransactionQueries";
import { BidResponse } from "@/services/bidService";
import { paymentMethodMap } from "@/utils/paymentMethods";
import { toast } from "sonner";

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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface BidsCheckoutProps {
  productsSubtotal: number;
  localTransportTotal: number;
  totalAmount: number;
  hasSelection: boolean;
  selectedBidIds: string[];
  checkoutData: BidResponse[];
  onTransactionSuccess?: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#2b2b2bd4] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#fefefe] rounded-[8px] w-[90%] max-w-[400px] max-h-[90vh] overflow-y-auto relative z-60"
        onClick={(e) => e.stopPropagation()}
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
  productsSubtotal,
  localTransportTotal,
  totalAmount,
  hasSelection,
  selectedBidIds,
  checkoutData,
  onTransactionSuccess,
}) => {
  // Modal step: "payment" | "bank-details" | null
  const [modalStep, setModalStep] = useState<"payment" | "bank-details" | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  const createOrderMutation = useCreateOrder();
  const createTransactionMutation = useCreateTransaction();

  const handleCheckoutClick = () => {
    if (!hasSelection) return;

    const selectedBids = checkoutData.filter((bid) =>
      selectedBidIds.includes(bid._id)
    );

    const products = selectedBids.map((bid) => ({
      product: bid.product._id,
      quantity: bid.product.quantity,
    }));

    const bidIds = selectedBids.map((bid) => bid._id);

    let address = "";
    let phone = "";
    try {
      const onboardingData = localStorage.getItem("onboarding-data");
      if (onboardingData) {
        const parsed = JSON.parse(onboardingData);
        address = parsed.address || "";
        phone = parsed.mobile || "";
      }
    } catch {
      // ignore parse errors
    }

    createOrderMutation.mutate(
      {
        products,
        totalAmount: totalAmount,
        address,
        phone,
        bidIds,
      },
      {
        onSuccess: (data) => {
          console.log("Order creation response:", JSON.stringify(data));
          const d = data as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
          const createdOrderId =
            d?.data?._id ||
            d?.data?.id ||
            d?.order?._id ||
            d?.order?.id ||
            d?._id ||
            d?.id;
          if (createdOrderId) {
            setOrderId(createdOrderId);
          } else {
            console.error("Could not extract order ID from response:", data);
            toast.error("Order created but could not get order ID. Please try again.");
            return;
          }
          toast.success(data.message || "Order created successfully!");
          setModalStep("payment");
        },
      }
    );
  };

  const handlePaymentContinue = (paymentMethod: string) => {
    setSelectedPaymentMethod(paymentMethod);
    setModalStep("bank-details");
  };

  const handleBackToPayment = () => {
    setModalStep("payment");
  };

  const handleConfirmTransfer = () => {
    if (!orderId) {
      toast.error("Order ID is missing. Please try checking out again.");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Payment method is missing. Please go back and select one.");
      return;
    }

    createTransactionMutation.mutate(
      {
        order: orderId,
        amount: totalAmount,
        paymentMethod: paymentMethodMap[selectedPaymentMethod] || selectedPaymentMethod,
      },
      {
        onSuccess: () => {
          toast.success("Transaction confirmed successfully!");
          setModalStep(null);
          setOrderId("");
          setSelectedPaymentMethod("");
          onTransactionSuccess?.();
        },
      }
    );
  };

  const handleCloseModal = () => {
    if (!createTransactionMutation.isPending) {
      setModalStep(null);
    }
  };

  return (
    <div className="w-full md:w-[50%] bg-[#fefefe] h-fit shadow-md my-8 rounded-[5px] mx-auto">
      <p className="font-montserrat font-normal text-[15px] text-[#2b2b2b] p-4">
        Summary
      </p>
      <div className="w-full border-t border-dashed border-[#808080]"></div>

      {hasSelection ? (
        <>
          <div className="flex items-center justify-between w-full px-4 pt-4 pb-2">
            <span className="font-montserrat font-normal text-[13px] text-[#808080]">
              Products Subtotal
            </span>
            <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
              ₦{productsSubtotal.toLocaleString()}
            </span>
          </div>
          {localTransportTotal > 0 && (
            <div className="flex items-center justify-between w-full px-4 pb-2">
              <span className="font-montserrat font-normal text-[13px] text-[#808080]">
                Local Transport
              </span>
              <span className="font-montserrat font-normal text-[13px] text-[#2b2b2b]">
                ₦{localTransportTotal.toLocaleString()}
              </span>
            </div>
          )}
          <div className="w-full h-[1px] bg-[#e0e0e0] mx-4" style={{ width: "calc(100% - 32px)" }}></div>
          <div className="flex items-center justify-between w-full px-4 py-3">
            <span className="font-montserrat font-semibold text-[14px] text-[#2b2b2b]">
              Total
            </span>
            <span className="font-montserrat font-semibold text-[14px] text-[#2b2b2b]">
              ₦{totalAmount.toLocaleString()}
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
        </>
      ) : (
        <div className="flex items-center justify-center w-full py-6">
          <span className="font-montserrat font-normal text-[13px] text-[#808080]">
            Select a product to see price details
          </span>
        </div>
      )}

      <Button
        text={
          createOrderMutation.isPending ? (
            <span className="flex items-center">
              Processing<BouncingDots />
            </span>
          ) : (
            "Checkout"
          )
        }
        onClick={handleCheckoutClick}
        className="justify-center !rounded-[4px] my-4 w-[80%] mx-auto"
        disabled={!hasSelection || createOrderMutation.isPending}
      />

      {/* Step 1: Payment method selection */}
      <Modal isOpen={modalStep === "payment"} onClose={handleCloseModal}>
        <DeliveryDetailsAndPaymentMethod
          totalAmount={totalAmount}
          onContinue={handlePaymentContinue}
        />
      </Modal>

      {/* Step 2: Bank account details + confirm button */}
      <Modal isOpen={modalStep === "bank-details"} onClose={handleCloseModal}>
        <AccountDetails
          onBack={handleBackToPayment}
          onConfirm={handleConfirmTransfer}
          isConfirming={createTransactionMutation.isPending}
        />
      </Modal>

      <PaymentMethod />
    </div>
  );
};
