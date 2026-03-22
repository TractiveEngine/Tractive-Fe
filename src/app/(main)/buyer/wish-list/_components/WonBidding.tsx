import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useWonBids } from "@/hooks/queries/useBidQueries";
import { Skeleton } from "@/components/ui/Skeleton";

export const WonBidding = () => {
  const { data: wonBids, isLoading, isError } = useWonBids();

  if (isLoading) {
    return (
      <div className="flex flex-col w-full rounded-lg mt-4">
        <div className="w-[90%] flex flex-col justify-between mx-auto gap-3 mb-4">
          <Skeleton className="h-4 w-32" />
          <div className="w-full grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-auto rounded-md aspect-[2/1]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !wonBids || wonBids.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full rounded-lg mt-4">
      <div className="w-[90%] flex flex-col justify-between mx-auto gap-3 mb-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] sm:text-[14px] md:text-[15px] text-[#141414] font-normal font-montserrat">
            Bidings you won
          </p>
          <Link href="/buyer/my-biddings" className="text-[#538e53] text-sm font-medium hover:underline flex items-center gap-1">
            See All <span className="text-xs">&gt;</span>
          </Link>
        </div>
        <div className="w-full grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6 lg:gap-4">
          {wonBids.map((bid) => (
            <div key={bid._id} className="relative w-full rounded-lg overflow-hidden group shadow-sm bg-white">
              <div className="relative w-full aspect-[2/1]">
                {bid.product.images && bid.product.images.length > 0 ? (
                  <Image
                    src={bid.product.images[0]}
                    alt={bid.product.name}
                    width={258}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-3">
                  <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5 drop-shadow-sm">
                    {bid.product.name}
                  </h3>
                  <p className="text-gray-200 text-[10px] sm:text-xs line-clamp-1 drop-shadow-sm">
                    {bid.product.description || bid.message || "Introducing the humble..."}
                  </p>
                </div>
              </div>
              <Link
                href="/buyer/my-biddings"
                className="block w-full bg-[#538e53] text-white text-xs sm:text-sm font-medium text-center py-2 hover:bg-[#437a43] transition-colors"
                style={{ borderRadius: "0 0 8px 8px" }}
              >
                Check Out
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};