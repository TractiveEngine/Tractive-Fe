"use client";
import React, { useState } from "react";
import { SearchIcon, StarIcon, YellowStarIcon } from "@/icons/Icons";
import { LocationIcon } from "@/icons/Icon1";
import Image from "next/image";
import { Negotiate } from "./Negotiate";
import { TruckItem } from "@/utils/TruckData";

interface Product {
  id: string;
  name: string;
  weight: string;
}

interface TruckDetailsAndShipProductProps {
  item: TruckItem;
  setCurrentStep: (step: number) => void;
  isNegotiating: boolean;
  setIsNegotiating: (isNegotiating: boolean) => void;
  setSelectedProducts: (products: string[]) => void;
}

const products: Product[] = [
  { id: "12346DRTDF", name: "Tomatoes, best at...", weight: "55kg" },
  { id: "12347DRTDF", name: "Tomatoes, best at...", weight: "15kg" },
  { id: "12348DRTDF", name: "Tomatoes, best at...", weight: "45kg" },
  { id: "12349DRTDF", name: "Tomatoes, best at...", weight: "85kg" },
];

export const TruckDetailsAndShipProduct: React.FC<
  TruckDetailsAndShipProductProps
> = ({
  item,
  setCurrentStep,
  isNegotiating,
  setIsNegotiating,
  setSelectedProducts,
}) => {
  const [selectedProductsState, setSelectedProductsState] = useState<string[]>(
    []
  );

  // Calculate total weight of selected products
  const totalWeight = selectedProductsState.reduce((total, productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      return total + parseFloat(product.weight.replace("kg", ""));
    }
    return total;
  }, 0);

  // Calculate total amount
  const totalAmount =
    totalWeight * parseFloat(String(item.amountPerKg).replace("$", ""));

  // Parse spaceRemaining and fullLoad
  const spaceRemainingNum = parseFloat(
    String(item.spaceRemaining).replace("kg", "")
  );
  const fullLoadNum = parseFloat(String(item.fullLoad).replace("$", ""));
  // Infer isEmptyTruck based on whether spaceRemaining equals or exceeds fullLoad
  const isEmptyTruck = spaceRemainingNum >= fullLoadNum;
  // Check if truck has enough space
  const isTruckFull = spaceRemainingNum <= 0 || totalWeight > spaceRemainingNum;

  const handleProductToggle = (productId: string) => {
    setSelectedProductsState((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePayClick = () => {
    if (selectedProductsState.length > 0 && !isTruckFull) {
      setSelectedProducts(selectedProductsState);
      setCurrentStep(2);
      setIsNegotiating(false);
    }
  };

  const handleNegotiateClick = () => {
    if (selectedProductsState.length > 0 && !isTruckFull) {
      setIsNegotiating(true);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 pt-3">
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
      {/* Truck Details */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center flex-wrap flex-1 gap-3 sm:gap-4 px-4 sm:px-5">
          <h3 className="text-[#2b2b2b] text-[13px] sm:text-[14px] md:text-[15px] font-medium font-montserrat">
            {item.truckName}
          </h3>
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <YellowStarIcon />
              <YellowStarIcon />
              <YellowStarIcon />
              <YellowStarIcon />
              <StarIcon />
            </div>
            <span className="font-montserrat font-normal text-[12px] sm:text-[13px] md:text-[14px] text-[#2b2b2b]">
              {item.rating}
            </span>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-1 sm:gap-[4px] px-4 sm:px-5">
          <div className="flex items-center gap-[3px]">
            <LocationIcon />
            <p className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-medium">
              {item.locationFrom} to {item.locationTo}
            </p>
          </div>
          <span className="w-[2px] h-[1rem] bg-[#808080]" />
          <p className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-normal">
            Per Kg: <span className="font-medium">{item.amountPerKg}</span>
          </p>
          <span className="w-[2px] h-[1rem] bg-[#808080]" />
          <p className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-normal">
            Full Load: <span className="font-medium">{item.fullLoad}</span>
          </p>
        </div>

        <div className="w-full bg-[#CCE5CCB2] flex items-center justify-center gap-0.5 p-1 sm:p-[4px]">
          <p
            className={`font-montserrat text-[10px] sm:text-[11px] md:text-[12px] font-normal ${
              isEmptyTruck ? "text-[#8B4513]" : "text-[#2b2b2b]"
            }`}
          >
            {isEmptyTruck ? "Space Remaining:" : "Remaining Space:"}
          </p>
          <span className="font-montserrat text-[10px] sm:text-[11px] md:text-[12px] text-[#2b2b2b] font-normal">
            {item.spaceRemaining}
          </span>
        </div>
      </div>

      {/* Conditional Rendering: Negotiate or Product Selection */}
      {isNegotiating ? (
        <Negotiate
          selectedProducts={selectedProductsState}
          item={item}
          onBack={() => setIsNegotiating(false)}
        />
      ) : (
        <>
          {/* === I want to ship ==== */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col gap-1 sm:gap-2 px-4 sm:px-5">
              <SearchIcon stroke="#2b2b2b" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#2b2b2b] font-normal">
                I want to ship
              </span>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 px-4 sm:px-5">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductToggle(product.id)}
                  className={`flex items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer rounded-md transition-colors ${
                    selectedProductsState.includes(product.id)
                      ? "bg-[#538e53]"
                      : "hover:bg-[#f5f5f5]"
                  }`}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Image
                      src="/images/tomatoProduct.png"
                      alt="Tomato Product"
                      width={65}
                      height={40}
                      className="object-cover w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10"
                      sizes="(max-width: 639px) 48px, (max-width: 767px) 56px, 64px"
                    />
                    <div className="flex flex-col gap-1">
                      <span
                        className={`font-montserrat text-[10px] sm:text-[11px] lg:text-[12px] text-[#2b2b2b] font-normal ${
                          selectedProductsState.includes(product.id)
                            ? "text-[#fefefe]"
                            : ""
                        }`}
                      >
                        {product.name}
                      </span>
                      <span
                        className={`font-montserrat text-[10px] sm:text-[11px] lg:text-[12px] text-[#2b2b2b] font-normal ${
                          selectedProductsState.includes(product.id)
                            ? "text-[#fefefe]"
                            : ""
                        }`}
                      >
                        ID: {product.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      className={`font-montserrat text-[10px] sm:text-[11px] lg:text-[12px] text-[#2b2b2b] font-normal ${
                        selectedProductsState.includes(product.id)
                          ? "text-[#fefefe]"
                          : ""
                      }`}
                    >
                      {product.weight}
                    </span>
                    <input
                      type="radio"
                      checked={selectedProductsState.includes(product.id)}
                      onChange={() => handleProductToggle(product.id)}
                      className="custom-radio"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <span className="w-full h-[1px] bg-[#e2e2e2]" />

          <div className="relative flex items-center justify-between w-full px-4 sm:px-5 pb-3">
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#808080] font-normal">
                Total: <span className="text-[#2b2b2b]">{totalWeight}kg</span>
              </p>
              <span className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#2b2b2b] font-normal">
                Amount: ${totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="absolute bottom-0 right-0 flex flex-col lg:flex-row items-center gap-2 lg:gap-8">
              <span
                className={`font-montserrat text-[11px] sm:text-[12px] md:text-[13px] font-normal ${
                  isTruckFull || selectedProductsState.length === 0
                    ? "text-[#808080] cursor-not-allowed"
                    : "text-[#538e53] cursor-pointer hover:text-[#3a6b3a]"
                }`}
                onClick={
                  isTruckFull || selectedProductsState.length === 0
                    ? undefined
                    : handleNegotiateClick
                }
              >
                {isTruckFull ? "Not enough space" : "Negotiate"}
              </span>
              <button
                type="button"
                onClick={handlePayClick}
                disabled={selectedProductsState.length === 0 || isTruckFull}
                className={`bg-[#538e53] w-24 sm:w-[5rem] h-8 sm:h-9 md:h-10 font-normal text-[12px] sm:text-[13px] md:text-[14px] rounded-tl-[6px] rounded-br-[6px] px-3 sm:px-4 py-1.5 sm:py-2 transition duration-200 ease-in-out ${
                  selectedProductsState.length === 0 || isTruckFull
                    ? "opacity-50 cursor-not-allowed bg-[#b8becd] text-[#022702]"
                    : "hover:bg-[#3a6b3a] cursor-pointer text-[#fefefe]"
                }`}
              >
                Pay
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
