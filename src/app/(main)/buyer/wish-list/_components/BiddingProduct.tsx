import BidingCard from "@/components/cards/BidingCard";
import { useMyBids } from "@/hooks/queries/useBidQueries";
import { Skeleton } from "@/components/ui/Skeleton";
import React from "react";

export const BiddingProduct: React.FC = () => {
  const { data: myBids, isLoading, isError } = useMyBids();

  if (isLoading) {
    return (
      <div className="w-[90%] mx-auto py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-[237px]" />
                <div className="p-4 space-y-3">
                   <Skeleton className="h-4 w-20" />
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-4 w-full" />
                   <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[90%] mx-auto py-10 text-center text-red-500 bg-red-50 rounded-md">
        Failed to load your biddings. Please try again later.
      </div>
    );
  }

  if (!myBids || myBids.length === 0) {
    return <div className="text-center py-10 text-gray-500">No biddings found.</div>;
  }

  return (
    <div className="w-[90%] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {myBids?.map((bid) => (
          <BidingCard
            id={bid?.product?._id}
            key={bid?._id}
            image={bid?.product?.images?.[0] || "/images/placeholder.png"}
            title={bid?.product?.name}
            time="24:08:07" // Placeholder as API doesn't provide expiration time yet
            description={bid?.message} // Query: Should we use product description or bid message? User said "list of my biding below". Sticking with message for now as verified.
            timeImage="/images/redclock.png" // Static asset
            crownImage="/images/leadingcrown.png" // Static asset
            leadingProfileImage="/images/profile1.png" // Static asset - API doesn't provide leading bidder image
            quantity={`${bid?.product?.quantity} ${bid?.product?.unit}`}
            
            // Swap amounts:
            // "amount" prop (Main price on card) -> My Bid Amount
            amount={`₦${bid?.amount?.toLocaleString()}`} 
            
            // "biddingPrice" prop (Small bottom price) -> Product Original Price
            biddingPrice={`₦${bid?.product?.price?.toLocaleString()}`} 
            
            // Customizations
            bottomLabel="Price:"
            showLeadingImages={false}
            imageClass="h-[200px] object-cover"
          />
        ))}
      </div>
    </div>
  );
};
