// page.tsx
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { MyBids } from "./_components/MyBids";
import { BidsCheckout } from "./_components/BidsCheckout";
import { MyFleetBids } from "./_components/MyFleetBids";
import { useWonBidsCheckout } from "@/hooks/queries/useBidQueries";
import { BidResponse } from "@/services/bidService";

interface BidItem {
  id: string;
  title: string;
  quantity: string;
  seller: string;
  price: number;
  imageSrc: string;
}

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"product-bids" | "fleet-bids">(
    tabParam === "fleet-bids" ? "fleet-bids" : "product-bids"
  );
  const { data: checkoutData, isLoading, isFetching } = useWonBidsCheckout();
  const [bidItems, setBidItems] = useState<BidItem[]>([]);
  const isRefetching = isFetching && !isLoading;

  const bids = useMemo(() => checkoutData?.bids || [], [checkoutData?.bids]);

  const handleTransactionSuccess = () => {
    setSelection({ isCheckoutAll: false, selectedBids: [] });
  };

  useEffect(() => {
    if (bids.length > 0) {
      const mappedItems: BidItem[] = bids.map((item: BidResponse) => {
        let sellerName = "Unknown Seller";
        if (typeof item.agent === "object" && item.agent !== null) {
          sellerName = item.agent.name;
        } else if (
          typeof item.product.farmer === "object" &&
          item.product.farmer !== null
        ) {
          sellerName = item.product.farmer.name;
        }

        return {
          id: item._id,
          title: item.product.name,
          quantity: `${item.product.quantity} ${item.product.unit}`,
          seller: sellerName,
          price: item.amount,
          imageSrc: item.product.images[0] || "/images/placeholder.png",
        };
      });
      setBidItems(mappedItems);
    } else {
      setBidItems([]);
    }
  }, [bids]);

  const [selection, setSelection] = useState<{
    isCheckoutAll: boolean;
    selectedBids: string[];
  }>({ isCheckoutAll: false, selectedBids: [] });

  const handleSelectionChange = (
    isCheckoutAll: boolean,
    selectedBids: string[]
  ) => {
    setSelection({ isCheckoutAll, selectedBids });
  };

  return (
    <div className="w-full bg-[#f1f1f1] min-h-screen flex justify-center">
      <div className="flex flex-col w-[90%] max-w-[1200px] mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-0 mt-6 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab("product-bids")}
            className={`px-5 py-2.5 font-montserrat text-[13px] sm:text-[14px] font-medium rounded-tl-[6px] rounded-bl-[6px] border transition-colors cursor-pointer ${
              activeTab === "product-bids"
                ? "bg-[#538e53] text-[#fefefe] border-[#538e53]"
                : "bg-[#fefefe] text-[#2b2b2b] border-[#e2e2e2] hover:bg-[#f5f5f5]"
            }`}
          >
            Product Bids
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fleet-bids")}
            className={`px-5 py-2.5 font-montserrat text-[13px] sm:text-[14px] font-medium rounded-tr-[6px] rounded-br-[6px] border border-l-0 transition-colors cursor-pointer ${
              activeTab === "fleet-bids"
                ? "bg-[#538e53] text-[#fefefe] border-[#538e53]"
                : "bg-[#fefefe] text-[#2b2b2b] border-[#e2e2e2] hover:bg-[#f5f5f5]"
            }`}
          >
            Fleet Bids
          </button>
        </div>

        {/* Content */}
        {activeTab === "product-bids" ? (
          isLoading ? (
            <div className="w-full flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <MyBids
                bidItems={bidItems}
                selection={selection}
                setSelection={handleSelectionChange}
                isRefetching={isRefetching}
              />
              <BidsCheckout
                productsSubtotal={checkoutData?.productsSubtotal ?? 0}
                localTransportTotal={checkoutData?.localTransportTotal ?? 0}
                totalAmount={checkoutData?.totalAmount ?? 0}
                hasSelection={
                  selection.isCheckoutAll || selection.selectedBids.length > 0
                }
                selectedBidIds={
                  selection.isCheckoutAll
                    ? bidItems.map((item) => item.id)
                    : selection.selectedBids
                }
                checkoutData={bids}
                onTransactionSuccess={handleTransactionSuccess}
              />
            </div>
          )
        ) : (
          <MyFleetBids />
        )}
      </div>
    </div>
  );
};

export default Page;
