"use client";
import React, { useState, useEffect } from "react";
import { StarIcon, YellowStarIcon } from "@/icons/Icons";
import { LocationIcon } from "@/icons/Icon1";
import Image from "next/image";
import { Negotiate } from "./Negotiate";
import { TruckItem } from "@/utils/TruckData";
import { useTransportReadyOrders } from "@/hooks/queries/useOrderQueries";

interface TruckDetailsAndShipProductProps {
  item: TruckItem;
  setCurrentStep: (step: number) => void;
  isNegotiating: boolean;
  setIsNegotiating: (isNegotiating: boolean) => void;
  setSelectedProducts: (products: string[]) => void;
  setAllProducts: (products: DisplayProduct[]) => void;
}

// Shape of a product within an order from the API
interface OrderProduct {
  product: string | {
    _id: string;
    name: string;
    images?: string[];
    quantity?: number;
    unit?: string;
    unitWeightKg?: number | null;
    price?: number;
  };
  quantity: number;
  unitPrice?: number | null;
  localTransportRequired?: boolean;
  localTransportFee?: number;
  _id: string;
}

// Shape of an order from the API
interface TransportOrder {
  _id: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  transportStatus: string;
  [key: string]: unknown;
}

// Flattened product for display
export interface DisplayProduct {
  id: string; // order product _id
  orderId: string;
  productId: string; // actual product _id
  name: string;
  image: string;
  weight: string;
  weightNum: number; // total weight in kg
  quantity: number;
  unitWeightKg: number;
  orderTotalAmount: number; // use order.totalAmount, not lineSubtotal
}

function flattenOrderProducts(orders: TransportOrder[]): DisplayProduct[] {
  const items: DisplayProduct[] = [];
  for (const order of orders) {
    for (const op of order.products) {
      const prod = typeof op.product === "object" ? op.product : null;
      const unitWeightKg = prod?.unitWeightKg || 0;
      const totalWeightKg = unitWeightKg > 0 ? unitWeightKg : op.quantity;
      items.push({
        id: op._id,
        orderId: order._id,
        productId: prod?._id || (typeof op.product === "string" ? op.product : ""),
        name: prod?.name || `Order #${order._id.slice(-6)}`,
        image: prod?.images?.[0] || "/images/placeholder.png",
        weight: `${totalWeightKg.toLocaleString()}kg`,
        weightNum: totalWeightKg,
        quantity: op.quantity,
        unitWeightKg,
        orderTotalAmount: order.totalAmount,
      });
    }
  }
  return items;
}

export const TruckDetailsAndShipProduct: React.FC<
  TruckDetailsAndShipProductProps
