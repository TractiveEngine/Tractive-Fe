import React from "react";

// Interface for BiddingData items
export interface BiddingItem {
  id: string;
  image: string;
  title: string;
  time: string;
  description: string;
  timeImage: string;
  crownImage: string;
  quantity: string;
  amount: string;
  biddingPrice: string;
}

// Export the static data
export const BiddingData: BiddingItem[] = [
  {
    id: "productCode1001",
    image: "/images/pp_onion.png",
    title: "Pepper",
    time: "24:08:07",
    description: "Introducing the humble and delightful Pepper.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "50 Bags",
    amount: "$400",
    biddingPrice: "$350",
  },
  {
    id: "productCode1002",
    image: "/images/pp_onion.png",
    title: "Tomato",
    time: "12:05:03",
    description: "Fresh and juicy tomatoes for all your needs.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "30 Bags",
    amount: "$250",
    biddingPrice: "$200",
  },
  {
    id: "productCode1003",
    image: "/images/pp_onion.png",
    title: "Maize",
    time: "18:15:09",
    description: "High-quality maize for various uses.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "75 Bags",
    amount: "$600",
    biddingPrice: "$550",
  },
  {
    id: "productCode1004",
    image: "/images/pp_onion.png",
    title: "Chicken",
    time: "06:30:45",
    description: "Fresh chicken straight from the farm.",
    timeImage: "/images/redclock.png",
    crownImage: "/images/leadingcrown.png",
    quantity: "20 Bags",
    amount: "$150",
    biddingPrice: "$120",
  },
];
