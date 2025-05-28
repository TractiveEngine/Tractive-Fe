import React from "react";
import { WonBidding } from "./WonBidding";
import { BiddingProduct } from "./BiddingProduct";

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
  biddingPrice: string;
};

type MyBidingProps = {
  data: BiddingData[];
};

export const MyBiding: React.FC<MyBidingProps> = ({ data }) => {
  return (
    <div>
      <WonBidding />
      <BiddingProduct data={data} />
    </div>
  );
};
