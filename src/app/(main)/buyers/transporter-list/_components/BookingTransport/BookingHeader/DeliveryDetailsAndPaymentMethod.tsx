import React, { useState } from "react";
import { TruckItem } from "@/utils/TruckData";
import Image from "next/image";
import { Button } from "@/components/Button";

interface OnboardingData {
  state: string;
  CAC: string;
  address: string;
  mobile: string;
  alternativeMobile: string;
  businessName: string;
  interests: string[];
}

interface DeliveryDetailsAndPaymentMethodProps {
  selectedProducts: string[];
  item: TruckItem;
  setCurrentStep: (step: number) => void; // Added to update step
}

interface Product {
  id: string;
  name: string;
  weight: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
}

const products: Product[] = [
  { id: "12346DRTDF", name: "Tomatoes, best at...", weight: "55kg" },
  { id: "12347DRTDF", name: "Tomatoes, best at...", weight: "15kg" },
  { id: "12348DRTDF", name: "Tomatoes, best at...", weight: "45kg" },
  { id: "12349DRTDF", name: "Tomatoes, best at...", weight: "85kg" },
];

const paymentMethods: PaymentMethod[] = [
  { id: "card", name: "Pay by Card", image: "/images/card.png" },
  { id: "deposit", name: "Pay by Deposit", image: "/images/deposit.png" },
  { id: "transfer", name: "Pay by Transfer", image: "/images/transfer.png" },
  { id: "cheque", name: "Pay by Cheque", image: "/images/cheque.png" },
];

export const DeliveryDetailsAndPaymentMethod: React.FC<
  DeliveryDetailsAndPaymentMethodProps
> = ({ selectedProducts, item, setCurrentStep }) => {
  // State for selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  // Fetch onboarding data from local storage
  const onboardingData: OnboardingData | null = (() => {
    try {
      const data = localStorage.getItem("onboarding-data");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error parsing onboarding-Data:", error);
      return null;
    }
  })();

  // Calculate total weight of selected products
  const totalWeight = selectedProducts.reduce((total, productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return total + parseFloat(product.weight.replace("kg", ""));
    }
    return total;
  }, 0);

  // Calculate total amount based on amountPerKg
  const totalAmount =
    totalWeight * parseFloat(String(item.amountPerKg).replace("$", ""));

  // Handle payment method toggle
  const handlePaymentMethodToggle = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleContinueClick = () => {
    if (selectedPaymentMethod) {
      // Store selected payment method if needed (e.g., for AccountDetails)
      try {
        localStorage.setItem("selected-payment-method", selectedPaymentMethod);
      } catch (error) {
        console.error("Error saving selected-payment-method:", error);
      }
      setCurrentStep(3); // Move to AccountDetails
    }
  };

  return (
    <div className="flex flex-col gap-2 py-3 rounded-md">
      <style jsx>{`
        .custom-radio {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 1px solid #2b2b2b;
          border-radius: 50%;
          position: relative;
          cursor: pointer;
        }
        .custom-radio:checked::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: #fefefe;
          border-radius: 50%;
        }
        .custom-radio:checked {
          border-color: #fefefe;
        }
      `}</style>

      {/* Onboarding Data */}
      <div className="flex flex-col gap-2 px-5">
        {onboardingData ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between ">
              <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
                State:{" "}
                <span className="text-[#2b2b2b]">{onboardingData.state}</span>
              </p>
              <span className="font-montserrat text-[11px] sm:text-[12px] text-[#538e53] font-medium cursor-pointer">
                Change Address
              </span>
            </div>
            <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
              Delivery name:{" "}
              <span className="text-[#2b2b2b]">
                {onboardingData.businessName}
              </span>
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
                Mobile:{" "}
                <span className="text-[#2b2b2b]">{onboardingData.mobile}</span>
              </p>
              <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
                Alternative:{" "}
                <span className="text-[#2b2b2b]">
                  {onboardingData.alternativeMobile}
                </span>
              </p>
            </div>
            <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
              House Address:{" "}
              <span className="text-[#2b2b2b]">{onboardingData.address}</span>
            </p>
          </div>
        ) : (
          <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
            No onboarding data available.
          </p>
        )}
      </div>

      <span className="w-full h-[1px] bg-[#e2e2e2]" />

      {/* Total Weight and Amount */}
      <div className="flex flex-col gap-2 px-5">
        <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
          Total: <span className="text-[#2b2b2b]">{totalWeight}kg</span>
        </p>
        <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] font-normal">
          Amount:
          <span className="text-[#2b2b2b]"> ${totalAmount.toFixed(2)}</span>
        </p>
      </div>
      <span className="w-full h-[1px] bg-[#e2e2e2]" />
      {/* Payment Method */}
      <div className="flex flex-col gap-2 px-5">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#2b2b2b] font-normal">
            Select a Payment Method
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handlePaymentMethodToggle(method.id)}
              className={`flex items-center border-[1px] border-[#808080] px-2 sm:px-3 py-2 sm:py-3 cursor-pointer rounded-md transition-colors ${
                selectedPaymentMethod === method.id
                  ? "bg-[#538e53]"
                  : "hover:bg-[#f5f5f5]"
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 w-[70%]">
                <input
                  type="radio"
                  name="payment-method"
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => handlePaymentMethodToggle(method.id)}
                  className="custom-radio"
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-2 w-[100%]">
                <Image
                  src={method.image}
                  alt={method.name}
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <span
                  className={`font-montserrat text-[10px] sm:text-[11px] text-[#2b2b2b] font-normal ${
                    selectedPaymentMethod === method.id ? "text-[#fefefe]" : ""
                  }`}
                >
                  {method.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <Button
          text="Continue"
          onClick={handleContinueClick}
          className="justify-center"
          disabled={!selectedPaymentMethod}
        />
      </div>
    </div>
  );
};
