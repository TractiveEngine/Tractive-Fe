"use client";

import BidingCard from "@/components/cards/BidingCard";
import React from "react";
import { useGetRecommendations } from "@/hooks/queries/useProductQueries";
import { RecommendationProduct } from "@/services/productService";

export const Recommendation = () => {
  const { data: recommendationsResponse, isLoading } = useGetRecommendations();
  // Depending on what the backend exactly returns, it could be either array type
  const recommendations = recommendationsResponse?.data || [];

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Recommendations
      </p>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[280px] sm:min-w-[320px] h-80 bg-gray-200 animate-pulse rounded-lg snap-start" />
          ))
        ) : recommendations.length > 0 ? (
          recommendations.map((product: any) => (
            <div key={product.id || product._id} className="min-w-[280px] sm:min-w-[320px] snap-start">
              <BidingCard
              key={product.id || product._id}
              id={product.id || product._id}
              image={product.images?.[0] || "/images/tomatoes.png"}
              title={product.name}
              time="24h" // Fallback since actual API might not have this for non-bidding
              description={`${product.quantity} ${product.unit || 'units'} available from ${product.owner?.name || product.farmer?.name || 'Seller'}`}
              timeImage="/images/clock.png" // Placeholder or remove from BidingCard eventually
              crownImage="/images/crown.png"
              leadingProfileImage={product.owner?.image || "/images/sellersProfiles.png"}
              quantity={`${product.quantity} ${product.unit || 'units'}`}
              amount={product.price}
              biddingPrice={product.price} // Fallback to price if not bidding
            />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm font-montserrat col-span-full">
            No recommendations available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};
