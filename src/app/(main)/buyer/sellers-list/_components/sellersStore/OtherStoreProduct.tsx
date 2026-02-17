import BidingCard from "@/components/cards/BidingCard";
import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface OtherStoreProductProps {
  products?: any[];
  isLoading: boolean;
}

export const OtherStoreProduct: React.FC<OtherStoreProductProps> = ({
  products = [],
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto py-6">
        <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
          Others
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
               <Skeleton className="w-full h-[200px] rounded-lg" />
               <Skeleton className="w-[80%] h-4" />
               <Skeleton className="w-[50%] h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
      return (
          <div className="w-[90%] mx-auto py-6">
               <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
                Others
              </p>
              <div className="text-gray-500 text-sm">No products found for this seller.</div>
          </div>
      )
  }

  return (
    <div className="w-[90%] mx-auto py-6">
      <p className="text-[15px] text-[#141414] font-normal font-montserrat mb-4">
        Others
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product: any) => (
          <BidingCard
            id={product._id}
            key={product._id}
            image={product.images?.[0] || "/images/placeholder.png"}
            title={product.name}
            time="24:08:07" // Placeholder
            description={product.description}
            timeImage="/images/redclock.png"
            crownImage="/images/leadingcrown.png"
            leadingProfileImage="/images/profile1.png"
            quantity={`${product.quantity} ${product.unit}`}
            amount={`₦${product.price?.toLocaleString()}`}
            biddingPrice={`₦${product.price?.toLocaleString()}`} // Using same price for now
            bottomLabel="Price:"
            showLeadingImages={false}
            imageClass="h-[200px] object-cover"
          />
        ))}
      </div>
    </div>
  );
};