> = ({
  item,
  setCurrentStep,
  isNegotiating,
  setIsNegotiating,
  setSelectedProducts,
  setAllProducts,
}) => {
  const [selectedProductsState, setSelectedProductsState] = useState<string[]>(
    []
  );

  const { data: ordersData, isLoading: isOrdersLoading } = useTransportReadyOrders();

  const orders: TransportOrder[] = (() => {
    if (!ordersData) return [];
    // Handle both { data: [...] } and direct array responses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = ordersData as any;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.data)) return d.data;
    if (Array.isArray(d?.orders)) return d.orders;
    return [];
  })();

  const products = flattenOrderProducts(orders);

  // Sync products to parent for step 2
  useEffect(() => {
    setAllProducts(products);
  }, [orders.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate total weight of selected products
  const totalWeight = selectedProductsState.reduce((total, productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? total + product.weightNum : total;
  }, 0);

  // Use numeric fields from the truck data
  const pricePerKg = item.pricePerKg || 0;
  const capacityKg = item.capacityKg || 0;
  const remainingCapacityKg = item.remainingCapacityKg ?? capacityKg;

  // Calculate transport cost based on weight and truck's price per kg
  const transportCost = totalWeight * pricePerKg;

  const isEmptyTruck = remainingCapacityKg >= capacityKg;
  const isTruckFull = remainingCapacityKg <= 0 || totalWeight > remainingCapacityKg;

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
          products={products}
          item={item}
          onBidSent={() => setIsNegotiating(false)}
        />
      ) : (
        <>
          {/* === I want to ship ==== */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex flex-col gap-1 sm:gap-2 px-4 sm:px-5">
              {/* <SearchIcon stroke="#2b2b2b" className="w-4 h-4 sm:w-5 sm:h-5" /> */}
              <span className="font-montserrat text-[13px] sm:text-[12px] md:text-[13px] text-[#2b2b2b] font-bold">
                I want to ship
              </span>
            </div>

            {isOrdersLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-[#538e53] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <p className="font-montserrat text-[11px] sm:text-[12px] text-[#808080] text-center py-4 px-4">
                No orders ready for transport.
              </p>
            ) : (
              <div className="flex flex-col gap-2 sm:gap-3 px-4 sm:px-5">
                {products.map((product) => {
                  const isSelected = selectedProductsState.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductToggle(product.id)}
                      className={`flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 cursor-pointer rounded-md border transition-colors ${
                        isSelected
                          ? "bg-[#538e53] border-[#538e53]"
                          : "border-[#e2e2e2] hover:border-[#538e53] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={65}
                          height={40}
                          className="object-cover w-12 h-8 sm:w-14 sm:h-9 md:w-16 md:h-10 rounded flex-shrink-0"
                          sizes="(max-width: 639px) 48px, (max-width: 767px) 56px, 64px"
                        />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span
                            className={`font-montserrat text-[11px] sm:text-[12px] font-medium truncate ${
                              isSelected ? "text-[#fefefe]" : "text-[#2b2b2b]"
                            }`}
                          >
                            {product.name}
                          </span>
                          <span
                            className={`font-montserrat text-[9px] sm:text-[10px] font-normal ${
                              isSelected ? "text-[#d4ecd4]" : "text-[#808080]"
                            }`}
                          >
                            {product.quantity} units{product.unitWeightKg > 0 ? ` · ${product.unitWeightKg}kg total` : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                        <span
                          className={`font-montserrat text-[10px] sm:text-[11px] lg:text-[12px] font-medium whitespace-nowrap ${
                            isSelected ? "text-[#fefefe]" : "text-[#2b2b2b]"
                          }`}
                        >
                          {product.weight}
                        </span>
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => handleProductToggle(product.id)}
                          className="custom-radio"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <span className="w-full h-[1px] bg-[#e2e2e2]" />

          <div className="flex flex-col gap-3 w-full px-4 sm:px-5 pb-3">
            <div className="flex flex-col gap-1">
              <p className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#808080] font-normal">
                Total Weight: <span className="text-[#2b2b2b]">{totalWeight.toLocaleString()}kg</span>
              </p>
              <p className="font-montserrat text-[11px] sm:text-[12px] md:text-[13px] text-[#808080] font-normal">
                Transport Cost: <span className="text-[#2b2b2b]">₦{transportCost.toLocaleString()}</span>
                <span className="text-[#808080]"> (₦{pricePerKg}/kg)</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={
                  isTruckFull || selectedProductsState.length === 0
                    ? undefined
                    : handleNegotiateClick
                }
                disabled={isTruckFull || selectedProductsState.length === 0}
                className={`font-montserrat text-[12px] sm:text-[13px] md:text-[14px] font-normal px-4 py-2 rounded-[6px] border transition duration-200 ease-in-out ${
                  isTruckFull || selectedProductsState.length === 0
                    ? "border-[#d0d0d0] text-[#808080] cursor-not-allowed bg-[#f5f5f5]"
                    : "border-[#538e53] text-[#538e53] cursor-pointer hover:bg-[#538e53] hover:text-[#fefefe]"
                }`}
              >
                {isTruckFull ? "Not enough space" : "Negotiate"}
              </button>
              <button
                type="button"
                onClick={handlePayClick}
                disabled={selectedProductsState.length === 0 || isTruckFull}
                className={`font-montserrat text-[12px] sm:text-[13px] md:text-[14px] font-normal px-6 py-2 rounded-[6px] transition duration-200 ease-in-out ${
                  selectedProductsState.length === 0 || isTruckFull
                    ? "opacity-50 cursor-not-allowed bg-[#b8becd] text-[#022702]"
                    : "bg-[#538e53] hover:bg-[#3a6b3a] cursor-pointer text-[#fefefe]"
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
