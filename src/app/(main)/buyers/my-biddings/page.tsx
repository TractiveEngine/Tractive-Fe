// page.tsx
"use client";
import React, { useState } from "react";
import { MyBids } from "./_components/MyBids";
import { BidsCheckout } from "./_components/BidsCheckout";

interface BidItem {
  id: string;
  title: string;
  quantity: string;
  seller: string;
  price: number;
  imageSrc: string;
}

const Page: React.FC = () => {
  const [bidItems] = useState<BidItem[]>([
    {
      id: "bid-1",
      title: "Mix color Nigeria beans, best for nursing mother teenagers and",
      quantity: "50 bags",
      seller: "Kelvin chikezie",
      price: 400,
      imageSrc: "/images/biddingwon.png",
    },
    {
      id: "bid-2",
      title: "Organic brown rice, high fiber content",
      quantity: "30 bags",
      seller: "Amara Okeke",
      price: 600,
      imageSrc: "/images/biddingwon.png",
    },
    {
      id: "bid-3",
      title: "Premium white garri, fortified with vitamins",
      quantity: "20 bags",
      seller: "Chidi Nwosu",
      price: 350,
      imageSrc: "/images/biddingwon.png",
    },
  ]);

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
