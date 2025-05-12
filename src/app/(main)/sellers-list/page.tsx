import React from "react";
import { SellerCard } from "./_components/SellerCard";

const page = () => {
  return (
    <div className="w-[100%] bg-[#fefefe]">
      <div className="w-[90%] mx-auto">
        <div className="flex flex-col justify-center w-full h-full p-4 bg-[#fefefe]">
          <h1 className="text-2xl font-bold">Sellers</h1>
          <p className="mt-2 text-gray-700">List of sellers available.</p>
        </div>
        <div className="flex items-center justify-between w-full h-full p-4">
          <SellerCard
            image="/images/bidder3.png"
            sellerName="GIG Logistics"
            rating={4.5}
            rateStatus="Excellent"
            sellerYear="5"
            customerNumber={3000}
            sellerBio="Given you the best ride ever than you can imagine."
          />
          <SellerCard
            image="/images/bidder3.png"
            sellerName="GIG Logistics"
            rating={4.5}
            rateStatus="Excellent"
            sellerYear="5"
            customerNumber={3000}
            sellerBio="Given you the best ride ever than you can imagine."
          />
          <SellerCard
            image="/images/bidder3.png"
            sellerName="GIG Logistics"
            rating={4.5}
            rateStatus="Excellent"
            sellerYear="5"
            customerNumber={3000}
            sellerBio="Given you the best ride ever than you can imagine."
          />
          <SellerCard
            image="/images/bidder3.png"
            sellerName="GIG Logistics"
            rating={4.5}
            rateStatus="Excellent"
            sellerYear="5"
            customerNumber={3000}
            sellerBio="Given you the best ride ever than you can imagine."
          />
        </div>
      </div>
    </div>
  );
};

export default page;
