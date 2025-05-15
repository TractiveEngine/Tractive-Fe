import BidingCard from "@/components/cards/BidingCard";
import React from "react";

export const biddingData = [
  {
    id: "productCode1244",
    image: "/images/pp_onion.png",
    title: "Pepper",
    time: "24:08:07",
    description: "Introducing the humble and delightful Pepper.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "50 Bags",
    amount: "$400",
    bidingPrice: "$350",
  },
  {
    id: "productCode1245",
    image: "/images/pp_onion.png",
    title: "Tomato",
    time: "12:05:03",
    description: "Fresh and juicy tomatoes for all your needs.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "30 Bags",
    amount: "$250",
    bidingPrice: "$200",
  },
  {
    id: "productCode1246",
    image: "/images/pp_onion.png",
    title: "Maize",
    time: "18:15:09",
    description: "High-quality maize for various uses.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "75 Bags",
    amount: "$600",
    bidingPrice: "$550",
  },
  {
    id: "productCode1247",
    image: "/images/pp_onion.png",
    title: "Chicken",
    time: "06:30:45",
    description: "Fresh chicken straight from the farm.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "20 Bags",
    amount: "$150",
    bidingPrice: "$120",
  },
];

export const Biding = () => {

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        My Biddings
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {biddingData.map((card) => (
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
            bidingPrice={card.bidingPrice}
          />
        ))}
      </div>
    </div>
  );
};
