import { Skeleton } from "@/components/ui/Skeleton";
import React from "react";

export const SellerListSkeleton = () => {
  return (
    <div className="flex flex-col w-full sm:w-2/3 lg:w-[95%] gap-4 bg-[#fefefe] h-auto rounded-lg">
      <div className="flex flex-col justify-center gap-4 w-full px-4 pt-6 bg-[#fefefe]">
        <Skeleton className="w-full max-w-[400px] h-10 rounded-md" />
        <Skeleton className="w-[150px] h-6 mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="border-[1px] border-[#e0e0e0] w-full rounded-lg p-3 flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-[120px] h-4" />
                <Skeleton className="w-[80px] h-3" />
              </div>
            </div>
            <div className="flex gap-2">
               <Skeleton className="w-[60px] h-5 rounded-full" />
               <Skeleton className="w-[60px] h-5 rounded-full" />
            </div>
             <Skeleton className="w-full h-10 rounded-[100px] mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
