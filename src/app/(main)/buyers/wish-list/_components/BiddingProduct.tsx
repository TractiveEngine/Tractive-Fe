import BidingCard from "@/components/cards/BidingCard";
import React from "react";

type BiddingData = {
  id: string;
  image: string;
  title: string;
  time: string;
  description: string;
  timeImage: string;
  crownImage: string;
  quantity: string;
  amount: string;
  bidingPrice: string;
};

type BiddingProductProps = {
  data: BiddingData[];
};

export const BiddingProduct: React.FC<BiddingProductProps> = ({ data }) => {
  return (
    <div className="w-[90%] mx-auto py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((card) => (
          <BidingCard
            id={card.id}
            key={card.id}
            image={card.image}
            title={card.title}
            time={card.time}
            description={card.description}
            timeImage={card.timeImage}
            crownImage={card.crownImage}
            quantity={card.quantity}
            amount={card.amount}
            bidingPrice={card.bidingPrice}
          />
        ))}
      </div>
    </div>
  );
};
