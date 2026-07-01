"use client";
import Image from "next/image";
import React from "react";
import { useAgentMostSoldItems } from "@/hooks/queries/useAgentDashboardQueries";

export const MostSoldItem: React.FC = () => {
  const { data: products, isLoading, isError } = useAgentMostSoldItems(4);

  return (
    <div className="w-full bg-[#fefefe] shadow-md rounded-[4px] pb-4 lg:pb-0.5">
      <div className="flex items-end justify-between border-b-[1px] border-[#e2e2e2] mb-4">
        <h2 className="font-montserrat text-[#2b2b2b] text-[12px] p-2 rounded-tl-[6px] rounded-br-[6px] font-medium bg-[#cce5cc] flex items-center justify-center w-[40%]">
          Most Sold Item
        </h2>
        <span className="font-montserrat text-[#2b2b2b] text-[12px] pr-6 pb-1.5 font-normal">
          Orders
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-[5px]">
                <span className="h-[33px] w-[44px] rounded-md bg-[#ececec] animate-pulse" />
                <div className="flex flex-col gap-2">
                  <span className="block h-2.5 w-20 rounded bg-[#ececec] animate-pulse" />
                  <span className="block h-2.5 w-16 rounded bg-[#ececec] animate-pulse" />
                </div>
              </div>
              <span className="h-6 w-[4rem] rounded bg-[#ececec] animate-pulse" />
            </div>
          ))
        ) : isError || !products?.length ? (
          <p className="px-4 py-6 text-center text-[11px] font-montserrat text-[#808080]">
            {isError ? "Couldn't load items." : "No sales yet."}
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product.productId}
              className="w-full flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-[5px]">
                <Image
                  src={product.image || "/images/yellowPepper.png"}
                  alt={product.name}
                  width={44}
                  height={33}
                  className="rounded-md object-cover h-[33px] w-[44px]"
                />
                <div className="flex flex-col gap-2">
                  <span className="font-montserrat text-[#2b2b2b] text-[10px] font-normal">
                    {product.name}
                  </span>
                  <span className="font-montserrat text-[#2b2b2b] text-[10px] font-normal truncate">
                    {product.description}
                  </span>
                </div>
              </div>
              <span className="px-4 py-1 w-[4rem] bg-[#f1f1f1] flex items-center justify-center rounded-[4px] whitespace-nowrap text-[10.5px] font-montserrat font-normal text-[#2b2b2b]">
                {product.quantitySold}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
