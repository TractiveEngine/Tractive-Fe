"use client";
import React from "react";
import { SellerCard } from "./SellerCard";
import { useGetSellers } from "@/hooks/queries/useSellerQueries";
import { SellerListSkeleton } from "./SellerListSkeleton";
interface SellerListProps {
  selectedRatings: number[];
  selectedLocations: string[];
  selectedYears: string[];
}

export const SellerList: React.FC<SellerListProps> = ({
  selectedRatings,
  selectedLocations,
  selectedYears,
}) => {
  const { data: sellersData, isLoading, isError } = useGetSellers();

  if (isLoading) {
    return <SellerListSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full text-center py-10 text-red-500">
        Failed to load sellers. Please try again later.
      </div>
    );
  }

  const sellers = (sellersData || []).map((seller) => ({
    id: seller.sellerId,
    image: "/images/bidder3.png",
    sellerName: seller.name,
    rating: 4.0,
    rateStatus: "Excellent",
    sellerYear: "1",
    customerNumber: 0,
    sellerBio: "No bio available",
    location: "Lagos",
  }));

  const filteredSellers = sellers.filter((seller) => {
    const matchesRating =
      selectedRatings.length === 0 || selectedRatings.includes(seller.rating);
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(seller.location);
    const matchesYears =
      selectedYears.length === 0 ||
      selectedYears.includes(
        parseInt(seller.sellerYear) <= 5 ? "1-5 Years" : "6-10 Years"
      );
    return matchesRating && matchesLocation && matchesYears;
  });

  return (
    <div className="flex flex-col w-full sm:w-2/3 lg:w-[95%] gap-4 bg-[#fefefe] h-auto rounded-lg">
      <div className="flex flex-col justify-center gap-4 w-full px-4   pt-6 bg-[#fefefe]">
        <input
          type="text"
          placeholder="Search for sellers"
          className="w-full max-w-none sm:max-w-[400px] p-2 border border-[#808080] rounded-md text-[#2b2b2b] placeholder-[#808080] focus:outline-none focus:ring-[1px] focus:ring-[#538e53] focus:border-transparent text-[12px] sm:text-[14px]"
        />
        <p className="mt-2 text-[14px] sm:text-[17px] font-normal font-montserrat text-[#808080]">
          Connect with Sellers
        </p>
      </div>
      <div className="Seller_Card">
        {filteredSellers.length > 0 ? (
            filteredSellers.map((seller) => (
            <SellerCard
                key={seller.id}
                id={seller.id}
                image={seller.image}
                sellerName={seller.sellerName}
                rating={seller.rating}
                rateStatus={seller.rateStatus}
                sellerYear={seller.sellerYear}
                customerNumber={seller.customerNumber}
                sellerBio={seller.sellerBio}
            />
            ))
        ) : (
            <div className="w-full text-center py-10 text-gray-500">
                No sellers found.
            </div>
        )}
      </div>
    </div>
  );
};
