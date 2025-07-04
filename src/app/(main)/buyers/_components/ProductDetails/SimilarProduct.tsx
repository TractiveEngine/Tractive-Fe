import BidingCard from "@/components/cards/BidingCard";
import React from "react";
import { BiddingData } from "../../BiddingDatas";

export const SimilarProduct = () => {

  return (
    <div className="py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Similar Items
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {BiddingData.map((card) => (
          <BidingCard
            id={card.id}
            key={card.id}
            image={card.image}
            title={card.title}
            time={card.time}
            description={card.description}
            timeImage={card.timeImage}
            crownImage={card.crownImage}
            leadingProfileImage={card.leadingProfileImage}
            quantity={card.quantity}
            amount={card.amount}
            biddingPrice={card.biddingPrice}
          />
        ))}
      </div>
    </div>
  );
};
