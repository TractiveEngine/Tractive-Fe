import Image from "next/image";
import React, { useState } from "react";
import { FaCheck, FaAngleLeft } from "react-icons/fa";
import { TruckDetailsAndShipProduct } from "./TruckDetailsAndShipProduct";
import { DeliveryDetailsAndPaymentMethod } from "./DeliveryDetailsAndPaymentMethod";
import { AccountDetails } from "./AccountDetails";
import { TruckItem } from "@/utils/TruckData";
interface ImagePreviewBookingProps {
  item: TruckItem;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isNegotiating: boolean;
  setIsNegotiating: (isNegotiating: boolean) => void;
}

export const ImagePreviewBooking: React.FC<ImagePreviewBookingProps> = ({
  item,
  currentStep,
  setCurrentStep,
  isNegotiating,
  setIsNegotiating,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const steps = ["Select Truck", "Confirm Details", "Payment"];

  const handleBackClick = () => {
    if (isNegotiating) {
      setIsNegotiating(false);
    } else {
      setCurrentStep(Math.max(currentStep - 1, 1));
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
      setIsNegotiating(false);
    }
  };

  // selectedProducts state is already defined above, so this duplicate declaration is removed.

  const renderBookingDetails = () => {
    switch (currentStep) {
      case 1:
        return (
          <TruckDetailsAndShipProduct
            item={item}
            setCurrentStep={setCurrentStep}
            isNegotiating={isNegotiating}
            setIsNegotiating={setIsNegotiating}
            setSelectedProducts={setSelectedProducts}
          />
        );
      case 2:
        return (
          <DeliveryDetailsAndPaymentMethod
            item={item}
            selectedProducts={selectedProducts}
            setCurrentStep={setCurrentStep} // Pass setCurrentStep
          />
        );
      case 3:
        return <AccountDetails />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col sm:flex-col lg:flex-row gap-4 w-full mb-4">
      <div className="w-full lg:w-[100%] h-auto">
        <Image
          src={item.image}
          alt={item.truckName}
          width={979}
          height={602}
          className="object-cover w-full h-[100%] rounded-md"
          sizes="(max-width: 639px) 100vw, (max-width: 767px) 100vw, (max-width: 1023px) 60vw, 66vw"
        />
      </div>

      {/* Booking Summary */}
      <div className="flex flex-col h-[562px] w-[100%] lg:w-3/5 rounded-md shadow-md bg-[#fefefe]">
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-5 pt-4">
            {currentStep === 1 && !isNegotiating ? (
              <span className="text-[12px] sm:text-[13px] md:text-[14px] text-[#2b2b2b] font-montserrat font-normal">
                Summary
              </span>
            ) : (
              <button
                onClick={handleBackClick}
                className="flex items-center gap-1 text-[12px] sm:text-[13px] md:text-[14px] text-[#538e53] font-montserrat font-normal hover:text-[#3a6b3a] transition-colors cursor-pointer"
              >
                <FaAngleLeft className="w-3 h-3" />
                Back
              </button>
            )}
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <span
                    className={`relative rounded-full w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-colors flex items-center justify-center cursor-pointer ${
                      index + 1 <= currentStep
                        ? "bg-[#538e53] border-2 border-[#538e53]"
                        : "bg-[#D9D9D9] border-2 border-[#D9D9D9]"
                    }`}
                    onClick={() => handleStepClick(index + 1)}
                    title={step}
                  >
                    {index + 1 <= currentStep && (
                      <FaCheck className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                    )}
                  </span>
                  {index < steps.length - 1 && (
                    <span
                      className={`w-4 h-[2px] sm:w-5 sm:h-[2px] transition-colors ${
                        index + 1 < currentStep
                          ? "bg-[#538e53]"
                          : "bg-[#D9D9D9]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          {renderBookingDetails()}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewBooking;
