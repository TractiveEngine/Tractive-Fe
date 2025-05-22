import BidingCard from "@/components/cards/BidingCard";
import React from "react";
import { BiddingData } from "../../BiddingDatas";

export const Biding = () => {

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        My Biddings
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {BiddingData.map((card) => (
          <BidingCard
            key={card.id}
            id={card.id}
            image={card.image}
            title={card.title}
            time={card.time}
            description={card.description}
            timeImage={card.timeImage}
            crownImage={card.crownImage}
            quantity={card.quantity}
            amount={card.amount}
            bidingPrice={card.biddingPrice}
          />
        ))}
      </div>
    </div>
  );
};
