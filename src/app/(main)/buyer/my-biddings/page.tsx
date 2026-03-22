// page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { MyBids } from "./_components/MyBids";
import { BidsCheckout } from "./_components/BidsCheckout";
import { useWonBidsCheckout } from "@/hooks/queries/useBidQueries"; // Import hook
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
  const { data: checkoutData, isLoading } = useWonBidsCheckout();
  const [bidItems, setBidItems] = useState<BidItem[]>([]);

  useEffect(() => {
    if (checkoutData) {
      const mappedItems: BidItem[] = checkoutData.map((item: BidResponse) => {
        let sellerName = "Unknown Seller";
        if (typeof item.agent === 'object' && item.agent !== null) {
            sellerName = item.agent.name;
        } else if (typeof item.product.farmer === 'object' && item.product.farmer !== null) {
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
    }
  }, [checkoutData]);


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

  const getTotalPrice = (): number => {
    if (selection.isCheckoutAll) {
      return bidItems.reduce((total, item) => total + item.price, 0);
    }
    return bidItems
      .filter((item) => selection.selectedBids.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#f1f1f1]  h-fit flex justify-center items-center">
         <div className="w-8 h-8 border-4 border-[#538e53] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f1f1f1] min-h-screen flex justify-center">
      <div className="flex flex-col md:flex-row gap-6 w-[90%] max-w-[1200px] mx-auto">
        <MyBids
          bidItems={bidItems}
          selection={selection}
          setSelection={handleSelectionChange}
        />
        <BidsCheckout
          totalPrice={getTotalPrice()}
          hasSelection={
            selection.isCheckoutAll || selection.selectedBids.length > 0
          }
        />
      </div>
    </div>
  );
};

export default Page;
